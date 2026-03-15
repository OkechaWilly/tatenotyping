"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";

export default function KPICards() {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState({
    bestWpm: 0,
    avgAccuracy: 0,
    totalSessions: 0,
    totalHours: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      const supabase = createClient();
      
      // Fetch all sessions (simplified, for production use aggregation/RPC)
      const { data: sessions, error } = await supabase
        .from("sessions")
        .select("wpm, accuracy, duration")
        .eq("user_id", user.id);

      if (sessions && sessions.length > 0) {
        const bestWpm = Math.max(...sessions.map(s => s.wpm));
        const avgAccuracy = Math.round(sessions.reduce((acc, s) => acc + s.accuracy, 0) / sessions.length);
        const totalDurationChars = sessions.reduce((acc, s) => acc + s.duration, 0);
        const totalHours = Math.round((totalDurationChars / 3600) * 10) / 10;
        
        setStats({
          bestWpm,
          avgAccuracy,
          totalSessions: sessions.length,
          totalHours,
        });
      }
      setLoading(false);
    };

    fetchStats();
  }, [user]);

  const kpis = [
    {
      icon: "⚡",
      label: "Best WPM",
      value: loading ? "..." : stats.bestWpm.toString(),
      sub: "wpm",
      delta: "Personal best",
      deltaColor: "text-ink-3",
      hoverClass: "bg-accent",
    },
    {
      icon: "◎",
      label: "Avg Accuracy",
      value: loading ? "..." : stats.avgAccuracy.toString(),
      sub: "%",
      delta: "Session average",
      deltaColor: "text-ink-3",
      hoverClass: "bg-green",
    },
    {
      icon: "🔥",
      label: "Current Streak",
      value: loading ? "..." : (profile?.streak_current || 0).toString(),
      sub: "days",
      delta: `Best: ${profile?.streak_best || 0} days`,
      deltaColor: "text-ink-3",
      hoverClass: "bg-gold",
    },
    {
      icon: "⏱",
      label: "Time Practiced",
      value: loading ? "..." : stats.totalHours.toString(),
      sub: "hrs",
      delta: "All time",
      deltaColor: "text-ink-3",
      hoverClass: "bg-blue",
    },
    {
      icon: "✓",
      label: "Sessions",
      value: loading ? "..." : stats.totalSessions.toString(),
      sub: "",
      delta: "Completed tests",
      deltaColor: "text-ink-3",
      hoverClass: "bg-ink",
    },
  ];

  return (
    <div className="grid grid-cols-5 gap-3 animate-fadeUp" style={{ animationDelay: "0.08s" }}>
      {kpis.map((kpi, i) => (
        <div
          key={i}
          className={`bg-surface border border-border rounded-lg px-4 py-[18px] flex flex-col gap-1.5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-px cursor-default relative overflow-hidden group`}
        >
          <div className={`absolute top-0 left-0 right-0 h-[2px] opacity-0 transition-opacity duration-200 group-hover:opacity-100 ${kpi.hoverClass}`} />
          
          <div className="absolute right-3.5 top-3.5 text-lg opacity-20">{kpi.icon}</div>
          
          <div className="font-mono text-[9px] font-medium tracking-[0.12em] uppercase text-ink-3">
            {kpi.label}
          </div>
          <div className="font-mono text-[30px] font-normal text-ink leading-none tracking-[-0.02em]">
            {kpi.value}
            {kpi.sub && <sub className="text-[14px] opacity-60 font-normal align-baseline ml-[2px]">{kpi.sub}</sub>}
          </div>
          <div className={`font-mono text-[10px] ${kpi.deltaColor}`}>
            {kpi.delta}
          </div>
        </div>
      ))}
    </div>
  );
}
