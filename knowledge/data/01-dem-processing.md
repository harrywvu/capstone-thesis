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

1. **Load or fetch** DEM coverage for the selected barangay boundaries resolved by the backend
2. **Decode** into NumPy 2D array (elevation values)
3. **Clean** — handle NoData values (fill or interpolate)
4. **Prepare for display** — optionally scale elevations for mesh rendering while retaining the original elevation units for terrain computation
5. **Export** — send grid as JSON to frontend for mesh generation

## Resolution Impact

| Resolution | Grid Size (1km²) | Vertices | Performance |
|---|---|---|---|
| 90m | 11×11 | 121 | Fast, coarse |
| 30m | 33×33 | 1,089 | Fast |
| 10m | 100×100 | 10,000 | Good |
| 5m | 200×200 | 40,000 | Moderate |
| 1m | 1000×1000 | 1,000,000 | Slow, may need LOD |

These grid counts illustrate computational size; actual performance depends on the model, hardware, and rendering approach. Source terrain resolution and the computational/display grid are separate choices. The earlier **10–30 m working-grid target** was a provisional performance choice, not a requirement or evidence that a source dataset is suitable for street-level flood analysis.

The supplied Laoag GeoTIFF has about **91.25 m cells**. Each cell supplies one elevation value for roughly a 91 × 91 m area, potentially hiding elevation differences among roads, drainage paths, and buildings. It remains useful for broad terrain visualization and initial model experiments, but cannot by itself establish precise street-level flood extent. This limitation concerns the elevation file; it does not invalidate the roads, boundaries, population, and hazard-reference data in the City Hall package. See [the package assessment](02-laoag-city-hall-package.md).

## Terrain Acquisition Targets

Recorded from the team discussion on 2026-10-15. These are practical targets to evaluate for the pilot area, not universal minimum requirements, model-specific cutoffs, or guarantees of flood accuracy.

| Source terrain cell spacing | Proposed use or assessment |
|---|---|
| About 91 m (current file) | Broad terrain visualization and initial model experiments |
| 10–30 m | Broad flood-pattern exploration, with limited street detail |
| 5–10 m | Useful improvement worth testing on a small pilot area |
| 1–5 m | Preferred acquisition target for detailed local flood analysis |

Cell spacing is horizontal sampling detail, not vertical accuracy. Check source method, collection date, vertical accuracy, units and datum, coordinate reference system, coverage, and use rights before choosing the research terrain. Resampling a coarse raster to smaller cells does not add measured terrain detail.

### LiDAR request

Request a **bare-earth digital terrain model (DTM)** for the pilot area, preferably at 1–5 m native or source-supported resolution, together with its metadata. A good 5–10 m DTM is worth evaluating if finer data is unavailable. A digital surface model (DSM) may include rooftops and vegetation and should not be assumed interchangeable with ground elevation. Request the collection date, documented vertical accuracy, horizontal and vertical reference systems, elevation units, source resolution, coverage, and permitted use. Availability remains unconfirmed while awaiting the LiDAR response.

[HEC-RAS terrain guidance](https://www.hec.usace.army.mil/confluence/rasdocs/rmum/latest/terrain-layer) describes using a DTM for the bare-earth ground surface. It supports the terrain-type distinction; the resolution ranges above are project planning recommendations, not thresholds prescribed by that source.

### City Engineering follow-up

Ask whether `ELEVATION.tif` is the original elevation dataset or a reduced-resolution export and whether a finer source dataset is available. Neither explanation has been established from the current file assessment.

### Work that can continue

Proceed with barangay selection, scenario controls, geographic-layer preparation, road-network cleaning, and evacuation-planning logic while terrain access is being resolved. Match flood-detail claims to the terrain and validation evidence actually available.
