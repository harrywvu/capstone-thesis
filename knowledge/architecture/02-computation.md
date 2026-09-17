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
1. Fetch or load DEM data for selected bounding box
2. Convert to NumPy elevation grid (2D array)
3. Normalize and resolve NoData values
4. Optionally downsample for performance

### Water Simulation — D8 Flow Direction
- For each cell in the grid, determine which of 8 neighbors is steepest downhill
- Assign flow direction as a encoded value (1-8, one per neighbor direction)
- No flow if cell is a local minimum (depression/sink)

### Flow Accumulation
- Starting from each cell, trace downstream following flow directions
- Count how many upstream cells drain into each cell
- High accumulation values = areas where water collects (potential flood zones)

### Rainfall Distribution
- User provides rainfall intensity (mm/hr) and duration (hours)
- Distribute total rainfall uniformly across all cells
- Apply flow accumulation over time steps to simulate water movement

### Flood Threshold
- Cells where accumulated water exceeds a threshold depth = "flooded"
- Threshold adjustable by user for sensitivity analysis

## API Endpoints (Planned)

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/terrain` | POST | Receive bounding box, return elevation grid + mesh data |
| `/api/simulate` | POST | Receive grid + rainfall params, return water state |
| `/api/analyze` | POST | Receive flood state + road/building data, return evacuation analysis |

## Response Format

All responses return JSON with:
- `terrain`: vertex positions, colors, and indices for mesh rendering
- `water`: grid of water depth values per cell
- `metadata`: bounds, resolution, timestamps
