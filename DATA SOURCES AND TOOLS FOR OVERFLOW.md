# Data Sources and Tools for OverFlow

This is the current data-acquisition and processing plan for **OverFlow: A Geospatial Decision Support System for Flood Evacuation Planning**. OverFlow is planned as a 3D geospatial planning system, not an operational flood forecast.

## Study area and data status

**Laoag City, Ilocos Norte is the confirmed study area.** Batac City was an earlier candidate and is no longer part of the active request. The area-of-interest files in `letters/lipad-aoi/` document the earlier two-city inquiry; they do not verify data access or geographic suitability. Barangays 38-A, 38-B, and 39 were chosen for the SFINCS technical pilot; final evaluation coverage, operating organization, and deployment arrangement remain unresolved. UP TCAGP/LiPAD has replied as a prospective source of DTM data, but Laoag-specific coverage, NDA clearance, metadata, and delivery remain pending. See `knowledge/data/03-lipad-response.md`.

## Core inputs to request and validate

| Data | Candidate source | Planned role |
|---|---|---|
| Digital elevation model (DEM/DTM) | Supplied Laoag City Hall raster; UP TCAGP/LiPAD as a confirmed prospective DTM provider; NAMRIA or another suitable provider as alternatives | Terrain rendering and SFINCS model setup; optional D8 drainage reference |
| Roads, intersections, and bridges | OpenStreetMap, city engineering office, DPWH | Route graph and scenario closures |
| Barangay boundaries | City planning office, NAMRIA | Geographic units for population and results |
| Affected population by barangay | City planning office, CDRRMO | Evacuation demand |
| Evacuation centers, capacity, status, and location | CDRRMO, barangay offices | Candidate destinations and capacity constraints |
| Vehicles and other available resources | CDRRMO | Scenario resource constraints |

Request dataset provenance, coverage, coordinate reference system, resolution, collection/update date, completeness, accuracy, and usage permissions. The City Hall package is in hand, but LiPAD DTM access and its exact Laoag coverage have not been established.

## Reference and validation inputs

Drainage canals, culverts, flood-control structures, flood-prone roads, buildings, and other local hazard maps should be requested where available. Pipes and canals remain **reference layers** under the current scope. Verified river/channel geometry and elevation, a defensible water boundary, dated rainfall, and observed flooded and dry places are needed to configure and evaluate the selected SFINCS method. These inputs are assumed accessible for planning but remain unreceived or unverified. LiPAD's reply did not confirm the requested Flood Hazard Maps for Laoag.

## Processing and model boundary

1. Acquire and document source datasets for the selected area; verify rights and local coverage.
2. Clean and align spatial data. Preserve original DEM elevations for computation, handle NoData cells, document the working-grid resolution, and use display scaling only for rendering.
3. Configure SFINCS with suitable terrain, rainfall, and physically supported river/boundary conditions. Check numerical output and compare a dated run with independent flooded and dry observations before making local accuracy claims. D8 may be retained only as a separate drainage-reference view.
4. Prepare road, bridge, boundary, center, and reference layers for the backend and 3D frontend. GeoJSON is a candidate exchange format for vector layers; source rasters should retain appropriate raster formats and metadata.
5. Apply scenario conditions to route, center, time, and resource analyses, then compare planning alternatives. These methods and evaluation criteria require final specification.

The current working demo in `sentinel-demo/` and `demo-api/` uses **synthetic geography** and a separate, simplified diffusion-wave-style runoff solver. It does not implement or validate the selected SFINCS method. Demo outputs are illustrative, not geographic findings or emergency guidance. The demo folder path is retained because it is tied to the existing hosting workspace.

## Tools and deployment

QGIS is a candidate for inspection and preparation. The planned backend uses Python, FastAPI, NumPy, and SciPy, with rasterio/GDAL when file-based DEM processing is needed. The planned frontend uses React, React Three Fiber, shadcn/ui, and Leaflet for controls and geospatial display. Tool choices remain subject to implementation needs and data formats.

Deployment has not been chosen. Options include an office workstation/local network, an institution-controlled browser deployment, or a controlled research prototype. Selection should consider connectivity, permissions, privacy, backups, maintenance, and whether the system is only for preparedness exercises. No operational emergency use is assumed.

## Decisions still needed

- Confirm whether the technical-pilot barangays are suitable for the final event evaluation; select the partner office and obtain the remaining datasets, including LiPAD DTM access and terms.
- Configure and locally evaluate the selected SFINCS method, including its terrain, river/boundary, forcing, and validation evidence.
- Specify route, shelter-allocation, evacuation-time, and resource-allocation methods.
- Agree on evaluation baselines, participants, metrics, and acceptance thresholds.
- Confirm deployment and data-governance arrangements.

Detailed definitions and design assumptions are maintained in `knowledge/00-capstone-definition.md`, `knowledge/architecture/`, and `knowledge/data/`.
