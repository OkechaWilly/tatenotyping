"use client";

import { useTypingContext, TypingMode, Duration, Difficulty } from "@/context/TypingContext";

export default function Sidebar() {
  const { mode: activeMode, setMode: setActiveMode, duration, setDuration, difficulty, setDifficulty } = useTypingContext();

  const modes = [
    { id: "words", name: "Words", sub: "Common vocab", icon: "Aa", iconStyle: "text-[13px]" },
    { id: "quotes", name: "Quotes", sub: "Literature", icon: "❝", iconStyle: "text-[11px]" },
    { id: "code", name: "Code", sub: "Syntax focused", icon: "{}", iconStyle: "text-[11px]" },
    { id: "prose", name: "Prose", sub: "Long form", icon: "¶", iconStyle: "text-[10px]" },
    { id: "realworld", name: "Real-world", sub: "Dynamic texts", icon: "🌍", iconStyle: "text-[11px]" },
    { id: "numbers", name: "Numbers", sub: "Numeric pad", icon: "01", iconStyle: "text-[11px]" },
  ];

  const durations = [
    { label: "15s", val: 15 },
    { label: "30s", val: 30 },
    { label: "60s", val: 60 },
    { label: "2m", val: 120 },
  ];

  const difficulties = [
    { name: "Beginner", dots: 1 },
    { name: "Intermediate", dots: 2 },
    { name: "Advanced", dots: 3 },
  ];

  return (
    <aside className="border-r border-border bg-surface py-6 overflow-y-auto flex flex-col">
      {/* Mode */}
      <div className="px-4 pb-5 border-b border-border mb-2">
        <div className="font-mono text-[9px] font-medium tracking-[0.12em] uppercase text-ink-3 mb-2.5 px-1">Mode</div>
        <div className="flex flex-col gap-0.5">
          {modes.map((mode) => (
            <div
              key={mode.id}
              onClick={() => setActiveMode(mode.id as TypingMode)}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded cursor-pointer transition-all duration-150 border ${
                activeMode === mode.id
                  ? "bg-accent-light border-[#C4431A26]"
                  : "border-transparent hover:bg-surface-2"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 transition-colors ${
                  activeMode === mode.id ? "bg-accent text-white" : "bg-surface-2"
                } ${mode.iconStyle}`}
              >
                {mode.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-[13px] font-medium whitespace-nowrap overflow-hidden text-ellipsis ${activeMode === mode.id ? "text-accent" : "text-ink"}`}>
                  {mode.name}
                </div>
                <div className="text-[11px] text-ink-3 font-mono">{mode.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Duration */}
      <div className="px-4 pb-5 border-b border-border mb-2">
        <div className="font-mono text-[9px] font-medium tracking-[0.12em] uppercase text-ink-3 mb-2.5 px-1">Duration</div>
        <div className="grid grid-cols-4 gap-1">
          {durations.map((dur) => (
            <button
              key={dur.val}
              onClick={() => setDuration(dur.val as Duration)}
              className={`border rounded px-1 py-1.5 font-mono text-[11px] font-medium cursor-pointer text-center transition-all duration-150 ${
                duration === dur.val
                  ? "bg-accent text-white border-accent shadow-sm shadow-accent/20"
                  : "bg-surface-2 border-border text-ink-2 hover:border-border-strong"
              }`}
            >
              {dur.label}
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div className="px-4 pb-5 border-b border-border mb-2">
        <div className="font-mono text-[9px] font-medium tracking-[0.12em] uppercase text-ink-3 mb-2.5 px-1">Difficulty</div>
        <div className="flex flex-col gap-1">
          {difficulties.map((diff) => (
            <button
              key={diff.name}
              onClick={() => setDifficulty(diff.name as Difficulty)}
              className={`flex items-center justify-between px-2.5 py-[7px] rounded border cursor-pointer text-xs font-medium transition-all duration-150 ${
                difficulty === diff.name
                  ? "bg-accent text-white border-accent shadow-sm shadow-accent/20"
                  : "bg-surface-2 border-border text-ink-2 hover:border-border-strong"
              }`}
            >
              {diff.name}
              <div className="flex gap-[2px]">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-[5px] h-[5px] rounded-full ${
                      difficulty === diff.name
                        ? i < diff.dots
                          ? "bg-white"
                          : "bg-white/30"
                        : i < diff.dots
                        ? "bg-ink-3/40"
                        : "bg-border-strong"
                    }`}
                  />
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Layout */}
      <div className="px-4">
        <div className="font-mono text-[9px] font-medium tracking-[0.12em] uppercase text-ink-3 mb-2.5 px-1">Layout</div>
        <select className="w-full px-2.5 py-[7px] rounded border border-border bg-surface-2 font-mono text-[11px] text-ink-2 cursor-pointer outline-none">
          <option>QWERTY (US)</option>
          <option>AZERTY (FR)</option>
          <option>QWERTZ (DE)</option>
          <option>Dvorak</option>
          <option>Colemak</option>
        </select>
      </div>
    </aside>
  );
}
