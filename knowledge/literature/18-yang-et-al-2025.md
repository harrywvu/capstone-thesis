# Yang et al. (2025): Dynamic Coastal Flood Evacuation

## Citation

Y. Yang, J. Yin, W. Feng, L. E. Yang, and J. Wang, “Dynamic flood evacuation modelling for coastal cities: A case study of Shanghai,” *International Journal of Disaster Risk Reduction*, vol. 125, art. 105591, 2025. DOI: [10.1016/j.ijdrr.2025.105591](https://doi.org/10.1016/j.ijdrr.2025.105591).

BibLaTeX key: `yang2025`.

## Material Reviewed

- Publisher abstract, highlights, methods overview, scenario description, results, and conclusion.

## Study Purpose and Context

The study examines how flood progression, warning time, human response, road and facility failures, and shelter capacity interact during a city-scale coastal evacuation.

## Data and Methods

- Agent-based Dynamic Coastal Flood Evacuation model.
- High-resolution two-dimensional flood inundation module.
- Human-behavior and GIS modules for roads, emergency facilities, shelters, and evacuee movement.
- Shanghai case study under a 1,000-year storm-flood scenario with 24-hour, 12-hour, and no-warning conditions.

## Main Results

- Without early warning, 24.2% of affected residents evacuated successfully within 24 hours.
- With a 24-hour warning, the same number evacuated within nine hours, and approximately 28% avoided being overtaken by inundation.
- Overall evacuation success increased by only 11.2% because shelter capacity remained restrictive.
- Optimized decisions approximately doubled modeled evacuation efficiency, while unequal shelter distribution produced spatial disparities.

## Relevance and Limits for OverFlow

The study supports interactive comparison of warning time, affected population, roads, centers, and capacity. Its high-resolution hydrodynamic and behavioral model is substantially more detailed than OverFlow's confirmed terrain-based accumulation method.

## Safe Uses in the Manuscript

- Support modeling warning, flood progression, road availability, and shelter capacity as interacting constraints.
- Support scenario comparison at the whole-system level.
- Support reporting spatial disparities in evacuation outcomes.

## Do Not Infer

- That OverFlow predicts actual evacuation success or dynamic flood depth with the same precision.
- That Shanghai's percentages or warning effects apply to a Philippine study area.
- That optimization removes shelter-capacity limitations.
