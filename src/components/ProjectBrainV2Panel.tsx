"use client";

import { useState } from "react";
import { ProjectBrainV2 } from "@/types/mindlandia";

type Section = keyof ProjectBrainV2;

const SECTIONS: { key: Section; label: string; color: string }[] = [
  { key: "goals", label: "🎯 Goals", color: "border-emerald-900" },
  { key: "decisions", label: "✅ Decisions", color: "border-cyan-900" },
  { key: "constraints", label: "⛔ Constraints", color: "border-red-900" },
  { key: "risks", label: "⚠️ Risks", color: "border-yellow-900" },
  { key: "features", label: "🧩 Features", color: "border-indigo-900" },
  { key: "techArchitecture", label: "⚙️ Tech Architecture", color: "border-violet-900" },
  { key: "marketResearch", label: "📊 Market Research", color: "border-pink-900" },
];

type Props = {
  brain: ProjectBrainV2;
  isUpdating: boolean;
  onUpdate: () => void;
  onBrainChange: (brain: ProjectBrainV2) => void;
  hasDecision: boolean;
};

export default function ProjectBrainV2Panel({ brain, isUpdating, onUpdate, onBrainChange, hasDecision }: Props) {
  const [editingKey, setEditingKey] = useState<Section | null>(null);
  const [editValue, setEditValue] = useState("");

  const totalItems = Object.values(brain).flat().length;

  function startEdit(key: Section) {
    setEditingKey(key);
    setEditValue(brain[key].join("\n"));
  }

  function saveEdit(key: Section) {
    const items = editValue.split("\n").map((s) => s.trim()).filter(Boolean);
    onBrainChange({ ...brain, [key]: items });
    setEditingKey(null);
  }

  return (
    <section className="mt-6 rounded-3xl border border-zinc-800 bg-zinc-950/40 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Project Brain</h2>
          <p className="mt-1 text-sm text-zinc-500">
            {totalItems} insights · Goals · Decisions · Constraints · Risks · Features · Tech · Market
          </p>
        </div>

        {hasDecision && (
          <button
            onClick={onUpdate}
            disabled={isUpdating}
            className="rounded-2xl bg-emerald-400 px-6 py-3 font-bold text-black hover:bg-emerald-300 disabled:opacity-50"
          >
            {isUpdating ? "Updating..." : "Update Brain"}
          </button>
        )}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {SECTIONS.map(({ key, label, color }) => (
          <div key={key} className={`rounded-2xl border ${color} bg-black p-4`}>
            <div className="flex items-center justify-between">
              <p className="font-bold text-sm">{label}</p>
              <button
                onClick={() => editingKey === key ? saveEdit(key) : startEdit(key)}
                className="text-xs text-zinc-500 hover:text-white"
              >
                {editingKey === key ? "Save" : "Edit"}
              </button>
            </div>

            {editingKey === key ? (
              <textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="mt-3 w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-xs text-zinc-200 outline-none"
                rows={5}
                placeholder="One item per line..."
                autoFocus
              />
            ) : brain[key].length === 0 ? (
              <p className="mt-3 text-xs text-zinc-600">No data yet. Click Update Brain after a council.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {brain[key].map((item, i) => (
                  <li key={i} className="text-xs text-zinc-300">• {item}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
