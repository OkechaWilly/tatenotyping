"use client";

export default function ActivityCalendar() {
  const weeks = 18;
  const daysPerWeek = 7;

  // Mock data generator for 18 weeks (126 days)
  const generateGrid = () => {
    const grid = [];
    for (let w = 0; w < weeks; w++) {
      const weekDays = [];
      for (let d = 0; d < daysPerWeek; d++) {
        const rand = Math.random();
        let level = 0;
        if (rand > 0.85) level = 4;
        else if (rand > 0.7) level = 3;
        else if (rand > 0.5) level = 2;
        else if (rand > 0.3) level = 1;
        
        // Mark today as active
        if (w === weeks - 1 && d === 4) level = 5; 
        
        weekDays.push(level);
      }
      grid.push(weekDays);
    }
    return grid;
  };

  const gridData = generateGrid();
  const months = ["Jan", "Feb", "Mar", "Apr"]; // Approximation for 18 weeks

  const getDayClass = (level: number) => {
    if (level === 5) return "bg-accent border-accent shadow-[0_0_0_2px_var(--accent)]"; // Today
    if (level === 4) return "bg-accent border-accent";
    if (level === 3) return "bg-[#C4431AA6] border-[#C4431AB3]";
    if (level === 2) return "bg-[#C4431A66] border-[#C4431A80]";
    if (level === 1) return "bg-[#C4431A33] border-[#C4431A4D]";
    return "bg-surface-2 border-border hover:scale-[1.3] z-10 relative";
  };

  return (
    <div className="bg-surface border border-border rounded-[10px] p-6 shadow-sm">
      <div className="flex items-baseline justify-between mb-4">
        <div className="font-mono text-[10px] font-medium tracking-[0.12em] text-ink-3 uppercase">Activity Calendar</div>
        <button className="font-mono text-[10px] text-accent hover:underline">View all →</button>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex mb-[-2px]">
          {months.map((m, i) => (
            <div key={i} className="flex-1 text-center font-mono text-[9px] text-ink-4 tracking-[0.06em] uppercase">
              {m}
            </div>
          ))}
        </div>
        
        <div className="flex gap-[3px]">
          {gridData.map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-[3px]">
              {week.map((dayLevel, dIdx) => (
                <div
                  key={`${wIdx}-${dIdx}`}
                  className={`w-3 h-3 rounded-[2px] border transition-transform duration-100 hover:scale-[1.3] relative cursor-pointer ${getDayClass(dayLevel)}`}
                  title={dayLevel > 0 ? "Practice recorded" : "No practice"}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-5 mt-5 border-t border-border pt-3">
        <div className="flex flex-col gap-0.5">
          <div className="font-mono text-[18px] font-medium text-ink leading-none">7</div>
          <div className="font-mono text-[9px] text-ink-3 uppercase tracking-[0.1em]">Current streak</div>
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="font-mono text-[18px] font-medium text-ink leading-none">21</div>
          <div className="font-mono text-[9px] text-ink-3 uppercase tracking-[0.1em]">Longest streak</div>
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="font-mono text-[18px] font-medium text-ink leading-none">68%</div>
          <div className="font-mono text-[9px] text-ink-3 uppercase tracking-[0.1em]">Days active</div>
        </div>
      </div>
    </div>
  );
}
