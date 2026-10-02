# Wang et al. (2024): Pedestrian Planning Under Dam-Break Flood Risk

## Citation

W. Wang, Y. Li, Y. Zhang, and Z. Wu, “Pedestrian evacuation planning under dam-break flood disaster considering road risk and road pedestrian demand,” *International Journal of Disaster Risk Reduction*, vol. 104, art. 104355, 2024. DOI: [10.1016/j.ijdrr.2024.104355](https://doi.org/10.1016/j.ijdrr.2024.104355).

BibLaTeX key: `wang2024`.

## Material Reviewed

- Publisher article material, abstract, metadata, and indexed method and result descriptions.

## Study Purpose and Context

The study develops pedestrian evacuation plans for a dam-break flood while considering road difficulty, disaster risk, pedestrian demand, shelter choice, and competing planning objectives. Its case represents Hurricane Katrina conditions in New Orleans.

## Data and Methods

- Eight road-risk indicators covering evacuation difficulty, disaster risk, and pedestrian demand.
- Fuzzy VIKOR analysis for ranking road risk.
- Restricted areas for road segments with unacceptable conditions.
- A staged, dual-objective planning method for route and shelter decisions.
- Comparison of two simulated evacuation scenarios.

## Main Results

- Roads near Lake Pontchartrain had high modeled risk.
- The two planning scenarios selected 22 and 18 shelters, respectively, from 34 candidates.
- The solutions exposed trade-offs among route risk, pedestrian demand, and shelter selection rather than producing one universally best plan.

## Relevance and Limits for OverFlow

The study supports treating shelter assignment and road risk as connected decisions and presenting competing performance measures to planners. Its dam-break assumptions, indicator weights, and New Orleans data do not apply automatically to a Philippine deployment.

## Safe Uses in the Manuscript

- Support evaluating route exposure and demand alongside distance.
- Support comparing several feasible plans under stated priorities.
- Support excluding or penalizing roads that exceed a defined risk threshold.

## Do Not Infer

- That the reported shelter counts apply to OverFlow.
- That fuzzy VIKOR is already the project's chosen method.
- That a terrain-accumulation class measures the same road risk used in the study.
