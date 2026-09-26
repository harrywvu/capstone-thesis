export type ManualClosure = 'bridge' | 'riverside' | 'market';
export type Scenario = {
  sectorId: string;
  intensityMmHr: number;
  durationHr: number;
  affected: number;
  vehicles: number;
  manualClosures: Record<ManualClosure, boolean>;
};

export type LandscapeItem = { x: number; z: number; radius: number; height: number; tone: number; rotation?: number };
export type FieldPatch = { x: number; z: number; radiusX: number; radiusZ: number; rotation: number; tone: number };
export type SceneGeometry = {
  size: number;
  elevations: number[];
  vertices: number[];
  colors: number[];
  indices: number[];
  nodes: Record<string, [number, number]>;
  edges: { from: string; to: string; key: string }[];
  buildings: { x: number; z: number; width: number; depth: number; height: number; color: string }[];
  centers: { node: string; name: string; capacity: number; tone: string }[];
  landscape: { fields: FieldPatch[]; trees: LandscapeItem[]; shrubs: LandscapeItem[]; rocks: LandscapeItem[] };
};
export type TerrainResponse = { sectorId: string; sectorLabel: string; synthetic: true; geometry: SceneGeometry };
export type FloodFrame = { elapsedMinutes: number; depthsM: number[]; wetCells: number; maxDepthM: number };
export type FloodResponse = {
  sectorId: string; synthetic: true; validated: false; frames: FloodFrame[]; peakDepthsM: number[];
  floodMask: boolean[]; floodedCells: number; totalCells: number; floodedRoads: Record<string, boolean>;
  maxDepthM: number; depthUnit: 'm'; visibleDepthM: number; roadClosureDepthM: number;
  cellSizeM: number; infiltrationMmHr: number; manningN: number; durationMinutes: number;
  waterBalanceM3: { rainfall: number; infiltration: number; outflow: number; stored: number; error: number };
};
export type PlanResponse = {
  sectorId: string; synthetic: true; risk: 'Moderate' | 'Elevated' | 'High'; routed: number; unassigned: number;
  clearanceTime: number; capacity: number; allocations: number[]; vehicleAllocations: number[]; centerLimits: number[]; routeName: string;
  routeDetail: string; routePath: string[]; alternatePath: string[]; roadBlocked: Record<string, boolean>;
  floodedCells: number; totalCells: number; maxDepthM: number; disclaimer: string;
};

const API_BASE = process.env.NEXT_PUBLIC_DEMO_API_URL || 'http://127.0.0.1:8000';

async function post<T>(path: string, payload: object, signal?: AbortSignal): Promise<T> {
  let response: Response;
  try {
    response = await fetch(API_BASE + path, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    throw new Error('The local demo API is unavailable. Start the Python service, then retry.');
  }
  if (!response.ok) {
    const detail = await response.json().catch(() => null) as { detail?: string } | null;
    throw new Error(detail?.detail || 'The demo API returned ' + response.status + '.');
  }
  return response.json() as Promise<T>;
}

export const demoApi = {
  terrain: (sectorId: string, signal?: AbortSignal) => post<TerrainResponse>('/api/terrain', { sectorId }, signal),
  simulate: (scenario: Scenario, signal?: AbortSignal) => post<FloodResponse>('/api/simulate', {
    sectorId: scenario.sectorId, intensityMmHr: scenario.intensityMmHr, durationHr: scenario.durationHr,
  }, signal),
  analyze: (scenario: Scenario, signal?: AbortSignal) => post<PlanResponse>('/api/analyze', scenario, signal),
};
