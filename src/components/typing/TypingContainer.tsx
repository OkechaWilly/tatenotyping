"use client";

import { useTypingContext } from "@/context/TypingContext";
import StatsBar from "./StatsBar";
import TypingEngine from "./TypingEngine";
import { useTypingEngine, TypingStats } from "@/hooks/useTypingEngine";
import { useAuth } from "@/context/AuthContext";
import { TYPING_DATA } from "@/data/typingData";
import { useEffect, useState, useCallback } from "react";

export default function TypingContainer() {
  const { duration, mode, difficulty } = useTypingContext();
  const { user } = useAuth();
  const [text, setText] = useState("");
  
  // Optimize text selection and load instantly
  useEffect(() => {
    const data = TYPING_DATA[mode as keyof typeof TYPING_DATA] || TYPING_DATA.words;
    let newText = "";
    
    if (mode === "realworld") {
      const proseData = TYPING_DATA.prose;
      newText = proseData[Math.floor(Math.random() * proseData.length)];
    } else if (mode === "words" || mode === "numbers") {
      newText = [...data].sort(() => Math.random() - 0.5).slice(0, 25).join(" ");
    } else {
      newText = data[Math.floor(Math.random() * data.length)];
    }
    
    setText(newText);
  }, [mode]);

  const handleSessionComplete = useCallback(async (stats: TypingStats) => {
    if (!user) return; 
    
    const { saveSession } = await import("@/lib/supabase/sessions");
    await saveSession({
      userId: user.id,
      stats,
      mode,
      duration,
      textUsed: text,
    });
  }, [user, mode, duration, text]);

  const engine = useTypingEngine(text, duration, difficulty, handleSessionComplete);
  const { resetTest } = engine;

  // Sync engine with text updates, but only when properties that define the test change
  useEffect(() => {
    if (text) {
      resetTest(text);
    }
  }, [text, duration, difficulty, resetTest]);

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
        <TypingEngine engine={engine} mode={mode} />
      </div>
    </main>
  );
}
