import { Key, Timer, Target } from "lucide-react";

export default function StatusBar({ stage, totalStages, attempts, seconds, progress, complete }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 md:p-5">
      <div className="flex items-center gap-4 justify-between">
        <div className="flex items-center gap-2 text-slate-200">
          <Target className="w-4 h-4 text-fuchsia-300" />
          <span className="font-semibold">Stage</span>
          <span className="tabular-nums text-slate-400">{Math.min(stage + 1, totalStages)}/{totalStages}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-200">
          <Key className="w-4 h-4 text-emerald-300" />
          <span className="font-semibold">Attempts</span>
          <span className="tabular-nums text-slate-400">{attempts}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-200">
          <Timer className="w-4 h-4 text-sky-300" />
          <span className="font-semibold">Time</span>
          <span className="tabular-nums text-slate-400">{formatTime(seconds)}</span>
        </div>
      </div>
      <div className="mt-4 h-2 w-full rounded-full bg-slate-800 overflow-hidden">
        <div className={`h-full ${complete ? "bg-emerald-500" : "bg-fuchsia-500"}`} style={{ width: `${Math.min(progress * 100, 100)}%`, transition: "width 400ms ease" }} />
      </div>
    </div>
  );
}

function formatTime(total) {
  const m = Math.floor(total / 60).toString().padStart(2, "0");
  const s = (total % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
