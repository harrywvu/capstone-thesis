# Planner User Actions (Diagram-Ready)

This file describes the approved actions for the planned final OverFlow system. It is a use-case and interface inventory, not a claim that the separate synthetic demo already implements them. The canonical scope and method boundaries remain in [the capstone definition](00-capstone-definition.md).

## Primary actor

Local disaster planner or responder. Residents are indirect beneficiaries, not system operators or public-navigation users. The operating organization and any account/role scheme remain unselected.

## Actions in the planning workflow

1. **Choose barangays.** All 80 coded Laoag barangays are available in the planned selector. Hover over a mapped barangay boundary to highlight it; click to select or deselect it. Select multiple barangays for analysis. The map uses prepared boundaries, without freehand circle or polygon drawing. Selection availability does not mean SFINCS has been validated for every barangay.
2. **Inspect geographic information.** Turn available terrain, roads, bridges, barangay boundaries, evacuation centers, drainage references, and flood-susceptibility layers on or off; click a feature to inspect its details. Buildings are an optional layer dependent on suitable data.
3. **Create a scenario.** Start from default conditions, reopen a saved scenario, or duplicate one to test a variation.
4. **Set evacuation demand.** View the source population figure as a read-only baseline for each selected barangay. Enter the expected evacuees as a number or percentage; the baseline is not automatically the evacuation demand. For the supplied Laoag workbook, label counts as covered residents with an unverified survey year. The team's recollection of 2024 needs a named source or written confirmation before it appears as metadata.
5. **Set rainfall assumptions.** Enter intensity and duration for a hypothetical SFINCS scenario, or inspect the documented rainfall used for a replayed event. Show the terrain, boundary, and parameter assumptions with the scenario; current pilot outputs are not locally validated.
6. **Change road access.** Click a road or bridge to mark it open or manually closed for the scenario.
7. **Change shelter availability.** Mark an evacuation center open or closed and adjust its usable capacity for the scenario.
8. **Set transport assumptions.** Enter available vehicles and their capacities and an assumed travel speed for planning estimates. Exact vehicle scheduling and clearance-time calculations remain open.
9. **Run analysis.** Run or load the SFINCS flood scenario at its supported claim level, inspect possible road exposure, then calculate feasible routes, reachable-center assignments, capacity use, travel/vehicle estimates, and unserved demand under planner-confirmed road conditions.
10. **Inspect results.** Click routes and centers to see assignments, capacity use, estimated travel, and reasons an area or demand cannot be served. Inspect results in the 3D scene and overhead map view.
11. **Compare scenarios.** Review how changes to demand, closures, shelters, resources, or supported flood conditions change the results.
12. **Save and export.** Save or duplicate a scenario for later comparison and export a scenario summary for planning discussion. Storage mechanism and export format remain design details.

## Initial evacuation-analysis sequence

1. Remove manually closed road and bridge edges from the traversable network.
2. Find weighted shortest feasible routes from selected barangays to reachable centers. NetworkX is the selected implementation direction; edge weights and alternative-route selection still need specification.
3. Allocate expected evacuees among reachable centers within their usable capacities. OR-Tools minimum-cost flow is the selected implementation direction; the exact cost objective and any additional constraints still need specification.
4. Show unserved demand explicitly when connectivity or capacity is insufficient. Do not force an infeasible assignment.
5. Estimate travel and vehicle trips from stated speed, vehicle capacity, and documented scheduling assumptions. The clearance-time method and its evaluation remain open.

## Scope boundary

These actions support human scenario planning. They do not establish public navigation, automatic dispatch, live flood forecasting, or an operational flood-warning service. SFINCS is the selected scenario method, but its current Laoag maps remain unvalidated and cannot automatically declare roads safe or closed.
