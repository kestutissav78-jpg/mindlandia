"use client";

import Link from "next/link";

type Props = {
  projectName: string;
  showAdvanced: boolean;
  onToggleAdvanced: () => void;
};

export default function ProjectHeader({ projectName, showAdvanced, onToggleAdvanced }: Props) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-zinc-900 pb-8">
      <div>
        <Link href="/" className="text-sm text-zinc-500 hover:text-white">
          Projects / <span className="text-emerald-400">{projectName}</span>
        </Link>
        <h1 className="mt-6 text-4xl font-black">{projectName} MVP</h1>
        <p className="mt-2 text-zinc-400">AI-powered project council for smarter decisions.</p>
      </div>

      <button
        onClick={onToggleAdvanced}
        className="rounded-xl border border-zinc-800 px-4 py-3 text-sm font-bold hover:bg-zinc-950"
      >
        {showAdvanced ? "Hide Advanced" : "Advanced"}
      </button>
    </div>
  );
}
