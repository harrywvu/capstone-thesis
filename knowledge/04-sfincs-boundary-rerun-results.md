# Laoag SFINCS Pilot: Boundary Diagnostic Rerun

**Later method decision (2026-10-17):** The team selected SFINCS for future OverFlow flood scenarios. This historical boundary test remains unvalidated; the selection does not make its assumed dry outlet physical. See the [current capstone definition](00-capstone-definition.md).

**Run date:** 2026-10-16. **Claim level:** numerical sensitivity only; flood-map accuracy remains untested. This follows the [first technical result](03-sfincs-pilot-results.md) and the [updated pilot plan](02-sfincs-pilot-plan.md).

## Question and result

The first 80 mm hypothetical rainfall run had 86 material negative-depth cell-times in three cells immediately beside an artificially dry western edge. Would moving that edge two City Hall DEM cells (about 182.5 m) west remove the anomaly?

**Yes, in this diagnostic:** the rerun has **zero** depths below −0.001 m, versus 86 material negative cell-times and a minimum of −0.447 m in the first run. Its minimum is −0.0005 m, a small numerical undershoot. SFINCS finished, its output grid matched the input DEM, and it reproduced 79.914 mm of the intended 80 mm rain. Maximum modeled depth remained 1.552 m. Across the 388 comparable DEM cells inside 38-A, 38-B, and 39, the two runs' **maximum-depth maps were identical** at the output precision; both had 179 cells above the 0.05 m inspection cutoff. The first run's bad values were confined near its western boundary, outside those selected barangays.

This is strong evidence that **the first run's large negative depths are tied to that boundary placement**, rather than proof that the City Hall DEM alone or the SFINCS engine is defective. It does **not** make either flood map correct. The new edge is still an arbitrary dry outlet, has no measured river level, and receives rainfall on the two extra columns. The 91.25 m DEM, river-area NoData, unknown vertical reference/accuracy, and absence of local flood observations remain. The technical numerical check passes for this run; the updated plan's **physical-boundary and observed-event gates do not**. Do not use this output for road closure, routing, or flood-accuracy claims.

## What changed

| Input or check | First 40 mm/h × 2 h case | Boundary diagnostic |
|---|---:|---:|
| Grid | 48 × 59 cells | 48 × 61 cells |
| Western edge | 237877.7 m E | 237695.2 m E |
| Valid / NoData cells | 2,654 / 178 | 2,729 / 199 |
| Artificial dry outflow cells | 38 | 38 |
| Material negative cell-times | 86 | **0** |
| Minimum depth | −0.447 m | **−0.0005 m** |
| Wet cells in selected barangays | 179 | **179** |
| Physically justified outlet | No | **No** |

The terrain source and pinned SFINCS binary were unchanged (DEM SHA-256 `332465b4bae85ac839afef206e139f2541540883160aa4db100e178a660ec8b8`; binary SHA-256 `72b05c4922ef12c686ea6ea17654ccaf7dad292118d71126b22e5432d8c5cacf`). Rainfall, roughness, infiltration, duration, and the northern, southern, and eastern limits also stayed the same. The extra western cells necessarily receive the same uniform rain, so this is a **domain/exit sensitivity test**, not a controlled change of exit location alone.

## Boundary and data audit

- The original material negative depths were in three active cells one column inward from the original dry exit. The [local audit image](../output/sfincs-boundary-diagnostic/boundary_audit.png) plots them against both edges and the terrain gaps.
- The City Hall raster contains two nearly complete valid columns west of the original edge used in this rerun. Moving farther west quickly reaches NoData: in the same 48-row strip, the next columns west have only **9** valid cells near 237649.6 m E and **1** near 237558.3 m E; the four columns farther west have none. The current raster cannot by itself establish a downstream river exit beyond this small shift.
- The supplied `Drainage/Creeks/creeks.shp` layer has zero features. The separate creek layer has five intersecting named lines—Buttong Creek, Cavit-Mangato-Darayday Creek, Creek Apaya, Creek Bengacg Zamboanga, and Gabu Apaya Creek—now shown on the [local audit map](../output/sfincs-boundary-diagnostic/boundary_audit.png). Main- and urban-canal layers have no features intersecting this model rectangle. The supplied CLUP and CDP describe the Padsan/Laoag River, but the GIS package does not establish its river bed, outlet cross-section, or measured water-level time series. Do not fill missing river cells or force an outlet from these lines without verification.
- The model clock and 40 mm/h for two hours are hypothetical. No dated local flood, matching rainfall/river forcing, or independent wet/dry observations were available for this rerun.

## Decision and next test

**Decision at the time of the 2026-10-16 rerun: keep SFINCS exploratory; make no D8 replacement decision yet.** The team selected SFINCS as the future method on 2026-10-17, as noted at the top of this report; that later decision did not validate this map. The immediate numerical anomaly can be removed by shifting the dry boundary, but a physically supported model still needs (1) a documented river/channel and downstream-boundary design, (2) terrain with known datum and accuracy and preferably finer detail, and (3) a dated event with rainfall and observed wet/dry locations. Only after those inputs are available should the team rerun a locally evaluated flood scenario and test planner-reviewed road effects in OverFlow.

Reproduce the diagnostic with [sfincs_boundary_diagnostic.py](../scripts/sfincs_boundary_diagnostic.py), Python 3.14 and the pinned [Python dependencies](../scripts/sfincs-pilot-requirements.txt), against the same pinned SFINCS binary used by the first pilot. The script writes `summary.json`, `run.log`, native NetCDF, a GeoTIFF, and diagnostic PNGs under ignored `output/sfincs-boundary-diagnostic/`. Keep source-dependent maps local until City Hall's derivative-map permissions are clear.

## Repeat verification, 2026-10-16

The original 0/20/40 mm/h runs and three sensitivity cases were regenerated from the [first pilot script](../scripts/sfincs_pilot.py), then the shifted-edge diagnostic was rerun with the same pinned binary and source DEM. All six baseline cases reproduced their prior rain totals, depth extrema, material-negative counts, wet-cell counts, and numerical-QC flags at the precision stored in `summary.json`. The shifted-edge case again yielded **79.914 mm** cumulative rain, **0** material negative cell-times, a **−0.0005 m** minimum, and **1,249** cells above the 0.05 m inspection cutoff. Its 388 selected-barangay cells still have no maximum-depth difference from the original run at output precision. Runtime varies slightly between repeats and is not an accuracy measure.

The original run's three materially negative cells have these EPSG:32651 centers and first occurrence times. The shifted run has no material negative depth at the same positions:

| Easting (m) | Northing (m) | Original minimum depth | First below −0.001 m |
|---:|---:|---:|---:|
| 238014.60 | 2011227.06 | −0.4468 m | 1 h 30 min |
| 238014.60 | 2010588.28 | −0.4109 m | 1 h 20 min |
| 238014.60 | 2010314.52 | −0.2555 m | 1 h 20 min |

The [local time-series plot](../output/sfincs-boundary-diagnostic/failed_cell_timeseries.png) and `failed_cell_timeseries.csv` inspect all 37 ten-minute `h` and `zs` output times at those locations. The original negative depths persist after their first occurrence; the shifted run does not repeat them. SFINCS masks `zs` at nearly all of these mostly dry-cell times, so there is no usable continuous water-level trajectory at these points. The numerical result is reproducible, but the physical-boundary gate remains unmet and the maps remain **unvalidated**.
