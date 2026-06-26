"use client";

import Link from "next/link";

type Props = {
  projectName: string;
  showAdvanced: boolean;
  onToggleAdvanced: () => void;
};

export default function ProjectHeader({ projectName, showAdvanced, onToggleAdvanced }: Props) {
  return (
    <div className="flex items-start justify-between gap-4 pb-8 border-b border-zinc-900">
      <div>
        <div className="flex items-center gap-2 text-sm text-zinc-600">
          <Link href="/" className="hover:text-zinc-400 transition-colors">Projects</Link>
          <span>/</span>
          <span className="text-emerald-400 font-medium">{projectName}</span>
        </div>
        <h1 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
          {projectName}
          <span className="ml-3 text-xl font-normal text-zinc-600">MVP</span>
        </h1>
        <p className="mt-2 text-zinc-500 text-sm">AI-powered project council for smarter decisions.</p>
      </div>

      <button
        onClick={onToggleAdvanced}
        className="shrink-0 btn-ghost rounded-xl px-4 py-2.5 text-sm font-semibold text-zinc-400"
      >
        {showAdvanced ? "Hide Advanced" : "Advanced"}
      </button>
    </div>
  );
}
