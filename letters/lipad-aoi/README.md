# LiPAD area-of-interest shapefiles

`laoag-city-aoi.zip` is the area-of-interest file for the confirmed Laoag City study area. `batac-city-aoi.zip` records the earlier two-city inquiry and should not be included in a revised Laoag-only request. Each ZIP contains one polygon and the four files LiPAD requires: `.shp`, `.shx`, `.dbf`, and `.prj`.

The polygons are simplified city boundaries from [geoBoundaries' Philippines ADM3 dataset](https://www.geoboundaries.org/api/current/gbOpen/PHL/ADM3/). Its metadata identifies NAMRIA, the Philippine Statistics Authority, and OCHA Philippines as sources; it represents 2020 boundaries and is distributed under CC BY 3.0 IGO. Coordinates are longitude/latitude in WGS 84 (CRS84). These are request-area outlines, not verified official boundaries for analysis or publication.

`aoi-preview.geojson` was exported from the finished shapefile ZIPs. Open it in a GeoJSON map viewer to inspect both polygons visually. Do not attach the preview file to the LiPAD request unless asked; attach the ZIPs.

Laoag City was confirmed as the study area on 2026-10-16. Any narrower pilot barangays remain to be selected. The simplified city outline is for requesting data, not a verified analysis boundary.
