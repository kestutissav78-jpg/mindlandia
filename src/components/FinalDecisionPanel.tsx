"use client";

type Props = {
  decision: string;
  onGenerateTasks: () => void;
  onGenerateRoadmap: () => void;
  onGenerateMvpPlan: () => void;
  onGenerateExecutionPack: () => void;
};

export default function FinalDecisionPanel({
  decision,
  onGenerateTasks,
  onGenerateRoadmap,
  onGenerateMvpPlan,
  onGenerateExecutionPack,
}: Props) {
  if (!decision) return null;

  return (
    <section className="mt-6 rounded-3xl border border-emerald-900 bg-black p-5">
      <p className="text-xs uppercase tracking-[0.3em] text-emerald-400">Final Council Answer</p>

      <p className="mt-4 whitespace-pre-wrap text-zinc-200">{decision}</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={onGenerateTasks}
          className="rounded-xl bg-emerald-400 px-5 py-3 font-bold text-black hover:bg-emerald-300"
        >
          Generate Tasks
        </button>

        <button
          onClick={onGenerateRoadmap}
          className="rounded-xl border border-zinc-700 px-5 py-3 font-bold hover:bg-zinc-900"
        >
          Generate Roadmap
        </button>

        <button
          onClick={onGenerateMvpPlan}
          className="rounded-xl border border-zinc-700 px-5 py-3 font-bold hover:bg-zinc-900"
        >
          Generate MVP Plan
        </button>

        <button
          onClick={onGenerateExecutionPack}
          className="rounded-xl border border-zinc-700 px-5 py-3 font-bold hover:bg-zinc-900"
        >
          Generate Execution Pack
        </button>
      </div>
    </section>
  );
}
