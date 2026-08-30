"use client";

import Link from "next/link";
import { UserRound } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export function UserHeaderBadge({
  user,
}: {
  user: {
    id: number;
    name: string;
    role: string;
    isGuest: boolean;
  };
}) {
  const { t } = useLanguage();

  const roleText = user.isGuest
    ? t("guest")
    : user.role === "faculty"
      ? t("faculty")
      : t("student");

  return (
    <Link
      href="/account"
      className="inline-flex max-w-[190px] shrink-0 items-center gap-1.5 rounded-full border border-line bg-white px-2.5 py-1 transition hover:border-navy-400 hover:shadow-xs dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-500"
      title="View profile and switch accounts"
    >
      <UserRound className="h-3.5 w-3.5 shrink-0 text-navy-600 dark:text-slate-300" />
      <span className="truncate text-xs sm:text-sm font-semibold text-navy-800 dark:text-slate-100">
        {user.name.split(" ")[0]}
      </span>
      <span
        className={`shrink-0 rounded-sm px-1.5 py-0.2 text-[10px] font-bold uppercase tracking-wide text-white ${
          user.role === "faculty" ? "bg-saffron-600" : "bg-navy-800 dark:bg-slate-700"
        }`}
      >
        {roleText}
      </span>
    </Link>
  );
}
