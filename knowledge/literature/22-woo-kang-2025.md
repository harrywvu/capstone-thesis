# Woo and Kang (2025): Congestion-Aware Shelter and Logistics Optimization

## Citation

S.-J. Woo and S. Kang, “Optimising shelter locations for bus evacuation and relief supply under traffic congestion,” *IET Intelligent Transport Systems*, vol. 19, no. 1, art. e70020, 2025. DOI: [10.1049/itr2.70020](https://doi.org/10.1049/itr2.70020).

BibLaTeX key: `woo2025`.

## Material Reviewed

- Full open-access publisher article, including model, solution method, Ulsan case, sensitivity analysis, and conclusions.

## Study Purpose and Context

The study jointly optimizes shelter locations, private-car and bus evacuation, traffic congestion, and relief-supply routing for a large-scale disaster.

## Data and Methods

- Bi-level shelter-location model.
- Dynamic virtual links for congestion-aware destination choice under user equilibrium.
- Bus and relief-supply vehicle routing.
- Metaheuristic evolutionary algorithm with shelter addition, removal, and swap operations.
- Flood evacuation case study in Ulsan, South Korea, with demand and bus-fleet sensitivity tests.

## Main Results

- Optimized shelter locations reduced total modeled cost by 9.4% compared with manually selecting the nearest shelters.
- Evacuation cost decreased by 19.7% and relief-supply cost by 13.5% in the reported comparison.
- Ignoring congestion underestimated evacuation time by up to 41% and relief costs by 44%.
- Local search improved cost efficiency by 7%.
- Smaller bus fleets increased clearance time and workload and required more shelters; higher demand worsened congestion.

## Relevance and Limits for OverFlow

The study demonstrates the connection among center choice, congestion, assisted transport, and relief delivery. The model requires detailed demand, road capacity, fleet, cost, and supply data that are not yet confirmed for OverFlow.

## Safe Uses in the Manuscript

- Support representing buses or rescue vehicles as limited resources.
- Support comparing nearest-center allocation with congestion-aware alternatives.
- Support evaluating evacuation and relief distribution together when sufficient data exist.

## Do Not Infer

- That OverFlow currently implements user-equilibrium traffic or bi-level optimization.
- That the Ulsan cost reductions apply to another road network.
- That a cost-minimizing solution is automatically the safest or most equitable plan.
