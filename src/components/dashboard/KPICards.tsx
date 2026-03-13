export default function KPICards() {
  const kpis = [
    {
      icon: "⚡",
      label: "Best WPM",
      value: "84",
      sub: "wpm",
      delta: "↑ +6 this week",
      deltaColor: "text-green",
      hoverClass: "hover:before:bg-accent",
    },
    {
      icon: "◎",
      label: "Avg Accuracy",
      value: "96",
      sub: "%",
      delta: "↑ +1.2% this week",
      deltaColor: "text-green",
      hoverClass: "hover:before:bg-green",
    },
    {
      icon: "🔥",
      label: "Current Streak",
      value: "7",
      sub: "days",
      delta: "Best: 21 days",
      deltaColor: "text-ink-3", // neutral for simple text
      hoverClass: "hover:before:bg-gold",
    },
    {
      icon: "⏱",
      label: "Time Practiced",
      value: "18",
      sub: "hrs",
      delta: "↑ 2.4h this week",
      deltaColor: "text-green",
      hoverClass: "hover:before:bg-blue",
    },
    {
      icon: "✓",
      label: "Sessions",
      value: "342",
      sub: "",
      delta: "↑ 12 this week",
      deltaColor: "text-green",
      hoverClass: "hover:before:bg-ink",
    },
  ];

  return (
    <div className="grid grid-cols-5 gap-3 animate-fadeUp" style={{ animationDelay: "0.08s" }}>
      {kpis.map((kpi, i) => (
        <div
          key={i}
          className={`bg-surface border border-border rounded-lg px-4 py-[18px] flex flex-col gap-1.5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-px cursor-default relative overflow-hidden group`}
        >
          <div className={`absolute top-0 left-0 right-0 h-[2px] opacity-0 transition-opacity duration-200 group-hover:opacity-100 ${kpi.hoverClass.replace('hover:before:', '')}`} />
          
          <div className="absolute right-3.5 top-3.5 text-lg opacity-20">{kpi.icon}</div>
          
          <div className="font-mono text-[9px] font-medium tracking-[0.12em] uppercase text-ink-3">
            {kpi.label}
          </div>
          <div className="font-mono text-[30px] font-normal text-ink leading-none tracking-[-0.02em]">
            {kpi.value}
            {kpi.sub && <sub className="text-[14px] opacity-60 font-normal align-baseline ml-[2px]">{kpi.sub}</sub>}
          </div>
          <div className={`font-mono text-[10px] ${kpi.deltaColor}`}>
            {kpi.delta}
          </div>
        </div>
      ))}
    </div>
  );
}
