"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { Trophy, Users, Flag, Play, Car, Award } from "lucide-react";
import { useTypingEngine } from "@/hooks/useTypingEngine";

interface LeaderboardEntry {
  user_id: string;
  wpm: number;
  accuracy: number;
  profiles: {
    username: string;
    avatar_url: string | null;
  };
}

export default function CompetePage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<"all" | "month" | "week" | "today">("all");
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [inRace, setInRace] = useState(false);

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true);
      const supabase = createClient();
      
      let query = supabase
        .from("sessions")
        .select(`
          user_id,
          wpm,
          accuracy,
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .order("wpm", { ascending: false })
        .limit(20);

      // Simple time filtering
      const now = new Date();
      if (filter === "today") {
        query = query.gte("created_at", new Date(now.setHours(0, 0, 0, 0)).toISOString());
      } else if (filter === "week") {
        const lastWeek = new Date(now.setDate(now.getDate() - 7));
        query = query.gte("created_at", lastWeek.toISOString());
      } else if (filter === "month") {
        const lastMonth = new Date(now.setMonth(now.getMonth() - 1));
        query = query.gte("created_at", lastMonth.toISOString());
      }

      const { data, error } = await query;
      if (!error && data) {
        const formatted = (data as unknown[]).map(item => {
          const entry = item as Record<string, unknown>;
          return {
            ...entry,
            profiles: Array.isArray(entry.profiles) ? entry.profiles[0] : entry.profiles
          } as LeaderboardEntry;
        });
        setLeaderboard(formatted);
      }
      setLoading(false);
    }

    fetchLeaderboard();
  }, [filter]);

  if (inRace) {
    return (
      <AppLayout>
        <RaceEngine onExit={() => setInRace(false)} />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex-1 overflow-y-auto bg-bg">
        <div className="layout-container py-12 px-6">
          <div className="flex flex-col lg:grid lg:grid-cols-[1fr_360px] gap-10">
            
            {/* Left: Main Content */}
            <div className="flex flex-col gap-10">
              {/* Header */}
              <div className="flex flex-col gap-3">
                <div className="inline-flex items-center gap-2 text-accent font-mono text-[10px] uppercase tracking-[0.2em] font-bold">
                  <Flag size={14} className="animate-pulse" />
                  Live Competition
                </div>
                <h1 className="font-display text-4xl font-bold text-ink">Arena</h1>
                <p className="text-ink-3 text-[14px] max-w-[500px] leading-relaxed">
                  Join a live sprint, challenge your friends, and climb the global ranks. 
                  Speed is the only currency here.
                </p>
              </div>

              {/* Race Call to Action */}
              <div className="p-1 rounded-3xl bg-gradient-to-br from-accent-light/10 via-accent/5 to-accent-strong/10 border border-accent/20">
                <div className="bg-surface rounded-[22px] p-8 flex flex-col md:flex-row items-center gap-8 justify-between shadow-2xl shadow-accent/5">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-accent shadow-xl shadow-accent/30 flex items-center justify-center text-white rotate-3">
                      <Car size={32} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-xl font-bold text-ink tracking-tight">Rapid Sprint</h3>
                      <p className="text-ink-3 text-[13px] max-w-[320px]">
                        The ultimate test of focus. Race against your personal best &quot;ghost car&quot;.
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setInRace(true)}
                    className="flex items-center gap-3 px-8 py-4 rounded-full bg-accent text-white font-bold text-[14px] hover:brightness-110 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-accent/20 group"
                  >
                    <Play size={16} fill="white" />
                    Enter Race Track
                  </button>
                </div>
              </div>

              {/* Leaderboard */}
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Trophy className="text-gold" size={20} />
                    <h3 className="text-lg font-bold text-ink">Hall of Fame</h3>
                  </div>
                  <div className="flex gap-1 bg-surface-2 p-1 rounded-xl">
                    {(["today", "week", "month", "all"] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-3 py-1.5 rounded-lg font-mono text-[9px] tracking-widest uppercase transition-all ${
                          filter === f ? "bg-surface text-ink shadow-sm font-bold" : "text-ink-4 hover:text-ink-2"
                        }`}
                      >
                        {f === "all" ? "All Time" : f}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-border bg-surface-2">
                        <th className="px-6 py-4 font-mono text-[9px] uppercase tracking-widest text-ink-3">Rank</th>
                        <th className="px-6 py-4 font-mono text-[9px] uppercase tracking-widest text-ink-3">Typist</th>
                        <th className="px-6 py-4 font-mono text-[9px] uppercase tracking-widest text-ink-3">Speed</th>
                        <th className="px-6 py-4 font-mono text-[9px] uppercase tracking-widest text-ink-3">Accuracy</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        [...Array(5)].map((_, i) => (
                          <tr key={i} className="animate-pulse border-b border-border/50 last:border-0">
                            <td colSpan={4} className="px-6 py-6 h-14 bg-surface-2/40" />
                          </tr>
                        ))
                      ) : leaderboard.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-20 text-center text-ink-4 font-mono text-xs uppercase">No entries yet</td>
                        </tr>
                      ) : (
                        leaderboard.map((entry, idx) => {
                          const isCurrentUser = entry.user_id === user?.id;
                          return (
                            <tr key={idx} className={`border-b border-border/50 last:border-0 transition-colors hover:bg-surface-2 ${isCurrentUser ? "bg-accent/5" : ""}`}>
                              <td className="px-6 py-5">
                                <div className={`w-6 h-6 rounded-md flex items-center justify-center font-mono text-[11px] font-bold ${
                                  idx === 0 ? "bg-gold/10 text-gold" : 
                                  idx === 1 ? "bg-silver/10 text-silver" : 
                                  idx === 2 ? "bg-bronze/10 text-bronze" : "text-ink-4"
                                }`}>
                                  {idx + 1}
                                </div>
                              </td>
                              <td className="px-6 py-5">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-surface-3 flex items-center justify-center font-bold text-[10px] border border-border">
                                    {entry.profiles?.username?.slice(0, 2).toUpperCase() || "??"}
                                  </div>
                                  <span className={`text-[13px] font-bold ${isCurrentUser ? "text-accent" : "text-ink"}`}>
                                    {entry.profiles?.username || "Anonymous"}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-5">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-mono text-[16px] font-bold text-ink">{entry.wpm}</span>
                                  <span className="font-mono text-[9px] text-ink-4 uppercase">WPM</span>
                                </div>
                              </td>
                              <td className="px-6 py-5">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-mono text-[14px] font-medium text-ink-3">{entry.accuracy}%</span>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right: Sidebar Stats */}
            <div className="flex flex-col gap-6">
               <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-ink mb-4 flex items-center gap-2">
                    <Award size={18} className="text-accent" />
                    Arena Stats
                  </h3>
                  <div className="flex flex-col gap-4">
                    <div className="p-4 rounded-xl bg-surface-2 border border-border flex justify-between items-center">
                      <span className="text-xs text-ink-3 font-medium">Rank Position</span>
                      <span className="font-mono text-sm font-bold text-ink">#—</span>
                    </div>
                    <div className="p-4 rounded-xl bg-surface-2 border border-border flex justify-between items-center">
                      <span className="text-xs text-ink-3 font-medium">Global Percentile</span>
                      <span className="font-mono text-sm font-bold text-ink">Top 100%</span>
                    </div>
                  </div>
               </div>

               <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-ink mb-4 flex items-center gap-2 text-sm uppercase tracking-wider font-mono">
                    <Users size={16} />
                    Active Online
                  </h3>
                  <div className="flex flex-col gap-3">
                    <p className="text-xs text-ink-3">Join the community and test your skills in real-time.</p>
                    <div className="flex -space-x-2">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full bg-surface-2 border border-surface shadow-sm" />
                      ))}
                      <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-[10px] text-white font-bold border border-surface shadow-sm">
                        +12
                      </div>
                    </div>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function RaceEngine({ onExit }: { onExit: () => void }) {
  const raceText = "The quick brown fox jumps over the lazy dog. Swift action requires perfect coordination between mind and fingers. Every race is a chance to push your limits and achieve typing transcendence.";
  const engine = useTypingEngine(raceText, 0, "Advanced");
  const { text, typed, isActive, isFinished, stats, handleInput, startTest, inputRef } = engine;

  const progress = (typed.length / text.length) * 100;
  
  return (
    <div className="flex-1 flex flex-col bg-bg overflow-hidden relative">
      <div className="px-8 py-4 border-b border-border bg-surface flex items-center justify-between">
         <div className="flex items-center gap-4">
            <button onClick={onExit} className="text-ink-4 hover:text-ink text-xs font-bold uppercase tracking-widest font-mono">Exit</button>
            <div className="w-px h-4 bg-border" />
            <div className="text-sm font-bold text-ink">Solo Sprint</div>
         </div>
         <div className="flex items-center gap-6">
            <div className="flex flex-col items-center">
               <span className="text-[10px] font-mono uppercase text-ink-4">WPM</span>
               <span className="text-xl font-mono font-bold text-accent">{stats.wpm}</span>
            </div>
            <div className="flex flex-col items-center">
               <span className="text-[10px] font-mono uppercase text-ink-4">Accuracy</span>
               <span className="text-xl font-mono font-bold text-green">{stats.accuracy}%</span>
            </div>
         </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-12 p-8">
        
        {/* The Track */}
        <div className="w-full max-w-[900px] h-32 bg-surface-2 rounded-2xl relative border-y-2 border-border/50 flex flex-col justify-center gap-4 px-6 overflow-hidden">
           {/* Lane 1: User */}
           <div className="relative h-10 w-full bg-ink/5 rounded-full border border-ink/10 overflow-hidden">
              <div 
                className="absolute top-0 bottom-0 left-0 bg-accent transition-all duration-300 shadow-[0_0_20px_var(--accent)]" 
                style={{ width: `${progress}%` }} 
              />
              <div 
                className="absolute top-1/2 -translate-y-1/2 transition-all duration-300"
                style={{ left: `calc(${progress}% - 20px)` }}
              >
                <div className="bg-white text-accent w-10 h-6 rounded flex items-center justify-center shadow-lg ring-2 ring-accent">
                   <Car size={16} fill="currentColor" />
                </div>
              </div>
           </div>

           {/* Finish Line Flag */}
           <div className="absolute right-0 top-0 bottom-0 w-8 flex items-center justify-center bg-checkered bg-[length:16px_16px] opacity-20 border-l border-border" />
        </div>

        {/* Typing Zone */}
        <div 
          className="bg-surface border-2 border-border rounded-3xl p-10 max-w-[840px] w-full shadow-2xl relative cursor-text group"
          onClick={() => inputRef.current?.focus()}
        >
          <div className="font-mono text-[24px] leading-[1.8] text-ink-4 text-center select-none break-words">
            {text.split('').map((char, i) => {
              let charClass = "relative ";
              if (i < typed.length) {
                charClass += typed[i] === char ? "text-ink " : "text-error bg-error/10 rounded-[2px] ";
              }
              if (i === typed.length && isActive) charClass += "text-ink after:content-[''] after:absolute after:left-0 after:top-[4px] after:bottom-[4px] after:w-[3px] after:bg-accent after:animate-blink";
              return <span key={i} className={charClass}>{char === ' ' ? '\u00A0' : char}</span>;
            })}
          </div>

          <input
            ref={inputRef}
            type="text"
            className="absolute opacity-0 w-px h-px pointer-events-none"
            value={typed}
            onChange={(e) => handleInput(e.target.value)}
            autoComplete="off"
          />

          {!isActive && !isFinished && (
            <div className="absolute inset-0 bg-surface/60 backdrop-blur-sm flex items-center justify-center rounded-3xl group-hover:bg-surface/40 transition-all cursor-pointer" onClick={startTest}>
                <div className="bg-accent text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 shadow-2xl">
                   Ready to Sprint?
                   <Play size={16} fill="white" />
                </div>
            </div>
          )}
        </div>

      </div>

      {isFinished && (
        <div className="absolute inset-0 z-[100] bg-bg/90 backdrop-blur-xl flex items-center justify-center p-6">
           <div className="bg-surface border border-border rounded-[32px] p-12 max-w-[480px] w-full shadow-2xl text-center flex flex-col items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                 <Trophy size={40} />
              </div>
              <h2 className="text-3xl font-bold text-ink">Race Finished!</h2>
              <div className="grid grid-cols-2 gap-4 w-full">
                 <div className="p-4 rounded-2xl bg-surface-2 border border-border">
                    <div className="text-[10px] font-mono uppercase text-ink-4 mb-1">Final Speed</div>
                    <div className="text-2xl font-mono font-bold text-ink">{stats.wpm} WPM</div>
                 </div>
                 <div className="p-4 rounded-2xl bg-surface-2 border border-border">
                    <div className="text-[10px] font-mono uppercase text-ink-4 mb-1">Accuracy</div>
                    <div className="text-2xl font-mono font-bold text-ink">{stats.accuracy}%</div>
                 </div>
              </div>
              <button 
                onClick={onExit}
                className="w-full py-4 rounded-2xl bg-accent text-white font-bold text-sm shadow-xl shadow-accent/20"
              >
                Back to Arena
              </button>
           </div>
        </div>
      )}
    </div>
  );
}
