import { useMemo, useRef, useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Filter, X, ChevronRight, Satellite, LocateFixed } from 'lucide-react';
import Topbar from '@/components/Topbar';
import RiskBadge from '@/components/ui/RiskBadge';
import { PROJECTS, COORDS, HOTSPOTS, STATE_HIGHLIGHT, sp, Risk } from '@/lib/data';
import { cn } from '@/lib/utils';

const GEO_URL = '/geo/india.topo.json';
const riskCol = (r: Risk) => (r === 'CRITICAL' ? '#ff5860' : r === 'HIGH' ? '#ff8a3d' : r === 'MEDIUM' ? '#f0b64b' : '#48d29b');

export default function MapIntelligence() {
  const [selected, setSelected] = useState<string | null>(null);
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const pouch = useRef<HTMLDivElement>(null);

  const markers = useMemo(() => {
    return PROJECTS.filter((p) => {
      if (riskFilter !== 'ALL' && p.risk !== riskFilter) return false;
      if (typeFilter !== 'ALL' && p.type !== typeFilter) return false;
      return true;
    });
  }, [riskFilter, typeFilter]);

  const selectedProj = PROJECTS.find((p) => p.id === selected) ?? null;
  const types = [...new Set(PROJECTS.map((p) => p.type))];

  return (
    <div className="p-5">
      <Topbar title="Geographic Intelligence" subtitle="Satellite + GPS + geo-tagged asset verification across India" />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <div className="card relative overflow-hidden lg:col-span-3" style={{ height: 'calc(100vh - 150px)', minHeight: 560 }}>
          <div className="absolute right-3 top-3 z-10 flex items-center gap-2">
            <span className="chip !py-0.5">Risk</span>
            <span className="chip !py-0.5">Type</span>
            <span className="chip !py-0.5">Vendor</span>
            <span className="chip !py-0.5">Amount</span>
            <span className="chip !py-0.5">Verification</span>
          </div>

          <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-1.5">
            <select value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)} className="rounded-lg border border-edge bg-surface px-2 py-1 text-[11px] text-mute focus:outline-none">
              <option value="ALL">All Risk</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="rounded-lg border border-edge bg-surface px-2 py-1 text-[11px] text-mute focus:outline-none">
              <option value="ALL">All Types</option>
              {types.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            {(riskFilter !== 'ALL' || typeFilter !== 'ALL') && (
              <button onClick={() => { setRiskFilter('ALL'); setTypeFilter('ALL'); }} className="flex items-center gap-1 rounded-lg border border-edge bg-surface px-2 py-1 text-[11px] text-faint hover:text-ink">
                <X className="h-3 w-3" /> Clear
              </button>
            )}
          </div>

          <ComposableMap projection="geoMercator" projectionConfig={{ scale: 950, center: [81, 24] }} style={{ width: '100%', height: '100%' }} className="bg-transparent">
            <ZoomableGroup center={[81, 24]} zoom={1.05}>
              <Geographies geography={GEO_URL}>
                {({ geographies }: { geographies: any[] }) =>
                  geographies
                    .filter((g) => (g.properties.name ?? '') !== '')
                    .map((geo: any, idx: number) => {
                      const name = geo.properties.name as string;
                      const base = STATE_HIGHLIGHT[name] || '#141d31';
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={base}
                          stroke="#0a1020"
                          strokeWidth={0.8}
                          style={{
                            default: { outline: 'none', transition: 'fill .3s' },
                            hover: { fill: (STATE_HIGHLIGHT[name] ? lighten(base, 12) : name ? lighten('#141d31', 10) : '#141d31'), outline: 'none', cursor: 'default' },
                          }}
                        />
                      );
                    })
                }
              </Geographies>
              {markers.map((p) => {
                const [lon, lat] = COORDS[p.id];
                return (
                  <Marker key={p.id} coordinates={[lon, lat]}>
                    <g
                      onClick={(e) => { e.stopPropagation(); setSelected(p.id); }}
                      className="cursor-pointer"
                      style={{ pointerEvents: 'all' }}
                    >
                      <circle r={11} fill={riskCol(p.risk)} opacity={0.18} className="animate-pulse" />
                      <circle r={4.5} fill={riskCol(p.risk)} stroke="#0a1020" strokeWidth={1.5} />
                    </g>
                  </Marker>
                );
              })}
            </ZoomableGroup>
          </ComposableMap>

          {/* popup */}
          <AnimatePresence>
            {selectedProj && (
              <motion.div
                initial={{ opacity: 0, y: 14, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 14, scale: 0.98 }}
                className="glass absolute bottom-3 left-3 z-20 w-[300px] rounded-2xl border border-edge2 p-4 shadow-soft"
              >
                <div className="flex items-center justify-between">
                  <span className="num text-[11px] font-bold text-brand">{selectedProj.id}</span>
                  <button onClick={() => setSelected(null)} className="text-faint hover:text-ink"><X className="h-3.5 w-3.5" /></button>
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-danger" />
                  <span className="text-[13px] font-bold text-ink">{selectedProj.district}</span>
                  <RiskBadge level={selectedProj.risk} />
                </div>
                <div className="mt-1 text-[13px] font-semibold text-ink">{selectedProj.name}</div>
                <div className="mt-2 space-y-1 text-[11.5px] text-mute">
                  <div className="flex justify-between"><span>Amount</span><span className="num font-semibold text-ink">{sp(selectedProj.spent)}</span></div>
                  <div className="flex justify-between"><span>Vendor</span><span>{selectedProj.vendor}</span></div>
                  <div className="flex justify-between"><span>Risk Score</span><span className="num font-bold" style={{ color: riskCol(selectedProj.risk) }}>{selectedProj.riskScore}/100</span></div>
                </div>
                <div className="mt-2.5 flex items-start gap-1.5 rounded-lg border border-danger/25 bg-danger/[0.06] px-2.5 py-2 text-[11px] text-danger">
                  <LocateFixed className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  Finding: {selectedProj.finding}
                </div>
                <Link to={`/projects/${selectedProj.id}`} className="btn-primary mt-3 w-full !py-2 text-[11.5px]">Open Investigation <ChevronRight className="h-3.5 w-3.5" /></Link>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 rounded-xl border border-edge bg-surface/80 px-3 py-1.5 text-[10px] text-faint backdrop-blur">
            <Satellite className="h-3.5 w-3.5 text-brand" /> Satellite base layer · 2.1 km GPS confidence
          </div>
        </div>

        {/* side panel */}
        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-brand" />
              <h3 className="text-sm font-bold text-ink">Risk Hotspots</h3>
            </div>
            <div className="mt-3 space-y-2">
              {HOTSPOTS.map((h) => (
                <div key={h.state} className="flex items-center gap-3 rounded-xl border border-edge bg-white/[0.02] px-3 py-2.5">
                  <span className={cn('h-2 w-2 rounded-full', h.count >= 30 ? 'bg-[#ff5860]' : h.count >= 20 ? 'bg-[#ff8a3d]' : 'bg-[#f0b64b]')} />
                  <span className="flex-1 text-[12px] font-semibold text-ink">{h.state}</span>
                  <div className="text-right">
                    <span className="num text-[14px] font-bold text-ink">{h.count}</span>
                    <div className="text-[9px] text-faint">cases</div>
                  </div>
                  <span className="num text-[11px] text-mute">₹{h.exposure}Cr</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="text-sm font-bold text-ink">Visible Markers</h3>
            <p className="num mt-0.5 text-[11px] text-mute">{markers.length} of {PROJECTS.length}</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {([
                ['Critical', '#ff5860'], ['High', '#ff8a3d'], ['Medium', '#f0b64b'], ['Low', '#48d29b'],
              ] as const).map(([k, c]) => (
                <div key={k} className="flex items-center gap-2 text-[11px] text-mute">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: c }} /> {k}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function lighten(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, (n >> 16) + amt);
  const g = Math.min(255, ((n >> 8) & 0xff) + amt);
  const b = Math.min(255, (n & 0xff) + amt);
  return `rgb(${r},${g},${b})`;
}
