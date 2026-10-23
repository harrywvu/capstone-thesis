# Manuscript Outline Map

This index maps the official CCIS BSIT LaTeX template to the current capstone foundation. The `.tex` files are the primary manuscript outline; this file is an internal navigation aid.

## Front Matter

- **Title and approval pages:** Metadata in `latex-template-ccis-paper-v2/main.tex` uses **OverFlow: Flood Simulation and Satellite-Derived Flood Information for Scenario-Based Evacuation Planning in Laoag City**. The adviser and dean are Dr. Saturnina F. Nisperos. Retain the original panel-name placeholders as instructed by the team. The August 2026 cover date is provisional, and the approval-sheet examination date is marked for confirmation.
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

Primary foundation: `knowledge/00-capstone-definition.md` and `knowledge/01-user-actions.md`. Chapter 1 describes Laoag City as the confirmed study area, the received City Hall data and remaining data limitations, barangay-based scenario configuration, capacity-constrained evacuation planning, unserved demand, and scenario comparison. All 80 coded barangays are planned for interface selection; barangays 38-A, 38-B, and 39 were used for a technical SFINCS pilot. Final observed-event evaluation coverage, the operating organization, and final datasets remain unresolved. SFINCS is the newly selected flood-scenario method, with local validation pending. Research procedures and data-gathering plans belong in Chapter 3; implemented system architecture and data flow will be reported in Chapter 4.

## Chapter 2 - Review of Related Literature

Template file: `latex-template-ccis-paper-v2/chapters/bsit/chapter2.tex`

- Introduction
- Flood-Aware Road Accessibility and Geospatial Decision Support
- Shelter Capacity and Population Allocation
- Evacuation Simulation and Related Systems
- Terrain Processing and Evacuation Behavior
- Synthesis and Research Gap — drafted from the thirty-two accepted sources

The current review uses thirty-two accepted sources recorded in `knowledge/literature/` and `latex-template-ccis-paper-v2/references/bibliography.bib`. The synthesis identifies a need for an accessible Philippine planning workflow that connects terrain-derived flood scenarios, road accessibility, routes, capacity-constrained center assignment, and resource estimates. The literature supports this methodological direction; it does not resolve the routing/allocation algorithm, evaluation design, or deployment organization. The added studies strengthen the review of integrated flood-evacuation planning, vulnerable-population access, risk-tested shelter selection, dynamic routing and rerouting, congestion, Philippine road vulnerability, compound hazards, open-data modeling, and relief logistics.

Architecture and data notes remain internal design references; the implemented architecture belongs with system-development results in Chapter 4. D8 literature supports only an optional drainage-reference layer. SFINCS literature supports model setup, while its selection is a team decision and the existing Laoag runs do not establish local flood-map accuracy.

## Chapter 3 - Methodology

Template file: `latex-template-ccis-paper-v2/chapters/bsit/chapter3.tex`

- Research Design
- Data Gathering Tools
- Research Instruments
- Data Gathering Procedures
- Statistical Treatment of Data

The current research plan uses a descriptive-developmental, design-science process, iterative and incremental software development, a dataset inventory, functional and scenario tests, and proposed staff interviews and task evaluation. Descriptive counts, percentages, item-level rating summaries, and qualitative themes are planned; no other-system baseline comparison is planned. Laoag CDRRMO is the proposed partner, not a confirmed operator or participant source. Final observed-event evaluation coverage, participant access, exact instruments and task criteria, SFINCS measures and thresholds, ethics arrangements, obtainable datasets, and deployment still require confirmation. The synthetic demo uses a separate runoff solver. Chapter 3 should describe procedures and their conditional data/participation gates without presenting implementation architecture as a required methodology subsection.

Data reference: Methodology draws on `knowledge/data/` and the SFINCS pilot plan for acquisition, source checks, terrain preparation, forcing, and observed-event evaluation. The design documents in `knowledge/architecture/` guide development but are reported as implemented evidence in Chapter 4.

## Chapter 4 - Results and Discussion

Template file: `latex-template-ccis-paper-v2/chapters/bsit/chapter4.tex`

- System Development and Scenario-Analysis Results
- System Evaluation Results

Chapter 4 now includes the ten design diagrams and descriptive text from the supplied Chapter4.docx draft. The diagrams are presented as design artifacts, not as proof of completed implementation. Scenario-analysis and evaluation findings remain pending recorded tests, participant data, and validated results; predicted or invented findings must not be added.

## Chapter 5 - Conclusions and Recommendations

Template file: `latex-template-ccis-paper-v2/chapters/bsit/chapter5.tex`

- Conclusion
- Recommendation

Every conclusion must answer an approved question or objective using Chapter 4 evidence. Recommendations must follow from observed findings and limitations.

## Back Matter

- **References:** Managed with Biber in `references/bibliography.bib`; only verified and cited sources belong here.
- **Appendices:** Detailed tables and approved research instruments, subject to privacy, licensing, and ethics restrictions.
- **Curriculum Vitae:** One verified entry per researcher; private contact details require consent before repository inclusion.
