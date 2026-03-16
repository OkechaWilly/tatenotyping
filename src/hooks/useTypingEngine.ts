import { useState, useEffect, useCallback, useRef, useMemo } from "react";

export interface TypingStats {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  errors: number;
}

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export function useTypingEngine(
  initialText: string, 
  totalTime: number, 
  difficulty: Difficulty = "Intermediate",
  onComplete?: (stats: TypingStats) => void
) {
  const [text, setText] = useState(initialText);
  const [typed, setTyped] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const startTimeRef = useRef<number | null>(null);

  const [errors, setErrors] = useState(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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

    return { wpm, rawWpm, accuracy, errors };
  }, [typed, text, minutesElapsed, totalKeystrokes, errors]);

  // Per-key tracking
  const [keyStats, setKeyStats] = useState<Record<string, { attempts: number; errors: number }>>({});

  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    if (isFinished && !hasCompleted && onComplete) {
      onComplete(stats);
      setHasCompleted(true);
    }
  }, [isFinished, hasCompleted, onComplete, stats]);

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
    if (timerRef.current) clearInterval(timerRef.current);
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
        setErrors((prev) => prev + 1);
        
        if (difficulty === "Advanced") {
          setIsFinished(true);
          setIsActive(false);
          if (timerRef.current) clearInterval(timerRef.current);
          setTyped(val);
          return;
        }

        if (difficulty === "Intermediate") {
          // In intermediate, we don't update typed if it's wrong (must correct)
          setTotalKeystrokes((prev) => prev + 1);
          return;
        }
      }

      setTyped(val);
      setTotalKeystrokes((prev) => prev + 1);
    } else {
        // Handle backspace
        setTyped(val);
    }

    // Check for completion by length
    if (val.length === text.length && val[val.length-1] === text[val.length-1]) {
       setIsFinished(true);
       setIsActive(false);
       if (timerRef.current) clearInterval(timerRef.current);
    }

  }, [isActive, isFinished, text, typed, startTest, difficulty]);

  // Timer effect
  useEffect(() => {
    if (isActive && !isFinished && totalTime > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsFinished(true);
            setIsActive(false);
            clearInterval(timerRef.current!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, isFinished, totalTime]);

  // Keep focus on click anywhere if active
  const focusInput = useCallback(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  // Stabilize the return object
  return useMemo(() => ({
    text,
    typed,
    isActive,
    isFinished,
    timeLeft,
    stats,
    keyStats,
    inputRef,
    handleInput,
    startTest,
    resetTest,
    focusInput,
    difficulty,
  }), [
    text, 
    typed, 
    isActive, 
    isFinished, 
    timeLeft, 
    stats, 
    keyStats, 
    handleInput, 
    startTest, 
    resetTest, 
    focusInput, 
    difficulty
  ]);
}
