"use client";

import { useState } from "react";

const wpmDataRecord: Record<"7d" | "30d" | "all", number[]> = {
  "7d": [62, 68, 71, 66, 74, 78, 84],
  "30d": [55, 58, 60, 57, 62, 65, 63, 68, 66, 70, 69, 72, 71, 68, 74, 73, 76, 75, 78, 77, 74, 79, 76, 80, 78, 82, 81, 79, 83, 84],
  "all": [40, 42, 45, 43, 48, 50, 49, 52, 54, 53, 56, 55, 58, 60, 59, 62, 65, 63, 68, 66, 70, 72, 71, 74, 76, 75, 78, 80, 82, 84],
};

const rawDataRecord: Record<"7d" | "30d" | "all", number[]> = {
  "7d": [68, 74, 78, 73, 80, 84, 90],
  "30d": [60, 63, 66, 62, 68, 71, 69, 74, 72, 76, 75, 78, 77, 74, 80, 79, 82, 81, 84, 83, 80, 85, 82, 86, 84, 88, 87, 85, 89, 90],
  "all": [44, 46, 50, 48, 53, 55, 54, 57, 59, 58, 61, 60, 63, 65, 64, 67, 70, 68, 73, 72, 76, 78, 77, 80, 82, 81, 84, 86, 88, 90],
};

export default function WPMChart() {
  const [period, setPeriod] = useState<"7d" | "30d" | "all">("7d");

  const buildChartPath = (data: number[], min: number, max: number, W: number, H: number, pL: number, pR: number, pT: number, pB: number) => {
    if (data.length === 0) return "";
    const x = (i: number) => pL + (i / (data.length - 1)) * (W - pL - pR);
    const y = (v: number) => pT + (1 - (v - min) / (max - min)) * (H - pT - pB);
    return data.map((d, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(d)}`).join(" ");
  };

  const W = 520, H = 140, pL = 32, pR = 10, pT = 12, pB = 28;
  const data = wpmDataRecord[period];
  const raw = rawDataRecord[period];
  const minV = Math.min(...data, ...raw) - 8;
  const maxV = Math.max(...data, ...raw) + 8;
  const xFn = (i: number) => pL + (i / (data.length - 1)) * (W - pL - pR);
  const yFn = (v: number) => pT + (1 - (v - minV) / (maxV - minV)) * (H - pT - pB);

  const wpmPath = buildChartPath(data, minV, maxV, W, H, pL, pR, pT, pB);
  const rawPath = buildChartPath(raw, minV, maxV, W, H, pL, pR, pT, pB);
  const areaPath = `${wpmPath} L${xFn(data.length - 1)},${H - pB} L${xFn(0)},${H - pB} Z`;

  return (
    <div className="bg-surface border border-border rounded-[10px] p-6 shadow-sm flex flex-col">
      <div className="flex items-baseline justify-between mb-4">
        <div className="font-mono text-[10px] font-medium tracking-[0.12em] uppercase text-ink-3">WPM History</div>
        <div className="flex gap-[2px] bg-surface-2 rounded mb-1 p-0.5">
          {(["7d", "30d", "all"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-2.5 py-1 rounded font-mono text-[10px] tracking-[0.06em] uppercase transition-all duration-150 ${
                period === p ? "bg-surface text-ink shadow-sm font-medium" : "text-ink-3 hover:text-ink"
              }`}
            >
              {p.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="relative w-full">
        <svg viewBox="0 0 520 140" preserveAspectRatio="none" className="w-full h-[140px] overflow-visible">
          <defs>
            <linearGradient id="wpmGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1={pL} y1={H - pB} x2={W - pR} y2={H - pB} className="stroke-border stroke-1" />
          <line x1={pL} y1={pT} x2={W - pR} y2={pT} className="stroke-border stroke-1" strokeDasharray="3 3" />

          {/* Area and Lines */}
          <path d={areaPath} fill="url(#wpmGradient)" opacity={0.25} />
          <path d={rawPath} fill="none" className="stroke-ink-4 stroke-[1.5px]" strokeDasharray="4 3" strokeLinecap="round" strokeLinejoin="round" />
          <path d={wpmPath} fill="none" className="stroke-accent stroke-2" strokeLinecap="round" strokeLinejoin="round" />
          
          {/* Dots */}
          {data.map((d, i) => (
            <circle
              key={i}
              cx={xFn(i)}
              cy={yFn(d)}
              r={3}
              className="fill-accent stroke-white stroke-2 cursor-pointer transition-all duration-150 hover:r-5"
            />
          ))}
        </svg>
      </div>
      
      <div className="flex gap-4 mt-3">
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-ink-3">
          <div className="w-5 h-0.5 rounded-sm bg-accent" /> WPM
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-ink-3">
          <div className="w-5 h-0 border-t border-dashed border-ink-4" /> Raw
        </div>
      </div>
    </div>
  );
}
