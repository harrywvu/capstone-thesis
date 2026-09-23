# Capstone Definition

> This document is the canonical definition of the capstone project.
> Manuscript sections, diagrams, implementation decisions, research claims,
> and AI-generated material must remain consistent with this document.
>
> Raw notes and tentative ideas are not considered part of the accepted
> capstone definition unless they are incorporated here.

Status labels: `CONFIRMED`, `TENTATIVE`, `UNRESOLVED`, and `CONFLICT`.

## 1. Project Title

- `CONFIRMED` The project idea has been accepted.
- `CONFIRMED` **OverFlow** is the approved project name.
- Current manuscript title: **A 2D Simulation-Based Decision Support System for Flood Evacuation Planning**.
- Historical presentation subtitle: **A Geospatial Decision Support System for Flood Evacuation Planning**.

**Basis:** Current manuscript metadata in `latex-template-ccis-paper-v2/main.tex`; the historical subtitle is recorded in the selected-capstone presentation, slide 2.

## 2. One-Sentence Definition

The project is a BS Information Technology decision-support system that lets local disaster planners configure and compare flood-evacuation scenarios using geographic, road, hazard, population, evacuation-center, and resource information to identify feasible routes, shelter allocations, estimated evacuation times, and resource plans. 

`UNRESOLVED` The exact locality, deployment organization, and geographic coverage have not been selected.
`CONFIRMED` The simulation method is terrain-based accumulation using D8 flow direction and flow accumulation on DEM data.

**Basis:** Selected-capstone presentation, slides 3-6; team clarification, 2026-09-07.

## 3. Problem

Flooding and typhoons can make roads inaccessible while increasing evacuation demand. Local responders must determine which routes remain usable, which centers should receive residents, what alternatives exist when roads are blocked or centers reach capacity, and how limited vehicles and other resources should be distributed.

Existing maps can display places and hazard areas, but the presentation identifies a gap in localized tools for testing and comparing evacuation situations before they occur.

**Basis:** Selected-capstone presentation, slides 3-4.

## 4. Proposed Solution

`CONFIRMED` The accepted concept is an interactive geospatial disaster-simulation and decision-support system. The planning model is two-dimensional, while the frontend renders terrain and water as 3D meshes and provides a top-down view for 2D-style analysis. A planner configures scenario conditions, the system analyzes their consequences, and the resulting evacuation options can be compared.

`CONFIRMED` The flood simulation uses terrain-based accumulation, not hydraulic modeling. The user inputs rainfall intensity and duration; the system computes which areas flood based on elevation data (DEM). Drainage infrastructure data serves as a reference map layer only.

`CONFIRMED` The system uses a split architecture: a Python backend (FastAPI, NumPy, SciPy, with rasterio/GDAL when file-based DEM input is used) for computation and a TypeScript frontend (React Three Fiber, React, shadcn/ui, and Leaflet) for rendering and UI. OpenStreetMap provides road, building, and geographic data. Communication is through REST endpoints with JSON-compatible responses. See `knowledge/architecture/` for detailed architecture documentation.

**Basis:** Selected-capstone presentation, slides 5-6; architecture documentation, `knowledge/architecture/00-overview.md`.

## 5. Primary Users and Stakeholders

- `CONFIRMED` Primary users: local disaster planners and responders.
- `UNRESOLVED` The specific operating organization has not been confirmed.
- `TENTATIVE` Secondary stakeholders: local engineering and planning personnel, barangay responders, and evacuation-center managers.
- `CONFIRMED` Residents are intended indirect beneficiaries.

**Basis:** Selected-capstone presentation, slides 3-6; tentative stakeholders inferred from the data plan.

## 6. Core Use Case

A disaster planner configures affected people, flooded roads, blocked bridges, center capacities, and available resources. The system analyzes route availability and capacity, estimates evacuation time, proposes allocations, and lets the planner compare the result with other scenarios.

`UNRESOLVED` Whether use is limited to preparedness exercises or includes actual emergencies.

## 7. Input -> Processing -> Output

### Inputs

- `CONFIRMED` User-configurable scenario inputs: rainfall intensity/duration, affected population per barangay, shelter status (open/closed/at capacity), and manual road/bridge closures.
- `CONFIRMED` Geographic data: local maps, roads, bridges, evacuation-center locations and capacities, available rescue resources.
- `CONFIRMED` Elevation data (DEM): required for terrain-based flood computation. Source candidates are NAMRIA, Phil-LiDAR, SRTM, and Mapbox Terrain-RGB; availability for the selected study area is unverified.
- `CONFIRMED` Drainage infrastructure: reference map layer only; not used for flood computation.
- `TENTATIVE` Barangay boundaries, buildings, historical flood areas, accessibility, center occupancy, and facilities.

### Processing

- `CONFIRMED` Process the selected DEM by decoding it into a two-dimensional NumPy grid, handling NoData values, optionally normalizing or downsampling it, and then compute flood-affected areas from rainfall input using terrain-based accumulation: D8 flow direction, flow accumulation, rainfall overlay, and threshold-based flood classification. See `knowledge/architecture/03-water-simulation.md` and `knowledge/data/01-dem-processing.md` for details.
- `UNRESOLVED` The water-balance or indicator formula that converts rainfall and contributing area into the value used for flood classification, including the threshold's units, calibration, and validation.
- `TENTATIVE` Plan backend boundaries for terrain/mesh data (`/api/terrain`), water simulation (`/api/simulate`), and evacuation analysis (`/api/analyze`), subject to implementation and validation.
- `CONFIRMED` Identify feasible evacuation routes, assign shelter allocations, estimate clearance time, distribute resources, and compare scenarios.
- `UNRESOLVED` Routing, allocation, travel-time, and population-behavior algorithms.

### Outputs

- `CONFIRMED` Recommended and alternate evacuation routes, center allocation, estimated evacuation time, resource-allocation information, dynamic maps, and scenario comparisons.

### Intended user action

The planner examines alternatives and prepares or revises an evacuation plan. The system supports human decisions; the materials do not authorize autonomous emergency decisions.

**Basis:** Selected-capstone presentation, slides 5-6; adviser requirements relayed by the team, 2026-09-07.

## 8. Value Proposition

The intended value is testing localized "what-if" evacuation situations before they occur and comparing the consequences of road closures, changing demand, center capacity, and resource availability. Measurable improvement over current practice remains unresolved.

## 9. Core System Capabilities

- Configure and compare flood-evacuation scenarios.
- Display local geographic and hazard information in a 2D planning view with optional 3D terrain and water rendering.
- Represent flooded roads, blocked bridges, affected people, center capacities, and resources.
- Analyze routes, center allocation, evacuation time, and resource distribution.

`UNRESOLVED` Which capabilities are minimum requirements versus exploratory features.

## 10. Research Contribution

### Software product

A localized interactive 2D planning environment with 3D terrain/water visualization that integrates evacuation-relevant information and supports scenario comparison.

### Research contribution

`TENTATIVE` The study investigates whether localized what-if simulation and decision-support analysis can improve evaluation of flood-evacuation options compared with static mapping or current planning practice.

`UNRESOLVED` The algorithm, optimization formulation, framework, or method that constitutes the scientific contribution. Interface and mapping features are not novelty by themselves.

## 11. Research Questions

`TENTATIVE`

1. How can local road, hazard, population, evacuation-center, and resource data be integrated into a 2D flood-evacuation scenario model?
2. How can the system identify feasible routes and center allocations when roads become inaccessible or centers reach capacity?
3. How effectively does the system support comparison of alternative evacuation scenarios?

`UNRESOLVED` Quantitative questions depend on the final method, baseline, dataset, and metrics.

## 12. General Objective

`TENTATIVE` To develop and evaluate a localized 2D simulation-based decision-support system for creating and comparing flood-evacuation planning scenarios.

## 13. Specific Objectives

`TENTATIVE`

1. Integrate validated local map, road, hazard, center, population, and resource data.
2. Represent road disruption, evacuation demand, center capacity, and resource availability.
3. Analyze feasible routes, shelter allocation, evacuation time, and resource distribution.
4. Present results through an interactive 2D map and scenario comparison.
5. Evaluate the system using methods and metrics still to be selected.

## 14. Evaluation Strategy

`UNRESOLVED` No evaluation method, baseline, dataset, participant group, or threshold is confirmed. Candidate measures requiring adviser approval include route validity, constraint satisfaction, computation time, agreement with expert plans, usability, and decision quality.

## 15. Data Requirements and Sources

| Data category | Status | Candidate sources | Notes |
|---|---|---|---|
| Elevation data (DEM) | Required for flood computation | NAMRIA (1m--5m), Phil-LiDAR (1m--3m), SRTM (30m--90m), Mapbox Terrain-RGB (5m--10m) | 10m--30m resolution is the initial detail/performance target. Process by fetch/load, decode, NoData handling, optional normalization/downsampling, and export. See `knowledge/data/01-dem-processing.md`. |
| Roads, intersections, bridges | Required | OpenStreetMap, DPWH, selected local engineering office | Convert vector data to GeoJSON via Overpass API or bounding-box export; final source and access are unverified. |
| Evacuation centers and capacity | Required; availability unverified | Selected local DRRM office, local government, barangays | Store as geographic features with capacity/status attributes where available. |
| Population or affected-person counts | Required; source unresolved | Selected local government, PSA, or scenario input | Barangay-level mapping is preferred where available. |
| Rescue vehicles and resources | Required; source unresolved | Selected local DRRM office or scenario input | |
| Drainage infrastructure | Reference layer only; not used for flood computation | Selected local engineering office, DRRM office, NAMRIA, local maps | Vector reference features may be stored as GeoJSON. |
| Barangay boundaries | Required for affected-population mapping | NAMRIA, OpenStreetMap, selected local government | Convert to GeoJSON and document CRS, accuracy, and currency. |
| Buildings | Tentative; for affected-structure representation | OpenStreetMap | Convert to GeoJSON when included. |
| Historical flood data | Optional; useful for validation | Selected local DRRM office, barangay records | Use to compare simulated extent when accessible. |

No candidate source has yet been verified as accessible to the team. Data pipeline and processing details: `knowledge/data/00-data-sources.md`.

## 16. Scope

### Included

- `CONFIRMED` Flood-evacuation planning through interactive 2D scenario configuration and comparison, with optional 3D terrain/water visualization.
- `CONFIRMED` Road disruption, center capacity, affected population, resource conditions, and decision-support outputs.
- `REQUIRED BY ADVISER` Documented drainage, road, map, evacuation-center, and deployment information.

### Excluded

The current architecture and scope do not include real-time flood forecasting, emergency dispatch control, public navigation, or a calibrated hydraulic model; formal permanent exclusions remain subject to adviser approval.

## 17. Non-Goals

`UNRESOLVED` Formal non-goals require adviser confirmation. The system is nevertheless framed as decision support, not a replacement for disaster-management authority, and the current architecture does not provide a calibrated hydraulic model.

## 18. Constraints

- Local data access is unverified.
- Study area and deployment organization are not selected.
- Validity depends on data quality, scale, coordinate system, currency, and completeness.
- Physical flood behavior cannot be claimed without a suitable model, calibration data, and validation.

## 19. Assumptions

- `TENTATIVE` Authorized planners define scenario conditions.
- `TENTATIVE` Geographic layers can be standardized into formats such as GeoJSON.
- `UNRESOLVED` Sufficient official local data will be available.

## 20. Key Concepts and Terminology

- **Decision-support system:** A tool that helps a human decision-maker evaluate choices.
- **Scenario:** Configured evacuation conditions such as demand, road closures, center capacities, and resources.
- **Evacuation route:** A road-network path considered usable under a scenario's constraints.
- **Evacuation-center allocation:** Assignment of affected groups to centers considering capacity and accessibility.
- **Flood simulation:** Terrain-based computation of flood-affected areas using rainfall input and elevation data (DEM). Not a hydraulic model.
- **D8 flow direction:** A hydrological algorithm that assigns each grid cell a flow direction toward the steepest downhill neighbor among eight possible directions.
- **Flow accumulation:** A grid operation that counts how many upstream cells drain into each cell, identifying areas where water collects.
- **DEM (Digital Elevation Model):** A 2D grid where each cell stores ground elevation; the primary terrain input for flood computation.
- **GeoJSON:** A standardized format for encoding geographic data structures (points, lines, polygons) used for roads, boundaries, and evacuation centers.
- **OverFlow:** The approved project name for this 2D flood-evacuation decision-support system.
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

1. ~~What final name will replace or confirm **Sentinel**?~~ **OverFlow** has been confirmed.
2. What city or municipality and which barangays form the study area?
3. Which organization will operate the system, and where and how will it be deployed?
4. ~~Does drainage/elevation/water-level data drive a physical flood model or serve as reference data for user-defined conditions?~~ **Resolved:** Elevation data (DEM) drives terrain-based flood computation. Drainage infrastructure is a reference layer only.
5. Which datasets can the team obtain, at what resolution, format, and time coverage?
6. Which routing, allocation, time-estimation, and population-behavior algorithms will be used, and how will rainfall and contributing area be converted into a validated flood-classification indicator?
7. Which capabilities are minimum accepted requirements?
8. What baselines, metrics, participants, datasets, and thresholds will be used for evaluation?
9. Is use limited to preparedness or does it include active emergencies?
10. What Chapter 1 guidance applies beyond the official BSIT template structure?

## 24. Uncertainties / Contradictions in Existing Materials

- `CONFLICT` The data-source draft specifies Laoag City, but the presentation and team clarification do not confirm a study area.
- `RESOLVED` The historical presentation subtitle differs from the current manuscript title. Use **A 2D Simulation-Based Decision Support System for Flood Evacuation Planning** in active manuscript and knowledge-base references unless the team approves a later title change.
- `RESOLVED` ~~The draft says drainage will help simulate flood movement; the presentation focuses on scenario changes and evacuation consequences and defines no hydraulic method.~~ Drainage infrastructure is now defined as a reference map layer only; flood computation uses terrain-based accumulation from DEM data.
- `RESOLVED` ~~FastAPI, Python, and OpenStreetMap may be proposal-stage examples rather than final choices.~~ The architecture is confirmed: Python/FastAPI backend with NumPy/SciPy for computation, TypeScript/React Three Fiber frontend for rendering, and OpenStreetMap for geographic data. See `knowledge/architecture/00-overview.md`.
- `UNRESOLVED` "Optimal routes" is not defined by an objective function and constraints.
- `UNRESOLVED` DEM data availability, resolution, and access for the selected study area have not been verified.

## Definition Integrity Test

```text
PROBLEM: Flood conditions disrupt routes and change evacuation demand
  -> TARGET USER: Local disaster planners and responders
  -> INPUT: DEM terrain data, roads (OSM), barangay boundaries, evacuation centers, population, resources
  -> SYSTEM: 2D scenario simulation and decision-support analysis with 3D terrain/water rendering
  -> PROCESSING: DEM processing -> D8 flow direction -> flow accumulation -> rainfall overlay -> flood threshold -> route/allocation/time analysis
  -> OUTPUT: Evacuation options, resource plans, and scenario comparisons
  -> USER ACTION: Prepare or revise an evacuation plan
  -> MEASURABLE BENEFIT: UNRESOLVED pending evaluation design
```

The chain is coherent, but the method and measurable-benefit links are not precise enough for strong research claims.
