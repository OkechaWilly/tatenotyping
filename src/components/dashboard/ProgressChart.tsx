"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { LineChart, Calendar } from "lucide-react";

interface SessionData {
  wpm: number;
  accuracy: number;
  created_at: string;
}

export default function ProgressChart() {
  const { user } = useAuth();
  const [period, setPeriod] = useState<"7d" | "30d" | "all">("7d");
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchHistory = async () => {
      setLoading(true);
      const supabase = createClient();
      
      let query = supabase
        .from("sessions")
        .select("wpm, accuracy, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true })
        .limit(100);

      if (period === "7d") {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        query = query.gte("created_at", date.toISOString());
      } else if (period === "30d") {
        const date = new Date();
        date.setDate(date.getDate() - 30);
        query = query.gte("created_at", date.toISOString());
      }

      const { data, error } = await query;

      if (!error && data) {
        setSessions(data);
      }
      setLoading(false);
    };

    fetchHistory();
  }, [user, period]);

  const W = 600, H = 240, pL = 40, pR = 40, pT = 20, pB = 40;
  
  const wpmData = sessions.map(s => s.wpm);
  const accData = sessions.map(s => s.accuracy);
  
  const maxWpm = Math.max(...wpmData, 60);
  const minWpm = 0;
  
  const maxAcc = 100;
  const minAcc = Math.min(...accData, 80); // Zoom in on accuracy if it's high

  const xFn = (i: number) => pL + (i / (Math.max(1, sessions.length - 1))) * (W - pL - pR);
  const yWpm = (v: number) => pT + (1 - (v - minWpm) / (Math.max(1, maxWpm - minWpm))) * (H - pT - pB);
  const yAcc = (v: number) => pT + (1 - (v - minAcc) / (Math.max(1, maxAcc - minAcc))) * (H - pT - pB);

  const buildPath = (data: number[], yFn: (v: number) => number) => {
    if (data.length <= 1) return "";
    return data.map((d, i) => `${i === 0 ? "M" : "L"}${xFn(i)},${yFn(d)}`).join(" ");
  };

  const wpmPath = buildPath(wpmData, yWpm);
  const accPath = buildPath(accData, yAcc);

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
            <LineChart size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-ink">Performance Trends</h3>
            <p className="text-xs text-ink-3">Speed and accuracy over time</p>
          </div>
        </div>

        <div className="flex gap-1 bg-surface-2 p-1 rounded-xl">
          {(["7d", "30d", "all"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg font-mono text-[10px] tracking-widest uppercase transition-all ${
                period === p ? "bg-surface text-ink shadow-sm font-bold" : "text-ink-4 hover:text-ink-2"
              }`}
            >
              {p === "all" ? "All Time" : p}
            </button>
          ))}
        </div>
      </div>

      <div className="relative flex-1 min-h-[240px]">
        {loading ? (
          <div className="inset-0 absolute flex items-center justify-center font-mono text-xs text-ink-4 animate-pulse">
            Analyzing statistics...
          </div>
        ) : sessions.length === 0 ? (
          <div className="inset-0 absolute flex items-center justify-center flex-col gap-3">
            <Calendar className="text-ink-4 opacity-20" size={48} />
            <p className="text-sm text-ink-4">No session data available for this period.</p>
          </div>
        ) : (
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" className="w-full h-full overflow-visible">
            {/* Grid lines */}
            <line x1={pL} y1={H - pB} x2={W - pR} y2={H - pB} className="stroke-border stroke-1" />
            <line x1={pL} y1={pT} x2={W - pR} y2={pT} className="stroke-border stroke-1" strokeDasharray="4 4" />
            
            {/* Left Axis (WPM) */}
            <text x={pL - 8} y={pT} textAnchor="end" className="fill-ink-4 font-mono text-[10px]">{maxWpm}</text>
            <text x={pL - 8} y={H - pB} textAnchor="end" className="fill-ink-4 font-mono text-[10px]">0</text>
            <text x={-H/2} y={pL/3} transform="rotate(-90)" textAnchor="middle" className="fill-accent font-mono text-[8px] uppercase tracking-widest font-bold">WPM</text>

            {/* Right Axis (Accuracy) */}
            <text x={W - pR + 8} y={pT} textAnchor="start" className="fill-ink-4 font-mono text-[10px]">100%</text>
            <text x={W - pR + 8} y={H - pB} textAnchor="start" className="fill-ink-4 font-mono text-[10px]">{Math.round(minAcc)}%</text>
            <text x={-H/2} y={W - pR/3} transform="rotate(-90)" textAnchor="middle" className="fill-green font-mono text-[8px] uppercase tracking-widest font-bold">Accuracy</text>

            {/* Paths */}
            {accPath && (
              <path 
                d={accPath} 
                className="stroke-green stroke-[1.5px] fill-none" 
                strokeDasharray="4 3" 
                opacity={0.6}
              />
            )}
            {wpmPath && (
              <path 
                d={wpmPath} 
                className="stroke-accent stroke-[2.5px] fill-none" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            )}

            {/* Dots and Tooltips */}
            {sessions.map((s, i) => (
              <g key={i} className="group/dot">
                <circle
                  cx={xFn(i)}
                  cy={yWpm(s.wpm)}
                  r={4}
                  className="fill-accent stroke-surface stroke-2 hover:r-6 cursor-pointer transition-all"
                />
                {/* Invisible larger hover area */}
                <rect 
                  x={xFn(i) - 10} 
                  y={0} 
                  width={20} 
                  height={H} 
                  className="fill-transparent cursor-pointer group-hover/dot:fill-accent/5"
                />
              </g>
            ))}
          </svg>
        )}
      </div>

      <div className="flex gap-6 mt-6 pt-6 border-t border-border">
        <div className="flex items-center gap-2 font-mono text-[10px] text-ink-3">
          <div className="w-8 h-1 rounded-full bg-accent" />
          <span className="uppercase tracking-widest font-bold text-accent">WPM</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px] text-ink-3">
          <div className="w-8 h-0.5 border-t border-dashed border-green" />
          <span className="uppercase tracking-widest font-bold text-green">Accuracy</span>
        </div>
      </div>
    </div>
  );
}
