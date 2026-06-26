"use client";

import { TaskItem } from "@/types/mindlandia";

type Props = {
  nextTask: TaskItem | undefined;
  topRisk: string;
  tasks: TaskItem[];
  progress: number;
};

export default function ExecutiveBrief({ nextTask, topRisk, tasks, progress }: Props) {
  return (
    <section className="mt-8 gradient-border rounded-2xl glow-green p-6"
      style={{ background: "rgba(52,211,153,0.03)" }}>
      <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-emerald-400">Executive Brief</p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Next Action",
            value: nextTask ? nextTask.title : "Start a council session",
            accent: false,
          },
          {
            label: "Top Risk",
            value: topRisk.slice(0, 120) || "Run your first council to identify risks",
            accent: false,
          },
          {
            label: "Milestone",
            value: tasks.length > 0 ? "Complete high priority tasks" : "Create first council plan",
            accent: false,
          },
          {
            label: "Progress",
            value: `${progress}%`,
            accent: true,
          },
        ].map((s) => (
          <div key={s.label} className="card-stat p-5">
            <p className="text-xs text-zinc-600 font-medium">{s.label}</p>
            <p className={`mt-2.5 font-bold leading-snug ${s.accent ? "text-3xl text-gradient-green" : "text-sm text-zinc-200"}`}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* progress bar */}
      {progress > 0 && (
        <div className="mt-5">
          <div className="h-1 w-full rounded-full bg-zinc-900">
            <div
              className="h-1 rounded-full transition-all duration-700"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #34d399, #06b6d4)",
              }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
