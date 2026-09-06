import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderKanban, IndianRupee, BellRing, TriangleAlert, TrendingUp,
  Copy, TrendingUp as TrendUp, Network, Clock, MapPin, BrainCircuit,
  ChevronRight, Search, ArrowDownRight, ScanLine, Layers, Sparkles,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Topbar from '@/components/Topbar';
import KpiCard from '@/components/ui/KpiCard';
import RiskBadge from '@/components/ui/RiskBadge';
import AnimatedNumber from '@/components/ui/AnimatedNumber';
import { PROJECTS, RISK_DIST, DETECTION, LAYERS, sp } from '@/lib/data';
import { cn } from '@/lib/utils';

export default function CommandCenter() {
  const kpis = useMemo(
    () => [
      { label: 'Total Projects', value: 12482, icon: FolderKanban, delta: 6.2, accent: '#2f6bff', spark: [2,3,3,4,4,5,6,6,5], status: 'Monitored' },
      { label: 'Funds Monitored', value: 1284, format: (n:number)=>`₹${n.toFixed(0)} Cr`, icon: IndianRupee, delta: 4.1, accent: '#48d29b', spark: [3,4,5,5,6,7,7,8,9], status: 'In-flow' },
      { label: 'AI Alerts', value: 327, icon: BellRing, delta: 12.4, accent: '#f0b64b', spark: [2,2,3,4,5,4,6,7,8], status: 'Active' },
      { label: 'High-Risk Projects', value: 84, icon: TriangleAlert, delta: 8.7, accent: '#ff8a3d', spark: [4,5,5,6,7,8,9,9,10], status: 'Watch' },
      { label: 'Potential Exposure', value: 18.6, format: (n:number)=>`₹${n.toFixed(1)} Cr`, icon: TrendingUp, delta: -3.2, accent: '#ff5860', spark: [9,8,8,7,7,6,6,5,5], status: 'High' },
    ],
    [],
  );

  return (
    <div className="p-5">
      <Topbar
        title="MPLADS INTELLIGENCE COMMAND CENTER"
        subtitle="Real-time AI monitoring of project expenditure, vendors and physical assets"
      />

      {/* Demo banner */}
      <div className="mb-5 flex items-center gap-2 rounded-xl border border-[#f0b64b]/30 bg-[#f0b64b]/[0.06] px-3.5 py-2 text-[11.5px] text-[#f0b64b]">
        <Sparkles className="h-3.5 w-3.5" />
        DEMO ENVIRONMENT — Synthetic Data · Real-time AI surveillance simulation
        <span className="ml-auto hidden font-semibold sm:inline">SIH 2026 · Problem SIH26102</span>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {kpis.map((k, i) => (
          <KpiCard key={k.label} {...k} index={i} />
        ))}
      </div>

      {/* Risk overview + ai detection */}
      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="card p-5 lg:col-span-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-ink">MPLADS Risk Distribution</h3>
              <p className="mt-0.5 text-[11px] text-mute">Across 12,482 projects · full portfolio</p>
            </div>
            <span className="chip">This cycle</span>
          </div>
          <div className="mt-2 flex flex-col items-center gap-4 md:flex-row">
            <div className="relative h-[210px] w-[210px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={RISK_DIST} dataKey="value" nameKey="name" innerRadius={62} outerRadius={92} paddingAngle={3} stroke="none" cornerRadius={5}>
                    {RISK_DIST.map((d) => (
                      <Cell key={d.name} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#0c1220', border: '1px solid rgba(148,163,184,.15)', borderRadius: 10, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="num text-3xl font-extrabold text-ink">12,482</span>
                <span className="text-[10px] uppercase tracking-widest text-faint">Projects</span>
              </div>
            </div>
            <div className="w-full flex-1 space-y-2">
              {RISK_DIST.map((d) => (
                <div key={d.name} className="flex items-center gap-3 rounded-lg border border-edge bg-white/[0.02] px-3 py-2.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
                  <span className="w-16 text-[12px] font-semibold text-mute">{d.name}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.04]">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${d.value}%`, background: d.color }} />
                  </div>
                  <span className="num w-10 text-right text-[12px] font-bold text-ink">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-ink">AI Detection Summary</h3>
              <p className="mt-0.5 text-[11px] text-mute">Active anomalies by category</p>
            </div>
            <BrainCircuit className="h-4 w-4 text-brand" />
          </div>
          <div className="mt-3 space-y-2">
            {DETECTION.map((d, i) => (
              <Link
                key={d.label}
                to={d.label === 'Asset Verification' ? '/map' : '/projects'}
                className="group flex items-center gap-3 rounded-xl border border-edge bg-white/[0.02] px-3 py-2.5 transition-all hover:border-edge2 hover:bg-white/[0.04]"
              >
                <span className={cn('flex h-8 w-8 items-center justify-center rounded-lg', RISK_BG_SOFT[d.risk])}>
                  {d.icon === 'copy' && <Copy className="h-4 w-4" />}
                  {d.icon === 'trend' && <TrendUp className="h-4 w-4" />}
                  {d.icon === 'network' && <Network className="h-4 w-4" />}
                  {d.icon === 'clock' && <Clock className="h-4 w-4" />}
                  {d.icon === 'pin' && <MapPin className="h-4 w-4" />}
                </span>
                <div className="flex-1">
                  <div className="text-[12.5px] font-semibold text-ink">{d.label}</div>
                  <div className="text-[10px] text-faint">click to review</div>
                </div>
                <div className="text-right">
                  <div className="num text-[15px] font-bold text-ink">{d.alerts}</div>
                  <div className="text-[10px] text-faint">alerts</div>
                </div>
                <ChevronRight className="h-4 w-4 text-faint opacity-0 transition group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 5-layer verification engine */}
      <div className="mt-5">
        <div className="mb-3 flex items-center gap-2">
          <Layers className="h-4 w-4 text-brand" />
          <h3 className="text-sm font-bold text-ink">5-LAYER AI VERIFICATION ENGINE</h3>
          <span className="chip ml-auto hidden sm:inline-flex">Explaining every risk signal</span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {LAYERS.map((l, i) => (
            <Link to="/ai" key={l.id} className="card card-hover group relative overflow-hidden p-4">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent" />
              <div className="flex items-center justify-between">
                <span className="num text-[10px] font-bold tracking-widest text-faint">{l.id}</span>
                <StatusPill status={l.status} />
              </div>
              <div className="mt-3 flex items-center gap-2">
                <Layers className="h-3.5 w-3.5 text-brand" />
                <span className="text-[12.5px] font-bold text-ink">{l.title}</span>
              </div>
              <p className="mt-1.5 line-clamp-2 text-[11px] text-mute">{l.desc}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {l.detect.slice(0, 2).map((dd) => (
                  <span key={dd} className="chip !py-0.5 text-[10px]">{dd}</span>
                ))}
              </div>
              <div className="mt-4 border-t border-edge pt-3 text-[10px] text-faint">
                <div className="flex justify-between">
                  <span>Confidence</span>
                  <span className="num text-[#48d29b]">{l.confidence}%</span>
                </div>
                <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/[0.05]">
                  <div className="h-full rounded-full bg-[#48d29b]" style={{ width: `${l.confidence}%` }} />
                </div>
              </div>
              {/* scanning animation */}
              {l.status === 'Analyzing' && (
                <div className="pointer-events-none absolute inset-x-0 top-0 h-[40%] overflow-hidden">
                  <div className="scan absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-brand/50 to-transparent" />
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Top risk projects */}
      <div className="mt-5 card">
        <div className="flex flex-wrap items-center gap-3 border-b border-edge p-4">
          <div>
            <h3 className="text-sm font-bold text-ink">High-Risk Projects — Action Queue</h3>
            <p className="mt-0.5 text-[11px] text-mute">Prioritised by AI risk score</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-lg border border-edge bg-white/[0.02] px-2.5 py-1.5 md:flex">
              <Search className="h-3.5 w-3.5 text-faint" />
              <span className="text-[11px] text-faint">Search projects…</span>
            </div>
            <Link to="/projects" className="btn-subtle !py-1.5 text-[11px]">All projects</Link>
          </div>
        </div>
        <div className="divide-y divide-edge">
          {[...PROJECTS].sort((a, b) => b.riskScore - a.riskScore).slice(0, 5).map((p) => (
            <Link key={p.id} to={`/projects/${p.id}`} className="flex items-center gap-3 px-4 py-3 transition hover:bg-white/[0.03]">
              <div className="hidden h-9 w-9 items-center justify-center rounded-lg bg-white/[0.03] text-faint sm:flex">
                <TriangleAlert className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="num text-[12px] font-bold text-ink">{p.id}</span>
                  <RiskBadge level={p.risk} />
                </div>
                <div className="mt-0.5 truncate text-[12px] text-mute">{p.name} · {p.state} · {p.vendor}</div>
              </div>
              <div className="hidden text-right md:block">
                <div className="text-[11px] text-faint">Alloc / Spent</div>
                <div className="num text-[12px] font-semibold text-ink">{sp(p.allocated)} / {sp(p.spent)}</div>
              </div>
              <div className="w-24 text-right">
                <div className="label !text-[9px]">Risk</div>
                <div className="num text-[15px] font-extrabold" style={{ color: riskColor(p.risk) }}>{p.riskScore}<span className="text-[10px] text-faint">/100</span></div>
              </div>
              <ChevronRight className="h-4 w-4 text-faint" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    'Analyzing': 'text-brand border-brand/30 bg-brand/10',
    'Risk detected': 'text-[#ff5860] border-[#ff5860]/30 bg-[#ff5860]/10',
    'Monitoring': 'text-[#48d29b] border-[#48d29b]/30 bg-[#48d29b]/10',
  };
  return (
    <span className={cn('rounded-md border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide', map[status])}>
      {status}
    </span>
  );
}

const RISK_BG_SOFT: Record<string, string> = {
  CRITICAL: 'bg-[#ff5860]/12 text-[#ff5860]',
  HIGH: 'bg-[#ff8a3d]/12 text-[#ff8a3d]',
  MEDIUM: 'bg-[#f0b64b]/12 text-[#f0b64b]',
  LOW: 'bg-[#48d29b]/12 text-[#48d29b]',
};

const riskColor = (r: string) => (r === 'CRITICAL' ? '#ff5860' : r === 'HIGH' ? '#ff8a3d' : r === 'MEDIUM' ? '#f0b64b' : '#48d29b');
