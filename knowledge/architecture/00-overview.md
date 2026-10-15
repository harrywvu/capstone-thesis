# System Architecture Overview

## Summary

OverFlow is a 3D geospatial decision-support system for flood evacuation planning. It uses a split architecture: a Python backend for computation and a TypeScript frontend for rendering and UI. The DEM is a two-dimensional elevation grid used to build terrain and support analysis.

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
└─ Barangay selection (Leaflet)    └─ Flood analysis
```

## Technology Stack

| Layer | Technology | Role |
|---|---|---|
| Frontend rendering | React Three Fiber (Three.js) | 3D terrain + water visualization |
| Frontend UI | React + shadcn/ui | Control panels, metrics, comparison |
| Map selection | Leaflet | Hover highlight and click selection of one or more barangay boundaries |
| Backend framework | FastAPI | REST API server |
| Computation | NumPy / SciPy | Grid operations, flow simulation |
| Raster data | GeoTIFF / NumPy grid | DEM source and backend computation |
| Vector data | GeoJSON | Roads, centers, boundaries, and reference layers |
| API exchange | JSON-compatible responses | Data transfer between backend and frontend |

## Key Decisions

- **DEM is the primary data source** for terrain and water simulation
- **OSM data** is a candidate for roads, buildings, and administrative boundaries; completeness must be checked for the selected area
- **Procedural terrain generation** from real DEM data (not random generation)
- **Terrain analysis**: D8 flow direction and contributing-area accumulation. Rainfall overlay and threshold-based flood classification remain planned and require a defined indicator and validation.
- **React Three Fiber** chosen over raw OpenGL for faster development and React integration
- **Python backend** chosen over JS computation for NumPy/SciPy access and academic defensibility

## Data Flow

1. User highlights barangay boundaries on hover and selects or deselects one or more by clicking; selected barangay identifiers are sent to the backend.
2. Backend resolves the selected barangay geometry, loads the DEM coverage and relevant geographic layers, and prepares an elevation grid.
3. Backend derives flow direction and accumulation; the rainfall-to-indicator and classification method must be defined before a flood state can be validated.
4. Backend returns terrain geometry and scenario state through the API; the frontend renders 3D terrain and water via React Three Fiber.
5. User changes scenario inputs, runs evacuation analysis, inspects routes and assignments, then saves or duplicates scenarios for comparison and exports a summary.
