"use client";
import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "./AuthContext";
import { createClient } from "@/lib/supabase/client";

export type TypingMode = "words" | "quotes" | "code" | "prose" | "numbers" | "realworld" | "punctuation" | "symbols";
export type Duration = 15 | 30 | 60 | 120;
export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export interface TypingSettings {
  sound_effects: boolean;
  live_wpm: boolean;
  screen_shake: boolean;
  theme: 'light' | 'dark' | 'system';
}

interface TypingContextValue {
  mode: TypingMode;
  setMode: (m: TypingMode) => void;
  duration: Duration;
  setDuration: (d: Duration) => void;
  difficulty: Difficulty;
  setDifficulty: (d: Difficulty) => void;
  settings: TypingSettings;
  updateSettings: (s: Partial<TypingSettings>) => void;
}

const TypingContext = createContext<TypingContextValue | null>(null);

export function TypingProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const { user, profile } = useAuth();
  
  const [mode, setMode] = useState<TypingMode>("words");
  const [duration, setDuration] = useState<Duration>(30);
  const [difficulty, setDifficulty] = useState<Difficulty>("Intermediate");
  const [settings, setSettings] = useState<TypingSettings>({
    sound_effects: true,
    live_wpm: true,
    screen_shake: false,
    theme: 'dark'
  });

  // Load settings from profile when available
  useEffect(() => {
    if (profile?.preferences) {
      setSettings(prev => ({
        ...prev,
        ...profile.preferences
      }));
    }
  }, [profile]);

  const updateSettings = useCallback(async (newSettings: Partial<TypingSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);

    // Persist to Supabase if logged in
    if (user) {
      const supabase = createClient();
      await supabase
        .from("profiles")
        .update({ preferences: updated })
        .eq("id", user.id);
    }
  }, [settings, user]);

  useEffect(() => {
    const modeParam = searchParams.get("mode") as TypingMode;
    if (modeParam && ["words", "quotes", "code", "prose", "numbers", "realworld", "punctuation", "symbols"].includes(modeParam)) {
      setMode(modeParam);
    }
  }, [searchParams]);

  return (
    <TypingContext.Provider value={{ 
      mode, setMode, 
      duration, setDuration, 
      difficulty, setDifficulty,
      settings, updateSettings
    }}>
      {children}
    </TypingContext.Provider>
  );
}

export function useTypingContext() {
  const ctx = useContext(TypingContext);
  if (!ctx) throw new Error("useTypingContext must be used within TypingProvider");
  return ctx;
}
