"use client";

import { TimelineItem, TaskItem } from "@/types/mindlandia";

type Props = {
  status: string;
  notes: string;
  onStatusChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  onSave: () => void;
  timeline: TimelineItem[];
  selectedCouncil: TimelineItem | null;
  onSelectCouncil: (item: TimelineItem) => void;
  onCloseCouncil: () => void;
  progress: number;
  openTasks: number;
  nextTask: TaskItem | undefined;
  topRisk: string;
};

export default function ProjectBrainPanel({
  status,
  notes,
  onStatusChange,
  onNotesChange,
  onSave,
  timeline,
  selectedCouncil,
  onSelectCouncil,
  onCloseCouncil,
  progress,
  openTasks,
  nextTask,
  topRisk,
}: Props) {
  return (
    <section className="mt-8 space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Executive Dashboard</h2>

        <div className="mt-5 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            <p className="text-sm text-zinc-500">Status</p>
            <p className="mt-2 text-2xl font-black text-emerald-400">{status}</p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            <p className="text-sm text-zinc-500">Progress</p>
            <p className="mt-2 text-2xl font-black text-emerald-400">{progress}%</p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            <p className="text-sm text-zinc-500">Open Tasks</p>
            <p className="mt-2 text-2xl font-black text-emerald-400">{openTasks}</p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            <p className="text-sm text-zinc-500">Councils</p>
            <p className="mt-2 text-2xl font-black text-emerald-400">{timeline.length}</p>
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            <p className="font-bold text-emerald-400">Next Critical Task</p>
            <p className="mt-3 text-zinc-300">
              {nextTask ? nextTask.title : "No open task. Start a council to generate next actions."}
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            <p className="font-bold text-emerald-400">Current Risk Signal</p>
            <p className="mt-3 text-zinc-300">{topRisk.slice(0, 220)}</p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-zinc-800 p-6">
        <h2 className="text-2xl font-bold">Project Status</h2>

        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950 p-3"
        >
          <option>Idea</option>
          <option>Planning</option>
          <option>Building</option>
          <option>Testing</option>
          <option>Live</option>
        </select>

        <textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Project notes..."
          className="mt-4 min-h-32 w-full rounded-2xl border border-zinc-800 bg-zinc-950 p-4"
        />

        <button
          onClick={onSave}
          className="mt-4 rounded-2xl border border-emerald-800 px-6 py-4 font-bold hover:bg-zinc-900"
        >
          Save Project Details
        </button>
      </div>

      <div className="rounded-3xl border border-zinc-800 p-6">
        <h2 className="text-2xl font-bold">Council Timeline</h2>

        {timeline.length === 0 ? (
          <p className="mt-4 text-zinc-500">Council decisions will appear here.</p>
        ) : (
          <div className="mt-6 space-y-4">
            {timeline.map((item, index) => (
              <div key={item.id} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
                <p className="text-sm text-emerald-400">
                  Council #{timeline.length - index} · {item.createdAt}
                </p>
                <p className="mt-2 font-bold">{item.title}</p>
                <p className="mt-3 text-zinc-400">{item.summary}</p>
                <button
                  onClick={() => onSelectCouncil(item)}
                  className="mt-4 rounded-xl border border-zinc-700 px-4 py-2 text-sm font-bold hover:bg-zinc-900"
                >
                  View Full Council
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedCouncil && (
        <div className="rounded-3xl border border-emerald-900 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Full Council Archive</h2>
              <p className="mt-2 text-sm text-emerald-400">
                {selectedCouncil.title} · {selectedCouncil.createdAt}
              </p>
            </div>
            <button
              onClick={onCloseCouncil}
              className="rounded-xl border border-zinc-700 px-4 py-2 text-sm font-bold hover:bg-zinc-900"
            >
              Close
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {(selectedCouncil.messages || []).map((message, index) => (
              <div key={index} className={`rounded-2xl border ${message.border} bg-zinc-950 p-5`}>
                <p className="font-bold">{message.label}</p>
                <p className="mt-3 whitespace-pre-wrap text-zinc-300">{message.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-emerald-900 bg-zinc-950 p-5">
            <p className="font-bold">Council Decision</p>
            <p className="mt-3 whitespace-pre-wrap text-zinc-300">{selectedCouncil.decision}</p>
          </div>
        </div>
      )}
    </section>
  );
}
