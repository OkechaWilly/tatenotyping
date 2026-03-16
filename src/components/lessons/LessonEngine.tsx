"use client";

import Keyboard from "./Keyboard";
import LetterMasteryGraph from "./LetterMasteryGraph";
import { useTypingEngine } from "@/hooks/useTypingEngine";
import { LESSONS } from "@/data/lessons";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";

export default function LessonEngine() {
  const { user } = useAuth();
  const [lessonIndex, setLessonIndex] = useState(0);
  const currentLesson = LESSONS[lessonIndex];
  const [mounted, setMounted] = useState(false);
  const [passed, setPassed] = useState(false);
  const [drillMode, setDrillMode] = useState(false);
  const [drillText, setDrillText] = useState("");
  
  const handleLessonComplete = useCallback(async (stats: { wpm: number; accuracy: number; errors: number; rawWpm: number }) => {
    const isSuccess = stats.accuracy >= 90;
    setPassed(isSuccess);

    if (!user) return;
    
    const { createClient } = (await import("@/lib/supabase/client"));
    const supabase = createClient();
    
    // Save lesson progress
    await supabase.from("lesson_progress").upsert({
      user_id: user.id,
      lesson_id: currentLesson.id || `lesson-${lessonIndex}`,
      completed: isSuccess,
      best_wpm: stats.wpm,
      best_accuracy: stats.accuracy,
      completed_at: new Date().toISOString(),
    }, { onConflict: 'user_id,lesson_id' });

    // Save session
    const { saveSession } = await import("@/lib/supabase/sessions");
    await saveSession({
      userId: user.id,
      stats,
      mode: "lesson",
      duration: 0,
      textUsed: drillMode ? drillText : currentLesson.text,
    });
  }, [user, currentLesson, lessonIndex, drillMode, drillText]);

  const engine = useTypingEngine(mounted ? (drillMode ? drillText : currentLesson.text) : "", 0, "Beginner", handleLessonComplete);
  const { text, typed, isActive, isFinished, startTest, resetTest, handleInput, inputRef, keyStats } = engine;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      setDrillMode(false);
      setDrillText("");
      resetTest(currentLesson.text);
    }
  }, [lessonIndex, currentLesson.text, resetTest, mounted]);

  const generateDrill = () => {
    const weakKeys = Object.entries(keyStats)
      .filter(([, stats]) => (stats.attempts - stats.errors) / stats.attempts < 0.9)
      .map(([key]) => key);
    
    if (weakKeys.length === 0) {
      resetTest(currentLesson.text);
      return;
    }

    // Generate remediation drill: repeat weak keys in groups
    let drill = "";
    for (let i = 0; i < 15; i++) {
        const key = weakKeys[Math.floor(Math.random() * weakKeys.length)];
        drill += `${key}${key}${key} `;
    }
    const finalDrill = drill.trim();
    setDrillText(finalDrill);
    setDrillMode(true);
    resetTest(finalDrill);
  };

  const nextLesson = () => {
    if (lessonIndex < LESSONS.length - 1 && passed) {
      setLessonIndex(lessonIndex + 1);
      setPassed(false);
    }
  };

  const targetKey = text[Math.min(typed.length, text.length - 1)];

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-bg relative">
      <div className="flex items-center justify-between px-4 sm:px-8 py-3 sm:py-3.5 border-b border-border bg-surface shrink-0">
        <div className="font-mono text-[9px] sm:text-[10px] tracking-[0.08em] text-ink-3 flex items-center gap-1.5 truncate mr-2">
          Lessons / {currentLesson.category} / <span className="text-ink-2 font-medium truncate">{currentLesson.title}</span>
        </div>
        <div className="flex gap-1 shrink-0">
          {LESSONS.map((lesson, i) => (
            <div 
              key={i} 
              className={`w-2.5 sm:w-4 h-[3px] rounded-[2px] transition-all ${
                i === lessonIndex ? "bg-accent" : i < lessonIndex ? "bg-accent opacity-40" : "bg-border"
              }`} 
            />
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center px-4 sm:px-8 py-6 sm:py-8 gap-6 overflow-y-auto w-full" onClick={() => inputRef.current?.focus()}>
        <div className="text-center w-full">
          <div className="font-mono text-[9px] sm:text-[10px] tracking-[0.12em] uppercase text-ink-3 mb-1">
            Lesson {String(lessonIndex + 1).padStart(2, '0')} · {currentLesson.category}
          </div>
          <div className="font-display text-[20px] sm:text-[22px] font-medium text-ink mb-1">
            {drillMode ? "Remediation Drill" : currentLesson.title}
          </div>
          <div className="text-[12px] sm:text-[13px] text-ink-3 max-w-[420px] leading-[1.5] mx-auto">
            {drillMode 
              ? "Focus on the characters below. Accuracy is key to proceeding."
              : currentLesson.description}
          </div>
        </div>

        <div className="w-full max-w-[680px]">
           <LetterMasteryGraph keyStats={keyStats} />
        </div>

        <div className="bg-surface border border-border rounded-lg px-6 sm:px-8 py-8 sm:py-10 w-full max-w-[680px] shadow-sm relative cursor-text group">
          <div className={`absolute left-0 top-0 bottom-0 w-[4px] bg-accent rounded-l-lg transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`} />
          
          <div className="font-mono text-[18px] sm:text-[22px] leading-[1.8] sm:leading-[2] tracking-[0.04em] sm:tracking-[0.06em] text-pending select-none break-words text-center">
            {text.split('').map((char, i) => {
              let charClass = "relative transition-all duration-75 ";
              if (i < typed.length) {
                charClass += typed[i] === char ? "text-ink " : "text-error bg-error/10 rounded-[2px] ";
              }
              if (i === typed.length && isActive) charClass += "text-ink border-b-2 border-accent animate-pulse";
              
              return (
                <span key={i} className={charClass}>
                  {char === ' ' ? '\u00A0' : char}
                </span>
              );
            })}
          </div>

          <input
            ref={inputRef}
            type="text"
            className="absolute opacity-0 w-px h-px pointer-events-none"
            autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false"
            value={typed}
            onChange={(e) => handleInput(e.target.value)}
          />

          {!isActive && !isFinished && (
            <div 
              className="absolute inset-0 flex items-center justify-center rounded-lg cursor-text transition-all duration-200 group bg-surface/40 backdrop-blur-[1px]"
              onClick={startTest}
            >
              <div className="flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-full text-[13px] font-bold shadow-xl transition-all duration-200 pointer-events-none group-hover:-translate-y-1">
                Start {drillMode ? "Mastery Drill" : "Lesson"}
                <kbd className="bg-white/20 rounded-[3px] px-1.5 py-[1px] font-mono text-[11px] ml-2 font-medium">Enter</kbd>
              </div>
            </div>
          )}
        </div>

        <div className="hidden sm:block w-full max-w-[620px] opacity-80 hover:opacity-100 transition-opacity">
          <Keyboard activeKey={!isFinished ? targetKey : ""} />
        </div>

        <div className="flex items-center gap-3 sm:gap-4 bg-surface-2/50 backdrop-blur-sm border border-border rounded-xl px-4 sm:px-5 py-3 sm:py-4 w-full max-w-[620px] shadow-sm mb-4">
          <div className="w-10 h-10 rounded-xl bg-accent/5 flex items-center justify-center text-accent shrink-0 border border-accent/10">
             <span className="font-mono text-base sm:text-lg font-bold">
               {targetKey === " " ? "␣" : targetKey?.toUpperCase() || "—"}
             </span>
          </div>
          <div className="flex-1">
            <div className="text-[12px] sm:text-[13px] font-semibold text-ink">Focus Area</div>
            <div className="text-[10px] sm:text-[11px] text-ink-3">Maintain posture and focus on accuracy.</div>
          </div>
        </div>
      </div>

      {isFinished && (
        <div className="absolute inset-0 z-50 bg-bg/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-2xl p-6 sm:p-10 max-w-[520px] w-full shadow-2xl animate-fadeUp text-center flex flex-col items-center gap-4">
            <div className={`px-4 py-1.5 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-widest border ${
              passed ? "bg-green/10 text-green border-green/20" : "bg-error/10 text-error border-error/20"
            }`}>
              {passed ? "Mastered" : "Needs Practice"}
            </div>
            
            <h2 className="font-display text-[24px] sm:text-3xl font-bold text-ink">
              {passed ? "Excellent Progress!" : "Keep Working"}
            </h2>
            
            <div className="text-[13px] sm:text-[14px] text-ink-3 leading-relaxed">
              {passed 
                ? "You've successfully cleared the accuracy threshold. Ready for the next challenge."
                : "You didn't reach the 90% accuracy requirement. We've prepared a remediation drill based on your weak keys."}
            </div>
            
            <div className="flex justify-center gap-6 sm:gap-10 w-full py-6 border-y border-border/50">
              <div className="flex flex-col items-center">
                <div className="font-mono text-[24px] sm:text-3xl font-bold text-ink">{engine.stats.wpm}</div>
                <div className="text-[9px] sm:text-[10px] uppercase tracking-widest text-ink-4">WPM</div>
              </div>
              <div className="flex flex-col items-center">
                <div className={`font-mono text-[24px] sm:text-3xl font-bold ${engine.stats.accuracy < 90 ? "text-error" : "text-green"}`}>
                  {engine.stats.accuracy}%
                </div>
                <div className="text-[9px] sm:text-[10px] uppercase tracking-widest text-ink-4">Accuracy</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="font-mono text-[24px] sm:text-3xl font-bold text-ink">{engine.stats.errors}</div>
                <div className="text-[9px] sm:text-[10px] uppercase tracking-widest text-ink-4">Errors</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full pt-4">
              <button 
                onClick={passed ? () => resetTest() : generateDrill} 
                className="flex-1 px-6 py-3 rounded-xl border border-border bg-surface-2 font-body text-[13px] sm:text-[14px] font-bold text-ink hover:bg-surface-3 transition-all"
              >
                {passed ? "Repeat" : "Start Remediation"}
              </button>
              {passed && (
                <button 
                  onClick={nextLesson}
                  className="flex-1 px-6 py-3 rounded-xl bg-accent font-body text-[13px] sm:text-[14px] font-bold text-white hover:brightness-110 transition-all shadow-lg shadow-accent/20"
                >
                  Next Lesson
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
