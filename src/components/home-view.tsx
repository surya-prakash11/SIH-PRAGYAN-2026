"use client";

import Link from "next/link";
import {
  Trophy,
  BookOpenCheck,
  ArrowRight,
  ShieldCheck,
  History,
  ClipboardCheck,
} from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { getSubjectLocalizedName } from "@/shared/i18n";
import { IconBox, ProgressBar, SUBJECT_ICONS } from "./ui";
import { HomeStats } from "./home-stats";

type SubjectData = {
  meta: {
    slug: string;
    name: string;
    short: string;
    icon: keyof typeof SUBJECT_ICONS;
    tint: string;
  };
  total: number;
  practiced: number;
  testable: number;
};

type TestableChapter = {
  key: string;
  href: string;
  subjectSlug: string;
  subjectName: string;
  label: string;
  best: string | null;
};

type FacultyItem = {
  id: number;
  title: string;
  author: string;
  chapter: string;
};

type RecentItem = {
  id: number;
  amount: number;
  note: string;
  type: string;
  createdAt: Date | string;
};

export function HomeView({
  user,
  classNo,
  stats,
  subjectData,
  testableChapters,
  facultyQueue,
}: {
  user: {
    id: number;
    name: string;
    role: string;
    school: string | null;
    state: string | null;
    subjectSpecialization: string | null;
    isGuest: boolean;
  };
  classNo: number;
  stats: {
    xp: number;
    rank: number | null;
    accuracy: number | null;
    objectiveAttempts: number;
    notes: number;
    recent: RecentItem[];
  };
  subjectData: SubjectData[];
  testableChapters: TestableChapter[];
  facultyQueue: FacultyItem[];
}) {
  const { t, language } = useLanguage();
  const firstName = user.name.split(" ")[0];

  const totalChaptersCount = subjectData.reduce((a, s) => a + s.total, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Top Banner */}
      <div className="vsv-enter flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-saffron-600 dark:text-saffron-400">
            {user.role === "faculty"
              ? t("faculty_console")
              : `Class ${classNo} · ${t("student_dashboard")}`}
          </p>
          <h1 className="mt-1 text-3xl font-extrabold text-navy-900 dark:text-white">
            {user.role === "faculty"
              ? `${t("welcome")}, ${user.name}`
              : `${t("namaste")}, ${firstName}!`}
          </h1>
          <p className="mt-1 text-[15px] text-slate-600 dark:text-slate-300">
            {user.school ?? user.subjectSpecialization}
            {user.state ? ` · ${user.state}` : ""}
            {user.isGuest && (
              <span className="ml-2 rounded-sm bg-saffron-100 px-1.5 py-0.5 text-[12px] font-bold text-saffron-700 dark:bg-saffron-950 dark:text-saffron-300">
                {t("guest_session")}
              </span>
            )}
          </p>
        </div>
        <Link
          href="/leaderboard"
          className="inline-flex items-center gap-2 rounded-md bg-navy-800 px-4 py-2.5 text-[15px] font-bold text-white transition hover:bg-navy-700 dark:bg-slate-800 dark:hover:bg-slate-700"
        >
          <Trophy className="h-4 w-4 text-saffron-400" /> {t("view_leaderboard_btn")}
        </Link>
      </div>

      {/* Stat Cards */}
      <HomeStats stats={stats} classNo={classNo} userRole={user.role} />

      {/* Faculty Moderation Queue */}
      {user.role === "faculty" && (
        <section
          className="vsv-enter mt-6 rounded-lg border border-saffron-200 bg-white p-5 shadow-sm dark:border-saffron-900/50 dark:bg-slate-900"
          style={{ animationDelay: "100ms" }}
        >
          <h2 className="flex items-center gap-2 text-lg font-bold text-navy-900 dark:text-white">
            <ShieldCheck className="h-5 w-5 text-saffron-600 dark:text-saffron-400" />{" "}
            {t("moderation_queue")}
            <span className="rounded-full bg-saffron-100 px-2 py-0.5 text-[12px] font-bold text-saffron-700 dark:bg-saffron-950 dark:text-saffron-300">
              {facultyQueue.length} {t("awaiting_review")}
            </span>
          </h2>
          {facultyQueue.length === 0 ? (
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              {t("all_notes_verified")}
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-line dark:divide-slate-800">
              {facultyQueue.map((n) => (
                <li
                  key={n.id}
                  className="flex flex-wrap items-center gap-2 py-2.5 text-[15px]"
                >
                  <ClipboardCheck className="h-4 w-4 text-navy-400" />
                  <span className="font-bold text-navy-900 dark:text-slate-100">
                    {n.title}
                  </span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {t("by_author")} {n.author}
                  </span>
                  <span className="ml-auto rounded-sm bg-navy-50 px-2 py-0.5 text-[12px] font-semibold text-navy-600 dark:bg-slate-800 dark:text-slate-300">
                    {n.chapter}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-2 text-[13px] text-slate-500 dark:text-slate-400">
            {t("moderation_tip")}
          </p>
        </section>
      )}

      {/* NCERT Subjects Grid */}
      <section className="vsv-enter mt-8" style={{ animationDelay: "140ms" }}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-navy-900 dark:text-white">
            Class {classNo} · {t("ncert_subjects")}
          </h2>
          <span className="text-[13px] font-semibold text-slate-500 dark:text-slate-400">
            {totalChaptersCount} {t("chapters_across_subjects")}
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subjectData.map(({ meta, total, practiced, testable }, i) => {
            const Icon = SUBJECT_ICONS[meta.icon];
            const localizedName = getSubjectLocalizedName(meta.slug, language);

            return (
              <Link
                key={meta.slug}
                href={`/class/${classNo}/${meta.slug}`}
                className="vsv-enter group rounded-lg border border-line bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-navy-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
                style={{ animationDelay: `${140 + i * 50}ms` }}
              >
                <div className="flex items-start justify-between">
                  <IconBox icon={Icon} tint={meta.tint} size="lg" />
                  <ArrowRight className="h-5 w-5 text-navy-300 transition group-hover:translate-x-1 group-hover:text-navy-700 dark:text-slate-600 dark:group-hover:text-slate-300" />
                </div>
                <h3 className="mt-3 text-lg font-bold text-navy-900 dark:text-white">
                  {localizedName}
                </h3>
                <p className="text-[13px] font-semibold text-slate-500 dark:text-slate-400">
                  {total} {t("chapters_word")} · {testable} {t("chapters_with_assessments")}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <ProgressBar value={practiced} max={total} className="flex-1" />
                  <span className="text-[12px] font-bold text-navy-600 dark:text-slate-300">
                    {practiced}/{total}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Assessment and XP Activity Grid */}
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <section className="vsv-enter rounded-lg border border-line bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="flex items-center gap-2 text-lg font-bold text-navy-900 dark:text-white">
            <BookOpenCheck className="h-5 w-5 text-saffron-600 dark:text-saffron-400" />{" "}
            {t("assessments_available")}
          </h2>
          {testableChapters.length === 0 ? (
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              {t("no_assessments_yet")}
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-line dark:divide-slate-800">
              {testableChapters.map((c) => {
                const localizedSubject = getSubjectLocalizedName(c.subjectSlug, language);
                return (
                  <li key={c.key}>
                    <Link
                      href={c.href}
                      className="group flex items-center gap-3 py-2.5"
                    >
                      <span className="rounded-sm bg-navy-50 px-2 py-1 text-[12px] font-bold text-navy-600 dark:bg-slate-800 dark:text-slate-300">
                        {localizedSubject}
                      </span>
                      <span className="text-[15px] font-semibold text-navy-800 group-hover:text-navy-950 group-hover:underline dark:text-slate-200 dark:group-hover:text-white">
                        {c.label}
                      </span>
                      {c.best ? (
                        <span className="ml-auto rounded-full bg-leaf-50 px-2.5 py-0.5 text-[12px] font-bold text-leaf-700 dark:bg-leaf-950/50 dark:text-leaf-300">
                          {t("best_score")} {c.best}
                        </span>
                      ) : (
                        <span className="ml-auto rounded-full bg-saffron-50 px-2.5 py-0.5 text-[12px] font-bold text-saffron-700 dark:bg-saffron-950/50 dark:text-saffron-300">
                          {t("not_attempted")}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section
          className="vsv-enter rounded-lg border border-line bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          style={{ animationDelay: "80ms" }}
        >
          <h2 className="flex items-center gap-2 text-lg font-bold text-navy-900 dark:text-white">
            <History className="h-5 w-5 text-saffron-600 dark:text-saffron-400" />{" "}
            {t("recent_xp_activity")}
          </h2>
          {stats.recent.length === 0 ? (
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              {t("no_xp_yet")}
            </p>
          ) : (
            <ul className="mt-3 space-y-2.5">
              {stats.recent.map((e) => {
                const dateStr = new Date(e.createdAt).toLocaleDateString(
                  language === "hi" ? "hi-IN" : language === "te" ? "te-IN" : language === "ta" ? "ta-IN" : "en-IN",
                  { day: "numeric", month: "short" }
                );
                return (
                  <li key={e.id} className="flex items-start gap-3">
                    <span className="mt-0.5 rounded-md bg-saffron-50 px-2 py-0.5 text-[13px] font-extrabold text-saffron-700 dark:bg-saffron-950/50 dark:text-saffron-300">
                      +{e.amount}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-semibold text-navy-800 dark:text-slate-200">
                        {e.note}
                      </p>
                      <p className="text-[12px] text-slate-500 dark:text-slate-400">
                        {e.type} · {dateStr}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      <p className="mt-6 text-center text-[13px] text-slate-500 dark:text-slate-400">
        {t("mapping_note")}
      </p>
    </div>
  );
}
