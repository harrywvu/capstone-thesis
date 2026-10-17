# Computation Layer (Python + FastAPI)

## Role

All data processing, simulation, and analysis runs here. The frontend is a thin client.

## Framework

- **FastAPI** — lightweight async Python web framework
- **NumPy** — grid operations, array math
- **SciPy** — signal processing, interpolation if needed
- **rasterio / GDAL** — reading GeoTIFF DEM files (if using file-based data)
- **SFINCS** — selected flood-scenario engine, invoked from the backend after terrain and forcing preparation

## Core Algorithms

### DEM Processing
1. Resolve selected barangay identifiers to prepared boundary geometry; load DEM coverage for their combined area
2. Convert to NumPy elevation grid (2D array)
3. Resolve NoData values; preserve the original elevation units for computation
4. Optionally downsample for performance

### Flood Scenarios — SFINCS
- Prepare terrain, river/channel, active-cell, roughness, infiltration, and boundary inputs with documented units and height references.
- Accept planner rainfall intensity/duration for hypothetical scenarios; use dated rainfall and relevant river level/discharge when replaying an observed event.
- Run SFINCS and read its time-varying and maximum-depth outputs. Check numerical behavior, input/output alignment, and sensitivity to boundary and terrain assumptions.
- Compare a dated run against geolocated flooded and dry observations before claiming local accuracy or using modeled exposure to guide road decisions.
- D8 flow direction and accumulation may be offered as an optional drainage-reference analysis, not a flood-depth engine.

### Evacuation Analysis (Initial Method Direction)
- Remove manually closed roads and bridges from the traversable road graph. Any automatic closure based on flood classification requires a separately defined and validated rule.
- Compute weighted shortest feasible paths from selected barangays to reachable centers; NetworkX is the selected implementation direction. Edge weights and the alternate-route rule remain to be specified.
- Assign expected evacuees to reachable centers without exceeding usable capacities; OR-Tools minimum-cost flow is the selected implementation direction. Specify the cost objective and any additional constraints before claiming optimality.
- Report unserved demand and its cause when no feasible route or center capacity exists.
- Estimate travel and vehicle trips from road distance, stated speed, vehicle capacity, and explicit scheduling assumptions. The exact clearance-time method and validation remain open.

## API Endpoints (Planned)

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/terrain` | POST | Receive selected barangay identifiers, resolve geographic coverage, return elevation grid + mesh data |
| `/api/simulate` | POST | Configure or retrieve a SFINCS scenario and return labeled flood maps after required checks |
| `/api/analyze` | POST | Receive selected barangays, demand, planner-confirmed road access, centers, and resources; return evacuation analysis with flood-scenario context |

## Response Format

All responses return JSON with:
- `terrain`: vertex positions, colors, and indices for mesh rendering
- `water`: SFINCS depth/time maps with scenario, units, source, validation status, and uncertainty labels; local accuracy remains unclaimed until evaluated
- `metadata`: bounds, resolution, timestamps
