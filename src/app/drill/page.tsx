"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { useTypingEngine } from "@/hooks/useTypingEngine";
import Keyboard from "@/components/lessons/Keyboard";
import { ChevronLeft, Zap, Target, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

// Word lists weighted by how common each key appears
const WORD_BANK: Record<string, string[]> = {
  a: ["attach", "apart", "alpha", "canal", "drama", "fatal", "label", "panda"],
  b: ["blank", "brave", "brief", "brain", "build", "bridge", "brown", "batch"],
  c: ["catch", "chart", "check", "child", "claim", "clean", "clear", "clock"],
  d: ["dance", "debug", "delta", "dense", "draft", "drive", "drown", "dusty"],
  e: ["elect", "elite", "ember", "enter", "event", "every", "excel", "exact"],
  f: ["faith", "fancy", "fiber", "field", "final", "flame", "flash", "float"],
  g: ["gauge", "giant", "given", "glass", "gland", "globe", "grace", "graph"],
  h: ["habit", "happy", "harsh", "heart", "heavy", "hinge", "honor", "human"],
  i: ["ideal", "image", "imply", "index", "inner", "input", "issue", "ivory"],
  j: ["jazzy", "joint", "judge", "juice", "jumpy", "juror", "label", "jaunt"],
  k: ["knife", "knock", "known", "kudos", "kayak", "kneel", "kitty", "knack"],
  l: ["label", "lance", "laser", "later", "layer", "legal", "level", "light"],
  m: ["magic", "major", "march", "match", "model", "month", "moral", "motor"],
  n: ["naive", "nerve", "night", "noble", "noise", "north", "noted", "novel"],
  o: ["ocean", "offer", "olive", "onion", "onset", "opera", "orbit", "order"],
  p: ["paint", "panel", "paper", "patch", "pause", "peace", "phase", "pilot"],
  q: ["query", "queue", "quest", "quick", "quiet", "quirk", "quote", "quill"],
  r: ["radar", "raise", "range", "rapid", "reach", "realm", "relay", "reply"],
  s: ["saint", "scale", "scene", "scope", "serve", "shale", "share", "shift"],
  t: ["table", "taken", "taste", "teach", "their", "theme", "thick", "think"],
  u: ["ultra", "under", "union", "unity", "upper", "urban", "usage", "usual"],
  v: ["valid", "valor", "value", "video", "viral", "vital", "voice", "voted"],
  w: ["watch", "water", "width", "witch", "world", "worry", "worth", "write"],
  x: ["exact", "extra", "excel", "exist", "xenon", "expel", "exert", "exude"],
  y: ["yacht", "young", "yield", "yummy", "years", "yards", "yawns", "yearn"],
  z: ["zebra", "zonal", "zones", "zesty", "zilch", "zingy", "zippy", "zooms"],
};

function generateDrillText(weakKeys: string[]): string {
  if (weakKeys.length === 0) {
    return "Keep practicing to identify your weak keys through performance analysis.";
  }
  const words: string[] = [];
  for (let i = 0; i < 20; i++) {
    const key = weakKeys[i % weakKeys.length];
    const pool = WORD_BANK[key.toLowerCase()] || WORD_BANK["a"];
    words.push(pool[Math.floor(Math.random() * pool.length)]);
  }
  // Shuffle a bit but keep key-targeted words prominent
  return words.join(" ");
}

interface WeakKeyData {
  key_char: string;
  error_count: number;
  total_attempts: number;
  error_rate: number;
}

export default function SmartDrillPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [weakKeys, setWeakKeys] = useState<WeakKeyData[]>([]);
  const [drillText, setDrillText] = useState("");
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [drillResult, setDrillResult] = useState<{ wpm: number; accuracy: number } | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const handleComplete = useCallback(
    async (stats: { wpm: number; accuracy: number; errors: number; rawWpm: number; bestWpm: number }, keyStats: Record<string, { attempts: number; errors: number }>) => {
      setDrillResult({ wpm: stats.wpm, accuracy: stats.accuracy });
      if (!user) return;
      const { saveSession } = await import("@/lib/supabase/sessions");
      const duration = startTimeRef.current
        ? Math.round((Date.now() - startTimeRef.current) / 1000)
        : 0;
      await saveSession({
        userId: user.id,
        stats,
        mode: "smart-drill",
        duration,
        textUsed: drillText,
        keyStats,
      });
    },
    [user, drillText]
  );

  const engine = useTypingEngine(
    mounted ? drillText : "",
    0,
    "Beginner",
    handleComplete
  );
  const { text, typed, isActive, isFinished, startTest, resetTest, handleInput, inputRef, keyStats } = engine;
  const targetKey = text[Math.min(typed.length, text.length - 1)];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("weak_keys")
        .select("key_char, error_count, total_attempts")
        .eq("user_id", user.id)
        .order("error_count", { ascending: false })
        .limit(5);

      if (data && data.length > 0) {
        const enriched = data
          .filter((d) => d.total_attempts > 0)
          .map((d) => ({
            ...d,
            error_rate: Math.round((d.error_count / d.total_attempts) * 100),
          }));
        setWeakKeys(enriched);
        const keys = enriched.map((d) => d.key_char);
        const text = generateDrillText(keys);
        setDrillText(text);
        if (mounted) resetTest(text);
      } else {
        // No data yet — use home row for beginners
        const homeDrill = generateDrillText(["a", "s", "d", "f", "j", "k", "l"]);
        setDrillText(homeDrill);
        if (mounted) resetTest(homeDrill);
      }
      setLoading(false);
    };
    fetch();
  }, [user, mounted, resetTest]);

  const regenerateDrill = () => {
    setDrillResult(null);
    const keys = weakKeys.length > 0 ? weakKeys.map((d) => d.key_char) : ["a", "s", "d", "f"];
    const newText = generateDrillText(keys);
    setDrillText(newText);
    resetTest(newText);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !isActive && !isFinished) {
        startTimeRef.current = Date.now();
        startTest();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isActive, isFinished, startTest]);

  return (
    <div className="min-h-screen bg-bg flex flex-col" onClick={() => inputRef.current?.focus()}>
      {/* Top bar */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-border bg-surface shrink-0">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-ink-3 hover:text-accent transition-colors group"
        >
          <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
          <span className="font-mono text-[10px] uppercase tracking-widest font-bold">Back</span>
        </button>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-2">
          <Target size={14} className="text-accent" />
          <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-ink">
            Smart Drill
          </span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={regenerateDrill}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface-2 font-mono text-[10px] text-ink-3 hover:text-ink hover:border-ink-4 transition-all"
          >
            <RefreshCw size={11} />
            New Drill
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center px-4 sm:px-8 py-8 gap-6 max-w-[760px] mx-auto w-full">
        {/* Weak keys summary */}
        <div className="w-full bg-surface border border-border rounded-xl p-5">
          <div className="font-mono text-[10px] uppercase tracking-widest text-ink-3 mb-3">
            Targeting Your Weak Keys
          </div>
          {loading ? (
            <div className="font-mono text-[11px] text-ink-3">Analyzing your session history…</div>
          ) : weakKeys.length === 0 ? (
            <div className="font-mono text-[11px] text-ink-3">
              No data yet — this drill uses the home row to get you started.
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {weakKeys.map((k) => (
                <div key={k.key_char} className="flex flex-col items-center gap-1">
                  <div className="w-9 h-9 rounded-lg border-2 border-accent bg-accent/10 flex items-center justify-center font-mono text-[14px] font-bold text-accent">
                    {k.key_char.toUpperCase()}
                  </div>
                  <div className="font-mono text-[9px] text-ink-3">{k.error_rate}% err</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drill text area */}
        <div
          className="bg-surface border border-border rounded-xl px-6 sm:px-8 py-8 w-full shadow-sm relative cursor-text group"
        >
          <div className={`absolute left-0 top-0 bottom-0 w-[4px] bg-accent rounded-l-lg transition-opacity ${isActive ? "opacity-100" : "opacity-0"}`} />

          <div className="font-mono text-[20px] sm:text-[22px] leading-[2] tracking-[0.04em] text-pending select-none break-words text-center">
            {text.split("").map((char, i) => {
              let cls = "relative transition-all duration-75 ";
              if (i < typed.length) {
                cls += typed[i] === char ? "text-ink " : "text-error bg-error/10 rounded-sm ";
              }
              if (i === typed.length && isActive) {
                cls += "text-ink border-b-2 border-accent animate-pulse";
              }
              return (
                <span key={i} className={cls}>
                  {char === " " ? "\u00A0" : char}
                </span>
              );
            })}
          </div>

          <input
            ref={inputRef}
            type="text"
            className="absolute opacity-0 w-px h-px pointer-events-none"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            value={typed}
            onChange={(e) => handleInput(e.target.value)}
          />

          {!isActive && !isFinished && (
            <div
              className="absolute inset-0 flex items-center justify-center rounded-xl cursor-text bg-surface/40 backdrop-blur-[1px] group"
              onClick={() => {
                startTimeRef.current = Date.now();
                startTest();
              }}
            >
              <div className="flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-full text-[13px] font-bold shadow-xl pointer-events-none group-hover:-translate-y-1 transition-transform">
                <Zap size={14} fill="currentColor" />
                Start Drill
                <kbd className="bg-white/20 rounded px-1.5 py-px font-mono text-[11px] ml-1">Enter</kbd>
              </div>
            </div>
          )}
        </div>

        {/* Keyboard */}
        <div className="hidden sm:block w-full opacity-80 hover:opacity-100 transition-opacity">
          <Keyboard activeKey={!isFinished ? targetKey : ""} />
        </div>

        {/* Current key stats */}
        <div className="flex items-center gap-3 bg-surface-2/50 border border-border rounded-xl px-5 py-3 w-full">
          <div className="w-10 h-10 rounded-xl bg-accent/5 border border-accent/10 flex items-center justify-center font-mono text-base font-bold text-accent shrink-0">
            {targetKey === " " ? "␣" : targetKey?.toUpperCase() || "—"}
          </div>
          <div>
            <div className="text-[13px] font-semibold text-ink">Focus Area</div>
            <div className="text-[11px] text-ink-3">Keep your fingers on the home row between each keystroke.</div>
          </div>
        </div>

        {/* Result overlay */}
        {isFinished && drillResult && (
          <div className="fixed inset-0 z-50 bg-bg/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-surface border border-border rounded-2xl p-8 max-w-[420px] w-full shadow-2xl text-center flex flex-col items-center gap-4">
              <div className="font-mono text-[10px] uppercase tracking-widest text-ink-3">
                Drill Complete
              </div>
              <h2 className="font-display text-3xl font-bold text-ink">
                {drillResult.accuracy >= 90 ? "Great Focus!" : "Keep Drilling"}
              </h2>
              <div className="flex gap-8 py-4 border-y border-border w-full justify-center">
                <div className="flex flex-col items-center">
                  <div className="font-mono text-3xl font-bold text-ink">{drillResult.wpm}</div>
                  <div className="text-[10px] uppercase tracking-widest text-ink-4">WPM</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className={`font-mono text-3xl font-bold ${drillResult.accuracy >= 90 ? "text-green" : "text-error"}`}>
                    {drillResult.accuracy}%
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-ink-4">Accuracy</div>
                </div>
              </div>
              <div className="flex gap-3 w-full">
                <button
                  onClick={regenerateDrill}
                  className="flex-1 px-4 py-3 rounded-xl bg-accent text-white font-bold text-[13px] hover:brightness-110 transition-all"
                >
                  New Drill
                </button>
                <button
                  onClick={() => router.back()}
                  className="flex-1 px-4 py-3 rounded-xl border border-border bg-surface-2 text-ink font-bold text-[13px] hover:bg-surface-3 transition-all"
                >
                  Dashboard
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
