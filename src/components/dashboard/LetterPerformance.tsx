"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { BarChart3, ArrowRight } from "lucide-react";

interface keyStat {
  key_char: string;
  error_count: number;
  total_attempts: number;
}

export default function LetterPerformance() {
  const { user } = useAuth();
  const [stats, setStats] = useState<keyStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      if (!user) return;
      const supabase = createClient();
      const { data, error } = await supabase
        .from("weak_keys")
        .select("key_char, error_count, total_attempts")
        .eq("user_id", user.id)
        .order("key_char", { ascending: true });

      if (!error && data) {
        setStats(data);
      }
      setLoading(false);
    }

    fetchStats();
  }, [user]);

  const letters = "abcdefghijklmnopqrstuvwxyz".split("");
  const statsMap = new Map(stats.map(s => [s.key_char.toLowerCase(), s]));

  const getErrorRate = (char: string) => {
    const s = statsMap.get(char);
    if (!s || s.total_attempts === 0) return 0;
    return (s.error_count / s.total_attempts) * 100;
  };

  const getColor = (rate: number, attempts: number) => {
    if (attempts === 0) return "bg-surface-3";
    if (rate < 2) return "bg-green-500";
    if (rate < 5) return "bg-amber-500";
    return "bg-error";
  };

  if (loading) return <div className="h-64 flex items-center justify-center bg-surface border border-border rounded-xl animate-pulse">Loading Letter Performance...</div>;

  const weakestKeys = [...stats]
    .sort((a, b) => (b.error_count / b.total_attempts) - (a.error_count / a.total_attempts))
    .filter(s => s.total_attempts > 5)
    .slice(0, 3);

  return (
    <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
            <BarChart3 size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-ink">Letter Performance</h3>
            <p className="text-xs text-ink-3">Error rate per key across all sessions</p>
          </div>
        </div>
      </div>

      <div className="flex items-end gap-1 h-32 mb-8 group">
        {letters.map(char => {
          const rate = getErrorRate(char);
          const s = statsMap.get(char);
          const attempts = s?.total_attempts || 0;
          const height = attempts === 0 ? "4px" : `${Math.max(4, Math.min(100, rate * 10))}%`;

          return (
            <div key={char} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <div 
                className={`w-full rounded-t-sm transition-all duration-500 ${getColor(rate, attempts)} ${attempts > 0 ? 'opacity-80 hover:opacity-100' : 'opacity-20'}`}
                style={{ height }}
                title={`${char.toUpperCase()}: ${rate.toFixed(1)}% error (${attempts} attempts)`}
              />
              <span className="text-[9px] font-mono font-bold text-ink-3 uppercase">{char}</span>
            </div>
          );
        })}
      </div>

      {weakestKeys.length > 0 && (
        <div className="p-4 rounded-xl bg-surface-2 border border-border flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-ink-2 uppercase tracking-wider">Trouble spots:</span>
            <div className="flex gap-2">
              {weakestKeys.map(wk => (
                <span key={wk.key_char} className="px-2.5 py-1 rounded bg-error/10 text-error font-mono font-bold text-sm uppercase ring-1 ring-error/20">
                  {wk.key_char}
                </span>
              ))}
            </div>
          </div>
          <button className="flex items-center gap-2 text-xs font-bold text-accent hover:gap-3 transition-all">
            Start Drill <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
