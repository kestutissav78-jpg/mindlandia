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
  topic,
  onTopicChange,
  isLoading,
  isParsing,
  onStartCouncil,
  onFileUpload,
  onClearMemory,
  uploadedFiles,
  parsedFileTexts,
  imagePreview,
}: Props) {
  return (
    <section className="mt-8 rounded-3xl border border-emerald-900 bg-zinc-950/50 p-5">
      <p className="text-xs uppercase tracking-[0.3em] text-emerald-400">Work Window</p>
      <h2 className="mt-3 text-3xl font-black">Ask the Council</h2>

      <textarea
        value={topic}
        onChange={(e) => onTopicChange(e.target.value)}
        placeholder="Write your question here..."
        className="mt-5 h-36 w-full rounded-2xl border border-zinc-800 bg-black p-4 text-white outline-none focus:border-emerald-500"
      />

      <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
        <label className="rounded-2xl border border-zinc-800 bg-black px-5 py-4 text-center font-bold hover:bg-zinc-900 cursor-pointer">
          + Add Files
          <input
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx,.txt"
            onChange={onFileUpload}
            className="hidden"
          />
        </label>

        <button
          onClick={onStartCouncil}
          disabled={isLoading}
          className="rounded-2xl bg-emerald-400 px-8 py-4 font-black text-black hover:bg-emerald-300 disabled:opacity-50"
        >
          {isLoading ? "Council Thinking..." : "Start Council"}
        </button>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mt-4 rounded-2xl border border-zinc-800 bg-black p-4">
          <p className="text-sm font-bold text-emerald-400">
            {isParsing ? "Reading files..." : "Attached files"}
          </p>
          <div className="mt-2 space-y-1 text-sm text-zinc-400">
            {uploadedFiles.map((fileName) => {
              const parsed = parsedFileTexts.some((t) => t.startsWith(`[${fileName}]`));
              return (
                <p key={fileName}>
                  {isParsing ? "⏳" : parsed ? "✓" : "🖼"} {fileName}
                </p>
              );
            })}
          </div>
          {!isParsing && parsedFileTexts.length > 0 && (
            <p className="mt-2 text-xs text-emerald-400">
              {parsedFileTexts.length} document{parsedFileTexts.length > 1 ? "s" : ""} ready — council will read them
            </p>
          )}
        </div>
      )}

      {imagePreview && (
        <img
          src={imagePreview}
          alt="Uploaded preview"
          className="mt-4 max-h-56 rounded-2xl border border-zinc-800 object-contain"
        />
      )}

      <div className="mt-4 flex gap-3">
        <button
          onClick={onClearMemory}
          className="rounded-xl border border-zinc-700 px-4 py-3 text-sm font-bold hover:bg-zinc-900"
        >
          Clear Memory
        </button>
      </div>
    </section>
  );
}
