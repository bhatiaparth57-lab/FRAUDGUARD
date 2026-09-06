import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, User, ArrowRight, Cpu, SearchCheck, Shield } from 'lucide-react';

export default function Login({ onLogin, booted }: { onLogin: () => void; booted: boolean }) {
  const [officer, setOfficer] = useState('');
  const [pass, setPass] = useState('');
  const [checking, setChecking] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setChecking(true);
    setTimeout(() => {
      onLogin();
    }, 1400);
  };

  return (
    <motion.div
      className="relative flex min-h-screen w-full items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="absolute inset-0 grid place-items-center opacity-[0.05]">
        <div className="h-[480px] w-[480px] rounded-full border border-brand blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: booted ? 0 : 0.2, duration: 0.6, ease: 'easeOut' }}
        className="relative w-full max-w-[400px] rounded-3xl border border-edge2 bg-panel/80 p-8 shadow-soft backdrop-blur-xl"
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/15 ring-1 ring-brand/40">
            <ShieldCheck className="h-8 w-8 text-brand" />
            <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-[#48d29b] ring-2 ring-panel" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-[0.14em] text-ink">FRAUDGUARD</h1>
          <p className="mt-1.5 text-[13px] font-medium text-mute">AI-Powered MPLADS Verification</p>
          <p className="mt-3 max-w-[260px] text-[12px] italic leading-relaxed text-faint">
            "Protecting Public Funds Through Intelligent Verification"
          </p>
        </div>

        <form onSubmit={submit} className="space-y-3.5">
          <div>
            <label className="label mb-1.5 block">Officer ID</label>
            <div className="flex items-center gap-2.5 rounded-xl border border-edge bg-white/[0.02] px-3.5 py-3 transition focus-within:border-brand/50">
              <User className="h-4 w-4 text-faint" />
              <input
                value={officer}
                onChange={(e) => setOfficer(e.target.value)}
                placeholder="e.g. MPLAD-2026-AS"
                className="w-full bg-transparent text-sm text-ink placeholder:text-faint focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="label mb-1.5 block">Password</label>
            <div className="flex items-center gap-2.5 rounded-xl border border-edge bg-white/[0.02] px-3.5 py-3 transition focus-within:border-brand/50">
              <Lock className="h-4 w-4 text-faint" />
              <input
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent text-sm text-ink placeholder:text-faint focus:outline-none"
              />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full py-3.5 text-sm">
            {checking ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Authenticating…
              </span>
            ) : (
              <>
                Enter Command Center <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-7 grid grid-cols-3 gap-2 border-t border-edge pt-5 text-center">
          {([
            ['AI Engine', 'Operational', Cpu],
            ['Verification', 'Online', SearchCheck],
            ['Environment', 'Secure', Shield],
          ] as [string, string, React.ComponentType<{ className?: string }>][]).map(([a, b, Icon]) => (
            <div key={a} className="flex flex-col items-center gap-1.5">
              <Icon className="h-4 w-4 text-[#48d29b]" />
              <span className="text-[10px] font-semibold text-ink">{a}</span>
              <span className="text-[9px] text-faint">{b}</span>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-[10px] font-medium uppercase tracking-wider text-faint">
          DEMO ENVIRONMENT · Synthetic Data · SIH2026 · SIH26102
        </p>
      </motion.div>
    </motion.div>
  );
}
