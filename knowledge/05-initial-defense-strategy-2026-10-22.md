# Initial-defense working strategy — 22 October 2026

**Status:** A proposed revision for team and adviser review. The defense requires Chapters 1–4 and a prototype; a completed operational system is not required. Laoag City and all 80 barangays are the intended citywide planning scope. The existing application is a synthetic interaction prototype, while the Laoag SFINCS runs are technical experiments. Neither demonstrates a validated citywide flood model.

## Proposed defensible scope

> OverFlow is a proposed Laoag City flood-evacuation planning tool covering all 80 barangays. A planner selects barangays and enters expected evacuees, usable capacities for listed evacuation areas, and road closures. The tool compares road-distance routes, reachable-area assignments, capacity use, and unserved demand under those inputs. Official susceptibility layers and date-stamped satellite-radar flood extents, where coverage is verified, provide hazard context for planner review. A SAR extent records water detected at a satellite acquisition time; it does not predict the extent or depth of a future rainfall scenario. The current prototype illustrates the workflow with synthetic geography and values.

Citywide selection and scenario analysis are proposed for all 80 barangays. Flood observations may cover only the dates and places imaged by a satellite. Any area with no verified road connection or listed center must show an explicit data or capacity gap rather than an invented assignment.

### Proposed research questions

1. How can available boundary, population, road, evacuation-area, and flood-reference data be organized for scenario planning across Laoag City's 80 barangays?
2. How do planner-entered demand, road closures, and usable center capacity change reachable routes, assignments, and unserved demand?
3. How well does the proposed workflow perform its specified planning tasks, and how do participating staff assess its clarity and usefulness if staff evaluation is permitted?

The earlier SFINCS method remains a technical feasibility stream in the existing knowledge base. Under the team's stated assumption that finer terrain, local rainfall, river/boundary conditions, and ground flood observations will not arrive in time, SFINCS cannot be a guaranteed source of validated citywide flood depths. Whether it remains an optional research module or is deferred needs an explicit team/adviser scope decision before Chapters 1–4 are rewritten.

## Simple proposed calculations

1. **Origins:** Represent each selected barangay by a documented road access point, snapped to the cleaned road network. A polygon centroid alone may fall away from a usable road.
2. **Demand:** Use the 2024 PSA barangay count as a population reference. The planner enters an expected evacuation number or percentage; population is not automatically evacuation demand.
3. **Roads:** Use actual road length in metres as the first route weight. Exclude a road only after the planner marks it closed. Report an unreachable origin if no path remains. The resulting route is shortest by mapped distance under the chosen closures, not necessarily fastest or safest.
4. **Centers:** Use only the evacuation areas actually supplied or subsequently verified. The planner enters their usable capacities for a scenario until official capacities are obtained. First maximize the number served, then minimize total road distance among reachable assignments while respecting those capacities. A minimum-cost flow formulation can implement this; an explicit unserved category records demand that cannot fit or reach a listed area.
5. **Vehicles and clearance time:** The team reports no current fleet inventory. Treat vehicle count as a labeled hypothetical prototype input or remove it from the minimum research objectives. Do not report a real clearance-time or resource plan without fleet, occupancy, loading, speed, and scheduling assumptions.
6. **Hazard layers:** Show static susceptibility and event-specific SAR extent with their dates, sources, coverage, and limitations. Flag intersecting roads for review, but do not automatically declare them closed or safe.

## Why the Chapter 3 instruments exist

- **Interview guide:** A short, consistent set of questions for CDRRMO staff about how they currently select areas, close roads, check shelter space, and compare plans. It documents requirements and checks whether proposed controls match practice. It is a plan for later work, not evidence that interviews have happened.
- **Task sheet:** A written set of actions (select a barangay, enter demand, close a road, change a center capacity, compare two scenarios) with expected outcomes. It gives reproducible functional tests and, if staff participate, shows whether they can complete the workflow.
- **Questionnaire:** Optional brief ratings and comments after staff tasks. It captures clarity and perceived usefulness that pass/fail software tests cannot measure. If participation is unavailable, report functional tests and do not claim staff usability findings.

Draft instruments may be shown at the initial defense. Recruitment, consent, ethics review, administration, and results remain future work.

## Free or already-held source shortlist

| Need | Practical source | Use and limit |
|---|---|---|
| All 80 barangays and population | [PSA Laoag barangay list and 2024 census counts](https://psa.gov.ph/classification/psgc/barangays/0102812000) | PSA lists 80 barangays and a city total of 112,117. Join by codes after checking differences from City Hall labels. These are residents, not expected evacuees. |
| Barangay polygons | City Hall package already held; [GeoRiskPH PSA map service](https://portal.georisk.gov.ph/arcgis/rest/services/PSA/Barangay/MapServer) as an indicative public fallback | The GeoRiskPH geometry describes 2016 boundaries. Check current codes, geometry, and reuse terms. Confirm City Hall's permission before publishing its polygons. |
| Roads | City Hall network already held; [Geofabrik Philippines OSM extract](https://download.geofabrik.de/asia/philippines.html) as a second source | OSM is freely available under ODbL with attribution. Compare road coverage, bridge details, connectedness, and dates; neither source is automatically a ready-to-route graph. |
| Evacuation areas | CDRRMO areas reported by the team; OSM places only as candidate cross-checks | The reported list is small and its actual file/metadata has not been audited here. A school or sports hall is not automatically an approved evacuation area. Capacity and status still need a source or an explicit scenario assumption. |
| Static flood context | City Hall 5-year susceptibility polygon; [HazardHunterPH](https://hazardhunter.georisk.gov.ph/index.php/map) | Reference hazard information, with source date and terms checked. Static susceptibility does not describe one observed storm. |
| Historical SAR flood extents | [PhilSA August 2026 flood maps and shapefiles](https://philsa.gov.ph/news/satellite-data-show-flood-extents-in-regions-1-2-3-4a-4b-car-and-ncr-due-to-enhanced-habagat/); [Copernicus Global Flood Monitoring](https://documentation.dataspace.copernicus.eu/APIs/openEO/openeo-community-examples/python/20_data-discovery/global-flood-monitoring/global-flood-monitoring.html) | The PhilSA **31 August 2026** vector has been checked against Laoag polygons; see the [case audit](data/04-laoag-sar-2026-08-31-audit.md). It remains an unvalidated satellite snapshot. GFM is another free source, but its Laoag event mask was not needed for this check. |
| Raw SAR imagery | [Copernicus Data Space Browser](https://documentation.dataspace.copernicus.eu/Applications/Browser.html) and [official pre/post Sentinel-1 example](https://documentation.dataspace.copernicus.eu/APIs/openEO/openeo-community-examples/python/50_thematic-notebooks/flood-mapping/flood-sar.html) | Free account access. If the team reproduces the PhilSA map, verify the 31 August, 9 May, and 31 March product IDs, relative orbits, polarization, and preprocessing; the published map alone does not give these details. |
| Broad elevation | [Copernicus DEM GLO-30](https://documentation.dataspace.copernicus.eu/Data/Others/CCM.html?q=COP-DEM_GLO-30-DGED) or [USGS SRTM 1 arc-second](https://www.usgs.gov/centers/eros/science/usgs-eros-archive-digital-elevation-shuttle-radar-topography-mission-srtm-1) | About 30 m postings, useful for broad terrain context. Copernicus GLO-30 is a surface model containing vegetation/buildings and requires CCM registration. Neither establishes street-scale flood depths. |
| Historical rainfall context | [NASA GPM IMERG half-hourly](https://disc.gsfc.nasa.gov/datasets/GPM_3IMERGHH_07/summary) | Estimated rainfall on about a 0.1-degree grid. Useful for describing a dated event, not measuring rain at each Laoag street. |
| River reference | [HydroRIVERS](https://www.hydrosheds.org/products/hydrorivers) and OSM waterways | Broad river network context only; neither supplies river-bed elevations, flood-stage time series, or a defensible SFINCS boundary. |
| Local problem evidence | [DSWD Egay situation report, 12 September 2023](https://dromic.dswd.gov.ph/wp-content/uploads/2023/09/DSWD-DROMIC-Report-39-on-the-Effects-of-Southwest-Monsoon-and-Super-Typhoon-Egay-as-of-12-September-2023-6PM.pdf) | Reports 78 affected Laoag barangays and 45,498 affected persons. These are storm/monsoon impacts, not verified flood-only or evacuation-demand counts. |

## Chapter 1–4 changes if this scope is adopted

- **Chapter 1:** Keep the 80-barangay Laoag scope. Reword guaranteed citywide flood-depth, vehicle, and travel-time outputs. Define the contribution as a transparent scenario comparison and assignment workflow using source-labeled hazard evidence.
- **Chapter 2:** Add a short SAR flood-mapping section supported by relevant literature and distinguish observed flood extent from predicted flood scenarios. Tie the research gap to the simplified planning workflow.
- **Chapter 3:** State the distance-weighted route rule, capacity-limited assignment, manual closures, fallback for missing centers/capacities, SAR acquisition/processing checks, and the planned functional and staff tests. Use future/conditional tense for work not completed.
- **Chapter 4:** Present the ten diagrams as design artifacts and the existing application as a synthetic prototype. Align every diagram with the revised scope. Report only completed prototype checks or the technical SFINCS pilot as such; staff and citywide system results remain pending.

## SAR check completed for Laoag

The [31 August 2026 PhilSA Sentinel-1C case audit](data/04-laoag-sar-2026-08-31-audit.md) checks the actual public flood shapefile against the 80 supplied Laoag barangay polygons. Candidate detections intersect 49 barangays (about 810.2 ha in total, mostly classified as flooded physical rice areas). The published map lists 9 May and 31 March 2026 reference images, and independent local reporting confirms flooding in Laoag on 31 August. The 05:45 satellite snapshot has not been matched to time-stamped wet/dry field observations; PhilSA does not state the derived map's effective accuracy or enough raw-image metadata to verify reference comparability. For the initial defense, describe this as a **dated historical SAR-derived context layer available over Laoag**, not a validated citywide flood map or a road-closure decision rule.
