"use client";

export default function WeakKeys() {
  const weakKeys = [
    { key: "P", err: 7.2, cls: "bg-[#C4431A26] border-accent text-accent shadow-[0_2px_0_#943212]" },
    { key: ";", err: 6.1, cls: "bg-[#C4431A26] border-accent text-accent shadow-[0_2px_0_#943212]" },
    { key: "Q", err: 4.8, cls: "bg-[#C4431A26] border-accent text-accent shadow-[0_2px_0_#943212]" },
    { key: "Z", err: 4.2, cls: "bg-[#B8860B1F] border-gold text-gold shadow-[0_2px_0_#8A6408]" },
    { key: "X", err: 3.9, cls: "bg-[#B8860B1F] border-gold text-gold shadow-[0_2px_0_#8A6408]" },
    { key: "/", err: 3.4, cls: "bg-[#B8860B1F] border-gold text-gold shadow-[0_2px_0_#8A6408]" },
    { key: "B", err: 2.1, cls: "bg-surface-2 border-border-strong text-ink-3 shadow-[0_2px_0_var(--border-strong)]" },
    { key: "Y", err: 1.8, cls: "bg-surface-2 border-border-strong text-ink-3 shadow-[0_2px_0_var(--border-strong)]" },
  ];

  return (
    <div className="bg-surface border border-border rounded-[10px] p-6 shadow-sm h-full flex flex-col justify-between">
      <div>
        <div className="flex items-baseline justify-between mb-4">
          <div className="font-mono text-[10px] font-medium tracking-[0.12em] text-ink-3 uppercase">Weak Keys</div>
          <button className="font-mono text-[10px] text-accent hover:underline">Train →</button>
        </div>

        <div className="flex flex-wrap gap-2 content-start">
          {weakKeys.map((item) => (
            <div key={item.key} className="flex flex-col items-center gap-[3px]">
              <div 
                className={`w-[34px] h-[34px] rounded-[5px] border flex items-center justify-center font-mono text-[13px] font-medium transition-transform duration-150 hover:-translate-y-[2px] cursor-default ${item.cls}`}
              >
                {item.key}
              </div>
              <div className="font-mono text-[9px] text-ink-3">{item.err}%</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 border-t border-border pt-3 font-mono text-[10px] text-ink-3 leading-[1.6]">
        Error rate calculated across last 50 sessions. Keys above 3% flagged for manual review.
      </div>
    </div>
  );
}
