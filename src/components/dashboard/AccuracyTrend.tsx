"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";

export default function AccuracyTrend() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<{ val: number, day: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    if (!user) return;

    const fetchAccuracy = async () => {
      const supabase = createClient();
      const date = new Date();
      date.setDate(date.getDate() - 7);

      const { data: sessions } = await supabase
        .from("sessions")
        .select("accuracy, created_at")
        .eq("user_id", user.id)
        .gte("created_at", date.toISOString())
        .order("created_at", { ascending: true });

      if (sessions && sessions.length > 0) {
        // Group by day or just show last 7 sessions
        const mapped = sessions.slice(-7).map(s => ({
          val: s.accuracy,
          day: new Date(s.created_at).toLocaleDateString("en-US", { weekday: 'short' })
        }));
        setData(mapped);
      }
      setLoading(false);
    };

    fetchAccuracy();
  }, [user]);

  const avgAcc = data.length > 0 
    ? (data.reduce((acc, d) => acc + d.val, 0) / data.length).toFixed(1)
    : "0.0";
  
  const bestAcc = data.length > 0 ? Math.max(...data.map(d => d.val)) : 0;
  const worstAcc = data.length > 0 ? Math.min(...data.map(d => d.val)) : 0;

  return (
    <div className="bg-surface border border-border rounded-[10px] p-4 sm:p-6 shadow-sm flex flex-col h-full">
      <div className="flex justify-between items-baseline mb-4">
        <div className="font-mono text-[9px] sm:text-[10px] font-medium tracking-[0.12em] uppercase text-ink-3">Accuracy · Recent</div>
        <div className="font-mono text-[10px] sm:text-[11px] text-green">{avgAcc}% avg</div>
      </div>

      <div className="flex items-end gap-1 sm:gap-1.5 h-[100px]">
        {loading ? (
          <div className="flex-1 flex items-center justify-center font-mono text-[10px] text-ink-3">Loading...</div>
        ) : data.length === 0 ? (
          <div className="flex-1 flex items-center justify-center font-mono text-[10px] text-ink-3">No data</div>
        ) : (
          data.map((item, i) => {
            const height = Math.max(10, ((item.val - 50) / 50) * 100); // Scale from 50-100%
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                <div
                  className="w-full rounded-t-[3px] bg-green transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] cursor-pointer group-hover:brightness-110"
                  style={{ height: mounted ? `${height}%` : "0%" }}
                />
                <div className="font-mono text-[8px] sm:text-[9px] text-ink-3 group-hover:text-ink">{item.val}%</div>
                <div className="font-mono text-[8px] text-ink-4 whitespace-nowrap hidden sm:block">{item.day}</div>
              </div>
            );
          })
        )}
      </div>

      <div className="flex gap-3 mt-3.5 pt-2 border-t border-border">
        <div className="font-mono text-[10px] text-ink-3">
          <span className="text-green font-medium">Best</span> · {bestAcc}%
        </div>
        <div className="font-mono text-[10px] text-ink-3">
          <span className="text-accent font-medium">Worst</span> · {worstAcc}%
        </div>
      </div>
    </div>
  );
}
