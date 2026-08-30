import Link from "next/link";
import { GraduationCap, UserRound } from "lucide-react";
import { getActiveUser } from "@/server/auth/session";
import { DataSaverToggle } from "./data-saver-toggle";
import { ThemeToggle } from "./theme-toggle";
import { LanguageToggle } from "./language-toggle";
import { NavLinks } from "./nav-links";
import { UserHeaderBadge } from "./user-header-badge";
import { db } from "@/server/db";
import { xpEvents } from "@/server/db/schema";
import { eq, sql } from "drizzle-orm";

import { Wordmark } from "./ui";
export { ChakraMark, Wordmark } from "./ui";

export async function SiteHeader() {
  const user = await getActiveUser();
  let xp = 0;
  if (user) {
    try {
      const [row] = await db
        .select({ x: sql<number>`coalesce(sum(${xpEvents.amount}), 0)` })
        .from(xpEvents)
        .where(eq(xpEvents.userId, user.id));
      xp = Number(row?.x ?? 0);
    } catch {
      xp = 0;
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b-2 border-saffron-500/70 bg-white/95 backdrop-blur dark:border-saffron-500/40 dark:bg-slate-950/90">
      <div className="tricolor-strip h-1.5 w-full" aria-hidden="true" />
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-x-2 md:gap-x-4 px-3 sm:px-4 py-2 flex-nowrap overflow-x-auto sm:overflow-visible">
        <div className="flex items-center gap-3 sm:gap-6 shrink-0">
          <Link href="/home" className="shrink-0" aria-label="Pragyan home">
            <Wordmark />
          </Link>
          <NavLinks />
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <LanguageToggle />
          <ThemeToggle />
          <DataSaverToggle />
          {user ? (
            <>
              <span
                className="hidden items-center gap-1.5 rounded-full border border-saffron-200 bg-saffron-50 px-2.5 py-1 text-xs sm:text-sm font-bold text-saffron-700 lg:inline-flex dark:border-saffron-900/60 dark:bg-saffron-950/50 dark:text-saffron-300"
                title="Total experience points"
              >
                <GraduationCap className="h-3.5 w-3.5" /> {xp} XP
              </span>
              <UserHeaderBadge user={user} />
            </>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 rounded-md bg-navy-800 px-3.5 py-1.5 text-xs sm:text-sm font-bold text-white transition hover:bg-navy-700"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
