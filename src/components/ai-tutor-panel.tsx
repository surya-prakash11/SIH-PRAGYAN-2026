"use client";

import { useEffect, useState } from "react";
import {
  Bot,
  Loader2,
  Sparkles,
  AlertCircle,
  Send,
  Lightbulb,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

type Props = {
  classNo: number;
  subject: string;
  num: number;
  title: string;
  summary?: string;
};

type ChatMsg = { role: "user" | "model"; text: string };

const SUGGESTED = [
  "Explain this chapter in 5 bullet points",
  "What are the key formulas or terms?",
  "Give me 3 practice questions with answers",
  "What is the easiest way to remember this?",
  "Show a real-life example from India",
];

export function AiTutorPanel(props: Props) {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  async function ask(question: string) {
    const text = question.trim();
    if (!text || busy) return;
    setInput("");
    setError(null);
    setBusy(true);
    setMessages((cur) => [...cur, { role: "user", text }]);
    try {
      const res = await fetch("/api/ai/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: text,
          chapter: {
            classNo: props.classNo,
            subject: props.subject,
            num: props.num,
            title: props.title,
            summary: props.summary,
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
      setMessages((cur) => [
        ...cur,
        { role: "model", text: data.reply ?? "(no response)" },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setMessages((cur) => cur.slice(0, -1));
    } finally {
      setBusy(false);
    }
  }

  // Hide the panel completely if AI is configured as disabled on the server
  if (enabled === false) return null;

  return (
    <section className="rounded-xl border border-navy-200 bg-gradient-to-br from-navy-50 via-white to-saffron-50 p-5 shadow-sm dark:border-navy-800 dark:from-navy-950/40 dark:via-slate-900 dark:to-saffron-950/20">
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-navy-800 text-saffron-400">
            <Bot className="h-4.5 w-4.5" />
          </span>
          <div>
            <h3 className="flex items-center gap-1.5 text-base font-extrabold text-navy-900 dark:text-white">
              <Sparkles className="h-3.5 w-3.5 text-saffron-500" />
              AI Tutor for this chapter
            </h3>
            <p className="text-[12px] text-slate-600 dark:text-slate-300">
              Ask anything about &ldquo;{props.title}&rdquo; and get a
              NCERT-aligned explanation.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-1 rounded-md border border-line bg-white px-2.5 py-1.5 text-xs font-bold text-navy-800 transition hover:bg-navy-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        >
          {open ? (
            <>
              <ChevronUp className="h-3.5 w-3.5" /> Collapse
            </>
          ) : (
            <>
              <ChevronDown className="h-3.5 w-3.5" /> Open tutor
            </>
          )}
        </button>
      </header>

      {open && (
        <div className="mt-4 space-y-3">
          {/* Suggested prompts */}
          {messages.length === 0 && (
            <div className="grid gap-2 sm:grid-cols-2">
              {SUGGESTED.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => ask(s)}
                  disabled={busy}
                  className="group flex items-start gap-2 rounded-lg border border-line bg-white p-2.5 text-left text-[12.5px] font-medium text-navy-900 transition hover:border-saffron-400 hover:bg-saffron-50 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                >
                  <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-saffron-500" />
                  <span>{s}</span>
                </button>
              ))}
            </div>
          )}

          {/* Conversation */}
          {messages.length > 0 && (
            <div className="max-h-[360px] space-y-2 overflow-y-auto rounded-lg border border-line bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-[13.5px] leading-relaxed ${
                      m.role === "user"
                        ? "rounded-tr-sm bg-navy-800 text-white"
                        : "rounded-tl-sm bg-slate-100 text-navy-900 dark:bg-slate-900 dark:text-slate-100"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {busy && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-tl-sm bg-slate-100 px-3 py-2 text-[13px] text-navy-900 dark:bg-slate-900 dark:text-slate-100">
                    <span className="inline-flex items-center gap-1">
                      <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-navy-400" />
                      <span
                        className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-navy-400"
                        style={{ animationDelay: "150ms" }}
                      />
                      <span
                        className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-navy-400"
                        style={{ animationDelay: "300ms" }}
                      />
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-2.5 text-[12.5px] text-rose-800">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void ask(input);
            }}
            className="flex items-end gap-2"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void ask(input);
                }
              }}
              rows={1}
              placeholder={`Ask about Chapter ${props.num}: ${props.title}…`}
              className="min-h-[40px] flex-1 resize-none rounded-lg border border-line bg-white px-3 py-2 text-[14px] text-navy-950 outline-none transition focus:border-navy-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="inline-flex h-[40px] items-center gap-1.5 rounded-lg bg-navy-800 px-3 text-sm font-bold text-white transition hover:bg-navy-700 disabled:opacity-50"
            >
              {busy ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" /> Ask
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
