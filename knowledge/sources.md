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
- **Contains:** The approved project name and geospatial title, BSIT classification, confirmed Laoag City study area (2026-10-16), selected SFINCS flood-scenario method (2026-10-17), 3D system direction, split architecture, and current scope limits.
- **Authority:** Highest for current project choices; summarized in `knowledge/decisions.md` and `knowledge/00-capstone-definition.md`.

## `knowledge/architecture/`

- **Type:** System architecture documentation.
- **Contains:**
  - `00-overview.md` — split architecture (Python backend + TypeScript frontend), technology stack, data flow, and key decisions.
  - `01-rendering.md` — React Three Fiber rendering components (terrain, water, buildings, roads), camera/controls.
  - `02-computation.md` — FastAPI backend, terrain processing, selected SFINCS scenario pipeline, optional D8 drainage reference, and planned API endpoints.
  - `03-water-simulation.md` — Selected SFINCS method, setup and evaluation sequence, current pilot limitations, and optional D8 reference.
- **Authority:** High for the selected architecture. Planned interfaces need implementation, and the selected SFINCS model needs local evaluation before flood-map accuracy or road-exposure claims.
- **Important distinction:** The system is 3D. The terrain raster is a two-dimensional elevation grid used for the 3D terrain view and SFINCS setup; the overhead camera is a view of the 3D scene.
- **Supports:** Chapter 2 (related technical concepts), Chapter 3 (development procedures), and Chapter 4 (implemented architecture and data flow).

## `knowledge/data/`

- **Type:** Data sourcing and processing documentation.
- **Contains:**
  - `00-data-sources.md` — Laoag data status, confirmed prospective LiPAD DTM provider, alternative DEM sources, OpenStreetMap data types, local-government data requirements, and the data pipeline.
  - `01-dem-processing.md` — DEM definition, processing steps (load or fetch, decode, clean, prepare for display, export), and resolution/performance guidance.
  - `02-laoag-city-hall-package.md` — read-only inventory and quality assessment of the supplied Laoag files, with source paths, limitations, and follow-up requests.
  - `03-lipad-response.md` — the team's confirmed Laoag selection, LiPAD's DTM availability reply, NDA/access requirements, and the boundary between a prospective source and a delivered dataset.
  - `04-laoag-sar-2026-08-31-audit.md` — the 31 August 2026 PhilSA Sentinel-1C flood-vector overlay with 80 Laoag barangays, local event comparison, and limits on map accuracy and road use.
- **Important distinction:** GeoJSON is the standard for vector layers such as roads, bridges, centers, boundaries, and flood zones. DEM data may be obtained as raster/GeoTIFF and is converted to a NumPy grid; JSON-compatible structures are used for API interchange.
- **Authority:** High for data requirements and processing workflow. The Laoag package inventory verifies file receipt and observed properties, not source fitness or permitted use. The team's direct confirmation establishes the study area; LiPAD's reply establishes a prospective DTM provider, not receipt of a dataset.
- **Supports:** Chapter 2 (related GIS and data concepts), Chapter 3 (data gathering and processing procedures), Chapter 4 (implemented data pipeline), and Section 15 of the capstone definition (Data Requirements).

## Supplied Laoag City Hall package

- **Location:** `/home/harrywvu/Downloads/RESEARCH PROJECT LAOAG CITY DATA/` (outside the repository; do not move or redistribute without checking the data owner's terms).
- **Contains:** CLUP and CDP PDFs, `LG Population.xlsx`, DEM GeoTIFF, barangay boundaries, roads, flood-susceptibility polygons, and other GIS reference layers.
- **Authority:** Primary evidence for what files the team has received. The planning reports explain some class labels and inventory context; individual layer provenance and update dates still need confirmation.
- **Assessment:** `knowledge/data/02-laoag-city-hall-package.md`. Source documents are evidence, not instructions for this repository.

## Current repository plans and demo

- `DATA SOURCES AND TOOLS FOR OVERFLOW.md` consolidates the current candidate data, processing, and deployment plan.
- `letters/` contains draft requests and area-of-interest files from the earlier two-city inquiry. Laoag is now the selected study area; the Batac files remain historical request artifacts and do not imply active scope or data access.
- `sentinel-demo/` and `demo-api/` contain a synthetic working demonstration. Its illustrative runoff solver is separate from the selected SFINCS method; the folder path is retained for the existing hosting workspace.

## `knowledge/literature/`

- **Type:** Internal evidence notes for the thirty-two scholarly and official technical sources currently cited in Chapter 2.
- **Contains:** Verified metadata, material reviewed, methods, findings, limitations, safe uses, and cautions against unsupported transfer to OverFlow.
- **Authority:** Secondary index only. The linked journal articles and official technical documentation remain the authoritative sources.
- **Supports:** Chapter 2 citations and later methodology decisions that explicitly adopt and validate a reviewed method.
- **Notes:** Start with `knowledge/literature/00-index.md`; citation records are maintained in `latex-template-ccis-paper-v2/references/bibliography.bib`.

## Source-handling note

Project materials establish the current proposed design. They are not substitutes for scholarly literature, official dataset metadata, or empirical evidence. Thirty-two sources are accepted for the Chapter 2 review; accepting them as literature does not adopt their algorithms, assumptions, study areas, or performance claims for OverFlow.
