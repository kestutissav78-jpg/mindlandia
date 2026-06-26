/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { Message, TaskItem, TimelineItem, ExecutionPackData, ProjectBrainV2 } from "@/types/mindlandia";

const EMPTY_BRAIN: ProjectBrainV2 = {
  goals: [], decisions: [], constraints: [], risks: [],
  features: [], techArchitecture: [], marketResearch: [],
};

type ProjectMemory = {
  topic: string;
  messages: Message[];
  decision: string;
  lastActivity: string;
  status: string;
  notes: string;
  timeline: TimelineItem[];
  tasks: TaskItem[];
  projectBrain: string;
  brainV2?: ProjectBrainV2;
};

export function useProjectState(projectName: string) {
  const storageKey = `mindlandia-project-${projectName}`;

  const [topic, setTopic] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [decision, setDecision] = useState("");
  const [status, setStatus] = useState("Idea");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [selectedCouncil, setSelectedCouncil] = useState<TimelineItem | null>(null);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [projectBrain, setProjectBrain] = useState("");
  const [roadmap, setRoadmap] = useState<{ stage: string; goal: string }[]>([]);
  const [mvpPlan, setMvpPlan] = useState("");
  const [executionPack, setExecutionPack] = useState<ExecutionPackData | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageData, setImageData] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [parsedFileTexts, setParsedFileTexts] = useState<string[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [executives, setExecutives] = useState<{ role: string; label: string; text: string }[]>([]);
  const [executiveSummary, setExecutiveSummary] = useState("");
  const [isExecLoading, setIsExecLoading] = useState(false);
  const [brainV2, setBrainV2] = useState<ProjectBrainV2>(EMPTY_BRAIN);
  const [isBrainUpdating, setIsBrainUpdating] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (!saved) return;
    const memory: ProjectMemory = JSON.parse(saved);
    setTopic(memory.topic || "");
    setMessages(memory.messages || []);
    setDecision(memory.decision || "");
    setStatus(memory.status || "Idea");
    setNotes(memory.notes || "");
    setTimeline(memory.timeline || []);
    setTasks(memory.tasks || []);
    setProjectBrain(memory.projectBrain || "");
    setBrainV2(memory.brainV2 || EMPTY_BRAIN);
  }, [storageKey]);

  function saveMemory(
    nextTopic: string,
    nextMessages: Message[],
    nextDecision: string,
    nextStatus = status,
    nextNotes = notes,
    nextTasks = tasks
  ) {
    const now = new Date().toLocaleString();
    const timelineSummary = nextDecision.replace(/[#*_`-]/g, "").replace(/\s+/g, " ").slice(0, 350);

    const timelineItem: TimelineItem | null = nextDecision
      ? { id: Date.now(), title: nextTopic.slice(0, 80), summary: timelineSummary, decision: nextDecision, messages: nextMessages, createdAt: now }
      : null;

    const nextTimeline = timelineItem ? [timelineItem, ...timeline].slice(0, 20) : timeline;

    const nextProjectBrain = nextDecision
      ? [
          `Project: ${projectName}`,
          `Status: ${nextStatus}`,
          `Latest decision: ${timelineSummary}`,
          `Open tasks: ${nextTasks.filter((t) => !t.completed).slice(0, 5).map((t) => t.title).join(", ")}`,
        ].join("\n")
      : projectBrain;

    const memory: ProjectMemory = {
      topic: nextTopic, messages: nextMessages, decision: nextDecision,
      lastActivity: now, status: nextStatus, notes: nextNotes,
      timeline: nextTimeline, tasks: nextTasks, projectBrain: nextProjectBrain,
      brainV2,
    };

    setProjectBrain(nextProjectBrain);
    localStorage.setItem(storageKey, JSON.stringify(memory));
    setTimeline(nextTimeline);
  }

  async function startCouncil() {
    const founderMessage = topic.trim() || `I want to discuss the next steps for ${projectName}.`;
    setIsLoading(true);

    const founderOnlyMessages: Message[] = [
      { role: "founder", label: "👤 Founder", text: founderMessage, border: "border-cyan-900" },
    ];
    setMessages(founderOnlyMessages);
    setDecision("");

    try {
      const response = await fetch("/api/council", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageData,
          topic: `Project Brain:\n${projectBrain || "No project brain yet."}\n\nProject: ${projectName}\nStatus: ${status}\nNotes: ${notes}${parsedFileTexts.length ? `\n\nAttached Documents:\n${parsedFileTexts.join("\n\n")}` : ""}\nPrevious Council Decisions:\n${timeline
            .slice(0, 5)
            .map((item, i) => `${i + 1}. ${item.title}: ${(item.summary || item.decision).slice(0, 500)}`)
            .join("\n\n")}\n\nFounder question: ${founderMessage}`,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Council request failed");

      const nextMessages: Message[] = [
        ...founderOnlyMessages,
        { role: "gpt", label: "🧠 GPT Strategist", text: data.gpt, border: "border-indigo-900" },
        { role: "claude", label: "🎯 Claude Critic", text: data.claude, border: "border-red-900" },
        { role: "gemini", label: "⚡ Gemini Researcher", text: data.gemini, border: "border-yellow-900" },
      ];

      const generatedTasks: TaskItem[] = (data.tasks || []).map(
        (task: { title: string; priority: TaskItem["priority"] }, index: number) => ({
          id: Date.now() + index + 1,
          title: task.title,
          completed: false,
          priority: task.priority || "Medium",
          bucket: index < 3 ? "This Week" : "Next Week",
        })
      );

      setTasks(generatedTasks);
      setMessages(nextMessages);
      setDecision(data.decision);
      saveMemory(founderMessage, nextMessages, data.decision, status, notes, generatedTasks);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setMessages([
        ...founderOnlyMessages,
        { role: "gpt", label: "🧠 GPT Strategist", text: `Error: ${errorMessage}`, border: "border-indigo-900" },
      ]);
      setDecision("Council failed. Check the API route or server terminal.");
    } finally {
      setIsLoading(false);
    }
  }

  async function generateTasks() {
    if (!decision) return;
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      const nextTasks: TaskItem[] = (data.tasks || []).map(
        (task: { title: string; priority: TaskItem["priority"]; bucket: TaskItem["bucket"] }, index: number) => ({
          id: Date.now() + index,
          title: task.title,
          completed: false,
          priority: task.priority || "Medium",
          bucket: task.bucket || "This Week",
        })
      );
      setTasks(nextTasks);
      saveMemory(topic, messages, decision, status, notes, nextTasks);
    } catch {
      const fallback: TaskItem[] = [
        { id: Date.now() + 1, title: "Review final council decision", completed: false, priority: "High", bucket: "This Week" },
        { id: Date.now() + 2, title: "Define next practical action", completed: false, priority: "High", bucket: "This Week" },
      ];
      setTasks(fallback);
      saveMemory(topic, messages, decision, status, notes, fallback);
    }
  }

  async function generateRoadmap() {
    if (!decision) return;
    try {
      const response = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setRoadmap(data.roadmap || []);
    } catch {
      setRoadmap([
        { stage: "Validation", goal: "Validate user demand" },
        { stage: "MVP", goal: "Build smallest useful version" },
        { stage: "Launch", goal: "Release to first users" },
      ]);
    }
  }

  async function generateMvpPlan() {
    if (!decision) return;
    try {
      const response = await fetch("/api/mvp-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setMvpPlan(data.plan || "");
    } catch {
      setMvpPlan("MVP plan generation failed. Please check the server terminal.");
    }
  }

  async function updateBrainV2() {
    if (!decision) return;
    setIsBrainUpdating(true);
    try {
      const response = await fetch("/api/project-brain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision, projectName, existing: brainV2 }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      const updated = { ...EMPTY_BRAIN, ...data };
      setBrainV2(updated);
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const memory = JSON.parse(saved);
        localStorage.setItem(storageKey, JSON.stringify({ ...memory, brainV2: updated }));
      }
    } catch {
      // keep existing brain on error
    } finally {
      setIsBrainUpdating(false);
    }
  }

  async function askExecutiveTeam() {
    if (!decision) return;
    setIsExecLoading(true);
    try {
      const response = await fetch("/api/executive-team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: `Project: ${projectName}\nStatus: ${status}\n\nCouncil Decision:\n${decision}\n\nFounder question: ${topic || "Review our current direction and give your expert input."}`,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setExecutives(data.executives || []);
      setExecutiveSummary(data.summary || "");
    } catch {
      setExecutives([]);
      setExecutiveSummary("Executive team failed. Check server terminal.");
    } finally {
      setIsExecLoading(false);
    }
  }

  async function generateExecutionPack() {
    if (!decision) return;
    try {
      const response = await fetch("/api/execution-pack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setExecutionPack(data);
    } catch {
      setExecutionPack(null);
    }
  }

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    setUploadedFiles(files.map((f) => f.name));
    setIsParsing(true);

    const firstImage = files.find((f) => f.type.startsWith("image/"));
    if (firstImage) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = String(reader.result);
        setImagePreview(result);
        setImageData(result);
      };
      reader.readAsDataURL(firstImage);
    }

    const docFiles = files.filter((f) => !f.type.startsWith("image/"));
    const texts: string[] = [];

    for (const file of docFiles) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/parse-file", { method: "POST", body: formData });
        const data = await res.json();
        if (data.text) texts.push(`[${file.name}]\n${data.text}`);
      } catch {
        texts.push(`[${file.name}] — could not parse`);
      }
    }

    setParsedFileTexts(texts);
    setIsParsing(false);
  }

  function clearMemory() {
    localStorage.removeItem(storageKey);
    setTopic(""); setMessages([]); setDecision(""); setStatus("Idea");
    setNotes(""); setTimeline([]); setSelectedCouncil(null); setTasks([]);
    setProjectBrain(""); setBrainV2(EMPTY_BRAIN); setUploadedFiles([]); setParsedFileTexts([]); setImagePreview(""); setImageData("");
  }

  function toggleTask(id: number) {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, completed: !t.completed } : t));
  }

  function changeBucket(id: number, bucket: TaskItem["bucket"]) {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, bucket } : t));
  }

  const completedTasks = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  const nextTask = tasks.find((t) => !t.completed);
  const topRisk = timeline[0]?.summary || "No major risk identified yet.";

  return {
    // state
    topic, setTopic,
    messages, decision,
    status, setStatus,
    notes, setNotes,
    isLoading,
    timeline,
    selectedCouncil, setSelectedCouncil,
    tasks,
    showAdvanced, setShowAdvanced,
    roadmap, mvpPlan, executionPack,
    imagePreview, uploadedFiles, parsedFileTexts, isParsing,
    executives, executiveSummary, isExecLoading,
    brainV2, setBrainV2, isBrainUpdating,
    // computed
    completedTasks, totalTasks, progress, nextTask, topRisk,
    // actions
    startCouncil,
    generateTasks, generateRoadmap, generateMvpPlan, generateExecutionPack, askExecutiveTeam, updateBrainV2,
    handleFileUpload, clearMemory, toggleTask, changeBucket,
    saveMemory,
  };
}
