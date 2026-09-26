# Synthetic defense-demo model

This service supplies the same deterministic 65 × 65 synthetic landscape for all three conceptual Laoag sectors. The sector ID changes the label only. It never fetches or loads OSM, DEM, boundaries, real population, or shelter data.

The terrain response also includes fixed-seed trees, shrubs, field patches, and rocks for visual context. They are kept clear of demo roads, buildings, and planning nodes and are not inputs to the flood or evacuation calculations. Their positions do not claim to represent real Laoag vegetation, land use, or geology.

## Time-stepped rainfall and runoff

The demo interprets the synthetic elevations as metres on a 65 × 65 grid of 20 m cells. Uniform rainfall (mm/h) falls for the selected duration. A fixed 8 mm/h infiltration loss is deducted, up to the rainfall rate. At 1.25-second numerical steps, remaining water moves between four neighboring cells along water-surface gradients using a simplified Manning-based diffusion-wave flux. Fluxes are limited by available source water, so cells cannot become negative. Tile edges use an assumed free-drainage slope of 0.001. The service returns 10-minute depth snapshots in metres, peak depth per cell, and a rainfall–infiltration–outflow–storage water balance. The terrain/route view plays those snapshots in simulated-time order; playback speed is only a presentation choice.

Cells reaching 0.05 m are shown as wet. A demo road segment closes when at least four of 21 samples reach a **peak** depth of 0.25 m, or when the planner closes it manually. The service then finds routes to accessible synthetic centers, applies illustrative capacity limits, assigns vehicles, and reports a heuristic clearance estimate. The depth and closure thresholds are demonstration assumptions, not safety limits.

This is **not** HEC-RAS or SWMM, and it is not a validated flood model. The synthetic elevation scale, uniform rainfall/infiltration, roughness, and open-edge condition have no site calibration; buildings and scenery do not alter flow; drains, culverts, river inflows, spatial rainfall, and observed flood data are absent. A small mass-balance error verifies numerical bookkeeping, not geographic accuracy. D8 direction and accumulation remain available as terrain-analysis utilities but are not converted into depth by this solver. The physical basis for the simplified flow rule and the need for boundary conditions follow the [USACE diffusion-wave reference](https://www.hec.usace.army.mil/confluence/rasdocs/ras1dtechref/6.2/theoretical-basis-for-one-dimensional-and-two-dimensional-hydrodynamic-calculations/2d-unsteady-flow-hydrodynamics/hydraulic-equations/diffusion-wave-approximation-to-the-shallow-water-equations); [EPA SWMM documentation](https://www.epa.gov/water-research/storm-water-management-model-swmm) describes the rainfall–infiltration–runoff processes this demo simplifies.

## API

- `POST /api/terrain` with `{"sectorId":"sector-a"}` returns the elevation grid, mesh, and synthetic scene features.
- `POST /api/simulate` adds `intensityMmHr` and `durationHr`; it returns depth frames, peak depth, wet-cell and road flags, model assumptions, and a water balance.
- `POST /api/analyze` also takes `affected`, `vehicles`, and `manualClosures`; it returns routes, allocations, and comparison metrics.

Run the repository's `scripts/setup-demo.sh` once while online, then `scripts/start-demo.sh` to start both services locally.
