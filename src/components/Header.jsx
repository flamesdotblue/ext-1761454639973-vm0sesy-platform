import { Lock, RefreshCw } from "lucide-react";

export default function Header({ onReset }) {
  return (
    <header className="mb-6 md:mb-10">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-rose-500/20 to-fuchsia-500/20 border border-fuchsia-500/30">
            <Lock className="w-6 h-6 text-fuchsia-300" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Escape Rig: Puzzle Breakout</h1>
            <p className="text-slate-400 text-sm md:text-base">A tasteful, abstract escape challenge with locks, knots, and timing. No explicit content.</p>
          </div>
        </div>
        <button onClick={onReset} className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 hover:bg-slate-800 transition-colors">
          <RefreshCw className="w-4 h-4" />
          <span>Reset</span>
        </button>
      </div>
    </header>
  );
}
