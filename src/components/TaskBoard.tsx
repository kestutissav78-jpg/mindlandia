"use client";

import { TaskItem } from "@/types/mindlandia";

type Props = {
  tasks: TaskItem[];
  completedTasks: number;
  totalTasks: number;
  onTaskToggle: (id: number) => void;
  onBucketChange: (id: number, bucket: TaskItem["bucket"]) => void;
  onAskCouncil: (taskTitle: string) => void;
};

const bucketMeta = {
  "This Week": { icon: "⚡", color: "text-emerald-400", border: "border-emerald-500/20", dot: "bg-emerald-400" },
  "Next Week": { icon: "📅", color: "text-blue-400",    border: "border-blue-500/20",    dot: "bg-blue-400" },
  "Blocked":   { icon: "⛔", color: "text-red-400",     border: "border-red-500/20",     dot: "bg-red-400" },
} as const;

const priorityStyle: Record<string, string> = {
  High:   "border-red-500/40 text-red-300 bg-red-500/10",
  Medium: "border-yellow-500/40 text-yellow-300 bg-yellow-500/10",
  Low:    "border-zinc-600/40 text-zinc-400 bg-zinc-800/30",
};

export default function TaskBoard({
  tasks, completedTasks, totalTasks, onTaskToggle, onBucketChange, onAskCouncil,
}: Props) {
  if (!tasks.length) return null;

  return (
    <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6">
      {/* header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black tracking-tight">AI Project Manager</h2>
          <p className="mt-0.5 text-xs text-zinc-600">{completedTasks} of {totalTasks} tasks completed</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-24 rounded-full bg-zinc-800">
            <div
              className="h-1.5 rounded-full transition-all duration-500"
              style={{
                width: totalTasks > 0 ? `${(completedTasks / totalTasks) * 100}%` : "0%",
                background: "linear-gradient(90deg, #34d399, #06b6d4)",
              }}
            />
          </div>
          <span className="text-xs font-semibold text-zinc-500">
            {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
          </span>
        </div>
      </div>

      {/* columns */}
      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {(["This Week", "Next Week", "Blocked"] as const).map((bucket) => {
          const meta = bucketMeta[bucket];
          const bucketTasks = tasks.filter((t) => t.bucket === bucket);
          return (
            <div key={bucket} className={`rounded-xl border ${meta.border} bg-black/40 p-4`}>
              <div className="flex items-center gap-2">
                <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                <h3 className={`text-xs font-bold uppercase tracking-wider ${meta.color}`}>{bucket}</h3>
                <span className="ml-auto text-xs text-zinc-600">{bucketTasks.length}</span>
              </div>

              <div className="mt-4 space-y-2.5">
                {bucketTasks.length === 0 ? (
                  <p className="py-4 text-center text-xs text-zinc-700">No tasks</p>
                ) : (
                  bucketTasks.map((task) => (
                    <div key={task.id} className="card rounded-xl p-3.5">
                      <label className="flex cursor-pointer items-start gap-2.5">
                        <div
                          onClick={() => onTaskToggle(task.id)}
                          className={`mt-0.5 flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded border transition-colors ${
                            task.completed
                              ? "border-emerald-500 bg-emerald-500"
                              : "border-zinc-700 hover:border-emerald-500/50"
                          }`}
                        >
                          {task.completed && (
                            <svg className="h-2.5 w-2.5 text-black" viewBox="0 0 10 10" fill="none">
                              <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                        <span className={`text-xs leading-relaxed ${task.completed ? "text-zinc-600 line-through" : "text-zinc-200"}`}>
                          {task.title}
                        </span>
                      </label>

                      <div className="mt-3 flex items-center gap-2">
                        <span className={`tag text-[10px] ${priorityStyle[task.priority] ?? priorityStyle.Low}`}>
                          {task.priority}
                        </span>

                        <select
                          value={task.bucket}
                          onChange={(e) => onBucketChange(task.id, e.target.value as TaskItem["bucket"])}
                          className="ml-auto rounded-lg border border-zinc-800 bg-zinc-950 px-2 py-1 text-[10px] text-zinc-400 outline-none"
                        >
                          <option>This Week</option>
                          <option>Next Week</option>
                          <option>Blocked</option>
                        </select>
                      </div>

                      <button
                        onClick={() => onAskCouncil(task.title)}
                        className="btn-ghost mt-2.5 w-full rounded-lg py-1.5 text-[10px] font-semibold text-zinc-500"
                      >
                        Ask Council →
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
