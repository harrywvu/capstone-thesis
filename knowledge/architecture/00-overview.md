# System Architecture Overview

## Summary

OverFlow is a geospatial decision support system for flood evacuation planning. The system uses a split architecture: a Python backend for all computation and a TypeScript frontend for rendering and UI.

## Core Principle

**Computation in Python, rendering in TypeScript.**

- Python handles DEM processing, water simulation, flow accumulation, and flood analysis
- TypeScript + React Three Fiber handles 3D terrain visualization, water rendering, and user interface
- Communication between layers is via REST API (FastAPI)

## Architecture Diagram

```
Browser (TypeScript)              Server (Python)
────────────────────              ───────────────
React Three Fiber (R3F)    ←API→  FastAPI
├─ 3D terrain rendering            ├─ DEM data processing
├─ Water visualization             ├─ Water simulation
├─ Camera/controls                 ├─ Flow direction (D8)
├─ UI panels                       ├─ Flow accumulation
└─ Map selection (Leaflet)         └─ Flood analysis
```

## Technology Stack

| Layer | Technology | Role |
|---|---|---|
| Frontend rendering | React Three Fiber (Three.js) | 3D terrain + water visualization |
| Frontend UI | React + shadcn/ui | Control panels, metrics, comparison |
| Map selection | Leaflet | Interactive area selection on map |
| Backend framework | FastAPI | REST API server |
| Computation | NumPy / SciPy | Grid operations, flow simulation |
| Raster data | GeoTIFF / NumPy grid | DEM source and backend computation |
| Vector data | GeoJSON | Roads, centers, boundaries, and reference layers |
| API exchange | JSON-compatible responses | Data transfer between backend and frontend |

## Key Decisions

- **DEM is the primary data source** for terrain and water simulation
- **OSM data** provides roads, buildings, and administrative boundaries
- **Procedural terrain generation** from real DEM data (not random generation)
- **Simplified water model**: D8 flow direction + threshold-based accumulation
- **React Three Fiber** chosen over raw OpenGL for faster development and React integration
- **Python backend** chosen over JS computation for NumPy/SciPy access and academic defensibility

## Data Flow

1. User selects area on Leaflet map → bounding box coordinates sent to backend
2. Backend fetches DEM data for bounding box → processes into elevation grid
3. Backend runs water simulation on grid → returns terrain mesh + water state
4. Frontend receives geometry + state → renders 3D terrain and water via R3F
5. User adjusts parameters (rainfall intensity, duration) → re-simulates via API
