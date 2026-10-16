#!/usr/bin/env python3
"""Reproduce the local, coarse-DEM SFINCS feasibility pilot.

Derived model files and maps are written only below output/ (Git-ignored).
The runs are hypothetical and must not be used to close roads.
"""

from __future__ import annotations

import argparse
import hashlib
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
from pyproj import CRS, Transformer
from rasterio.features import geometry_mask, shapes
from rasterio.windows import from_bounds
from shapely import transform as shapely_transform
from shapely.geometry import shape
from shapely.ops import unary_union


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "data/RESEARCH PROJECT LAOAG CITY DATA/shape files"
OUT = ROOT / "output/sfincs-pilot"
DEM = SOURCE / "Elevation/ELEVATION.tif"
BARANGAYS = SOURCE / "Administrative Boundary/Laoag Administratrive Boundary.shp"
ROADS = SOURCE / "Road Network/Laoag Existing Road Network/Roads.shp"
FLOOD = SOURCE / "Hazard/Flood/Laoag_Flood5yr.shp"
SELECTED = ("38-A", "38-B", "39")
BOUNDS = (237900, 2009000, 243300, 2013400)  # EPSG:32651; DEM-aligned below
CASES = {
    "dry": {"rain": 0, "manning": 0.04, "qinf": 0, "boundary": "west_free"},
    "rain20": {"rain": 20, "manning": 0.04, "qinf": 0, "boundary": "west_free"},
    "rain40": {"rain": 40, "manning": 0.04, "qinf": 0, "boundary": "west_free"},
    "rain40_infil5": {"rain": 40, "manning": 0.04, "qinf": 5, "boundary": "west_free"},
    "rain40_rough006": {"rain": 40, "manning": 0.06, "qinf": 0, "boundary": "west_free"},
    "rain40_closed": {"rain": 40, "manning": 0.04, "qinf": 0, "boundary": "closed"},
}  # Rain in mm/hour, first two hours; all values are assumptions.
TREF = "20260101 000000"  # arbitrary reference date; NOT an observed event
ENGINE_IMAGE = "docker.io/deltares/sfincs-cpu@sha256:4301bffc74f3cb3f334be5d21aa75dfe5742a16c9838942cdfc2f870859fb404"


def file_sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def read_shapes(path: Path, target_crs: CRS):
    source_crs = CRS.from_wkt(path.with_suffix(".prj").read_text())
    project = Transformer.from_crs(source_crs, target_crs, always_xy=True).transform
    result = []
    for item in shapefile.Reader(str(path)).iterShapeRecords():
        if item.shape.shapeType == 0:
            continue
        geom = shapely_transform(shape(item.shape.__geo_interface__), project, interleaved=False)
        if not geom.is_valid:
            geom = geom.buffer(0)
        if not geom.is_empty:
            result.append((geom, item.record.as_dict()))
    return result


def plot_lines(ax, geom, **kwargs):
    for part in getattr(geom, "geoms", (geom,)):
        if hasattr(part, "xy"):
            ax.plot(*part.xy, **kwargs)


def plot_polygons(ax, geom, **kwargs):
    for part in getattr(geom, "geoms", (geom,)):
        if hasattr(part, "exterior"):
            ax.fill(*part.exterior.xy, **kwargs)


def prepare() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    with rasterio.open(DEM) as src:
        window = from_bounds(*BOUNDS, transform=src.transform).round_offsets().round_lengths()
        elevation = src.read(1, window=window).astype(np.float32)
        affine = src.window_transform(window)
        bounds = rasterio.windows.bounds(window, src.transform)
        crs = src.crs
        valid = np.isfinite(elevation) & (elevation != src.nodata)
        if not valid.any():
            raise ValueError("No valid DEM cells in pilot window")
        nrows, ncols = elevation.shape
        dx, dy = src.res
        nodata = src.nodata

    barangays = read_shapes(BARANGAYS, crs)
    roads = read_shapes(ROADS, crs)
    # This layer declares an unknown datum. Its transformed footprint is only
    # a contextual overlap check, never a validation target.
    hazard = read_shapes(FLOOD, crs)
    road_union = unary_union([geom for geom, _ in roads])
    hazard_union = unary_union([geom for geom, rec in hazard if rec["Var"] > 0])
    selected = [(geom, rec) for geom, rec in barangays if rec["BarangayNo"] in SELECTED]
    if len(selected) != len(SELECTED):
        raise ValueError("Selected barangay identifiers are missing")

    table = []
    for geom, rec in selected:
        inside = geometry_mask([geom], out_shape=elevation.shape, transform=affine, invert=True)
        count = int(inside.sum())
        covered = int((inside & valid).sum())
        table.append(
            {
                "barangay": rec["BarangayNo"],
                "name": rec["BarangayNa"],
                "dem_cells": count,
                "valid_dem_cells": covered,
                "valid_dem_fraction": covered / count if count else None,
                "road_length_km_within_polygon": round(road_union.intersection(geom).length / 1000, 3),
                "susceptible_area_fraction_context_only": round(hazard_union.intersection(geom).area / geom.area, 3),
            }
        )

    # Western edge is a deliberately simplified free-outflow test. SFINCS
    # mask=3 holds these cells dry; it is not a measured river stage.
    mask = valid.astype(np.uint8)
    outlet = valid[:, 0]
    mask[outlet, 0] = 3
    if outlet.sum() < 1:
        raise ValueError("No western outflow cells found")

    dep = np.where(valid, elevation, -9999.0)
    for name, case in CASES.items():
        folder = OUT / name
        folder.mkdir(exist_ok=True)
        case_mask = mask if case["boundary"] == "west_free" else valid.astype(np.uint8)
        # SFINCS ASCII grids list the southwest row first.
        np.savetxt(folder / "sfincs.dep", dep[::-1], fmt="%.3f")
        np.savetxt(folder / "sfincs.msk", case_mask[::-1], fmt="%d")
        (folder / "sfincs.prcp").write_text(
            f"0 {case['rain']}\n7200 {case['rain']}\n7201 0\n21600 0\n"
        )
        (folder / "sfincs.inp").write_text(
            f"x0 = {bounds[0]:.6f}\n"
            f"y0 = {bounds[1]:.6f}\n"
            f"mmax = {ncols}\n"
            f"nmax = {nrows}\n"
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
            f"manning = {case['manning']}\n"
            f"qinf = {case['qinf']}\n"
            "dtout = 600\n"
            "dtmaxout = 3600\n"
            "storecumprcp = 1\n"
        )

    metadata = {
        "status": "hypothetical technical feasibility only",
        "selected_barangays": table,
        "event": None,
        "engine_image": ENGINE_IMAGE,
        "model_builder": "direct SFINCS ASCII input; HydroMT-SFINCS not used",
        "scenarios": CASES,
        "total_rain_mm_approx": {name: 2 * case["rain"] for name, case in CASES.items()},
        "model_hours": 6,
        "dem_crs": str(crs),
        "dem_source_resolution_m": [dx, dy],
        "dem_nodata": nodata,
        "grid_shape_rows_cols": [nrows, ncols],
        "grid_bounds_epsg32651": bounds,
        "valid_dem_cells": int(valid.sum()),
        "invalid_dem_cells": int((~valid).sum()),
        "outflow_cells_west_edge": int(outlet.sum()),
        "dem_sha256": file_sha256(DEM),
        "inputs": [str(path.relative_to(ROOT)) for path in (DEM, BARANGAYS, ROADS, FLOOD)],
        "assumptions": [
            "DEM vertical datum, native accuracy, and source date are unknown.",
            "NoData cells are inactive; river bed elevations are unavailable.",
            "Western valid-edge mask=3 cells are artificial free outflow, not observed water level.",
            "All other domain edges are closed, including NoData boundaries; one sensitivity case closes the west edge too.",
            "Uniform Manning n=0.04 s/m^(1/3); uniform infiltration qinf=0 mm/hour.",
            "Rain is spatially uniform and hypothetical; no historic event is simulated.",
            "Flood susceptibility is contextual, not event validation.",
        ],
    }
    (OUT / "metadata.json").write_text(json.dumps(metadata, indent=2) + "\n")

    fig, ax = plt.subplots(figsize=(10, 8))
    image = np.ma.masked_where(~valid, elevation)
    plot_extent = (bounds[0], bounds[2], bounds[1], bounds[3])
    ax.imshow(image, extent=plot_extent, origin="upper", cmap="terrain", vmin=0, vmax=60)
    for geom, rec in hazard:
        if rec["Var"] > 0:
            plot_polygons(ax, geom, color={1: "yellow", 2: "orange", 3: "red"}[rec["Var"]], alpha=0.13)
    for geom, _ in roads:
        plot_lines(ax, geom, color="black", lw=0.35, alpha=0.45)
    for geom, rec in barangays:
        if rec["BarangayNo"] in SELECTED:
            plot_polygons(ax, geom, facecolor="none", edgecolor="blue", lw=1.2)
            ax.text(geom.centroid.x, geom.centroid.y, rec["BarangayNo"], color="navy", weight="bold", ha="center")
    ys = bounds[3] - (np.flatnonzero(outlet) + 0.5) * dy
    ax.scatter(np.full(len(ys), bounds[0] + dx / 2), ys, c="magenta", s=10, label="Assumed outflow cells")
    ax.set_xlim(bounds[0], bounds[2]); ax.set_ylim(bounds[1], bounds[3]); ax.set_aspect("equal")
    ax.set_title("SFINCS technical pilot area: 38-A, 38-B, 39 (EPSG:32651)")
    ax.legend(loc="upper right", fontsize=8)
    fig.savefig(OUT / "pilot_area.png", dpi=160, bbox_inches="tight")
    plt.close(fig)
    print(json.dumps({"output": str(OUT), "shape": [nrows, ncols], "valid": int(valid.sum()), "outflow": int(outlet.sum()), "barangays": table}, indent=2))


def run(binary: Path) -> None:
    if not (OUT / "metadata.json").exists():
        raise FileNotFoundError("Run prepare first")
    for name in CASES:
        folder = OUT / name
        started = time.perf_counter()
        result = subprocess.run([str(binary.resolve())], cwd=folder, env=os.environ.copy(), capture_output=True, text=True)
        seconds = time.perf_counter() - started
        (folder / "run.log").write_text(result.stdout + "\n--- stderr ---\n" + result.stderr)
        (folder / "runtime.json").write_text(json.dumps({
            "wall_seconds": seconds,
            "exit_code": result.returncode,
            "binary_sha256": file_sha256(binary),
            "omp_num_threads": os.environ.get("OMP_NUM_THREADS"),
        }, indent=2) + "\n")
        print(name, "exit", result.returncode, "wall_seconds", round(seconds, 3))
        if result.returncode or "Simulation finished" not in result.stdout:
            raise RuntimeError(f"SFINCS failed in {name}; inspect {folder / 'run.log'}")


def inspect() -> None:
    for name in CASES:
        path = OUT / name / "sfincs_map.nc"
        if not path.exists():
            print(name, "missing sfincs_map.nc")
            continue
        with Dataset(path) as nc:
            print(name, {key: (variable.shape, variable.units if hasattr(variable, "units") else "") for key, variable in nc.variables.items()})


def summarize() -> None:
    """Check native outputs and export local diagnostic rasters/maps."""
    with rasterio.open(DEM) as src:
        window = from_bounds(*BOUNDS, transform=src.transform).round_offsets().round_lengths()
        elevation = src.read(1, window=window)
        affine = src.window_transform(window)
        bounds = rasterio.windows.bounds(window, src.transform)
        valid = elevation != src.nodata
        profile = src.profile.copy()
        profile.update(driver="GTiff", height=elevation.shape[0], width=elevation.shape[1], transform=affine, count=1, dtype="float32", nodata=-9999.0)
        crs = src.crs
    barangays = read_shapes(BARANGAYS, crs)
    selected = [(geom, rec) for geom, rec in barangays if rec["BarangayNo"] in SELECTED]
    roads = read_shapes(ROADS, crs)
    road_union = unary_union([geom for geom, _ in roads])
    results = {}
    for name, case in CASES.items():
        processing_started = time.perf_counter()
        folder = OUT / name
        with Dataset(folder / "sfincs_map.nc") as nc:
            mask = np.ma.filled(nc["msk"][:], 0).astype(np.uint8)
            active = mask == 1
            water = np.ma.filled(nc["h"][:], np.nan).astype(float)
            present = water[:, active]
            maximum = np.max(np.where(np.isfinite(water), water, -np.inf), axis=0)
            maximum[~np.isfinite(maximum)] = np.nan
            maximum_north_up = maximum[::-1]
            negative = (water < -0.001) & active[None, :, :]
            minor_negative = (water < -1e-4) & active[None, :, :]
            initial_max = float(np.nanmax(np.abs(water[0, active])))
            rainfall = np.ma.filled(nc["cumprcp"][-1], np.nan)
            infiltrated = np.ma.filled(nc["cuminf"][-1], np.nan)
            output_elevation = np.ma.filled(nc["zb"][:], np.nan)[::-1]
            grid_match = bool(np.allclose(output_elevation[valid], elevation[valid], atol=0.001))
            status = float(np.ma.filled(nc["status"][:], np.nan)[0])
            model_runtime = float(np.ma.filled(nc["total_runtime"][:], np.nan)[0])
            rain_mm = 1000 * float(np.nanmedian(rainfall[active]))
            rain_error_mm = abs(rain_mm - 2 * case["rain"])
            active_finite = bool(np.isfinite(present).all())

        wet = (maximum_north_up > 0.05) & valid
        wet_polygons = [shape(geom) for geom, value in shapes(wet.astype(np.uint8), mask=wet, transform=affine) if value == 1]
        wet_union = unary_union(wet_polygons) if wet_polygons else None
        road_exposure = {}
        for geom, rec in selected:
            road = road_union.intersection(geom)
            road_exposure[rec["BarangayNo"]] = round(road.intersection(wet_union).length / 1000, 3) if wet_union else 0.0

        with rasterio.open(folder / "max_depth.tif", "w", **profile) as dst:
            dst.write(np.where(valid, np.maximum(maximum_north_up, 0), -9999).astype(np.float32), 1)
            dst.update_tags(PRODUCT_STATUS="UNVALIDATED_DIAGNOSTIC", NEGATIVE_CELL_TIMES=str(int(negative.sum())))
        runtime = json.loads((folder / "runtime.json").read_text())
        result = {
            "rain_mm_from_output": round(rain_mm, 3),
            "rain_error_mm": round(rain_error_mm, 3),
            "infiltration_mm_from_output": round(1000 * float(np.nanmedian(infiltrated[active])), 3),
            "active_cells": int(active.sum()),
            "outflow_cells": int((mask == 3).sum()),
            "initial_max_abs_depth_m": initial_max,
            "minimum_depth_any_time_m": round(float(np.nanmin(present)), 4),
            "maximum_depth_any_time_m": round(float(np.nanmax(present)), 4),
            "negative_cell_time_count": int(negative.sum()),
            "minor_negative_cell_time_count_below_0_0001m": int(minor_negative.sum()),
            "wet_cells_over_0_05m": int(wet.sum()),
            "diagnostic_wet_road_km_by_barangay": road_exposure,
            "output_grid_matches_dem": grid_match,
            "active_output_finite": active_finite,
            "sfincs_status": status,
            "model_runtime_s": round(model_runtime, 4),
            "wall_runtime_s": round(runtime["wall_seconds"], 4),
            "technical_qc_pass": bool(status == 0 and grid_match and active_finite and rain_error_mm < 0.2 and initial_max < 1e-6 and not negative.any()),
            "parameters": case,
        }
        results[name] = result

        fig, ax = plt.subplots(figsize=(9, 7))
        colored = np.ma.masked_where(~valid | (maximum_north_up <= 0.05), maximum_north_up)
        plot_extent = (bounds[0], bounds[2], bounds[1], bounds[3])
        ax.imshow(np.ma.masked_where(~valid, elevation), extent=plot_extent, origin="upper", cmap="Greys", alpha=0.5)
        layer = ax.imshow(colored, extent=plot_extent, origin="upper", cmap="Blues", vmin=0.05, vmax=0.5)
        for geom, _ in roads:
            plot_lines(ax, geom, color="black", lw=0.35, alpha=0.6)
        for geom, rec in selected:
            plot_polygons(ax, geom, facecolor="none", edgecolor="darkorange", lw=1.2)
            ax.text(geom.centroid.x, geom.centroid.y, rec["BarangayNo"], ha="center", color="darkorange", weight="bold")
        neg_any = negative.any(axis=0)[::-1]
        jj, ii = np.where(neg_any)
        if len(ii):
            xx, yy = rasterio.transform.xy(affine, jj, ii)
            ax.scatter(xx, yy, c="magenta", marker="x", s=24, label="Negative model depth")
            ax.legend(loc="lower right", fontsize=7)
        ax.set_xlim(bounds[0], bounds[2]); ax.set_ylim(bounds[1], bounds[3]); ax.set_aspect("equal")
        ax.set_title(f"{name}: max modeled depth > 0.05 m | UNVALIDATED")
        fig.colorbar(layer, ax=ax, label="Maximum depth (m); colors saturate at 0.5 m", shrink=0.75)
        fig.savefig(folder / "max_depth.png", dpi=150, bbox_inches="tight")
        plt.close(fig)
        result["postprocess_wall_s"] = round(time.perf_counter() - processing_started, 3)
        print(name, json.dumps(result))
    (OUT / "summary.json").write_text(json.dumps(results, indent=2) + "\n")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("action", choices=("prepare", "run", "inspect", "summarize"))
    parser.add_argument("--sfincs", type=Path, help="Path to pinned SFINCS executable for run")
    args = parser.parse_args()
    if args.action == "prepare":
        prepare()
    elif args.action == "run":
        if args.sfincs is None:
            parser.error("run requires --sfincs")
        run(args.sfincs)
    elif args.action == "inspect":
        inspect()
    else:
        summarize()


if __name__ == "__main__":
    main()
