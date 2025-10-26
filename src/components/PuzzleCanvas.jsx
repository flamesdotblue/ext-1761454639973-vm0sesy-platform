import { useMemo } from "react";

export default function PuzzleCanvas({ stage, totalStages, complete }) {
  const progress = useMemo(() => (complete ? 1 : stage / totalStages), [stage, totalStages, complete]);

  const ropeColor = complete ? "#34d399" : "#e879f9";
  const lockColor = complete ? "#34d399" : "#f472b6";

  return (
    <div className="rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-4 md:p-6 shadow-xl shadow-black/30">
      <svg viewBox="0 0 600 460" className="w-full h-[340px] md:h-[420px]">
        <defs>
          <linearGradient id="rope" x1="0" x2="1">
            <stop offset="0%" stopColor={ropeColor} stopOpacity="0.2" />
            <stop offset="100%" stopColor={ropeColor} stopOpacity="0.8" />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Backdrop frame */}
        <rect x="20" y="20" width="560" height="420" rx="24" fill="#0f172a" stroke="#1f2937" />

        {/* Abstract mannequin silhouette (very simple, geometric) */}
        <circle cx="300" cy="120" r="44" fill="#111827" stroke="#1f2937" />
        <rect x="250" y="170" width="100" height="120" rx="18" fill="#111827" stroke="#1f2937" />
        <rect x="230" y="300" width="60" height="100" rx="14" fill="#0b1220" stroke="#1f2937" />
        <rect x="310" y="300" width="60" height="100" rx="14" fill="#0b1220" stroke="#1f2937" />

        {/* Stylized ropes/straps that fade as you progress */}
        {Array.from({ length: 6 }).map((_, i) => {
          const t = i / 5;
          const opacity = 1 - Math.min(progress * 1.2, 1) * (0.2 + t * 0.8);
          return (
            <path key={i} d={`M ${120 + i * 60} 200 C 220 160, 380 240, ${480 - i * 40} 210`} stroke="url(#rope)" strokeOpacity={opacity} strokeWidth="10" fill="none" strokeLinecap="round" />
          );
        })}

        {/* Central lock that opens when complete */}
        <g transform="translate(300,230)">
          {/* Shackle */}
          <path d="M-44,-22 a44,44 0 1,1 88,0 v24 h-16 v-24 a28,28 0 1,0 -56,0 v24 h-16 z" fill="#0b1220" stroke={lockColor} strokeWidth="3" filter="url(#glow)" />
          {/* Body */}
          <rect x="-56" y="2" width="112" height="82" rx="14" fill="#0b1220" stroke={lockColor} strokeWidth="3" />
          {/* Keyhole changes color */}
          <g transform={`rotate(${complete ? -20 : 0})`}>
            <circle cx="0" cy="36" r="10" fill={complete ? "#34d399" : "#f472b6"} />
            <rect x="-4" y="46" width="8" height="18" rx="3" fill={complete ? "#34d399" : "#f472b6"} />
          </g>
        </g>

        {/* Stage labels */}
        <g fontFamily="Inter, system-ui, -apple-system" fontSize="12" fill="#94a3b8">
          <text x="40" y="56">Stage 1: Lockpick</text>
          <text x="40" y="76">Stage 2: Memory Knots</text>
          <text x="40" y="96">Stage 3: Slider Release</text>
        </g>
      </svg>
    </div>
  );
}
