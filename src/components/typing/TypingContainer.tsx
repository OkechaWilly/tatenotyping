"use client";

import { useTypingContext } from "@/context/TypingContext";
import StatsBar from "./StatsBar";
import TypingEngine from "./TypingEngine";
import { useTypingEngine, TypingStats } from "@/hooks/useTypingEngine";
import { createClient } from "@/lib/supabase/client";

const DEFAULT_TEXT = "the quick brown fox jumps over the lazy dog while the sun sets behind the mountains casting long shadows across the valley floor every great developer you know got there by solving problems";

export default function TypingContainer() {
  const { duration, mode } = useTypingContext();
  
  const handleSessionComplete = async (stats: TypingStats) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return; // guest mode — don't save
    
    await supabase.from("sessions").insert({
      user_id: user.id,
      wpm: stats.wpm,
      raw_wpm: stats.rawWpm,
      accuracy: stats.accuracy,
      errors: stats.errors,
      mode: mode,
      duration: duration,
    });
  };

  const engine = useTypingEngine(DEFAULT_TEXT, duration, handleSessionComplete);

  return (
    <main className="flex flex-col bg-bg overflow-hidden relative flex-1">
      <StatsBar
        wpm={engine.isActive || engine.isFinished ? engine.stats.wpm : null}
        rawWpm={engine.isActive || engine.isFinished ? engine.stats.rawWpm : null}
        accuracy={engine.isActive || engine.isFinished ? engine.stats.accuracy : null}
        errors={engine.stats.errors}
        timeLeft={engine.timeLeft}
        totalTime={duration}
      />
      <div className="flex-1 overflow-hidden">
        <TypingEngine engine={engine} />
      </div>
    </main>
  );
}
