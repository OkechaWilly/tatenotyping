import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import { useSettings } from "@/context/SettingsContext";

export interface FreeTypingStats {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  errors: number;
  bestWpm: number;
  [key: string]: number; // Add index signature
}

export function useFreeTypingEngine() {
  const { playKeystrokeSound, playErrorSound } = useSettings();
  const [typed, setTyped] = useState("");
  const [isActive, setIsActive] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const lastKeyTimeRef = useRef<number | null>(null);
  
  // Track long delays between specific keystrokes
  const [keyStats, setKeyStats] = useState<Record<string, { attempts: number; errors: number }>>({});
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);

  const startTest = useCallback(() => {
    setIsActive(true);
    startTimeRef.current = Date.now();
    lastKeyTimeRef.current = Date.now();
  }, []);

  const handleInput = useCallback((val: string) => {
    if (!isActive) startTest();
    
    // Check if new char added
    if (val.length > typed.length) {
      const charTyped = val[val.length - 1].toLowerCase();
      // only track alphabets, numbers, and common punctuation for weak keys
      if (charTyped.match(/[a-z0-9;\-,.]/)) {
        const now = Date.now();
        const delay = lastKeyTimeRef.current ? now - lastKeyTimeRef.current : 0;
        
        // Let's assume > 500ms between alphanumeric keys is a hesitation (weakness/error)
        const isHesitation = delay > 500; 
        
        if (isHesitation) {
           playErrorSound();
        } else {
           playKeystrokeSound();
        }
        
        setKeyStats(prev => ({
          ...prev,
          [charTyped]: {
            attempts: (prev[charTyped]?.attempts || 0) + 1,
            errors: (prev[charTyped]?.errors || 0) + (isHesitation ? 1 : 0),
          }
        }));
        
        lastKeyTimeRef.current = now;
      }
      setTotalKeystrokes(prev => prev + 1);
    } else {
      // User pressed backspace - count as error against the previous character typed? 
      // For free-form, we can just bump total keystrokes without targeted penalization.
      playKeystrokeSound();
      setTotalKeystrokes(prev => prev + 1);
    }
    
    setTyped(val);
  }, [isActive, typed, startTest, playKeystrokeSound, playErrorSound]);

  const resetTest = useCallback(() => {
    setTyped("");
    setIsActive(false);
    startTimeRef.current = null;
    lastKeyTimeRef.current = null;
    setTotalKeystrokes(0);
    setKeyStats({});
  }, []);

  // Update time for real-time WPM
  const [timeElapsed, setTimeElapsed] = useState(0);
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        if (startTimeRef.current) {
           setTimeElapsed((Date.now() - startTimeRef.current) / 1000);
        }
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const minutesElapsed = timeElapsed / 60;
  
  const stats = useMemo<FreeTypingStats>(() => {
    const wpm = minutesElapsed > 0 ? Math.round((typed.length / 5) / minutesElapsed) : 0;
    
    // Calculate accuracy based on hesitations (errors) total keystrokes
    const calculatedErrors = Object.values(keyStats).reduce((sum, k) => sum + k.errors, 0);
    const accuracy = totalKeystrokes > 0 ? Math.max(0, Math.round(((totalKeystrokes - calculatedErrors) / totalKeystrokes) * 100)) : 100;

    return {
      wpm,
      rawWpm: wpm,
      accuracy,
      errors: calculatedErrors,
      bestWpm: wpm
    };
  }, [typed, minutesElapsed, keyStats, totalKeystrokes]);

  return { typed, handleInput, resetTest, stats, keyStats, isActive, setTyped };
}
