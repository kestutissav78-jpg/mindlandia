"use client";

type Props = {
  topic: string;
  onTopicChange: (value: string) => void;
  isLoading: boolean;
  isParsing: boolean;
  onStartCouncil: () => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClearMemory: () => void;
  uploadedFiles: string[];
  parsedFileTexts: string[];
  imagePreview: string;
};

export default function CouncilPanel({
  topic, onTopicChange, isLoading, isParsing, onStartCouncil,
  onFileUpload, onClearMemory, uploadedFiles, parsedFileTexts, imagePreview,
}: Props) {
  return (
    <section className="mt-8 gradient-border rounded-2xl p-6" style={{ background: "rgba(0,0,0,0.6)" }}>
      {/* header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-emerald-400">Work Window</p>
          <h2 className="mt-1.5 text-2xl font-black tracking-tight">Ask the Council</h2>
        </div>

        {isLoading && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 pulse-dot" />
            <span className="text-xs font-semibold text-emerald-400">Council thinking…</span>
          </div>
        )}
      </div>

      {/* agents row */}
      <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
        {[
          { label: "GPT",      sub: "Strategist", dot: "bg-violet-400" },
          { label: "Claude",   sub: "Critic",     dot: "bg-orange-400" },
          { label: "Gemini",   sub: "Research",   dot: "bg-blue-400" },
          { label: "Decision", sub: "Maker",      dot: "bg-emerald-400" },
        ].map((a) => (
          <div key={a.label} className="flex shrink-0 items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2">
            <span className={`h-1.5 w-1.5 rounded-full ${a.dot} ${isLoading ? "pulse-dot" : ""}`} />
            <span className="text-xs font-semibold text-zinc-300">{a.label}</span>
            <span className="text-xs text-zinc-600">{a.sub}</span>
          </div>
        ))}
      </div>

      {/* textarea */}
      <div className="relative mt-5">
        <textarea
          value={topic}
          onChange={(e) => onTopicChange(e.target.value)}
          placeholder="Describe your question, problem or idea…"
          rows={5}
          className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-colors"
        />
        {isLoading && (
          <div className="shimmer-line absolute inset-x-0 bottom-0 h-0.5 rounded-b-xl" />
        )}
      </div>

      {/* actions */}
      <div className="mt-4 flex gap-3">
        <label className="btn-ghost flex cursor-pointer items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-zinc-400">
          <span>＋</span> Files
          <input type="file" multiple accept="image/*,.pdf,.doc,.docx,.txt" onChange={onFileUpload} className="hidden" />
        </label>

        <button
          onClick={onClearMemory}
          className="btn-ghost rounded-xl px-4 py-3 text-sm font-semibold text-zinc-500"
        >
          Clear
        </button>

        <button
          onClick={onStartCouncil}
          disabled={isLoading}
          className="btn-primary ml-auto rounded-xl px-7 py-3 text-sm font-black text-black disabled:opacity-40 disabled:transform-none disabled:shadow-none"
        >
          {isLoading ? "Thinking…" : "Start Council →"}
        </button>
      </div>

      {/* attached files */}
      {uploadedFiles.length > 0 && (
        <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950 p-4 space-y-2">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            {isParsing ? "Reading files…" : "Attached"}
          </p>
          {uploadedFiles.map((name) => {
            const parsed = parsedFileTexts.some((t) => t.startsWith(`[${name}]`));
            return (
              <div key={name} className="flex items-center gap-2 text-sm text-zinc-400">
                <span className="text-base">{isParsing ? "⏳" : parsed ? "✓" : "🖼"}</span>
                <span className="truncate">{name}</span>
              </div>
            );
          })}
          {!isParsing && parsedFileTexts.length > 0 && (
            <p className="text-xs text-emerald-500 pt-1">
              {parsedFileTexts.length} file{parsedFileTexts.length > 1 ? "s" : ""} ready
            </p>
          )}
        </div>
      )}

      {/* image preview */}
      {imagePreview && (
        <img
          src={imagePreview}
          alt="Preview"
          className="mt-4 max-h-52 rounded-xl border border-zinc-800 object-contain"
        />
      )}
    </section>
  );
}
