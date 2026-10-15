# Data Needs Overview

This document lists candidate data requests for OverFlow. Laoag City and Batac City remain candidate study areas; availability has not been verified.

## Required Data

| Data | Source Organization | Format |
|---|---|---|
| Elevation/terrain (DEM/DSM) | NAMRIA, Phil-LiDAR | GeoTIFF, ASC |
| Road network (geometries, names, classification, bridges) | City Engineering Office, OpenStreetMap | GeoJSON, Shapefile |
| Evacuation centers (name, location, capacity, current occupancy) | CDRRMO, Barangay Offices | Spreadsheet, GeoJSON |
| Evacuation center accessibility and flood vulnerability | CDRRMO | Spreadsheet |
| Affected population per barangay | City Planning Office, CDRRMO | Spreadsheet |
| Barangay boundaries | City Planning Office, NAMRIA | GeoJSON, Shapefile |
| Rescue vehicles and resources | CDRRMO | Spreadsheet |

## Reference and Validation Data

| Data | Source Organization | Format |
|---|---|---|
| Drainage infrastructure (canals, waterways, culverts, rivers) | City Engineering Office | GeoJSON, Shapefile |
| Historical flood data (affected areas, extent, dates) | CDRRMO | Spreadsheet, maps |
| Flood-prone area mapping | CDRRMO, City Engineering Office | Maps, GeoJSON |

## Notes

- OpenStreetMap data can be downloaded directly without requesting; used as base layer.
- DEM data may be obtainable from NAMRIA or Phil-LiDAR without local government request, but local verification helps.
- Drainage is a reference map layer, not part of the planned D8 computation. Historical flood information may support validation if suitable records are available.
- The planned 3D system uses a DEM for D8 terrain analysis; its rainfall-to-flood classification remains to be defined and validated. The synthetic working demo uses a separate method.
- The primary request to local government is for CDRRMO, Engineering Office, and Planning Office data.
