# Gama et al. (2016): Multi-Period Shelter Allocation

## Citation

M. Gama, B. F. Santos, and M. P. Scaparra, “A multi-period shelter location-allocation model with evacuation orders for flood disasters,” *EURO Journal on Computational Optimization*, vol. 4, nos. 3–4, pp. 299–323, 2016. DOI: [10.1007/s13675-015-0058-3](https://doi.org/10.1007/s13675-015-0058-3).

BibLaTeX key: `gama2016`.

## Material Reviewed

- Publisher abstract and article text exposed through the journal record.
- Verified bibliographic record from the TU Delft research portal.

## Study Purpose and Context

The study formulates a multi-period flood-emergency model that coordinates shelter opening, evacuation orders, and the assignment of demand areas to shelters. A Wake County, North Carolina, case study illustrates the difference between dynamic and static evacuation planning.

## Model and Solution Method

- Mixed-integer multi-period location-allocation model.
- Shelter-capacity restrictions.
- Time-dependent travel conditions as the flood affects the road network.
- Shelter availability that changes across periods.
- Timing of evacuation orders and changing evacuation demand.
- Objective centered on travel distance or time between affected populations and shelters.
- Simulated annealing for realistic instances because exact optimization can be too slow.

## Findings Relevant to OverFlow

- Flood evacuation allocation is dynamic: road conditions, shelter availability, and demand may change over time.
- A single static nearest-shelter assignment can omit important operational constraints.
- Interactive planning has a practical computation-time requirement; a good timely solution may be more useful than an exact solution that arrives too late.

## Limits and Transferability

- The source is outside the preferred five-year window and is retained for its directly relevant formulation.
- Its multi-period model is more specific than OverFlow's currently unresolved allocation and time-estimation methods.
- The solver, parameterization, and case data cannot be assumed suitable for OverFlow.
- The study couples to flood information but does not validate OverFlow's flood-generation method.

## Safe Uses in the Manuscript

- Support capacity-constrained, time-sensitive shelter allocation.
- Support comparing static and dynamic evacuation assumptions.
- Motivate reporting computation time and defining what “optimal” means.

## Do Not Infer

- That OverFlow uses mixed-integer programming or simulated annealing unless later adopted.
- That OverFlow can issue operational evacuation orders.
- That its estimated evacuation time is valid before the travel and behavior models are defined.
