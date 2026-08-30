"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowBigUp,
  BadgeCheck,
  FileText,
  Image as ImageIcon,
  Loader2,
  Plus,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import type { RankedNote } from "@/server/data/queries";
import { useLanguage } from "@/context/language-context";

type Props = {
  chapterId: number;
  initial: RankedNote[];
  isFaculty: boolean;
};

export function NotesSection({ chapterId, initial, isFaculty }: Props) {
  const router = useRouter();
  const { t } = useLanguage();
  const [items, setItems] = useState<RankedNote[]>(initial);

  useEffect(() => {
    setItems(initial);
  }, [initial]);

  const [voting, setVoting] = useState<number | null>(null);
  const [verifying, setVerifying] = useState<number | null>(null);
  const [reward, setReward] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const resort = (list: RankedNote[]) =>
    [...list].sort((a, b) => b.rankScore - a.rankScore || a.id - b.id);

  const vote = async (id: number) => {
    if (voting !== null) return;
    setVoting(id);
    try {
      const res = await fetch(`/api/notes/${id}/vote`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Vote failed");
      setItems((prev) =>
        resort(
          prev.map((n) =>
            n.id === id
              ? {
                  ...n,
                  upvotes: data.upvotes,
                  iVoted: data.voted,
                  rankScore: data.upvotes * 0.7 + (n.facultyVerified ? 30 : 0),
                }
              : n,
          ),
        ),
      );
      router.refresh();
      if (data.reward) {
        setReward("Your upvote pushed this note to 10+ — the author earned +50 XP!");
        setTimeout(() => setReward(null), 5000);
      }
    } catch (e) {
      setUploadErr(e instanceof Error ? e.message : "Could not record your vote.");
    } finally {
      setVoting(null);
    }
  };

  const verify = async (id: number, verified: boolean) => {
    setVerifying(id);
    setUploadErr(null);
    try {
      const res = await fetch(`/api/notes/${id}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verified }),
      });
      const text = await res.text();
      let data: any = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = { error: text || "Invalid server response" };
      }
      if (!res.ok) throw new Error(data.error ?? `Verify failed (${res.status})`);
      setItems((prev) =>
        resort(
          prev.map((n) =>
            n.id === id
              ? {
                  ...n,
                  facultyVerified: data.facultyVerified,
                  verifiedByName: data.facultyVerified ? "You (Faculty)" : null,
                  rankScore: n.upvotes * 0.7 + (data.facultyVerified ? 30 : 0),
                }
              : n,
          ),
        ),
      );
      router.refresh();
    } catch (e) {
      setUploadErr(e instanceof Error ? e.message : "Could not update verification.");
    } finally {
      setVerifying(null);
    }
  };

  const submitUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
    setUploadErr(null);
    const fd = new FormData(e.currentTarget);
    fd.set("chapterId", String(chapterId));
    try {
      const res = await fetch("/api/notes", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      setShowForm(false);
      router.refresh();
    } catch (err) {
      setUploadErr(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const sorted = resort(items);

  return (
    <div>
      {reward && (
        <p role="status" className="mb-3 flex items-center gap-2 rounded-md border border-leaf-100 bg-leaf-50 p-3 text-sm font-bold text-leaf-700">
          <Sparkles className="h-4 w-4" /> {reward}
        </p>
      )}

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="text-[13px] font-semibold text-slate-500">
          Ranked by <code className="rounded bg-navy-50 px-1.5 py-0.5 font-mono text-[12px] text-navy-700">upvotes × 0.7 + faculty_verified × 30</code>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-2 rounded-md bg-navy-800 px-3.5 py-2 text-sm font-bold text-white transition hover:bg-navy-700 dark:bg-slate-800 dark:hover:bg-slate-700"
        >
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? t("close") : t("contribute_notes")}
        </button>
      </div>

      {showForm && (
        <form onSubmit={submitUpload} className="mb-5 space-y-3 rounded-lg border border-navy-200 bg-navy-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
          <h3 className="text-[15px] font-bold text-navy-900 dark:text-slate-100">{t("contribute_notes")}</h3>
          <input
            name="title"
            required
            minLength={4}
            placeholder="Title, e.g. One-page revision notes"
            className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-navy-900 focus:border-navy-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
          <textarea
            name="content"
            rows={4}
            placeholder="Key points, formula sheet, definitions…"
            className="w-full rounded-md border border-line bg-white p-3 text-sm text-navy-900 focus:border-navy-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
          <div className="flex flex-wrap items-center gap-3">
            <input
              ref={fileRef}
              type="file"
              name="file"
              accept=".pdf,.png,.jpg,.jpeg"
              className="text-xs text-slate-500 file:mr-2 file:rounded-md file:border file:border-navy-200 file:bg-white file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-navy-700 file:hover:bg-navy-50 dark:file:border-slate-700 dark:file:bg-slate-800 dark:file:text-slate-300"
            />
            <button
              type="submit"
              disabled={uploading}
              className="ml-auto inline-flex items-center gap-2 rounded-md bg-saffron-500 px-4 py-2 text-sm font-bold text-navy-950 transition hover:bg-saffron-400 disabled:opacity-60"
            >
              {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
              {t("publish_note")}
            </button>
          </div>
          {uploadErr && <p role="alert" className="text-sm font-bold text-rose-600">{uploadErr}</p>}
        </form>
      )}

      {sorted.length === 0 ? (
        <p className="rounded-lg border border-dashed border-navy-200 bg-navy-50/50 p-6 text-center text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400">
          {t("no_notes_yet")}
        </p>
      ) : (
        <ul className="space-y-3">
          {sorted.map((n, i) => (
            <li
              key={n.id}
              className={`vsv-enter rounded-lg border bg-white p-4 shadow-sm dark:bg-slate-900 dark:border-slate-800 ${
                n.facultyVerified ? "border-leaf-500/60 dark:border-leaf-500/40" : "border-line"
              }`}
            >
              <div className="flex flex-wrap items-start gap-3">
                <button
                  type="button"
                  onClick={() => vote(n.id)}
                  aria-pressed={n.iVoted}
                  aria-label={n.iVoted ? "Remove helpful vote" : "Mark as helpful"}
                  className={`flex w-16 shrink-0 flex-col items-center rounded-md border py-2 transition ${
                    n.iVoted
                      ? "border-saffron-500 bg-saffron-500 text-navy-950"
                      : "border-line bg-white text-navy-600 hover:border-saffron-400 hover:text-saffron-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
                  }`}
                >
                  <ArrowBigUp className="h-4 w-4" />
                  <span className="text-lg font-extrabold leading-none">{n.upvotes}</span>
                  <span className="text-[10px] font-bold uppercase">{t("helpful")}</span>
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {i === 0 && (
                      <span className="inline-flex items-center gap-1 rounded-sm bg-saffron-500 px-1.5 py-0.5 text-[11px] font-extrabold uppercase text-navy-950">
                        <Sparkles className="h-3 w-3" /> {t("recommended")}
                      </span>
                    )}
                    <h4 className="text-[16px] font-bold text-navy-900 dark:text-slate-100">{n.title}</h4>
                    {n.facultyVerified && (
                      <span
                        className="inline-flex items-center gap-1 rounded-full border border-leaf-500/40 bg-leaf-50 px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-wide text-leaf-700 dark:bg-leaf-950/40 dark:text-leaf-300 dark:border-leaf-500/30"
                        title={`Verified by ${n.verifiedByName ?? "faculty"}`}
                      >
                        <BadgeCheck className="h-3.5 w-3.5" /> {t("faculty_verified")}
                      </span>
                    )}
                    <span className="ml-auto text-[12px] font-semibold text-slate-400">
                      rank score {n.rankScore.toFixed(1)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[13px] font-semibold text-slate-500 dark:text-slate-400">
                    by {n.authorName}
                    {n.authorIsFaculty && (
                      <span className="ml-1.5 rounded-sm bg-navy-800 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white dark:bg-slate-700">
                        Faculty
                      </span>
                    )}
                  </p>

                  {n.content && (
                    <pre className="note-scroll mt-2 max-h-48 overflow-auto whitespace-pre-wrap rounded-md border border-line bg-paper p-3 font-sans text-[14px] leading-relaxed text-slate-700 dark:bg-slate-800/60 dark:border-slate-700 dark:text-slate-200">
                      {n.content}
                    </pre>
                  )}
                  {n.fileUrl && (
                    <a
                      href={n.fileUrl}
                      download={n.fileName ?? undefined}
                      className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-navy-200 bg-navy-50 px-3 py-1.5 text-sm font-bold text-navy-700 hover:border-navy-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                      {n.fileType === "image" ? <ImageIcon className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                      {n.fileName ?? "Download file"}
                    </a>
                  )}
                </div>

                {isFaculty && (
                  <button
                    type="button"
                    onClick={() => verify(n.id, !n.facultyVerified)}
                    disabled={verifying === n.id}
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-md border px-3 py-1.5 text-[13px] font-bold transition disabled:opacity-60 ${
                      n.facultyVerified
                        ? "border-line bg-white text-slate-500 hover:border-rose-300 hover:text-rose-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
                        : "border-leaf-500 bg-leaf-50 text-leaf-700 hover:bg-leaf-100 dark:bg-leaf-950/50 dark:text-leaf-300 dark:border-leaf-600"
                    }`}
                  >
                    {verifying === n.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <BadgeCheck className="h-4 w-4" />
                    )}
                    {n.facultyVerified ? t("un_verify") : t("verify_note")}
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
