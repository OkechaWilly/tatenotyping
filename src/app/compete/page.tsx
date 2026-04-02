"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef, useCallback } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { Trophy, Users, Flag, Play, Car, Award, Ghost } from "lucide-react";
import { useTypingEngine } from "@/hooks/useTypingEngine";
import { TYPING_DATA } from "@/data/typingData";

interface LeaderboardEntry {
  user_id: string;
  wpm: number;
  accuracy: number;
  profiles: {
    username: string;
    avatar_url: string | null;
  };
}

// Get a passage for racing
function getRaceText(): string {
  const passages = TYPING_DATA.quotes as string[];
  if (passages && passages.length > 0) {
    return passages[Math.floor(Math.random() * passages.length)];
  }
  return "The quick brown fox jumps over the lazy dog. Speed is the art of thinking clearly under pressure. Every keystroke is a small victory against hesitation and doubt.";
}

export default function CompetePage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<"all" | "month" | "week" | "today">("all");
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [inRace, setInRace] = useState(false);
  const [raceText] = useState(() => getRaceText());

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
        <RaceEngine onExit={() => setInRace(false)} raceText={raceText} />
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
                  Race Arena
                </div>
                <h1 className="font-display text-4xl font-bold text-ink">Arena</h1>
                <p className="text-ink-3 text-[14px] max-w-[500px] leading-relaxed">
                  Race against your personal ghost — a cursor that moves at your all-time best WPM.
                  Beat yourself to level up.
                </p>
              </div>

              {/* Race CTA */}
              <div className="p-1 rounded-3xl bg-gradient-to-br from-accent-light/10 via-accent/5 to-accent-strong/10 border border-accent/20">
                <div className="bg-surface rounded-[22px] p-8 flex flex-col md:flex-row items-center gap-8 justify-between shadow-2xl shadow-accent/5">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-accent shadow-xl shadow-accent/30 flex items-center justify-center text-white rotate-3">
                      <Ghost size={32} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-xl font-bold text-ink tracking-tight">Ghost Race</h3>
                      <p className="text-ink-3 text-[13px] max-w-[320px]">
                        Race your personal ghost car — powered by your best-ever WPM. Can you outpace yourself?
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setInRace(true)}
                    className="flex items-center gap-3 px-8 py-4 rounded-full bg-accent text-white font-bold text-[14px] hover:brightness-110 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-accent/20"
                  >
                    <Play size={16} fill="white" />
                    Race Your Ghost
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
                          <td colSpan={4} className="px-6 py-20 text-center text-ink-4 font-mono text-xs uppercase">
                            No entries yet — be the first!
                          </td>
                        </tr>
                      ) : (
                        leaderboard.map((entry, idx) => {
                          const isCurrentUser = entry.user_id === user?.id;
                          return (
                            <tr key={idx} className={`border-b border-border/50 last:border-0 transition-colors hover:bg-surface-2 ${isCurrentUser ? "bg-accent/5" : ""}`}>
                              <td className="px-6 py-5">
                                <div className={`w-6 h-6 rounded-md flex items-center justify-center font-mono text-[11px] font-bold ${
                                  idx === 0 ? "bg-yellow-500/10 text-yellow-500" :
                                  idx === 1 ? "bg-slate-400/10 text-slate-400" :
                                  idx === 2 ? "bg-orange-600/10 text-orange-600" : "text-ink-4"
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
                                    {isCurrentUser && <span className="ml-1.5 text-[9px] font-mono text-accent/60 uppercase tracking-widest">(you)</span>}
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
                                <span className="font-mono text-[14px] font-medium text-ink-3">{entry.accuracy}%</span>
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

            {/* Right: Sidebar */}
            <div className="flex flex-col gap-6">
              <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-ink mb-4 flex items-center gap-2">
                  <Award size={18} className="text-accent" />
                  Arena Stats
                </h3>
                <div className="flex flex-col gap-3">
                  <div className="p-4 rounded-xl bg-surface-2 border border-border flex justify-between items-center">
                    <span className="text-xs text-ink-3 font-medium">Leaderboard Entries</span>
                    <span className="font-mono text-sm font-bold text-ink">{leaderboard.length}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-2 border border-border flex justify-between items-center">
                    <span className="text-xs text-ink-3 font-medium">Top Speed</span>
                    <span className="font-mono text-sm font-bold text-ink">
                      {leaderboard[0]?.wpm ?? "—"} WPM
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-ink mb-3 flex items-center gap-2 text-sm uppercase tracking-wider font-mono">
                  <Users size={16} />
                  How Ghost Works
                </h3>
                <div className="flex flex-col gap-2 text-xs text-ink-3 leading-relaxed">
                  <p>👻 Your ghost moves at your <span className="text-ink font-medium">personal best WPM</span>.</p>
                  <p>🏎️ If you overtake it, you&apos;ve <span className="text-green font-medium">set a new record</span>.</p>
                  <p>⚡ Each race result is saved and updates your best.</p>
                  <p>🏆 Beat your ghost to earn the <span className="text-accent font-medium">Ghost Slayer</span> badge.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </AppLayout>
  );
}

// ─── Ghost Race Engine ──────────────────────────────────────────────────────

import { useToast } from "@/context/ToastContext";
// ... Note: the import goes to the top automatically since I am editing the engine component only here... actually I better just grab it. Wait, I will edit the RaceEngine block.
// Wait, I will just edit the race engine directly, but I must import it at the top. I'll pass useToast to RaceEngine, wait, it's all in one file, so I can just import useToast at the top of the file!

function RaceEngine({ onExit, raceText }: { onExit: () => void; raceText: string }) {
  const { user } = useAuth();
  const { addAchievementToast } = useToast();
  const [bestWpm, setBestWpm] = useState<number>(60); // Default ghost speed
  const [ghostProgress, setGhostProgress] = useState(0);
  const [raceStarted, setRaceStarted] = useState(false);
  const [raceResult, setRaceResult] = useState<{ won: boolean; userWpm: number; ghostWpm: number } | null>(null);
  const ghostAnimRef = useRef<number | null>(null);
  const ghostStartRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Fetch user's personal best WPM
  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("sessions")
        .select("wpm")
        .eq("user_id", user.id)
        .order("wpm", { ascending: false })
        .limit(1)
        .single();
      if (data) setBestWpm(data.wpm);
    };
    fetch();
  }, [user]);

  const handleComplete = useCallback(
    async (stats: { wpm: number; accuracy: number; errors: number; rawWpm: number; bestWpm: number }, keyStats: Record<string, { attempts: number; errors: number }>) => {
      if (ghostAnimRef.current) cancelAnimationFrame(ghostAnimRef.current);

      const won = stats.wpm > bestWpm;
      setRaceResult({ won, userWpm: stats.wpm, ghostWpm: bestWpm });

      if (!user) return;
      const { saveSession } = await import("@/lib/supabase/sessions");
      const duration = startTimeRef.current
        ? Math.round((Date.now() - startTimeRef.current) / 1000)
        : 0;
      const res = await saveSession({
        userId: user.id,
        stats,
        mode: "ghost-race",
        duration,
        textUsed: raceText,
        keyStats,
      });

      if (res.newlyUnlocked) {
         res.newlyUnlocked.forEach((key: string) => addAchievementToast(key));
      }

      // Unlock ghost-slayer achievement
      if (won) {
        const supabase = createClient();
        const { data: existing } = await supabase.from("achievements").select("*").eq("user_id", user.id).eq("achievement_key", "ghost-slayer").single();
        if (!existing) {
          await supabase.from("achievements").insert({ user_id: user.id, achievement_key: "ghost-slayer", unlocked_at: new Date().toISOString() });
          addAchievementToast("ghost-slayer");
        }
      }
    },
    [user, bestWpm, raceText, addAchievementToast]
  );

  const engine = useTypingEngine(raceText, 0, "Beginner", handleComplete);
  const { text, typed, isActive, isFinished, stats, handleInput, startTest, inputRef } = engine;

  const userProgress = text.length > 0 ? (typed.length / text.length) * 100 : 0;

  // Animate ghost cursor using requestAnimationFrame
  const animateGhost = useCallback(() => {
    if (!ghostStartRef.current) return;
    const elapsed = (Date.now() - ghostStartRef.current) / 1000; // seconds
    const charsPerSecond = (bestWpm * 5) / 60;
    const charsCompleted = elapsed * charsPerSecond;
    const progress = Math.min(100, (charsCompleted / text.length) * 100);
    setGhostProgress(progress);

    if (progress < 100) {
      ghostAnimRef.current = requestAnimationFrame(animateGhost);
    }
  }, [bestWpm, text.length]);

  const handleStart = useCallback(() => {
    setRaceStarted(true);
    ghostStartRef.current = Date.now();
    startTimeRef.current = Date.now();
    ghostAnimRef.current = requestAnimationFrame(animateGhost);
    startTest();
  }, [animateGhost, startTest]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !isActive && !isFinished && !raceStarted) {
        handleStart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (ghostAnimRef.current) cancelAnimationFrame(ghostAnimRef.current);
    };
  }, [isActive, isFinished, raceStarted, handleStart]);

  return (
    <div className="flex-1 flex flex-col bg-bg overflow-hidden relative" onClick={() => inputRef.current?.focus()}>
      {/* Top Bar */}
      <div className="px-6 sm:px-8 py-4 border-b border-border bg-surface flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onExit} className="text-ink-4 hover:text-ink text-xs font-bold uppercase tracking-widest font-mono transition-colors">
            ← Exit
          </button>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-ink uppercase tracking-widest">
            <Ghost size={14} className="text-ink-3" />
            Ghost Race
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center">
            <span className="text-[9px] font-mono uppercase text-ink-4">You</span>
            <span className="text-xl font-mono font-bold text-accent">{stats.wpm}</span>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="flex flex-col items-center">
            <span className="text-[9px] font-mono uppercase text-ink-4">Ghost</span>
            <span className="text-xl font-mono font-bold text-ink-3">{bestWpm}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-8 px-4 sm:px-8 py-8">

        {/* Race Track */}
        <div className="w-full max-w-[860px] flex flex-col gap-3">
          {/* Ghost lane */}
          <div className="flex items-center gap-3">
            <div className="w-16 font-mono text-[10px] text-ink-3 uppercase text-right shrink-0">Ghost</div>
            <div className="relative flex-1 h-10 bg-surface-2 rounded-full border border-border overflow-hidden">
              <div
                className="absolute top-0 bottom-0 left-0 bg-ink-3/20 transition-none rounded-full"
                style={{ width: `${ghostProgress}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 transition-none"
                style={{ left: `calc(${Math.max(0, ghostProgress - 3)}% )` }}
              >
                <div className="w-8 h-6 rounded-md bg-surface text-ink-3 border border-border flex items-center justify-center text-[10px] shadow-sm">
                  👻
                </div>
              </div>
            </div>
            <div className="w-10 font-mono text-[11px] text-ink-3 font-bold shrink-0">{Math.round(ghostProgress)}%</div>
          </div>

          {/* User lane */}
          <div className="flex items-center gap-3">
            <div className="w-16 font-mono text-[10px] text-accent uppercase text-right shrink-0 font-bold">You</div>
            <div className="relative flex-1 h-10 bg-surface-2 rounded-full border border-accent/20 overflow-hidden">
              <div
                className="absolute top-0 bottom-0 left-0 bg-accent/20 rounded-full transition-all duration-300"
                style={{ width: `${userProgress}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 transition-all duration-300"
                style={{ left: `calc(${Math.max(0, userProgress - 3)}%)` }}
              >
                <div className="w-8 h-6 rounded-md bg-accent text-white flex items-center justify-center shadow-lg shadow-accent/30">
                  <Car size={14} fill="white" />
                </div>
              </div>
            </div>
            <div className="w-10 font-mono text-[11px] text-accent font-bold shrink-0">{Math.round(userProgress)}%</div>
          </div>

          {/* Finish line indicator */}
          <div className="flex items-center gap-3">
            <div className="w-16 shrink-0" />
            <div className="flex-1 flex items-center justify-end pr-2">
              <div className="font-mono text-[9px] text-ink-4 uppercase tracking-widest flex items-center gap-1">
                <Flag size={10} /> Finish
              </div>
            </div>
            <div className="w-10 shrink-0" />
          </div>
        </div>

        {/* Text area */}
        <div className="bg-surface border border-border rounded-2xl px-6 sm:px-10 py-8 max-w-[860px] w-full shadow-sm relative cursor-text">
          <div className={`absolute left-0 top-0 bottom-0 w-1 bg-accent rounded-l-2xl transition-opacity ${isActive ? "opacity-100" : "opacity-0"}`} />

          <div className="font-mono text-[18px] sm:text-[20px] leading-[2] tracking-[0.04em] text-pending select-none break-words text-center">
            {text.split("").map((char, i) => {
              let cls = "relative transition-all duration-75 ";
              if (i < typed.length) {
                cls += typed[i] === char ? "text-ink " : "text-error bg-error/10 rounded-sm ";
              }
              if (i === typed.length && isActive) cls += "text-ink border-b-2 border-accent animate-pulse";
              return <span key={i} className={cls}>{char === " " ? "\u00A0" : char}</span>;
            })}
          </div>

          <input
            ref={inputRef}
            type="text"
            className="absolute opacity-0 w-px h-px pointer-events-none"
            value={typed}
            onChange={(e) => handleInput(e.target.value)}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />

          {!isActive && !isFinished && (
            <div
              className="absolute inset-0 flex items-center justify-center rounded-2xl bg-surface/50 backdrop-blur-[2px] cursor-pointer group"
              onClick={handleStart}
            >
              <div className="flex items-center gap-3 bg-accent text-white px-8 py-3.5 rounded-full font-bold text-[14px] shadow-2xl shadow-accent/20 pointer-events-none group-hover:-translate-y-1 transition-transform">
                <Play size={16} fill="white" />
                Start Race
                <kbd className="bg-white/20 rounded px-1.5 py-px font-mono text-[11px] ml-1">Enter</kbd>
              </div>
            </div>
          )}
        </div>

        {/* Live WPM bar */}
        {isActive && (
          <div className="flex items-center gap-4 w-full max-w-[860px]">
            <div className="font-mono text-[10px] text-ink-3 uppercase shrink-0">Live WPM</div>
            <div className="flex-1 h-1.5 bg-surface-2 rounded-full overflow-hidden border border-border">
              <div
                className="h-full bg-accent rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (stats.wpm / Math.max(bestWpm, 60)) * 100)}%` }}
              />
            </div>
            <div className="font-mono text-[11px] text-ink font-bold shrink-0">{stats.wpm} WPM</div>
          </div>
        )}
      </div>

      {/* Result Modal */}
      {isFinished && raceResult && (
        <div className="absolute inset-0 z-50 bg-bg/90 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="bg-surface border border-border rounded-3xl p-10 max-w-[500px] w-full shadow-2xl text-center flex flex-col items-center gap-5">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl ${raceResult.won ? "bg-green/10" : "bg-surface-2"}`}>
              {raceResult.won ? "🏆" : "👻"}
            </div>
            <h2 className="font-display text-3xl font-bold text-ink">
              {raceResult.won ? "You Beat Your Ghost!" : "Ghost Wins This Time"}
            </h2>
            <p className="text-ink-3 text-[13px]">
              {raceResult.won
                ? "New personal best! Your ghost just got faster."
                : `You were ${raceResult.ghostWpm - raceResult.userWpm} WPM behind your ghost. Keep pushing!`}
            </p>

            <div className="grid grid-cols-2 gap-4 w-full py-2">
              <div className="flex flex-col items-center p-4 rounded-2xl bg-accent/5 border border-accent/20">
                <div className="text-[10px] font-mono uppercase text-accent/60 mb-1">You</div>
                <div className="font-mono text-3xl font-bold text-accent">{raceResult.userWpm}</div>
                <div className="text-[9px] font-mono uppercase text-ink-4">WPM</div>
              </div>
              <div className="flex flex-col items-center p-4 rounded-2xl bg-surface-2 border border-border">
                <div className="text-[10px] font-mono uppercase text-ink-4 mb-1"> Ghost</div>
                <div className={`font-mono text-3xl font-bold ${raceResult.won ? "text-ink-3 line-through" : "text-ink"}`}>{raceResult.ghostWpm}</div>
                <div className="text-[9px] font-mono uppercase text-ink-4">WPM</div>
              </div>
            </div>

            <div className="flex gap-3 w-full">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 py-3 rounded-2xl bg-accent text-white font-bold text-[13px] shadow-lg shadow-accent/20 hover:brightness-110 transition-all"
              >
                Race Again
              </button>
              <button
                onClick={onExit}
                className="flex-1 py-3 rounded-2xl border border-border bg-surface-2 text-ink font-bold text-[13px] hover:bg-surface-3 transition-all"
              >
                Exit Arena
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
