"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/language-context";

export function NavLinks() {
  const { t } = useLanguage();
  const pathname = usePathname();

  const links = [
    { href: "/home", label: t("nav_dashboard") },
    { href: "/leaderboard", label: t("nav_leaderboard") },
    { href: "/account", label: t("nav_account") },
  ];

  return (
    <nav aria-label="Primary" className="flex items-center gap-0.5 sm:gap-1 text-[13px] sm:text-[14px] font-semibold shrink-0">
      {links.map((l) => {
        const isActive = pathname === l.href;
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`rounded-md px-2.5 py-1.5 transition ${
              isActive
                ? "bg-navy-100/80 font-bold text-navy-950 dark:bg-slate-800 dark:text-saffron-300"
                : "text-navy-700 hover:bg-navy-50 hover:text-navy-900 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-white"
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
