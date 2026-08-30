"use client";

import { useEffect, useState } from "react";
import {
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Wand2,
  ListChecks,
} from "lucide-react";

type Question = {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
};

type Props = {
  classNo: number;
  subject: string;
  num: number;
  title: string;
  summary?: string;
};

export function AiQuizGenerator(props: Props) {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState(5);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

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

  async function generate() {
    setBusy(true);
    setError(null);
    setQuestions([]);
    setAnswers({});
    setRevealed({});
    try {
      const res = await fetch("/api/ai/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chapter: {
            classNo: props.classNo,
            subject: props.subject,
            num: props.num,
            title: props.title,
            summary: props.summary,
          },
          topic: topic.trim() || undefined,
          count,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        questions?: Question[];
        error?: string;
      };
      if (!res.ok) {
        throw new Error(data.error || `Request failed (${res.status})`);
      }
      setQuestions(data.questions ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  if (enabled === false) return null;

  const score = questions.reduce(
    (acc, q, i) =>
      acc + (revealed[i] && answers[i] === q.answerIndex ? 1 : 0),
    0,
  );
  const allAnswered =
    questions.length > 0 && questions.every((_, i) => revealed[i]);

  return (
    <section className="rounded-xl border border-saffron-200 bg-gradient-to-br from-saffron-50 via-white to-navy-50 p-5 shadow-sm dark:border-saffron-900/50 dark:from-saffron-950/30 dark:via-slate-900 dark:to-navy-950/30">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-extrabold text-navy-900 dark:text-white">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-saffron-500 text-navy-900">
              <Wand2 className="h-4 w-4" />
            </span>
            AI Practice Quiz
          </h3>
          <p className="mt-1 text-[12.5px] text-slate-600 dark:text-slate-300">
            Generate NCERT-aligned MCQs for{" "}
            <span className="font-bold text-navy-800 dark:text-saffron-300">
              {props.title}
            </span>{" "}
            using AI.
          </p>
        </div>
        {questions.length > 0 && !allAnswered && (
          <span className="rounded-full bg-navy-100 px-2.5 py-1 text-[11px] font-extrabold text-navy-700 dark:bg-navy-900 dark:text-saffron-300">
            {Object.values(revealed).filter(Boolean).length}/{questions.length}{" "}
            answered
          </span>
        )}
        {allAnswered && (
          <span className="rounded-full bg-leaf-100 px-2.5 py-1 text-[11px] font-extrabold text-leaf-700 dark:bg-leaf-900/40 dark:text-leaf-300">
            Score: {score}/{questions.length}
          </span>
        )}
      </header>

      {/* Controls */}
      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Optional sub-topic (e.g. 'Acids and Bases')"
          className="rounded-lg border border-line bg-white px-3 py-2 text-[14px] text-navy-950 outline-none transition focus:border-navy-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
        <select
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="rounded-lg border border-line bg-white px-3 py-2 text-[14px] text-navy-950 outline-none transition focus:border-navy-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        >
          <option value={3}>3 questions</option>
          <option value={5}>5 questions</option>
          <option value={7}>7 questions</option>
          <option value={10}>10 questions</option>
        </select>
        <button
          type="button"
          onClick={() => void generate()}
          disabled={busy}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-navy-800 px-4 py-2 text-sm font-bold text-white transition hover:bg-navy-700 disabled:opacity-60"
        >
          {busy ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Generating…
            </>
          ) : questions.length > 0 ? (
            <>
              <RefreshCw className="h-4 w-4" /> Regenerate
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" /> Generate quiz
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-2.5 text-[13px] text-rose-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Questions */}
      {questions.length > 0 && (
        <ol className="mt-5 space-y-4">
          {questions.map((q, qi) => {
            const isRevealed = !!revealed[qi];
            const picked = answers[qi];
            return (
              <li
                key={qi}
                className="rounded-lg border border-line bg-white p-4 shadow-xs dark:border-slate-700 dark:bg-slate-800"
              >
                <p className="text-[14.5px] font-extrabold text-navy-900 dark:text-white">
                  <span className="mr-1.5 text-saffron-600">Q{qi + 1}.</span>
                  {q.question}
                </p>
                <div className="mt-2.5 grid gap-1.5 sm:grid-cols-2">
                  {q.options.map((opt, oi) => {
                    const isPicked = picked === oi;
                    const isCorrect = q.answerIndex === oi;
                    let cls =
                      "border-line bg-paper hover:border-navy-400 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-saffron-500";
                    if (isRevealed) {
                      if (isCorrect) {
                        cls =
                          "border-leaf-500 bg-leaf-50 dark:bg-leaf-900/30 dark:border-leaf-400";
                      } else if (isPicked && !isCorrect) {
                        cls =
                          "border-rose-400 bg-rose-50 dark:bg-rose-900/30 dark:border-rose-500";
                      } else {
                        cls = "border-line bg-paper opacity-60";
                      }
                    } else if (isPicked) {
                      cls =
                        "border-navy-700 bg-navy-50 dark:border-saffron-500 dark:bg-saffron-950/40";
                    }
                    return (
                      <button
                        key={oi}
                        type="button"
                        disabled={isRevealed}
                        onClick={() =>
                          setAnswers((cur) => ({ ...cur, [qi]: oi }))
                        }
                        className={`flex items-center gap-2 rounded-md border-2 px-3 py-2 text-left text-[13.5px] font-medium transition disabled:cursor-default ${cls}`}
                      >
                        <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-navy-300 bg-white text-[10px] font-extrabold text-navy-700 dark:border-slate-500 dark:bg-slate-800 dark:text-slate-200">
                          {String.fromCharCode(65 + oi)}
                        </span>
                        <span className="text-navy-900 dark:text-slate-100">
                          {opt.replace(/^[A-D]\.\s*/i, "")}
                        </span>
                        {isRevealed && isCorrect && (
                          <CheckCircle2 className="ml-auto h-4 w-4 text-leaf-600" />
                        )}
                        {isRevealed && isPicked && !isCorrect && (
                          <XCircle className="ml-auto h-4 w-4 text-rose-600" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-3 flex items-center justify-between">
                  {!isRevealed ? (
                    <button
                      type="button"
                      onClick={() =>
                        setRevealed((cur) => ({ ...cur, [qi]: true }))
                      }
                      disabled={picked === undefined}
                      className="inline-flex items-center gap-1.5 rounded-md bg-saffron-500 px-3 py-1.5 text-[12.5px] font-extrabold text-navy-950 transition hover:bg-saffron-400 disabled:opacity-50"
                    >
                      <ListChecks className="h-3.5 w-3.5" />
                      Check answer
                    </button>
                  ) : (
                    <div className="flex-1 rounded-md border border-navy-200 bg-navy-50 px-3 py-2 text-[12.5px] text-navy-900 dark:border-navy-700 dark:bg-navy-900/40 dark:text-slate-200">
                      <span className="font-extrabold">Explanation: </span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}

      {questions.length === 0 && !busy && (
        <div className="mt-4 rounded-md border border-dashed border-navy-200 bg-white/50 px-4 py-5 text-center text-[12.5px] text-slate-600 dark:border-slate-700 dark:bg-slate-900/30 dark:text-slate-400">
          Tap <span className="font-extrabold text-navy-800 dark:text-saffron-300">Generate quiz</span> to
          get fresh AI-generated MCQs on this chapter.
        </div>
      )}
    </section>
  );
}
