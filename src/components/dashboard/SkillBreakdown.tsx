"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";

export default function SkillBreakdown() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  interface Skill {
    name: string;
    val: number;
    max: number;
    color: string;
    label: string;
  }
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    setMounted(true);
    if (!user) return;

    const fetchSkills = async () => {
      const supabase = createClient();
      const { data: sessions } = await supabase
        .from("sessions")
        .select("wpm, accuracy, consistency")
        .eq("user_id", user.id);

      if (sessions && sessions.length > 0) {
        const avgWpm = Math.round(sessions.reduce((acc, s) => acc + s.wpm, 0) / sessions.length);
        const avgAcc = Math.round(sessions.reduce((acc, s) => acc + s.accuracy, 0) / sessions.length);
        const avgCons = Math.round(sessions.reduce((acc, s) => acc + (s.consistency || 0), 0) / sessions.length);
        
        setSkills([
          { name: "Speed", val: avgWpm, max: 120, color: "bg-accent", label: `${avgWpm} WPM` },
          { name: "Accuracy", val: avgAcc, max: 100, color: "bg-green", label: `${avgAcc}%` },
          { name: "Consistency", val: avgCons || 75, max: 100, color: "bg-gold", label: `${avgCons || 75}%` },
          { name: "Volume", val: Math.min(100, sessions.length * 2), max: 100, color: "bg-blue", label: `${sessions.length} sessions` },
        ]);
      }
      setLoading(false);
    };

    fetchSkills();
  }, [user]);

  return (
    <div className="bg-surface border border-border rounded-[10px] p-6 shadow-sm h-full">
      <div className="flex items-baseline justify-between mb-5">
        <div className="font-mono text-[10px] font-medium tracking-[0.12em] text-ink-3 uppercase">Skill Breakdown</div>
        <button className="font-mono text-[10px] text-accent hover:underline">Details →</button>
      </div>

      <div className="flex flex-col gap-3">
        {loading ? (
          <div className="font-mono text-[10px] text-ink-3">Loading breakdown...</div>
        ) : skills.length === 0 ? (
          <div className="font-mono text-[10px] text-ink-3">Complete sessions to see breakdown</div>
        ) : (
          skills.map((skill) => {
            const percentage = (skill.val / skill.max) * 100;
            return (
              <div key={skill.name} className="flex flex-col gap-[5px]">
                <div className="flex justify-between items-baseline">
                  <div className="text-[12px] font-medium text-ink-2">{skill.name}</div>
                  <div className="font-mono text-[11px] text-ink-3">{skill.label}</div>
                </div>
                <div className="h-[5px] bg-surface-2 rounded-[3px] border border-border overflow-hidden">
                  <div
                    className={`h-full rounded-[3px] transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] ${skill.color}`}
                    style={{ width: mounted ? `${percentage}%` : "0%" }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
