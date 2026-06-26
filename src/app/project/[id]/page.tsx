"use client";

import { use } from "react";
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

type Props = {
  params: Promise<{ id: string }>;
};

export default function ProjectPage({ params }: Props) {
  const { id } = use(params);
  const projectName = decodeURIComponent(id);
  const p = useProjectState(projectName);

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 border-r border-zinc-900 bg-gradient-to-b from-indigo-950/40 to-black p-6 lg:block">
          <Link href="/" className="block text-3xl font-black">
            MindLandia<span className="align-super text-sm">®</span>
          </Link>

          <nav className="mt-10 space-y-3 text-zinc-300">
            <Link className="block rounded-xl border border-emerald-900 bg-zinc-950 px-4 py-3 text-emerald-400" href="/">
              Dashboard
            </Link>
            <Link className="block rounded-xl px-4 py-3 hover:bg-zinc-950" href="/">
              Projects
            </Link>
            <button
              onClick={() => p.setShowAdvanced(!p.showAdvanced)}
              className="w-full rounded-xl px-4 py-3 text-left hover:bg-zinc-950"
            >
              Advanced
            </button>
          </nav>

          <div className="absolute bottom-6 text-sm text-zinc-500">
            <p className="font-bold text-white">Founder</p>
            <p>MindLandia Council</p>
          </div>
        </aside>

        <div className="flex-1 p-6 lg:p-10">
          <div className="mx-auto max-w-7xl">
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
