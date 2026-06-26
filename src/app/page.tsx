"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Project = {
  id: number;
  name: string;
  description: string;
};

const defaultProjects: Project[] = [
  { id: 1, name: "MindLandia",  description: "Main AI council platform." },
  { id: 2, name: "MakeupCoach", description: "Personal AI makeup coach app." },
  { id: 3, name: "KostaParts",  description: "Auto parts listing and VIN scan system." },
  { id: 4, name: "PartyDrop",   description: "Party photo and video sharing app." },
];

const agentColors: Record<string, string> = {
  GPT:      "border-violet-500/40 text-violet-300 bg-violet-500/10",
  Claude:   "border-orange-500/40 text-orange-300 bg-orange-500/10",
  Gemini:   "border-blue-500/40 text-blue-300 bg-blue-500/10",
  Decision: "border-emerald-500/40 text-emerald-300 bg-emerald-500/10",
};

export default function Home() {
  const [projects, setProjects] = useState<Project[]>(defaultProjects);

  useEffect(() => {
    const saved = localStorage.getItem("mindlandia-projects");
    if (!saved) return;
    setProjects(JSON.parse(saved)); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  function saveProjects(next: Project[]) {
    setProjects(next);
    localStorage.setItem("mindlandia-projects", JSON.stringify(next));
  }

  function addProject() {
    const name = prompt("Project name:");
    if (!name?.trim()) return;
    saveProjects([{ id: Date.now(), name: name.trim(), description: "New project council." }, ...projects]);
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* ambient top glow */}
      <div className="pointer-events-none fixed inset-x-0 top-0 h-[420px] bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(52,211,153,0.12),transparent)]" />

      <div className="relative mx-auto max-w-7xl px-5 py-8 lg:px-10 lg:py-12">

        {/* ── NAV ── */}
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/icon-192.png" alt="MindLandia" width={36} height={36} className="rounded-xl" />
            <span className="text-lg font-black tracking-tight">
              Mind<span className="text-gradient-green">Landia</span>
              <sup className="ml-0.5 text-xs font-normal text-zinc-500">®</sup>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="tag border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 pulse-dot" />
              Live
            </span>
            <button
              onClick={addProject}
              className="btn-primary ml-2 rounded-xl px-5 py-2.5 text-sm font-bold text-black"
            >
              + New Project
            </button>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section className="mt-14">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-400">
            AI Council Workspace
          </p>
          <h1 className="mt-4 text-5xl font-black leading-[1.05] tracking-tight md:text-7xl">
            <span className="text-gradient">Your projects,</span>
            <br />
            <span className="text-gradient-green">decided by AI.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-zinc-500 leading-relaxed">
            Three AI models debate every decision. One final answer. Built for founders who move fast.
          </p>
        </section>

        {/* ── STATS ── */}
        <section className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { label: "Projects",   value: projects.length, suffix: "" },
            { label: "AI Agents",  value: 4,               suffix: "" },
            { label: "Mode",       value: "MVP",            suffix: "" },
            { label: "Status",     value: "Active",         suffix: "" },
          ].map((s) => (
            <div key={s.label} className="card-stat p-5">
              <p className="text-xs text-zinc-500 font-medium">{s.label}</p>
              <p className="mt-2 text-2xl font-black text-gradient-green">{s.value}{s.suffix}</p>
            </div>
          ))}
        </section>

        {/* ── PROJECTS HEADER ── */}
        <div className="mt-14 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tight">Projects</h2>
            <p className="mt-1 text-sm text-zinc-500">Each project has its own council, memory and task board.</p>
          </div>
        </div>

        {/* ── PROJECT CARDS ── */}
        <section className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {projects.map((project, i) => (
            <div
              key={project.id}
              className="gradient-border card p-6 fade-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">
                  Council
                </span>
                <span className="tag border-zinc-700/50 text-zinc-400 bg-zinc-800/30">#0{i + 1}</span>
              </div>

              <h3 className="mt-4 text-xl font-black tracking-tight">{project.name}</h3>
              <p className="mt-2 text-sm text-zinc-500 leading-relaxed min-h-10">{project.description}</p>

              <div className="mt-5 flex flex-wrap gap-1.5">
                {["GPT", "Claude", "Gemini", "Decision"].map((a) => (
                  <span key={a} className={`tag ${agentColors[a]}`}>{a}</span>
                ))}
              </div>

              <Link
                href={`/project/${encodeURIComponent(project.name)}`}
                className="mt-5 block rounded-xl border border-zinc-700/60 px-4 py-3 text-center text-sm font-bold transition-all hover:border-emerald-500/40 hover:bg-emerald-500/5 hover:text-emerald-400"
              >
                Open Council →
              </Link>
            </div>
          ))}

          {/* Add card */}
          <button
            onClick={addProject}
            className="card flex min-h-52 flex-col items-center justify-center gap-3 p-6 border-dashed opacity-50 hover:opacity-80 hover:border-emerald-500/30 transition-opacity"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-700 text-xl text-zinc-400">+</div>
            <p className="text-sm font-bold text-zinc-500">New Project</p>
          </button>
        </section>

        {/* ── AGENTS STRIP ── */}
        <section className="mt-16 rounded-2xl border border-zinc-800/60 bg-zinc-950/40 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500 mb-5">Active AI Council</p>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { name: "GPT Strategist",   icon: "⚡", color: "from-violet-500/20 to-transparent", border: "border-violet-500/20", tag: "OpenAI" },
              { name: "Claude Critic",    icon: "🔍", color: "from-orange-500/20 to-transparent", border: "border-orange-500/20", tag: "Anthropic" },
              { name: "Gemini Research",  icon: "🌐", color: "from-blue-500/20 to-transparent",   border: "border-blue-500/20",   tag: "Google" },
              { name: "Decision Maker",   icon: "✅", color: "from-emerald-500/20 to-transparent",border: "border-emerald-500/20",tag: "GPT-4" },
            ].map((a) => (
              <div key={a.name} className={`rounded-xl border ${a.border} bg-gradient-to-b ${a.color} p-4`}>
                <div className="text-2xl">{a.icon}</div>
                <p className="mt-2 text-sm font-bold">{a.name}</p>
                <p className="mt-0.5 text-xs text-zinc-500">{a.tag}</p>
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-12 text-center text-xs text-zinc-700">
          MindLandia® — AI Council Workspace · {new Date().getFullYear()}
        </footer>
      </div>
    </main>
  );
}
