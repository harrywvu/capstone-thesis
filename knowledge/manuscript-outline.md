# Manuscript Outline Map

This index maps the official CCIS BSIT LaTeX template to the current capstone foundation. The `.tex` files are the primary manuscript outline; this file is an internal navigation aid.

## Front Matter

- **Title and approval pages:** Metadata in `latex-template-ccis-paper-v2/main.tex`; final project name, adviser, panel, month, and approval details remain incomplete.
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

Primary foundation: `knowledge/00-capstone-definition.md`. Drafting is blocked by the unconfirmed study area, users/partner, simulation meaning, data availability, method, and evaluation design.

## Chapter 2 - Review of Related Literature

Template file: `latex-template-ccis-paper-v2/chapters/bsit/chapter2.tex`

- Flood Evacuation Planning and Decision Support
  - Flood Risk, Road Accessibility, and Evacuation Centers
  - Scenario-Based Simulation, Routing, and Optimization
- Related Systems
- Technical Background
- Conceptual Framework

Evidence required: scholarly literature, official disaster/geographic sources, standards where applicable, and verified documentation for approved technologies.

Architecture and data reference: `knowledge/architecture/` (system overview, rendering, computation, water simulation), `knowledge/data/` (data sources, DEM processing).

## Chapter 3 - Methodology

Template file: `latex-template-ccis-paper-v2/chapters/bsit/chapter3.tex`

- Research Design
- Data Gathering Tools
- Research Instruments
- Data Gathering Procedures
- Statistical Treatment of Data

Decisions required: study site, partner organization, design, datasets, algorithms, participants/validators, instruments, baselines, metrics, statistics, ethics, and deployment.

Architecture and data reference: Methodology draws on `knowledge/architecture/` for the system design (split architecture, D8 algorithm, API endpoints) and `knowledge/data/` for the data pipeline (DEM processing, OSM export, GeoJSON standardization).

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
