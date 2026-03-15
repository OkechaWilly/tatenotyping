"use client";


import Keyboard from "./Keyboard";
import HandsDiagram from "./HandsDiagram";
import { useTypingEngine } from "@/hooks/useTypingEngine";
import { LESSONS } from "@/data/lessons";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function LessonEngine() {
  const { user } = useAuth();
  const [lessonIndex, setLessonIndex] = useState(0);
  const currentLesson = LESSONS[lessonIndex];
  const [mounted, setMounted] = useState(false);
  
  const handleLessonComplete = async (stats: any) => {
    if (!user) return;
    
    const { createClient } = (await import("@/lib/supabase/client"));
    const supabase = createClient();
    
    // 1. Save lesson progress
    await supabase.from("lesson_progress").upsert({
      user_id: user.id,
      lesson_id: currentLesson.id || `lesson-${lessonIndex}`,
      completed: true,
      best_wpm: stats.wpm,
      best_accuracy: stats.accuracy,
      completed_at: new Date().toISOString(),
    }, { onConflict: 'user_id,lesson_id' });

    // 2. XP Reward
    const { saveSession } = await import("@/lib/supabase/sessions");
    await saveSession({
      userId: user.id,
      stats,
      mode: "lesson",
      duration: 0, // Lessons aren't timed in the same way
      textUsed: currentLesson.text,
    });
  };

  const engine = useTypingEngine(mounted ? currentLesson.text : "", 0, "Beginner", handleLessonComplete);
  const { text, typed, isActive, isFinished, startTest, resetTest, handleInput, inputRef } = engine;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      resetTest(currentLesson.text);
    }
  }, [lessonIndex, currentLesson.text, resetTest, mounted]);

  const nextLesson = () => {
    if (lessonIndex < LESSONS.length - 1) {
      setLessonIndex(lessonIndex + 1);
    }
  };


  const targetKey = text[Math.min(typed.length, text.length - 1)];

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-bg relative">
      <div className="flex items-center justify-between px-8 py-3.5 border-b border-border bg-surface shrink-0">
        <div className="font-mono text-[10px] tracking-[0.08em] text-ink-3 flex items-center gap-1.5">
          Lessons / {currentLesson.category} / <span className="text-ink-2 font-medium">{currentLesson.title}</span>
        </div>
        <div className="flex gap-1">
          {LESSONS.map((_, i) => (
            <div 
              key={i} 
              className={`w-4 h-[3px] rounded-[2px] transition-all ${
                i === lessonIndex ? "bg-accent" : i < lessonIndex ? "bg-accent opacity-40" : "bg-border"
              }`} 
            />
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center px-8 py-6 gap-4.5 overflow-y-auto w-full" onClick={() => inputRef.current?.focus()}>
        <div className="text-center">
        <div className="text-center">
          <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-ink-3 mb-1">
            Lesson {String(lessonIndex + 1).padStart(2, '0')} · {currentLesson.category}
          </div>
          <div className="font-display text-[22px] font-medium text-ink mb-1">
            {currentLesson.title}
          </div>
          <div className="text-[13px] text-ink-3 max-w-[420px] leading-[1.5]">
            {currentLesson.description}
          </div>
        </div>
        </div>

        <div className="flex gap-2 flex-wrap justify-center mt-2">
          {["Pinky", "Ring", "Middle", "Index", "Thumb"].map((f) => (
            <div key={f} className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-surface font-mono text-[11px] text-ink-2">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ 
                  backgroundColor: 
                    f === "Pinky" ? "var(--f-pinky)" : 
                    f === "Ring" ? "var(--f-ring)" : 
                    f === "Middle" ? "var(--f-middle)" : 
                    f === "Index" ? "var(--f-index)" : 
                    "var(--f-thumb)" 
                }} 
              />
              {f}
            </div>
          ))}
        </div>

        <div className="bg-surface border border-border rounded-lg px-8 py-6 w-full max-w-[680px] shadow-sm relative cursor-text group">
          <div className={`absolute left-0 top-0 bottom-0 w-[3px] bg-accent rounded-l-lg transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`} />
          
          <div className="font-mono text-[18px] leading-[1.9] tracking-[0.04em] text-pending select-none break-words text-center">
            {text.split('').map((char, i) => {
              let charClass = "relative transition-colors duration-75 ";
              if (i < typed.length) {
                charClass += typed[i] === char ? "text-ink " : "text-error bg-[#C4431A14] rounded-[2px] ";
              }
              if (i === typed.length && isActive) charClass += "text-ink after:content-[''] after:absolute after:left-0 after:top-[2px] after:bottom-[2px] after:w-[2px] after:bg-cursor-color after:rounded-[1px] after:animate-blink";
              
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
              <div className="flex items-center gap-2 bg-surface border border-border px-5 py-2.5 rounded-full text-[13px] text-ink-2 shadow-md transition-all duration-200 pointer-events-none group-hover:-translate-y-1">
                Click or press any key to begin 
                <kbd className="bg-surface-2 border border-border-strong rounded-[3px] px-1.5 py-[1px] font-mono text-[11px] text-ink shadow-[0_2px_0_var(--border-strong)]">↵</kbd>
              </div>
            </div>
          )}
        </div>

        <div className="w-full max-w-[620px]">
          <Keyboard activeKey={!isFinished ? targetKey : ""} />
          <div className="mt-4">
            <HandsDiagram activeKey={!isFinished ? targetKey : ""} />
          </div>
        </div>

        <div className="flex items-center gap-3.5 bg-surface border border-border rounded-lg px-4.5 py-3 w-full max-w-[620px] shadow-sm">
          <div className="w-8 h-8 rounded-md bg-accent-light flex items-center justify-center text-[15px] shrink-0">👋</div>
          <div className="flex-1">
            <div className="text-[13px] font-medium text-ink">Place your fingers on the home row</div>
            <div className="text-[11px] text-ink-3">Left: A S D F &nbsp;·&nbsp; Right: J K L ;</div>
          </div>
          <div className="font-mono text-[13px] font-medium text-ink-2 bg-surface-2 border border-border-strong rounded px-2.5 py-1 shadow-[0_2px_0_var(--border-strong)] min-w-[32px] text-center">
            {targetKey === " " ? "SPC" : targetKey?.toUpperCase() || "—"}
          </div>
        </div>
      </div>

      {isFinished && (
        <div className="absolute inset-0 z-50 bg-ink/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-xl p-8 max-w-[480px] w-full shadow-md animate-slideUp text-center flex flex-col items-center gap-2.5">
            <div className="font-mono text-[11px] font-medium text-gold bg-gold-light border border-[#B8860B40] px-3.5 py-1 rounded-full">
              +25 XP
            </div>
            <h2 className="font-display text-[20px] font-medium mt-1">Lesson Complete 🎉</h2>
            <div className="text-[13px] text-ink-3 mb-2">You&apos;ve mastered the home row. Your fingers know where to rest.</div>
            
            <div className="flex justify-center gap-7 mb-4">
              <div className="flex flex-col items-center gap-1">
                <div className="font-mono text-[26px] text-ink tracking-tight">{engine.stats.wpm}</div>
                <div className="font-mono text-[9px] tracking-[0.1em] text-ink-3 uppercase">WPM</div>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="font-mono text-[26px] text-ink tracking-tight">{engine.stats.accuracy}%</div>
                <div className="font-mono text-[9px] tracking-[0.1em] text-ink-3 uppercase">Acc</div>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="font-mono text-[26px] text-ink tracking-tight">{engine.stats.errors}</div>
                <div className="font-mono text-[9px] tracking-[0.1em] text-ink-3 uppercase">Errors</div>
              </div>
            </div>

            <div className="flex gap-2.5 w-full">
              <button onClick={() => resetTest()} className="flex-1 px-4.5 py-2 rounded border border-border bg-surface-2 font-body text-[13px] font-medium text-ink-2 hover:bg-surface hover:text-ink transition-colors">
                ↺ Retry
              </button>
              <button 
                onClick={nextLesson}
                disabled={lessonIndex === LESSONS.length - 1}
                className="flex-1 px-4.5 py-2 rounded border border-ink bg-ink font-body text-[13px] font-medium text-white hover:bg-[#2D2A27] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next Lesson →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
