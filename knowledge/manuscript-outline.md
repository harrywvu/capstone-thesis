# Manuscript Outline Map

This index maps the official CCIS BSIT LaTeX template to the current capstone foundation. The `.tex` files are the primary manuscript outline; this file is an internal navigation aid.

## Front Matter

- **Title and approval pages:** Metadata in `latex-template-ccis-paper-v2/main.tex`; **OverFlow** is the approved project name. Adviser, panel, month, and approval details remain incomplete.
- **Acknowledgment:** Complete near submission using verified names and contributions.
- **Abstract:** Write last, based only on completed methods and results.
- **Contents and lists:** Generated automatically by the template.

## Chapter 1 - Introduction

Template file: `latex-template-ccis-paper-v2/chapters/bsit/chapter1.tex`

- Project Context (drafted)
- Purpose and Description
- Objectives of the Study
- Significance of the Study
- Scope and Delimitations of the Study
- Operational Definition of Terms

Primary foundation: `knowledge/00-capstone-definition.md`. The study area, operating organization, local data access, and evaluation design remain unresolved. The simulation meaning and core architecture are now defined: DEM-based D8 accumulation in the backend, with 3D terrain/water rendering and a top-down 2D-style analysis view.

## Chapter 2 - Review of Related Literature

Template file: `latex-template-ccis-paper-v2/chapters/bsit/chapter2.tex`

- Introduction
- Flood-Aware Road Accessibility and Geospatial Decision Support
- Shelter Capacity and Population Allocation
- Evacuation Simulation and Related Systems
- Terrain Processing and Evacuation Behavior
- Synthesis and Research Gap — heading retained; content intentionally deferred

The current review uses eight accepted sources recorded in `knowledge/literature/` and `latex-template-ccis-paper-v2/references/bibliography.bib`. Do not fill the synthesis and research-gap subsection until the team resumes it. The literature supports methodological context; it does not resolve the study area, routing/allocation algorithm, evaluation design, or deployment organization.

Architecture and data notes remain internal design references for Chapters 2 and 3. Claims about D8 must distinguish drainage-direction and contributing-area computation from the project's still-unvalidated rainfall-to-depth and threshold-classification steps.

## Chapter 3 - Methodology

Template file: `latex-template-ccis-paper-v2/chapters/bsit/chapter3.tex`

- Research Design
- Data Gathering Tools
- Research Instruments
- Data Gathering Procedures
- Statistical Treatment of Data

Decisions required: study site, partner organization, obtainable datasets, participants/validators, instruments, baselines, metrics, statistics, ethics, and deployment. The current technical plan already specifies the split architecture, DEM processing workflow, D8/flow-accumulation simulation, and planned `/api/terrain`, `/api/simulate`, and `/api/analyze` endpoints; these remain subject to implementation and validation.

Architecture and data reference: Methodology draws on `knowledge/architecture/` for the system design (split architecture, rendering components, D8 algorithm, API endpoints) and `knowledge/data/` for the data pipeline (DEM acquisition, cleaning, normalization, resolution choice, OSM export, and GeoJSON standardization).

## Chapter 4 - Results and Discussion

Template file: `latex-template-ccis-paper-v2/chapters/bsit/chapter4.tex`

- System Development and Scenario-Analysis Results
- System Evaluation Results

This chapter remains an evidence-reporting outline. It must not contain predicted or invented results.

## Chapter 5 - Conclusions and Recommendations

Template file: `latex-template-ccis-paper-v2/chapters/bsit/chapter5.tex`

- Conclusion
- Recommendation

Every conclusion must answer an approved question or objective using Chapter 4 evidence. Recommendations must follow from observed findings and limitations.

## Back Matter

- **References:** Managed with Biber in `references/bibliography.bib`; only verified and cited sources belong here.
- **Appendices:** Detailed tables and approved research instruments, subject to privacy, licensing, and ethics restrictions.
- **Curriculum Vitae:** One verified entry per researcher; private contact details require consent before repository inclusion.
