import { notFound, redirect } from "next/navigation";
import { getActiveUser } from "@/server/auth/session";
import { getChapters, validClass, validSubject } from "@/shared/curriculum";
import { getChapterList } from "@/server/data/queries";
import { SUBJECTS } from "@/shared/curriculum";
import { SubjectIndexView } from "@/components/subject-index-view";

export const dynamic = "force-dynamic";

export default async function SubjectIndex({
  params,
}: {
  params: Promise<{ classNo: string; subject: string }>;
}) {
  const { classNo, subject } = await params;
  if (!validClass(classNo) || !validSubject(subject)) notFound();
  const user = await getActiveUser();
  if (!user) redirect("/home");

  const cn = Number(classNo);
  const meta = SUBJECTS.find((s) => s.slug === subject)!;
  const dbList = await getChapterList(cn, subject, user.id);
  const staticRows = getChapters(cn, subject);
  const practiced = dbList.filter((c) => c.bestScore !== null).length;

  // group chapters by book (Social Science / Hindi)
  const groups: { book: string | null; items: { row: (typeof staticRows)[number]; data: (typeof dbList)[number] | undefined }[] }[] = [];
  staticRows.forEach((row, i) => {
    const data = dbList[i];
    const book = row.book ?? null;
    const g = groups.find((x) => (x.book ?? null) === book);
    if (g) g.items.push({ row, data });
    else groups.push({ book, items: [{ row, data }] });
  });

  return (
    <SubjectIndexView
      classNo={cn}
      subjectSlug={subject}
      meta={meta}
      groups={groups}
      dbList={dbList}
      practiced={practiced}
    />
  );
}