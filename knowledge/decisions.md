# Decision Log

## Decision: Accept the flood-evacuation decision-support concept

**Status:** Accepted  
**Date:** 2026-09-07

### Context

The presentation proposes a 2D system for testing flood-evacuation situations and comparing route, shelter, time, and resource decisions.

### Decision

The project idea is accepted and will anchor later definition and manuscript work.

### Reasoning

The team explicitly confirmed acceptance of the idea.

### Consequences

The title, scope, method, data, and evaluation may be refined without replacing the central concept unless a later decision says otherwise.

### Source

Selected-capstone presentation; team clarification, 2026-09-07.

## Decision: Approve **OverFlow** as the project name

**Status:** Accepted  
**Date:** 2026-09-16

### Context

The project previously used **Sentinel** as a tentative working name. The team has now selected and approved a final name.

### Decision

Use **OverFlow** as the official project name in all manuscript, knowledge-base, and prototype references.

### Reasoning

The name was confirmed by the team and supersedes the earlier tentative label.

### Consequences

All references to **Sentinel** across the repository must be updated to **OverFlow** consistently.

### Source

Team confirmation, 2026-09-16.

## Decision: Classify the project as BS Information Technology

**Status:** Accepted  
**Date:** 2026-09-07

### Context

The template supports BSCS and BSIT, while the slides separately identify Scientific Computing and Optimization.

### Decision

The project is a BS Information Technology capstone. Scientific Computing and Optimization is the research thrust, not the degree program.

### Reasoning

The team directly clarified the distinction.

### Consequences

The manuscript uses the template's `bsit` option, and only `chapters/bsit/` manuscript files are edited.

### Source

Team clarification, 2026-09-07.

## Decision: Preserve the official CCIS LaTeX template

**Status:** Accepted  
**Date:** 2026-09-07

### Context

An official CCIS Thesis and Capstone Project LaTeX template is present.

### Decision

Use the existing template and keep Chapter 1 as an outline until the foundation is sufficiently resolved.

### Reasoning

The template defines the program-specific chapter structure and Biber workflow.

### Consequences

Manuscript content remains LaTeX; Markdown is limited to internal knowledge and notes.

### Source

`latex-template-ccis-paper-v2/README.md`; initialization instructions, 2026-09-07.

## Decision: Include the adviser-requested data and deployment topics

**Status:** Accepted  
**Date:** 2026-09-07

### Context

The adviser requested drainage-system, road, map, evacuation-center, and deployment information.

### Decision

These are required topics. Unknown locations, sources, and modeling roles remain explicitly unresolved.

### Reasoning

They affect inputs, geographic scope, users, and technical deployment.

### Consequences

The team must confirm the study area and deployment organization before Chapter 1 states them as facts.

### Source

Adviser feedback relayed by the team, 2026-09-07.

## Decision: Use terrain-based flood accumulation, not hydraulic modeling

**Status:** Accepted  
**Date:** 2026-09-16

### Context

Flooding in the Philippines is primarily caused by prolonged heavy rainfall (typhoons) overwhelming drainage infrastructure in low-lying areas. Full hydraulic modeling of water flow through drainage canals is out of scope for this capstone.

### Decision

The flood simulation computes affected areas using **elevation data (DEM)** and **rainfall intensity/duration** as inputs. Water flows downhill and pools in depressions based on terrain. Drainage infrastructure data serves as a **reference map layer only** and is not used for flood computation.

### Reasoning

Terrain-based accumulation is grounded in real geographic data, visually compelling, and computationally feasible for a capstone. It avoids the complexity and data requirements of hydraulic modeling while still producing meaningful flood scenarios.

### Consequences

- DEM data (from NAMRIA or Phil-LiDAR) becomes a **required** data input.
- Drainage blueprints are optional reference data, not core to the simulation.
- The system computes flood zones from terrain rather than accepting pre-defined flood conditions.

### Source

Team discussion, 2026-09-16.

## Decision: Limit user controls to operational parameters, not physics

**Status:** Tentative  
**Date:** 2026-09-16

### Context

The system's users are disaster planners, not hydrologics. Too many technical parameters make the system hard to use; too few make it less useful.

### Decision

The user configures **operational conditions**: rainfall intensity/duration, affected population per barangay, shelter status (open/closed/at capacity), and manual road/bridge closures. The system handles all technical computation (flood spread, routing, allocation, time estimation). No hydraulic or physical parameters are exposed to the user.

### Reasoning

Disaster planners think in terms of situations ("typhoon hits, these areas flood, this many people need moving"), not physics. The system should translate operational inputs into logistics automatically.

### Consequences

- The user interface focuses on scenario configuration, not technical parameters.
- The system must be capable of computing flood conditions automatically from rainfall + terrain.
- This scope is simpler to build and easier to use than a fully parameterized simulation.

### Source

Team discussion, 2026-09-16.

## Decision: Adopt a split architecture (Python backend + TypeScript frontend)

**Status:** Accepted  
**Date:** 2026-09-17

### Context

The system requires both heavy numerical computation (DEM processing, flow simulation) and interactive visual rendering (3D terrain, water overlay, UI controls). No single language optimally handles both.

### Decision

Adopt a split architecture: **Python** (FastAPI, NumPy, SciPy) handles all computation on the backend. **TypeScript** (React Three Fiber, React, shadcn/ui) handles rendering and UI on the frontend. Communication is via REST API.

### Reasoning

Python provides access to NumPy and SciPy for efficient grid operations and flow simulation, which are essential for the terrain-based flood model. TypeScript with React Three Fiber provides fast 3D rendering with native React integration. The split allows each layer to evolve independently.

### Consequences

- All computation code belongs in the Python backend; the frontend is a thin rendering client.
- API contracts must be defined between the layers (terrain, simulate, analyze endpoints).
- The frontend receives geometry (vertices, colors, indices) and state (water depths) from the backend.

### Source

`knowledge/architecture/00-overview.md`; team discussion, 2026-09-17.

## Decision: Use D8 flow direction and flow accumulation as the simulation algorithm

**Status:** Accepted  
**Date:** 2026-09-17

### Context

The flood simulation must compute which areas flood based on terrain elevation and rainfall input. The algorithm must be computationally feasible for a capstone while producing meaningful results.

### Decision

Implement a simplified hydrological model using:
1. **D8 flow direction** — each cell flows to the steepest downhill neighbor.
2. **Flow accumulation** — count upstream cells draining into each cell.
3. **Rainfall overlay** — distribute user-specified rainfall intensity/duration uniformly.
4. **Flood classification** — cells exceeding a depth threshold are marked as flooded.

### Reasoning

D8 is the standard terrain-based flow algorithm, well-understood and efficient to implement. Combined with flow accumulation, it identifies natural water collection points without requiring hydraulic calibration. The threshold-based flood classification is simple and user-adjustable for sensitivity analysis.

### Consequences

- The model does not capture flow velocity, volume, or spreading (D8 allows only one direction per cell).
- No soil absorption, infiltration, or drainage infrastructure is modeled.
- Results are suitable for relative scenario comparison, not absolute flood prediction.
- Validation must compare simulated extent against known flood maps when available.

### Source

`knowledge/architecture/02-computation.md`; `knowledge/architecture/03-water-simulation.md`.

## Decision: Adopt GeoJSON as the standard geographic data interchange format

**Status:** Accepted  
**Date:** 2026-09-17

### Context

Geographic data comes from multiple sources (OpenStreetMap, NAMRIA, LGU offices) in various formats. A common format is needed for system integration.

### Decision

Use **GeoJSON** as the standard format for all geographic data layers: roads, bridges, drainage, evacuation centers, barangay boundaries, and flood zones.

### Reasoning

GeoJSON is human-readable, widely supported by GIS tools (QGIS, Leaflet, OpenStreetMap), and maps directly to web-friendly rendering. It avoids format conversion overhead and is consistent with the web-based architecture.

### Consequences

- All incoming data must be converted to GeoJSON during the data preparation pipeline.
- Data files follow a standardized naming convention: `roads.geojson`, `bridges.geojson`, `evacuation_centers.geojson`, etc.
- Coordinate reference system, accuracy, and currency must be documented per dataset.

### Source

`knowledge/data/00-data-sources.md`.
