import { useState, useEffect, useCallback, useRef } from "react";

export interface TypingStats {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  errors: number;
}

export function useTypingEngine(
  initialText: string, 
  totalTime: number, 
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
  
  const calculateWpm = () => {
    if (minutesElapsed <= 0) return 0;
    // Standard WPM: (correct chars / 5) / minutes
    // Typed correctness
    let correctChars = 0;
    for (let i = 0; i < typed.length; i++) {
        if (typed[i] === text[i]) correctChars++;
    }
    return Math.max(0, Math.round((correctChars / 5) / minutesElapsed));
  };

  const calculateRawWpm = () => {
    if (minutesElapsed <= 0) return 0;
    return Math.max(0, Math.round((typed.length / 5) / minutesElapsed));
  };

  const calculateAccuracy = () => {
    if (totalKeystrokes === 0) return 100;
    const correctKeystrokes = totalKeystrokes - errors;
    return Math.max(0, Math.round((correctKeystrokes / totalKeystrokes) * 100));
  };

  const stats: TypingStats = {
    wpm: calculateWpm(),
    rawWpm: calculateRawWpm(),
    accuracy: calculateAccuracy(),
    errors,
  };

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
    if (timerRef.current) clearInterval(timerRef.current);
  }, [totalTime]);

  // Handle typing input
  const handleInput = useCallback((val: string) => {
    if (!isActive) {
      startTest();
    }
    
    // Prevent typing beyond text length (if hard stop)
    if (val.length > text.length) return;

    setTyped(val);
    setTotalKeystrokes((prev) => prev + 1);

    // Check for new errors
    if (val.length > typed.length) {
      const charTyped = val[val.length - 1];
      const charExpected = text[val.length - 1];
      if (charTyped !== charExpected) {
        setErrors((prev) => prev + 1);
      }
    }

    // Check for completion by length
    if (val.length === text.length) {
       setIsFinished(true);
       setIsActive(false);
       if (timerRef.current) clearInterval(timerRef.current);
    }

  }, [isActive, text, typed, startTest]);

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
  }, [isActive, isFinished]);

  // Keep focus on click anywhere if active
  const focusInput = () => {
    if (inputRef.current) inputRef.current.focus();
  };

  return {
    text,
    typed,
    isActive,
    isFinished,
    timeLeft,
    stats,
    inputRef,
    handleInput,
    startTest,
    resetTest,
    focusInput,
  };
}
