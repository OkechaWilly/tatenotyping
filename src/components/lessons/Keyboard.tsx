"use client";

interface KeyboardProps {
  activeKey: string;
}

export default function Keyboard({ activeKey }: KeyboardProps) {
  const isTarget = (k: string) => activeKey?.toLowerCase() === k.toLowerCase();

  const rows = [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'"],
    ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/"],
  ];

  // Specific home row styling for the lesson
  const getHomeKeyClass = (k: string) => {
    switch (k) {
      case "a": case ";": return "bg-f-pinky/10 border-f-pinky shadow-[0_3px_0_var(--f-pinky)] text-f-pinky";
      case "s": case "l": return "bg-f-ring/10 border-f-ring shadow-[0_3px_0_var(--f-ring)] text-f-ring";
      case "d": case "k": return "bg-f-middle/10 border-f-middle shadow-[0_3px_0_var(--f-middle)] text-f-middle";
      case "f": case "j": return "bg-f-index/10 border-f-index shadow-[0_3px_0_var(--f-index)] text-f-index";
      default: return "bg-surface-2 border-border-strong shadow-[0_3px_0_var(--border-strong)] text-ink-3 opacity-30";
    }
  };

  return (
    <div className="bg-surface-2 border border-border rounded-[10px] p-3 pb-4 flex flex-col gap-[5px] shadow-sm w-full mx-auto max-w-[620px]">
      {rows.map((row, rIdx) => (
        <div key={rIdx} className="flex gap-1 justify-center">
          {row.map((k) => {
            const isHomeRowFocus = ["a", "s", "d", "f", "j", "k", "l", ";"].includes(k);
            const keyClass = isHomeRowFocus
              ? getHomeKeyClass(k)
              : "bg-surface border-border shadow-[0_3px_0_var(--border-strong)] text-ink-3 opacity-30";
            
            const activeClass = isTarget(k) ? "animate-pulse-key" : "";
            const bumpClass = (k === "f" || k === "j") ? "after:content-[''] after:absolute after:bottom-[5px] after:left-1/2 after:-translate-x-1/2 after:w-[9px] after:h-[3px] after:rounded-[2px] after:bg-current after:opacity-45" : "";

            return (
              <div
                key={k}
                className={`relative min-w-[36px] h-[36px] border rounded-[5px] flex flex-col items-center justify-center font-mono text-[11px] font-medium transition-all duration-75 select-none ${keyClass} ${activeClass} ${bumpClass}`}
              >
                <span className="uppercase">{k}</span>
              </div>
            );
          })}
        </div>
      ))}
      <div className="flex gap-1 justify-center">
        <div
          className={`relative min-w-[180px] h-[36px] border rounded-[5px] flex items-center justify-center font-mono text-[11px] font-medium transition-all duration-75 select-none opacity-30 bg-surface border-border shadow-[0_3px_0_var(--border-strong)] text-ink-3 ${
            isTarget(" ") ? "animate-pulse-key opacity-100" : ""
          }`}
        >
          <span style={{ fontSize: "9px", opacity: 0.6 }}>SPACE</span>
        </div>
      </div>
    </div>
  );
}
