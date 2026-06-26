"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useProjectState } from "@/hooks/useProjectState";
import ProjectHeader from "@/components/ProjectHeader";
import ExecutiveBrief from "@/components/ExecutiveBrief";
import CouncilPanel from "@/components/CouncilPanel";
import FinalDecisionPanel from "@/components/FinalDecisionPanel";
import TaskBoard from "@/components/TaskBoard";
import RoadmapPanel from "@/components/RoadmapPanel";
import MVPPlanPanel from "@/components/MVPPlanPanel";
import ExecutionPack from "@/components/ExecutionPack";
import ProjectBrainPanel from "@/components/ProjectBrainPanel";
import ExecutiveTeamPanel from "@/components/ExecutiveTeamPanel";
import ProjectBrainV2Panel from "@/components/ProjectBrainV2Panel";
import DocsPanel from "@/components/DocsPanel";

type Props = { params: Promise<{ id: string }> };

export default function ProjectPage({ params }: Props) {
  const { id } = use(params);
  const projectName = decodeURIComponent(id);
  const p = useProjectState(projectName);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* ambient glow */}
      <div className="pointer-events-none fixed inset-x-0 top-0 h-[320px] bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(52,211,153,0.08),transparent)]" />

      <div className="relative flex min-h-screen">
        {/* ── SIDEBAR ── */}
        <aside className="hidden w-60 shrink-0 lg:block">
          <div className="sticky top-0 flex h-screen flex-col border-r border-zinc-900 p-5">
            {/* logo */}
            <Link href="/" className="flex items-center gap-2.5">
              <Image src="/icon-192.png" alt="MindLandia" width={30} height={30} className="rounded-lg" />
              <span className="text-sm font-black tracking-tight">
                Mind<span className="text-gradient-green">Landia</span>
              </span>
            </Link>

            {/* nav */}
            <nav className="mt-8 flex flex-col gap-1">
              <Link
                href="/"
                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
              >
                <span className="text-base">⬡</span> Dashboard
              </Link>
              <Link
                href="/"
                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
              >
                <span className="text-base">◫</span> Projects
              </Link>
              <button
                onClick={() => p.setShowAdvanced(!p.showAdvanced)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors text-left w-full"
              >
                <span className="text-base">⚙</span> Advanced
              </button>
            </nav>

            {/* current project badge */}
            <div className="mt-auto">
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-600">Active Project</p>
                <p className="mt-1.5 text-sm font-bold text-emerald-400 truncate">{projectName}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <div className="flex-1 px-5 py-8 lg:px-10 lg:py-10">
          <div className="mx-auto max-w-5xl">
            <ProjectHeader
              projectName={projectName}
              showAdvanced={p.showAdvanced}
              onToggleAdvanced={() => p.setShowAdvanced(!p.showAdvanced)}
            />
            <ExecutiveBrief
              nextTask={p.nextTask}
              topRisk={p.topRisk}
              tasks={p.tasks}
              progress={p.progress}
            />
            <CouncilPanel
              topic={p.topic}
              onTopicChange={p.setTopic}
              isLoading={p.isLoading}
              isParsing={p.isParsing}
              onStartCouncil={p.startCouncil}
              onFileUpload={p.handleFileUpload}
              onClearMemory={p.clearMemory}
              uploadedFiles={p.uploadedFiles}
              parsedFileTexts={p.parsedFileTexts}
              imagePreview={p.imagePreview}
            />
            <FinalDecisionPanel
              decision={p.decision}
              onGenerateTasks={p.generateTasks}
              onGenerateRoadmap={p.generateRoadmap}
              onGenerateMvpPlan={p.generateMvpPlan}
              onGenerateExecutionPack={p.generateExecutionPack}
            />
            <MVPPlanPanel mvpPlan={p.mvpPlan} />
            <RoadmapPanel roadmap={p.roadmap} />
            <ExecutionPack data={p.executionPack} />
            <ProjectBrainV2Panel
              brain={p.brainV2}
              isUpdating={p.isBrainUpdating}
              onUpdate={p.updateBrainV2}
              onBrainChange={p.setBrainV2}
              hasDecision={!!p.decision}
            />
            <ExecutiveTeamPanel
              executives={p.executives}
              summary={p.executiveSummary}
              isLoading={p.isExecLoading}
              onAsk={p.askExecutiveTeam}
              hasDecision={!!p.decision}
            />
            {p.decision && (
              <TaskBoard
                tasks={p.tasks}
                completedTasks={p.completedTasks}
                totalTasks={p.totalTasks}
                onTaskToggle={p.toggleTask}
                onBucketChange={p.changeBucket}
                onAskCouncil={(title) => {
                  p.setTopic(`Help me complete this task:\n\n${title}`);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            )}
            <DocsPanel
              hasDecision={!!p.decision}
              context={`Project: ${projectName}\nStatus: ${p.status}\nNotes: ${p.notes}\n\nCouncil Decision:\n${p.decision}\n\nProject Brain:\n${JSON.stringify(p.brainV2, null, 2)}`}
            />
            {p.showAdvanced && (
              <ProjectBrainPanel
                status={p.status}
                notes={p.notes}
                onStatusChange={p.setStatus}
                onNotesChange={p.setNotes}
                onSave={() => p.saveMemory(p.topic, p.messages, p.decision, p.status, p.notes, p.tasks)}
                timeline={p.timeline}
                selectedCouncil={p.selectedCouncil}
                onSelectCouncil={p.setSelectedCouncil}
                onCloseCouncil={() => p.setSelectedCouncil(null)}
                progress={p.progress}
                openTasks={p.tasks.filter((t) => !t.completed).length}
                nextTask={p.nextTask}
                topRisk={p.topRisk}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
