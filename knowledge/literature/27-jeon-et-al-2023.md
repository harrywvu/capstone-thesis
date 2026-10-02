# Jeon et al. (2023): Map API Flood Route Guidance

## Citation

S. Jeon, K. Jung, J. Kim, and H. Jung, “Map API-based evacuation route guidance system for floods,” *Applied Sciences*, vol. 13, no. 16, art. 9141, 2023. DOI: [10.3390/app13169141](https://doi.org/10.3390/app13169141).

BibLaTeX key: `jeon2023`.

## Material Reviewed

- Full open-access publisher article, including system design, testbed, user flow, and prototype results.

## Study Purpose and Context

The work develops a location-aware guidance system that warns a user about flooding, chooses a shelter, and recalculates a pedestrian route when the route or destination becomes unsafe. Testing used an area near Yeojubo in South Korea.

## Data and Methods

- Water-level prediction and flood-risk extent.
- GPS user position, shelter locations, and terrain information.
- T-Map pedestrian-routing API.
- Route cancellation and recalculation when flooding affects a route or shelter.

## Main Results

- The prototype displayed flood warnings and expected risk extent.
- It identified the user's position and calculated a route to a shelter.
- It canceled an unsafe route and produced a replacement during testing.

## Relevance and Limits for OverFlow

The system provides a useful interaction model for displaying the hazard, location, destination, and reason for rerouting together. Its test demonstrates prototype operation, not reduced casualties or reliable performance during an actual flood.

## Safe Uses in the Manuscript

- Support map-based communication of route and hazard changes.
- Support automatic recalculation after a road or center becomes unavailable.
- Distinguish functional testing from hazard and outcome validation.

## Do Not Infer

- That use of a commercial routing API guarantees evacuation safety.
- That the prototype was validated in a real flood evacuation.
- That OverFlow already supports live GPS guidance.
