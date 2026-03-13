"use client";

import { useEffect, useState } from "react";

export default function ProfileHero() {
  const [xpProgress, setXpProgress] = useState(0);

  useEffect(() => {
    // Trigger animation on mount
    const timer = setTimeout(() => setXpProgress(81), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="grid grid-cols-[1fr_auto] gap-5 items-start bg-surface border border-border rounded-xl px-8 py-7 shadow-sm relative overflow-hidden animate-fadeUp">
      {/* Decorative radial gradient */}
      <div className="absolute -right-10 -top-10 w-[220px] h-[220px] rounded-full bg-[radial-gradient(circle,rgba(196,67,26,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div className="flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-ink text-white flex items-center justify-center font-display text-[22px] font-medium shrink-0 relative">
          JD
          <div className="absolute -inset-1 rounded-full border-2 border-accent opacity-60" />
        </div>
        
        <div className="flex flex-col gap-1">
          <div className="font-display text-[22px] font-medium text-ink leading-[1.1]">Jordan Davies</div>
          <div className="flex items-center gap-2.5 font-mono text-[11px] text-ink-3">
            <span>@jordand</span>
            <span className="text-border-strong">·</span>
            <span>Member since Jan 2026</span>
            <span className="text-border-strong">·</span>
            <span>342 sessions</span>
          </div>
          <div className="flex gap-1.5 mt-1">
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full font-mono text-[10px] font-medium border bg-green-light text-green border-[#2D6A4F33]">✓ Verified</div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full font-mono text-[10px] font-medium border bg-gold-light text-gold border-[#B8860B33]">⭐ Top 5%</div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full font-mono text-[10px] font-medium border bg-accent-light text-accent border-[#C4431A33]">🔥 7-Day Streak</div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full font-mono text-[10px] font-medium border bg-blue-light text-blue border-[#2E5F8A33]">💼 Pro</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 min-w-[240px]">
        <div className="flex items-end gap-2.5 mb-2">
          <div className="flex items-center gap-1.5">
            <div className="font-display text-[28px] font-semibold text-ink leading-none">14</div>
            <div>
              <div className="font-mono text-[10px] text-ink-3 tracking-[0.08em] uppercase">Level</div>
              <div className="font-mono text-[11px] text-accent font-medium">Skilled Typist</div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-baseline">
          <div className="font-mono text-[10px] tracking-[0.1em] uppercase text-ink-3">XP Progress</div>
          <div className="font-mono text-[11px] text-ink-2">3,240 / 4,000 XP</div>
        </div>
        
        <div className="h-1.5 bg-surface-2 rounded-[3px] overflow-hidden border border-border">
          <div 
            className="h-full rounded-[3px] bg-gradient-to-r from-accent to-[#E05520] transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)]"
            style={{ width: `${xpProgress}%` }}
          />
        </div>
        
        <div className="font-mono text-[10px] text-ink-3 mt-1">760 XP to Level 15 · Proficient Typist</div>
      </div>
    </div>
  );
}
