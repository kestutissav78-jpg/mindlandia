"use client";

type Executive = {
  role: string;
  label: string;
  text: string;
};

type Props = {
  executives: Executive[];
  summary: string;
  isLoading: boolean;
  onAsk: () => void;
  hasDecision: boolean;
};

const BORDER: Record<string, string> = {
  cto: "border-cyan-900",
  pm: "border-indigo-900",
  marketing: "border-pink-900",
  investor: "border-yellow-900",
  ux: "border-purple-900",
  qa: "border-orange-900",
};

export default function ExecutiveTeamPanel({ executives, summary, isLoading, onAsk, hasDecision }: Props) {
  if (!hasDecision) return null;

  return (
    <section className="mt-6 rounded-3xl border border-zinc-800 bg-zinc-950/40 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">AI Executive Team</h2>
          <p className="mt-1 text-sm text-zinc-500">CTO · PM · Marketing · Investor · UX · QA</p>
        </div>

        <button
          onClick={onAsk}
          disabled={isLoading}
          className="rounded-2xl border border-zinc-700 px-6 py-3 font-bold hover:bg-zinc-900 disabled:opacity-50"
        >
          {isLoading ? "Team Thinking..." : "Ask Executive Team"}
        </button>
      </div>

      {executives.length > 0 && (
        <>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {executives.map((exec) => (
              <div
                key={exec.role}
                className={`rounded-2xl border ${BORDER[exec.role] ?? "border-zinc-800"} bg-black p-5`}
              >
                <p className="font-bold">{exec.label}</p>
                <p className="mt-3 text-sm text-zinc-300 whitespace-pre-wrap">{exec.text}</p>
              </div>
            ))}
          </div>

          {summary && (
            <div className="mt-6 rounded-2xl border border-emerald-900 bg-black p-5">
              <p className="font-bold text-emerald-400">Executive Summary</p>
              <p className="mt-3 whitespace-pre-wrap text-zinc-200">{summary}</p>
            </div>
          )}
        </>
      )}
    </section>
  );
}
