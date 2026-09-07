'use client';

import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode, type WheelEvent as ReactWheelEvent } from 'react';
import {
  AlertTriangle, Ambulance, ArrowRight, BarChart3, Box, Building2, Check,
  ChevronDown, Clock3, CloudRain, Layers3, Map, Minus, Navigation, Plus,
  Download, LocateFixed, Moon, RefreshCw, Route, ShieldCheck, SlidersHorizontal,
  Sun, Users, Waves, ZoomIn, ZoomOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type RoadKey = 'bridge' | 'riverside' | 'market';
type ViewMode = 'iso' | 'flat';
type Point = [number, number];
type Parcel = { x: number; y: number; w: number; d: number };
type MapLayers = { flood: boolean; buildings: boolean; routes: boolean; centers: boolean; closures: boolean };
type MapViewport = { scale: number; x: number; y: number };
type ScenarioSnapshot = { floodLevel: number; affected: number; vehicles: number; blocked: Record<RoadKey, boolean> };
type PlanResult = {
  id: number; scenario: ScenarioSnapshot; risk: 'Moderate' | 'Elevated' | 'High'; routed: number; unassigned: number;
  clearanceTime: number; capacity: number; allocations: number[]; centerLimits: number[];
  routeName: string; routeDetail: string; routePath: Point[]; alternatePath: Point[];
};

const roads: { key: RoadKey; label: string; detail: string }[] = [
  { key: 'bridge', label: 'Rizal Bridge', detail: 'Bridge crossing' },
  { key: 'riverside', label: 'Riverside Road', detail: 'Low-lying section' },
  { key: 'market', label: 'Market Access', detail: 'Commercial corridor' },
];

const centers = [
  { name: 'North Central School', short: 'NCS', allocated: 142, capacity: 180, tone: 'teal' },
  { name: 'Civic Sports Hall', short: 'CSH', allocated: 126, capacity: 150, tone: 'blue' },
  { name: 'West Elementary', short: 'WES', allocated: 80, capacity: 200, tone: 'amber' },
];

const roadLines: Point[][] = [
  [[0, 118], [800, 118]], [[0, 298], [800, 298]], [[0, 478], [800, 478]],
  [[158, 0], [158, 600]], [[418, 0], [418, 600]], [[648, 0], [648, 600]],
];
const riverLine: Point[] = [[0, 220], [110, 238], [225, 218], [340, 242], [455, 220], [580, 238], [690, 214], [800, 224]];
const floodShape: Point[] = [[0, 192], [115, 205], [230, 187], [342, 210], [460, 190], [580, 207], [690, 184], [800, 194], [800, 270], [690, 258], [580, 284], [455, 262], [340, 287], [225, 255], [110, 279], [0, 258]];
const parkShapes: Point[][] = [
  [[14, 14], [138, 14], [138, 95], [14, 95]], [[438, 322], [625, 322], [625, 455], [438, 455]], [[675, 324], [786, 324], [786, 452], [675, 452]],
];
const parcels: Parcel[] = [
  { x: 24, y: 28, w: 50, d: 64 }, { x: 86, y: 25, w: 42, d: 70 }, { x: 184, y: 22, w: 66, d: 67 }, { x: 264, y: 25, w: 48, d: 69 }, { x: 328, y: 22, w: 62, d: 72 },
  { x: 444, y: 25, w: 72, d: 68 }, { x: 530, y: 30, w: 44, d: 62 }, { x: 592, y: 24, w: 37, d: 69 }, { x: 680, y: 25, w: 52, d: 66 }, { x: 745, y: 22, w: 38, d: 72 },
  { x: 22, y: 330, w: 54, d: 112 }, { x: 91, y: 340, w: 42, d: 98 }, { x: 183, y: 330, w: 58, d: 106 }, { x: 258, y: 325, w: 50, d: 116 }, { x: 326, y: 334, w: 61, d: 101 },
  { x: 20, y: 502, w: 58, d: 76 }, { x: 92, y: 508, w: 40, d: 66 }, { x: 186, y: 510, w: 70, d: 64 }, { x: 274, y: 506, w: 52, d: 70 }, { x: 345, y: 510, w: 45, d: 64 },
  { x: 445, y: 502, w: 66, d: 73 }, { x: 530, y: 507, w: 72, d: 68 }, { x: 675, y: 505, w: 48, d: 70 }, { x: 740, y: 502, w: 43, d: 75 },
];
const buildingColors = ['#d66a55', '#d7a547', '#497d8d', '#80606c', '#3f7169', '#be7350'];
const buildings = parcels.map((parcel, index) => ({ ...parcel, height: 30 + (index * 23) % 76, color: buildingColors[index % buildingColors.length], floors: 2 + (index * 3) % 6 }));
const trees: Point[] = [[20, 103], [74, 104], [130, 100], [188, 102], [285, 102], [385, 104], [456, 103], [548, 101], [620, 104], [704, 101], [770, 103], [145, 338], [438, 347], [470, 390], [520, 438], [600, 360], [688, 350], [756, 420], [145, 525], [406, 534], [625, 530]];
const routePrimary: Point[] = [[72, 548], [158, 478], [286, 478], [418, 390], [510, 298], [648, 118], [716, 72]];
const routeAlternate: Point[] = [[72, 548], [158, 478], [286, 478], [418, 530], [558, 530]];
const routeViaCentral: Point[] = [[72, 548], [158, 478], [418, 478], [418, 390], [510, 298], [510, 118], [716, 118], [716, 72]];
const routeViaMabini: Point[] = [[72, 548], [158, 478], [158, 298], [158, 118], [648, 118], [716, 72]];
const routeToWest: Point[] = [[72, 548], [72, 510], [286, 478], [418, 478], [418, 530], [558, 530]];
const baselineScenario: ScenarioSnapshot = { floodLevel: .8, affected: 348, vehicles: 6, blocked: { bridge: true, riverside: true, market: false } };

function calculatePlan(scenario: ScenarioSnapshot, id: number): PlanResult {
  const blockedCount = Object.values(scenario.blocked).filter(Boolean).length;
  const risk = scenario.floodLevel >= 1.2 || blockedCount === 3 ? 'High' : scenario.floodLevel >= .7 ? 'Elevated' : 'Moderate';
  const centerLimits = scenario.floodLevel >= 1.2 ? [180, 150, 140] : [180, 150, 200];
  const capacity = centerLimits.reduce((total, value) => total + value, 0);
  const desired = [Math.round(scenario.affected * .408), Math.round(scenario.affected * .362)];
  desired.push(scenario.affected - desired[0] - desired[1]);
  const allocations = desired.map((value, index) => Math.min(value, centerLimits[index]));
  let remaining = scenario.affected - allocations.reduce((total, value) => total + value, 0);
  centerLimits.forEach((limit, index) => {
    const added = Math.min(remaining, limit - allocations[index]);
    allocations[index] += added; remaining -= added;
  });
  const routed = allocations.reduce((total, value) => total + value, 0);
  const unassigned = scenario.affected - routed;
  const clearanceTime = Math.max(24, Math.round(26 + scenario.floodLevel * 12 + blockedCount * 6 + scenario.affected / 85 - scenario.vehicles * 1.4 + unassigned * .23));
  const allClosed = blockedCount === 3;
  const routePath = allClosed ? routeToWest : scenario.blocked.bridge && scenario.blocked.riverside ? routeViaMabini : scenario.blocked.bridge ? routeViaCentral : routePrimary;
  const routeName = allClosed ? 'San Isidro → West Elementary' : 'San Isidro → North Central';
  const distance = allClosed ? '5.1 km' : scenario.blocked.bridge && scenario.blocked.riverside ? '4.8 km' : scenario.blocked.bridge ? '4.2 km' : '3.5 km';
  const routeDetail = `${distance} · ${10 + blockedCount * 3} min · avoids ${blockedCount} closure${blockedCount === 1 ? '' : 's'}`;
  return { id, scenario, risk, routed, unassigned, clearanceTime, capacity, allocations, centerLimits, routeName, routeDetail, routePath, alternatePath: allClosed ? routeViaMabini : routeAlternate };
}

function projectPoint([x, y]: Point, mode: ViewMode): Point {
  return mode === 'iso' ? [500 + (x - y) * .62, 76 + (x + y) * .32] : [100 + x, 16 + y];
}

function points(pointsToProject: Point[], mode: ViewMode, lift = 0) {
  return pointsToProject.map((point) => { const [x, y] = projectPoint(point, mode); return `${x},${y - lift}`; }).join(' ');
}

function MapBuilding({ building, mode }: { building: (typeof buildings)[number]; mode: ViewMode }) {
  const footprint: Point[] = [[building.x, building.y], [building.x + building.w, building.y], [building.x + building.w, building.y + building.d], [building.x, building.y + building.d]];
  if (mode === 'flat') return <g className="flat-building"><polygon points={points(footprint, mode)} fill={building.color} /><polygon points={points(footprint.map(([x, y]) => [x + 5, y + 5]), mode)} fill="#ffffff28" /></g>;
  const height = building.height * .72;
  const base = footprint.map((point) => projectPoint(point, mode));
  const roof = base.map(([x, y]) => [x, y - height] as Point);
  const sideRight = [base[1], base[2], roof[2], roof[1]];
  const sideLeft = [base[2], base[3], roof[3], roof[2]];
  const floorLines = Array.from({ length: Math.min(building.floors - 1, 5) }, (_, index) => index + 1);
  return (
    <g className="iso-building">
      <polygon points={sideRight.map((p) => p.join(',')).join(' ')} fill={building.color} />
      <polygon points={sideLeft.map((p) => p.join(',')).join(' ')} fill={`color-mix(in srgb, ${building.color}, #26383b 22%)`} />
      <polygon points={roof.map((p) => p.join(',')).join(' ')} fill={`color-mix(in srgb, ${building.color}, white 35%)`} />
      {floorLines.map((floor) => {
        const ratio = floor / building.floors;
        const a: Point = [base[1][0], roof[1][1] + height * ratio]; const b: Point = [base[2][0], roof[2][1] + height * ratio];
        const c: Point = [base[3][0], roof[3][1] + height * ratio];
        return <g key={floor}><line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} /><line x1={b[0]} y1={b[1]} x2={c[0]} y2={c[1]} /></g>;
      })}
      <circle cx={roof[0][0] + 7} cy={roof[0][1] + 5} r="3" fill="#f4f0e8" opacity=".8" />
    </g>
  );
}

function Stepper({ value, label, onDecrease, onIncrease }: { value: number; label: string; onDecrease: () => void; onIncrease: () => void }) {
  return <div className="stepper"><button aria-label={`Decrease ${label}`} onClick={onDecrease}><Minus /></button><output aria-label={label}>{value}</output><button aria-label={`Increase ${label}`} onClick={onIncrease}><Plus /></button></div>;
}

function Disclosure({ icon, title, summary, children, defaultOpen = false }: { icon: ReactNode; title: string; summary: string; children: ReactNode; defaultOpen?: boolean }) {
  return (
    <Collapsible className="disclosure" defaultOpen={defaultOpen}>
      <CollapsibleTrigger className="disclosure-trigger">
        <span className="disclosure-icon">{icon}</span><span className="disclosure-copy"><strong>{title}</strong><small>{summary}</small></span><ChevronDown className="disclosure-chevron" />
      </CollapsibleTrigger>
      <CollapsibleContent className="disclosure-content">{children}</CollapsibleContent>
    </Collapsible>
  );
}

function OutcomeMetric({ icon, label, value, note, warning = false }: { icon: ReactNode; label: string; value: string; note: string; warning?: boolean }) {
  return <div className={`outcome-metric ${warning ? 'warning' : ''}`}><span>{icon}</span><div><small>{label}</small><strong>{value}</strong><em>{note}</em></div></div>;
}

function IsoMap({ plan, draftFloodLevel, draftBlocked, viewMode, layers, viewport, dragging, onPointerDown, onPointerMove, onPointerUp, onWheel }: { plan: PlanResult; draftFloodLevel: number; draftBlocked: Record<RoadKey, boolean>; viewMode: ViewMode; layers: MapLayers; viewport: MapViewport; dragging: boolean; onPointerDown: (event: ReactPointerEvent<HTMLDivElement>) => void; onPointerMove: (event: ReactPointerEvent<HTMLDivElement>) => void; onPointerUp: (event: ReactPointerEvent<HTMLDivElement>) => void; onWheel: (event: ReactWheelEvent<HTMLDivElement>) => void }) {
  const markerAt = (point: Point) => {
    const [x, y] = projectPoint(point, viewMode);
    return `translate(${x} ${y})`;
  };
  const centerLabel = (point: Point, kind: 'north' | 'sports' | 'origin') => {
    const [x, y] = projectPoint(point, viewMode);
    if (kind === 'north') return `translate(${x - 151} ${y - 61})`;
    if (kind === 'sports') return `translate(${x + 27} ${y - 23})`;
    return `translate(${x - 45} ${y + (viewMode === 'iso' ? 33 : -54)})`;
  };
  const floodOpacity = .42 + Math.min(draftFloodLevel, 1.8) * .18;

  return (
    <div className={`map-stage ${viewMode === 'iso' ? 'isometric' : 'flat'} ${dragging ? 'dragging' : ''}`} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp} onWheel={onWheel}>
      <svg className="map-art" style={{ transform: `translate3d(${viewport.x}px, ${viewport.y}px, 0) scale(${viewport.scale})` }} viewBox="0 0 1000 650" role="img" aria-label={`${viewMode === 'iso' ? 'Low-poly isometric' : 'Two-dimensional'} synthetic evacuation map showing flood areas, closures, shelters, and recommended routes`}>
        <defs>
          <linearGradient id="flood" x1="0" x2="1"><stop offset="0" stopColor="#5ac4d4" /><stop offset="1" stopColor="#168da8" /></linearGradient>
          <filter id="pinShadow" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="5" stdDeviation="5" floodOpacity=".24" /></filter>
        </defs>
        <polygon className="map-ground" points={points([[0, 0], [800, 0], [800, 600], [0, 600]], viewMode)} />
        {parkShapes.map((shape, index) => <polygon key={`park-${index}`} className="map-park" points={points(shape, viewMode)} />)}
        <polyline className="river-bank" points={points(riverLine, viewMode)} />
        <polyline className="river-water" points={points(riverLine, viewMode)} />
        {roadLines.map((road, index) => <polyline key={`road-base-${index}`} className="road-base" points={points(road, viewMode)} />)}
        {roadLines.map((road, index) => <polyline key={`road-surface-${index}`} className="road-surface" points={points(road, viewMode)} />)}
        {roadLines.map((road, index) => <polyline key={`road-line-${index}`} className="road-line" points={points(road, viewMode)} />)}
        {layers.flood && <polygon points={points(floodShape, viewMode)} fill="url(#flood)" opacity={floodOpacity} className="flood-plane" />}
        {layers.buildings && buildings.map((building, index) => <MapBuilding key={`building-${index}`} building={building} mode={viewMode} />)}
        {layers.buildings && trees.map((tree, index) => {
          const [x, y] = projectPoint(tree, viewMode);
          return viewMode === 'iso'
            ? <g key={`tree-${index}`}><line className="tree-trunk" x1={x} y1={y} x2={x} y2={y - 22} /><polygon className="tree-canopy" points={`${x},${y - 40} ${x + 11},${y - 26} ${x},${y - 14} ${x - 11},${y - 26}`} /></g>
            : <g key={`tree-${index}`}><circle className="tree-canopy" cx={x} cy={y} r="8" /><circle cx={x - 2} cy={y - 2} r="3" fill="#9bc55d" /></g>;
        })}
        {layers.routes && <g className="evacuation-routes">
          <polyline className="route-shadow" points={points(plan.routePath, viewMode)} />
          <polyline className="route-primary" points={points(plan.routePath, viewMode)} />
          <polyline className="route-highlight" points={points(plan.routePath, viewMode)} />
          <polyline className="route-alternate" points={points(plan.alternatePath, viewMode)} />
        </g>}
        {layers.closures && draftBlocked.riverside && <g transform={markerAt([418, 298])} className="closure-marker"><circle r="17" fill="#df5745" stroke="#fff" strokeWidth="5" /><path d="M-6-6L6 6M6-6L-6 6" stroke="#fff" strokeWidth="3" /></g>}
        {layers.closures && draftBlocked.bridge && <g transform={markerAt([648, 220])} className="closure-marker"><circle r="17" fill="#df5745" stroke="#fff" strokeWidth="5" /><path d="M-6-6L6 6M6-6L-6 6" stroke="#fff" strokeWidth="3" /></g>}
        {layers.closures && draftBlocked.market && <g transform={markerAt([158, 478])} className="closure-marker"><circle r="17" fill="#df5745" stroke="#fff" strokeWidth="5" /><path d="M-6-6L6 6M6-6L-6 6" stroke="#fff" strokeWidth="3" /></g>}
        {layers.centers && <><g transform={markerAt([72, 548])} filter="url(#pinShadow)"><circle r="21" fill="#f2aa31" stroke="#fff" strokeWidth="5" /><path d="M-8 6V-2L0-9L8-2V6Z" fill="#173e49" /><circle cy="3" r="2.5" fill="#f2aa31" /></g>
        <g transform={markerAt([716, 72])} filter="url(#pinShadow)"><path d="M0-26C16-26 27-15 27 0C27 20 0 41 0 41S-27 20-27 0C-27-15-16-26 0-26Z" fill="#087e72" stroke="#fff" strokeWidth="5" /><path d="M-10 6V-8H10V6M-14-8L0-16L14-8M-4 6V-2H4V6" fill="none" stroke="#fff" strokeWidth="3" /></g>
        <g transform={markerAt([558, 530])} filter="url(#pinShadow)"><path d="M0-24C15-24 25-14 25 0C25 19 0 38 0 38S-25 19-25 0C-25-14-15-24 0-24Z" fill="#2f6d9e" stroke="#fff" strokeWidth="5" /><path d="M-9 6V-7H9V6M-13-7L0-15L13-7" fill="none" stroke="#fff" strokeWidth="3" /></g>
        <g className="map-label" transform={centerLabel([716, 72], 'north')}><rect width="139" height="46" rx="9" fill="#fff" /><text x="12" y="19">NORTH CENTRAL</text><text x="12" y="35">{Math.round(plan.allocations[0] / plan.centerLimits[0] * 100)}% capacity</text></g>
        <g className="map-label" transform={centerLabel([558, 530], 'sports')}><rect width="127" height="46" rx="9" fill="#fff" /><text x="12" y="19">SPORTS HALL</text><text x="12" y="35">{Math.round(plan.allocations[1] / plan.centerLimits[1] * 100)}% capacity</text></g>
        <g className="map-label origin-label" transform={centerLabel([72, 548], 'origin')}><rect width="140" height="38" rx="9" fill="#173e49" /><text x="12" y="24">BRGY. SAN ISIDRO</text></g></>}
        <g className={`map-mode-stamp ${viewMode}`} transform={viewMode === 'iso' ? 'translate(440 547)' : 'translate(730 588)'}><rect width="170" height="28" rx="14" /><text x="85" y="18" textAnchor="middle">ONE SHARED MAP MODEL</text></g>
      </svg>
    </div>
  );
}

export default function Home() {
  const [floodLevel, setFloodLevel] = useState(baselineScenario.floodLevel);
  const [affected, setAffected] = useState(baselineScenario.affected);
  const [vehicles, setVehicles] = useState(baselineScenario.vehicles);
  const [blocked, setBlocked] = useState<Record<RoadKey, boolean>>({ ...baselineScenario.blocked });
  const [viewMode, setViewMode] = useState<ViewMode>('iso');
  const [hasChanges, setHasChanges] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [plan, setPlan] = useState<PlanResult>(() => calculatePlan(baselineScenario, 1));
  const [approvedPlan, setApprovedPlan] = useState<number | null>(null);
  const [layerPanelOpen, setLayerPanelOpen] = useState(false);
  const [layers, setLayers] = useState<MapLayers>({ flood: true, buildings: true, routes: true, centers: true, closures: true });
  const [resultsTab, setResultsTab] = useState('summary');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [viewport, setViewport] = useState<MapViewport>({ scale: 1, x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragOrigin = useRef<{ pointerId: number; x: number; y: number; mapX: number; mapY: number } | null>(null);
  const blockedCount = Object.values(blocked).filter(Boolean).length;
  const draftRisk = floodLevel >= 1.2 || blockedCount === 3 ? 'High' : floodLevel >= .7 ? 'Elevated' : 'Moderate';
  const zones = useMemo(() => {
    const values = [Math.round(plan.scenario.affected * .408), Math.round(plan.scenario.affected * .362)];
    values.push(plan.scenario.affected - values[0] - values[1]); return values;
  }, [plan]);
  const severeComparison = useMemo(() => calculatePlan({ floodLevel: 1.5, affected: 512, vehicles: 4, blocked: { bridge: true, riverside: true, market: true } }, 0), []);

  const markChanged = () => { setHasChanges(true); setApprovedPlan(null); };
  const applyPreset = (preset: 'moderate' | 'severe') => {
    if (preset === 'moderate') { setFloodLevel(.8); setAffected(348); setBlocked({ bridge: true, riverside: true, market: false }); setVehicles(6); }
    else { setFloodLevel(1.5); setAffected(512); setBlocked({ bridge: true, riverside: true, market: true }); setVehicles(4); }
    markChanged(); setResultsTab('summary');
  };
  const resetScenario = () => {
    setFloodLevel(baselineScenario.floodLevel); setAffected(baselineScenario.affected); setVehicles(baselineScenario.vehicles);
    setBlocked({ ...baselineScenario.blocked }); setPlan(calculatePlan(baselineScenario, 1)); setHasChanges(false); setApprovedPlan(null); setResultsTab('summary');
  };
  const runAnalysis = () => {
    const scenario: ScenarioSnapshot = { floodLevel, affected, vehicles, blocked: { ...blocked } };
    setIsRunning(true); setApprovedPlan(null); setResultsTab('summary');
    window.setTimeout(() => { setPlan((current) => calculatePlan(scenario, current.id + 1)); setHasChanges(false); setIsRunning(false); }, 850);
  };
  const downloadPlan = () => {
    const report = { title: 'Sentinel evacuation plan', generatedAt: new Date().toISOString(), approved: approvedPlan === plan.id, ...plan };
    const url = URL.createObjectURL(new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = `sentinel-plan-${String(plan.id).padStart(2, '0')}.json`; link.click(); URL.revokeObjectURL(url);
  };
  const zoomMap = (change: number) => setViewport((current) => ({ ...current, scale: Math.min(2.6, Math.max(.7, Number((current.scale + change).toFixed(2)))) }));
  const resetMapView = () => setViewport({ scale: 1, x: 0, y: 0 });
  const startPan = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragOrigin.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, mapX: viewport.x, mapY: viewport.y };
    setDragging(true);
  };
  const panMap = (event: ReactPointerEvent<HTMLDivElement>) => {
    const origin = dragOrigin.current; if (!origin || origin.pointerId !== event.pointerId) return;
    setViewport((current) => ({ ...current, x: origin.mapX + event.clientX - origin.x, y: origin.mapY + event.clientY - origin.y }));
  };
  const stopPan = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragOrigin.current?.pointerId !== event.pointerId) return;
    dragOrigin.current = null; setDragging(false);
  };
  const wheelZoom = (event: ReactWheelEvent<HTMLDivElement>) => { event.preventDefault(); zoomMap(event.deltaY < 0 ? .12 : -.12); };

  useEffect(() => {
    const saved = window.localStorage.getItem('sentinel-theme');
    setTheme(saved === 'dark' || saved === 'light' ? saved : window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }, []);
  const toggleTheme = () => setTheme((current) => {
    const next = current === 'light' ? 'dark' : 'light'; window.localStorage.setItem('sentinel-theme', next); return next;
  });

  useEffect(() => {
    type ToolInput = { preset: 'moderate' | 'severe' };
    type ModelContext = { registerTool: (tool: object, options?: { signal?: AbortSignal }) => void | Promise<void> };
    const context = (document as Document & { modelContext?: ModelContext }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    void Promise.resolve(context.registerTool({
      name: 'run_evacuation_analysis', title: 'Run evacuation analysis',
      description: 'Load a moderate or severe controlled-demo flood scenario, run the analysis, and update the visible evacuation plan.',
      inputSchema: { type: 'object', properties: { preset: { type: 'string', enum: ['moderate', 'severe'] } }, required: ['preset'], additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      async execute(input: unknown) {
        const preset = (input as ToolInput | null)?.preset;
        if (preset !== 'moderate' && preset !== 'severe') throw new Error('preset must be moderate or severe');
        const scenario: ScenarioSnapshot = preset === 'moderate' ? { ...baselineScenario, blocked: { ...baselineScenario.blocked } } : { floodLevel: 1.5, affected: 512, vehicles: 4, blocked: { bridge: true, riverside: true, market: true } };
        setFloodLevel(scenario.floodLevel); setAffected(scenario.affected); setBlocked({ ...scenario.blocked }); setVehicles(scenario.vehicles);
        const result = calculatePlan(scenario, 0);
        setPlan((current) => calculatePlan(scenario, current.id + 1)); setHasChanges(false); setApprovedPlan(null); setResultsTab('summary');
        return { status: result.unassigned ? 'capacity_gap' : 'feasible', residentsRouted: result.routed, unassigned: result.unassigned, estimatedClearanceMinutes: result.clearanceTime, recommendedRoute: result.routeName };
      },
    }, { signal: lifecycle.signal })).catch(() => undefined);
    return () => lifecycle.abort();
  }, []);

  return (
    <main className={`app-shell ${theme}`}>
      <header className="topbar">
        <div className="brand-lockup"><div className="brand-mark"><ShieldCheck /></div><div><strong>Sentinel</strong><span>Planning workspace</span></div></div>
        <div className="scenario-heading"><span className="status-dot" /><div><small>CONTROLLED DEMO · PREPAREDNESS</small><h1>River Rise — Weekday AM</h1></div></div>
        <div className="topbar-actions"><div className={`sync-state ${hasChanges || isRunning ? 'changed' : ''}`} aria-live="polite">{isRunning ? <RefreshCw className="spin" /> : hasChanges ? <AlertTriangle /> : <Check />}{isRunning ? 'Calculating routes…' : hasChanges ? 'Draft not analyzed' : approvedPlan === plan.id ? `Plan #${String(plan.id).padStart(2, '0')} approved` : `Plan #${String(plan.id).padStart(2, '0')} current`}</div><Button variant="outline" size="sm" onClick={resetScenario}>Reset</Button><button className="theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>{theme === 'light' ? <Moon /> : <Sun />}</button><div className="avatar" aria-label="Planner account">PL</div></div>
      </header>

      <div className="workspace-grid">
        <aside className="control-panel" aria-label="Scenario controls">
          <div className="panel-heading"><div><span>SCENARIO</span><h2>Set conditions</h2></div><SlidersHorizontal /></div>
          <section className="primary-inputs">
            <div className="input-heading"><span><CloudRain />Flood level</span><strong>{floodLevel.toFixed(1)} m</strong></div>
            <Slider aria-label="Flood water level" min={.2} max={1.8} step={.1} value={[floodLevel]} onValueChange={(value) => { setFloodLevel(Number(value)); markChanged(); }} className="hazard-slider" />
            <div className="range-labels"><span>Shallow</span><span>Severe</span></div>
            <div className={`risk-chip ${draftRisk.toLowerCase()}`}><Waves />{draftRisk} exposure</div>
            <div className="resident-control"><div><Users /><span><strong>Affected residents</strong><small>Planning estimate</small></span></div><Stepper label="affected residents" value={affected} onDecrease={() => { setAffected((v) => Math.max(50, v - 25)); markChanged(); }} onIncrease={() => { setAffected((v) => Math.min(650, v + 25)); markChanged(); }} /></div>
          </section>

          <div className="advanced-label">MORE CONDITIONS</div>
          <div className="disclosure-stack">
            <Disclosure icon={<Route />} title="Road constraints" summary={`${blockedCount} closures active`}>
              <div className="road-list">{roads.map((road) => <label key={road.key} className="road-row"><span><strong>{road.label}</strong><small>{road.detail}</small></span><Switch aria-label={`Mark ${road.label} closed`} checked={blocked[road.key]} onCheckedChange={(checked) => { setBlocked((current) => ({ ...current, [road.key]: checked })); markChanged(); }} /></label>)}</div>
            </Disclosure>
            <Disclosure icon={<Ambulance />} title="Rescue resources" summary={`${vehicles} vehicles available`}>
              <div className="resource-control"><span>Trucks and vans</span><Stepper label="available vehicles" value={vehicles} onDecrease={() => { setVehicles((v) => Math.max(1, v - 1)); markChanged(); }} onIncrease={() => { setVehicles((v) => Math.min(12, v + 1)); markChanged(); }} /></div>
            </Disclosure>
            <Disclosure icon={<BarChart3 />} title="Scenario presets" summary="Moderate and severe">
              <div className="preset-row"><button onClick={() => applyPreset('moderate')}>Moderate</button><button onClick={() => applyPreset('severe')}>Severe</button></div>
            </Disclosure>
          </div>

          <Button size="lg" className="run-button" onClick={runAnalysis} disabled={isRunning}>{isRunning ? <RefreshCw className="spin" /> : <BarChart3 />}{isRunning ? 'Testing routes…' : hasChanges ? 'Analyze draft' : 'Re-run analysis'}</Button>
          <p className="decision-note">Decision support only · Synthetic demonstration data</p>
        </aside>

        <section className="map-panel" aria-label="Evacuation map">
          <div className="map-toolbar"><div className="map-context"><Map /><span><strong>North district</strong><small>{hasChanges ? 'Draft hazards · last analyzed routes' : 'Analyzed plan geometry'}</small></span></div><div className="view-toggle" aria-label="Map perspective"><button className={viewMode === 'iso' ? 'active' : ''} onClick={() => setViewMode('iso')}><Box />Isometric</button><button className={viewMode === 'flat' ? 'active' : ''} onClick={() => setViewMode('flat')}><Map />2D</button></div><Button variant="outline" size="sm" aria-expanded={layerPanelOpen} onClick={() => setLayerPanelOpen((open) => !open)}><Layers3 />{Object.values(layers).filter(Boolean).length} layers</Button></div>
          <div className="map-canvas">
            <IsoMap plan={plan} draftFloodLevel={floodLevel} draftBlocked={blocked} viewMode={viewMode} layers={layers} viewport={viewport} dragging={dragging} onPointerDown={startPan} onPointerMove={panMap} onPointerUp={stopPan} onWheel={wheelZoom} />
            <div className={`route-card ${hasChanges ? 'stale' : ''}`}><div className="route-card-icon"><Navigation /></div><div><small>{hasChanges ? 'LAST ANALYZED ROUTE' : 'RECOMMENDED ROUTE'}</small><strong>{plan.routeName}</strong><span>{plan.routeDetail}</span></div><ArrowRight /></div>
            <div className="constraint-chip"><AlertTriangle /><span><strong>{blockedCount} constraints</strong><small>{hasChanges ? 'Draft changed' : 'Route recalculated'}</small></span></div>
            {layerPanelOpen && <div className="layer-menu"><div><strong>Map layers</strong><button aria-label="Close map layers" onClick={() => setLayerPanelOpen(false)}>×</button></div>{([['flood', 'Flood extent'], ['buildings', 'Buildings & trees'], ['routes', 'Evacuation routes'], ['centers', 'Centers & labels'], ['closures', 'Road closures']] as [keyof MapLayers, string][]).map(([key, label]) => <label key={key}><span>{label}</span><Switch checked={layers[key]} aria-label={`Show ${label}`} onCheckedChange={(checked) => setLayers((current) => ({ ...current, [key]: checked }))} /></label>)}</div>}
            <div className="map-legend"><span><i className="route-key" /> Primary</span><span><i className="alt-key" /> Alternate</span><span><i className="flood-key" /> Flood</span><span><i className="closed-key">×</i> Closed</span></div>
            <div className="map-navigation" aria-label="Map navigation controls"><span>Drag to pan · {Math.round(viewport.scale * 100)}%</span><div><button onClick={() => zoomMap(-.15)} disabled={viewport.scale <= .7} aria-label="Zoom out" title="Zoom out"><ZoomOut /></button><button onClick={resetMapView} aria-label="Reset map view" title="Reset map view"><LocateFixed /></button><button onClick={() => zoomMap(.15)} disabled={viewport.scale >= 2.6} aria-label="Zoom in" title="Zoom in"><ZoomIn /></button></div></div>
            <div className="iso-compass"><span>N</span><i /></div>
          </div>
        </section>

        <aside className="results-panel" aria-label="Analysis results">
          <Tabs value={resultsTab} onValueChange={setResultsTab} className="results-tabs">
            <div className="results-header"><TabsList><TabsTrigger value="summary">Plan</TabsTrigger><TabsTrigger value="compare">Compare</TabsTrigger></TabsList></div>
            <TabsContent value="summary" className="results-content">
              <div className={`plan-status ${hasChanges || plan.unassigned ? 'plan-warning' : ''}`}><div className="status-icon">{hasChanges || plan.unassigned ? <AlertTriangle /> : <Check />}</div><div><span>{hasChanges ? 'RESULTS OUT OF DATE' : plan.unassigned ? 'ACTION REQUIRED' : approvedPlan === plan.id ? 'PLAN APPROVED' : 'FEASIBLE PLAN'}</span><h2>{hasChanges ? 'Analyze the draft' : plan.unassigned ? `${plan.unassigned} need placement` : approvedPlan === plan.id ? 'Ready for briefing' : 'Everyone has a route'}</h2><p>{hasChanges ? `Showing plan #${String(plan.id).padStart(2, '0')} until analysis finishes.` : plan.unassigned ? 'Reduce demand or open another safe center.' : 'Closures avoided. Capacity remains available.'}</p></div></div>
              <div className="outcome-grid">
                <OutcomeMetric icon={<Users />} label="Routed" value={`${plan.routed}/${plan.scenario.affected}`} note={plan.unassigned ? `${plan.unassigned} unassigned` : '100% assigned'} warning={!!plan.unassigned} />
                <OutcomeMetric icon={<Clock3 />} label="Clearance" value={`${plan.clearanceTime} min`} note="Estimated" />
                <OutcomeMetric icon={<Building2 />} label="Capacity" value={`${Math.round(plan.routed / plan.capacity * 100)}%`} note={plan.unassigned ? 'Gap detected' : `${plan.capacity - plan.routed} spaces left`} warning={!!plan.unassigned} />
                <OutcomeMetric icon={<Ambulance />} label="Vehicles" value={`${plan.scenario.vehicles}/${plan.scenario.vehicles}`} note="All assigned" />
              </div>
              <div className="result-disclosures">
                <Disclosure icon={<Route />} title="Evacuation sequence" summary="3 priority zones">
                  <div className="sequence-list">{[['San Isidro riverside', zones[0]], ['Market neighborhood', zones[1]], ['West residential', zones[2]]].map(([name, count], index) => <div className="sequence-row" key={String(name)}><b>{index + 1}</b><span><strong>{name}</strong><small>{count} people</small></span>{index === 0 && <em>Urgent</em>}</div>)}</div>
                </Disclosure>
                <Disclosure icon={<Building2 />} title="Center allocation" summary={`${plan.routed} people placed`} defaultOpen>
                  <div className="center-list">{centers.map((center, index) => { const used = plan.allocations[index]; const limit = plan.centerLimits[index]; const percent = Math.round(used / limit * 100); return <div className="center-row" key={center.short}><div className={`center-badge ${center.tone}`}>{center.short}</div><span><strong>{center.name}</strong><small>{used} assigned · {limit - used} open</small><i><b style={{ width: `${percent}%` }} /></i></span><em>{percent}%</em></div>; })}</div>
                </Disclosure>
                <Disclosure icon={<Ambulance />} title="Resource plan" summary={`${plan.scenario.vehicles} vehicles assigned`}>
                  <div className="resource-routes"><div><span><Ambulance />North Central School</span><strong>{Math.max(1, plan.scenario.vehicles - 2)} units</strong></div><div><span><Navigation />Civic Sports Hall</span><strong>{Math.min(2, plan.scenario.vehicles)} units</strong></div></div>
                </Disclosure>
              </div>
              <div className="plan-actions"><Button size="sm" disabled={hasChanges || !!plan.unassigned} onClick={() => setApprovedPlan(plan.id)}>{approvedPlan === plan.id ? <Check /> : <ShieldCheck />}{approvedPlan === plan.id ? 'Approved' : 'Approve plan'}</Button><Button size="sm" variant="outline" onClick={downloadPlan}><Download />Report</Button></div>
              <p className="analysis-stamp">Plan #{String(plan.id).padStart(2, '0')} · Deterministic demo analysis</p>
            </TabsContent>
            <TabsContent value="compare" className="results-content compare-content">
              <div className="compare-heading"><BarChart3 /><div><h2>Impact comparison</h2><p>Current plan against the severe preset.</p></div></div>
              <div className="compare-table"><div className="compare-head"><span>Measure</span><b>Plan #{String(plan.id).padStart(2, '0')}</b><b>Severe</b></div><div><span>Flood</span><b>{plan.scenario.floodLevel.toFixed(1)} m</b><b className="bad">1.5 m</b></div><div><span>Clearance</span><b>{plan.clearanceTime}m</b><b className="bad">{severeComparison.clearanceTime}m</b></div><div><span>Closures</span><b>{Object.values(plan.scenario.blocked).filter(Boolean).length}</b><b className="bad">3</b></div><div><span>Unassigned</span><b className={plan.unassigned ? 'bad' : 'good'}>{plan.unassigned}</b><b className="bad">{severeComparison.unassigned}</b></div></div>
              <div className="compare-insight"><AlertTriangle /><span><strong>Severe scenario creates a capacity gap</strong><small>A fourth accessible center is needed for {severeComparison.unassigned} residents.</small></span></div>
              <Button variant="outline" className="load-scenario" onClick={() => applyPreset('severe')}>Load severe scenario<ArrowRight /></Button>
            </TabsContent>
          </Tabs>
        </aside>
      </div>
    </main>
  );
}
