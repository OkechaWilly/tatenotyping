"use client";

import { useTypingContext } from "@/context/TypingContext";
import StatsBar from "./StatsBar";
import TypingEngine from "./TypingEngine";
import { useTypingEngine, TypingStats } from "@/hooks/useTypingEngine";
import { useAuth } from "@/context/AuthContext";
import { TYPING_DATA } from "@/data/typingData";
import { useEffect, useState, useCallback } from "react";
import { useToast } from "@/context/ToastContext";

export default function TypingContainer() {
  const { duration, mode, difficulty } = useTypingContext();
  const { user } = useAuth();
  const { addAchievementToast } = useToast();
  const [text, setText] = useState("");
  const [rwCategory, setRwCategory] = useState("email");
  
  const generateText = useCallback(() => {
    let newText = "";
    
    if (mode === "realworld") {
      const rwData = TYPING_DATA.realworld;
      const pool = rwData[rwCategory as keyof typeof rwData];
      newText = pool[Math.floor(Math.random() * pool.length)];
    } else if (mode === "words" || mode === "numbers" || mode === "punctuation" || mode === "symbols") {
      const data = (TYPING_DATA[mode as keyof typeof TYPING_DATA] || TYPING_DATA.symbols) as string[];
      newText = [...data].sort(() => Math.random() - 0.5).slice(0, 25).join(" ");
    } else {
      const data = (TYPING_DATA[mode as keyof typeof TYPING_DATA] || TYPING_DATA.words) as string[];
      newText = data[Math.floor(Math.random() * data.length)];
    }
    
    setText(newText);
  }, [mode, rwCategory]);
  
  // Optimize text selection and load instantly
  useEffect(() => {
    generateText();
  }, [generateText]);

  const handleSessionComplete = useCallback(async (stats: TypingStats, keyStats: Record<string, { attempts: number; errors: number }>) => {
    if (!user) return; 
    
    const { saveSession } = await import("@/lib/supabase/sessions");
    const res = await saveSession({
      userId: user.id,
      stats,
      mode,
      duration,
      textUsed: text,
      keyStats,
    });

    if (res.newlyUnlocked) {
      res.newlyUnlocked.forEach((key: string) => addAchievementToast(key));
    }
  }, [user, mode, duration, text, addAchievementToast]);

  const handlePrescriptionDrill = useCallback((weakKeys: string[]) => {
    const data = TYPING_DATA.words;
    const drillWords = [];
    for (let i = 0; i < 25; i++) {
      const useWeakKey = Math.random() > 0.3; 
      if (useWeakKey && weakKeys.length > 0) {
        const targetKey = weakKeys[Math.floor(Math.random() * weakKeys.length)];
        const matchingWords = data.filter(w => w.toLowerCase().includes(targetKey.toLowerCase()));
        if (matchingWords.length > 0) {
          drillWords.push(matchingWords[Math.floor(Math.random() * matchingWords.length)]);
          continue;
        }
      }
      drillWords.push(data[Math.floor(Math.random() * data.length)]);
    }
    setText(drillWords.join(" "));
  }, []);

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
        <TypingEngine 
          engine={engine} 
          mode={mode} 
          onNewTest={generateText} 
          onPrescriptionDrill={handlePrescriptionDrill}
          rwCategory={rwCategory}
          onRwCategoryChange={setRwCategory}
        />
      </div>
    </main>
  );
}
