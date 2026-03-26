"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { Zap } from "lucide-react";

export default function ProfileHero() {
  const { user, profile, isLoading } = useAuth();
  const [xpProgress, setXpProgress] = useState(0);
  const [achievements, setAchievements] = useState<string[]>([]);

  useEffect(() => {
    if (profile) {
      // Level up threshold logic (assuming 4000 XP per level based on UI)
      const currentLevelXp = profile.xp % 4000;
      const progress = (currentLevelXp / 4000) * 100;
      const timer = setTimeout(() => setXpProgress(progress), 300);
      return () => clearTimeout(timer);
    }
  }, [profile]);

  useEffect(() => {
    async function fetchAchievements() {
      if (!user) return;
      const supabase = createClient();
      const { data } = await supabase
        .from("achievements")
        .select("achievement_key")
        .eq("user_id", user.id);
      
      if (data) {
        setAchievements(data.map(a => a.achievement_key));
      }
    }
    fetchAchievements();
  }, [user]);

  if (isLoading) {
    return (
      <div className="h-[148px] w-full bg-surface border border-border rounded-xl animate-pulse" />
    );
  }

  if (!profile) {
    return (
      <div className="bg-surface border border-border rounded-xl px-8 py-7 shadow-sm text-center">
        <div className="text-ink-3 text-sm">Sign in to view your profile and track progress</div>
      </div>
    );
  }

  const nextLevelXp = 4000;
  const currentLevelXp = profile.xp % nextLevelXp;
  const xpToNext = nextLevelXp - currentLevelXp;
  const hasFullKeyboard = achievements.includes("full-keyboard");

  return (
    <div className="flex flex-col md:grid md:grid-cols-[1fr_auto] gap-6 sm:gap-5 items-start bg-surface border border-border rounded-xl px-4 sm:px-8 py-6 sm:py-7 shadow-sm relative overflow-hidden animate-fadeUp">
      {/* Decorative radial gradient */}
      <div className="absolute -right-10 -top-10 w-[220px] h-[220px] rounded-full bg-[radial-gradient(circle,rgba(196,67,26,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div className="flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-ink text-white flex items-center justify-center font-display text-[22px] font-medium shrink-0 relative">
          {profile.username?.substring(0, 2).toUpperCase() || "JD"}
          <div className="absolute -inset-1 rounded-full border-2 border-accent opacity-60" />
        </div>
        
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="font-display text-[20px] sm:text-[22px] font-medium text-ink leading-[1.1]">{profile?.username}</div>
            {hasFullKeyboard && (
              <div className="bg-accent/10 border border-accent/20 px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm shadow-accent/5 animate-pulse-slow">
                <Zap size={10} className="text-accent" fill="currentColor" />
                <span className="text-[9px] font-bold text-accent uppercase tracking-widest">Full Keyboard</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2.5 font-mono text-[10px] sm:text-[11px] text-ink-3">
            <span>@{profile?.username?.toLowerCase()}</span>
            <span className="text-border-strong">·</span>
            <span>Member since {profile?.created_at ? new Date(profile.created_at).toLocaleDateString("en-US", { month: 'short', year: 'numeric' }) : '...'}</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-1">
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full font-mono text-[9px] sm:text-[10px] font-medium border bg-green-light text-green border-[#2D6A4F33]">✓ Verified</div>
            {profile && profile.streak_current >= 7 && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full font-mono text-[9px] sm:text-[10px] font-medium border bg-accent-light text-accent border-[#C4431A33]">🔥 {profile.streak_current}-Day Streak</div>
            )}
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full font-mono text-[9px] sm:text-[10px] font-medium border bg-blue-light text-blue border-[#2E5F8A33]">💼 Pro</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full md:w-auto md:min-w-[240px]">
        <div className="flex items-center gap-3 justify-end">
          <div className="flex items-center gap-3">
            <div className="font-display text-[28px] font-semibold text-ink leading-none">{profile.level}</div>
            <div>
              <div className="font-mono text-[10px] text-ink-3 tracking-[0.08em] uppercase">Level</div>
              <div className="font-mono text-[11px] text-accent font-medium">Skilled Typist</div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-baseline">
          <div className="font-mono text-[10px] tracking-[0.1em] uppercase text-ink-3">XP Progress</div>
          <div className="font-mono text-[11px] text-ink-2">{currentLevelXp.toLocaleString()} / {nextLevelXp.toLocaleString()} XP</div>
        </div>
        
        <div className="h-1.5 bg-surface-2 rounded-[3px] overflow-hidden border border-border">
          <div 
            className="h-full rounded-[3px] bg-gradient-to-r from-accent to-[#E05520] transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)]"
            style={{ width: `${xpProgress}%` }}
          />
        </div>
        
        <div className="font-mono text-[10px] text-ink-3 mt-1 text-right">{xpToNext.toLocaleString()} XP to Level {profile.level + 1}</div>
      </div>
    </div>
  );
}
