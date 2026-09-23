# USACE LifeSim 2.0 (2021): Agent-Based Flood Evacuation

## Citation

U.S. Army Corps of Engineers, Risk Management Center, *LifeSim 2.0 Technical Reference Manual*, LifeSimCPD-97a. Institute for Water Resources, Aug. 2021. Official record: [IWR Project Assistance Library](https://iwrlibrary.sec.usace.army.mil/resource/c1dae7c1-c83f-4e9d-82e9-f311fa67f2ef).

BibLaTeX key: `lifesim2021`.

## Material Reviewed

- Official LifeSim 2.0 technical-manual catalog record.
- Official [LifeSim product and documentation page](https://www.rmc.usace.army.mil/Software/LifeSim/).
- These are government technical materials rather than a peer-reviewed journal article.

## System Purpose

LifeSim is a consequence-estimation system that simulates population redistribution during evacuation and estimates potential life loss and direct economic damage from hazards such as flooding. It is intended for risk and emergency-planning analysis.

## Relevant System Features

- Agent-based representation of evacuating population groups.
- Interaction among evacuees, vehicles, roads, and flood hazards.
- Vehicular and pedestrian evacuation modes.
- Road networks imported from GIS shapefiles or OpenStreetMap.
- Rerouting when a flooded road is encountered; agents may become stranded if no alternative exists.
- Traffic propagation with road capacity and congestion effects.
- Monte Carlo treatment of natural variability and knowledge uncertainty.
- GIS mapping, animation, tabulation, and reporting.

## Relevance to OverFlow

- Demonstrates the value of comparing alternative warning, hazard, and road-closure scenarios.
- Shows that flood exposure, route availability, congestion, warning, and protective action can interact dynamically.
- Provides a mature related-system boundary against which OverFlow's simpler scenario-comparison role can be described.

## Limits and Transferability

- LifeSim requires behavioral, warning, traffic, vehicle, structure, and hazard data beyond OverFlow's confirmed scope.
- It estimates consequences such as life loss; OverFlow is not authorized to make equivalent claims.
- Its flood-hazard inputs and validation studies do not validate OverFlow's terrain-based accumulation model.
- Feature similarity does not imply comparable predictive validity.

## Safe Uses in the Manuscript

- Describe a related system that integrates evacuation traffic with an advancing flood hazard.
- Support dynamic rerouting, uncertainty analysis, and scenario comparison as useful planning concepts.
- Clarify that OverFlow has a narrower decision-support scope.

## Do Not Infer

- That OverFlow is agent based, models congestion, or estimates life loss.
- That OverFlow can use LifeSim defaults for Philippine populations or roads.
- That a visual simulation is predictive without corresponding model inputs and validation.
