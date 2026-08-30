"use client";

import { Zap, Medal, Target, Sparkles } from "lucide-react";
import { StatCard } from "./ui";
import { useLanguage } from "@/context/language-context";

export function HomeStats({
  stats,
  classNo,
  userRole,
}: {
  stats: {
    xp: number;
    rank: number | null;
    accuracy: number | null;
    objectiveAttempts: number;
    notes: number;
  };
  classNo: number;
  userRole: string;
}) {
  const { t } = useLanguage();

  return (
    <div className="vsv-enter mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4" style={{ animationDelay: "60ms" }}>
      <StatCard
        icon={Zap}
        label={t("total_xp")}
        value={stats.xp}
        tone="saffron"
        sub={userRole === "faculty" ? t("content_contribution") : t("earn_in_every_test")}
      />
      <StatCard
        icon={Medal}
        label={t("class_rank")}
        value={stats.rank ? `#${stats.rank}` : "—"}
        sub={`Class ${classNo}`}
      />
      <StatCard
        icon={Target}
        label={t("accuracy")}
        value={stats.accuracy !== null ? `${stats.accuracy}%` : "—"}
        sub={`${stats.objectiveAttempts} ${t("tab_objective")}`}
      />
      <StatCard
        icon={Sparkles}
        label={t("notes_shared")}
        value={stats.notes}
        sub={t("community_contributions")}
      />
    </div>
  );
}
