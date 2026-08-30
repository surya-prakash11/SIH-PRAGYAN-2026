"use client";

import { useEffect, useState } from "react";
import {
  Sparkles,
  Loader2,
  AlertCircle,
  NotebookPen,
  Wand2,
} from "lucide-react";

type Props = {
  chapterId: number;
  chapterTitle: string;
  classNo: number;
  subject: string;
};

type Mode = "summarize" | "explain" | "keypoints";

export function AiNotesSummary(props: Props) {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [topic, setTopic] = useState("");
  const [mode, setMode] = useState<Mode>("summarize");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/ai/health", { cache: "no-store" });
        const data = (await res.json()) as { enabled?: boolean };
        if (!cancelled) setEnabled(Boolean(data.enabled));
      } catch {
        if (!cancelled) setEnabled(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function run() {
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      // Build a "source text" by asking the user for a topic and combining
      // it with the chapter context — the AI tutor generates a fresh,
      // age-appropriate NCERT-aligned study guide for that sub-topic.
      const promptTopic = topic.trim() || "this chapter";
      const sys = "You are an NCERT study assistant.";
      const userPrompt =
        mode === "summarize"
          ? `Create a 150-word student-friendly summary of the sub-topic "${promptTopic}" from the chapter "${props.chapterTitle}" (Class ${props.classNo} ${props.subject}). Use bullet points, bold key terms, and one small example.`
          : mode === "keypoints"
            ? `List the 6-8 most important points a Class ${props.classNo} student must remember about "${promptTopic}" from "${props.chapterTitle}" (${props.subject}). Format as a numbered list. Each point 1-2 lines.`
            : `Re-explain "${promptTopic}" from "${props.chapterTitle}" (Class ${props.classNo} ${props.subject}) to a 12-14 year old. Start with a one-line gist, then 3-5 bullet points, then a small Indian real-life example.`;

      // Reuse the chat endpoint with a single user message
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", text: userPrompt }],
          context: {
            classNo: props.classNo,
            subject: props.subject,
            chapter: props.chapterTitle,
          },
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        reply?: string;
        error?: string;
      };
      if (!res.ok) {
        throw new Error(data.error || `Request failed (${res.status})`);
      }
      setResult(data.reply ?? "(no response)");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  if (enabled === false) return null;

  return (
    <section className="rounded-xl border border-line bg-gradient-to-br from-white via-saffron-50/40 to-navy-50/60 p-5 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:via-saffron-950/20 dark:to-navy-950/30">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-[15px] font-extrabold text-navy-900 dark:text-white">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-saffron-500 text-navy-900">
              <NotebookPen className="h-3.5 w-3.5" />
            </span>
            AI Study Notes
            <span className="rounded-full bg-navy-100 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-navy-700 dark:bg-navy-900 dark:text-saffron-300">
              Beta
            </span>
          </h3>
          <p className="mt-0.5 text-[12.5px] text-slate-600 dark:text-slate-300">
            Get a quick AI-generated study sheet for any sub-topic of this
            chapter.
          </p>
        </div>
      </header>

      <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto_auto_auto]">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder={`Sub-topic of "${props.chapterTitle}" (optional)`}
          className="rounded-lg border border-line bg-white px-3 py-2 text-[13.5px] text-navy-950 outline-none transition focus:border-navy-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as Mode)}
          className="rounded-lg border border-line bg-white px-3 py-2 text-[13.5px] text-navy-950 outline-none transition focus:border-navy-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        >
          <option value="summarize">Summary</option>
          <option value="keypoints">Key points</option>
          <option value="explain">Explain simply</option>
        </select>
        <button
          type="button"
          onClick={() => void run()}
          disabled={busy}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-navy-800 px-3.5 py-2 text-[13.5px] font-bold text-white transition hover:bg-navy-700 disabled:opacity-60"
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="h-4 w-4" />
          )}
          Generate
        </button>
        <button
          type="button"
          onClick={() => {
            setResult(null);
            setError(null);
            setTopic("");
          }}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-line bg-white px-3 py-2 text-[13.5px] font-bold text-navy-800 transition hover:bg-paper dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        >
          <Sparkles className="h-4 w-4" /> Reset
        </button>
      </div>

      {error && (
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-2.5 text-[12.5px] text-rose-800">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {result && (
        <div className="mt-3 whitespace-pre-wrap rounded-lg border border-navy-200 bg-white p-3.5 text-[13.5px] leading-relaxed text-navy-900 shadow-xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">
          {result}
        </div>
      )}

      {!result && !busy && !error && (
        <p className="mt-3 text-[12px] text-slate-500 dark:text-slate-400">
          Tip: leave the sub-topic empty to get an overview of the whole
          chapter.
        </p>
      )}
    </section>
  );
}
