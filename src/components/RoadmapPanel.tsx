"use client";

type Props = {
  roadmap: { stage: string; goal: string }[];
};

export default function RoadmapPanel({ roadmap }: Props) {
  if (!roadmap.length) return null;

  return (
    <section className="mt-6 rounded-3xl border border-zinc-800 bg-zinc-950/40 p-6">
      <h2 className="text-2xl font-bold">AI Roadmap</h2>

      <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {roadmap.map((item, index) => (
          <div key={`${item.stage}-${index}`} className="rounded-2xl border border-zinc-800 bg-black p-4">
            <p className="text-sm text-emerald-400">Step {index + 1}</p>
            <h3 className="mt-2 font-bold">{item.stage}</h3>
            <p className="mt-2 text-sm text-zinc-400">{item.goal}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
