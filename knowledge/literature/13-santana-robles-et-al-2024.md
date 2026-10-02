# Santana-Robles et al. (2024): Evacuation and Aid Distribution

## Citation

F. Santana-Robles, E. S. Hernández-Gress, R. Martínez-López, and I. J. González-Hernández, “Quick-response model for pre- and post-disaster evacuation and aid distribution: The case of the Tula River flood event,” *Logistics*, vol. 8, no. 1, art. 8, 2024. DOI: [10.3390/logistics8010008](https://doi.org/10.3390/logistics8010008).

BibLaTeX key: `santana2024`.

## Material Reviewed

- Full open-access article, including the case context, optimization formulation, scenarios, and results.

## Study Purpose and Context

The study develops a rapid decision method for evacuating people to temporary shelters and supplying those shelters after a flood. It uses the 2021 Tula River flood in Hidalgo, Mexico, as its case.

## Data and Methods

- Integer linear programming for shelter activation and evacuation assignment.
- Vehicle Routing Problem formulation for humanitarian-aid delivery.
- Google Maps road distances.
- Thirteen affected areas and 34 candidate shelters.
- Demand scenarios using the recorded value and values 10% higher and lower.
- Alternative aid-collection strategies involving state and municipal authorities.

## Main Results

- The model produced evacuation routes and shelter assignments for all 13 affected areas.
- It calculated transport-unit requirements, average evacuation times, and aid-distribution costs under each demand and collection scenario.
- The framework demonstrated that evacuation and post-arrival support decisions can be evaluated together.

## Relevance and Limits for OverFlow

The work supports OverFlow's proposed resource-distribution output and scenario controls for demand and available resources. Its objective is logistics cost under a specific road structure; it does not simulate flood propagation or continuously changing road safety.

## Safe Uses in the Manuscript

- Support connecting evacuation-center assignment with the resources needed after arrival.
- Support sensitivity tests in which affected demand changes.
- Identify ILP and vehicle routing as formal methods that require explicit objectives and constraints.

## Do Not Infer

- That the Tula River routes, costs, or demand changes are valid project defaults.
- That Google Maps distance proves a route is flood safe.
- That OverFlow performs optimized logistics until its model is implemented and tested.
