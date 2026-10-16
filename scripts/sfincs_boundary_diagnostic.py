#!/usr/bin/env python3
"""Move the pilot's artificial dry west edge two DEM cells as a diagnostic.

This is a boundary-sensitivity experiment, not a physical flood scenario.
All source-derived outputs remain under ignored output/sfincs-boundary-diagnostic/.
"""

from __future__ import annotations

import argparse
import csv
import json
import os
import subprocess
import time
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import rasterio
import shapefile
from netCDF4 import Dataset
from rasterio.features import geometry_mask
from rasterio.windows import from_bounds

from sfincs_pilot import BARANGAYS, DEM, ROOT, SELECTED, SOURCE, TREF, file_sha256, plot_lines, plot_polygons, read_shapes


OUT = ROOT / "output/sfincs-boundary-diagnostic"
BOUNDS = (237700, 2009000, 243300, 2013400)  # Same area plus two DEM cells west
EXPECTED_BINARY_SHA256 = "72b05c4922ef12c686ea6ea17654ccaf7dad292118d71126b22e5432d8c5cacf"
CREEKS = SOURCE / "Irrigation map, creeks, & canal/Creeks/Creeks.shp"
EMPTY_CREEKS = SOURCE / "Drainage/Creeks/creeks.shp"
MAIN_CANALS = SOURCE / "Drainage/Main Canals/urban main canals.shp"
URBAN_CANALS = SOURCE / "Drainage/Urban Canals/urban canals.shp"


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--sfincs", required=True, type=Path)
    args = parser.parse_args()
    binary_sha256 = file_sha256(args.sfincs)
    if binary_sha256 != EXPECTED_BINARY_SHA256:
        raise ValueError("SFINCS binary differs from the first pilot's pinned executable")
    OUT.mkdir(parents=True, exist_ok=True)

    with rasterio.open(DEM) as src:
        window = from_bounds(*BOUNDS, transform=src.transform).round_offsets().round_lengths()
        elevation = src.read(1, window=window).astype(np.float32)
        affine = src.window_transform(window)
        bounds = rasterio.windows.bounds(window, src.transform)
        valid = np.isfinite(elevation) & (elevation != src.nodata)
        dx, dy = src.res
        profile = src.profile.copy()
        crs = src.crs
        strip = src.read(1, window=from_bounds(src.bounds.left, bounds[1], bounds[2], bounds[3], transform=src.transform).round_offsets().round_lengths())
        western_columns = [
            {"x_center_epsg32651": round(float(src.bounds.left + (i + 0.5) * dx), 1), "valid_cells_in_pilot_y_strip": int((strip[:, i] != src.nodata).sum())}
            for i in range(min(10, strip.shape[1]))
        ]
    if elevation.shape != (48, 61):
        raise ValueError(f"Unexpected DEM window {elevation.shape}; do not compare with first run")
    if not valid[:, 0].any():
        raise ValueError("No valid western-edge cells")

    mask = valid.astype(np.uint8)
    mask[valid[:, 0], 0] = 3
    np.savetxt(OUT / "sfincs.dep", np.where(valid, elevation, -9999)[::-1], fmt="%.3f")
    np.savetxt(OUT / "sfincs.msk", mask[::-1], fmt="%d")
    (OUT / "sfincs.prcp").write_text("0 40\n7200 40\n7201 0\n21600 0\n")
    (OUT / "sfincs.inp").write_text(
        f"x0 = {bounds[0]:.6f}\n"
        f"y0 = {bounds[1]:.6f}\n"
        f"mmax = {elevation.shape[1]}\n"
        f"nmax = {elevation.shape[0]}\n"
        f"dx = {dx:.9f}\n"
        f"dy = {dy:.9f}\n"
        "rotation = 0\n"
        "epsg = 32651\n"
        f"tref = {TREF}\n"
        f"tstart = {TREF}\n"
        "tstop = 20260101 060000\n"
        "depfile = sfincs.dep\n"
        "mskfile = sfincs.msk\n"
        "precipfile = sfincs.prcp\n"
        "inputformat = asc\n"
        "outputformat = net\n"
        "advection = 0\n"
        "huthresh = 0.05\n"
        "manning = 0.04\n"
        "qinf = 0\n"
        "dtout = 600\n"
        "dtmaxout = 3600\n"
        "storecumprcp = 1\n"
    )

    started = time.perf_counter()
    result = subprocess.run([str(args.sfincs.resolve())], cwd=OUT, env=os.environ.copy(), capture_output=True, text=True)
    wall_seconds = time.perf_counter() - started
    (OUT / "run.log").write_text(result.stdout + "\n--- stderr ---\n" + result.stderr)
    if result.returncode or "Simulation finished" not in result.stdout:
        raise RuntimeError(f"SFINCS failed; inspect {OUT / 'run.log'}")

    with Dataset(OUT / "sfincs_map.nc") as nc:
        output_mask = np.ma.filled(nc["msk"][:], 0).astype(np.uint8)
        active = output_mask == 1
        water = np.ma.filled(nc["h"][:], np.nan).astype(float)
        negative = (water < -0.001) & active[None, :, :]
        t, south_row, col = np.where(negative)
        negative_cells = sorted({(int(elevation.shape[0] - 1 - y), int(x)) for y, x in zip(south_row, col)})
        maximum = np.max(np.where(np.isfinite(water), water, -np.inf), axis=0)[::-1]
        maximum[~np.isfinite(maximum)] = np.nan
        rain_mm = 1000 * float(np.nanmedian(np.ma.filled(nc["cumprcp"][-1], np.nan)[active]))
        output_z = np.ma.filled(nc["zb"][:], np.nan)[::-1]
        output_status = float(np.ma.filled(nc["status"][:], np.nan)[0])
        initial_max = float(np.nanmax(np.abs(water[0, active])))
        active_output_finite = bool(np.isfinite(water[:, active]).all())
        grid_match = bool(np.allclose(output_z[valid], elevation[valid], atol=0.001))
        summary = {
            "purpose": "numerical boundary sensitivity only; not a validated flood map",
            "changed_input": "move the artificial dry western edge two DEM cells west; same rain, roughness, infiltration, north/south/east limits",
            "physical_boundary_justified": False,
            "selected_barangays": ["38-A", "38-B", "39"],
            "dem_sha256": file_sha256(DEM),
            "binary_sha256": binary_sha256,
            "grid_shape": list(elevation.shape),
            "grid_bounds_epsg32651": bounds,
            "valid_cells": int(valid.sum()),
            "nodata_cells": int((~valid).sum()),
            "dry_outflow_cells": int((output_mask == 3).sum()),
            "rain_mm_from_output": round(rain_mm, 3),
            "minimum_depth_m": round(float(np.nanmin(water[:, active])), 4),
            "maximum_depth_m": round(float(np.nanmax(water[:, active])), 4),
            "material_negative_cell_times": int(negative.sum()),
            "material_negative_cells_north_up_row_col": negative_cells,
            "wet_cells_over_0_05m": int(((maximum > 0.05) & valid).sum()),
            "initial_max_abs_depth_m": initial_max,
            "output_grid_matches_dem": grid_match,
            "active_output_finite": active_output_finite,
            "sfincs_status": output_status,
            "wall_runtime_s": round(wall_seconds, 4),
            "numerical_qc_pass": bool(output_status == 0 and grid_match and active_output_finite and abs(rain_mm - 80) < 0.2 and initial_max < 1e-6 and not negative.any()),
            "western_dem_column_coverage": western_columns,
        }

    baseline_nc = ROOT / "output/sfincs-pilot/rain40/sfincs_map.nc"
    if baseline_nc.exists():
        with Dataset(baseline_nc) as nc:
            baseline_water = np.ma.filled(nc["h"][:], np.nan)
            baseline_zs = np.ma.filled(nc["zs"][:], np.nan)
            time_seconds = np.ma.filled(nc["time"][:], np.nan)
            baseline_mask = np.ma.filled(nc["msk"][:], 0)
            baseline_max = np.max(np.where(np.isfinite(baseline_water), baseline_water, -np.inf), axis=0)[::-1]
            baseline_max[~np.isfinite(baseline_max)] = np.nan
        if baseline_max.shape != maximum[:, 2:].shape:
            raise ValueError("Shifted and baseline grids do not overlap as expected")
        barangays = read_shapes(BARANGAYS, crs)
        selected_shapes = [geom for geom, rec in barangays if rec["BarangayNo"] in SELECTED]
        selected_mask = geometry_mask(selected_shapes, out_shape=elevation.shape, transform=affine, invert=True)
        comparable = selected_mask[:, 2:] & np.isfinite(baseline_max) & np.isfinite(maximum[:, 2:])
        differences = np.abs(maximum[:, 2:][comparable] - baseline_max[comparable])
        summary["selected_barangay_overlap_comparison"] = {
            "cell_count": int(comparable.sum()),
            "max_abs_depth_difference_m": round(float(differences.max()), 4),
            "mean_abs_depth_difference_m": round(float(differences.mean()), 4),
            "baseline_wet_cells_over_0_05m": int(((baseline_max > 0.05) & comparable).sum()),
            "rerun_wet_cells_over_0_05m": int(((maximum[:, 2:] > 0.05) & comparable).sum()),
        }
        original_negative = ((baseline_water < -0.001) & (baseline_mask == 1)[None, :, :]).any(axis=0)[::-1]
        rows, cols = np.where(original_negative)
        summary["original_material_negative_cell_times"] = int(((baseline_water < -0.001) & (baseline_mask == 1)[None, :, :]).sum())
        summary["negative_cell_count_by_time"] = {
            "time_seconds": [int(t) for t in time_seconds],
            "original": [int(n) for n in ((baseline_water < -0.001) & (baseline_mask == 1)[None, :, :]).sum(axis=(1, 2))],
            "shifted": [int(n) for n in negative.sum(axis=(1, 2))],
        }
        with Dataset(OUT / "sfincs_map.nc") as nc:
            shifted_water = np.ma.filled(nc["h"][:], np.nan)
            shifted_zs = np.ma.filled(nc["zs"][:], np.nan)
        failed_cell_series = []
        with (OUT / "failed_cell_timeseries.csv").open("w", newline="") as stream:
            writer = csv.writer(stream)
            writer.writerow(["time_s", "x_epsg32651", "y_epsg32651", "original_h_m", "shifted_h_m", "original_zs_m", "shifted_zs_m"])
            for row, col in zip(rows, cols):
                old_south_row = elevation.shape[0] - 1 - row
                x, y = rasterio.transform.xy(affine, row, col + 2)
                old_h = baseline_water[:, old_south_row, col]
                new_h = shifted_water[:, old_south_row, col + 2]
                old_zs = baseline_zs[:, old_south_row, col]
                new_zs = shifted_zs[:, old_south_row, col + 2]
                failed_cell_series.append({
                    "x_epsg32651": round(float(x), 2),
                    "y_epsg32651": round(float(y), 2),
                    "original_min_depth_m": round(float(np.nanmin(old_h)), 4),
                    "shifted_min_depth_m": round(float(np.nanmin(new_h)), 4),
                    "first_original_negative_time_s": int(time_seconds[np.where(old_h < -0.001)[0][0]]),
                    "original_finite_water_level_samples": int(np.isfinite(old_zs).sum()),
                    "shifted_finite_water_level_samples": int(np.isfinite(new_zs).sum()),
                })
                for index, t in enumerate(time_seconds):
                    vals = [old_h[index], new_h[index], old_zs[index], new_zs[index]]
                    writer.writerow([int(t), round(float(x), 2), round(float(y), 2), *[round(float(v), 6) if np.isfinite(v) else "" for v in vals]])
        summary["original_failed_cells_epsg32651"] = failed_cell_series
        fig, axes = plt.subplots(2, 1, figsize=(9, 6), sharex=True)
        colors = ("tab:red", "tab:blue", "tab:green")
        for (row, col), color in zip(zip(rows, cols), colors):
            old_south_row = elevation.shape[0] - 1 - row
            label = f"cell ({row},{col})"
            axes[0].plot(time_seconds / 3600, baseline_water[:, old_south_row, col], color=color, ls="--", label=f"{label} original")
            axes[0].plot(time_seconds / 3600, shifted_water[:, old_south_row, col + 2], color=color, label=f"{label} shifted")
            axes[1].plot(time_seconds / 3600, baseline_zs[:, old_south_row, col], color=color, ls="--", marker="o", ms=4)
            axes[1].plot(time_seconds / 3600, shifted_zs[:, old_south_row, col + 2], color=color, marker="o", ms=4)
        axes[0].axhline(-0.001, color="black", lw=0.8, ls=":")
        axes[0].set_ylabel("Depth h (m)"); axes[0].legend(fontsize=7, ncol=2)
        axes[1].set_ylabel("Water level zs (m)"); axes[1].set_xlabel("Scenario time (hours)")
        axes[1].text(0.02, 0.05, "Gaps mean no valid water-level output while dry", transform=axes[1].transAxes, fontsize=8)
        fig.suptitle("Original failed cells: time-varying depth and level | UNVALIDATED")
        fig.savefig(OUT / "failed_cell_timeseries.png", dpi=150, bbox_inches="tight")
        plt.close(fig)

        from shapely.geometry import box
        domain = box(*bounds)
        creek_lines = [(geom, rec) for geom, rec in read_shapes(CREEKS, crs) if geom.intersects(domain)]
        summary["drainage_audit"] = {
            "empty_creeks_feature_count": len(shapefile.Reader(str(EMPTY_CREEKS))),
            "main_canal_features_intersecting_domain": sum(geom.intersects(domain) for geom, _ in read_shapes(MAIN_CANALS, crs)),
            "urban_canal_features_intersecting_domain": sum(geom.intersects(domain) for geom, _ in read_shapes(URBAN_CANALS, crs)),
            "separate_creek_names_intersecting_domain": [rec["Name"] for _, rec in creek_lines],
            "verified_laoag_river_channel_or_stage": False,
        }
        fig, ax = plt.subplots(figsize=(9, 7))
        ax.imshow(np.ma.masked_where(~valid, elevation), extent=(bounds[0], bounds[2], bounds[1], bounds[3]), origin="upper", cmap="terrain")
        ax.imshow(np.ma.masked_where(valid, np.ones_like(elevation)), extent=(bounds[0], bounds[2], bounds[1], bounds[3]), origin="upper", cmap="Greys", vmin=0, vmax=1, alpha=0.65)
        for geom in selected_shapes:
            plot_polygons(ax, geom, facecolor="none", edgecolor="navy", lw=1.3)
        for geom, _ in creek_lines:
            plot_lines(ax, geom, color="cyan", lw=1.0, alpha=0.9)
        if creek_lines:
            ax.plot([], [], color="cyan", lw=1.0, label="Supplied creek lines (unverified)")
        ax.axvline(bounds[0], color="purple", lw=2, label="Shifted artificial exit")
        ax.axvline(bounds[0] + 2 * dx, color="red", ls="--", lw=1.5, label="Original artificial exit")
        for row, col in zip(rows, cols):
            x, y = rasterio.transform.xy(affine, row, col + 2)
            ax.scatter(x, y, color="magenta", marker="x", s=55, zorder=5)
        if len(rows):
            ax.scatter([], [], color="magenta", marker="x", s=55, label="Original negative-depth cells")
        ax.set_xlim(bounds[0], bounds[2]); ax.set_ylim(bounds[1], bounds[3]); ax.set_aspect("equal")
        ax.legend(loc="upper right", fontsize=8)
        ax.set_title("Boundary/NoData audit | model setup remains unvalidated")
        fig.savefig(OUT / "boundary_audit.png", dpi=150, bbox_inches="tight")
        plt.close(fig)

    profile.update(driver="GTiff", height=elevation.shape[0], width=elevation.shape[1], transform=affine, count=1, dtype="float32", nodata=-9999.0)
    with rasterio.open(OUT / "max_depth.tif", "w", **profile) as dst:
        dst.write(np.where(valid, np.maximum(maximum, 0), -9999).astype(np.float32), 1)
        dst.update_tags(PRODUCT_STATUS="UNVALIDATED_BOUNDARY_DIAGNOSTIC")
    fig, ax = plt.subplots(figsize=(9, 7))
    plot_extent = (bounds[0], bounds[2], bounds[1], bounds[3])
    ax.imshow(np.ma.masked_where(~valid, elevation), extent=plot_extent, origin="upper", cmap="Greys", alpha=0.5)
    image = ax.imshow(np.ma.masked_where(~valid | (maximum <= 0.05), maximum), extent=plot_extent, origin="upper", cmap="Blues", vmin=0.05, vmax=0.5)
    for row, col in negative_cells:
        x, y = rasterio.transform.xy(affine, row, col)
        ax.scatter(x, y, color="magenta", marker="x", s=28)
    ax.set_xlim(bounds[0], bounds[2]); ax.set_ylim(bounds[1], bounds[3]); ax.set_aspect("equal")
    ax.set_title("West-edge shift: maximum depth > 0.05 m | UNVALIDATED")
    fig.colorbar(image, ax=ax, label="Maximum modeled depth (m)", shrink=0.75)
    fig.savefig(OUT / "max_depth.png", dpi=150, bbox_inches="tight")
    plt.close(fig)
    (OUT / "summary.json").write_text(json.dumps(summary, indent=2) + "\n")
    print(json.dumps(summary, indent=2))


if __name__ == "__main__":
    main()
