"use client";

import CurriculumMap from "@/components/lessons/CurriculumMap";

// ... [existing imports]
import { useEffect, useState } from "react";
import Link from "next/link";
import AppLayout from "@/components/layout/AppLayout";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { LESSONS } from "@/data/lessons";
import LessonEngine from "@/components/lessons/LessonEngine";
import { BookOpen, HelpCircle, ChevronRight } from "lucide-react";

interface LessonProgress {
  lesson_id: string;
  completed: boolean;
  best_wpm: number;
  best_accuracy: number;
}

export default function LessonsPage() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<Record<string, LessonProgress>>({});
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<{ level: number; xp: number } | null>(null);

  useEffect(() => {
    async function fetchProgress() {
      if (!user) return;

      const supabase = createClient();
      const [progressRes, profileRes] = await Promise.all([
        supabase.from("lesson_progress").select("lesson_id, completed, best_wpm, best_accuracy").eq("user_id", user.id),
        supabase.from("profiles").select("level, xp").eq("id", user.id).single()
      ]);

      if (!progressRes.error && progressRes.data) {
        const progressMap = progressRes.data.reduce((acc, curr) => {
          acc[curr.lesson_id] = curr;
          return acc;
        }, {} as Record<string, LessonProgress>);
        setProgress(progressMap);
      }

      if (!profileRes.error && profileRes.data) {
        setUserProfile(profileRes.data);
      }
    }

    fetchProgress();
  }, [user]);

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
              <div className="flex flex-col gap-4">
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

                {userProfile && (
                  <div className="bg-surface-2 border border-border px-5 py-4 rounded-2xl flex flex-col gap-3 shadow-inner">
                    <div className="flex justify-between items-end">
                      <div className="flex items-end gap-2">
                        <span className="text-ink font-mono text-[10px] uppercase tracking-widest font-bold">Lv.</span>
                        <span className="text-2xl font-display font-bold leading-none text-accent">{userProfile.level || 1}</span>
                      </div>
                      <div className="text-[10px] font-mono uppercase tracking-widest text-ink-4">
                        <span className="text-ink-3 font-bold">{userProfile.xp || 0}</span> / {((userProfile.level || 1) * 4000)} XP
                      </div>
                    </div>
                    <div className="h-2 w-full bg-surface border border-border rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-accent transition-all duration-1000 ease-out" 
                        style={{ width: `${Math.min(100, Math.max(0, ((userProfile.xp || 0) / ((userProfile.level || 1) * 4000)) * 100))}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* New Curriculum Map */}
          <CurriculumMap 
             progress={progress} 
             isGuest={!user} 
             onSelect={(id) => setSelectedLessonId(id)} 
          />

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
            <Link href="/lessons/reference" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-ink text-bg font-bold text-[13px] hover:bg-ink/90 transition-all group shadow-lg shadow-ink/10">
              View Reference Guide
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
