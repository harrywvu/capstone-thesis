# Manuscript Outline Map

This index maps the official CCIS BSIT LaTeX template to the current capstone foundation. The `.tex` files are the primary manuscript outline; this file is an internal navigation aid.

## Front Matter

- **Title and approval pages:** Metadata in `latex-template-ccis-paper-v2/main.tex` uses **OverFlow: A Geospatial Decision Support System for Flood Evacuation Planning**. The adviser and dean are Dr. Saturnina F. Nisperos. Retain the original panel-name placeholders as instructed by the team. The August 2026 cover date is provisional, and the approval-sheet examination date is marked for confirmation.
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

Primary foundation: `knowledge/00-capstone-definition.md` and `knowledge/01-user-actions.md`. Chapter 1 describes Laoag City as the confirmed study area, the received City Hall data and remaining data limitations, barangay-based scenario configuration, capacity-constrained evacuation planning, unserved demand, and scenario comparison. Pilot barangays, the operating organization, final datasets, and evaluation design remain unresolved. The D8-based rainfall-classification boundary is stated at scope level; detailed algorithms, data processing, provider follow-up, and evaluation procedures belong in Chapter 3.

## Chapter 2 - Review of Related Literature

Template file: `latex-template-ccis-paper-v2/chapters/bsit/chapter2.tex`

- Introduction
- Flood-Aware Road Accessibility and Geospatial Decision Support
- Shelter Capacity and Population Allocation
- Evacuation Simulation and Related Systems
- Terrain Processing and Evacuation Behavior
- Synthesis and Research Gap — drafted from the thirty-two accepted sources

The current review uses thirty-two accepted sources recorded in `knowledge/literature/` and `latex-template-ccis-paper-v2/references/bibliography.bib`. The synthesis identifies a need for an accessible Philippine planning workflow that connects terrain-derived flood scenarios, road accessibility, routes, capacity-constrained center assignment, and resource estimates. The literature supports this methodological direction; it does not resolve the routing/allocation algorithm, evaluation design, or deployment organization. The added studies strengthen the review of integrated flood-evacuation planning, vulnerable-population access, risk-tested shelter selection, dynamic routing and rerouting, congestion, Philippine road vulnerability, compound hazards, open-data modeling, and relief logistics.

Architecture and data notes remain internal design references for Chapters 2 and 3. Claims about D8 must distinguish drainage-direction and contributing-area computation from the project's still-unvalidated rainfall-to-indicator and threshold-classification steps.

## Chapter 3 - Methodology

Template file: `latex-template-ccis-paper-v2/chapters/bsit/chapter3.tex`

- Research Design
- Data Gathering Tools
- Research Instruments
- Data Gathering Procedures
- Statistical Treatment of Data

Decisions required: Laoag pilot barangays, partner organization, obtainable datasets, participants/validators, instruments, baselines, metrics, statistics, ethics, and deployment. The technical plan specifies the split architecture, DEM processing workflow, D8/flow-accumulation terrain analysis, and planned `/api/terrain`, `/api/simulate`, and `/api/analyze` endpoints; rainfall classification remains undefined and the design requires implementation and validation. The current synthetic demo uses a separate runoff solver.

Architecture and data reference: Methodology draws on `knowledge/architecture/` for the system design (split architecture, rendering components, D8 algorithm, API endpoints) and `knowledge/data/` for the data pipeline (DEM acquisition, NoData handling, display scaling, working-grid resolution, OSM export, and GeoJSON standardization).

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
