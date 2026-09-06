import { Bell, RefreshCw, Radio, UserRound } from 'lucide-react';
import { useApp } from '@/store';
import { cn } from '@/lib/utils';

export default function Topbar({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  const { demoMode, setDemoMode, setAlertsOpen, setChatOpen } = useApp();
  return (
    <header className="sticky top-0 z-40 border-b border-edge bg-surface/70 backdrop-blur-md">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3.5">
        <div className="min-w-0">
          <h1 className="truncate text-base font-extrabold tracking-[0.06em] text-ink md:text-lg">{title}</h1>
          {subtitle && <p className="mt-0.5 truncate text-[12px] text-mute">{subtitle}</p>}
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-2.5">
          {right}

          <div className="hidden items-center gap-2 rounded-xl border border-edge bg-white/[0.02] px-3 py-1.5 text-[11px] text-mute lg:flex">
            <Radio className="h-3.5 w-3.5 text-[#48d29b]" />
            <span className="num">Updated {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div className="hidden items-center gap-1.5 rounded-xl border border-edge bg-white/[0.02] px-3 py-1.5 text-[11px] text-[#48d29b] sm:flex">
            <RefreshCw className="h-3.5 w-3.5 animate-[spin_6s_linear_infinite]" />
            Sync
          </div>

          {/* Demo toggle */}
          <button
            onClick={() => setDemoMode(!demoMode)}
            className={cn(
              'flex items-center gap-2 rounded-xl border px-3 py-1.5 text-[11px] font-semibold transition-all',
              demoMode
                ? 'border-[#f0b64b]/40 bg-[#f0b64b]/10 text-[#f0b64b]'
                : 'border-edge bg-white/[0.02] text-faint',
            )}
            title="Toggle demo mode"
          >
            <span className={cn('relative h-2 w-2 rounded-full', demoMode ? 'bg-[#f0b64b]' : 'bg-mute')}>
              {demoMode && <span className="absolute inset-0 animate-ping rounded-full bg-[#f0b64b] opacity-50" />}
            </span>
            {demoMode ? 'LIVE DEMO' : 'DEMO OFF'}
          </button>

          <button
            onClick={() => setAlertsOpen(true)}
            className="relative rounded-xl border border-edge bg-white/[0.02] p-2 text-mute transition hover:text-ink"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[9px] font-bold text-white">
              5
            </span>
          </button>

          <button
            onClick={() => setChatOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-brand/30 bg-brand/10 px-3 py-1.5 text-[11px] font-semibold text-brand transition hover:bg-brand/15"
          >
            <UserRound className="h-3.5 w-3.5" />
            AI Copilot
          </button>
        </div>
      </div>
    </header>
  );
}
