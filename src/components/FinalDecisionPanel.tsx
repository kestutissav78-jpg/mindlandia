"use client";

type Props = {
  decision: string;
  onGenerateTasks: () => void;
  onGenerateRoadmap: () => void;
  onGenerateMvpPlan: () => void;
  onGenerateExecutionPack: () => void;
};

export default function FinalDecisionPanel({
  decision, onGenerateTasks, onGenerateRoadmap, onGenerateMvpPlan, onGenerateExecutionPack,
}: Props) {
  if (!decision) return null;

  return (
    <section className="mt-6 fade-up gradient-border rounded-2xl glow-green overflow-hidden"
      style={{ background: "rgba(52,211,153,0.02)" }}>

      {/* label bar */}
      <div className="flex items-center gap-3 border-b border-zinc-900 px-6 py-4">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-xs text-emerald-400">✓</div>
        <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-emerald-400">Final Council Answer</p>
      </div>

      {/* decision text */}
      <div className="px-6 py-5">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-200">{decision}</p>
      </div>

      {/* actions */}
      <div className="border-t border-zinc-900 px-6 py-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-600 mb-3">Generate</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onGenerateTasks}
            className="btn-primary rounded-xl px-5 py-2.5 text-sm font-bold text-black"
          >
            ⚡ Tasks
          </button>
          <button onClick={onGenerateRoadmap}     className="btn-ghost rounded-xl px-5 py-2.5 text-sm font-semibold text-zinc-300">Roadmap</button>
          <button onClick={onGenerateMvpPlan}     className="btn-ghost rounded-xl px-5 py-2.5 text-sm font-semibold text-zinc-300">MVP Plan</button>
          <button onClick={onGenerateExecutionPack} className="btn-ghost rounded-xl px-5 py-2.5 text-sm font-semibold text-zinc-300">Execution Pack</button>
        </div>
      </div>
    </section>
  );
}
