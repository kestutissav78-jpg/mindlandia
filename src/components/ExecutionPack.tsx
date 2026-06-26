"use client";

type ExecutionPackData = {
  objectives?: string[];
  milestones?: string[];
  deliverables?: string[];
  risks?: string[];
  kpis?: string[];
  budget?: string[];
};

type Props = {
  data: ExecutionPackData | null;
};

function Section({
  title,
  items,
}: {
  title: string;
  items?: string[];
}) {
  if (!items || items.length === 0) return null;

  return (
    <div className="rounded-2xl border border-zinc-800 bg-black p-4">
      <h3 className="font-bold text-emerald-400">{title}</h3>

      <ul className="mt-3 space-y-2 text-sm text-zinc-300">
        {items.map((item, index) => (
          <li key={index}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}

export default function ExecutionPack({ data }: Props) {
  if (!data) return null;

  return (
    <section className="mt-6 rounded-3xl border border-zinc-800 bg-zinc-950/40 p-6">
      <h2 className="text-2xl font-bold">Execution Pack</h2>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Section title="Objectives" items={data.objectives} />
        <Section title="Milestones" items={data.milestones} />
        <Section title="Deliverables" items={data.deliverables} />
        <Section title="Risks" items={data.risks} />
        <Section title="KPIs" items={data.kpis} />
        <Section title="Budget" items={data.budget} />
      </div>
    </section>
  );
}
