# Bera et al. (2023): Multi-Hazard Shelter Location-Allocation

## Citation

S. Bera, K. R. Gnyawali, K. Dahal, R. Melo, M. Li-Juan, B. Guru, and G. V. Ramana, “Assessment of shelter location-allocation for multi-hazard emergency evacuation,” *International Journal of Disaster Risk Reduction*, vol. 84, art. 103435, 2023. DOI: [10.1016/j.ijdrr.2022.103435](https://doi.org/10.1016/j.ijdrr.2022.103435).

BibLaTeX key: `bera2023`.

## Material Reviewed

- Publisher abstract, highlights, introduction, and available article material.

## Study Purpose and Context

The study evaluates shelter access when rainstorms produce both flooding and landslides in a mountainous village in the Western Ghats, India. It recreates the conditions of a destructive 2005 event.

## Data and Methods

- Random Forest susceptibility models in Google Earth Engine.
- Separate flood and landslide susceptibility information.
- Schools represented as candidate shelters and households as demand points.
- GIS P-median modeling for shelter location and household distance.
- Maximal-covering location analysis for household coverage within time limits.

## Main Results

- The existing shelters could not serve all households within either 30- or 60-minute access limits.
- Combining hazard susceptibility with location-allocation exposed settlement clusters with inadequate shelter access.

## Relevance and Limits for OverFlow

The study supports measuring the share of affected households that can reach a safe shelter within an operational limit. Its models are simplified single-objective formulations, and the case combines hazards that may not be in OverFlow's scope. The available evidence does not establish local capacity values or an appropriate cutoff for the project.

## Safe Uses in the Manuscript

- Support evaluating population coverage rather than proximity alone.
- Support excluding hazard-exposed shelters and inaccessible routes before allocation.
- Identify P-median and maximal covering as candidate methods requiring local justification.

## Do Not Infer

- That existing OverFlow centers are insufficient before local analysis.
- That a 30- or 60-minute cutoff is automatically appropriate.
- That the project implements Random Forest or multi-hazard modeling.
