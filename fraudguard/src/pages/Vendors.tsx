import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Building2, Network, AlertTriangle, Link2, MapPin, ArrowRight, ChevronRight, Users, GitCommit,
} from 'lucide-react';
import Topbar from '@/components/Topbar';
import RiskBadge from '@/components/ui/RiskBadge';
import { VENDORS, sp, Risk } from '@/lib/data';
import { cn } from '@/lib/utils';

const riskCol = (r: Risk) => (r === 'CRITICAL' ? '#ff5860' : r === 'HIGH' ? '#ff8a3d' : r === 'MEDIUM' ? '#f0b64b' : '#48d29b');

export default function Vendors() {
  const [selected, setSelected] = useState(VENDORS[0].name);

  return (
    <div className="p-5">
      <Topbar title="Vendor Intelligence" subtitle="Network analysis of vendors, contracts, districts and payments" />

      <div className="mb-4 rounded-xl border border-[#f0b64b]/30 bg-[#f0b64b]/[0.06] px-3.5 py-2 text-[11.5px] text-[#f0b64b]">
        DEMO ENVIRONMENT — Synthetic Data · Network graph & collusion pattern detection
      </div>

      {/* vendor cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {VENDORS.map((v, i) => (
          <motion.button
            key={v.name}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setSelected(v.name)}
            className={cn(
              'card card-hover p-4 text-left',
              selected === v.name && 'border-brand/40 shadow-glow',
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.03] text-faint">
                <Building2 className="h-[18px] w-[18px]" />
              </div>
              <RiskBadge level={v.risk} />
            </div>
            <div className="mt-3 text-[13.5px] font-bold text-ink">{v.name}</div>
            <div className="mt-0.5 text-[11px] text-faint">PAN {v.pan} · GST {v.gstin}</div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-[11.5px]">
              {[
                ['Projects', v.projects], ['Value', `₹${v.total}Cr`],
                ['Risk', `${v.riskScore}/100`], ['Concentration', `${v.concentration}%`],
                ['Districts', v.districts], ['High-Risk', v.highRisk],
                ['Alerts', v.alerts], ['Est.', v.established],
              ].map(([k, val]) => (
                <div key={k as string} className="rounded-lg border border-edge bg-white/[0.02] px-2 py-1.5">
                  <div className="text-[9px] uppercase tracking-wide text-faint">{k}</div>
                  <div className="num mt-0.5 font-bold text-ink">{val}</div>
                </div>
              ))}
            </div>
          </motion.button>
        ))}
      </div>

      {/* network */}
      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center gap-2">
            <Network className="h-4 w-4 text-brand" />
            <h3 className="text-sm font-bold text-ink">Contract & Payment Network</h3>
          </div>
          <p className="mt-0.5 text-[11px] text-mute">{selected} → Projects → Districts → Payments</p>
          <div className="mt-3 h-[320px]">
            <VendorNetwork vendor={selected} />
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] text-faint">
            {['Vendor', 'Project', 'District', 'Payment'].map((k, i) => (
              <span key={k} className="chip !py-0.5"><span className="num font-bold" style={{ color: ['#2f6bff', '#48d29b', '#f0b64b', '#ff8a3d'][i] }}>{k}</span> column</span>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex items-center gap-2 text-[#ff5860]">
              <AlertTriangle className="h-4 w-4" />
              <h3 className="text-sm font-bold text-ink">Potential Collusion Pattern Detected</h3>
            </div>
            <p className="mt-2 text-[12px] leading-relaxed text-mute">
              Vendor received multiple contracts from related project clusters within unusually short intervals.
              Contract award dates correlate with vendor disbursement cycles, and a shared director links
              <b className="text-ink"> {selected} </b> to another registered vendor.
            </p>
            <div className="mt-3 rounded-xl border border-danger/25 bg-danger/[0.06] p-3 text-[11px] text-mute">
              <div className="mb-1.5 flex items-center gap-1.5 font-semibold text-danger"><Link2 className="h-3.5 w-3.5" /> Indicators</div>
              • Shared director with SKM Contracts<br />
              • Benign beneficiary bank pair<br />
              • 2 contracts awarded within 6 days<br />
              • Address overlap with competitor
            </div>
          </div>

          <div className="card p-5">
            <h3 className="text-sm font-bold text-ink">Relationship Profile</h3>
            <div className="mt-3 space-y-2">
              {[
                ['Projects', '12'], ['Districts', '4'], ['Total Value', '₹8.4 Cr'], ['High-Risk Projects', '7'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between rounded-lg border border-edge bg-white/[0.02] px-3 py-2 text-[12px]">
                  <span className="text-mute">{k}</span>
                  <span className="num font-bold text-ink">{v}</span>
                </div>
              ))}
            </div>
            <Link to="/projects/MP-DEL-2026-0142" className="btn-primary mt-3 w-full !py-2 text-[11.5px]">Open Linked Case <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function VendorNetwork({ vendor }: { vendor: string }) {
  const W = 560;
  const H = 320;
  const cx = 70, cy = H / 2;
  const projects = ['P1 CHC', 'P2 Road', 'P3 Water', 'P4 School'];
  const districts = ['North Delhi', 'Patna', 'Lucknow'];
  const payments = ['₹8.4Cr', '₹5.2Cr', '₹2.1Cr'];

  const pxs: [number, number][] = projects.map((_, i) => [300, 70 + (i * (H - 60)) / (projects.length - 1)]);
  const dxs: [number, number][] = districts.map((_, i) => [430, 70 + (i * (H - 60)) / (districts.length - 1)]);
  const mxs: [number, number][] = payments.map((_, i) => [W - 60, 70 + (i * (H - 60)) / (payments.length - 1)]);

  const paths = (from: [number, number], to: [number, number], col: string, w: number) =>
    `M${from[0]},${from[1]} C${(from[0] + to[0]) / 2},${from[1]} ${(from[0] + to[0]) / 2},${to[1]} ${to[0]},${to[1]}`;

  const danger = vendor === 'ABC Infra Pvt Ltd' || vendor === 'GVK Builders';

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full">
      {/* links project -> district */}
      {pxs.map((px, i) => dxs.map((dx, j) => {
        const w = activeW(i, j, 0.5);
        return <path key={`p${i}d${j}`} d={paths(px, dx, '#333', 1)} stroke="rgba(148,163,184,0.22)" strokeWidth={w} fill="none" />;
      }))}
      {/* links district -> payment */}
      {dxs.map((dx, i) => mxs.map((mx, j) => (
        <path key={`d${i}m${j}`} d={paths(dx, mx, '#333', 1)} stroke="rgba(148,163,184,0.18)" strokeWidth={j === 0 ? 2 : 1} fill="none" />
      )))}

      {/* vendor -> projects */}
      {pxs.map((px, i) => (
        <g key={`v${i}`}>
          <path d={paths([cx, cy], px, '#333', 1)} stroke={danger ? 'rgba(255,88,96,0.5)' : 'rgba(47,107,255,0.5)'} strokeWidth={2.4} fill="none" />
        </g>
      ))}

      {/* vendor node */}
      <g transform={`translate(${cx},${cy})`}>
        <circle r={34} fill="rgba(47,107,255,0.14)" stroke={danger ? '#ff5860' : '#2f6bff'} strokeWidth={1.5} strokeDasharray={danger ? '4 3' : ''} />
        <circle r={34} fill="none" stroke="rgba(47,107,255,0.3)" className="animate-pulse" />
        <text textAnchor="middle" dominantBaseline="middle" className="font-bold" fill="#e6edf7" fontSize="12">{short(vendor)}</text>
      </g>

      {/* project nodes */}
      {pxs.map((p, i) => (
        <g key={`pn${i}`} transform={`translate(${p[0]},${p[1]})`}>
          <circle r={12} fill="rgba(72,210,155,0.16)" stroke="#48d29b" strokeWidth={1.5} />
          <text textAnchor="middle" dominantBaseline="middle" fill="#48d29b" fontSize="9" fontWeight={700}>{i + 1}</text>
        </g>
      ))}
      {dxs.map((dt, i) => (
        <g key={`dn${i}`} transform={`translate(${dt[0]},${dt[1]})`}>
          <rect x={-10} y={-10} width={20} height={20} rx={5} fill="rgba(240,182,75,0.14)" stroke="#f0b64b" strokeWidth={1.5} />
          <text textAnchor="middle" dominantBaseline="middle" fill="#f0b64b" fontSize="9" fontWeight={700}>{i + 1}</text>
        </g>
      ))}
      {mxs.map((m, i) => (
        <g key={`mn${i}`} transform={`translate(${m[0]},${m[1]})`}>
          <rect x={-13} y={-11} width={26} height={22} rx={5} fill="rgba(255,138,61,0.14)" stroke="#ff8a3d" strokeWidth={1.5} />
          <text textAnchor="middle" dominantBaseline="middle" fill="#ff8a3d" fontSize="9" fontWeight={700}>{payments[i]}</text>
        </g>
      ))}

      {/* labels */}
      <text x={cx} y={H - 8} textAnchor="middle" fill="#5b6b83" fontSize="9">VENDOR</text>
      <text x={300} y={H - 8} textAnchor="middle" fill="#5b6b83" fontSize="9">PROJECT</text>
      <text x={430} y={H - 8} textAnchor="middle" fill="#5b6b83" fontSize="9">DISTRICT</text>
      <text x={W - 60} y={H - 8} textAnchor="middle" fill="#5b6b83" fontSize="9">PAYMENT</text>
    </svg>
  );
}

const activeW = (i: number, j: number, base: number) => (i === j ? base * 2.4 : base);

const short = (n: string) => (n.split(' ')[0].length > 7 ? n.split(' ').slice(0, 2).map((w) => w[0]).join('') : n.split(' ')[0]);
