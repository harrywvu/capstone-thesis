# Sentinel

> **Working name:** Sentinel  
> **Capstone title:** *A 2D Simulation-Based Decision Support System for Flood Evacuation Planning*

Sentinel is a BS Information Technology capstone project that explores an interactive 2D decision-support system for flood-evacuation planning. It enables planners to configure and compare evacuation scenarios involving flood conditions, road closures, affected residents, evacuation-center capacity, and available resources.

The system is intended to support human planning decisions. It is not an autonomous emergency-response system, a public navigation tool, or a validated physical flood-forecasting model.

## Current status

The repository contains the capstone foundation, manuscript workspace, and an interactive controlled-demo prototype. The final study area, partner organization, deployment environment, data access, analytical methods, and evaluation design are still subject to confirmation.

Laoag City appears in the current data-source plan as a **candidate** study area only; it is not yet an approved project fact.

## Repository layout

```text
.
├── knowledge/                         # Canonical project definition, decisions, and manuscript map
├── latex-template-ccis-paper-v2/      # Official CCIS BSIT LaTeX manuscript template
├── sentinel-demo/                     # Interactive Sentinel prototype
├── assets/                            # Source/reference materials
└── DATA SOURCES AND TOOLS FOR SENTINEL.md
                                      # Candidate data sources and data-management plan
```

Generated manuscript output and local temporary tooling are intentionally excluded from version control through `.gitignore`.

## Project capabilities

The current project direction includes:

- Configuring flood-evacuation scenarios.
- Representing flooded or blocked roads, affected population, shelter capacity, and available vehicles/resources.
- Comparing feasible evacuation routes, center allocations, estimated clearance time, and resource plans.
- Displaying scenario conditions and results on an interactive 2D map.

The prototype uses controlled synthetic scenario data. Its outputs are demonstrations of decision-support interactions and must not be treated as operational recommendations without validated local data, a defined method, and formal evaluation.

## Documentation

Start with these files before making project or manuscript claims:

- [Capstone definition](knowledge/00-capstone-definition.md) — the canonical project scope, confirmed facts, and open questions.
- [Decision log](knowledge/decisions.md) — accepted and tentative project decisions.
- [Manuscript outline map](knowledge/manuscript-outline.md) — how the capstone foundation maps to the BSIT manuscript.
- [Data sources and tools plan](DATA%20SOURCES%20AND%20TOOLS%20FOR%20SENTINEL.md) — candidate data layers, sources, processing tools, and deployment considerations.

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

The main manuscript configuration is in [`latex-template-ccis-paper-v2/main.tex`](latex-template-ccis-paper-v2/main.tex). Update the final project title, adviser, panel, and other submission metadata only after they are verified.

## Prototype workflow

The interactive prototype is in [`sentinel-demo/`](sentinel-demo/) and runs on Node.js **22.13.0 or later**.

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

Planned data layers may include roads, bridges, drainage and waterways, flood zones, barangay boundaries, evacuation centers, population/affected-person estimates, and available resources. Candidate sources include OpenStreetMap, NAMRIA, local government offices, and the relevant disaster risk-reduction and management office.

Before implementation or evaluation, document the confirmed study area, data owner, data quality, coordinate reference system, coverage, date, permissions, and update process. Do not describe drainage data as a physical flood model unless an appropriate method, calibration data, and validation are in place.

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
