# Data Sources

## Primary Data

### DEM (Digital Elevation Model)
**Priority: Highest — required for water simulation**

| Source | Resolution | Access | Notes |
|---|---|---|---|
| NAMRIA | 1m-5m | Request via LGU | Best local accuracy for Philippines |
| Phil-LiDAR | 1m-3m | Phil-LiDAR project portal | High resolution, availability varies |
| SRTM (via Open Elevation) | 30m-90m | Free API, no key needed | Global coverage, lower resolution |
| Mapbox Terrain-RGB | 5-10m | API key required, paid tier | Good middle ground, tile-based |

**Action item:** Determine which source is accessible. NAMRIA/Phil-LiDAR require formal requests to LGU.

### OpenStreetMap (OSM)
**Priority: High — required for roads, buildings, boundaries**

| Data Type | Use | Export Format |
|---|---|---|
| Roads | Route calculation, road closures | GeoJSON / Shapefile |
| Buildings | Affected structures, population density | GeoJSON |
| Waterways | River/drainage reference | GeoJSON |
| Land use | Land cover classification | GeoJSON |

**Access:** Free via OpenStreetMap export or Overpass API. Use bounding box from user selection.

### Candidate LGU Data (Laoag City only if selected)
**Priority: High — required for evacuation planning**

| Data | Source | Contact |
|---|---|---|
| Barangay boundaries | Laoag City Planning Office | Formal letter required |
| Evacuation centers + capacity | CDRRMO | Formal letter required |
| Population per barangay | PSA / Laoag LGU | May be in PSA reports |
| Flood hazard maps (if any) | CDRRMO | For validation only |

Laoag City remains a candidate study area. Replace these offices with the corresponding agencies after the team confirms the locality and operating organization.

## Data Pipeline

```
User selects area (Leaflet)
        ↓
Bounding box coordinates
        ↓
┌───────┴───────┐
↓               ↓
DEM fetch       OSM export
↓               ↓
Elevation grid  GeoJSON layers
↓               ↓
NumPy array     GeoJSON response
↓               ↓
Water sim       Route analysis
↓               ↓
Flood state     Evacuation plan
└───────┬───────┘
        ↓
    API response
        ↓
    R3F rendering
```
