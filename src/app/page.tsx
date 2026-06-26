"use client";

import { useEffect, useState } from "react";

type Project = {
  id: number;
  name: string;
  description: string;
};

const defaultProjects: Project[] = [
  { id: 1, name: "MindLandia", description: "Main AI council platform." },
  { id: 2, name: "MakeupCoach", description: "Personal AI makeup coach app." },
  { id: 3, name: "KostaParts", description: "Auto parts listing and VIN scan system." },
  { id: 4, name: "PartyDrop", description: "Party photo and video sharing app." },
];

export default function Home() {
  const [projects, setProjects] = useState<Project[]>(defaultProjects);

  useEffect(() => {
    const saved = localStorage.getItem("mindlandia-projects");
    if (!saved) return;

    setProjects(JSON.parse(saved)); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  function saveProjects(nextProjects: Project[]) {
    setProjects(nextProjects);
    localStorage.setItem("mindlandia-projects", JSON.stringify(nextProjects));
  }

  function addProject() {
    const name = prompt("Enter new project name:");
    if (!name || !name.trim()) return;

    const newProject: Project = {
      id: Date.now(),
      name: name.trim(),
      description: "New project council created automatically.",
    };

    saveProjects([newProject, ...projects]);
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl p-6 lg:p-10">
        <section className="rounded-3xl border border-zinc-800 bg-gradient-to-r from-indigo-950/80 to-zinc-950 p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-400">
            MindLandia Workspace
          </p>

          <h1 className="mt-4 text-5xl font-black md:text-6xl">
            MindLandia<span className="align-super text-2xl">®</span>
          </h1>

          <p className="mt-4 max-w-2xl text-lg text-zinc-400">
            AI-powered project councils, decisions and execution tasks in one workspace.
          </p>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            <p className="text-sm text-zinc-500">Projects</p>
            <p className="mt-2 text-3xl font-black text-emerald-400">{projects.length}</p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            <p className="text-sm text-zinc-500">AI Council</p>
            <p className="mt-2 text-3xl font-black text-emerald-400">4</p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            <p className="text-sm text-zinc-500">Mode</p>
            <p className="mt-2 text-3xl font-black text-emerald-400">MVP</p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            <p className="text-sm text-zinc-500">Status</p>
            <p className="mt-2 text-3xl font-black text-emerald-400">Active</p>
          </div>
        </section>

        <section className="mt-10 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black">Projects</h2>
            <p className="mt-2 text-zinc-500">
              Each project has its own council, memory and task board.
            </p>
          </div>

          <button
            onClick={addProject}
            className="rounded-2xl bg-white px-6 py-4 font-black text-black hover:bg-zinc-200"
          >
            + New Project
          </button>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="rounded-3xl border border-zinc-800 bg-zinc-950/60 p-5 hover:border-emerald-900"
            >
              <p className="text-xs uppercase tracking-[0.25em] text-emerald-400">
                Project Council
              </p>

              <h3 className="mt-4 text-2xl font-black">{project.name}</h3>

              <p className="mt-3 min-h-12 text-sm text-zinc-500">
                {project.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-2 text-xs text-zinc-300">
                <span className="rounded-full border border-cyan-900 px-3 py-1">Founder</span>
                <span className="rounded-full border border-indigo-900 px-3 py-1">GPT</span>
                <span className="rounded-full border border-red-900 px-3 py-1">Critic</span>
                <span className="rounded-full border border-yellow-900 px-3 py-1">Research</span>
              </div>

              <a
                href={`/project/${encodeURIComponent(project.name)}`}
                className="mt-6 block rounded-2xl border border-zinc-700 px-5 py-3 text-center font-bold hover:border-emerald-800 hover:bg-zinc-900"
              >
                Open Project
              </a>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
