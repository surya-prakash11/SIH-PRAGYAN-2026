"use client";

import Link from "next/link";
import { BookOpen, ListChecks, PenLine } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export function ChapterTabs({
  base,
  activeTab,
}: {
  base: string;
  activeTab: string;
}) {
  const { t } = useLanguage();

  const tabs = [
    { id: "learn", label: t("tab_learning_hub"), icon: BookOpen },
    { id: "objective", label: t("tab_objective"), icon: ListChecks },
    { id: "subjective", label: t("tab_subjective"), icon: PenLine },
  ];

  return (
    <div className="mt-4 grid grid-cols-1 gap-1 rounded-md bg-navy-50 p-1 sm:grid-cols-3 dark:bg-slate-900" role="tablist" aria-label="Chapter sub-portals">
      {tabs.map((tab) => {
        const isSelected = activeTab === tab.id;
        const Icon = tab.icon;
        return (
          <Link
            key={tab.id}
            href={`${base}?tab=${tab.id}`}
            role="tab"
            aria-selected={isSelected}
            className={`flex items-center justify-center gap-2 rounded px-3 py-2.5 text-[14px] font-bold transition ${
              isSelected
                ? "bg-navy-800 text-white shadow dark:bg-slate-800 dark:text-saffron-300"
                : "text-navy-600 hover:bg-white hover:text-navy-900 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-white"
            }`}
          >
            <Icon className="h-4 w-4" /> {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
