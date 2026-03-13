"use client";
import { createContext, useContext, useState, ReactNode } from "react";

export type TypingMode = "words" | "quotes" | "code" | "prose" | "numbers";
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
  const [mode, setMode] = useState<TypingMode>("words");
  const [duration, setDuration] = useState<Duration>(30);
  const [difficulty, setDifficulty] = useState<Difficulty>("Intermediate");
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
