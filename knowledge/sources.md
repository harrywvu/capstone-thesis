# Source Index

## `assets/selected capstone.pdf`

- **Type:** Selected-capstone presentation, 8 slides.
- **Contains:** Working title, team, motivation, problem, research gap, proposed solution, inputs, outputs, architecture, research thrust, and SDGs.
- **Authority:** High for the accepted central concept. Technology labels and undefined claims remain proposal-stage unless confirmed.
- **Supports:** Problem, solution, users, use case, input-processing-output chain, capabilities, working research direction, SDGs, and thrust.
- **Notes:** See `knowledge/raw/selected-capstone-presentation-notes.md`.

## `DATA SOURCES AND TOOLS FOR SENTINEL.md` (now relates to **OverFlow**)

- **Type:** Team-prepared response to adviser feedback.
- **Contains:** Proposed drainage, road, map, and center data; candidate sources; GIS tools; formats; and data flow. Superseded in technical detail by `knowledge/data/` directory.
- **Authority:** High as evidence of the team's answer, but not proof that any candidate dataset is accessible or that a particular locality is approved.
- **Supports:** Data requirements, candidate sources, preparation workflow, potential formats, and deployment questions.

## `latex-template-ccis-paper-v2/`

- **Type:** Official CCIS LaTeX template, version 2.
- **Contains:** BSCS/BSIT modes, chapter structures, metadata, and Biber bibliography infrastructure.
- **Authority:** High for manuscript structure and formatting workflow.
- **Supports:** LaTeX usage, BSIT Chapter 1 structure, program-specific editing rule, and bibliography location.

## Team clarifications, 2026-09-07

- **Type:** Direct team clarification.
- **Contains:** The idea is accepted; **Sentinel** was the initial working name, later approved as **OverFlow**; the project is BSIT; Scientific Computing and Optimization is the research thrust; flood simulation uses terrain-based accumulation (not hydraulic modeling); user controls are operational parameters only.
- **Authority:** Highest for current project decisions.

## `knowledge/architecture/`

- **Type:** System architecture documentation.
- **Contains:**
  - `00-overview.md` — split architecture (Python backend + TypeScript frontend), technology stack, data flow, and key decisions.
  - `01-rendering.md` — React Three Fiber rendering components (terrain, water, buildings, roads), camera/controls.
  - `02-computation.md` — FastAPI backend, DEM processing, D8 flow direction, flow accumulation, rainfall distribution, flood threshold, and planned API endpoints.
  - `03-water-simulation.md` — Detailed simulation algorithm (5 steps), limitations, validation approach.
- **Authority:** High for technical design. These are the confirmed architecture decisions.
- **Important distinction:** The planning problem is represented in a two-dimensional geographic space, while the frontend renders terrain and water as 3D meshes. A top-down camera mode supports 2D-style analysis.
- **Supports:** Chapter 2 (Technical Background), Chapter 3 (Methodology — system design), and Chapter 4 (system implementation).

## `knowledge/data/`

- **Type:** Data sourcing and processing documentation.
- **Contains:**
  - `00-data-sources.md` — DEM source candidates (NAMRIA, Phil-LiDAR, SRTM, Mapbox Terrain-RGB), OpenStreetMap data types, local-government data requirements, and the data pipeline.
  - `01-dem-processing.md` — DEM definition, processing steps (fetch, decode, clean, normalize, export), and resolution/performance guidance.
- **Important distinction:** GeoJSON is the standard for vector layers such as roads, bridges, centers, boundaries, and flood zones. DEM data may be obtained as raster/GeoTIFF and is converted to a NumPy grid; JSON is used for API interchange.
- **Authority:** High for data requirements and processing workflow, but candidate availability and local coverage remain unverified.
- **Supports:** Chapter 2 (Technical Background — GIS and data formats), Chapter 3 (Methodology — data gathering and processing), and Section 15 of the capstone definition (Data Requirements).

## `knowledge/literature/`

- **Type:** Internal evidence notes for the eight scholarly and official technical sources currently cited in Chapter 2.
- **Contains:** Verified metadata, material reviewed, methods, findings, limitations, safe uses, and cautions against unsupported transfer to OverFlow.
- **Authority:** Secondary index only. The linked journal articles and official technical documentation remain the authoritative sources.
- **Supports:** Chapter 2 citations and later methodology decisions that explicitly adopt and validate a reviewed method.
- **Notes:** Start with `knowledge/literature/00-index.md`; citation records are maintained in `latex-template-ccis-paper-v2/references/bibliography.bib`.

## Source-handling note

Project materials establish what the team currently proposes. They are not substitutes for scholarly literature, official dataset metadata, or empirical evidence. Eight sources are currently accepted for the Chapter 2 preliminary review; accepting them as literature does not automatically adopt their algorithms, assumptions, study areas, or performance claims for OverFlow. The template's sample bibliography entries were removed from the active BSIT outline so they cannot be mistaken for project evidence.
