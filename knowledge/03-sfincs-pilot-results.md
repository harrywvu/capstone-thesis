# Laoag SFINCS Pilot: Coarse-DEM Technical Result

**Run date:** 2026-10-16. **Claim level:** technical demonstration only. This is the execution record for the [pilot plan](02-sfincs-pilot-plan.md). It does not validate flood predictions or change the capstone's accepted method.

**Follow-up:** A [boundary diagnostic rerun](04-sfincs-boundary-rerun-results.md) shifted the artificial western dry edge two DEM cells west and removed the material negative depths. It did not validate the flood map or provide a physical outlet.

## Decision

The supplied City Hall DEM can be read, aligned with the selected barangays and roads, written as SFINCS inputs, run, and converted back to georeferenced depth maps. The 80 mm rainfall case, however, produces materially negative depths near the assumed outflow boundary (minimum **−0.447 m**). The coarse raster has NoData gaps along the Laoag River, no documented vertical reference or accuracy, and no river bed or measured boundary level. No dated local rainfall and geolocated wet/dry observations were found in the supplied package. **Keep SFINCS exploratory; do not adopt these outputs for road closure, route safety, or flood accuracy claims.** A closed-boundary sensitivity run removes the large negative values but is not a credible representation of drainage from this area.

## Area and evidence inventory

Pilot display/analysis barangays: **38-A Mangato East, 38-B Mangato West, and 39 Sta. Rosa**. They are adjacent, entirely covered by valid DEM cells in the chosen grid, and overlap supplied roads and static flood-susceptibility polygons. The model grid extends outside them to EPSG:32651 bounds **(237,877.7, 2,009,082.6, 243,261.7, 2,013,462.8)** m, approximately 5.38 × 4.38 km. Its western edge is lower terrain that serves as an assumed water exit. The DEM gaps and unknown flow contributions mean the boundary is **not yet hydrologically complete**.

| Barangay | Valid DEM cells inside polygon | Road geometry inside polygon | Static susceptible-area overlap* |
|---|---:|---:|---:|
| 38-A Mangato East | 117/117 | 5.500 km | 54.3% |
| 38-B Mangato West | 115/115 | 5.673 km | 57.8% |
| 39 Sta. Rosa | 156/156 | 6.146 km | 45.8% |

\*Context only. The flood polygon's declared datum is unknown and the layer is not a dated observed extent. Road lengths inherit the supplied road geometry's known connectivity and length issues.

The City Hall DEM is 189 × 171 cells at roughly **91.254 m** spacing in WGS 84 / UTM zone 51N. The pilot grid is **59 × 48** cells: 2,654 valid elevation cells and 178 NoData cells. The pilot DEM elevations used by SFINCS span **0–58 m**. Source date, whether this is a bare-earth original, vertical datum, vertical units, accuracy, and publication rights remain unconfirmed. The raster SHA-256 is `332465b4bae85ac839afef206e139f2541540883160aa4db100e178a660ec8b8`.

Available local files: DEM, barangay boundaries, roads, land use, static flood-susceptibility polygons, and planning PDFs. The PDFs were text-searched for event rainfall, gauge, river-stage, and flood-mark terms; no usable event time series or location-level flood observations were identified. A LiPAD DTM is prospective only. **No reference event was replayed.** The model's `2026-01-01` clock is an arbitrary six-hour scenario clock, not a historical event timeline.

## Setup and checks

The tested engine is **SFINCS v2.4.0 Galibier Release**, build date 2026-06-11, from the official image `docker.io/deltares/sfincs-cpu@sha256:4301bffc74f3cb3f334be5d21aa75dfe5742a16c9838942cdfc2f870859fb404`. The extracted executable SHA-256 is `72b05c4922ef12c686ea6ea17654ccaf7dad292118d71126b22e5432d8c5cacf`. Inputs were built directly as documented ASCII grids and forcing files; **HydroMT-SFINCS was not used or tested**. The Python preprocessing and NetCDF-reading versions are pinned in [sfincs-pilot-requirements.txt](../scripts/sfincs-pilot-requirements.txt).

- Valid DEM cells are active. In the main runs, 38 valid cells on the western grid edge are `mask=3` free-outflow cells; SFINCS artificially holds them dry. Other edges, including NoData boundaries, are closed. The sensitivity run `rain40_closed` closes the west edge too. Neither condition is a measured river stage.
- All runs use uniform Manning `n=0.04 s/m^(1/3)`, uniform infiltration `qinf=0 mm/h`, no advection, and `huthresh=0.05 m`, except the named sensitivity changes. Land-use polygons were inspected but not converted to measured hydraulic parameters.
- Three controlled main runs use 0, 20, or 40 mm/h uniform rain for two hours, followed by four hours without rain. Total intended rain is 0, 40, or 80 mm. These are **hypothetical**, with no event attribution.
- Native NetCDF outputs have 37 ten-minute `h` maps and six hourly `hmax` maps. The output grid and elevation values were checked against the input DEM after reversing SFINCS's south-up array order. Initial depths are effectively zero. Output cumulative rain is within 0.1 mm of the intended totals.
- Hardware: Intel Core i5-12500H, 16 CPUs visible, 15 GiB RAM; `OMP_NUM_THREADS=2`. Run times below are local wall times for the extracted binary and exclude preprocessing. Local depth-map export, road overlay, and PNG rendering took about 0.45–0.62 seconds per case.

The [SFINCS input manual](https://sfincs.readthedocs.io/en/latest/input.html) defines the grid, elevation, `mask=3`, roughness, and infiltration conventions. The [forcing manual](https://sfincs.readthedocs.io/en/latest/input_forcing.html) specifies uniform rainfall in mm/h with times relative to `tref`; the [output manual](https://sfincs.readthedocs.io/en/latest/output.html) describes the run diagnostics and map output. The [official release](https://github.com/Deltares/SFINCS/releases/tag/v2.4.0_Galibier_release) identifies the pinned engine image.

## Run results

"Wet cells" means maximum modeled depth above **0.05 m** during the six-hour run. This is an inspection cutoff, **not a road-closure threshold**. A material negative depth is less than −0.001 m. `status=0`, a completed log, zero initial water, and exact grid alignment were observed in all six runs.

| Case | Rain in output | Max depth | Min depth | Material negative cell-times | Wet cells | Run wall time | Technical QC |
|---|---:|---:|---:|---:|---:|---:|---|
| Dry | 0 mm | 0 m | 0 m | 0 | 0 | 0.056 s | Pass |
| 20 mm/h × 2 h | 39.925 mm | 0.040 m | 0 m | 0 | 0 | 0.055 s | Pass |
| 40 mm/h × 2 h | 79.914 mm | 1.552 m | **−0.447 m** | **86** | 1,215 | 0.088 s | **Fail** |
| 40 mm/h, infiltration 5 mm/h | 79.943 mm | 1.057 m | −0.432 m | 83 | 1,014 | 0.095 s | **Fail** |
| 40 mm/h, Manning `n=0.06` | 79.906 mm | 1.302 m | −0.438 m | 83 | 1,309 | 0.096 s | **Fail** |
| 40 mm/h, all boundaries closed | 79.914 mm | 1.552 m | −0.0005 m | 0 | 1,236 | 0.088 s | Numerical check passes; boundary unsuitable |

The large negative depths cluster at or close to the western outflow edge. Infiltration and roughness changes do not remove them. The closed-domain case has one −0.0005 m numerical undershoot, below the 0.001 m materiality check. Its flood pattern remains unvalidated and its boundary prevents water exiting the model. The high-run maps show scattered cell-scale ponding on the coarse, integer-valued DEM; apparent road-depth detail would overstate what the terrain supports.

The NetCDF-to-GeoTIFF handoff was exercised locally: each case has a georeferenced `max_depth.tif`, a diagnostic `max_depth.png`, and a simple overlay with selected roads. The unvalidated 80 mm map intersects 2.387 km, 2.622 km, and 2.236 km of the supplied road geometry in 38-A, 38-B, and 39 respectively, at the 0.05 m inspection cutoff. Those lengths are **diagnostics only**: the model fails numerical QC, the cell size is about 91 m, and road/bridge geometry has not been verified. No automatic or manual closure, route recomputation, shelter allocation, or 3D application integration was performed from this output.

## Plan stage and next gate

| Pilot stage | Result |
|---|---|
| 1. Area and reference event | Area selected and mapped; dated event, observed rainfall, and geolocated flood evidence unavailable. Boundary remains provisional. |
| 2. Coarse DEM proof | Inputs and six runs reproducible; dry/moderate checks pass; stronger free-outflow runs fail negative-depth QC. |
| 3. Finer terrain | Not run: no LiPAD DTM delivered or cleared for use. |
| 4. Observed event evaluation | Not run: no event forcing or independent local wet/dry observations. No accuracy measure can be reported. |
| 5. OverFlow handoff | NetCDF read, GeoTIFF export, and road overlay exercised locally; planner closure and evacuation workflow withheld. |

Before another flood-model trial, obtain a finer bare-earth DEM with datum and accuracy metadata; river bed/exit information or evidence that the event is rainfall dominated; dated rainfall and geocoded flood observations; and permission for thesis/defense use of source data and derived maps. Then redraw the hydrologic boundary, rerun numerical checks, choose evaluation measures before comparing with observations, and only then test planner-reviewed closures in OverFlow. The current [capstone definition](00-capstone-definition.md) is not revised by this pilot.

## Reproduction and local artifacts

The source-dependent outputs are under `output/sfincs-pilot/`, which `.gitignore` excludes. Keep them local until City Hall confirms derivative-map rights. Key files are `metadata.json`, `summary.json`, `pilot_area.png`, and each case's `sfincs.inp`, `sfincs.dep`, `sfincs.msk`, `sfincs.prcp`, `run.log`, `sfincs_map.nc`, `max_depth.tif`, and `max_depth.png`.

Run [sfincs_pilot.py](../scripts/sfincs_pilot.py) with Python 3.14 and the pinned requirements:

```bash
python3 -m venv /tmp/overflow-sfincs-venv
/tmp/overflow-sfincs-venv/bin/pip install -r scripts/sfincs-pilot-requirements.txt
MPLCONFIGDIR=/tmp/overflow-mpl /tmp/overflow-sfincs-venv/bin/python scripts/sfincs_pilot.py prepare
```

The tested host had no Docker daemon, so the official pinned OCI image was copied with `skopeo` and its binary and required NetCDF/HDF5 libraries extracted to `/tmp/overflow-sfincs-bin`:

```bash
skopeo copy docker://docker.io/deltares/sfincs-cpu@sha256:4301bffc74f3cb3f334be5d21aa75dfe5742a16c9838942cdfc2f870859fb404 dir:/tmp/overflow-sfincs-image
mkdir -p /tmp/overflow-sfincs-bin
tar xzf /tmp/overflow-sfincs-image/2ba9d6045f6aa5c5ecf404a1017e81d691dcea2700eb0259522e480475f2fbbb -C /tmp/overflow-sfincs-bin usr/local/bin/sfincs
tar xzf /tmp/overflow-sfincs-image/2a311e0084d8bdc62ddcb2ae45999261ce873d21e43202f92aa6001d636ee9ca -C /tmp/overflow-sfincs-bin usr/lib/x86_64-linux-gnu/libnetcdf.so.19
tar xzf /tmp/overflow-sfincs-image/2a311e0084d8bdc62ddcb2ae45999261ce873d21e43202f92aa6001d636ee9ca -C /tmp/overflow-sfincs-bin --wildcards 'usr/lib/x86_64-linux-gnu/libhdf5_serial*.so*'
```

The run and summary commands are:

```bash
MPLCONFIGDIR=/tmp/overflow-mpl LD_LIBRARY_PATH=/tmp/overflow-sfincs-bin/usr/lib/x86_64-linux-gnu OMP_NUM_THREADS=2 /tmp/overflow-sfincs-venv/bin/python scripts/sfincs_pilot.py run --sfincs /tmp/overflow-sfincs-bin/usr/local/bin/sfincs
MPLCONFIGDIR=/tmp/overflow-mpl /tmp/overflow-sfincs-venv/bin/python scripts/sfincs_pilot.py summarize
```

The extracted binary approach depends on compatible host libraries. SFINCS can also be invoked from the pinned container image against each prepared case directory; retain `run.log` and `runtime.json` if comparing run times. The local processing script generates the same inputs and reads the same native NetCDF variables either way.
