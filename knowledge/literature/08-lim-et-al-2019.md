# Lim et al. (2019): Philippine Flood-Evacuation Route Choice

## Citation

H. R. Lim Jr., M. B. B. Lim, and M. Piantanakulchai, “Modeling route choice behavior of evacuees in highly urbanized area: A case study of Bagong Silangan, Quezon City, Philippines,” *Asia Pacific Management Review*, vol. 24, no. 2, pp. 98–105, 2019. DOI: [10.1016/j.apmrv.2017.03.004](https://doi.org/10.1016/j.apmrv.2017.03.004).

BibLaTeX key: `lim2019`.

## Material Reviewed

- Open-access publisher abstract and article material.
- Sections reviewed through the available article text include the study context, household survey description, modeling setup, and reported implications.

## Study Purpose and Context

The study examines household route choice during the August 2013 flood in Bagong Silangan, Quezon City. It investigates how hazard, socioeconomic, and evacuation-related factors relate to route choice in a highly urbanized Philippine setting.

## Data and Method

- Household survey concerning flood experience and evacuation decisions.
- 254 valid cases after data cleaning.
- Recorded destinations, departure timing, evacuation mode, route taken, and stated reasons for the route.
- Three binary logit route-choice models.
- Route choice represented through alternatives such as a familiar route and a nearer route.

## Findings Relevant to OverFlow

- Route choice is not determined by network distance alone.
- Departure timing, familiarity, perceived hazard, and household or evacuation characteristics can affect the route used.
- The authors propose that route-choice models can inform evacuation simulation and the evaluation of route loads, timing, and destination advice.

## Limits and Transferability

- The study reflects one flood event and one Quezon City community.
- The models do not automatically generalize to another Philippine locality.
- OverFlow does not currently include a confirmed behavioral route-choice or traffic-loading model.
- A route generated from a graph should be described as a feasible planning option unless behavior and traffic evidence support stronger claims.

## Safe Uses in the Manuscript

- Support the claim that actual evacuees may choose familiar or perceived-safe routes rather than the mathematically shortest route.
- Provide Philippine evidence for treating behavior as a limitation of purely network-based recommendations.
- Motivate expert or local validation of computed routes and cautious interpretation of evacuation-time estimates.

## Do Not Infer

- That one shortest-path algorithm predicts how all residents will move.
- That the Bagong Silangan model coefficients can be reused without a new local study.
- That local Philippine evidence removes the need for validation in the selected OverFlow study area.
