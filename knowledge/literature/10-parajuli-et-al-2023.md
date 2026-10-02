# Parajuli et al. (2023): GIS Flood Evacuation Routing in Nepal

## Citation

G. Parajuli, S. Neupane, S. Kunwar, R. Adhikari, and T. D. Acharya, “A GIS-based evacuation route planning in flood-susceptible area of Siraha Municipality, Nepal,” *ISPRS International Journal of Geo-Information*, vol. 12, no. 7, art. 286, 2023. DOI: [10.3390/ijgi12070286](https://doi.org/10.3390/ijgi12070286).

BibLaTeX key: `parajuli2023`.

## Material Reviewed

- Full open-access article, including susceptibility mapping, network analysis, validation, results, and limitations.

## Study Purpose and Context

The study combines flood-susceptibility assessment, safe-shelter screening, and pedestrian evacuation routing for Siraha Municipality, Nepal.

## Data and Methods

- GIS-based Analytical Hierarchy Process over nine flood-conditioning factors.
- Weighted-overlay classification into flood-susceptibility levels.
- Assembly points inside risk zones and shelters inside safe zones.
- Closest-facility and service-area network analysis.
- Route costs adjusted for slope and the effect of flooding on walking speed.
- Validation against a 2019 flood-inundation map derived from synthetic-aperture-radar imagery.

## Main Results

- Approximately 48.6% of the municipality was classified as flood susceptible.
- Twenty-two shelters were retained in the safe zone.
- Twelve routes could reach shelters within 30 minutes.
- Approximately 74.03% of the historically inundated area fell within the model's highly susceptible classes.

## Relevance and Limits for OverFlow

The workflow supports hazard screening before route calculation and demonstrates the value of time-based route costs. AHP weights and secondary datasets introduce uncertainty. The authors also identify road and bridge damage, variable flood conditions, and differing walking speeds as unresolved factors. The study does not validate OverFlow's D8-based classification.

## Safe Uses in the Manuscript

- Support linking flood classification, shelter screening, and network analysis.
- Support validating a susceptibility or flood-affected-area product against historical observations.
- Show why slope and hazard conditions can make travel time more informative than distance.

## Do Not Infer

- That the Nepalese criteria, weights, speeds, or travel times apply locally.
- That a route remains usable when bridge failure or changing flood depth is not modeled.
- That AHP susceptibility is equivalent to hydraulic flood depth.
