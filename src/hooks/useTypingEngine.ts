import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useSettings } from "@/context/SettingsContext";

export interface TypingStats {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  errors: number;
  bestWpm: number;
}

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export function useTypingEngine(
  initialText: string, 
  totalTime: number, 
  difficulty: Difficulty = "Intermediate",
  onComplete?: (stats: TypingStats, keyStats: Record<string, { attempts: number; errors: number }>) => void
) {
  const { playKeystrokeSound, playErrorSound } = useSettings();
  const [text, setText] = useState(initialText);
  const [typed, setTyped] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const startTimeRef = useRef<number | null>(null);

  const [errors, setErrors] = useState(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);

  // Advanced tracking
  const [bestWpm, setBestWpm] = useState(0);
  const [, setWpmHistory] = useState<{ time: number; chars: number }[]>([]);
  const [consecutiveErrors, setConsecutiveErrors] = useState(0);
  const [, setBackspaceCount] = useState(0);
  const [notifications, setNotifications] = useState<{ id: string; message: string; type: string }[]>([]);
  const [, setShiftMistakeCount] = useState(0);
  const [errorMap, setErrorMap] = useState<Record<string, number>>({});

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const wpmIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Derived stats
  const timeElapsed = startTimeRef.current ? (Date.now() - startTimeRef.current) / 1000 : 0;
  const minutesElapsed = timeElapsed / 60;
  
  const stats: TypingStats = useMemo(() => {
    // Standard WPM: (correct chars / 5) / minutes
    let correctChars = 0;
    for (let i = 0; i < typed.length; i++) {
        if (typed[i] === text[i]) correctChars++;
    }
    const wpm = minutesElapsed <= 0 ? 0 : Math.max(0, Math.round((correctChars / 5) / minutesElapsed));
    const rawWpm = minutesElapsed <= 0 ? 0 : Math.max(0, Math.round((typed.length / 5) / minutesElapsed));
    
    let accuracy = 100;
    if (totalKeystrokes > 0) {
      const correctKeystrokes = totalKeystrokes - errors;
      accuracy = Math.max(0, Math.round((correctKeystrokes / totalKeystrokes) * 100));
    }

    return { wpm, rawWpm, accuracy, errors, bestWpm };
  }, [typed, text, minutesElapsed, totalKeystrokes, errors, bestWpm]);

  // Toast notification logic
  const addNotification = useCallback((message: string, type: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications(prev => [...prev.filter(n => n.message !== message), { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  }, []);

  // Per-key tracking
  const [keyStats, setKeyStats] = useState<Record<string, { attempts: number; errors: number }>>({});

  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    if (isFinished && !hasCompleted && onComplete) {
      onComplete(stats, keyStats);
      setHasCompleted(true);
    }
  }, [isFinished, hasCompleted, onComplete, stats, keyStats]);

  const startTest = useCallback(() => {
    setIsActive(true);
    setIsFinished(false);
    startTimeRef.current = Date.now();
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const resetTest = useCallback((newText?: string) => {
    if (newText) setText(newText);
    setTyped("");
    setIsActive(false);
    setIsFinished(false);
    setHasCompleted(false);
    setTimeLeft(totalTime);
    startTimeRef.current = null;
    setErrors(0);
    setTotalKeystrokes(0);
    setKeyStats({});
    setBestWpm(0);
    setWpmHistory([]);
    setConsecutiveErrors(0);
    setBackspaceCount(0);
    setShiftMistakeCount(0);
    setErrorMap({});
    setNotifications([]);
    if (timerRef.current) clearInterval(timerRef.current);
    if (wpmIntervalRef.current) clearInterval(wpmIntervalRef.current);
  }, [totalTime]);

  // Handle typing input
  const handleInput = useCallback((val: string) => {
    if (isFinished) return;
    if (!isActive) {
      startTest();
    }
    
    // Prevent typing beyond text length
    if (val.length > text.length) return;

    // Check for new keystrokes
    if (val.length > typed.length) {
      const charTyped = val[val.length - 1];
      const charExpected = text[val.length - 1];
      const key = charExpected.toLowerCase();
      
      setKeyStats(prev => ({
        ...prev,
        [key]: {
          attempts: (prev[key]?.attempts || 0) + 1,
          errors: (prev[key]?.errors || 0) + (charTyped !== charExpected ? 1 : 0)
        }
      }));

      if (charTyped !== charExpected) {
        playErrorSound();
        setErrors((prev) => prev + 1);
        setConsecutiveErrors(prev => prev + 1);

        // Smart Error Detection
        // 1. CapsLock detection
        // 1. CapsLock detection
        if (charTyped.toLowerCase() === charExpected && charTyped !== charExpected) {
          addNotification("CapsLock is on — press it again to turn it off", "warning");
        }

        // Track per-character errors
        setErrorMap(prev => ({
          ...prev,
          [charExpected]: (prev[charExpected] || 0) + 1
        }));

        // 2. Shift key reminder
        const isUpper = charExpected !== charExpected.toLowerCase();
        if (isUpper && charTyped === charExpected.toLowerCase()) {
          setShiftMistakeCount(prev => {
            if (prev + 1 >= 2) {
              addNotification("Use Shift for capitals, not CapsLock", "info");
              return 0;
            }
            return prev + 1;
          });
        }

        // 3. Home row reminder
        if (consecutiveErrors + 1 >= 3) {
          addNotification("Take a breath. Return your fingers to A S D F · J K L ;", "info");
          setConsecutiveErrors(0);
        }
        
        if (difficulty === "Advanced") {
          setIsFinished(true);
          setIsActive(false);
          if (timerRef.current) clearInterval(timerRef.current);
          if (wpmIntervalRef.current) clearInterval(wpmIntervalRef.current);
          setTyped(val);
          return;
        }

        if (difficulty === "Intermediate") {
          setTotalKeystrokes((prev) => prev + 1);
          return;
        }
      } else {
        playKeystrokeSound();
        setConsecutiveErrors(0);
        setShiftMistakeCount(0);
      }

      setTyped(val);
      setTotalKeystrokes((prev) => prev + 1);
    } else {
        // Handle backspace
        setBackspaceCount(prev => {
          const next = prev + 1;
          if (next === 9) {
            addNotification("Try to flow forward — fix errors with rhythm, not constant backspacing", "warning");
          }
          return next;
        });
        setTyped(val);
    }

    // Check for completion by length
    if (val.length === text.length && val[val.length-1] === text[val.length-1]) {
       setIsFinished(true);
       setIsActive(false);
       if (timerRef.current) clearInterval(timerRef.current);
       if (wpmIntervalRef.current) clearInterval(wpmIntervalRef.current);
    }

  }, [isActive, isFinished, text, typed, startTest, difficulty, addNotification, consecutiveErrors, playErrorSound, playKeystrokeSound]);

  // Timer & Best WPM effect
  useEffect(() => {
    if (isActive && !isFinished) {
      // 5-second window WPM tracking
      wpmIntervalRef.current = setInterval(() => {
        const now = Date.now();
        const currentChars = typed.length;
        
        setWpmHistory(prev => {
          const newHistory = [...prev, { time: now, chars: currentChars }];
          // Only keep last 5 seconds (5000ms)
          const windowStart = now - 5000;
          const relevantHistory = newHistory.filter(h => h.time >= windowStart);
          
          if (relevantHistory.length > 1) {
            const first = relevantHistory[0];
            const last = relevantHistory[relevantHistory.length - 1];
            const timeDiffMin = (last.time - first.time) / 60000;
            const charDiff = last.chars - first.chars;
            
            if (timeDiffMin > 0) {
              const windowWpm = Math.round((charDiff / 5) / timeDiffMin);
              setBestWpm(prevBest => Math.max(prevBest, windowWpm));
            }
          }
          return relevantHistory;
        });
      }, 1000);

      if (totalTime > 0) {
        timerRef.current = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              setIsFinished(true);
              setIsActive(false);
              clearInterval(timerRef.current!);
              clearInterval(wpmIntervalRef.current!);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (wpmIntervalRef.current) clearInterval(wpmIntervalRef.current);
    };
  }, [isActive, isFinished, totalTime, typed.length]);

  // Keep focus on click anywhere if active
  const focusInput = useCallback(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  // Final exposed object
  return useMemo(() => {
    const sortedStats = Object.entries(keyStats)
      .map(([key, { attempts, errors }]) => ({
        key,
        errorRate: errors / attempts,
        attempts
      }))
      .filter(k => k.attempts > 2) // Minimum attempts to be considered a weak key
      .sort((a, b) => b.errorRate - a.errorRate);

    const weakKeys = sortedStats.slice(0, 3).map(s => s.key);

    return {
      text,
      typed,
      isActive,
      isFinished,
      timeLeft,
      stats,
      keyStats,
      weakKeys,
      notifications,
      errorMap,
      inputRef,
      handleInput,
      startTest,
      resetTest,
      focusInput,
      difficulty,
    };
  }, [
    text, 
    typed, 
    isActive, 
    isFinished, 
    timeLeft, 
    stats, 
    keyStats, 
    notifications,
    errorMap,
    handleInput, 
    startTest, 
    resetTest, 
    focusInput, 
    difficulty
  ]);
}
