# Water Simulation Model

## Selected approach

**SFINCS is OverFlow's accepted flood-scenario method (team decision, 2026-10-17).** It is intended to convert documented rainfall and relevant river/boundary conditions into time-varying flood-depth and exposure maps for planning scenarios. The existing Laoag runs only demonstrate that the software pipeline works. Their dry boundary is unverified, and their maps have not been compared with a real flood. Method selection is distinct from local validation or operational forecasting.

The [development and validation plan](../02-sfincs-pilot-plan.md) and [pilot results](../03-sfincs-pilot-results.md) specify the current evidence and remaining work.

## Processing sequence

1. **Prepare terrain.** Inspect a suitable bare-earth DTM, its source date, resolution, vertical datum, accuracy, and NoData. Add verified river/channel elevations or other needed terrain information; preserve true elevation units for computation.
2. **Define the physical model.** Choose a domain that includes relevant contributing and exit areas. Specify rainfall over time and river stage/discharge when relevant to the selected event. Document boundary locations, roughness, infiltration, and their uncertainty. Do not treat an arbitrary dry edge or missing river cells as a verified outlet.
3. **Run SFINCS and check outputs.** Check completion, rain totals, initial water, grid alignment, implausible negative depths, boundary effects, and sensitivity to uncertain parameters. Export georeferenced time-varying and maximum-depth maps with scenario metadata.
4. **Evaluate locally.** Replay a dated Laoag flood using matching forcing and compare mapped results with independent geolocated flooded and dry observations. Report disagreement and false positives/negatives at the scale supported by the source data. A static susceptibility map is contextual evidence, not an observed event.
5. **Use in OverFlow only at a supported claim level.** Display the scenario assumptions and uncertainty. Let planners inspect candidate road exposure and confirm any closure before routing or center allocation. No automatic road-safety decision follows merely from a modeled cell depth.

## D8 reference option

D8 flow direction and flow accumulation may remain as a **separate drainage-analysis layer**. D8 assigns each terrain cell to a downhill neighbor and counts upstream contributing area. It does not produce the selected flood-depth maps, replace SFINCS, or justify a rainfall-to-flood threshold. See [O'Callaghan and Mark](../literature/07-ocallaghan-mark-1984.md) for the drainage-method boundary.

## Current limits

- The City Hall DEM has roughly 91.25 m cells and river-area NoData; its vertical reference and accuracy are not documented.
- The initial SFINCS pilot's large negative depths were tied to an assumed western outflow edge. Shifting that edge removed the material negatives, but neither edge is a verified physical outlet. See the [boundary rerun](../04-sfincs-boundary-rerun-results.md).
- Finer terrain, river/boundary evidence, dated rainfall, and flooded/dry observations are assumed accessible for planning but have not been marked received or validated.
- No local flood-accuracy, road-safety, or operational forecast claim is supported by the current pilots.
