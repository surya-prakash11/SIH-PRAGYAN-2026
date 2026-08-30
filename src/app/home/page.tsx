import { getActiveUser } from "@/server/auth/session";
import { db } from "@/server/db";
import { chapters, notes } from "@/server/db/schema";
import { eq, desc } from "drizzle-orm";
import { SUBJECTS } from "@/shared/curriculum";
import { getChapterList, getUserStats } from "@/server/data/queries";
import { HomeView } from "@/components/home-view";

export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await getActiveUser();
  if (!user) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <meta httpEquiv="refresh" content="2" />
        <h1 className="text-2xl font-extrabold text-navy-900">Portal is starting</h1>
        <p className="mt-2 text-[15px] text-slate-600">
          Loading the learning database… this page will refresh automatically.
        </p>
      </div>
    );
  }

  const classNo = user.className ?? 8;
  const stats = await getUserStats(user.id, classNo);

  const subjectData = [];
  const testableChapters = [];
  for (const s of SUBJECTS) {
    const list = await getChapterList(classNo, s.slug, user.id);
    const practiced = list.filter((c) => c.bestScore !== null).length;
    const testable = list.filter((c) => c.mcqCount > 0 || c.subjCount > 0).length;
    subjectData.push({ meta: s, total: list.length, practiced, testable });
    for (const c of list) {
      if (c.mcqCount > 0) {
        testableChapters.push({
          key: `${classNo}-${s.slug}-${c.num}`,
          href: `/class/${classNo}/${s.slug}/${c.slug}`,
          subjectSlug: s.slug,
          subjectName: s.name,
          label: `Ch ${c.num}: ${c.title}`,
          best: c.bestScore !== null ? `${c.bestScore}/${c.bestTotal}` : null,
        });
      }
    }
  }

  let facultyQueue: { id: number; title: string; chapter: string; author: string }[] = [];
  if (user.role === "faculty") {
    const pending = await db
      .select({
        id: notes.id,
        title: notes.title,
        authorName: notes.authorName,
        chapterTitle: chapters.title,
        subjectName: chapters.subjectName,
        classNo: chapters.classNo,
        chapterNum: chapters.num,
      })
      .from(notes)
      .innerJoin(chapters, eq(notes.chapterId, chapters.id))
      .where(eq(notes.facultyVerified, false))
      .orderBy(desc(notes.id))
      .limit(5);
    facultyQueue = pending.map((p) => ({
      id: p.id,
      title: p.title,
      author: p.authorName,
      chapter: `Class ${p.classNo} · ${p.chapterTitle}`,
    }));
  }

  return (
    <HomeView
      user={user}
      classNo={classNo}
      stats={stats}
      subjectData={subjectData}
      testableChapters={testableChapters}
      facultyQueue={facultyQueue}
    />
  );
}
