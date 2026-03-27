"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { ACHIEVEMENT_DEFS, type AchievementDef } from "@/data/achievements";
import Link from "next/link";

export default function Achievements() {
  const { user } = useAuth();
  const [unlockedKeys, setUnlockedKeys] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    async function fetchAchievements() {
      if (!user) return;
      const supabase = createClient();
      const { data } = await supabase
        .from("achievements")
        .select("achievement_key")
        .eq("user_id", user.id);

      if (data) {
        setUnlockedKeys(data.map((a) => a.achievement_key));
      }
      setLoading(false);
    }
    fetchAchievements();
  }, [user]);

  const unlockedCount = ACHIEVEMENT_DEFS.filter((a) =>
    unlockedKeys.includes(a.key)
  ).length;

  // Show unlocked first, then locked
  const sorted = [...ACHIEVEMENT_DEFS].sort((a, b) => {
    const aU = unlockedKeys.includes(a.key) ? 0 : 1;
    const bU = unlockedKeys.includes(b.key) ? 0 : 1;
    return aU - bU;
  });

  const visible = showAll ? sorted : sorted.slice(0, 8);

  return (
    <div
      className="bg-surface border border-border rounded-[10px] p-6 shadow-sm animate-fadeUp"
      style={{ animationDelay: "0.3s" }}
    >
      <div className="flex items-baseline justify-between mb-4">
        <div className="font-mono text-[10px] font-medium tracking-[0.12em] text-ink-3 uppercase">
          {loading ? "Achievements" : `Achievements · ${unlockedCount} / ${ACHIEVEMENT_DEFS.length} Unlocked`}
        </div>
        <button
          onClick={() => setShowAll((v) => !v)}
          className="font-mono text-[10px] text-accent hover:underline"
        >
          {showAll ? "Show less" : "View all →"}
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2.5">
        {visible.map((ach: AchievementDef) => {
          const isUnlocked = unlockedKeys.includes(ach.key);
          return (
            <div
              key={ach.key}
              title={ach.description}
              className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-md border text-center transition-all duration-200 relative group cursor-default ${
                isUnlocked
                  ? "bg-surface border-border hover:border-gold hover:shadow-sm"
                  : "bg-surface-2 border-border opacity-40 hover:opacity-60 hover:border-border-strong"
              }`}
            >
              <div className={`text-[22px] leading-none mb-1 transition-all duration-200 ${isUnlocked ? "" : "grayscale"}`}>
                {ach.icon}
              </div>
              <div className="font-mono text-[9px] font-medium text-ink-2 tracking-[0.04em] leading-[1.3] group-hover:text-ink">
                {ach.title}
              </div>
              {!isUnlocked && (
                <div className="absolute top-1.5 right-1.5 text-[8px] text-ink-4">🔒</div>
              )}
            </div>
          );
        })}
      </div>

      {unlockedCount === 0 && !loading && (
        <div className="mt-3 text-center font-mono text-[10px] text-ink-3">
          Complete sessions and lessons to unlock achievements.{" "}
          <Link href="/lessons" className="text-accent hover:underline">
            Start a lesson →
          </Link>
        </div>
      )}
    </div>
  );
}
