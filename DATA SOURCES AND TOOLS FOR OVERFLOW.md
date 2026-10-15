# Data Sources and Tools for OverFlow

This is the current data-acquisition and processing plan for **OverFlow: A Geospatial Decision Support System for Flood Evacuation Planning**. OverFlow is planned as a 3D geospatial planning system, not an operational flood forecast.

## Study area and data status

Laoag City and Batac City are candidate study areas. Neither is selected. The area-of-interest files in `letters/lipad-aoi/` support elevation-data requests; they do not verify data access, geographic suitability, or partner approval. The final city, pilot barangays, operating organization, and deployment arrangement remain to be agreed with the adviser and partner office.

## Core inputs to request and validate

| Data | Candidate source | Planned role |
|---|---|---|
| Digital elevation model (DEM) | NAMRIA, Phil-LiDAR, SRTM, or another accessible provider | Terrain rendering and D8 flow direction/accumulation |
| Roads, intersections, and bridges | OpenStreetMap, city engineering office, DPWH | Route graph and scenario closures |
| Barangay boundaries | City planning office, NAMRIA | Geographic units for population and results |
| Affected population by barangay | City planning office, CDRRMO | Evacuation demand |
| Evacuation centers, capacity, status, and location | CDRRMO, barangay offices | Candidate destinations and capacity constraints |
| Vehicles and other available resources | CDRRMO | Scenario resource constraints |

Request dataset provenance, coverage, coordinate reference system, resolution, collection/update date, completeness, accuracy, and usage permissions. Actual access and local coverage have not been established.

## Reference and validation inputs

Drainage canals, culverts, rivers, waterways, flood-control structures, flood-prone roads, historical flood extents, buildings, and other local hazard maps should be requested where available. Drainage infrastructure is a **reference layer**, not an input to the planned D8 flood computation. Historical flood and local hazard records may help evaluate results, but their availability and suitability are unconfirmed.

## Processing and model boundary

1. Acquire and document source datasets for the selected area; verify rights and local coverage.
2. Clean and align spatial data. Preserve original DEM elevations for computation, handle NoData cells, document the working-grid resolution, and use display scaling only for rendering.
3. Derive D8 flow direction and flow accumulation from the DEM. Rainfall intensity and duration are scenario inputs, but the rainfall-to-indicator formula, units, time stepping, classification threshold, and validation procedure still need definition. D8 alone does not produce calibrated flood depth or timing.
4. Prepare road, bridge, boundary, center, and reference layers for the backend and 3D frontend. GeoJSON is a candidate exchange format for vector layers; source rasters should retain appropriate raster formats and metadata.
5. Apply scenario conditions to route, center, time, and resource analyses, then compare planning alternatives. These methods and evaluation criteria require final specification.

The current working demo in `sentinel-demo/` and `demo-api/` uses **synthetic geography** and a separate, simplified diffusion-wave-style runoff solver. It does not implement or validate the intended D8-based rainfall classification. Demo outputs are illustrative, not geographic findings or emergency guidance. The demo folder path is retained because it is tied to the existing hosting workspace.

## Tools and deployment

QGIS is a candidate for inspection and preparation. The planned backend uses Python, FastAPI, NumPy, and SciPy, with rasterio/GDAL when file-based DEM processing is needed. The planned frontend uses React, React Three Fiber, shadcn/ui, and Leaflet for controls and geospatial display. Tool choices remain subject to implementation needs and data formats.

Deployment has not been chosen. Options include an office workstation/local network, an institution-controlled browser deployment, or a controlled research prototype. Selection should consider connectivity, permissions, privacy, backups, maintenance, and whether the system is only for preparedness exercises. No operational emergency use is assumed.

## Decisions still needed

- Select the study area, pilot coverage, partner office, and obtainable datasets.
- Define and validate the rainfall-to-flood-classification method.
- Specify route, shelter-allocation, evacuation-time, and resource-allocation methods.
- Agree on evaluation baselines, participants, metrics, and acceptance thresholds.
- Confirm deployment and data-governance arrangements.

Detailed definitions and design assumptions are maintained in `knowledge/00-capstone-definition.md`, `knowledge/architecture/`, and `knowledge/data/`.
