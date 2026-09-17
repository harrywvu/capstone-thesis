# Raw Notes: Selected-Capstone Presentation

**Source:** `assets/selected capstone.pdf`  
**Pages:** 8  
**Purpose:** Evidence extraction only; not canonical.

## Slide 1 - University title slide

No project content.

## Slide 2 - Project identification

- Working label: **Sentinel** (now approved as **OverFlow**).
- Subtitle: **A Geospatial Decision Support System for Flood Evacuation Planning**.
- Team: John Harold A. Alejo, Cyrus Kirby Gaor, Bradley Kjiel Pasalo, and Joshearie Kristoffer Landicho.

## Slide 3 - Motivation

- Flooding and typhoons can make roads inaccessible and increase evacuation demand.
- Responders need usable routes, suitable centers, and alternatives when roads flood or centers fill.
- Existing maps offer limited scenario testing.

## Slide 4 - Problem and gap

- Problems: limited scenario testing, changing routes, center capacity, and resource allocation.
- Claimed gap: a localized what-if tool for comparing evacuation decisions.

## Slide 5 - Proposed solution

- A 2D interactive disaster simulation and decision-support system.
- Changeable conditions: flooded roads, blocked bridges, affected people, center capacity, and rescue resources.
- Outputs: routes, center allocation, evacuation time, resource allocation, and scenario comparison.

## Slide 6 - Proposed architecture

- Inputs: local map and hazard data, road network, population, and water level.
- A FastAPI engine simulates scenarios and checks center capacity.
- Analysis identifies routes, allocates shelters, and estimates time.
- Outputs include dynamic maps, alternate routes, and resource data.
- OpenStreetMap and Python are labeled for local integration.
- No flood, routing, optimization, allocation, or time-estimation algorithm is defined.

## Slide 7 - Research thrust and SDGs

- Scientific Computing and Optimization.
- SDG 13: Climate Action.
- SDG 11: Sustainable Cities and Communities.

## Slide 8 - Closing slide

No additional project definition.

## Evidence cautions

- No geographic study area or deployment site is identified.
- Drainage data and a physical flood-flow model are not defined.
- Evaluation metrics, baselines, validation data, and participants are absent.
- “Optimal” and “simulation” need operational definitions before becoming research claims.
