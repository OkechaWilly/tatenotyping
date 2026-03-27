"use client";

import React from "react";

interface LetterMasteryGraphProps {
  keyStats: Record<string, { attempts: number; errors: number }>;
}

export default function LetterMasteryGraph({ keyStats }: LetterMasteryGraphProps) {
  const letters = "abcdefghijklmnopqrstuvwxyz".split("");
  
  return (
    <div className="w-full bg-surface/60 backdrop-blur-md border border-border rounded-xl p-6 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-display text-[16px] font-semibold text-ink">Key Mastery Profile</h3>
          <p className="text-[11px] text-ink-3">Performance breakdown by character</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-ink-3">
            <div className="w-2 h-2 rounded-full bg-accent" /> Mastery (&gt;90%)
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-ink-3">
            <div className="w-2 h-2 rounded-full bg-error" /> Weak Area
          </div>
        </div>
      </div>

      <div className="h-[120px] flex items-end gap-[2px] md:gap-[4px] w-full">
        {letters.map((char) => {
          const stats = keyStats[char];
          const accuracy = stats && stats.attempts > 0 
            ? Math.round(((stats.attempts - stats.errors) / stats.attempts) * 100) 
            : 0;
          
          const hasData = stats && stats.attempts > 0;
          const height = hasData ? `${accuracy}%` : "4px";
          const isWeak = hasData && accuracy < 90;

          return (
            <div key={char} className="flex-1 flex flex-col items-center group relative h-full justify-end">
              {/* Tooltip */}
              {hasData && (
                <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                  <div className="bg-ink text-bg text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap font-mono">
                    {char.toUpperCase()}: {accuracy}% ({stats.attempts} taps)
                  </div>
                </div>
              )}
              
              <div 
                className={`w-full rounded-t-sm transition-all duration-500 ease-out shadow-sm ${
                  !hasData ? "bg-border/30" : isWeak ? "bg-error" : "bg-accent"
                }`}
                style={{ height }}
              />
              <div className={`mt-2 font-mono text-[9px] uppercase font-bold ${hasData ? "text-ink" : "text-ink-4"}`}>
                {char}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
