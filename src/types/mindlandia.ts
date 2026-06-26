export type Message = {
  role: string;
  label: string;
  text: string;
  border: string;
};

export type TimelineItem = {
  id: number;
  title: string;
  summary: string;
  decision: string;
  messages: Message[];
  createdAt: string;
};

export type TaskItem = {
  id: number;
  title: string;
  completed: boolean;
  priority: "High" | "Medium" | "Low";
  bucket: "This Week" | "Next Week" | "Blocked";
};

export type ProjectBrainV2 = {
  goals: string[];
  decisions: string[];
  constraints: string[];
  risks: string[];
  features: string[];
  techArchitecture: string[];
  marketResearch: string[];
};

export type ExecutionPackData = {
  objectives?: string[];
  milestones?: string[];
  deliverables?: string[];
  risks?: string[];
  kpis?: string[];
  budget?: string[];
};
