"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { LESSONS } from "@/data/lessons";
import LessonCard from "@/components/lessons/LessonCard";
import LessonEngine from "@/components/lessons/LessonEngine";
import { BookOpen, Award, Target, HelpCircle, ChevronRight } from "lucide-react";

interface LessonProgress {
  lesson_id: string;
  completed: boolean;
  best_wpm: number;
  best_accuracy: number;
}

export default function LessonsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [progress, setProgress] = useState<Record<string, LessonProgress>>({});
  const [loading, setLoading] = useState(true);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProgress() {
      if (!user) {
        setLoading(false);
        return;
      }

      const supabase = createClient();
      const { data, error } = await supabase
        .from("lesson_progress")
        .select("lesson_id, completed, best_wpm, best_accuracy")
        .eq("user_id", user.id);

      if (!error && data) {
        const progressMap = data.reduce((acc, curr) => {
          acc[curr.lesson_id] = curr;
          return acc;
        }, {} as Record<string, LessonProgress>);
        setProgress(progressMap);
      }
      setLoading(false);
    }

    if (!authLoading) {
      fetchProgress();
    }
  }, [user, authLoading]);

  if (selectedLessonId) {
    return (
      <AppLayout>
        <LessonEngine 
          initialLessonId={selectedLessonId} 
          onBack={() => setSelectedLessonId(null)} 
        />
      </AppLayout>
    );
  }

  const completedCount = Object.values(progress).filter(p => p.completed).length;
  const avgWpm = completedCount > 0 
    ? Math.round(Object.values(progress).reduce((sum, p) => sum + p.best_wpm, 0) / completedCount)
    : 0;

  return (
    <AppLayout>
      <div className="flex-1 overflow-y-auto bg-bg">
        <div className="layout-container py-8 px-4 sm:px-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-accent font-mono text-[10px] uppercase tracking-[0.2em] font-bold">
                <BookOpen size={14} />
                Curriculum
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink tracking-tight">
                Master the Keyboard
              </h1>
              <p className="text-ink-3 text-[14px] max-w-[500px] leading-relaxed">
                Sequential lessons designed to build muscle memory from the home row to the full keyboard.
              </p>
            </div>

            {user && (
              <div className="flex gap-4 sm:gap-8 bg-surface border border-border px-6 py-4 rounded-2xl shadow-sm">
                <div className="flex flex-col">
                  <span className="text-ink-4 font-mono text-[9px] uppercase tracking-wider mb-1">Progress</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-ink">{completedCount}</span>
                    <span className="text-ink-3 text-xs font-medium">/ {LESSONS.length}</span>
                  </div>
                </div>
                <div className="w-px h-10 bg-border" />
                <div className="flex flex-col">
                  <span className="text-ink-4 font-mono text-[9px] uppercase tracking-wider mb-1">Avg Speed</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-ink">{avgWpm}</span>
                    <span className="text-ink-4 text-[10px] font-bold">WPM</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Lessons Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {LESSONS.map((lesson, idx) => {
              const lessonProgress = progress[lesson.id] || null;
              
              // Logic: 
              // 1. First lesson is always unlocked
              // 2. Guest user (no user) has all unlocked
              // 3. Authenticated user: unlocked if previous lesson is completed
              const isFirst = idx === 0;
              const prevLessonId = idx > 0 ? LESSONS[idx - 1].id : null;
              const prevCompleted = prevLessonId ? progress[prevLessonId]?.completed : false;
              
              const isLocked = user ? (!isFirst && !prevCompleted) : false;
              const isActive = user ? (isFirst || (prevCompleted && !lessonProgress?.completed)) : isFirst;

              return (
                <LessonCard 
                  key={lesson.id}
                  lesson={{...lesson, index: idx}}
                  progress={lessonProgress}
                  isLocked={isLocked}
                  isActive={isActive}
                  onSelect={() => setSelectedLessonId(lesson.id)}
                />
              );
            })}
          </div>

          {/* Help Footer */}
          <div className="mt-16 p-8 rounded-3xl bg-surface-2 border border-border-strong flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6 text-center md:text-left">
              <div className="w-14 h-14 rounded-2xl bg-surface flex items-center justify-center text-accent shadow-sm border border-border">
                <HelpCircle size={28} />
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="text-lg font-bold text-ink">New to touch typing?</h4>
                <p className="text-ink-3 text-[13px] max-w-[400px]">
                  Start with Lesson 01. Focus strictly on accuracy (90%+) before worrying about speed. 
                  Speed is a byproduct of precision.
                </p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-ink text-white font-bold text-[13px] hover:bg-ink-1 transition-all group">
              View Reference Guide
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
