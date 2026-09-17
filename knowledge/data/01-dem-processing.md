# DEM Data Processing

## What is DEM

A Digital Elevation Model is a 2D grid where each cell stores the ground elevation at that point. It represents terrain topography.

```
Example (small grid):
┌─────┬─────┬─────┬─────┐
│ 120 │ 118 │ 115 │ 112 │  ← elevation in meters
├─────┼─────┼─────┼─────┤
│ 122 │ 120 │ 117 │ 114 │
├─────┼─────┼─────┼─────┤
│ 125 │ 123 │ 121 │ 118 │
├─────┼─────┼─────┼─────┤
│ 128 │ 126 │ 124 │ 121 │
└─────┴─────┴─────┴─────┘
Water flows from high (128) to low (112)
```

## Processing Steps

1. **Fetch** DEM data for selected bounding box
2. **Decode** into NumPy 2D array (elevation values)
3. **Clean** — handle NoData values (fill or interpolate)
4. **Normalize** — optional, scale elevations for consistent simulation
5. **Export** — send grid as JSON to frontend for mesh generation

## Resolution Impact

| Resolution | Grid Size (1km²) | Vertices | Performance |
|---|---|---|---|
| 90m | 11×11 | 121 | Fast, coarse |
| 30m | 33×33 | 1,089 | Fast |
| 10m | 100×100 | 10,000 | Good |
| 5m | 200×200 | 40,000 | Moderate |
| 1m | 1000×1000 | 1,000,000 | Slow, may need LOD |

For the capstone, **10m-30m resolution** is recommended as a balance between detail and performance.
