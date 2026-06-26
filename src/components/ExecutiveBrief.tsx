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
    <section className="mt-8 rounded-3xl border border-emerald-900 bg-gradient-to-r from-emerald-950/30 to-zinc-950 p-6">
      <p className="text-xs uppercase tracking-[0.3em] text-emerald-400">Executive Brief</p>

      <div className="mt-5 grid gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-zinc-800 bg-black p-5">
          <p className="text-sm text-zinc-500">Next Action</p>
          <p className="mt-3 font-bold text-white">
            {nextTask ? nextTask.title : "Start a council to generate the next action."}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-black p-5">
          <p className="text-sm text-zinc-500">Biggest Risk</p>
          <p className="mt-3 line-clamp-3 font-bold text-white">{topRisk.slice(0, 160)}</p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-black p-5">
          <p className="text-sm text-zinc-500">Next Milestone</p>
          <p className="mt-3 font-bold text-white">
            {tasks.length > 0
              ? "Complete this week's high priority tasks"
              : "Create first council plan"}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-black p-5">
          <p className="text-sm text-zinc-500">Progress</p>
          <p className="mt-3 text-3xl font-black text-emerald-400">{progress}%</p>
        </div>
      </div>
    </section>
  );
}
