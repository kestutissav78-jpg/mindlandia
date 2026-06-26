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

export default function TaskBoard({
  tasks,
  completedTasks,
  totalTasks,
  onTaskToggle,
  onBucketChange,
  onAskCouncil,
}: Props) {
  if (!tasks.length) return null;

  return (
    <section className="mt-6 rounded-3xl border border-zinc-800 bg-zinc-950/40 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">AI Project Manager</h2>
        <span className="text-sm text-zinc-500">
          {completedTasks}/{totalTasks} completed
        </span>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {(["This Week", "Next Week", "Blocked"] as const).map((bucket) => (
          <div key={bucket} className="rounded-2xl border border-zinc-800 bg-black p-4">
            <h3 className="font-bold text-emerald-400">{bucket}</h3>

            <div className="mt-4 space-y-3">
              {tasks.filter((t) => t.bucket === bucket).length === 0 ? (
                <p className="text-sm text-zinc-600">No tasks.</p>
              ) : (
                tasks
                  .filter((t) => t.bucket === bucket)
                  .map((task) => (
                    <div key={task.id} className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
                      <label className="flex items-start gap-3">
                        <input
                          className="mt-1"
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => onTaskToggle(task.id)}
                        />
                        <span
                          className={
                            task.completed
                              ? "text-sm text-zinc-500 line-through"
                              : "text-sm text-zinc-200"
                          }
                        >
                          {task.title}
                        </span>
                      </label>

                      <button
                        onClick={() => onAskCouncil(task.title)}
                        className="mt-3 w-full rounded-lg border border-zinc-700 px-3 py-2 text-xs font-bold hover:bg-zinc-900"
                      >
                        Ask Council
                      </button>

                      <div className="mt-3 flex items-center justify-between">
                        <span className="rounded-full border border-emerald-800 px-3 py-1 text-xs text-emerald-400">
                          {task.priority}
                        </span>

                        <select
                          value={task.bucket}
                          onChange={(e) =>
                            onBucketChange(task.id, e.target.value as TaskItem["bucket"])
                          }
                          className="rounded-lg border border-zinc-800 bg-zinc-950 px-2 py-1 text-xs"
                        >
                          <option>This Week</option>
                          <option>Next Week</option>
                          <option>Blocked</option>
                        </select>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
