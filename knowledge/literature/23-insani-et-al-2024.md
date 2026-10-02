# Insani et al. (2024): Integrated Evacuation and Relief Routing

## Citation

N. Insani, S. Taheri, and M. Abdollahian, “A mathematical model for integrated disaster relief operations in early-stage flood scenarios,” *Mathematics*, vol. 12, no. 13, art. 1978, 2024. DOI: [10.3390/math12131978](https://doi.org/10.3390/math12131978).

BibLaTeX key: `insani2024`.

## Material Reviewed

- Full open-access article, including the mathematical model, experiments, Indonesian case study, and conclusions.

## Study Purpose and Context

The study coordinates evacuation of vulnerable residents and delivery of emergency relief before floodwater reaches the affected area while minimizing the required vehicles and defining their routes.

## Data and Methods

- Integrated vehicle-routing model with vehicle reuse, multiple trips, and split deliveries.
- Uncertain evacuation demand and closing time windows at pickup points.
- Exact optimization and a modified genetic algorithm.
- Synthetic flood instances and a case study in Bontoala, Indonesia.
- Comparison with a hierarchical approach that handles evacuation and distribution separately.

## Main Results

- The integrated approach outperformed the hierarchical approach and required fewer vehicles in the evaluated scenarios.
- For smaller instances, the modified genetic algorithm obtained optimal or near-optimal solutions approximately 92.5% faster than the exact approach.
- For larger instances, the heuristic returned near-optimal solutions within practical time when the exact method could not finish reasonably.

## Relevance and Limits for OverFlow

The study supports linking evacuation and relief delivery when both compete for vehicles and time. It focuses on early-stage operations before inundation reaches demand points and depends on case-specific vehicle, demand, and time-window assumptions.

## Safe Uses in the Manuscript

- Support integrated resource and route planning.
- Support comparing exact and heuristic solution time and quality.
- Support explicit reporting of required vehicles, trips, and unmet tasks.

## Do Not Infer

- That a genetic algorithm is required before OverFlow's optimization problem is defined.
- That the reported computational gains transfer to a different problem size or model.
- That pre-flood routing addresses travel through already inundated roads.
