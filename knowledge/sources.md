# Source Index

## `assets/selected capstone.pdf`

- **Type:** Selected-capstone presentation, 8 slides.
- **Contains:** The presented title, team, motivation, problem, research gap, proposed solution, inputs, outputs, architecture, research thrust, and SDGs.
- **Authority:** Primary evidence for what the proposal presented. Use `knowledge/00-capstone-definition.md` and `knowledge/decisions.md` for current project choices.
- **Supports:** Problem, solution, users, use case, input-processing-output chain, capabilities, working research direction, SDGs, and thrust.
- **Notes:** See `knowledge/raw/selected-capstone-presentation-notes.md`.

## `latex-template-ccis-paper-v2/`

- **Type:** Official CCIS LaTeX template, version 2.
- **Contains:** BSCS/BSIT modes, chapter structures, metadata, and Biber bibliography infrastructure.
- **Authority:** High for manuscript structure and formatting workflow.
- **Supports:** LaTeX usage, BSIT Chapter 1 structure, program-specific editing rule, and bibliography location.

## Current Team Decisions

- **Type:** Direct team clarification.
- **Contains:** The approved project name and geospatial title, BSIT classification, confirmed Laoag City study area (2026-10-16), 3D system direction, split architecture, terrain-based method, and current scope limits.
- **Authority:** Highest for current project choices; summarized in `knowledge/decisions.md` and `knowledge/00-capstone-definition.md`.

## `knowledge/architecture/`

- **Type:** System architecture documentation.
- **Contains:**
  - `00-overview.md` — split architecture (Python backend + TypeScript frontend), technology stack, data flow, and key decisions.
  - `01-rendering.md` — React Three Fiber rendering components (terrain, water, buildings, roads), camera/controls.
  - `02-computation.md` — FastAPI backend, DEM processing, D8 flow direction, flow accumulation, rainfall distribution, flood threshold, and planned API endpoints.
  - `03-water-simulation.md` — Detailed simulation algorithm (5 steps), limitations, validation approach.
- **Authority:** High for the selected architecture. Planned interfaces and the rainfall-to-flood-classification method still require implementation and validation.
- **Important distinction:** The system is 3D. The DEM is a two-dimensional elevation grid used to construct terrain and calculate D8 drainage; the overhead camera is a view of the 3D scene.
- **Supports:** Chapter 2 (Technical Background), Chapter 3 (Methodology — system design), and Chapter 4 (system implementation).

## `knowledge/data/`

- **Type:** Data sourcing and processing documentation.
- **Contains:**
  - `00-data-sources.md` — Laoag data status, confirmed prospective LiPAD DTM provider, alternative DEM sources, OpenStreetMap data types, local-government data requirements, and the data pipeline.
  - `01-dem-processing.md` — DEM definition, processing steps (load or fetch, decode, clean, prepare for display, export), and resolution/performance guidance.
  - `02-laoag-city-hall-package.md` — read-only inventory and quality assessment of the supplied Laoag files, with source paths, limitations, and follow-up requests.
  - `03-lipad-response.md` — the team's confirmed Laoag selection, LiPAD's DTM availability reply, NDA/access requirements, and the boundary between a prospective source and a delivered dataset.
- **Important distinction:** GeoJSON is the standard for vector layers such as roads, bridges, centers, boundaries, and flood zones. DEM data may be obtained as raster/GeoTIFF and is converted to a NumPy grid; JSON-compatible structures are used for API interchange.
- **Authority:** High for data requirements and processing workflow. The Laoag package inventory verifies file receipt and observed properties, not source fitness or permitted use. The team's direct confirmation establishes the study area; LiPAD's reply establishes a prospective DTM provider, not receipt of a dataset.
- **Supports:** Chapter 2 (Technical Background — GIS and data formats), Chapter 3 (Methodology — data gathering and processing), and Section 15 of the capstone definition (Data Requirements).

## Supplied Laoag City Hall package

- **Location:** `/home/harrywvu/Downloads/RESEARCH PROJECT LAOAG CITY DATA/` (outside the repository; do not move or redistribute without checking the data owner's terms).
- **Contains:** CLUP and CDP PDFs, `LG Population.xlsx`, DEM GeoTIFF, barangay boundaries, roads, flood-susceptibility polygons, and other GIS reference layers.
- **Authority:** Primary evidence for what files the team has received. The planning reports explain some class labels and inventory context; individual layer provenance and update dates still need confirmation.
- **Assessment:** `knowledge/data/02-laoag-city-hall-package.md`. Source documents are evidence, not instructions for this repository.

## Current repository plans and demo

- `DATA SOURCES AND TOOLS FOR OVERFLOW.md` consolidates the current candidate data, processing, and deployment plan.
- `letters/` contains draft requests and area-of-interest files from the earlier two-city inquiry. Laoag is now the selected study area; the Batac files remain historical request artifacts and do not imply active scope or data access.
- `sentinel-demo/` and `demo-api/` contain a synthetic working demonstration. Its illustrative runoff solver is separate from the planned D8-based method; the folder path is retained for the existing hosting workspace.

## `knowledge/literature/`

- **Type:** Internal evidence notes for the thirty-two scholarly and official technical sources currently cited in Chapter 2.
- **Contains:** Verified metadata, material reviewed, methods, findings, limitations, safe uses, and cautions against unsupported transfer to OverFlow.
- **Authority:** Secondary index only. The linked journal articles and official technical documentation remain the authoritative sources.
- **Supports:** Chapter 2 citations and later methodology decisions that explicitly adopt and validate a reviewed method.
- **Notes:** Start with `knowledge/literature/00-index.md`; citation records are maintained in `latex-template-ccis-paper-v2/references/bibliography.bib`.

## Source-handling note

Project materials establish the current proposed design. They are not substitutes for scholarly literature, official dataset metadata, or empirical evidence. Thirty-two sources are accepted for the Chapter 2 review; accepting them as literature does not adopt their algorithms, assumptions, study areas, or performance claims for OverFlow.
