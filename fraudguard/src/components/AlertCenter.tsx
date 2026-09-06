import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Eye, FolderKanban, ChevronRight } from 'lucide-react';
import { useApp } from '@/store';
import { ALERTS, Risk } from '@/lib/data';
import { toast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

const levelStyle: Record<Risk, { dot: string; text: string }> = {
  CRITICAL: { dot: 'bg-[#ff5860]', text: 'text-[#ff5860]' },
  HIGH: { dot: 'bg-[#ff8a3d]', text: 'text-[#ff8a3d]' },
  MEDIUM: { dot: 'bg-[#f0b64b]', text: 'text-[#f0b64b]' },
  LOW: { dot: 'bg-[#48d29b]', text: 'text-[#48d29b]' },
};

export default function AlertCenter() {
  const { alertsOpen, setAlertsOpen } = useApp();
  const levelIcon = { CRITICAL: '🔴', HIGH: '🟠', MEDIUM: '🟡' };

  return (
    <>
      <AnimatePresence>
        {alertsOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[115] bg-black/50 backdrop-blur-sm" onClick={() => setAlertsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 300, damping: 26 }}
              className="fixed right-5 top-20 z-[116] w-[380px] max-w-[92vw] overflow-hidden rounded-2xl border border-edge2 bg-surface/95 shadow-soft backdrop-blur-xl"
            >
              <div className="flex items-center justify-between border-b border-edge p-4">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-[#f0b64b]" />
                  <span className="text-[13px] font-bold text-ink">Alert Center</span>
                  <span className="chip !py-0.5">{ALERTS.length} active</span>
                </div>
                <button onClick={() => setAlertsOpen(false)} className="rounded-lg p-1 text-faint hover:bg-white/5 hover:text-ink"><X className="h-4 w-4" /></button>
              </div>
              <div className="max-h-[70vh] overflow-y-auto p-3">
                <div className="space-y-2">
                  {ALERTS.map((a) => (
                    <div key={a.id} className="rounded-xl border border-edge bg-white/[0.02] p-3 transition hover:bg-white/[0.04]">
                      <div className="flex items-center gap-2">
                        <span className={cn('h-2 w-2 rounded-full', levelStyle[a.level].dot)} />
                        <span className="text-[10px] font-bold uppercase tracking-wide text-faint">{a.level}</span>
                        <span className="ml-auto text-[10px] text-faint">{a.time}</span>
                      </div>
                      <div className={cn('mt-1.5 text-[12.5px] font-semibold', levelStyle[a.level].text)}>{a.title}</div>
                      <div className="mt-0.5 text-[11.5px] text-mute">{a.detail}</div>
                      {a.project && <div className="mt-1 text-[10.5px] text-faint">Project <span className="num text-brand">{a.project}</span></div>}
                      {a.vendor && <div className="text-[10.5px] text-faint">Vendor: {a.vendor}</div>}
                      <div className="mt-2 flex gap-1.5 border-t border-edge pt-2">
                        <Link to={a.project ? `/projects/${a.project}` : '#'} onClick={() => setAlertsOpen(false)} className="flex items-center gap-1 rounded-lg border border-edge px-2 py-1 text-[10px] font-semibold text-mute transition hover:text-ink"><Eye className="h-3 w-3" /> View Project</Link>
                        <button onClick={() => toast('Opening evidence (demo)', 'info')} className="flex items-center gap-1 rounded-lg border border-edge px-2 py-1 text-[10px] font-semibold text-mute transition hover:text-ink"><Eye className="h-3 w-3" /> Evidence</button>
                        <button onClick={() => { setAlertsOpen(false); toast('Case FG-2026-00421 created (demo)', 'success'); }} className="ml-auto flex items-center gap-1 rounded-lg border border-brand/30 bg-brand/10 px-2 py-1 text-[10px] font-semibold text-brand"><FolderKanban className="h-3 w-3" /> Assign Case</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t border-edge p-3 text-center">
                <Link to="/projects" onClick={() => setAlertsOpen(false)} className="flex items-center justify-center gap-1 text-[11.5px] font-semibold text-brand hover:underline">View all alerts <ChevronRight className="h-3.5 w-3.5" /></Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
