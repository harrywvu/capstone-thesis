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
- Animated water plane at flood level
- Semi-transparent blue material
- Height adjusted based on simulation results per cell
- Optional: wave shader for visual effect

### Buildings
- Simple untextured 3D boxes (blank models)
- Height procedurally set from OSM building data or fixed default
- Color-coded by type or flood risk status

### Roads
- Rendered as thin 3D planes or lines on terrain surface
- Color changes based on closure status (open = gray, closed = red)

### Map Selection (Pre-simulation)
- Leaflet map for selecting study area
- Draw circle/polygon to define bounding box
- Sends coordinates to backend to fetch DEM data

## Camera and Controls
- Orbit controls (rotate, pan, zoom)
- Reset view button
- Top-down view toggle for 2D-style analysis

## Performance Considerations
- Grid resolution affects vertex count: 100x100 = 10K vertices (fine), 500x500 = 250K vertices (may need LOD)
- Water plane is a single mesh, updated per simulation step
- Use instanced meshes for buildings if count is high
