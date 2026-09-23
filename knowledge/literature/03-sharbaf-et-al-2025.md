# Sharbaf et al. (2025): Risk-Based Shelter Network Design

## Citation

M. Sharbaf, V. Bélanger, M. Cherkesly, M.-È. Rancourt, and G. M. Toglia, “Risk-based shelter network design in flood-prone areas: An application to Haiti,” *Omega*, vol. 131, art. 103194, 2025. DOI: [10.1016/j.omega.2024.103194](https://doi.org/10.1016/j.omega.2024.103194).

BibLaTeX key: `sharbaf2025`.

## Material Reviewed

- Publisher abstract, highlights, and article preview.
- Open working-paper record: [CIRRELT-2024-08](https://www.cirrelt.ca/documentstravail/cirrelt-2024-08.pdf).

## Study Purpose and Context

The study develops a risk-based mathematical-programming approach for shelter-network design in flood-prone areas and applies it in Haiti in collaboration with public and development partners. It connects preparedness decisions about shelter location with the risks encountered by populations and evacuation paths during flood response.

## Model Components

- Population risk, shelter risk, and evacuation-path risk.
- Pedestrian evacuation and flood exposure.
- Shelter-network coverage and location decisions.
- GIS-based data preparation and mathematical optimization.
- An explicit risk concept based on hazard, exposure, and vulnerability.

## Findings Relevant to OverFlow

- Proximity alone is insufficient for shelter assignment when a shelter or the path to it is exposed to flooding.
- Preparedness decisions can benefit from considering response-phase accessibility and risk.
- Population coverage and safe access can be treated as explicit optimization criteria.

## Limits and Transferability

- The study addresses strategic shelter-network design, including permanent shelter infrastructure, rather than only operational assignment to an existing set of local centers.
- It focuses on pedestrian evacuation and a Haitian application.
- OverFlow has not adopted the paper's objective function, risk measures, data requirements, or solver.
- The paper does not validate the proposed terrain-based flood classification in OverFlow.

## Safe Uses in the Manuscript

- Support treating shelter choice as a risk- and capacity-aware decision rather than a nearest-destination lookup.
- Identify population coverage, shelter safety, and route exposure as candidate allocation and evaluation criteria.
- Show how GIS and operations research can be combined for flood shelter planning.

## Do Not Infer

- That OverFlow performs risk-based optimization unless the model is formally adopted and tested.
- That a shelter assignment is optimal without a defined objective function, constraints, and solver evidence.
- That results from Haiti transfer directly to the selected Philippine study area.
