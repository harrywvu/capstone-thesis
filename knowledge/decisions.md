# Current Project Decisions

This file records the active project choices. The canonical scope and open questions are in [the capstone definition](00-capstone-definition.md).

## Identity and purpose

- **Name:** OverFlow.
- **Full capstone title:** OverFlow: A Geospatial Decision Support System for Flood Evacuation Planning.
- **Program:** BS Information Technology. Scientific Computing and Optimization is the research thrust.
- **Purpose:** Help local disaster planners and responders configure and compare flood evacuation scenarios. Residents are indirect beneficiaries. The system supports human planning decisions.
- **Study area and operator:** Laoag City and Batac City are candidates; neither is selected. No government office or deployment site is established as the project's confirmed setting. The area-of-interest request files for both cities do not establish selection or data access.

## System design

- **Presentation:** An interactive 3D geospatial system. Terrain, water, buildings, and roads are rendered in 3D; an overhead camera provides a map-like view. The DEM's two-dimensional raster grid is a computational input, not the dimension of the user-facing system.
- **Backend:** Python with FastAPI, NumPy, and SciPy handles DEM processing, terrain analysis, simulation, and evacuation analysis. Rasterio/GDAL may be used for file-based GeoTIFF input.
- **Frontend:** TypeScript with React, React Three Fiber, and shadcn/ui handles rendering and controls. The planned Leaflet map highlights a barangay boundary on hover and selects or deselects it on click; multiple barangays may be selected. No circle or polygon drawing is required.
- **Communication:** REST endpoints with JSON-compatible responses. The proposed interfaces are `/api/terrain`, `/api/simulate`, and `/api/analyze`; the contracts remain subject to implementation.
- **Data formats:** DEM source rasters are processed as NumPy elevation grids. GeoJSON is the interchange format for vector features such as roads, bridges, centers, boundaries, drainage references, and classified flood zones.

## Flood and evacuation analysis

- **Terrain method:** D8 flow direction and flow accumulation derive drainage paths and contributing area from a DEM.
- **Rainfall and classification:** Rainfall intensity and duration are scenario inputs. A uniform rainfall overlay and threshold classification are planned, but the rainfall-to-indicator formula, units, time stepping, threshold, and validation are unresolved. D8 alone does not calculate calibrated flood depth or flood timing.
- **Drainage infrastructure:** A reference map layer only. Pipes and canals are not part of the flood computation.
- **Operational inputs:** Read-only population baselines are distinct from the planner's editable expected evacuees per selected barangay, entered as a number or percentage. The planner also sets shelter status and usable capacity, manual road or bridge closures, available vehicles and their capacities, and assumed travel speed. A classification threshold may be offered as a sensitivity control once its meaning is defined.
- **Evacuation-analysis direction:** Remove manually closed road and bridge edges; use weighted shortest paths (NetworkX as the implementation direction); assign evacuees to reachable centers under usable-capacity limits (OR-Tools minimum-cost flow as the implementation direction); estimate travel and vehicle trips from stated speed and capacity assumptions. Report unserved demand and why it cannot be assigned. Exact weights, objective, alternate-route method, scheduling, and validation remain open.
- **Intended outputs:** Flood-affected areas, feasible and alternative routes, center assignments and capacity use, unserved demand, estimated evacuation time, resource information, scenario comparisons, and exportable scenario summaries.
- **Interpretation:** Results are planning estimates for relative scenario comparison. They are not calibrated hydraulic forecasts or autonomous emergency instructions.
- **Working demo boundary:** The existing demo uses synthetic geography and a separate simplified diffusion-wave-style runoff solver for illustrative depth. It does not implement or validate the planned D8-based rainfall classification. Keep the `sentinel-demo/` workspace path for its hosting configuration while presenting the product as OverFlow.

## Data and evaluation

- **Required categories:** DEM, road and bridge network, barangay boundaries, affected population, evacuation-center locations and capacities, and available rescue resources.
- **Candidate sources and current receipt:** NAMRIA, Phil-LiDAR, SRTM, and Mapbox Terrain-RGB remain terrain-source candidates; OpenStreetMap and local offices remain candidates for other data. The team has received Laoag City Hall files containing a DEM, boundaries, population, roads, and flood-susceptibility polygons. Their suitability, provenance, currency, and permitted use still need checking; no final study area is selected. See [the package assessment](data/02-laoag-city-hall-package.md).
- **Optional reference and validation data:** Drainage features, buildings, land use, waterways, and historical flood observations where accessible.
- **Terrain acquisition direction (2026-10-15):** Prefer a bare-earth DTM at 1–5 m for the pilot; evaluate good 5–10 m terrain if finer data is unavailable. These are practical targets, not universal minimums or guarantees of accuracy. The current approximately 91 m DEM supports broad terrain visualization and initial model experiments; the other City Hall layers remain useful. Request source/date/accuracy/reference-system metadata and ask City Engineering whether the supplied raster is original or a reduced-resolution export. Await the LiDAR response while continuing map and evacuation-workflow development. See [the detailed terrain guidance](data/01-dem-processing.md#terrain-acquisition-targets).
- **Evaluation:** The study area, partner organization, dataset, baselines, participants, metrics, and acceptance criteria remain to be selected. Route feasibility, constraint satisfaction, computation time, agreement with expert plans, usability, and scenario sensitivity are candidate measures.

## Planner workflow

The approved user actions are inventoried in [the diagram-ready user-actions list](01-user-actions.md). They include choosing one or more barangays, inspecting map layers and feature details, creating and editing a scenario, running analysis, inspecting results, and saving, reopening, duplicating, comparing, and exporting scenario summaries. These describe the planned final system, not the current synthetic demo.

## Manuscript

Use the official CCIS BSIT LaTeX structure and the full title beginning with **OverFlow**. The adviser and dean are Dr. Saturnina F. Nisperos. The panel members, in the order provided, are John David R. Vidad, Michael Angelo P. Burac, and Winchester R. Gerez. The cover's August 2026 date remains provisional, and the approval-sheet examination date is marked for confirmation.
