'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle, Ambulance, ArrowLeft, BarChart3, Box, Building2, ChevronDown,
  Clock3, CloudRain, Download, Layers3, LocateFixed, Map, Moon, Play, RefreshCw,
  RotateCcw, Route, ShieldCheck, SlidersHorizontal, Sun, Users, Waves, ZoomIn, ZoomOut,
} from 'lucide-react';
import Link from 'next/link';
import TerrainScene, { type SceneLayers } from '@/components/demo/terrain-scene';
import { demoApi, type FloodResponse, type ManualClosure, type PlanResponse, type Scenario, type TerrainResponse } from '@/lib/demo-api';

const SECTOR_LABELS: Record<string, string> = {
  'sector-a': 'Demo sector A', 'sector-b': 'Demo sector B', 'sector-c': 'Demo sector C',
};
const DEFAULTS = { intensityMmHr: 30, durationHr: 2, affected: 348, vehicles: 6, manualClosures: { bridge: false, riverside: false, market: false } };
const SEVERE = { intensityMmHr: 90, durationHr: 3, affected: 512, vehicles: 4, manualClosures: { bridge: true, riverside: true, market: true } };
const ROAD_LABELS: Record<ManualClosure, string> = { bridge: 'Bridge corridor', riverside: 'Riverside Road', market: 'Market Access' };
const ALL_LAYERS: SceneLayers = { water: true, landscape: true, buildings: true, roads: true, routes: true, centers: true };

function NumberStepper({ label, value, min, max, step, onChange, disabled }: { label: string; value: number; min: number; max: number; step: number; onChange: (value: number) => void; disabled?: boolean }) {
  return <div className="defense-stepper"><button aria-label={'Decrease ' + label} disabled={disabled || value <= min} onClick={() => onChange(Math.max(min, value - step))}>−</button><output aria-label={label}>{value}</output><button aria-label={'Increase ' + label} disabled={disabled || value >= max} onClick={() => onChange(Math.min(max, value + step))}>+</button></div>;
}

function Disclosure({ icon, title, summary, children, initial = false }: { icon: React.ReactNode; title: string; summary: string; children: React.ReactNode; initial?: boolean }) {
  const [open, setOpen] = useState(initial);
  return <div className="defense-disclosure"><button className="defense-disclosure-trigger" aria-expanded={open} onClick={() => setOpen(!open)}><span className="disclosure-icon-new">{icon}</span><span><strong>{title}</strong><small>{summary}</small></span><ChevronDown className={open ? 'opened' : ''} size={16} /></button>{open && <div className="defense-disclosure-body">{children}</div>}</div>;
}

function animateValue(setter: (value: number) => void, duration: number, reducedMotion: boolean) {
  if (reducedMotion) { setter(1); return () => {}; }
  let frame = 0;
  let start = 0;
  const tick = (now: number) => {
    if (!start) start = now;
    const ratio = Math.min(1, (now - start) / duration);
    setter(ratio);
    if (ratio < 1) frame = requestAnimationFrame(tick);
  };
  frame = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(frame);
}

export default function Workspace() {
  const [sectorId, setSectorId] = useState<string | null>(null);
  const [terrain, setTerrain] = useState<TerrainResponse | null>(null);
  const [loadError, setLoadError] = useState('');
  const [loading, setLoading] = useState(true);
  const [retryToken, setRetryToken] = useState(0);
  const [draft, setDraft] = useState<Scenario>({ sectorId: 'sector-a', ...DEFAULTS });
  const [lastScenario, setLastScenario] = useState<Scenario | null>(null);
  const [flood, setFlood] = useState<FloodResponse | null>(null);
  const [plan, setPlan] = useState<PlanResponse | null>(null);
  const [comparison, setComparison] = useState<PlanResponse | null>(null);
  const [runError, setRunError] = useState('');
  const [running, setRunning] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [planNumber, setPlanNumber] = useState(0);
  const [approvedPlan, setApprovedPlan] = useState<number | null>(null);
  const [resultTab, setResultTab] = useState<'plan' | 'compare'>('plan');
  const [layers, setLayers] = useState<SceneLayers>(ALL_LAYERS);
  const [layerPanelOpen, setLayerPanelOpen] = useState(false);
  const [topDown, setTopDown] = useState(false);
  const [cameraReset, setCameraReset] = useState(0);
  const [zoomToken, setZoomToken] = useState(0);
  const [zoomDirection, setZoomDirection] = useState<'in' | 'out'>('in');
  const [buildProgress, setBuildProgress] = useState(0);
  const [buildRun, setBuildRun] = useState(0);
  const [waterProgress, setWaterProgress] = useState(0);
  const [waterRun, setWaterRun] = useState(0);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const requestRef = useRef<AbortController | null>(null);
  const buildCancelRef = useRef<(() => void) | null>(null);
  const waterCancelRef = useRef<(() => void) | null>(null);
  const reducedMotion = useRef(false);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('area');
    if (!id || !SECTOR_LABELS[id]) { window.location.replace('/'); return; }
    queueMicrotask(() => {
      setSectorId(id);
      setDraft({ sectorId: id, ...DEFAULTS });
    });
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saved = window.localStorage.getItem('overflow-theme');
    queueMicrotask(() => setTheme(saved === 'dark' || saved === 'light' ? saved : 'light'));
  }, []);

  useEffect(() => {
    if (!sectorId) return;
    const controller = new AbortController();
    queueMicrotask(() => { setLoading(true); setLoadError(''); setTerrain(null); });
    demoApi.terrain(sectorId, controller.signal).then((result) => {
      setTerrain(result); setLoading(false);
    }).catch((error) => {
      if (controller.signal.aborted) return;
      setLoadError(error instanceof Error ? error.message : 'Unable to load the demo scene.');
      setLoading(false);
    });
    return () => controller.abort();
  }, [sectorId, retryToken]);

  useEffect(() => {
    if (!terrain) return;
    if (reducedMotion.current) {
      queueMicrotask(() => setBuildProgress(1));
      return;
    }
    queueMicrotask(() => setBuildProgress(0));
    const cancel = animateValue(setBuildProgress, 3600, false);
    buildCancelRef.current = cancel;
    return () => { cancel(); buildCancelRef.current = null; };
  }, [terrain, buildRun]);
  useEffect(() => {
    if (!flood || !waterRun) return;
    if (reducedMotion.current) {
      queueMicrotask(() => setWaterProgress(1));
      return;
    }
    queueMicrotask(() => setWaterProgress(0));
    const cancel = animateValue(setWaterProgress, Math.min(12000, Math.max(5000, flood.durationMinutes * 55)), false);
    waterCancelRef.current = cancel;
    return () => { cancel(); waterCancelRef.current = null; };
  }, [flood, waterRun]);
  useEffect(() => () => requestRef.current?.abort(), []);
  useEffect(() => {
    if (!sectorId || !terrain) return;
    type ToolInput = { preset: 'moderate' | 'severe' };
    type ModelContext = { registerTool: (tool: object, options?: { signal?: AbortSignal }) => void | Promise<void> };
    const context = (document as Document & { modelContext?: ModelContext }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    void Promise.resolve(context.registerTool({
      name: 'run_evacuation_analysis',
      title: 'Run evacuation analysis',
      description: 'Run a moderate or severe synthetic OverFlow rainfall-runoff scenario and update the visible water-depth timeline and evacuation plan.',
      inputSchema: { type: 'object', properties: { preset: { type: 'string', enum: ['moderate', 'severe'] } }, required: ['preset'], additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      async execute(input: unknown) {
        const preset = (input as ToolInput | null)?.preset;
        if (preset !== 'moderate' && preset !== 'severe') throw new Error('preset must be moderate or severe');
        const values = preset === 'moderate' ? DEFAULTS : SEVERE;
        const scenario: Scenario = { sectorId, ...values, manualClosures: { ...values.manualClosures } };
        const controller = new AbortController();
        requestRef.current?.abort();
        requestRef.current = controller;
        setRunning(true); setRunError(''); setApprovedPlan(null); setResultTab('plan');
        try {
          const [nextFlood, nextPlan, severePlan] = await Promise.all([
            demoApi.simulate(scenario, controller.signal),
            demoApi.analyze(scenario, controller.signal),
            demoApi.analyze({ sectorId, ...SEVERE }, controller.signal),
          ]);
          if (controller.signal.aborted) throw new Error('Analysis was cancelled');
          setDraft(scenario); setFlood(nextFlood); setPlan(nextPlan); setComparison(severePlan); setLastScenario(scenario);
          setPlanNumber((number) => number + 1); setHasChanges(false); setWaterRun((number) => number + 1);
          return { status: nextPlan.unassigned ? 'capacity_gap' : 'feasible', residentsRouted: nextPlan.routed, unassigned: nextPlan.unassigned, estimatedClearanceMinutes: nextPlan.clearanceTime, recommendedRoute: nextPlan.routeName, synthetic: true };
        } finally {
          if (!controller.signal.aborted) setRunning(false);
        }
      },
    }, { signal: lifecycle.signal })).catch(() => undefined);
    return () => lifecycle.abort();
  }, [sectorId, terrain]);

  const updateDraft = useCallback((patch: Partial<Scenario>) => {
    setDraft((current) => ({ ...current, ...patch }));
    setHasChanges(true);
    setApprovedPlan(null);
  }, []);
  const setClosure = (key: ManualClosure, value: boolean) => {
    updateDraft({ manualClosures: { ...draft.manualClosures, [key]: value } });
  };
  const applyPreset = (preset: 'moderate' | 'severe') => {
    const values = preset === 'moderate' ? DEFAULTS : SEVERE;
    updateDraft({ ...values, manualClosures: { ...values.manualClosures } });
    setResultTab('plan');
  };
  const resetScenario = () => {
    requestRef.current?.abort();
    setDraft({ sectorId: sectorId || 'sector-a', ...DEFAULTS, manualClosures: { ...DEFAULTS.manualClosures } });
    setFlood(null); setPlan(null); setComparison(null); setLastScenario(null);
    setRunError(''); setRunning(false); setHasChanges(false); setApprovedPlan(null);
    setWaterProgress(0); setResultTab('plan'); setPlanNumber(0);
  };
  const runSimulation = async () => {
    if (running || !terrain) return;
    const scenario: Scenario = { ...draft, manualClosures: { ...draft.manualClosures } };
    const controller = new AbortController();
    requestRef.current?.abort();
    requestRef.current = controller;
    setRunning(true); setRunError(''); setApprovedPlan(null); setResultTab('plan');
    try {
      const [nextFlood, nextPlan, severePlan] = await Promise.all([
        demoApi.simulate(scenario, controller.signal),
        demoApi.analyze(scenario, controller.signal),
        demoApi.analyze({ sectorId: scenario.sectorId, ...SEVERE }, controller.signal),
      ]);
      if (controller.signal.aborted) return;
      setFlood(nextFlood); setPlan(nextPlan); setComparison(severePlan); setLastScenario(scenario);
      setPlanNumber((number) => number + 1); setHasChanges(false); setWaterRun((number) => number + 1);
    } catch (error) {
      if (controller.signal.aborted) return;
      setRunError(error instanceof Error ? error.message : 'Simulation failed. Try again.');
    } finally {
      if (!controller.signal.aborted) setRunning(false);
    }
  };
  const zoom = (direction: 'in' | 'out') => { setZoomDirection(direction); setZoomToken((value) => value + 1); };
  const toggleTheme = () => setTheme((current) => {
    const next = current === 'light' ? 'dark' : 'light';
    window.localStorage.setItem('overflow-theme', next);
    return next;
  });
  const floodPercent = flood ? Math.round(flood.floodedCells / flood.totalCells * 100) : 0;
  const frameIndex = flood ? Math.min(flood.frames.length - 1, Math.floor(waterProgress * (flood.frames.length - 1))) : 0;
  const currentFrame = flood?.frames[frameIndex];
  const zoneCounts = useMemo(() => {
    if (!lastScenario) return [];
    const first = Math.round(lastScenario.affected * .408), second = Math.round(lastScenario.affected * .362);
    return [first, second, lastScenario.affected - first - second];
  }, [lastScenario]);
  const reportHref = useMemo(() => {
    if (!plan || !flood || !lastScenario) return '';
    const report = {
      title: 'OverFlow synthetic demo plan', generatedAt: new Date().toISOString(), sector: SECTOR_LABELS[lastScenario.sectorId],
      synthetic: true, validated: false, approvedForDemo: approvedPlan === planNumber, scenario: lastScenario,
      flood: { floodedCells: flood.floodedCells, totalCells: flood.totalCells, maxDepthM: flood.maxDepthM,
        visibleDepthM: flood.visibleDepthM, roadClosureDepthM: flood.roadClosureDepthM,
        durationMinutes: flood.durationMinutes, cellSizeM: flood.cellSizeM,
        infiltrationMmHr: flood.infiltrationMmHr, manningN: flood.manningN,
        waterBalanceM3: flood.waterBalanceM3, validated: false },
      plan, disclaimer: plan.disclaimer,
    };
    return 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2));
  }, [plan, flood, lastScenario, approvedPlan, planNumber]);

  return <main className={'defense-workspace ' + theme}>
    <header className="defense-header">
      <div className="defense-brand"><span><strong>OverFlow</strong><small>Planning workspace · synthetic demo</small></span></div>
      <div className="workspace-location"><span className="status-dot-new" /><span><small>STEP 02 / 02 · CONCEPTUAL LAOAG</small><strong>{sectorId ? SECTOR_LABELS[sectorId] : 'Loading selection'}</strong></span></div>
      <div className="header-actions"><span className={'plan-chip ' + (hasChanges ? 'stale' : '')}>{running ? 'Computing…' : hasChanges ? 'Draft changed' : plan ? 'Plan #' + String(planNumber).padStart(2, '0') : 'Ready to simulate'}</span><button className="small-outline" onClick={resetScenario}>Reset</button><button className="icon-action" aria-label="Toggle theme" onClick={toggleTheme}>{theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}</button><Link className="icon-action" aria-label="Back to area selection" href="/"><ArrowLeft size={17} /></Link></div>
    </header>
    <div className="defense-grid">
      <aside className={'settings-panel ' + (buildProgress > .1 ? 'entered' : '')} aria-label="Simulation and scenario settings">
        <div className="panel-title"><span><small>SCENARIO</small><strong>Set conditions</strong></span><SlidersHorizontal size={18} /></div>
        <div className="simulation-controls">
          <div className="control-top"><CloudRain size={19} /><span><strong>Rainfall intensity</strong><small>Uniform synthetic rainfall</small></span><b>{draft.intensityMmHr} mm/h</b></div>
          <input type="range" min="0" max="150" step="5" value={draft.intensityMmHr} disabled={running} aria-label="Rainfall intensity in millimeters per hour" onChange={(event) => updateDraft({ intensityMmHr: Number(event.target.value) })} />
          <div className="range-ends"><span>0 mm/h</span><span>150 mm/h</span></div>
          <div className="duration-row"><span><Clock3 size={17} /><strong>Rainfall duration</strong></span><NumberStepper label="rainfall duration in hours" value={draft.durationHr} min={0} max={12} step={1} disabled={running} onChange={(value) => updateDraft({ durationHr: value })} /></div>
          <div className="duration-row"><span><Users size={17} /><strong>Affected residents</strong></span><NumberStepper label="affected residents" value={draft.affected} min={50} max={650} step={25} disabled={running} onChange={(value) => updateDraft({ affected: value })} /></div>
        </div>
        <div className="section-kicker">MORE CONDITIONS</div>
        <div className="settings-disclosures">
          <Disclosure icon={<Route size={16} />} title="Road constraints" summary={Object.values(draft.manualClosures).filter(Boolean).length + ' manual closures'}>
            {(['bridge', 'riverside', 'market'] as ManualClosure[]).map((key) => <label className="closure-row" key={key}><span><strong>{ROAD_LABELS[key]}</strong><small>Illustrative road segment</small></span><input type="checkbox" aria-label={'Close ' + ROAD_LABELS[key]} checked={draft.manualClosures[key]} disabled={running} onChange={(event) => setClosure(key, event.target.checked)} /></label>)}
          </Disclosure>
          <Disclosure icon={<Ambulance size={16} />} title="Rescue resources" summary={draft.vehicles + ' vehicles available'}>
            <div className="resource-row"><span>Trucks and vans</span><NumberStepper label="available vehicles" value={draft.vehicles} min={1} max={12} step={1} disabled={running} onChange={(value) => updateDraft({ vehicles: value })} /></div>
          </Disclosure>
          <Disclosure icon={<BarChart3 size={16} />} title="Scenario presets" summary="Moderate and severe">
            <div className="preset-buttons"><button disabled={running} onClick={() => applyPreset('moderate')}>Moderate</button><button disabled={running} onClick={() => applyPreset('severe')}>Severe</button></div>
          </Disclosure>
        </div>
        <div className="settings-bottom"><button className="primary-run" disabled={running || !terrain || buildProgress < 1} onClick={runSimulation}>{running ? <RefreshCw className="spin-new" size={18} /> : <Play size={18} />}{running ? 'Computing runoff and depth…' : buildProgress < 1 ? 'Building scene…' : plan ? 'Re-run simulation' : 'Simulate & analyze'}</button><p>20 m synthetic grid · 8 mm/h assumed infiltration · unvalidated depth</p></div>
      </aside>
      <section className="scene-panel" aria-label="Interactive synthetic 3D terrain">
        <div className="scene-toolbar"><div className="scene-context"><Box size={18} /><span><strong>{sectorId ? SECTOR_LABELS[sectorId] : 'Selected area'}</strong><small>Synthetic terrain and scenery · no real land use</small></span></div><div className="view-switch" aria-label="Map perspective"><button aria-pressed={!topDown} className={!topDown ? 'active' : ''} onClick={() => setTopDown(false)}><Box size={14} />3D</button><button aria-pressed={topDown} className={topDown ? 'active' : ''} onClick={() => setTopDown(true)}><Map size={14} />Top down</button></div><button className="layer-toggle" aria-expanded={layerPanelOpen} onClick={() => setLayerPanelOpen(!layerPanelOpen)}><Layers3 size={16} />Layers</button></div>
        <div className="scene-viewport">
          {terrain ? <TerrainScene geometry={terrain.geometry} flood={flood} plan={plan} buildProgress={buildProgress} waterProgress={waterProgress} layers={layers} topDown={topDown} resetToken={cameraReset} zoomToken={zoomToken} zoomDirection={zoomDirection} /> : <div className="scene-placeholder">{loading ? 'Preparing synthetic terrain…' : 'The local scene could not load.'}</div>}
          {loadError && <div className="api-error"><AlertTriangle size={24} /><strong>Local demo API unavailable</strong><p>{loadError}</p><button onClick={() => setRetryToken((value) => value + 1)}>Retry connection</button></div>}
          {terrain && buildProgress < 1 && <div className="build-overlay" aria-live="polite"><div><span>GENERATING SELECTED AREA</span><strong>{buildProgress < .45 ? 'Shaping terrain mesh' : buildProgress < .8 ? 'Placing roads and structures' : 'Adding synthetic scenery'}</strong><div className="build-track"><i style={{ width: Math.round(buildProgress * 100) + '%' }} /></div><small>Visual build sequence · no real land-use data</small></div><button onClick={() => { buildCancelRef.current?.(); setBuildProgress(1); }}>Skip</button></div>}
          {terrain && buildProgress >= 1 && !plan && <div className="scene-callout"><Waves size={19} /><span><strong>Terrain ready</strong><small>Set rainfall, then run the illustrative flood simulation.</small></span></div>}
          {plan && buildProgress >= 1 && <div className={'route-card-new ' + (hasChanges ? 'stale' : '')}><Route size={18} /><span><small>{hasChanges ? 'LAST ANALYZED ROUTE' : 'RECOMMENDED DEMO ROUTE'}</small><strong>{plan.routeName}</strong><em>{plan.routeDetail}</em></span></div>}
          {runError && <div className="run-error"><AlertTriangle size={17} />{runError}<button onClick={runSimulation}>Retry</button></div>}
          {flood && currentFrame && buildProgress >= 1 && <div className="rain-timeline"><div><span><strong>RUNOFF PLAYBACK</strong><small>Simulated time {Math.floor(currentFrame.elapsedMinutes / 60)}h {Math.round(currentFrame.elapsedMinutes % 60)}m / {Math.floor(flood.durationMinutes / 60)}h {Math.round(flood.durationMinutes % 60)}m</small></span><span><strong>{currentFrame.maxDepthM.toFixed(2)} m</strong><small>Current max depth · unvalidated</small></span><button title="Replay rainfall" aria-label="Replay rainfall" onClick={() => setWaterRun((value) => value + 1)}><RotateCcw size={15} /></button></div><input aria-label="Simulated elapsed time" type="range" min="0" max={Math.max(0, flood.frames.length - 1)} step="1" value={frameIndex} disabled={flood.frames.length <= 1} onChange={(event) => { waterCancelRef.current?.(); setWaterProgress(Number(event.target.value) / Math.max(1, flood.frames.length - 1)); }} /><small className="timeline-note">Routes and closures use peak depth across the event.</small></div>}
          {layerPanelOpen && <div className="layers-menu"><strong>Scene layers</strong>{(Object.keys(layers) as (keyof SceneLayers)[]).map((key) => <label key={key}><span>{key === 'water' ? 'Water depth' : key[0].toUpperCase() + key.slice(1)}</span><input type="checkbox" checked={layers[key]} onChange={(event) => setLayers((current) => ({ ...current, [key]: event.target.checked }))} /></label>)}</div>}
          <div className="scene-legend"><span><i className="legend-route" />Route</span><span><i className="legend-water" />Simulated depth</span><span><i className="legend-blocked" />Blocked road</span></div>
          <div className="scene-controls"><span>Drag to orbit · Right-drag to pan · Scroll to zoom</span><button aria-label="Replay terrain build" title="Replay terrain build" onClick={() => setBuildRun((value) => value + 1)}><RotateCcw size={16} /></button><button aria-label="Zoom out" title="Zoom out" onClick={() => zoom('out')}><ZoomOut size={16} /></button><button aria-label="Reset camera" title="Reset camera" onClick={() => setCameraReset((value) => value + 1)}><LocateFixed size={16} /></button><button aria-label="Zoom in" title="Zoom in" onClick={() => zoom('in')}><ZoomIn size={16} /></button></div>
        </div>
      </section>
      <aside className="results-panel-new" aria-label="Analysis results">
        <div className="results-nav"><button aria-pressed={resultTab === 'plan'} className={resultTab === 'plan' ? 'active' : ''} onClick={() => setResultTab('plan')}>Plan</button><button aria-pressed={resultTab === 'compare'} className={resultTab === 'compare' ? 'active' : ''} onClick={() => setResultTab('compare')}>Compare</button></div>
        {!plan ? <div className="results-empty"><BarChart3 size={30} /><h2>Awaiting a scenario</h2><p>Run the simulation to see illustrative evacuation routes, shelter allocations, and comparison metrics.</p><small>All values are synthetic and for demonstration only.</small></div> : resultTab === 'plan' ? <div className="results-scroll">
          <div className={'result-status ' + (hasChanges || plan.unassigned ? 'warning' : '')}><span>{hasChanges ? 'RESULTS OUT OF DATE' : plan.unassigned ? 'ACTION REQUIRED' : approvedPlan === planNumber ? 'DEMO PLAN APPROVED' : 'DEMO PLAN READY'}</span><h2>{hasChanges ? 'Analyze the draft' : plan.unassigned ? plan.unassigned + ' need placement' : approvedPlan === planNumber ? 'Ready for briefing' : 'Routes available'}</h2><p>{hasChanges ? 'Showing the last simulated result.' : plan.unassigned ? 'Reduce demand or change road conditions.' : 'Illustrative allocation and routes shown.'}</p></div>
          <div className="metrics-grid"><div><Users size={17} /><small>Routed</small><strong>{plan.routed}/{lastScenario?.affected}</strong></div><div><Clock3 size={17} /><small>Clearance</small><strong>{plan.clearanceTime} min</strong></div><div><Building2 size={17} /><small>Capacity</small><strong>{plan.capacity ? Math.round(plan.routed / plan.capacity * 100) : 0}%</strong></div><div><Waves size={17} /><small>Wet cells</small><strong>{floodPercent}%</strong></div><div className="metric-wide"><Waves size={17} /><small>Peak simulated depth</small><strong>{flood?.maxDepthM.toFixed(2)} m · unvalidated</strong></div></div>
          <Disclosure icon={<Route size={16} />} title="Evacuation sequence" summary="3 synthetic priority zones">
            {['Demo riverside', 'Demo market', 'Demo west'].map((name, index) => <div className="sequence-row-new" key={name}><b>{index + 1}</b><span><strong>{name}</strong><small>{zoneCounts[index]} people</small></span>{index === 0 && <em>Priority</em>}</div>)}
          </Disclosure>
          <Disclosure icon={<Building2 size={16} />} title="Center allocation" summary={plan.routed + ' people placed'} initial>
            {terrain?.geometry.centers.map((center, index) => { const used = plan.allocations[index], limit = plan.centerLimits[index]; return <div className="center-row-new" key={center.node}><span className={'center-badge-new ' + center.tone}>{center.name.split(' ').map((word) => word[0]).join('')}</span><span><strong>{center.name}</strong><small>{used} assigned · {Math.max(0, limit - used)} open</small><i><b style={{ width: (limit ? Math.round(used / limit * 100) : 0) + '%' }} /></i></span><em>{limit ? Math.round(used / limit * 100) : 0}%</em></div>; })}
          </Disclosure>
          <Disclosure icon={<Ambulance size={16} />} title="Resource plan" summary={lastScenario?.vehicles + ' vehicles available'}>
            {terrain?.geometry.centers.map((center, index) => <div className="resource-result" key={center.node}><span>{center.name}</span><strong>{plan.vehicleAllocations[index]} units</strong></div>)}
          </Disclosure>
          <div className="results-action-row"><button disabled={hasChanges || !!plan.unassigned} onClick={() => setApprovedPlan(planNumber)}><ShieldCheck size={15} />{approvedPlan === planNumber ? 'Approved' : 'Approve demo plan'}</button><a href={reportHref} download={'overflow-demo-plan-' + String(planNumber).padStart(2, '0') + '.json'}><Download size={15} />Report</a></div>
          <p className="results-disclaimer">Plan #{String(planNumber).padStart(2, '0')} · Synthetic demonstration estimate. Not for operational decisions.</p>
        </div> : <div className="results-scroll"><div className="compare-title"><BarChart3 size={22} /><span><h2>Impact comparison</h2><p>Current plan against the severe preset.</p></span></div>{comparison && <div className="comparison-table"><div><span>Measure</span><b>Current</b><b>Severe</b></div><div><span>Rainfall</span><b>{lastScenario?.intensityMmHr} mm/h</b><b>{SEVERE.intensityMmHr} mm/h</b></div><div><span>Wet cells</span><b>{floodPercent}%</b><b>{Math.round(comparison.floodedCells / comparison.totalCells * 100)}%</b></div><div><span>Peak depth</span><b>{flood?.maxDepthM.toFixed(2)} m</b><b>{comparison.maxDepthM.toFixed(2)} m</b></div><div><span>Clearance</span><b>{plan.clearanceTime} min</b><b>{comparison.clearanceTime} min</b></div><div><span>Unassigned</span><b>{plan.unassigned}</b><b>{comparison.unassigned}</b></div></div>}<p className="compare-note"><AlertTriangle size={16} />Scenario results use synthetic terrain and unvalidated depths.</p><button className="load-severe" onClick={() => applyPreset('severe')}>Load severe preset <ChevronDown size={16} /></button></div>}
      </aside>
    </div>
  </main>;
}
