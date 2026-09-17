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

### Step 3: Rainfall Overlay
- Convert rainfall intensity (mm/hr) to volume per cell based on cell area
- Total water input per cell = intensity × duration × cell area
- This is distributed uniformly across the terrain

### Step 4: Accumulation Over Time
- Divide simulation into time steps (e.g., 1-hour increments)
- At each step, distribute rainfall and propagate flow
- Track water depth per cell: `depth[i][j] += rainfall_input - outflow`

### Step 5: Flood Classification
- Cells where water depth exceeds threshold (e.g., 0.3m) are classified as flooded
- Threshold is user-adjustable for scenario comparison

## Limitations

- D8 only allows flow in one direction per cell (no spreading)
- Does not model flow velocity or volume accurately
- No soil absorption or infiltration modeling
- No drainage infrastructure (pipes, canals) modeled
- Suitable for relative comparison between scenarios, not absolute flood prediction

## Validation

- Compare simulated flood extent against known flood maps (if available from CDRRMO)
- Sensitivity analysis: vary rainfall intensity and observe output plausibility
- Visual inspection against real flood-prone areas in Laoag
