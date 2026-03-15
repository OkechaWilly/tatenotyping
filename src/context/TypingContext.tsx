"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export type TypingMode = "words" | "quotes" | "code" | "prose" | "numbers" | "realworld";
export type Duration = 15 | 30 | 60 | 120;
export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

interface TypingContextValue {
  mode: TypingMode;
  setMode: (m: TypingMode) => void;
  duration: Duration;
  setDuration: (d: Duration) => void;
  difficulty: Difficulty;
  setDifficulty: (d: Difficulty) => void;
}

const TypingContext = createContext<TypingContextValue | null>(null);

export function TypingProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<TypingMode>("words");
  const [duration, setDuration] = useState<Duration>(30);
  const [difficulty, setDifficulty] = useState<Difficulty>("Intermediate");

  useEffect(() => {
    const modeParam = searchParams.get("mode") as TypingMode;
    if (modeParam && ["words", "quotes", "code", "prose", "numbers", "realworld"].includes(modeParam)) {
      setMode(modeParam);
    }
  }, [searchParams]);

  return (
    <TypingContext.Provider value={{ mode, setMode, duration, setDuration, difficulty, setDifficulty }}>
      {children}
    </TypingContext.Provider>
  );
}

export function useTypingContext() {
  const ctx = useContext(TypingContext);
  if (!ctx) throw new Error("useTypingContext must be used within TypingProvider");
  return ctx;
}
