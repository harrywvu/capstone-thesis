# Water Simulation Model

## Approach

Simplified hydrological model based on D8 flow direction and flow accumulation. Not a full hydraulic simulation — sufficient for a decision support system demonstration.

## Algorithm

### Step 1: D8 Flow Direction
- For each cell (i, j) in the elevation grid, examine 8 neighboring cells
- Calculate slope to each neighbor: `(elevation[i][j] - elevation[neighbor]) / distance`
- Assign flow direction to the neighbor with steepest downward slope
- If all neighbors are higher or equal → cell is a sink (water pools here)

### Step 2: Flow Accumulation
- Initialize all cells with accumulation = 1 (each cell receives its own rainfall)
- Process cells in topological order (highest to lowest elevation)
- For each cell, add its accumulation value to the cell it flows into
- Result: each cell's value represents total upstream area draining into it

### Step 3: Rainfall Overlay (planned; formulation unresolved)
- Rainfall intensity and duration provide a scenario-wide input.
- Uniform rainfall is the current simplifying assumption.
- Converting rainfall into water depth, storage, or another flood indicator requires an explicit water-balance formulation that has not yet been selected.

### Step 4: Accumulation Over Time (unresolved)
- The time-step scheme, outflow rule, depression handling, and conservation checks are not yet defined.
- D8 and flow accumulation alone provide drainage direction and contributing-area information; they do not independently produce calibrated water depth or flood timing.

### Step 5: Flood Classification (planned; threshold unresolved)
- Classify cells using a documented flood indicator and threshold after the indicator's units and computation are defined.
- Treat threshold changes as sensitivity scenarios.
- Do not label the indicator as water depth unless its calculation and validation support that unit.

## Limitations

- D8 only allows flow in one direction per cell (no spreading)
- Does not model flow velocity or volume accurately
- No soil absorption or infiltration modeling
- No drainage infrastructure (pipes, canals) modeled
- Suitable for relative comparison between scenarios, not absolute flood prediction
- The rainfall-to-indicator calculation and threshold have not been calibrated or validated.

## Validation

- Compare simulated flood extent against known flood maps (if available from CDRRMO)
- Sensitivity analysis: vary rainfall intensity and observe output plausibility
- Visual inspection against real flood-prone areas in the selected study area; use Laoag City only if the team confirms it

## Literature Boundary

O'Callaghan and Mark's D8 work supports the drainage-direction and contributing-area foundation. It does not validate the project's proposed rainfall overlay, time stepping, water-depth calculation, or flood threshold. See `knowledge/literature/07-ocallaghan-mark-1984.md`.
