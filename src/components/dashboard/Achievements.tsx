"use client";

export default function Achievements() {
  const achievements = [
    { icon: "⚡", name: "Speed Demon", desc: "Reach 80 WPM", unlocked: true },
    { icon: "🎯", name: "Sharpshooter", desc: "100% accuracy", unlocked: true },
    { icon: "🔥", name: "On Fire", desc: "7-day streak", unlocked: true },
    { icon: "📚", name: "Word Wizard", desc: "10k words typed", unlocked: true },
    { icon: "🌙", name: "Night Owl", desc: "Practice at midnight", unlocked: true },
    { icon: "⌨️", name: "Home Row Hero", desc: "Complete home row lesson", unlocked: true },
    { icon: "💎", name: "Diamond Hands", desc: "30-day streak", unlocked: false },
    { icon: "🚀", name: "Rocket", desc: "Reach 100 WPM", unlocked: false },
    { icon: "🏆", name: "Champion", desc: "Top 1% globally", unlocked: false },
    { icon: "📖", name: "Novelist", desc: "Type 100k words", unlocked: false },
    { icon: "🎓", name: "Graduate", desc: "Complete all lessons", unlocked: false },
    { icon: "⏰", name: "Marathoner", desc: "50 hours total", unlocked: false },
  ];

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="bg-surface border border-border rounded-[10px] p-6 shadow-sm animate-fadeUp" style={{ animationDelay: "0.3s" }}>
      <div className="flex items-baseline justify-between mb-4">
        <div className="font-mono text-[10px] font-medium tracking-[0.12em] text-ink-3 uppercase">
          Achievements · {unlockedCount} / {achievements.length} Unlocked
        </div>
        <button className="font-mono text-[10px] text-accent hover:underline">View all →</button>
      </div>

      <div className="grid grid-cols-4 gap-2.5">
        {achievements.map((ach) => (
          <div
            key={ach.name}
            className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-md border text-center transition-all duration-200 relative group cursor-default ${
              ach.unlocked
                ? "bg-surface border-border hover:border-gold hover:shadow-sm"
                : "bg-surface-2 border-border opacity-45 hover:border-border-strong hover:shadow-sm"
            }`}
          >
            <div className="text-[22px] leading-none mb-1">{ach.icon}</div>
            <div className="font-mono text-[9px] font-medium text-ink-2 tracking-[0.04em] leading-[1.3] group-hover:text-ink">
              {ach.name}
            </div>
            {!ach.unlocked && (
              <div className="absolute top-1.5 right-1.5 text-[8px] text-ink-4">🔒</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
