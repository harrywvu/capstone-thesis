# Computation Layer (Python + FastAPI)

## Role

All data processing, simulation, and analysis runs here. The frontend is a thin client.

## Framework

- **FastAPI** — lightweight async Python web framework
- **NumPy** — grid operations, array math
- **SciPy** — signal processing, interpolation if needed
- **rasterio / GDAL** — reading GeoTIFF DEM files (if using file-based data)

## Core Algorithms

### DEM Processing
1. Resolve selected barangay identifiers to prepared boundary geometry; load DEM coverage for their combined area
2. Convert to NumPy elevation grid (2D array)
3. Resolve NoData values; preserve the original elevation units for computation
4. Optionally downsample for performance

### Water Simulation — D8 Flow Direction
- For each cell in the grid, determine which of 8 neighbors is steepest downhill
- Assign flow direction as an encoded value (1–8, one per neighbor direction)
- No flow if cell is a local minimum (depression/sink)

### Flow Accumulation
- Starting from each cell, trace downstream following flow directions
- Count how many upstream cells drain into each cell
- High accumulation values indicate larger upstream contributing areas; they do not alone establish flood depth or inundation

### Rainfall Distribution
- User provides rainfall intensity (mm/hr) and duration (hours)
- Planned simplification: distribute rainfall uniformly across all cells
- The conversion from rainfall and contributing area to stored water depth or another flood indicator remains unresolved and requires an explicit water-balance method

### Flood Threshold
- Planned simplification: classify cells as flooded when the selected indicator exceeds a documented threshold
- A depth threshold must not be used unless the computation produces defensible depth units
- Threshold selection, calibration, and validation remain unresolved

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
| `/api/simulate` | POST | Receive grid + rainfall params, return water state |
| `/api/analyze` | POST | Receive flood state + road/building data, return evacuation analysis |

## Response Format

All responses return JSON with:
- `terrain`: vertex positions, colors, and indices for mesh rendering
- `water`: grid of water-state or flood-indicator values; label values as depth only after a defensible depth calculation is defined and validated
- `metadata`: bounds, resolution, timestamps
