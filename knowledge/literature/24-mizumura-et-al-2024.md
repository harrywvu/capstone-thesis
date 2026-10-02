# Mizumura et al. (2024): Shortest Exit from Inundated Areas

## Citation

T. Mizumura, H. Taguchi, and H. Nakamura, “Confirming the safety improvement and evacuation time reduction effects by the method for evacuating inundated areas via the shortest possible route,” *International Journal of Disaster Risk Reduction*, vol. 101, art. 104252, 2024. DOI: [10.1016/j.ijdrr.2024.104252](https://doi.org/10.1016/j.ijdrr.2024.104252).

BibLaTeX key: `mizumura2024`.

## Material Reviewed

- Full open-access publisher article, including routing method, flood and agent models, scenario design, and results.

## Study Purpose and Context

The study tests whether evacuees are safer when their route first minimizes travel within an inundated area before continuing toward a shelter, rather than minimizing total route distance alone.

## Data and Methods

- Rainfall–Runoff–Inundation model producing time-series flood depths at approximately 30-meter resolution.
- Artisoc multi-agent pedestrian simulation in Kuki City, Japan.
- OpenStreetMap-derived road network and A* pathfinding.
- Comparison of ordinary shortest paths with the Evacuating Inundated Areas via the Shortest Possible Route strategy.
- Multiple rainfall probabilities, rainfall durations, and evacuation start conditions.

## Main Results

- The proposed strategy reduced the distance that evacuees traveled on flooded roads across the tested conditions.
- It increased movement along safer road sections and prevented some simulated evacuees from using roads at dangerous modeled depths.
- Safety gains were stronger for more severe rainfall and delayed departures.
- The method could lengthen total distance or time for some evacuees, so it was not uniformly preferable under every condition.

## Relevance and Limits for OverFlow

The study shows that shortest distance, shortest time, and lowest flood exposure are distinct route objectives. Its safety calculations use hydraulic depth information that OverFlow's terrain-based accumulation does not currently provide.

## Safe Uses in the Manuscript

- Support displaying route distance, time, and flood exposure separately.
- Support comparing a conventional shortest path with a route that prioritizes leaving hazard areas.
- Support communicating trade-offs instead of labeling one route universally optimal.

## Do Not Infer

- That terrain accumulation alone establishes safe wading or driving depth.
- That the Kuki City route effects apply to the eventual study area.
- That the proposed route is always faster than ordinary shortest path.
