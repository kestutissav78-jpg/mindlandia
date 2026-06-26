"use client";

type Props = {
  mvpPlan: string;
};

export default function MVPPlanPanel({ mvpPlan }: Props) {
  if (!mvpPlan) return null;

  return (
    <section className="mt-6 rounded-3xl border border-zinc-800 bg-zinc-950/40 p-6">
      <h2 className="text-2xl font-bold">AI MVP Plan</h2>
      <pre className="mt-5 whitespace-pre-wrap rounded-2xl border border-zinc-800 bg-black p-5 text-sm text-zinc-300">
        {mvpPlan}
      </pre>
    </section>
  );
}
