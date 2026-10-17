# Data Needs Overview

This document lists data requests for OverFlow in its confirmed study area, **Laoag City, Ilocos Norte**. Batac City was an earlier candidate. UP TCAGP/LiPAD has replied as a prospective DTM provider, but no LiPAD dataset has been reported as delivered; exact Laoag coverage and use terms remain pending.

## Required Data

| Data | Source Organization | Format |
|---|---|---|
| Bare-earth elevation/terrain (DTM or DEM) | Supplied Laoag City Hall raster; UP TCAGP/LiPAD for prospective DTM; NAMRIA as an alternative | GeoTIFF or other documented raster format |
| Road network (geometries, names, classification, bridges) | City Engineering Office, OpenStreetMap | GeoJSON, Shapefile |
| Evacuation centers (name, location, capacity, current occupancy) | CDRRMO, Barangay Offices | Spreadsheet, GeoJSON |
| Evacuation center accessibility and flood vulnerability | CDRRMO | Spreadsheet |
| Affected population per barangay | City Planning Office, CDRRMO | Spreadsheet |
| Barangay boundaries | City Planning Office, NAMRIA | GeoJSON, Shapefile |
| Rescue vehicles and resources | CDRRMO | Spreadsheet |
| River/channel geometry and downstream boundary information | City Engineering Office or relevant water-management office | Survey, GIS layer, level/discharge records |
| Dated event rainfall and observed flooded and dry locations | CDRRMO and relevant rainfall-data office | Time series and geolocated records |

## Reference and Validation Data

| Data | Source Organization | Format |
|---|---|---|
| Drainage infrastructure (canals, waterways, culverts, rivers) | City Engineering Office | GeoJSON, Shapefile |
| Historical flood data (affected areas, extent, dates) | CDRRMO | Spreadsheet, maps |
| Flood-prone area mapping | CDRRMO, City Engineering Office | Maps, GeoJSON |

## Notes

- OpenStreetMap data can be downloaded directly without requesting; used as base layer.
- LiPAD has replied that DTM is distributable, subject to exact Laoag coverage and its NDA process. The requested Flood Hazard Maps were not confirmed in that reply.
- Pipes and canals remain reference map layers under the current scope; river/channel and downstream-boundary evidence are needed for SFINCS setup.
- SFINCS is the selected flood-scenario method. Its Laoag setup needs suitable terrain, forcing, and local observed-event evaluation before flood-map accuracy can be claimed. D8 may remain only an optional drainage-reference layer. The synthetic working demo uses a separate method.
- The primary request to local government is for CDRRMO, Engineering Office, and Planning Office data.
