"use client";

import { useState, useMemo } from "react";

export default function RightPanel() {
  const [accuracy] = useState(97); // This will eventually be driven by real data
  const circum = 226.2;
  const strokeDashoffset = circum - (accuracy / 100) * circum;

  const heatmapRows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
  ];

  const heatmapErrors = useMemo(() => {
    const map: Record<string, { isError: boolean, errorLevel: number }> = {};
    heatmapRows.flat().forEach(k => { 
      map[k] = { isError: Math.random() > 0.8, errorLevel: Math.random() }; 
    });
    return map;
  }, []);

  return (
    <aside className="border-l border-border bg-surface px-4 py-6 flex flex-col gap-5 overflow-y-auto hidden lg:flex">
      {/* Accuracy */}
      <div>
        <div className="font-mono text-[9px] font-medium tracking-[0.12em] uppercase text-ink-3 mb-2.5">
          Accuracy
        </div>
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-[90px] h-[90px]">
            <svg width="90" height="90" viewBox="0 0 90 90" className="-rotate-90">
              <circle className="fill-none stroke-border" strokeWidth="6" cx="45" cy="45" r="36" />
              <circle
                className="fill-none stroke-accent-2 transition-all duration-500 ease-in-out"
                strokeWidth="6"
                strokeLinecap="round"
                cx="45"
                cy="45"
                r="36"
                strokeDasharray={circum}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="font-mono text-[18px] font-normal text-ink leading-none">
                {accuracy}%
              </div>
              <div className="font-mono text-[9px] text-ink-3 tracking-[0.08em] uppercase">
                ACC%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <div>
        <div className="font-mono text-[9px] font-medium tracking-[0.12em] uppercase text-ink-3 mb-2.5">
          Key Heatmap
        </div>
        <div className="grid grid-rows-3 gap-[3px]">
          {heatmapRows.map((row, i) => (
            <div key={i} className="flex gap-[3px] justify-center">
              {row.map((key) => {
                const { isError, errorLevel } = heatmapErrors[key] || { isError: false, errorLevel: 0 };
                let bgClass = "bg-surface-2 border-border text-ink-3";
                if (isError) {
                  if (errorLevel > 0.6) bgClass = "bg-[#C4431A8C] border-[#C4431AB3] text-white"; // high
                  else if (errorLevel > 0.3) bgClass = "bg-[#C4431A4D] border-[#C4431A80] text-error"; // mid
                  else bgClass = "bg-[#C4431A26] border-[#C4431A4D] text-error"; // low
                }
                return (
                  <div
                    key={key}
                    className={`w-4 h-4 rounded-[2px] flex items-center justify-center font-mono text-[7px] border transition-colors duration-300 ${bgClass}`}
                  >
                    {key}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Sessions */}
      <div>
        <div className="font-mono text-[9px] font-medium tracking-[0.12em] uppercase text-ink-3 mb-2.5">
          Recent Sessions
        </div>
        <div className="flex flex-col gap-1.5">
          {[
            { wpm: 68, acc: 97, time: "2m ago" },
            { wpm: 71, acc: 95, time: "18m ago" },
            { wpm: 65, acc: 98, time: "1h ago" },
          ].map((session, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-2.5 py-2 rounded bg-surface-2 border border-border"
            >
              <div className="font-mono text-[14px] font-medium text-ink">
                {session.wpm}{" "}
                <span className="text-[9px] text-ink-3 uppercase tracking-[0.06em]">wpm</span>
              </div>
              <div className="font-mono text-[11px] text-accent-2">{session.acc}%</div>
              <div className="font-mono text-[10px] text-ink-3">{session.time}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Personal Bests */}
      <div>
        <div className="font-mono text-[9px] font-medium tracking-[0.12em] uppercase text-ink-3 mb-2.5">
          Personal Bests
        </div>
        <div className="flex flex-col gap-1.5">
          {[
            { dur: "15s", wpm: 84, acc: 99 },
            { dur: "30s", wpm: 76, acc: 97 },
            { dur: "60s", wpm: 71, acc: 96 },
          ].map((session, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-2.5 py-2 rounded bg-surface-2 border border-border"
            >
              <div className="font-mono text-[11px] text-ink-3">{session.dur}</div>
              <div className="font-mono text-[14px] font-medium text-ink">
                {session.wpm}{" "}
                <span className="text-[9px] text-ink-3 uppercase tracking-[0.06em]">wpm</span>
              </div>
              <div className="font-mono text-[11px] text-accent-2">{session.acc}%</div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
