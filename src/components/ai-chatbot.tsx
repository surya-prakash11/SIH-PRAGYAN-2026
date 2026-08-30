"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bot,
  X,
  Send,
  Loader2,
  Sparkles,
  Trash2,
  AlertCircle,
  ChevronDown,
  MessagesSquare,
} from "lucide-react";

type ChatMsg = { role: "user" | "model"; text: string; ts: number };

type ChatContext = {
  classNo?: number;
  subject?: string;
  chapter?: string;
};

type Props = {
  context?: ChatContext;
};

const STORAGE_KEY = "pragyan_ai_chat_history_v1";

function makeId() {
  return `pragyan-chat-${Math.random().toString(36).slice(2, 8)}`;
}

function loadHistory(): ChatMsg[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (m): m is ChatMsg =>
          typeof m === "object" &&
          m !== null &&
          (m as ChatMsg).role === "user" ||
          (m as ChatMsg).role === "model"
            ? typeof (m as ChatMsg).text === "string"
            : false,
      )
      .slice(-40);
  } catch {
    return [];
  }
}

function saveHistory(msgs: ChatMsg[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs.slice(-40)));
  } catch {
    // ignore quota errors
  }
}

export function AiChatbot({ context }: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // Load history + check if AI is configured on the server
  useEffect(() => {
    setMessages(loadHistory());
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

  // Auto-scroll on new messages
  useEffect(() => {
    const el = scrollerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, open]);

  // Persist on changes
  useEffect(() => {
    saveHistory(messages);
  }, [messages]);

  async function send() {
    const text = input.trim();
    if (!text || busy) return;

    const next: ChatMsg[] = [
      ...messages,
      { role: "user", text, ts: Date.now() },
    ];
    setMessages(next);
    setInput("");
    setError(null);
    setBusy(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.map(({ role, text }) => ({ role, text })),
          context,
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
        {
          role: "model",
          text: data.reply ?? "(no response)",
          ts: Date.now(),
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      // Remove the last user message so they can retry cleanly
      setMessages((cur) => cur.slice(0, -1));
    } finally {
      setBusy(false);
      // Refocus the input on the next tick
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }

  function clearHistory() {
    setMessages([]);
    setError(null);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  }

  // If AI is not configured, show a small "offline" badge in the launcher
  // but still let the user open the chat (errors will be friendly).
  const offline = enabled === false;

  return (
    <>
      {/* Launcher button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-4 right-4 z-50 inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-navy-800 to-saffron-600 px-4 py-3 text-sm font-bold text-white shadow-xl ring-2 ring-white transition hover:scale-105 hover:shadow-2xl sm:bottom-6 sm:right-6"
        aria-label={open ? "Close AI tutor" : "Open AI tutor"}
        aria-expanded={open}
        id={makeId() + "-launcher"}
      >
        {open ? (
          <>
            <ChevronDown className="h-4 w-4" />
            Close
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            Ask Pragyan AI
            {offline && (
              <span className="ml-1 rounded-full bg-rose-500 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-white">
                Offline
              </span>
            )}
          </>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-20 right-4 z-50 flex w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-2xl ring-1 ring-navy-900/5 sm:bottom-24 sm:right-6"
          role="dialog"
          aria-label="Pragyan AI tutor"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-2 bg-gradient-to-r from-navy-800 to-navy-700 px-4 py-3 text-white">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-saffron-500 text-navy-900">
                <Bot className="h-5 w-5" />
              </span>
              <div className="leading-tight">
                <p className="text-sm font-extrabold">Pragyan AI Tutor</p>
                <p className="text-[11px] text-navy-100/90">
                  {offline
                    ? "AI is offline (set GEMINI_API_KEY)"
                    : "Ask any NCERT question · Class 7 & 8"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={clearHistory}
                title="Clear chat"
                className="rounded-md p-1.5 text-navy-100/80 transition hover:bg-white/10 hover:text-white"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                title="Close"
                className="rounded-md p-1.5 text-navy-100/80 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={scrollerRef}
            className="flex max-h-[60vh] min-h-[260px] flex-1 flex-col gap-3 overflow-y-auto bg-slate-50 px-3 py-3 dark:bg-slate-900"
          >
            {messages.length === 0 && (
              <div className="m-auto max-w-[280px] text-center">
                <MessagesSquare className="mx-auto h-7 w-7 text-navy-400" />
                <p className="mt-2 text-sm font-bold text-navy-900">
                  Hi! I&apos;m Pragyan AI.
                </p>
                <p className="mt-1 text-[12px] text-slate-600">
                  Try asking:
                </p>
                <ul className="mt-2 space-y-1 text-[12px] text-slate-700">
                  <li>&ldquo;Explain acids and bases in simple words&rdquo;</li>
                  <li>&ldquo;Solve 3x + 5 = 20 step by step&rdquo;</li>
                  <li>&ldquo;Give me 5 practice MCQs on Heat&rdquo;</li>
                </ul>
              </div>
            )}

            {messages.map((m, i) => (
              <Bubble key={i} role={m.role} text={m.text} />
            ))}

            {busy && (
              <div className="flex items-start gap-2">
                <Avatar role="model" />
                <div className="rounded-2xl rounded-tl-sm bg-white px-3 py-2 text-sm text-navy-900 shadow-sm ring-1 ring-slate-200">
                  <span className="inline-flex items-center gap-1">
                    <Dot delay={0} />
                    <Dot delay={150} />
                    <Dot delay={300} />
                  </span>
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-2.5 text-[12px] text-rose-800">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
            className="flex items-end gap-2 border-t border-line bg-white px-3 py-2.5"
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              rows={1}
              placeholder={
                offline
                  ? "AI is offline — see console to enable"
                  : "Ask about Class 7 or 8 NCERT topics…"
              }
              disabled={offline}
              className="min-h-[38px] max-h-32 flex-1 resize-none rounded-lg border border-line bg-paper px-3 py-2 text-[14px] text-navy-950 outline-none transition focus:border-navy-600 focus:bg-white disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={busy || !input.trim() || offline}
              className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-lg bg-navy-800 text-white transition hover:bg-navy-700 disabled:opacity-50"
              aria-label="Send message"
            >
              {busy ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </form>
        </div>
      )}
    </>
  );
}

function Bubble({ role, text }: { role: "user" | "model"; text: string }) {
  const isUser = role === "user";
  return (
    <div
      className={`flex items-start gap-2 ${isUser ? "flex-row-reverse" : ""}`}
    >
      <Avatar role={role} />
      <div
        className={`max-w-[80%] whitespace-pre-wrap break-words rounded-2xl px-3 py-2 text-[13.5px] leading-relaxed shadow-sm ${
          isUser
            ? "rounded-tr-sm bg-navy-800 text-white"
            : "rounded-tl-sm bg-white text-navy-900 ring-1 ring-slate-200"
        }`}
      >
        {text}
      </div>
    </div>
  );
}

function Avatar({ role }: { role: "user" | "model" }) {
  if (role === "user") {
    return (
      <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-saffron-500 text-[11px] font-extrabold text-navy-900">
        You
      </div>
    );
  }
  return (
    <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-navy-800 text-white">
      <Bot className="h-3.5 w-3.5" />
    </div>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <span
      className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-navy-400"
      style={{ animationDelay: `${delay}ms` }}
    />
  );
}
