"use client";

interface StatsBarProps {
  wpm: number | null;
  rawWpm: number | null;
  accuracy: number | null;
  errors: number;
  timeLeft: number | null;
  totalTime: number;
}

export default function StatsBar({
  wpm,
  rawWpm,
  accuracy,
  errors,
  timeLeft,
  totalTime,
}: StatsBarProps) {
  const circum = 138.2;
  const timeOffset = timeLeft !== null ? circum - (timeLeft / totalTime) * circum : 0;

  return (
    <div className="flex items-center justify-center gap-10 px-8 py-4 border-b border-border bg-surface shrink-0">
      <div className="flex flex-col items-center gap-[2px] min-w-[60px]">
        <div className="font-mono text-[26px] font-normal text-ink leading-none tracking-[-0.02em] transition-colors duration-200">
          {wpm !== null ? wpm : "—"}
        </div>
        <div className="font-mono text-[9px] font-medium tracking-[0.1em] uppercase text-ink-3">
          WPM
        </div>
      </div>

      <div className="w-px h-8 bg-border" />

      <div className="flex flex-col items-center gap-[2px] min-w-[60px]">
        <div className="font-mono text-[26px] font-normal text-ink leading-none tracking-[-0.02em] transition-colors duration-200">
          {rawWpm !== null ? rawWpm : "—"}
        </div>
        <div className="font-mono text-[9px] font-medium tracking-[0.1em] uppercase text-ink-3">
          Raw
        </div>
      </div>

      <div className="w-px h-8 bg-border" />

      <div className="relative w-[52px] h-[52px]">
        <svg width="52" height="52" viewBox="0 0 52 52" className="-rotate-90">
          <circle className="fill-none stroke-border" strokeWidth="3" cx="26" cy="26" r="22" />
          <circle
            className="fill-none stroke-accent transition-all duration-1000 ease-linear"
            strokeWidth="3"
            strokeLinecap="round"
            cx="26"
            cy="26"
            r="22"
            strokeDasharray={circum}
            strokeDashoffset={timeOffset}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-mono text-[14px] font-medium text-ink">
          {timeLeft !== null ? timeLeft : totalTime}
        </div>
      </div>

      <div className="w-px h-8 bg-border" />

      <div className="flex flex-col items-center gap-[2px] min-w-[60px]">
        <div className="font-mono text-[26px] font-normal text-ink leading-none tracking-[-0.02em] transition-colors duration-200">
          {accuracy !== null ? `${accuracy}%` : "—"}
        </div>
        <div className="font-mono text-[9px] font-medium tracking-[0.1em] uppercase text-ink-3">
          Accuracy
        </div>
      </div>

      <div className="w-px h-8 bg-border" />

      <div className="flex flex-col items-center gap-[2px] min-w-[60px]">
        <div className="font-mono text-[26px] font-normal text-ink leading-none tracking-[-0.02em] transition-colors duration-200">
          {errors}
        </div>
        <div className="font-mono text-[9px] font-medium tracking-[0.1em] uppercase text-ink-3">
          Errors
        </div>
      </div>
    </div>
  );
}
