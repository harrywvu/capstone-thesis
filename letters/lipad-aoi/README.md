# LiPAD area-of-interest shapefiles

Attach `laoag-city-aoi.zip` and `batac-city-aoi.zip` to the LiPAD data-request email without extracting them. Each ZIP contains one polygon and the four files LiPAD requires: `.shp`, `.shx`, `.dbf`, and `.prj`.

The polygons are simplified city boundaries from [geoBoundaries' Philippines ADM3 dataset](https://www.geoboundaries.org/api/current/gbOpen/PHL/ADM3/). Its metadata identifies NAMRIA, the Philippine Statistics Authority, and OCHA Philippines as sources; it represents 2020 boundaries and is distributed under CC BY 3.0 IGO. Coordinates are longitude/latitude in WGS 84 (CRS84). These are request-area outlines, not verified official boundaries for analysis or publication.

`aoi-preview.geojson` was exported from the finished shapefile ZIPs. Open it in a GeoJSON map viewer to inspect both polygons visually. Do not attach the preview file to the LiPAD request unless asked; attach the ZIPs.

The two cities are candidate study areas. The final study area and any narrower pilot barangays remain to be confirmed.
