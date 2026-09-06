import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign, FileText, Building2, MapPin, Clock, ChevronRight, ScanLine,
  ShieldCheck, AlertTriangle, FileSearch, ArrowRight, Play,
} from 'lucide-react';
import Topbar from '@/components/Topbar';
import RiskBadge from '@/components/ui/RiskBadge';
import { LAYERS, DETECTION, PROJECTS, sp } from '@/lib/data';
import { toast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

const layerIcon = ['DollarSign', 'FileText', 'Building2', 'MapPin', 'Clock'];

export default function AIDetection() {
  const [active, setActive] = useState(0);
  const [scanning, setScanning] = useState(false);

  const runScan = () => {
    setScanning(true);
    setTimeout(() => { setScanning(false); toast('5-layer scan complete — 327 alerts found', 'success'); }, 2600);
  };

  return (
    <div className="p-5">
      <Topbar title="AI Fraud Detection" subtitle="5-Layer AI Verification Engine — Explainable & auditable" />

      <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-[#f0b64b]/30 bg-[#f0b64b]/[0.06] px-3.5 py-2 text-[11.5px] text-[#f0b64b]">
        DEMO ENVIRONMENT — Synthetic Data · <span className="font-semibold">Run the full pipeline for the guided demo</span>
        <button onClick={runScan} className="btn-primary ml-auto !py-1.5 !px-3 text-[11px]">
          {scanning ? <><span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Scanning…</> : <><Play className="h-3 w-3" /> Run 5-Layer Scan</>}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        {/* layers */}
        <div className="lg:col-span-3 space-y-3">
          {LAYERS.map((l, i) => {
            return (
              <div
                key={l.id}
                onClick={() => setActive(i)}
                className={cn(
                  'group relative cursor-pointer rounded-2xl border p-4 transition-all duration-300',
                  active === i ? 'border-brand/40 bg-panel shadow-glow' : 'border-edge bg-white/[0.02] hover:bg-white/[0.04]',
                )}
              >
                {scanning && <div className="pointer-events-none absolute inset-x-0 top-0 h-[40%] overflow-hidden rounded-t-2xl"><div className="scan absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-brand/50 to-transparent" /></div>}
                <div className="flex items-start gap-3">
                  <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', active === i ? 'bg-brand/15 text-brand' : 'bg-white/[0.03] text-faint')}>
                    {layerIcon[i] === 'DollarSign' && <DollarSign className="h-5 w-5" />}
                    {layerIcon[i] === 'FileText' && <FileText className="h-5 w-5" />}
                    {layerIcon[i] === 'Building2' && <Building2 className="h-5 w-5" />}
                    {layerIcon[i] === 'MapPin' && <MapPin className="h-5 w-5" />}
                    {layerIcon[i] === 'Clock' && <Clock className="h-5 w-5" />}
                  </span>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="num text-[11px] font-bold text-faint">{l.id}</span>
                      <h3 className="text-[14px] font-bold text-ink">{l.title}</h3>
                      <StatusPill status={l.status} />
                    </div>
                    <p className="mt-1 text-[12px] text-mute">{l.desc}</p>
                    <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                      {l.detect.map((d) => <span key={d} className="chip !py-0.5 text-[10px]">{d}</span>)}
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-faint">
                      <span>Records analyzed: <b className="num text-ink">{l.signal.analyzed.toLocaleString('en-IN')}</b></span>
                      <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3 text-[#ff8a3d]" /> Risk: <b className="num text-[#ff8a3d]">{l.signal.risk}</b></span>
                      <span className="flex items-center gap-1"><FileSearch className="h-3 w-3 text-brand" /> Evidence: <b className="num text-ink">{l.signal.evidence}</b></span>
                    </div>
                  </div>
                  <ChevronRight className={cn('mt-5 h-4 w-4 shrink-0 transition', active === i ? 'text-brand' : 'text-faint')} />
                </div>
              </div>
            );
          })}
        </div>

        {/* detail panel */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-5">
            <span className="label">Detection Categories</span>
            <div className="mt-3 space-y-2">
              {DETECTION.map((d) => (
                <button key={d.label} onClick={() => toast('Opening ' + d.label + ' review (demo)', 'info')} className="flex w-full items-center gap-3 rounded-xl border border-edge bg-white/[0.02] px-3 py-2.5 text-left transition hover:bg-white/[0.04]">
                  <RiskBadge level={d.risk} />
                  <span className="text-[12.5px] font-semibold text-ink">{d.label}</span>
                  <span className="num ml-auto text-[14px] font-bold text-ink">{d.alerts}</span>
                  <ChevronRight className="h-4 w-4 text-faint" />
                </button>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <span className="label">How the engine explains a score</span>
            <ol className="mt-3 space-y-2.5">
              {['Analyze records across 5 layers', 'Detect independent risk signals', 'Weight & cross-correlate signals', 'Produce level + confidence + evidence'].map((s, i) => (
                <li key={s} className="flex items-center gap-3 text-[12.5px] text-mute">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/12 text-[11px] font-bold text-brand">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
            <div className="mt-4 rounded-xl border border-edge bg-white/[0.02] p-3 text-[11.5px] text-mute">
              <ScanLine className="mb-1.5 h-4 w-4 text-brand" />
              Every finding ships with the <b className="text-ink">evidence</b> and <b className="text-ink">confidence</b> that produced it — no black box.
              <Link to="/projects/MP-DEL-2026-0142" className="mt-2 flex items-center gap-1 text-[11.5px] font-semibold text-brand hover:underline">
                Try it on MP-DEL-2026-0142 <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
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
  return <span className={cn('rounded-md border px-1.5 py-0.5 text-[9px] font-bold uppercase', map[status])}>{status}</span>;
}
