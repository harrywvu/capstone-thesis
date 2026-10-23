# Laoag SAR flood-layer audit — 31 August 2026

**Checked 22 October 2026. Decision for the initial defense:** A real, dated PhilSA satellite-radar flood layer **does intersect Laoag**. It is suitable as an *illustrative observed-flood context layer* in the proposed system. It has **not** been validated as a complete citywide flood map or a road-closure map.

## Event and satellite evidence

| Check | Finding |
|---|---|
| Event | Enhanced southwest monsoon (Habagat), with Laoag flooding reported on 31 August 2026. |
| Event image | PhilSA's [31 August 2026 Sentinel-1C flood release](https://philsa.gov.ph/news/satellite-data-show-flood-extents-in-regions-1-2-3-4a-4b-car-and-ncr-due-to-enhanced-habagat/) gives **05:45 Philippine Standard Time** (21:45 UTC on 30 August) for the satellite snapshot. This is a historical observation, not a forecast. |
| Pre-event comparison | The data-source panel on PhilSA's `MAPS/Tile_No_15.png` lists **Sentinel-1C images from 9 May and 31 March 2026**, both at approximately 06:00 Philippine Standard Time, alongside the 31 August image. They are published reference acquisitions for PhilSA's composite. Their exact product IDs, relative orbit, polarization, and how seasonal land-cover differences were handled are not disclosed in the map. Thus the reference pair exists, but raw-image comparability has not been independently verified. |
| Actual map and vector | Open PhilSA's [public 31 August folder](https://tinyurl.com/Flood-20260831-S1C), then `MAPS/Tile_No_15.png` and `DATA/20260831_Flood_S1C_B1B5.{shp,shx,dbf,prj}`. The map tile's graticule includes Laoag (roughly 120°30′–121° E and 18°–18°30′ N) and visibly shows detections in the Laoag River/coastal-plain area. The downloaded vector is WGS 84 polygon data; its records carry `ImageDate=2026-08-31` and classes `Flooded Areas`, `Flooded Physical Rice Areas`, and `Flooded Crops`. This checks the actual mask, beyond the article's “Region 1” label. |
| Processing and water mask | PhilSA says it used AI-assisted detection from a composite of **three Sentinel-1 SAR images**. The tile says permanent water bodies and steep-terrain detections were excluded. It does not identify the AI model, threshold, permanent-water reference dataset/version, or quality score. Its map and article both warn that urban and vegetated flooding can be missed and that ground validation is needed. SAR works through cloud cover and at night. |
| Spatial resolution | PhilSA's map and shapefile do **not** state the effective resolution or positional accuracy of this derived flood product. Repeated polygon-edge steps are about **0.00008983°** (approximately 9.5 m east–west and 9.9 m north–south near Laoag), suggesting an approximately 10 m vectorization grid. This is a measurement of file coordinates, **not** a claim of 10 m detection accuracy. ESA's [Sentinel-1 product definition](https://sentinels.copernicus.eu/documents/247904/1877131/Sentinel-1-Product-Definition.pdf) gives 10 m pixel spacing and about 20 × 22 m effective resolution for *IW high-resolution GRD*; this particular PhilSA map does not identify its acquisition mode/product level, so those generic specifications cannot be assigned to it. |

## Laoag footprint and mask check

I downloaded the public PhilSA `.shp/.shx/.dbf/.prj` files from the folder above and intersected their polygons with the **80 coded Laoag barangay polygons** in the already-held City Hall administrative-boundary shapefile. I transformed the City Hall layer from PRS92 / Philippines zone III (EPSG:3123) to WGS 84 for intersection, unioned overlapping detections, and measured clipped area in WGS 84 / UTM zone 51N (EPSG:32651). The extra `Monroe Island` polygon without a barangay code was excluded. The City Hall layer's date, exact boundary accuracy, and reuse terms remain unverified, so the figures below are an **audit of overlap**, not an official flooded-area statistic.

| PhilSA vector class | Intersecting features | Candidate mapped area inside the 80 barangays |
|---|---:|---:|
| Flooded Areas | 83 | 34.0 ha |
| Flooded Physical Rice Areas | 125 | 770.2 ha |
| Flooded Crops | 25 | 6.0 ha |
| **Union of all three classes** | **233** | **810.2 ha** |

At least one candidate detection intersects **49 of the 80** barangay polygons. Some are small edge intersections. A barangay with no detected polygon must **not** be called dry: this positive-only vector file does not by itself establish that the entire barangay had usable image coverage or that urban/vegetated water was detectable. About 95% of the mapped Laoag area is in the *Flooded Physical Rice Areas* class, which particularly needs crop/field checks before it is treated as observed water on roads or in homes.

## Independent local comparison

- A [31 August, 14:58 report using Laoag CDRRMO information and photos](https://newsinfo.inquirer.net/2295750/floods-landslides-hit-several-areas-in-laoag-city) records flooding in **Barangay 2** and **Barangay 38-A (Mangato East)**, among other incidents. PhilSA polygons intersect both supplied barangay boundaries: **9.42 ha** in Barangay 2 (chiefly the rice class) and **1.57 ha** in 38-A (chiefly `Flooded Areas`). This is barangay-level *spatial consistency*, not proof that the mapped pixels coincide with the reported wet streets or homes.
- A [local 31 August, 11:49 CDRRMO interview](https://laoag.bomboradyo.com/pito-a-pamilya-naibakwit-gapu-iti-pannakalayos-ti-sumagmamano-a-barangay-ditoy-ciudad-ti-laoag/) reported seven evacuated families and rapidly receding water when rain stopped. A [2 September Philippine Information Agency interview with city officials](https://pia.gov.ph/news/laoag-city-bolsters-disaster-response-amid-heavy-rains-strong-winds) also reports flooding that subsided quickly and 31 families in evacuation centers. These support a real local event but do not give geolocated wet **and dry** observations at the **05:45** overpass time.
- The 31 August afternoon report also mentions a vehicle restriction in Barangay 52-B. The SAR polygon intersects that barangay, but neither source identifies the exact restricted road segment at the satellite time. Do not turn an intersecting SAR polygon into an automatic road closure.

**Interpretation:** This case supports the claim “a dated PhilSA SAR-derived flood polygon layer is available over Laoag and can be shown as historical hazard context.” It does **not** support sensitivity/specificity, depth, road-level passability, or complete detection across all 80 barangays. The existing prototype may show this as an example layer with source, acquisition time, classes, and caveat; road closure remains a planner input. A stronger evaluation later would require PhilSA's processing metadata and time-stamped, geolocated wet/dry CDRRMO records or independent imagery close to the overpass.

## Reproduction details

- PhilSA public source: [31 August folder](https://tinyurl.com/Flood-20260831-S1C), `DATA/20260831_Flood_S1C_B1B5.*`; `MAPS/Tile_No_15.png`. The public vector holds 57,278 polygons over its full regional extent. The overlay used only the 233 polygons intersecting Laoag's coded barangays.
- City Hall source: `/home/harrywvu/Downloads/RESEARCH PROJECT LAOAG CITY DATA/shape files/Administrative Boundary/Laoag Administratrive Boundary.shp` (see [package assessment](02-laoag-city-hall-package.md)). This source is outside the repository; do not publish it before checking permission.
- Public file fingerprints: SHA-256 `.shp` `99dc46ba9f693bf51c70897ecca1f470e15f676414f81c7870e28583c9edf700`; `.dbf` `2712ab70e3481cdbcb96e44fb69d1aa8d4e2806187581d2b56291e51a9d72e66`.
- Reproduce the overlay with [the audit script](../../scripts/audit_philsa_laoag.py), using Python packages `pyshp`, `shapely`, and `pyproj` and passing the two `.shp` paths shown above. Intersections are calculated from geometries, not map-image color or a province label. Area values are rounded to 0.1 ha.
