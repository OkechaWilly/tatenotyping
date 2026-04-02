"use client";

import { Check, Lock, Play, Star } from "lucide-react";
import { LESSONS } from "@/data/lessons";

interface LessonProgress {
  lesson_id: string;
  completed: boolean;
  best_wpm: number;
  best_accuracy: number;
}

interface CurriculumMapProps {
  progress: Record<string, LessonProgress>;
  isGuest: boolean;
  onSelect: (lessonId: string) => void;
}

export default function CurriculumMap({ progress, isGuest, onSelect }: CurriculumMapProps) {
  return (
    <div className="relative py-12 flex flex-col items-center max-w-2xl mx-auto w-full">
      {/* The main vertical path line */}
      <div className="absolute top-12 bottom-12 left-1/2 -translate-x-1/2 w-3 bg-surface-2 rounded-full overflow-hidden border border-border">
        {/* We can fill the background based on progress, but for now it's static surface-2 */}
      </div>

      {LESSONS.map((lesson, idx) => {
        const lessonProgress = progress[lesson.id] || null;
        
        const isFirst = idx === 0;
        const prevLessonId = idx > 0 ? LESSONS[idx - 1].id : null;
        const prevCompleted = prevLessonId ? progress[prevLessonId]?.completed : false;
        
        const isLocked = !isGuest ? (!isFirst && !prevCompleted) : false;
        const isCompleted = lessonProgress?.completed || false;
        const isActive = !isGuest ? (isFirst || (prevCompleted && !isCompleted)) : isFirst;
        const isMastered = isCompleted && lessonProgress.best_accuracy >= 98 && lessonProgress.best_wpm > 40;

        // Alternate left and right for the cards
        const isLeft = idx % 2 === 0;

        return (
          <div key={lesson.id} className="relative w-full flex justify-center my-8 md:my-10 group">
            
            {/* The Node on the path */}
            <div 
              className={`absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10 w-16 h-16 rounded-full border-4 flex items-center justify-center transition-all duration-300 shadow-xl ${
                isCompleted 
                  ? "bg-accent border-accent text-white shadow-accent/30" 
                  : isActive
                  ? "bg-surface border-accent text-accent shadow-accent/20 animate-pulse-slow"
                  : "bg-surface-2 border-border text-ink-4 opacity-70"
              }`}
            >
              {isMastered ? (
                <Star fill="currentColor" size={24} className="text-gold" />
              ) : isCompleted ? (
                <Check size={28} strokeWidth={3} />
              ) : isLocked ? (
                <Lock size={22} />
              ) : (
                <span className="font-display font-bold text-xl">{idx + 1}</span>
              )}
            </div>

            {/* The Card */}
            <div className={`w-full flex ${isLeft ? 'justify-start md:pr-[50%]' : 'justify-end md:pl-[50%]'} relative z-20 px-6 md:px-12 pointer-events-none`}>
              <div 
                className={`w-full md:w-[320px] pointer-events-auto bg-surface border rounded-3xl p-6 transition-all duration-300 ${
                  isLocked 
                    ? "border-border/50 opacity-60 grayscale-[0.5]" 
                    : isActive
                    ? "border-accent shadow-2xl shadow-accent/10 hover:-translate-y-1 cursor-pointer"
                    : "border-border hover:border-ink-4 hover:shadow-lg cursor-pointer"
                } ${isLeft ? 'md:-mr-8' : 'md:-ml-8'}`}
                onClick={() => !isLocked && onSelect(lesson.id)}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-1 rounded text-[9px] font-mono uppercase tracking-widest font-bold ${
                    lesson.category === "Beginner" ? "bg-green/10 text-green" :
                    lesson.category === "Intermediate" ? "bg-accent/10 text-accent" :
                    "bg-error/10 text-error"
                  }`}>
                    {lesson.category}
                  </span>
                  {isActive && (
                    <span className="px-2 py-1 bg-ink text-bg rounded text-[9px] font-mono uppercase tracking-widest font-bold flex items-center gap-1 animate-fadeUp">
                      <Play size={10} fill="currentColor" /> Next
                    </span>
                  )}
                </div>

                <h3 className="font-display text-xl font-bold text-ink mb-2 leading-tight">
                  {lesson.title}
                </h3>
                <p className="text-ink-3 text-[13px] leading-relaxed mb-4 line-clamp-2">
                  {lesson.description}
                </p>

                {isCompleted && lessonProgress && (
                  <div className="flex items-center justify-between border-t border-border pt-4 mt-2">
                    <div className="flex items-baseline gap-1.5 text-ink">
                      <span className="font-mono text-xl font-bold">{lessonProgress.best_wpm}</span>
                      <span className="font-mono text-[9px] uppercase tracking-widest text-ink-4">WPM</span>
                    </div>
                    <div className={`flex items-baseline gap-1.5 ${lessonProgress.best_accuracy >= 98 ? "text-gold" : "text-green"}`}>
                      <span className="font-mono text-xl font-bold">{lessonProgress.best_accuracy}%</span>
                      <span className="font-mono text-[9px] uppercase tracking-widest text-ink-4 opacity-70">Acc</span>
                    </div>
                  </div>
                )}
                
                {isLocked && (
                  <div className="border-t border-border/50 pt-4 mt-2 text-[12px] font-bold text-ink-4 flex items-center gap-2">
                    <Lock size={14} /> Clear previous to unlock
                  </div>
                )}
              </div>
            </div>

          </div>
        );
      })}
    </div>
  );
}
