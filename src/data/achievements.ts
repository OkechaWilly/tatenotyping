/**
 * Achievement definitions for the Tateno Typing Platform.
 * Each achievement has a key, metadata, and an unlock condition.
 */

export interface AchievementDef {
  key: string;
  title: string;
  description: string;
  icon: string;
  category: "speed" | "accuracy" | "consistency" | "learning" | "dedication";
}

export const ACHIEVEMENT_DEFS: AchievementDef[] = [
  // ── Speed ─────────────────────────────────────────────────────
  { key: "wpm-40",       title: "Getting Started",    icon: "🚀", category: "speed",       description: "Reach 40 WPM in a session." },
  { key: "wpm-60",       title: "Comfortable Pace",   icon: "⚡", category: "speed",       description: "Reach 60 WPM in a session." },
  { key: "wpm-80",       title: "Speed Demon",        icon: "🏎️", category: "speed",       description: "Reach 80 WPM in a session." },
  { key: "wpm-100",      title: "Century Club",       icon: "💯", category: "speed",       description: "Break 100 WPM in a session." },
  { key: "wpm-120",      title: "Superhuman",         icon: "🦅", category: "speed",       description: "Break 120 WPM in a session." },
  { key: "wpm-150",      title: "Machine",            icon: "🤖", category: "speed",       description: "Reach 150 WPM — you are unstoppable." },

  // ── Accuracy ──────────────────────────────────────────────────
  { key: "acc-90",       title: "Sharp Aim",          icon: "🎯", category: "accuracy",    description: "Complete a session with 90%+ accuracy." },
  { key: "acc-95",       title: "Sniper",             icon: "🔬", category: "accuracy",    description: "Complete a session with 95%+ accuracy." },
  { key: "acc-99",       title: "Perfectionist",      icon: "💎", category: "accuracy",    description: "Complete a session with 99%+ accuracy." },
  { key: "acc-100",      title: "Zero Error Hero",    icon: "✨", category: "accuracy",    description: "Complete a session with zero errors." },

  // ── Consistency ───────────────────────────────────────────────
  { key: "sessions-5",   title: "Getting Into It",    icon: "📖", category: "consistency", description: "Complete 5 sessions." },
  { key: "sessions-25",  title: "Regular",            icon: "🗓️", category: "consistency", description: "Complete 25 sessions." },
  { key: "sessions-100", title: "Dedicated",          icon: "🏆", category: "consistency", description: "Complete 100 sessions." },
  { key: "sessions-500", title: "Legend",             icon: "👑", category: "consistency", description: "Complete 500 sessions. A true legend." },

  // ── Streak ────────────────────────────────────────────────────
  { key: "streak-3",     title: "Habit Forming",      icon: "🔥", category: "dedication",  description: "Maintain a 3-day practice streak." },
  { key: "streak-7",     title: "Week Warrior",       icon: "📅", category: "dedication",  description: "Maintain a 7-day streak." },
  { key: "streak-30",    title: "Monthly Master",     icon: "🌙", category: "dedication",  description: "Maintain a 30-day streak." },
  { key: "streak-100",   title: "Iron Discipline",    icon: "⚙️", category: "dedication",  description: "Maintain a 100-day streak." },

  // ── Learning ──────────────────────────────────────────────────
  { key: "first-lesson", title: "First Step",         icon: "👣", category: "learning",    description: "Complete your first lesson." },
  { key: "full-keyboard",title: "Full Keyboard",      icon: "⌨️", category: "learning",    description: "Complete the full keyboard lesson." },
  { key: "all-beginner", title: "Beginner Graduate",  icon: "🎓", category: "learning",    description: "Complete all Beginner lessons." },
  { key: "all-intermed", title: "Intermediate +",     icon: "📚", category: "learning",    description: "Complete all Intermediate lessons." },
  { key: "zen-master",   title: "Zen Master",         icon: "🧘", category: "learning",    description: "Complete all lessons across all tiers." },
  { key: "drill-first",  title: "Smart Driller",      icon: "🔩", category: "learning",    description: "Complete your first adaptive drill." },
];

/** Check which achievements should unlock given current session + profile stats */
export function getNewAchievements(params: {
  wpm: number;
  accuracy: number;
  errors: number;
  streakCurrent: number;
  totalSessions: number;
  existing: string[];
}): string[] {
  const { wpm, accuracy, errors, streakCurrent, totalSessions, existing } = params;
  const unlocked: string[] = [];

  const check = (key: string, condition: boolean) => {
    if (condition && !existing.includes(key)) unlocked.push(key);
  };

  // Speed
  check("wpm-40",  wpm >= 40);
  check("wpm-60",  wpm >= 60);
  check("wpm-80",  wpm >= 80);
  check("wpm-100", wpm >= 100);
  check("wpm-120", wpm >= 120);
  check("wpm-150", wpm >= 150);

  // Accuracy
  check("acc-90",  accuracy >= 90);
  check("acc-95",  accuracy >= 95);
  check("acc-99",  accuracy >= 99);
  check("acc-100", errors === 0 && accuracy === 100);

  // Sessions
  check("sessions-5",   totalSessions >= 5);
  check("sessions-25",  totalSessions >= 25);
  check("sessions-100", totalSessions >= 100);
  check("sessions-500", totalSessions >= 500);

  // Streaks
  check("streak-3",   streakCurrent >= 3);
  check("streak-7",   streakCurrent >= 7);
  check("streak-30",  streakCurrent >= 30);
  check("streak-100", streakCurrent >= 100);

  // First session
  check("sessions-5", totalSessions >= 1);

  return unlocked;
}
