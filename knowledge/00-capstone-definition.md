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
- `TENTATIVE` **Sentinel** is a working name and may change.
- `TENTATIVE` Current descriptive title: **A 2D Simulation-Based Decision Support System for Flood Evacuation Planning**. The concept is accepted, but the final title wording is not recorded as approved.

**Basis:** Selected-capstone presentation, slide 2; team clarification, 2026-09-07.

## 2. One-Sentence Definition

The project is a BS Information Technology decision-support system that lets local disaster planners configure and compare 2D flood-evacuation scenarios using geographic, road, hazard, population, evacuation-center, and resource information to identify feasible routes, shelter allocations, estimated evacuation times, and resource plans.

`UNRESOLVED` The exact locality, deployment organization, geographic coverage, and simulation method have not been selected.

**Basis:** Selected-capstone presentation, slides 3-6; team clarification, 2026-09-07.

## 3. Problem

Flooding and typhoons can make roads inaccessible while increasing evacuation demand. Local responders must determine which routes remain usable, which centers should receive residents, what alternatives exist when roads are blocked or centers reach capacity, and how limited vehicles and other resources should be distributed.

Existing maps can display places and hazard areas, but the presentation identifies a gap in localized tools for testing and comparing evacuation situations before they occur.

**Basis:** Selected-capstone presentation, slides 3-4.

## 4. Proposed Solution

`CONFIRMED` The accepted concept is an interactive 2D disaster-simulation and decision-support system. A planner changes scenario conditions, the system analyzes their consequences, and the resulting evacuation options can be compared.

`TENTATIVE` The presentation proposes OpenStreetMap, Python, and FastAPI. They are not yet final implementation decisions.

`UNRESOLVED` It is unknown whether the system will calculate physical flood propagation from drainage, elevation, rainfall, or water-level data, or instead consume predefined flood conditions and simulate their effects on evacuation.

**Basis:** Selected-capstone presentation, slides 5-6.

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

- `CONFIRMED` Local maps and hazard areas; roads and bridges; affected people; evacuation-center locations and capacities; available rescue resources; flooded or blocked conditions.
- `CONFIRMED` Water-level information appears in the proposed architecture.
- `REQUIRED BY ADVISER` Drainage-system information, roads, maps, evacuation centers, and intended deployment location must be documented.
- `TENTATIVE` Terrain, barangay boundaries, buildings, historical flood areas, accessibility, center occupancy, and facilities.

### Processing

- `CONFIRMED` Apply scenario changes, identify routes, check center capacity, allocate shelters and resources, estimate time, and compare scenarios.
- `UNRESOLVED` Routing, optimization, allocation, travel-time, flood, and population-behavior algorithms.

### Outputs

- `CONFIRMED` Recommended and alternate evacuation routes, center allocation, estimated evacuation time, resource-allocation information, dynamic maps, and scenario comparisons.

### Intended user action

The planner examines alternatives and prepares or revises an evacuation plan. The system supports human decisions; the materials do not authorize autonomous emergency decisions.

**Basis:** Selected-capstone presentation, slides 5-6; adviser requirements relayed by the team, 2026-09-07.

## 8. Value Proposition

The intended value is testing localized "what-if" evacuation situations before they occur and comparing the consequences of road closures, changing demand, center capacity, and resource availability. Measurable improvement over current practice remains unresolved.

## 9. Core System Capabilities

- Configure and compare flood-evacuation scenarios.
- Display local geographic and hazard information in 2D.
- Represent flooded roads, blocked bridges, affected people, center capacities, and resources.
- Analyze routes, center allocation, evacuation time, and resource distribution.

`UNRESOLVED` Which capabilities are minimum requirements versus exploratory features.

## 10. Research Contribution

### Software product

A localized interactive 2D planning environment that integrates evacuation-relevant information and supports scenario comparison.

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

| Data category | Status | Candidate sources |
|---|---|---|
| Roads, intersections, bridges | Required; availability unverified | OpenStreetMap, DPWH, local engineering office |
| Hazard and flooded/blocked conditions | Required; representation unresolved | Local DRRM office, hazard maps, scenario input |
| Evacuation centers and capacity | Required; availability unverified | Local DRRM office, local government, barangays |
| Population or affected-person counts | Required; source unresolved | Local government or scenario input |
| Water levels | Proposed; source unresolved | Local DRRM or monitoring records |
| Rescue vehicles and resources | Required; source unresolved | Local DRRM office or scenario input |
| Drainage system | Adviser-required; role unresolved | Local engineering office, DRRM office, NAMRIA, local maps |
| Elevation and slope | Tentative | NAMRIA, Phil-LiDAR, or another verified source |
| Boundaries and base geography | Tentative | NAMRIA, OpenStreetMap, local government |

No candidate source has yet been verified as accessible to the team.

## 16. Scope

### Included

- `CONFIRMED` Flood-evacuation planning through interactive 2D scenario configuration and comparison.
- `CONFIRMED` Road disruption, center capacity, affected population, resource conditions, and decision-support outputs.
- `REQUIRED BY ADVISER` Documented drainage, road, map, evacuation-center, and deployment information.

### Excluded

No permanent exclusions are approved. Until confirmed, do not claim real-time flood forecasting, emergency dispatch control, public navigation, or a calibrated hydraulic model.

## 17. Non-Goals

`UNRESOLVED` Formal non-goals are not confirmed. The system is framed as decision support, not a replacement for disaster-management authority.

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
- **Flood simulation:** `UNRESOLVED` Must be defined after deciding whether physical water behavior or only evacuation consequences are modeled.
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

1. What final name will replace or confirm **Sentinel**?
2. What city or municipality and which barangays form the study area?
3. Which organization will operate the system, and where and how will it be deployed?
4. Does drainage/elevation/water-level data drive a physical flood model or serve as reference data for user-defined conditions?
5. Which datasets can the team obtain, at what resolution, format, and time coverage?
6. Which routing, allocation, time-estimation, and simulation methods will be used?
7. Which capabilities are minimum accepted requirements?
8. What baselines, metrics, participants, datasets, and thresholds will be used for evaluation?
9. Is use limited to preparedness or does it include active emergencies?
10. What Chapter 1 guidance applies beyond the official BSIT template structure?

## 24. Uncertainties / Contradictions in Existing Materials

- `CONFLICT` The data-source draft specifies Laoag City, but the presentation and team clarification do not confirm a study area.
- `CONFLICT` The draft says drainage will help simulate flood movement; the presentation focuses on scenario changes and evacuation consequences and defines no hydraulic method.
- `UNRESOLVED` FastAPI, Python, and OpenStreetMap may be proposal-stage examples rather than final choices.
- `UNRESOLVED` “Optimal routes” is not defined by an objective function and constraints.

## Definition Integrity Test

```text
PROBLEM: Flood conditions disrupt routes and change evacuation demand
  -> TARGET USER: Local disaster planners and responders
  -> INPUT: Maps, roads, hazards, people, centers, capacity, resources
  -> SYSTEM: 2D scenario simulation and decision-support analysis
  -> PROCESSING: Route, capacity, time, resource, scenario analysis
  -> OUTPUT: Evacuation options and comparisons
  -> USER ACTION: Prepare or revise an evacuation plan
  -> MEASURABLE BENEFIT: UNRESOLVED pending evaluation design
```

The chain is coherent, but the method and measurable-benefit links are not precise enough for strong research claims.
