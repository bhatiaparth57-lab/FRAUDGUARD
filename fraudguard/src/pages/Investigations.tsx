import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, BrainCircuit, FileText, User, Truck, Check, ChevronDown,
  UserRound, MapPinned, Upload, MessageSquare, FileBarChart, FolderX, Link2, Gavel,
} from 'lucide-react';
import Topbar from '@/components/Topbar';
import RiskBadge from '@/components/ui/RiskBadge';
import { CASE_TIMELINE } from '@/lib/data';
import { toast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

const ACTIONS = [
  { label: 'Assign Officer', icon: UserRound, color: 'text-brand' },
  { label: 'Request Field Verification', icon: MapPinned, color: 'text-[#f0b64b]' },
  { label: 'Upload Evidence', icon: Upload, color: 'text-[#48d29b]' },
  { label: 'Add Comment', icon: MessageSquare, color: 'text-mute' },
  { label: 'Generate Report', icon: FileBarChart, color: 'text-[#ff8a3d]' },
  { label: 'Close Case', icon: FolderX, color: 'text-danger' },
];

const timelineIcon = [Bell, BrainCircuit, FileText, User, Truck, Check];

export default function Investigations() {
  const [timeline, setTimeline] = useState(CASE_TIMELINE);
  const [panel, setPanel] = useState<string | null>(null);

  const act = (label: string) => {
    if (label === 'Close Case') {
      toast('Case on-hold — pending field verification (demo)', 'warn');
    } else if (label === 'Generate Report') {
      toast('AI investigation report drafted (demo)', 'success');
    } else {
      toast(`${label} — action queued (demo)`, 'info');
    }
  };

  return (
    <div className="p-5">
      <Topbar title="Investigation Case Management" subtitle="Turn AI alerts into auditable, actionable cases" />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* case header */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-5">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-danger/12 text-danger"><Gavel className="h-6 w-6" /></div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-[16px] font-extrabold tracking-tight text-ink">CASE #FG-2026-00421</h2>
                  <RiskBadge level="CRITICAL" />
                </div>
                <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[12px] text-mute">
                  <span>Project: <b className="text-ink">MP-DEL-2026-0142</b></span>
                  <span className="text-faint">·</span>
                  <span>Status: <b className="text-[#f0b64b]">Under Investigation</b></span>
                  <span className="text-faint">·</span>
                  <span>Assigned Officer: <b className="text-ink">A. Sharma</b></span>
                </div>
              </div>
            </div>

            {/* action buttons */}
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {ACTIONS.map((a) => (
                <button key={a.label} onClick={() => act(a.label)} className="btn-subtle !justify-start !px-3 !py-2.5 text-[11.5px]">
                  <a.icon className={cn('h-4 w-4', a.color)} /> {a.label}
                </button>
              ))}
            </div>
          </div>

          {/* timeline */}
          <div className="card p-5">
            <h3 className="text-sm font-bold text-ink">Case Timeline</h3>
            <p className="mt-0.5 text-[11px] text-mute">Live status of the investigation workflow</p>
            <div className="mt-4 flex flex-col gap-0">
              {timeline.map((t, i) => {
                const Icon = timelineIcon[i];
                const isLast = i === timeline.length - 1;
                return (
                  <div key={t.label} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={cn('flex h-8 w-8 items-center justify-center rounded-full border', t.done ? 'border-[#48d29b]/40 bg-[#48d29b]/12 text-[#48d29b]' : 'border-edge bg-white/[0.02] text-faint')}>
                        <Icon className="h-4 w-4" />
                      </div>
                      {!isLast && <div className={cn('w-px flex-1', t.done ? 'bg-[#48d29b]/30' : 'bg-edge')} style={{ minHeight: 24 }} />}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between">
                        <span className={cn('text-[13px] font-semibold', t.done ? 'text-ink' : 'text-faint')}>{t.label}</span>
                        <span className={cn('text-[10px]', t.done ? 'text-[#48d29b]' : 'text-faint')}>{t.time}</span>
                      </div>
                      {!t.done && (
                        <button onClick={() => toast('Advancing workflow step (demo)', 'info')} className="chip mt-1.5 !border-brand/40 text-brand">Advance step</button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* right panel */}
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="text-sm font-bold text-ink">Case Priority</h3>
            <div className="mt-3 space-y-2">
              {[
                ['Severity', 'CRITICAL'], ['Risk Score', '92/100'],
                ['AI Confidence', '94%'], ['Linked Alerts', '3'],
                ['Vendors Involved', '2'], ['Potential Exposure', '₹2,20,000'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between rounded-lg border border-edge bg-white/[0.02] px-3 py-2 text-[12px]">
                  <span className="text-mute">{k}</span>
                  <span className={cn('num font-bold', k === 'Severity' ? 'text-danger' : 'text-ink')}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="text-sm font-bold text-ink">Evidence Ledger</h3>
            <div className="mt-3 space-y-2">
              {[
                ['Invoice INV-8841', 'PDF · 1.2 MB', 'added'],
                ['Geo-tagged photos (3)', 'JPG · 14 files', 'added'],
                ['GPS coordinate log', 'JSON · 4 KB', 'added'],
                ['Cost comparison matrix', 'XLSX · 88 KB', 'linked'],
              ].map(([name, meta]) => (
                <button key={name} onClick={() => setPanel(name)} className="flex w-full items-start gap-2 rounded-lg border border-edge bg-white/[0.02] px-3 py-2 text-left transition hover:bg-white/[0.04]">
                  <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
                  <div className="flex-1">
                    <div className="text-[11.5px] font-semibold text-ink">{name}</div>
                    <div className="text-[10px] text-faint">{meta}</div>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-faint" />
                </button>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="text-sm font-bold text-ink">Notes</h3>
            <div className="mt-2 space-y-2">
              <div className="rounded-lg border border-edge bg-white/[0.02] p-3 text-[11.5px] text-mute">
                <div className="flex items-center gap-1.5 text-[10px] text-faint"><User className="h-3 w-3" /> A. Sharma · 10:12</div>
                Requested supporting completion certificate & joint measurement book.
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-edge bg-white/[0.02] px-3 py-2">
              <input placeholder="Add a comment…" className="w-full bg-transparent text-[12px] text-ink placeholder:text-faint focus:outline-none" />
              <button onClick={() => toast('Comment posted (demo)', 'success')} className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand text-white"><Link2 className="h-3.5 w-3.5" /></button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {panel && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[105] grid place-items-center bg-black/60 backdrop-blur-sm" onClick={() => setPanel(null)}>
            <motion.div initial={{ scale: 0.96, y: 10 }} animate={{ scale: 1, y: 0 }} className="w-[320px] rounded-2xl border border-edge2 bg-panel p-5 shadow-soft" onClick={(e) => e.stopPropagation()}>
              <h4 className="text-sm font-bold text-ink">{panel}</h4>
              <p className="mt-2 text-[12px] text-mute">Document preview panel (prototype). This file has been hash-chained to the investigation ledger for audit integrity.</p>
              <button onClick={() => { setPanel(null); toast('Evidence released for review (demo)', 'success'); }} className="btn-primary mt-4 w-full !py-2 text-[12px]">Close</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
