# Capstone Definition

> This document is the canonical definition of the capstone project.
> Manuscript sections, diagrams, implementation decisions, research claims,
> and AI-generated material must remain consistent with this document.
>
> Source notes document the proposal as presented; current project decisions
> in this file govern the active design.

Status labels: `CONFIRMED`, `TENTATIVE`, and `UNRESOLVED`.

## 1. Project Title

- `CONFIRMED` The project idea has been accepted.
- `CONFIRMED` **OverFlow** is the approved project name.
- `CONFIRMED` Full capstone title: **OverFlow: A Geospatial Decision Support System for Flood Evacuation Planning**.

**Basis:** Team clarification, 2026-10-08.

## 2. One-Sentence Definition

The project is a BS Information Technology 3D geospatial decision-support system that lets local disaster planners configure and compare flood-evacuation scenarios using terrain, road, hazard, population, evacuation-center, and resource information to identify feasible routes, shelter allocations, estimated evacuation times, and resource plans.

`CONFIRMED` Laoag City, Ilocos Norte is the selected study area (team confirmation, 2026-10-16). Batac City was an earlier candidate and is no longer part of the active data request. Barangays 38-A, 38-B, and 39 were selected for the SFINCS technical pilot. The planned interface will make all 80 coded Laoag barangays selectable (team confirmation, 2026-10-17); this does not establish citywide SFINCS validation. Final observed-event evaluation coverage, deployment organization, and deployment coverage remain unresolved.
`CONFIRMED` The team has received a Laoag City Hall data package with terrain, boundary, population, road, flood-susceptibility, and reference files. The team reports that formal request letters were used and that the package was largely supplied through the City Engineering Department (team clarification, 2026-10-17); the repository letters are drafts, not proof of their delivery dates. Receipt does not establish fitness for the final analysis. See `knowledge/data/02-laoag-city-hall-package.md`.
`CONFIRMED` UP TCAGP's LiPAD has responded as a prospective source of LiDAR-derived DTM data. Exact Laoag DTM coverage and metadata, NDA completion, delivery, and adoption as a research input remain pending. LiPAD has not confirmed FHM availability in its reply. See `knowledge/data/03-lipad-response.md`.
`CONFIRMED` The team selected **SFINCS as OverFlow's flood-scenario simulation method on 2026-10-17**. D8 flow direction and accumulation are no longer the planned rainfall-to-flood method; they may be retained only as an optional drainage-reference analysis. The method choice does not validate the existing Laoag flood maps or authorize road-safety claims. See `knowledge/02-sfincs-pilot-plan.md`.
`CONFIRMED` For forward planning, the team assumes it can access finer bare-earth terrain with metadata, river/channel and defensible water-boundary information, dated rainfall, and observed flooded and dry locations for a Laoag event. This is a **planning assumption**, not confirmation that those datasets have been delivered or are suitable.

**Basis:** Selected-capstone presentation, slides 3-6; team clarifications through 2026-10-17; LiPAD response summarized in `knowledge/data/03-lipad-response.md`.

## 3. Problem

Flooding and typhoons can make roads inaccessible while increasing evacuation demand. Local responders must determine which routes remain usable, which centers should receive residents, what alternatives exist when roads are blocked or centers reach capacity, and how limited vehicles and other resources should be distributed.

Existing maps can display places and hazard areas, but the presentation identifies a gap in localized tools for testing and comparing evacuation situations before they occur.

**Basis:** Selected-capstone presentation, slides 3-4.

## 4. Proposed Solution

`CONFIRMED` The accepted concept is an interactive 3D geospatial disaster-simulation and decision-support system. The frontend renders terrain and water in 3D and provides an overhead camera view. A planner configures scenario conditions, the system analyzes their consequences, and the resulting evacuation options can be compared. The DEM remains a two-dimensional elevation grid used for computation; its grid structure does not define the user-facing system as 2D.

`CONFIRMED` SFINCS is the selected engine for rainfall-driven flood scenarios. Its terrain, river/channel, rainfall, and boundary inputs must be prepared with consistent units and height references, and a dated event must be compared with observed flooded and dry locations before local accuracy is claimed. D8 may provide an optional drainage-reference layer but will not generate flood depths. Pipes and canals remain reference map layers unless a separate, documented modeling decision adds them. See `knowledge/02-sfincs-pilot-plan.md`.

`CONFIRMED` The existing SFINCS runs are technical pilots, including a boundary diagnostic; neither validates a Laoag flood map. Selecting the method commits the team to develop and evaluate it, not to trust those pilot outputs. See `knowledge/03-sfincs-pilot-results.md` and `knowledge/04-sfincs-boundary-rerun-results.md`.

`CONFIRMED` The system uses a split architecture: a Python backend (FastAPI, NumPy, SciPy, with rasterio/GDAL when file-based DEM input is used) for computation and a TypeScript frontend (React Three Fiber, React, shadcn/ui, and Leaflet) for rendering and UI. OpenStreetMap is a candidate source of road, building, and geographic data whose local completeness must be checked. Communication is through REST endpoints with JSON-compatible responses. See `knowledge/architecture/` for detailed architecture documentation.

`CONFIRMED` The current working demo is a separate synthetic prototype using a simplified diffusion-wave-style runoff solver for illustrative depth. It does not implement or validate the selected SFINCS method. Its existing `sentinel-demo/` folder path is retained for the hosting workspace; the visible product name is OverFlow.

**Basis:** Team clarification, 2026-10-08; architecture documentation, `knowledge/architecture/00-overview.md`.

## 5. Primary Users and Stakeholders

- `CONFIRMED` Primary users: local disaster planners and responders.
- `UNRESOLVED` The specific operating organization has not been confirmed. Laoag CDRRMO is the proposed partner for interviews and staff evaluation, subject to its agreement; this does not establish it as the operator.
- `TENTATIVE` Secondary stakeholders: local engineering and planning personnel, barangay responders, and evacuation-center managers.
- `CONFIRMED` Residents are intended indirect beneficiaries.

**Basis:** Selected-capstone presentation, slides 3-6; tentative stakeholders inferred from the data plan.

## 6. Core Use Case

A disaster planner configures affected people, flooded roads, blocked bridges, center capacities, and available resources. The system analyzes route availability and capacity, estimates evacuation time, proposes allocations, and lets the planner compare the result with other scenarios.

`CONFIRMED` In the planned final interface, all 80 coded Laoag barangays are available for selection. The planner hovers over a prepared boundary to highlight it and clicks to select or deselect one or more barangays for analysis. The interface does not require drawing circles or polygons. The planner may save, reopen, duplicate, compare, and export scenario summaries. These are approved requirements, not claims about the current synthetic demo or citywide flood-model validation. See `knowledge/01-user-actions.md` for diagram-ready actions.

`UNRESOLVED` Whether use is limited to preparedness exercises or includes actual emergencies.

## 7. Input -> Processing -> Output

### Inputs

- `CONFIRMED` User-configurable scenario inputs: rainfall intensity/duration, expected evacuees per selected barangay (number or percentage), shelter status and usable capacity, manual road/bridge closures, available vehicles and their capacities, and an assumed travel speed for time estimates.
- `CONFIRMED` Source population figures are read-only reference values; they are not automatically the number requiring evacuation. The planner sets scenario demand separately. The supplied Laoag workbook counts covered residents and has no stated survey year. The team recalls being told that the survey was in 2024, but the speaker and source document have not been identified, so 2024 is not verified metadata.
- `CONFIRMED` Geographic data: local maps, roads, bridges, evacuation-center locations and capacities, available rescue resources.
- `CONFIRMED` Elevation data (DEM): required for terrain-based flood computation. A coarse Laoag GeoTIFF has been received. UP TCAGP's LiPAD has confirmed DTM as a distributable data type, but Laoag-specific coverage, access, metadata, and suitability remain unverified. NAMRIA, SRTM, and Mapbox Terrain-RGB remain alternatives.
- `CONFIRMED` The SFINCS method requires suitable terrain with vertical-reference/accuracy metadata, river/channel and downstream-boundary information, dated event rainfall, river level/discharge when relevant, and geolocated flooded and dry observations for evaluation. Access is assumed for planning; receipt and fitness remain unverified.
- `CONFIRMED` Pipes and canals: reference map layers only under the current scope. River/channel terrain and boundary information are inputs to SFINCS.
- `CONFIRMED` Barangay boundaries are required to map affected population; all 80 coded Laoag barangays will be selectable in the planned interface. Buildings, historical flood areas, accessibility, center occupancy, and facilities remain candidate additions.

### Processing

- `CONFIRMED` Process suitable terrain rasters with documented NoData, resolution, units, and vertical datum; preserve true elevations separately from any display scaling. Configure SFINCS with physically supported rainfall, river/channel, and water-boundary inputs to produce scenario-specific flood maps. D8, if retained, supplies only a separate drainage-reference view. See `knowledge/architecture/03-water-simulation.md` and `knowledge/data/01-dem-processing.md`.
- `CONFIRMED` Before using SFINCS output for local flood-exposure or road decisions, pass numerical and boundary checks and compare a dated run with independent flooded and dry observations. The first runs establish technical feasibility, not accuracy. A planner reviews any candidate road closures before routing and allocation; an automatic closure rule is not adopted. See `knowledge/02-sfincs-pilot-plan.md`.
- `UNRESOLVED` The final model boundary, terrain source, infiltration and roughness parameters, local validation measures, and any road-exposure threshold or rule.
- `TENTATIVE` Plan backend boundaries for terrain/mesh data (`/api/terrain`), water simulation (`/api/simulate`), and evacuation analysis (`/api/analyze`), subject to implementation and validation.
- `CONFIRMED` The initial evacuation-analysis sequence removes manually closed road and bridge edges, computes weighted shortest feasible routes, assigns evacuees only to reachable centers within usable capacity, then estimates travel and vehicle trips using stated speed and capacity assumptions. Unserved demand must be reported explicitly rather than assigned to an infeasible center. NetworkX weighted paths and OR-Tools minimum-cost flow are selected implementation directions; precise edge costs, allocation objective, alternative-route rule, vehicle scheduling, and validation remain to be specified.
- `UNRESOLVED` Precise routing weights, allocation objective and constraints beyond reachability/capacity, travel-time and vehicle-scheduling assumptions, population-behavior model, and evaluation.

### Outputs

- `CONFIRMED` Intended outputs: recommended and alternate evacuation routes, center allocation and capacity use, explicitly unserved demand and reasons for infeasibility, estimated evacuation time, resource-allocation information, dynamic maps, scenario comparisons, and an exportable scenario summary.

### Intended user action

The planner examines alternatives and prepares or revises an evacuation plan. The system supports human decisions; the materials do not authorize autonomous emergency decisions.

**Basis:** Selected-capstone presentation, slides 5-6; adviser requirements relayed by the team, 2026-09-07.

## 8. Value Proposition

The intended value is testing localized "what-if" evacuation situations before they occur and comparing the consequences of road closures, changing demand, center capacity, and resource availability. Measurable improvement over current practice remains unresolved.

## 9. Core System Capabilities

- Configure and compare flood-evacuation scenarios.
- Display local geographic and hazard information through 3D terrain and water rendering, with an overhead camera view for map-like inspection.
- Represent flooded roads, blocked bridges, affected people, center capacities, and resources.
- Analyze routes, center allocation, evacuation time, and resource distribution.
- Select among all 80 coded Laoag barangays by hovering over and clicking their mapped boundaries; inspect available map layers and feature details. Model and evaluation coverage may be narrower.
- Create, save, reopen, duplicate, compare, and export planning scenarios.

`UNRESOLVED` Which capabilities are minimum requirements versus exploratory features.

## 10. Research Contribution

### Software product

A localized interactive 3D geospatial planning environment that integrates evacuation-relevant information and supports scenario comparison.

### Research contribution

`TENTATIVE` The study investigates whether localized what-if simulation and decision-support analysis can improve evaluation of flood-evacuation options compared with static mapping or current planning practice.

`UNRESOLVED` The algorithm, optimization formulation, framework, or method that constitutes the scientific contribution. Interface and mapping features are not novelty by themselves.

## 11. Research Questions

`TENTATIVE`

1. How can local terrain, road, hazard, population, evacuation-center, and resource data be integrated into a 3D geospatial flood-evacuation scenario model?
2. How can the system identify feasible routes and center allocations when roads become inaccessible or centers reach capacity?
3. How effectively does the system support comparison of alternative evacuation scenarios?

`UNRESOLVED` Quantitative questions depend on the final method, baseline, dataset, and metrics.

## 12. General Objective

`TENTATIVE` To develop and evaluate a localized 3D geospatial decision-support system for creating and comparing flood-evacuation planning scenarios.

## 13. Specific Objectives

`TENTATIVE`

1. Integrate validated local map, road, hazard, center, population, and resource data.
2. Represent road disruption, evacuation demand, center capacity, and resource availability.
3. Analyze feasible routes, shelter allocation, evacuation time, and resource distribution.
4. Present results through an interactive 3D geospatial view and scenario comparison.
5. Evaluate the system using methods and metrics still to be selected.

## 14. Evaluation Strategy

`CONFIRMED` The current research plan is descriptive-developmental work organized through a design-science process and iterative software development. It uses a source-data inventory, documented functional and scenario tests, and, subject to partner participation and ethics approval, semi-structured staff interviews and task-based staff evaluation. The proposed staff instrument combines observed task completion, five-point agreement items, and open comments. Interview/comment themes will be summarized qualitatively; test/task counts and percentages and item-level response frequencies and means will be reported descriptively, with denominators and missing responses stated. No inferential test or benchmark against another software system is planned (team direction, 2026-10-17). Improvement over existing practice will not be claimed without comparative evidence.

`UNRESOLVED` Laoag CDRRMO is a proposed partner, not a confirmed operator or participant source. The approximately six-person purposive interview target is provisional. Final participant access, ethics arrangements, instrument wording, task-completion criteria, datasets, local SFINCS comparison measures and acceptance thresholds, and any optional timing or sensitivity measures still require confirmation before administration or interpretation. Candidate measures include route validity, constraint satisfaction, computation time, agreement with expert plans, usability, and decision quality. For the **selected SFINCS method**, a dated observed event with flooded and dry locations is assumed accessible for local model evaluation; choose comparison measures and acceptance criteria before interpreting results. No D8 rainfall-classification threshold is planned.

## 15. Data Requirements and Sources

| Data category | Status | Candidate sources | Notes |
|---|---|---|---|
| Elevation data (DEM) | Required for terrain analysis | Supplied Laoag GeoTIFF; UP TCAGP/LiPAD as a confirmed prospective DTM provider; NAMRIA, SRTM, Mapbox Terrain-RGB as alternatives | Supplied grid is about 91.25 m per cell and supports broad terrain visualization and initial model experiments. LiPAD has replied, but exact Laoag coverage, NDA clearance, delivery, metadata, and use rights remain pending. Prefer a 1–5 m bare-earth DTM for detailed pilot analysis; good 5–10 m data is worth testing. These are practical acquisition targets, not universal minimums or guarantees of accuracy. Verify provenance, collection date, vertical accuracy, reference systems/units, coverage, and terms; ask whether the City Hall file is original or a reduced-resolution export. See `knowledge/data/01-dem-processing.md` and `knowledge/data/03-lipad-response.md`. |
| Roads, intersections, bridges | Required | Supplied Laoag road shapefile and bridge inventory; OpenStreetMap, DPWH, engineering office | Local roads are available, but five shapes are empty and the graph needs connectivity checks. Bridges are listed in a report but lack geocoded network links. |
| Evacuation centers and capacity | Required; availability unverified | Selected local DRRM office, local government, barangays | Store as geographic features with capacity/status attributes where available. |
| Population or affected-person counts | Required; barangay population supplied for Laoag, evacuation demand unresolved | Supplied Laoag workbook; selected local government, PSA, or scenario input | Workbook counts covered residents, not people requiring evacuation. No survey year is stated; the team's recollection of a verbal 2024 date needs a named source or written confirmation. |
| Rescue vehicles and resources | Required; source unresolved | Selected local DRRM office or scenario input | |
| Drainage infrastructure | Reference layer only; not used for flood computation | Supplied Laoag canal/creek layers; engineering office, DRRM office, NAMRIA | Verify coverage and convert chosen features to GeoJSON. |
| Barangay boundaries | Required for affected-population mapping; supplied for Laoag | Supplied Laoag shapefile; NAMRIA, OpenStreetMap, local government | The 80 coded barangays join to the population workbook; verify CRS, accuracy, currency, and the extra Monroe Island polygon. |
| Buildings | Tentative; for affected-structure representation | OpenStreetMap | Convert to GeoJSON when included. |
| Dated flood observations and matching rainfall | Assumed accessible for planning; required to evaluate SFINCS, not yet received | Local DRRM/engineering records and relevant rainfall-data office | Seek one event with time-stamped rainfall and geolocated flooded and dry locations; river level/discharge is needed when relevant to the event. Dated online reports provide Laoag city-level impacts, not observed local flood extents. The supplied static flood-susceptibility layer is a reference map, not a dated observation. |
| Flood Hazard Maps | Requested as a possible reference/validation input; LiPAD availability unconfirmed | Existing Laoag City Hall flood-susceptibility layer; LiPAD if it confirms access | Do not equate a static hazard/susceptibility map with observed event extent or validated model output. Confirm map date, scenario/return period, rights, and suitability. |

Laoag City is the confirmed study area. The City Hall package is in hand, but essential center, resource, and flood-event detail is missing; its suitability as the final research dataset remains unverified. The team assumes access to the additional SFINCS evaluation package for planning, while LiPAD DTM delivery, river/boundary information, observed-event records, and permitted uses remain unconfirmed. FHM availability is also unconfirmed. Assessment: `knowledge/data/02-laoag-city-hall-package.md`; provider response: `knowledge/data/03-lipad-response.md`; pipeline: `knowledge/data/00-data-sources.md`.

## 16. Scope

### Included

- `CONFIRMED` Flood-evacuation planning through interactive 3D scenario visualization and comparison.
- `CONFIRMED` Road disruption, center capacity, affected population, resource conditions, and decision-support outputs.
- `CONFIRMED` Documented drainage, road, map, evacuation-center, and deployment information is required by the adviser.
- `CONFIRMED` SFINCS is the selected flood-scenario method, subject to input quality checks and local evaluation before flood-accuracy or road-exposure claims.

### Excluded

The current architecture and scope do not include real-time flood forecasting, emergency dispatch control, or public navigation. SFINCS is the **selected scenario method**, but no locally validated SFINCS implementation exists yet; formal permanent exclusions remain subject to adviser approval.

## 17. Non-Goals

`UNRESOLVED` Formal non-goals require adviser confirmation. The system is framed as decision support, not a replacement for disaster-management authority. No locally evaluated SFINCS model exists yet; the technical pilot is unvalidated.

## 18. Constraints

- Some Laoag local data has been received; its provenance, update date, accuracy, and permitted use remain unverified. Required operational datasets are still missing.
- Laoag City and the three technical-pilot barangays are selected, and all 80 coded barangays are planned for interface selection; final observed-event evaluation coverage and the deployment organization are not selected.
- Validity depends on data quality, scale, coordinate system, currency, and completeness.
- Physical flood behavior cannot be claimed without a suitable model, calibration data, and validation.

## 19. Assumptions

- `TENTATIVE` Authorized planners define scenario conditions.
- `CONFIRMED` Vector geographic layers use GeoJSON for interchange; DEM rasters are processed as elevation grids.
- `CONFIRMED` The team directs planning to assume access to the finer terrain, river/boundary, dated rainfall, and observed flood evidence needed for a local SFINCS evaluation. This assumption does not establish receipt, data rights, or model accuracy; the SFINCS method choice is recorded separately above.
- `UNRESOLVED` Sufficient official local data will be available.

## 20. Key Concepts and Terminology

- **Decision-support system:** A tool that helps a human decision-maker evaluate choices.
- **Scenario:** Configured evacuation conditions such as demand, road closures, center capacities, and resources.
- **Evacuation route:** A road-network path considered usable under a scenario's constraints.
- **Evacuation-center allocation:** Assignment of affected groups to centers considering capacity and accessibility.
- **Flood simulation:** SFINCS is the selected hydraulic flood-scenario method. It needs suitable terrain, rainfall, and water-boundary inputs and local observed-event evaluation; the existing Laoag runs are technical demonstrations only.
- **D8 flow direction:** A hydrological algorithm that assigns each grid cell a flow direction toward the steepest downhill neighbor among eight possible directions.
- **Flow accumulation:** A grid operation that counts how many upstream cells drain into each cell, identifying areas where water collects.
- **DEM (Digital Elevation Model):** A 2D grid where each cell stores ground elevation; the primary terrain input for flood computation.
- **GeoJSON:** A standardized format for encoding geographic data structures (points, lines, polygons) used for roads, boundaries, and evacuation centers.
- **OverFlow:** The approved project name for this 3D geospatial flood-evacuation decision-support system.
- **Deployment:** The operating organization, technical environment, and geographic coverage where the system is installed and used.

## 21. SDG Alignment

- `CONFIRMED` SDG 13: Climate Action.
- `CONFIRMED` SDG 11: Sustainable Cities and Communities.

**Basis:** Selected-capstone presentation, slide 7.

## 22. Research Track

- `CONFIRMED` Degree program: BS Information Technology.
- `CONFIRMED` Research thrust: Scientific Computing and Optimization.

**Basis:** Selected-capstone presentation, slide 7; team clarification, 2026-09-07.

## 23. Open Questions

1. Will the technical-pilot barangays 38-A, 38-B, and 39 also be the final observed-event evaluation area? What geographic coverage beyond the confirmed 80-barangay selector will support tested evacuation analysis?
2. Which organization will operate the system, and where and how will it be deployed?
3. Do the assumed SFINCS datasets arrive with sufficient coverage, resolution, metadata, event timing, observed locations, and permitted uses?
4. Which physical boundary, terrain source, parameter assumptions, comparison measures, and acceptance criteria will make the selected SFINCS model defensible for Laoag?
5. What edge weights, allocation objective, alternative-route rule, vehicle scheduling assumptions, and validation will refine the selected weighted-routing and capacity-constrained allocation approach? What claim, if any, justifies calling a full evacuation plan optimal?
6. Which capabilities are minimum accepted requirements?
7. Which participants, datasets, task-completion criteria, SFINCS comparison measures, and thresholds will finalize the selected descriptive evaluation plan? No other-system benchmark is planned.
8. Is use limited to preparedness or does it include active emergencies?
9. What Chapter 1 guidance applies beyond the official BSIT template structure?

## Definition Integrity Test

```text
PROBLEM: Flood conditions disrupt routes and change evacuation demand
  -> TARGET USER: Local disaster planners and responders
  -> INPUT: Terrain, rainfall, river/boundary evidence, roads, barangay boundaries, centers, population, resources
  -> SYSTEM: 3D geospatial scenario visualization and decision-support analysis
  -> PROCESSING: Terrain and forcing preparation -> SFINCS flood scenario -> planner-reviewed road access -> route/allocation/time analysis
  -> OUTPUT: Evacuation options, resource plans, and scenario comparisons
  -> USER ACTION: Prepare or revise an evacuation plan
  -> MEASURABLE BENEFIT: UNRESOLVED pending evaluation design
```

The selected flood method is explicit; its local validity and the measurable-benefit link still require evaluation.
