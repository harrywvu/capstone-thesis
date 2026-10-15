# Rendering Layer (TypeScript + React Three Fiber)

## Role

Responsible for all visual output: 3D terrain, water overlay, buildings, roads, and UI controls.

## Why React Three Fiber

- Integrates natively with React (existing project stack)
- Provides camera controls, lighting, and mesh rendering out of the box
- Avoids low-level WebGL boilerplate
- Active ecosystem with helpers for terrain, shaders, and animations

## Rendering Components

### Terrain Mesh
- Generated from DEM elevation grid received from backend
- Vertex positions mapped from grid coordinates + elevation values
- Color-mapped by height (green lowlands → brown highlands → white peaks)
- Simple geometry: triangle mesh from grid rows/columns

### Water Overlay
- Semi-transparent overlay marking cells classified as flood affected in the scenario
- Visual styling may animate for readability, but animation does not represent measured flow or flood timing
- Do not display a physically scaled water surface or depth legend until the backend produces validated depth units

### Buildings
- Simple untextured 3D boxes (blank models)
- Height procedurally set from OSM building data or fixed default
- Color-coded by type or flood risk status

### Roads
- Rendered as thin 3D planes or lines on terrain surface
- Color changes based on closure status (open = gray, closed = red)

### Barangay Selection (Pre-simulation)
- Leaflet map displays prepared barangay boundaries for the candidate study area
- Hover highlights a barangay; click selects it; click again deselects it
- Multiple barangays may be selected; no circle or polygon drawing is required
- Sends selected barangay identifiers to the backend, which resolves geometry and DEM coverage

### Planner Controls and Results
- Toggle available terrain, roads, bridges, boundary, center, drainage-reference, and flood-susceptibility layers; inspect feature details
- Edit evacuation demand separately from the read-only population baseline; edit closures, center status/capacity, vehicles/capacity, and assumed speed
- Run analysis and inspect routes, center assignments, capacity use, unserved demand, and reasons a route or assignment is infeasible
- Save, reopen, duplicate, and compare scenarios; export a scenario summary
- Buildings remain an optional layer subject to suitable data

## Camera and Controls
- Orbit controls (rotate, pan, zoom)
- Reset view button
- Overhead view toggle for map-like inspection of the 3D scene

## Performance Considerations
- Grid resolution affects vertex count: 100x100 = 10K vertices (fine), 500x500 = 250K vertices (may need LOD)
- Reuse overlay geometry when scenario state changes; time-stepped animation remains optional until the model defines time steps
- Use instanced meshes for buildings if count is high
