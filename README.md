# OverFlow

> **Project name:** OverFlow  
> **Capstone title:** *OverFlow: A Geospatial Decision Support System for Flood Evacuation Planning*

OverFlow is a BS Information Technology capstone project developing an interactive 3D geospatial decision-support system for flood-evacuation planning. It enables planners to configure and compare evacuation scenarios involving flood conditions, road closures, affected residents, evacuation-center capacity, and available resources.

The system is intended to support human planning decisions. It is not an autonomous emergency-response system, a public navigation tool, or a validated physical flood-forecasting model.

## Current status

The repository contains the capstone foundation, manuscript workspace, and an interactive controlled-demo prototype. **Laoag City, Ilocos Norte is the confirmed study area.** A Laoag City Hall package with terrain, map, and population files has been received. Pilot barangays, the partner organization, deployment environment, remaining data access, analytical methods, and evaluation design are still subject to confirmation.

UP TCAGP's LiPAD has responded as a prospective source of DTM data, but exact Laoag coverage, access under its NDA, metadata, and delivery remain pending. Its reply did not confirm Flood Hazard Map availability. The Batac area-of-interest file in `letters/lipad-aoi/` belongs to the earlier two-city inquiry and is not part of the active study area.

## Repository layout

```text
.
├── knowledge/                         # Canonical project definition, decisions, and manuscript map
├── latex-template-ccis-paper-v2/      # Official CCIS BSIT LaTeX manuscript template
├── sentinel-demo/                     # Existing workspace path for the OverFlow defense demo
├── demo-api/                          # Local synthetic demo service
├── letters/                           # Draft data requests and candidate AOIs
├── assets/                            # Source/reference materials
└── DATA SOURCES AND TOOLS FOR OVERFLOW.md
                                      # Candidate data sources and data-management plan
```

The manuscript PDF is tracked in this repository and should be regenerated after LaTeX edits; auxiliary LaTeX output and local temporary tooling are excluded through `.gitignore`.

## Project capabilities

The current project direction includes:

- Configuring flood-evacuation scenarios.
- Representing flooded or blocked roads, affected population, shelter capacity, and available vehicles/resources.
- Comparing feasible evacuation routes, center allocations, estimated clearance time, and resource plans.
- Displaying scenario conditions and results in an interactive 3D terrain view with an overhead map-like camera.

The prototype uses controlled synthetic scenario data and a separate illustrative rainfall-runoff solver. The intended research method remains DEM-based D8 terrain analysis; its rainfall-to-flood-classification method still needs a defined formula and validation. Prototype outputs are demonstrations of decision-support interactions, not operational recommendations.

## Documentation

Start with these files before making project or manuscript claims:

- [Capstone definition](knowledge/00-capstone-definition.md) — the canonical project scope, confirmed facts, and open questions.
- [Current decisions](knowledge/decisions.md) — active design choices and open method boundaries.
- [Manuscript outline map](knowledge/manuscript-outline.md) — how the capstone foundation maps to the BSIT manuscript.
- [Data sources and tools plan](DATA%20SOURCES%20AND%20TOOLS%20FOR%20OVERFLOW.md) — candidate data layers, sources, processing tools, and deployment considerations.
- [Laoag data package assessment](knowledge/data/02-laoag-city-hall-package.md) — what the supplied files can support, quality checks, and remaining requests.
- [LiPAD response status](knowledge/data/03-lipad-response.md) — the prospective DTM source, access conditions, and unanswered coverage questions.

## Manuscript workflow

The manuscript uses the official CCIS LaTeX template in [`latex-template-ccis-paper-v2/`](latex-template-ccis-paper-v2/). It is configured for BSIT, so manuscript work belongs in `chapters/bsit/`.

Requirements:

- A LaTeX distribution with `pdflatex`.
- Biber for bibliography processing.

From the template directory, use the standard build sequence:

```bash
pdflatex main
biber main
pdflatex main
pdflatex main
```

The main manuscript configuration is in [`latex-template-ccis-paper-v2/main.tex`](latex-template-ccis-paper-v2/main.tex). The adviser and panel names are supplied by the team; confirm the submission and examination dates before final submission.

## Prototype workflow

The interactive prototype is in [`sentinel-demo/`](sentinel-demo/), an existing hosting workspace path, and runs on Node.js **22.13.0 or later**. The visible product name is **OverFlow**.

### Offline title-defense demo

The two-page defense demo uses a local FastAPI service and the frontend. Install dependencies once while online, then launch both services locally:

```bash
./scripts/setup-demo.sh
./scripts/start-demo.sh
```

The area selector is at the frontend's local address; selecting a sector opens the 3D workspace. The Python API listens on `127.0.0.1:8000`. The defense run needs no network connection after setup. All three conceptual Laoag sectors use the same deterministic synthetic terrain and scenery. They illustrate the selected city conceptually but do not represent verified Laoag geography. Rainfall, runoff, and depth are simulated over time on the synthetic grid by a demo-only method that has not been calibrated or validated with real data. Evacuation results remain illustrative. See [demo-api/README.md](demo-api/README.md) for the model assumptions and limits.

```bash
cd sentinel-demo
npm install
npm run dev
```

Useful commands:

```bash
npm run build
npm run lint
npm run format
```

`sentinel-demo` is part of this repository. Run its Node.js commands from that directory, then stage and commit its changes from the repository root.

## Data direction

Required data categories include a DEM, roads and bridges, barangay boundaries, evacuation centers and capacities, affected population, and available resources. Drainage and waterways are reference layers; historical flood records can support validation. The Laoag City Hall package is in hand, and UP TCAGP/LiPAD is a confirmed prospective DTM provider. OpenStreetMap, NAMRIA, other terrain providers, and relevant local offices remain candidate sources for other or alternative data.

The supplied Laoag files cover terrain, boundaries, population, roads, flood susceptibility, and reference layers. They do not yet supply a usable evacuation-center register or current, location-specific rescue resources. See the [read-only package assessment](knowledge/data/02-laoag-city-hall-package.md).

Before implementation or evaluation, document Laoag pilot coverage, data owner, data quality, coordinate reference system, coverage, date, permissions, and update process. Do not describe drainage data as a physical flood model unless an appropriate method, calibration data, and validation are in place.

## Team

- John Harold A. Alejo
- Cyrus Kirby Gaor
- Bradley Kjiel Pasalo
- Joshearie Kristoffer Landicho

## Working agreement

- Keep the [capstone definition](knowledge/00-capstone-definition.md) aligned with manuscript text, diagrams, implementation choices, and research claims.
- Mark unresolved details as unresolved; do not convert candidate data sources, technologies, locations, or methods into facts without confirmation.
- Edit only `chapters/bsit/` for this BSIT capstone.
- Keep generated output, local caches, and temporary tooling out of commits.
