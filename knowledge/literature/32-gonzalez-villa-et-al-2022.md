# González-Villa et al. (2022): Evacuation Management System

## Citation

J. González-Villa, A. Cuesta, D. Alvear, and A. Balboa, “Evacuation management system for major disasters,” *Applied Sciences*, vol. 12, no. 15, art. 7876, 2022. DOI: [10.3390/app12157876](https://doi.org/10.3390/app12157876).

BibLaTeX key: `gonzalezvilla2022`.

## Material Reviewed

- Full open-access publisher article, including architecture, GIS functions, simulation methods, case demonstration, performance results, and limitations.

## Study Purpose and Context

The study presents a real-time GIS decision-support system for planning several simultaneous evacuations after a major disaster. Its demonstration uses the 2019 Gran Canaria wildfire.

## Data and Methods

- Client-server implementation using .NET, ArcGIS, and a REST API.
- Assembly points, shelters, road conditions, and damaged areas.
- Stochastic Monte Carlo analysis with pedestrian and vehicle models.
- Case test covering 13 urban areas and four simultaneous evacuations.

## Main Results

- The demonstration satisfied all three defined operational requirements.
- Processing demand depended mainly on evacuee numbers and road interactions, rather than the route count alone.
- Observed evacuation times were unavailable, so validation remained functional and simulation-based.

## Relevance and Limits for OverFlow

The system is a useful architecture and interface comparison even though its case is a wildfire. It supports integrating scenario data, network analysis, simulation, and map outputs while measuring response time and usability separately from outcome accuracy.

## Safe Uses in the Manuscript

- Support an integrated GIS decision-support architecture.
- Support performance testing as scenario complexity and population increase.
- Support separating software verification from real-world evacuation validation.

## Do Not Infer

- That a wildfire model establishes flood-route safety.
- That satisfying functional requirements proves casualty reduction.
- That OverFlow needs to reproduce the study's proprietary software stack.
