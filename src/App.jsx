import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import StatusBar from "./components/StatusBar";
import PuzzleCanvas from "./components/PuzzleCanvas";
import PuzzleDeck from "./components/PuzzleDeck";

export default function App() {
  const TOTAL_STAGES = 3;
  const [stage, setStage] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (complete) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [complete]);

  const progress = useMemo(() => (complete ? 1 : stage / TOTAL_STAGES), [stage, complete]);

  const handleAttempt = () => setAttempts((a) => a + 1);

  const handleStageComplete = () => {
    if (stage + 1 >= TOTAL_STAGES) {
      setComplete(true);
    } else {
      setStage((s) => s + 1);
    }
  };

  const resetGame = () => {
    setStage(0);
    setAttempts(0);
    setSeconds(0);
    setComplete(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-inter">
      <div className="max-w-5xl mx-auto px-4 py-6 md:py-10">
        <Header onReset={resetGame} />

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-start">
          <div className="order-2 md:order-1">
            <PuzzleCanvas stage={stage} totalStages={TOTAL_STAGES} complete={complete} />
          </div>

          <div className="order-1 md:order-2 space-y-4">
            <StatusBar stage={stage} totalStages={TOTAL_STAGES} attempts={attempts} seconds={seconds} progress={progress} complete={complete} />
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 md:p-6 shadow-lg shadow-black/30">
              <PuzzleDeck key={`${stage}-${complete}`} stage={stage} onAttempt={handleAttempt} onStageComplete={handleStageComplete} disabled={complete} />
            </div>
          </div>
        </div>

        {complete && (
          <div className="mt-8 rounded-2xl border border-emerald-500/40 bg-emerald-600/10 p-6 text-emerald-300">
            <p className="text-lg md:text-xl font-semibold">Escape successful!</p>
            <p className="text-emerald-200/80">Time: {formatTime(seconds)} · Attempts: {attempts}</p>
            <button onClick={resetGame} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-500 text-emerald-950 px-4 py-2 hover:bg-emerald-400 transition-colors">Play again</button>
          </div>
        )}
      </div>
    </div>
  );
}

function formatTime(total) {
  const m = Math.floor(total / 60).toString().padStart(2, "0");
  const s = (total % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
