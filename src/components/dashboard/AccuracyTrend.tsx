"use client";

import { useEffect, useState } from "react";

export default function AccuracyTrend() {
  const [mounted, setMounted] = useState(false);
  
  const accData = [97, 99, 95, 98, 96, 92, 96];
  const accDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="bg-surface border border-border rounded-[10px] p-6 shadow-sm flex flex-col">
      <div className="flex justify-between items-baseline mb-4">
        <div className="font-mono text-[10px] font-medium tracking-[0.12em] uppercase text-ink-3">Accuracy · 7 Days</div>
        <div className="font-mono text-[11px] text-green">96.1% avg</div>
      </div>

      <div className="flex items-end gap-1.5 h-[100px]">
        {accData.map((val, i) => {
          const height = Math.max(10, ((val - 90) / 10) * 100);
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
              <div
                className="w-full rounded-t-[3px] bg-green transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] cursor-pointer group-hover:brightness-110"
                style={{ height: mounted ? `${height}%` : "0%" }}
              />
              <div className="font-mono text-[9px] text-ink-3 group-hover:text-ink">{val}%</div>
              <div className="font-mono text-[8px] text-ink-4 whitespace-nowrap">{accDays[i]}</div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-3 mt-3.5 pt-2 border-t border-border">
        <div className="font-mono text-[10px] text-ink-3">
          <span className="text-green font-medium">Best</span> · 99% — Tue
        </div>
        <div className="font-mono text-[10px] text-ink-3">
          <span className="text-accent font-medium">Worst</span> · 92% — Sat
        </div>
      </div>
    </div>
  );
}
