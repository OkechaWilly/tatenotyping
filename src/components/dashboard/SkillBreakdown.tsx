"use client";

import { useEffect, useState } from "react";

export default function SkillBreakdown() {
  const [mounted, setMounted] = useState(false);

  const skills = [
    { name: "Speed", val: 76, max: 150, color: "bg-accent", label: "76 WPM avg" },
    { name: "Accuracy", val: 96, max: 100, color: "bg-green", label: "96.1%" },
    { name: "Consistency", val: 82, max: 100, color: "bg-gold", label: "82%" },
    { name: "Rhythm", val: 68, max: 100, color: "bg-blue", label: "68%" },
    { name: "Endurance", val: 71, max: 100, color: "bg-ink-2", label: "71%" },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="bg-surface border border-border rounded-[10px] p-6 shadow-sm">
      <div className="flex items-baseline justify-between mb-5">
        <div className="font-mono text-[10px] font-medium tracking-[0.12em] text-ink-3 uppercase">Skill Breakdown</div>
        <button className="font-mono text-[10px] text-accent hover:underline">Details →</button>
      </div>

      <div className="flex flex-col gap-3">
        {skills.map((skill) => {
          const percentage = (skill.val / skill.max) * 100;
          return (
            <div key={skill.name} className="flex flex-col gap-[5px]">
              <div className="flex justify-between items-baseline">
                <div className="text-[12px] font-medium text-ink-2">{skill.name}</div>
                <div className="font-mono text-[11px] text-ink-3">{skill.label}</div>
              </div>
              <div className="h-[5px] bg-surface-2 rounded-[3px] border border-border overflow-hidden">
                <div
                  className={`h-full rounded-[3px] transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] ${skill.color}`}
                  style={{ width: mounted ? `${percentage}%` : "0%" }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
