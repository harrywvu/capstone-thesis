# SFINCS Pilot Plan for OverFlow

**Status:** SFINCS selected as OverFlow's flood-scenario method on 2026-10-17. The [first technical run](03-sfincs-pilot-results.md) and [boundary diagnostic rerun](04-sfincs-boundary-rerun-results.md) established technical feasibility, not local flood-map accuracy. This plan now governs data acquisition, physical model setup, validation, and application handoff. The team plans on gaining access to the missing terrain, river/boundary, rainfall, and observed-flood evidence; access and suitability still need verification. See the [capstone definition](00-capstone-definition.md).

## Working data assumption and target

For planning, **assume the team can obtain** (1) a finer bare-earth DTM with coverage, vertical datum and accuracy metadata; (2) mapped river/channel and defensible downstream-boundary information, including river level or discharge for an event materially driven by river flooding; (3) time-stamped rainfall for a dated Laoag event; and (4) geolocated flooded **and dry** observations from that event. These are expected inputs, **not datasets already received or verified**. Confirm use rights for thesis maps and derived results. If any item proves unavailable or unsuitable, record that finding and narrow the claim level under the decision gates below.

The selected method must become a locally evaluated SFINCS flood-scenario model before its maps feed OverFlow's planner-reviewed road-exposure and evacuation analysis. This requires a physically supported setup, numerical checks, and comparison with observed flooding. D8 may remain a drainage-reference method if useful; it does not become a substitute flood-depth model.

## What the first run changed

The City Hall DEM and SFINCS input/output pipeline worked, but the 40 mm/h rainfall cases produced water depths as low as −0.447 m. All 86 material negative cell-times in the main high-rain case occurred in three active cells immediately beside the artificial western outflow edge. Closing that edge removed the material negative depths, but trapped water in the domain. This is evidence that the boundary setup needs investigation, **not** proof that the DEM or SFINCS alone caused the problem. The DEM also has river-area NoData gaps and 91.25 m cells, which limit what the flood map can resolve. No observed flood event was available to test accuracy.

The next run has two distinct purposes: (1) find a numerically stable, physically defensible boundary and terrain setup; (2) evaluate its maps against observed flooding when the required local evidence arrives. A numerical pass alone must never be described as a validated flood map.

## Validation question

Can a small, documented SFINCS model of a Laoag pilot area turn rainfall scenarios into flood-exposure results that are technically sound, sufficiently supported by local data, and useful for OverFlow's evacuation planning? SFINCS is already the selected method; a successful software run alone does not answer whether modeled water conditions are accurate enough to affect road decisions.

SFINCS produces the intended flood scenarios; OverFlow provides barangay selection, 3D inspection, planner-reviewed road closures, routing, shelter allocation, and scenario comparison. D8 may remain an optional drainage-analysis layer but will not generate flood depth. The existing synthetic demo is a separate interface and solver demonstration, not a validation result for Laoag.

## Pilot boundaries

- **Place:** Laoag City is the confirmed study area. The technical pilot selected 38-A, 38-B, and 39 because the elevation, roads, and flood-reference layer overlap there. Reconsider final event-evaluation coverage if the received observations or river information support a different Laoag area better; record the reason before comparing results.
- **Model area:** Include the relevant contributing area and water exit or river boundary beyond the selected barangay polygons. The user's selected barangays define what the interface displays and analyzes; they do not automatically define a hydrologically complete simulation boundary.
- **Purpose:** Test an exploratory planning model and its integration with evacuation analysis. This pilot does not establish operational forecasting or public route safety.
- **Exclusions for this pilot:** Live sensor feeds, drainage-pipe simulation, citywide calibration, automatic dispatch, and use of model depth as an unreviewed road-closure rule.

## Data and access checklist

| Need | Available now | Pilot action |
|---|---|---|
| Terrain | City Hall GeoTIFF at about 91.25 m cells | Check footprint, NoData, source, date, vertical units/datum, and use rights. Use it first to prove the workflow, not to support precise street-level flood claims. Ask City Engineering whether a finer original exists. |
| Finer bare-earth terrain | LiPAD replied that DTM is distributable; no dataset delivered | Confirm Laoag coverage, native resolution, vertical accuracy, metadata, access, and terms. Prefer 1–5 m source detail for a detailed pilot; evaluate good 5–10 m data if available. These are targets, not universal pass/fail cutoffs. |
| Rainfall for a dated event | Not established in the knowledge base | Obtain a dated gauge or gridded rainfall time series for the candidate event, including units and time zone. A planner-selected uniform rainfall input is acceptable for sensitivity runs, but cannot validate an actual past event without observed rainfall. |
| River or boundary conditions | The first run marked every valid western-edge cell as a dry outflow; high-rain negative depths appeared beside it. River-area DEM cells are missing. | Map actual river crossings and contributing areas. Check whether a rainfall-dominated event can use a justified river outflow, or whether measured stage/discharge is needed. Do not use an entire arbitrary dry edge or treat NoData as a river channel. |
| Land cover, roughness, and infiltration | Land-use layers are in the City Hall package; usable model parameters unverified | Inspect local land-cover data and choose documented surface-resistance and infiltration assumptions. Test sensitivity to uncertain values rather than treating defaults as measured facts. |
| Observed flood evidence | Static susceptibility polygons and citywide storm totals exist; event extent does not | Request dated flooded streets, road/bridge closures, photographs with locations, mapped flood extent, and water marks from CDRRMO or City Engineering. The static susceptibility map is contextual reference, not event validation. |
| Roads and barangay boundaries | City Hall files received | Align coordinate systems, fix road graph and geometry issues, and verify bridge locations before overlaying modeled exposure with route segments. |
| Data permissions | City Hall use terms need confirmation; LiPAD NDA/access pending | Confirm permitted pilot use and whether maps or derivatives may appear in the thesis or defense. Keep restricted source data and derivative maps out of the repository unless terms allow them. |

The current data status is detailed in the [City Hall assessment](data/02-laoag-city-hall-package.md) and [LiPAD response note](data/03-lipad-response.md). Evacuation-center and vehicle data are **not prerequisites** for testing the flood model itself; they are needed for the later end-to-end evacuation demonstration.

## Execution sequence

### 1. Audit the failed boundary and obtain a reference event

Keep the selected 38-A, 38-B, and 39 barangays for comparability unless the received evidence favors another documented Laoag area. Map the three negative-depth cells, the western outflow cells, DEM NoData, rivers/canals, and domain edges. Check the full City Hall DEM footprint to see whether moving a boundary beyond the analysis barangays is possible without inventing elevation. Obtain a dated flood event with rainfall and geographically located wet/dry or road-closure evidence. Determine whether that event was mainly local rainfall, river flooding, or both. List and inspect actual delivered inputs before changing parameters.

**Deliverable:** boundary and NoData audit map, failed-cell coordinates, candidate boundary rationale, event timeline if found, and data/permission inventory.

### 2. Rerun the technical checks with the City Hall DEM

Retain the pinned SFINCS binary, original inputs, and original 0/20/40 mm/h cases as a baseline. Change **one setup choice at a time**, beginning with model extent and outlet placement. A larger domain or a restricted outlet may be run as a numerical sensitivity test, but label it hypothetical unless river topology and downstream levels support it. Do not accept an all-closed boundary merely because it removes negative depths. Inspect time-varying depth and water level, not just the maximum map; report material negative depths, their locations, missing-cell barriers, initial water, forcing totals, grid alignment, and runtime. Record whether water has a plausible way to leave and whether the result changes substantially with the boundary choice. HydroMT-SFINCS may help construct a later model, but was not part of the first run and is not a prerequisite for this diagnostic rerun.

This stage answers **can we configure and run it without obvious numerical or boundary artifacts?** It does not establish flood-map accuracy. The 91.25 m terrain cannot establish individual road inundation. Do not tune the model to the static susceptibility polygons as if they were a dated observed event.

**Deliverable:** reproducible baseline and changed-case inputs, run logs, diagnostic maps, a side-by-side numerical and boundary-sensitivity table, runtime, and explicit unresolved assumptions.

### 3. Repeat with finer terrain after delivery and quality checks

Inspect the delivered LiPAD DTM or another finer bare-earth source for coverage, NoData, vertical datum, accuracy, and alignment with roads. Confirm the City Hall DEM's vertical reference and determine whether river bed/channel elevations need a separate source. Rebuild the **same pilot area and rainfall cases**, changing terrain only at first. Compare broad wet-area patterns, depths, exposed road segments, and runtime against the coarse run. Any differences are sensitivity findings, not proof that the finer run is correct.

**Deliverable:** paired coarse/fine comparison with source resolution and vertical-accuracy metadata. If finer terrain is unavailable, explicitly limit the pilot to technical feasibility and broad patterns.

### 4. Test against an observed event

Use observed rainfall and suitable river/boundary inputs to replay a dated event. Calibrate uncertain parameters only against designated calibration evidence. Prefer a second event for an independent check; if only one event is available, keep a separate set of locations or observations untouched until evaluation. Report agreement and disagreement at the geographic scale supported by the reference evidence: mapped extent overlap when an observed extent exists, or agreement at documented wet/dry locations and road segments. Also report false positives, false negatives, data gaps, and parameter sensitivity.

Agree with the adviser on **evaluation measures and acceptable results before inspecting the final comparison**. No accuracy percentage or road-depth threshold is asserted here without local evidence. A single event or the static hazard layer alone cannot establish general predictive validity.

**Deliverable:** evaluation table/map, sensitivity results, known limitations, and an explicit claim level: technical demonstration, exploratory scenario comparison, or locally evaluated model.

### 5. Test the OverFlow handoff

Read SFINCS map output into the Python backend and align it with the 3D view, selected barangays, and road network. Show modeled exposure with its event/scenario label and assumptions. Let the planner inspect candidate affected road segments and **confirm closures manually**. Recalculate a representative route and shelter assignment after one confirmed closure. Measure end-to-end wait time and decide whether the UI should run simulations in the background or offer prepared scenarios.

SFINCS outputs time-varying and maximum water-depth information in NetCDF maps; the application must interpret and reproject those results correctly before display. The [SFINCS output manual](https://sfincs.readthedocs.io/en/latest/output.html) describes these variables, and [HydroMT-SFINCS](https://deltares.github.io/hydromt_sfincs/stable/user_guide/sfincs_build_update.html) supports Python-based model setup and scenario updates.

**Deliverable:** one documented rainfall-to-map-to-planner-reviewed-closure-to-evacuation scenario, with measured run and display times. A real shelter dataset is needed before claiming that the assignment represents Laoag operations.

## Validation and use gates

**Technical gate before flood-map evaluation:** The high-rain case must finish, align with the input terrain, have negligible initial water, reproduce the intended rainfall, and have no material negative depths (less than −0.001 m). Its river/outlet treatment must also have a documented physical rationale. Passing the numerical checks with an arbitrary dry or closed edge does **not** pass this gate. If the required boundary or river data are unavailable, stop at a diagnostic rerun and keep all maps labelled unvalidated.

| Finding | Use of SFINCS output |
|---|---|
| Model runs reproducibly, input/output checks pass, local observations support the output at the chosen scale, and OverFlow can present results within an acceptable planning workflow | Integrate the locally evaluated SFINCS scenario outputs with their assumptions and uncertainty, then test planner-reviewed road exposure and evacuation handoff. |
| Model runs, but fine terrain or independent event evidence is unavailable | Keep SFINCS outputs **exploratory**. Do not use them as unreviewed road-safety decisions or claim local flood accuracy. Continue evacuation planning with documented reference layers and planner-confirmed closures; D8 does not fill the missing flood-depth capability. |
| Model setup, data alignment, physical assumptions, or runtime are unsuitable for the intended use | Record the limitation and narrow what the SFINCS component displays or supports until it is corrected; do not substitute D8 accumulation as flood depth. Revisit implementation scope if the selected method cannot meet its validation gate. |

The team and adviser should choose the acceptable wait time and accuracy measures **before** the final pilot comparison; the current evidence does not support an honest numeric accuracy target. Data rights may also constrain what results can be displayed or shared even when the model runs successfully.

## Immediate next actions

1. **Done:** Audit the first run's failed cells, NoData and drainage layers; repeat the 40 mm/h case with a documented boundary/extent sensitivity. The shifted-edge run removed material negative depths but did not establish a real outlet. Keep every resulting map labelled unvalidated; see the [rerun result](04-sfincs-boundary-rerun-results.md).
2. Obtain and verify the finer DTM, its metadata and allowed uses; obtain river/channel and downstream-boundary information from City Engineering or another authoritative source.
3. Obtain one dated local flood record with matching rainfall, river conditions when relevant, and both flooded and dry locations; verify dates, units, coordinates, and independence of observations.
4. Build the revised physical boundary and terrain model, then rerun numerical and terrain-sensitivity checks without using the static susceptibility map as an observed event.
5. Run the observed-event comparison and OverFlow handoff only after their data gates are met; document the supported claim level and any remaining limits of the selected SFINCS method.

## Sources for the selected model

- [Deltares SFINCS overview](https://www.deltares.nl/en/software-and-data/products/sfincs): supported flood drivers and scenario use.
- [SFINCS model-input manual](https://sfincs.readthedocs.io/en/latest/input.html): terrain, active-cell, roughness, infiltration, and datum requirements.
- [SFINCS forcing manual](https://sfincs.readthedocs.io/en/latest/input_forcing.html): rainfall, water-level, and discharge inputs.
- [SFINCS output manual](https://sfincs.readthedocs.io/en/latest/output.html): spatial depth and water-level outputs.
- [HydroMT-SFINCS model-building guide](https://deltares.github.io/hydromt_sfincs/stable/user_guide/sfincs_build_update.html): Python-based setup and scenario changes.
