export default function SessionsTable() {
  const sessions = [
    { wpm: 84, raw: 91, acc: 98, mode: "Words", dur: "60s", time: "2m ago", pb: true },
    { wpm: 78, raw: 84, acc: 95, mode: "Code", dur: "30s", time: "34m ago", pb: false },
    { wpm: 76, raw: 82, acc: 97, mode: "Quotes", dur: "60s", time: "1h ago", pb: false },
    { wpm: 81, raw: 87, acc: 96, mode: "Words", dur: "2m", time: "2h ago", pb: false },
    { wpm: 74, raw: 80, acc: 94, mode: "Prose", dur: "60s", time: "Yesterday", pb: false },
    { wpm: 79, raw: 85, acc: 98, mode: "Words", dur: "30s", time: "Yesterday", pb: false },
    { wpm: 72, raw: 78, acc: 95, mode: "Code", dur: "60s", time: "2d ago", pb: false },
  ];

  return (
    <div className="bg-surface border border-border rounded-[10px] py-[22px] shadow-sm flex flex-col h-full">
      <div className="flex items-baseline justify-between px-6 mb-4">
        <div className="font-mono text-[10px] font-medium tracking-[0.12em] text-ink-3 uppercase">Recent Sessions</div>
        <button className="font-mono text-[10px] text-accent hover:underline">All sessions →</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="font-mono text-[9px] font-medium tracking-[0.1em] uppercase text-ink-3 text-left pb-2.5 px-3 border-b border-border">WPM</th>
              <th className="font-mono text-[9px] font-medium tracking-[0.1em] uppercase text-ink-3 text-left pb-2.5 px-3 border-b border-border">Raw</th>
              <th className="font-mono text-[9px] font-medium tracking-[0.1em] uppercase text-ink-3 text-left pb-2.5 px-3 border-b border-border">Accuracy</th>
              <th className="font-mono text-[9px] font-medium tracking-[0.1em] uppercase text-ink-3 text-left pb-2.5 px-3 border-b border-border">Mode</th>
              <th className="font-mono text-[9px] font-medium tracking-[0.1em] uppercase text-ink-3 text-left pb-2.5 px-3 border-b border-border">Duration</th>
              <th className="font-mono text-[9px] font-medium tracking-[0.1em] uppercase text-ink-3 text-left pb-2.5 px-3 border-b border-border">Time</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s, i) => (
              <tr key={i} className="hover:bg-surface-2 transition-colors">
                <td className="py-2.5 px-3 border-b border-border font-mono text-[15px] font-medium text-ink flex items-center gap-2">
                  {s.wpm}
                  {s.pb && (
                    <span className="inline-flex items-center font-mono text-[9px] text-gold bg-gold-light border border-[#B8860B33] px-1.5 py-px rounded-full">
                      PB
                    </span>
                  )}
                </td>
                <td className="py-2.5 px-3 border-b border-border font-mono text-[12px] text-ink-2">{s.raw}</td>
                <td className="py-2.5 px-3 border-b border-border font-mono text-[12px] text-ink-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-surface-2 rounded-full overflow-hidden border border-border min-w-[60px]">
                      <div className="h-full bg-green" style={{ width: `${s.acc}%` }} />
                    </div>
                    <span>{s.acc}%</span>
                  </div>
                </td>
                <td className="py-2.5 px-3 border-b border-border">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full font-mono text-[10px] border border-border bg-surface-2 text-ink-3">
                    {s.mode}
                  </span>
                </td>
                <td className="py-2.5 px-3 border-b border-border font-mono text-[12px] text-ink-2">{s.dur}</td>
                <td className="py-2.5 px-3 border-b border-border font-mono text-[12px] text-ink-2">{s.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
