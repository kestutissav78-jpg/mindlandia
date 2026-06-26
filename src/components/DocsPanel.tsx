"use client";

import { useState } from "react";

type DocType = {
  id: string;
  label: string;
  icon: string;
};

const DOC_TYPES: DocType[] = [
  { id: "tech-spec", label: "Technical Spec", icon: "⚙️" },
  { id: "db-design", label: "Database Design", icon: "🗄️" },
  { id: "api-docs", label: "API Documentation", icon: "🔌" },
  { id: "sprint-plan", label: "Sprint Plan", icon: "🏃" },
  { id: "user-stories", label: "User Stories", icon: "👤" },
  { id: "test-plan", label: "Test Plan", icon: "🧪" },
  { id: "release-checklist", label: "Release Checklist", icon: "🚀" },
];

type Props = {
  hasDecision: boolean;
  context: string;
};

export default function DocsPanel({ hasDecision, context }: Props) {
  const [docs, setDocs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<string | null>(null);
  const [activeDoc, setActiveDoc] = useState<string | null>(null);

  if (!hasDecision) return null;

  async function generateDoc(type: string) {
    setLoading(type);
    setActiveDoc(type);
    try {
      const response = await fetch("/api/generate-doc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, context }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setDocs((prev) => ({ ...prev, [type]: data.doc }));
    } catch {
      setDocs((prev) => ({ ...prev, [type]: "Generation failed. Please try again." }));
    } finally {
      setLoading(null);
    }
  }

  function copyDoc(type: string) {
    navigator.clipboard.writeText(docs[type] || "");
  }

  const activeContent = activeDoc ? docs[activeDoc] : null;
  const activeType = DOC_TYPES.find((d) => d.id === activeDoc);

  return (
    <section className="mt-6 rounded-3xl border border-zinc-800 bg-zinc-950/40 p-6">
      <div>
        <h2 className="text-2xl font-bold">Document Generator</h2>
        <p className="mt-1 text-sm text-zinc-500">Generate technical documents from your project context</p>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        {DOC_TYPES.map((doc) => {
          const isGenerated = !!docs[doc.id];
          const isLoading = loading === doc.id;
          const isActive = activeDoc === doc.id;

          return (
            <button
              key={doc.id}
              onClick={() => isGenerated ? setActiveDoc(doc.id) : generateDoc(doc.id)}
              disabled={isLoading}
              className={`rounded-2xl border px-4 py-3 text-sm font-bold transition-colors disabled:opacity-50 ${
                isActive
                  ? "border-emerald-500 bg-emerald-950 text-emerald-400"
                  : isGenerated
                  ? "border-emerald-900 bg-zinc-900 text-emerald-400"
                  : "border-zinc-700 hover:bg-zinc-900"
              }`}
            >
              {isLoading ? "⏳" : doc.icon} {doc.label}
              {isGenerated && !isLoading && <span className="ml-2 text-xs opacity-60">✓</span>}
            </button>
          );
        })}
      </div>

      {activeDoc && (
        <div className="mt-6 rounded-2xl border border-zinc-800 bg-black p-5">
          <div className="flex items-center justify-between gap-4">
            <p className="font-bold">
              {activeType?.icon} {activeType?.label}
            </p>
            {activeContent && (
              <button
                onClick={() => copyDoc(activeDoc)}
                className="rounded-lg border border-zinc-700 px-3 py-1 text-xs font-bold hover:bg-zinc-900"
              >
                Copy
              </button>
            )}
          </div>

          {loading === activeDoc ? (
            <p className="mt-4 text-sm text-zinc-500 animate-pulse">Generating document...</p>
          ) : activeContent ? (
            <pre className="mt-4 max-h-[600px] overflow-y-auto whitespace-pre-wrap text-sm text-zinc-300 leading-relaxed">
              {activeContent}
            </pre>
          ) : null}
        </div>
      )}
    </section>
  );
}
