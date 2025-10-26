import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Hand, MousePointerClick, Target, Zap } from "lucide-react";

export default function PuzzleDeck({ stage, onAttempt, onStageComplete, disabled }) {
  return (
    <div className="space-y-6">
      {stage === 0 && <LockpickGame onAttempt={onAttempt} onComplete={onStageComplete} disabled={disabled} />}
      {stage === 1 && <MemoryKnots onAttempt={onAttempt} onComplete={onStageComplete} disabled={disabled} />}
      {stage === 2 && <SliderRelease onAttempt={onAttempt} onComplete={onStageComplete} disabled={disabled} />}
    </div>
  );
}

function SectionHeader({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-start gap-3">
      <div className="p-2 rounded-lg bg-slate-800 text-fuchsia-300"><Icon className="w-5 h-5" /></div>
      <div>
        <h3 className="text-lg font-bold leading-tight">{title}</h3>
        <p className="text-slate-400 text-sm">{subtitle}</p>
      </div>
    </div>
  );
}

// Stage 1: Lockpick timing (click when the needle aligns)
function LockpickGame({ onAttempt, onComplete, disabled }) {
  const [needle, setNeedle] = useState(0); // 0..360
  const [target, setTarget] = useState(() => Math.floor(Math.random() * 360));
  const [wins, setWins] = useState(0);
  const [running, setRunning] = useState(true);
  const raf = useRef(null);
  const startRef = useRef(performance.now());

  useEffect(() => {
    if (!running) return;
    const loop = (t) => {
      const elapsed = t - startRef.current;
      const speed = 0.12; // degrees per ms (oscillation)
      const angle = (180 + Math.sin(elapsed * 0.004) * 180 + (elapsed * speed) % 360) % 360;
      setNeedle(angle);
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [running]);

  const diff = useMemo(() => {
    const a = Math.abs(needle - target);
    return Math.min(a, 360 - a);
  }, [needle, target]);

  const tolerance = 16; // degrees

  const handleTry = () => {
    if (disabled) return;
    onAttempt();
    if (diff <= tolerance) {
      const w = wins + 1;
      setWins(w);
      setTarget(Math.floor(Math.random() * 360));
      if (w >= 3) {
        onComplete();
      }
    }
  };

  return (
    <div className="space-y-5">
      <SectionHeader icon={Target} title="Lockpick" subtitle="Stop the needle near the sweet spot three times to unlock." />
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-56 h-56 rounded-full bg-slate-950 border border-slate-800 shadow-inner">
          {/* dial marks */}
          {Array.from({ length: 36 }).map((_, i) => (
            <div key={i} className="absolute left-1/2 top-1/2" style={{ transform: `translate(-50%,-50%) rotate(${i * 10}deg)` }}>
              <div className={`h-1 w-6 ${i % 3 === 0 ? "bg-slate-600" : "bg-slate-800"}`} style={{ transform: "translateX(88px)" }} />
            </div>
          ))}
          {/* target arc */}
          <div className="absolute inset-0" style={{ transform: `rotate(${target}deg)` }}>
            <div className="absolute left-1/2 top-1/2" style={{ transform: "translate(-50%,-50%)" }}>
              <div className="h-1 w-24 rounded bg-fuchsia-500/70" style={{ transform: "translateX(48px)" }} />
            </div>
          </div>
          {/* needle */}
          <div className="absolute inset-0" style={{ transform: `rotate(${needle}deg)` }}>
            <div className="absolute left-1/2 top-1/2" style={{ transform: "translate(-50%,-50%)" }}>
              <div className="h-0.5 w-32 bg-emerald-400" style={{ transform: "translateX(32px)" }} />
              <div className="h-3 w-3 rounded-full bg-emerald-400" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleTry} className="inline-flex items-center gap-2 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-500 px-4 py-2 text-white disabled:opacity-50" disabled={disabled}>
            <MousePointerClick className="w-4 h-4" />
            Try
          </button>
          <span className="text-slate-300 text-sm">Hits: <span className="text-emerald-400 font-semibold">{wins}</span>/3</span>
          <span className={`text-xs px-2 py-1 rounded ${diff <= tolerance ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-800 text-slate-300"}`}>Window ±{tolerance}°</span>
        </div>
      </div>
    </div>
  );
}

// Stage 2: Memory sequence of colored knots
function MemoryKnots({ onAttempt, onComplete, disabled }) {
  const COLORS = [
    { id: 0, name: "rose", base: "#fb7185" },
    { id: 1, name: "amber", base: "#f59e0b" },
    { id: 2, name: "emerald", base: "#34d399" },
    { id: 3, name: "sky", base: "#38bdf8" },
  ];
  const [sequence, setSequence] = useState(() => generateSequence(4, COLORS.length));
  const [playback, setPlayback] = useState(true);
  const [active, setActive] = useState(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!playback) return;
    let i = 0;
    setIndex(0);
    const interval = setInterval(() => {
      setActive(sequence[i]);
      setTimeout(() => setActive(null), 300);
      i += 1;
      if (i >= sequence.length) {
        clearInterval(interval);
        setPlayback(false);
      }
    }, 600);
    return () => clearInterval(interval);
  }, [playback, sequence]);

  const press = (id) => {
    if (disabled || playback) return;
    onAttempt();
    if (sequence[index] === id) {
      const next = index + 1;
      setIndex(next);
      if (next >= sequence.length) {
        onComplete();
      }
    } else {
      // reset and replay
      setPlayback(true);
    }
  };

  return (
    <div className="space-y-5">
      <SectionHeader icon={Zap} title="Memory Knots" subtitle="Watch the glowing knots, then repeat the sequence." />
      <div className="grid grid-cols-2 gap-4">
        {COLORS.map((c) => (
          <button key={c.id} onClick={() => press(c.id)} className="relative aspect-square rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden focus:outline-none" disabled={disabled || playback}>
            <svg viewBox="0 0 120 120" className="absolute inset-0 w-full h-full">
              <rect x="0" y="0" width="120" height="120" rx="18" fill="#0b1220" />
              {/* abstract knot: intertwined curves */}
              <path d="M20,60 C20,30 100,30 100,60 S20,90 20,60" fill="none" stroke={c.base} strokeWidth="10" strokeLinecap="round" opacity={active === c.id ? 1 : 0.35} />
              <path d="M20,60 C20,90 100,90 100,60 S20,30 20,60" fill="none" stroke={c.base} strokeWidth="10" strokeLinecap="round" opacity={active === c.id ? 0.8 : 0.25} />
            </svg>
            {active === c.id && <div className="absolute inset-0 rounded-2xl ring-2 ring-offset-2 ring-offset-slate-950" style={{ ringColor: c.base, boxShadow: `0 0 40px ${c.base}55 inset` }} />}
          </button>
        ))}
      </div>
      <div className="text-slate-400 text-sm flex items-center gap-2"><Hand className="w-4 h-4" />{playback ? "Memorize the pattern..." : `Your turn: ${index}/${sequence.length}`}</div>
    </div>
  );
}

function generateSequence(n, k) {
  return Array.from({ length: n }, () => Math.floor(Math.random() * k));
}

// Stage 3: Slider with moving safe window
function SliderRelease({ onAttempt, onComplete, disabled }) {
  const [pos, setPos] = useState(50);
  const [windowCenter, setWindowCenter] = useState(() => 20 + Math.random() * 60);
  const [hits, setHits] = useState(0);
  const width = 12; // +/- range

  // drift the window slowly
  useEffect(() => {
    if (disabled) return;
    const id = setInterval(() => {
      setWindowCenter((c) => {
        let next = c + (Math.random() * 12 - 6);
        if (next < 15) next = 15;
        if (next > 85) next = 85;
        return next;
      });
    }, 900);
    return () => clearInterval(id);
  }, [disabled]);

  const inWindow = Math.abs(pos - windowCenter) <= width;

  const release = () => {
    if (disabled) return;
    onAttempt();
    if (inWindow) {
      const h = hits + 1;
      setHits(h);
      setWindowCenter(20 + Math.random() * 60);
      if (h >= 3) onComplete();
    }
  };

  return (
    <div className="space-y-5">
      <SectionHeader icon={Check} title="Slider Release" subtitle="Stop the slider inside the glowing window three times." />
      <div className="space-y-3">
        <div className="relative h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center px-3">
          {/* window */}
          <div className="absolute left-3 right-3 h-2 rounded bg-slate-800">
            <div className="absolute top-1/2 -translate-y-1/2 h-3 rounded bg-emerald-500/30" style={{ left: `calc(${windowCenter - width}% + 12px)`, width: `${width * 2}%` }} />
            <div className="absolute top-1/2 -translate-y-1/2 h-2 rounded bg-fuchsia-500" style={{ left: `calc(${pos}% + 12px)`, width: "2px" }} />
          </div>
        </div>
        <input type="range" min={0} max={100} value={pos} disabled={disabled} onChange={(e) => setPos(Number(e.target.value))} onMouseUp={release} onTouchEnd={release} className="w-full accent-fuchsia-500" />
        <div className="text-sm text-slate-300 flex items-center gap-2">
          {inWindow ? <span className="text-emerald-400">Aligned! Release now.</span> : <span>Align with the green window.</span>}
        </div>
        <div className="text-slate-400 text-sm">Successes: <span className="text-emerald-400 font-semibold">{hits}</span>/3</div>
      </div>
    </div>
  );
}
