# Data Sources

## Primary Data

### DEM (Digital Elevation Model)
**Priority: Highest — required for terrain analysis**

| Candidate source | What to verify | Planning role |
|---|---|---|
| NAMRIA | Coverage, native resolution, access procedure, and license | Candidate official terrain source |
| Phil-LiDAR | Coverage, native resolution, access procedure, and license | Candidate high-detail terrain source |
| SRTM | Download source, resolution, coordinate system, and suitability | Candidate broader-coverage terrain source |
| Mapbox Terrain-RGB | Tile access, licensing, effective source detail, and decoding | Candidate tile-based elevation source |

**Current evidence:** A Laoag City Hall package includes a GeoTIFF elevation grid at about 91.25 m cell spacing. See [the package assessment](02-laoag-city-hall-package.md) for its measured properties and limits. Verify its original source, accuracy, units, license, and city coverage before selecting it for analysis. Laoag City and Batac City remain candidate sites; the LiPAD area-of-interest request files for both do not prove access. Do not infer native terrain detail from display zoom level or a resampled grid.

**Acquisition direction:** Seek a bare-earth DTM, preferably 1–5 m for the pilot area; a good 5–10 m dataset is worth testing. These are practical targets, not universal minimum requirements or guarantees of accuracy. Request collection date, documented vertical accuracy, horizontal/vertical reference systems, units, source resolution, coverage, and permitted use. Ask City Engineering whether the supplied file is the original or a reduced-resolution export and whether finer terrain is available. The LiDAR response is pending. The existing coarse DEM and other City Hall layers still support prototype and evacuation-planning development. See [terrain targets and follow-up details](01-dem-processing.md#terrain-acquisition-targets).

### OpenStreetMap (OSM)
**Priority: High — roads and boundaries are required; buildings are optional**

| Data Type | Use | Export Format |
|---|---|---|
| Roads | Route calculation, road closures | GeoJSON / Shapefile |
| Buildings | Affected structures, population density | GeoJSON |
| Waterways | River/drainage reference | GeoJSON |
| Land use | Land cover classification | GeoJSON |

**Access to assess:** OpenStreetMap export or Overpass API for the selected bounding box. Verify local feature completeness, geometry, attribution requirements, and update date.

### Local Government Data
**Priority: High — required for evacuation planning**

| Data | Candidate source | Access to confirm |
|---|---|---|
| Barangay boundaries | Selected local planning office or NAMRIA | Request or open-data availability |
| Evacuation centers + capacity | Selected local DRRM office | Request and facility validation |
| Population per barangay | PSA or selected local government | Availability and date of counts |
| Rescue vehicles and resources | Selected local DRRM office | Inventory and operating assumptions |
| Flood hazard maps (if any) | Selected local DRRM office | Validation use and licensing |

The supplied Laoag City Hall package verifies possession of local boundary, population, road, DEM, flood-susceptibility, and reference layers. It does not include the operational evacuation-center register and current resource inventory needed for full planning analysis. See [the package assessment](02-laoag-city-hall-package.md). Laoag City and Batac City remain candidate study areas; the operating organization is unselected. Confirm coverage, currency, accuracy, and permitted use before adopting any layer as a final research input.

## Data Pipeline

1. The planner selects one or more prepared barangay boundaries on the Leaflet map; the interface sends their identifiers to the backend, which resolves their combined geographic coverage.
2. The backend loads or fetches the DEM and prepares an elevation grid. It also loads available road, boundary, center, and reference layers as GeoJSON.
3. D8 flow direction and flow accumulation are derived from the DEM. The rainfall-to-flood-indicator method and classification threshold must be defined and validated before flood-affected cells are reported.
4. Manual closures constrain the road network; any automatic closure from classified flood exposure needs a defined, validated rule. Read-only population data provides a reference, while the planner enters expected evacuees separately. Weighted routing, reachable-center capacity allocation, travel/vehicle estimates, and explicit unserved demand use these scenario values and available facility data.
5. JSON-compatible API responses provide terrain geometry and scenario results for 3D rendering and comparison in the frontend.

The current `sentinel-demo/` and `demo-api/` prototype is a separate synthetic demonstration. Its simplified diffusion-wave-style runoff solver produces illustrative depth and does not implement or validate the proposed D8-based rainfall classification.
