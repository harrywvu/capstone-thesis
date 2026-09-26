'use client';

import { useState, type CSSProperties } from 'react';
import { ArrowRight, Box, MapPinned, Mountain } from 'lucide-react';
import Link from 'next/link';

const sectors = [
  { id: 'sector-a', label: 'Demo sector A', position: 'Northwest selection', color: '#72b8a9' },
  { id: 'sector-b', label: 'Demo sector B', position: 'Central selection', color: '#e4a862' },
  { id: 'sector-c', label: 'Demo sector C', position: 'Southeast selection', color: '#789bd1' },
] as const;

export default function SelectArea() {
  const [selected, setSelected] = useState<(typeof sectors)[number]['id']>('sector-a');
  const current = sectors.find((sector) => sector.id === selected)!;
  return (
    <main className="selection-page">
      <header className="selection-topbar">
        <div className="defense-brand"><span><strong>OverFlow</strong><small>Title-defense demonstration</small></span></div>
        <span className="demo-pill">SYNTHETIC · OFFLINE DEMO</span>
      </header>
      <div className="selection-layout">
        <section className="selection-intro">
          <div className="eyebrow"><MapPinned size={15} /> STEP 01 / 02 · AREA SELECTION</div>
          <h1>Choose an area to explore.</h1>
          <p>Start with a conceptual Laoag City selection, then see how OverFlow could build terrain and explore rainfall scenarios for evacuation planning.</p>
          <div className="selection-note"><Mountain size={19} /><span><strong>Demonstration geography</strong><small>This overview is illustrative and not to scale. All three selections use the same synthetic terrain; no OSM, DEM, or live geographic data is used.</small></span></div>
          <div className="sector-picker" aria-label="Demo sector">
            {sectors.map((sector, index) => (
              <button key={sector.id} type="button" aria-pressed={selected === sector.id} className={'sector-option ' + (selected === sector.id ? 'selected' : '')} onClick={() => setSelected(sector.id)}>
                <span className="sector-number">0{index + 1}</span><span className="sector-text"><strong>{sector.label}</strong><small>{sector.position}</small></span><span className="sector-radio" />
              </button>
            ))}
          </div>
          <Link className="selection-continue" href={'/workspace?area=' + selected}><span><strong>Build selected area</strong><small>{current.label} · synthetic terrain preview</small></span><ArrowRight size={22} /></Link>
        </section>
        <section className="selection-map-panel" aria-label="Conceptual Laoag area overview">
          <div className="map-panel-heading"><span><Box size={16} /> CONCEPTUAL LAOAG OVERVIEW</span><span>NOT TO SCALE</span></div>
          <div className="concept-map">
            <svg viewBox="0 0 800 680" aria-label="Stylized conceptual area diagram with three demo sectors">
              <defs><pattern id="minor-grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="#d6e4de" strokeWidth="1" /></pattern><filter id="sector-shadow" x="-25%" y="-25%" width="150%" height="150%"><feDropShadow dx="0" dy="12" stdDeviation="12" floodColor="#315d64" floodOpacity=".17" /></filter></defs>
              <rect width="800" height="680" fill="#e9f1ea" /><rect width="800" height="680" fill="url(#minor-grid)" />
              <path d="M-40 465 C110 420 135 485 260 440 S440 310 560 340 S690 260 830 290" fill="none" stroke="#a1d4d5" strokeWidth="80" opacity=".5" />
              <path d="M-40 465 C110 420 135 485 260 440 S440 310 560 340 S690 260 830 290" fill="none" stroke="#6eb9c4" strokeWidth="31" />
              <path d="M65 110 L710 545 M110 582 L685 88 M18 295 L755 393 M330 40 L400 646" fill="none" stroke="#faf9f0" strokeWidth="19" strokeLinecap="round" />
              <path d="M65 110 L710 545 M110 582 L685 88 M18 295 L755 393 M330 40 L400 646" fill="none" stroke="#a2afa4" strokeWidth="4" strokeDasharray="12 12" strokeLinecap="round" />
              {[
                ['M46 152 L210 74 L316 144 L312 285 L183 336 L62 278Z', 0],
                ['M290 266 L456 189 L605 266 L580 418 L412 470 L276 388Z', 1],
                ['M480 430 L633 382 L766 452 L709 615 L566 621 L453 548Z', 2],
              ].map(([shape, index]) => {
                const sector = sectors[Number(index)];
                return <path key={sector.id} d={String(shape)} className={'sector-polygon ' + (selected === sector.id ? 'active' : '')} style={{ '--sector-color': sector.color } as CSSProperties} onClick={() => setSelected(sector.id)} />;
              })}
              <g className="sector-marker" transform="translate(180 206)"><circle r="25" /><text y="6">A</text></g><g className="sector-marker" transform="translate(439 333)"><circle r="25" /><text y="6">B</text></g><g className="sector-marker" transform="translate(606 518)"><circle r="25" /><text y="6">C</text></g>
              <text x="88" y="57" className="concept-label">CONCEPTUAL CITY VIEW</text><text x="613" y="58" className="north-label">N ↑</text>
            </svg>
            <div className="map-float-card"><span>SELECTED AREA</span><strong>{current.label}</strong><small>One bounded synthetic terrain scene.</small></div>
          </div>
          <div className="selection-map-footer"><span><i /> Selected preset</span><span>Actual geographic bounds require verified data.</span></div>
        </section>
      </div>
    </main>
  );
}
