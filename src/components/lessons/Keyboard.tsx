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

  const getKeyClass = (k: string) => {
    const key = k.toLowerCase();
    
    // Left Hand
    if (["1", "q", "a", "z"].includes(key)) return "bg-f-pinky/10 border-f-pinky shadow-[0_3px_0_var(--f-pinky)] text-f-pinky";
    if (["2", "w", "s", "x"].includes(key)) return "bg-f-ring/10 border-f-ring shadow-[0_3px_0_var(--f-ring)] text-f-ring";
    if (["3", "e", "d", "c"].includes(key)) return "bg-f-middle/10 border-f-middle shadow-[0_3px_0_var(--f-middle)] text-f-middle";
    if (["4", "5", "r", "t", "f", "g", "v", "b"].includes(key)) return "bg-f-index/10 border-f-index shadow-[0_3px_0_var(--f-index)] text-f-index";
    
    // Right Hand
    if (["6", "7", "y", "u", "h", "j", "n", "m"].includes(key)) return "bg-f-index/10 border-f-index shadow-[0_3px_0_var(--f-index)] text-f-index";
    if (["8", "i", "k", ","].includes(key)) return "bg-f-middle/10 border-f-middle shadow-[0_3px_0_var(--f-middle)] text-f-middle";
    if (["9", "o", "l", "."].includes(key)) return "bg-f-ring/10 border-f-ring shadow-[0_3px_0_var(--f-ring)] text-f-ring";
    if (["0", "p", ";", "/", "-", "=", "[", "]", "'"].includes(key)) return "bg-f-pinky/10 border-f-pinky shadow-[0_3px_0_var(--f-pinky)] text-f-pinky";

    return "bg-surface border-border shadow-[0_3px_0_var(--border-strong)] text-ink-3 opacity-30";
  };

  return (
    <div className="bg-surface-2 border border-border rounded-[10px] p-3 pb-4 flex flex-col gap-[5px] shadow-sm w-full mx-auto max-w-[620px]">
      {rows.map((row, rIdx) => (
        <div key={rIdx} className="flex gap-1 justify-center">
          {row.map((k) => {
            const isTarget = activeKey?.toLowerCase() === k.toLowerCase();
            const keyClass = isTarget ? getKeyClass(k) : "bg-surface border-border shadow-[0_3px_0_var(--border-strong)] text-ink-3 opacity-30";
            
            const activeClass = isTarget ? "animate-pulse-key ring-2 ring-current ring-offset-2 ring-offset-bg" : "";
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
