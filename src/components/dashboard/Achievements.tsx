"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";

export default function Achievements() {
  const { user } = useAuth();
  const [unlockedKeys, setUnlockedKeys] = useState<string[]>([]);

  useEffect(() => {
    async function fetchAchievements() {
      if (!user) return;
      const supabase = createClient();
      const { data } = await supabase
        .from("achievements")
        .select("achievement_key")
        .eq("user_id", user.id);
      
      if (data) {
        setUnlockedKeys(data.map(a => a.achievement_key));
      }
    }
    fetchAchievements();
  }, [user]);

  const achievements = [
    { icon: "⚡", name: "Speed Demon", desc: "Reach 80 WPM", unlocked: true },
    { icon: "🎯", name: "Sharpshooter", desc: "100% accuracy", unlocked: true },
    { icon: "🔥", name: "On Fire", desc: "7-day streak", unlocked: true },
    { icon: "⌨️", name: "Full Keyboard", desc: "Master all keys", unlocked: unlockedKeys.includes("full-keyboard") },
    { icon: "📚", name: "Word Wizard", desc: "10k words typed", unlocked: false },
    { icon: "🚀", name: "Rocket", desc: "Reach 100 WPM", unlocked: false },
    { icon: "🎓", name: "Graduate", desc: "Complete all lessons", unlocked: false },
    { icon: "⏰", name: "Marathoner", desc: "50 hours total", unlocked: false },
  ];

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="bg-surface border border-border rounded-[10px] p-6 shadow-sm animate-fadeUp" style={{ animationDelay: "0.3s" }}>
      <div className="flex items-baseline justify-between mb-4">
        <div className="font-mono text-[10px] font-medium tracking-[0.12em] text-ink-3 uppercase">
          Achievements · {unlockedCount} / {achievements.length} Unlocked
        </div>
        <button className="font-mono text-[10px] text-accent hover:underline">View all →</button>
      </div>

      <div className="grid grid-cols-4 gap-2.5">
        {achievements.map((ach) => (
          <div
            key={ach.name}
            className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-md border text-center transition-all duration-200 relative group cursor-default ${
              ach.unlocked
                ? "bg-surface border-border hover:border-gold hover:shadow-sm"
                : "bg-surface-2 border-border opacity-45 hover:border-border-strong hover:shadow-sm"
            }`}
          >
            <div className="text-[22px] leading-none mb-1">{ach.icon}</div>
            <div className="font-mono text-[9px] font-medium text-ink-2 tracking-[0.04em] leading-[1.3] group-hover:text-ink">
              {ach.name}
            </div>
            {!ach.unlocked && (
              <div className="absolute top-1.5 right-1.5 text-[8px] text-ink-4">🔒</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
