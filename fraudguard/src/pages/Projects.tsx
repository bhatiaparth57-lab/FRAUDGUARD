import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, ChevronRight, Download, Filter, X } from 'lucide-react';
import Topbar from '@/components/Topbar';
import RiskBadge from '@/components/ui/RiskBadge';
import { PROJECTS, sp, Risk, VerifyStatus, PROJECTS as P } from '@/lib/data';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/Toast';

const STATES = [...new Set(PROJECTS.map((p) => p.state))];
const TYPES = [...new Set(PROJECTS.map((p) => p.type))];
const RISKS: ('ALL' | Risk)[] = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
const VERIFY: ('ALL' | VerifyStatus)[] = ['ALL', 'Verified', 'Pending', 'Field Visit', 'Failed'];

export default function Projects() {
  const [q, setQ] = useState('');
  const [state, setState] = useState('ALL');
  const [type, setType] = useState('ALL');
  const [risk, setRisk] = useState<('ALL' | Risk)>('ALL');
  const [verify, setVerify] = useState<('ALL' | VerifyStatus)>('ALL');

  const rows = useMemo(() => {
    return PROJECTS.filter((p) => {
      if (q && !(`${p.id} ${p.name} ${p.vendor} ${p.district}`.toLowerCase().includes(q.toLowerCase()))) return false;
      if (state !== 'ALL' && p.state !== state) return false;
      if (type !== 'ALL' && p.type !== type) return false;
      if (risk !== 'ALL' && p.risk !== risk) return false;
      if (verify !== 'ALL' && p.verify !== verify) return false;
      return true;
    }).sort((a, b) => b.riskScore - a.riskScore);
  }, [q, state, type, risk, verify]);

  return (
    <div className="p-5">
      <Topbar title="Project Intelligence" subtitle="Searchable register of all MPLADS projects under monitoring" />
      <div className="mb-4 rounded-xl border border-[#f0b64b]/30 bg-[#f0b64b]/[0.06] px-3.5 py-2 text-[11.5px] text-[#f0b64b]">
        DEMO ENVIRONMENT — Synthetic Data
      </div>

      <div className="card">
        <div className="flex flex-wrap items-center gap-2 border-b border-edge p-4">
          <div className="relative min-w-[220px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search project ID, name, vendor, district…"
              className="w-full rounded-xl border border-edge bg-white/[0.02] py-2.5 pl-9 pr-3 text-sm text-ink placeholder:text-faint focus:border-brand/50 focus:outline-none"
            />
          </div>
          <button onClick={() => toast('Project register exported (demo)')} className="btn-subtle !py-2 text-[12px]">
            <Download className="h-3.5 w-3.5" /> Export
          </button>
          <button className="btn-ghost !py-2 text-[12px]"><SlidersHorizontal className="h-3.5 w-3.5" /> Columns</button>
        </div>

        {/* filters */}
        <div className="flex flex-wrap items-center gap-2 border-b border-edge px-4 py-3">
          <Filter className="h-3.5 w-3.5 text-faint" />
          {[
            ['State', state, setState, STATES],
            ['Type', type, setType, TYPES],
            ['Risk', risk, setRisk, RISKS],
            ['Verification', verify, setVerify, VERIFY],
          ].map(([label, val, set, opts]: any) => (
            <select
              key={label}
              value={val}
              onChange={(e) => set(e.target.value)}
              className="rounded-lg border border-edge bg-surface px-2.5 py-1.5 text-[12px] text-mute focus:border-brand/50 focus:outline-none"
            >
              <option value="ALL">All {label}</option>
              {opts.map((o: string) => <option key={o} value={o}>{o}</option>)}
            </select>
          ))}
          {(state !== 'ALL' || type !== 'ALL' || risk !== 'ALL' || verify !== 'ALL' || q) && (
            <button
              onClick={() => { setState('ALL'); setType('ALL'); setRisk('ALL'); setVerify('ALL'); setQ(''); }}
              className="ml-auto flex items-center gap-1 text-[11px] text-faint hover:text-ink"
            >
              <X className="h-3 w-3" /> Clear
            </button>
          )}
          <span className="ml-auto num text-[11px] text-faint">{rows.length} projects</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left">
            <thead>
              <tr className="border-b border-edge text-[10px] uppercase tracking-wider text-faint">
                {['Project ID', 'Project Name', 'Location', 'Allocated', 'Spent', 'Vendor', 'Risk Score', 'AI Finding', 'Verification', ''].map((h) => (
                  <th key={h} className="px-4 py-2.5 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-edge">
              {rows.map((p) => (
                <Link key={p.id} to={`/projects/${p.id}`} className="group block">
                  <tr className="transition hover:bg-white/[0.03]">
                    <td className="num px-4 py-3 text-[12px] font-bold text-brand">{p.id}</td>
                    <td className="px-4 py-3">
                      <div className="text-[12.5px] font-semibold text-ink">{p.name}</div>
                      <div className="mt-0.5 text-[11px] text-faint">{p.type}</div>
                    </td>
                    <td className="px-4 py-3 text-[11.5px] text-mute">{p.district}<br /><span className="text-faint">{p.state}</span></td>
                    <td className="num px-4 py-3 text-[12px] text-ink">{sp(p.allocated)}</td>
                    <td className="num px-4 py-3 text-[12px] font-semibold" style={{ color: p.spent > p.allocated ? '#ff8a3d' : '#e6edf7' }}>{sp(p.spent)}</td>
                    <td className="px-4 py-3 text-[11.5px] text-mute">{p.vendor}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-14 overflow-hidden rounded-full bg-white/[0.05]">
                          <div className="h-full rounded-full" style={{ width: `${p.riskScore}%`, background: rcol(p.risk) }} />
                        </div>
                        <span className="num text-[12px] font-bold text-ink">{p.riskScore}</span>
                      </div>
                      <RiskBadge level={p.risk} className="mt-1" />
                    </td>
                    <td className="px-4 py-3 text-[11.5px] text-mute">{p.finding}</td>
                    <td className="px-4 py-3">
                      <VerifyPill v={p.verify} />
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('inline-flex items-center gap-1 rounded-lg border border-[#ff5860]/30 bg-[#ff5860]/10 px-2 py-1 text-[10.5px] font-bold uppercase text-[#ff5860]', p.risk === 'CRITICAL' ? '' : 'opacity-0 group-hover:opacity-100')}>
                        Investigate <ChevronRight className="h-3 w-3" />
                      </span>
                    </td>
                  </tr>
                </Link>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-edge px-4 py-3 text-[11px] text-faint">
          <span>Showing {rows.length} of {PROJECTS.length} (demo sample)</span>
          <span className="num">Page 1 of 1</span>
        </div>
      </div>
    </div>
  );
}

function VerifyPill({ v }: { v: VerifyStatus }) {
  const map: Record<VerifyStatus, string> = {
    Verified: 'border-[#48d29b]/30 bg-[#48d29b]/10 text-[#48d29b]',
    Pending: 'border-[#f0b64b]/30 bg-[#f0b64b]/10 text-[#f0b64b]',
    'Field Visit': 'border-brand/30 bg-brand/10 text-brand',
    Failed: 'border-[#ff5860]/30 bg-[#ff5860]/10 text-[#ff5860]',
  };
  return <span className={cn('rounded-md border px-2 py-0.5 text-[10px] font-semibold', map[v])}>{v}</span>;
}

const rcol = (r: Risk) => (r === 'CRITICAL' ? '#ff5860' : r === 'HIGH' ? '#ff8a3d' : r === 'MEDIUM' ? '#f0b64b' : '#48d29b');
