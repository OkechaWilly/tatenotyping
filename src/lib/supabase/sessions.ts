import { createClient } from "@/lib/supabase/client";
import { type TypingStats } from "@/hooks/useTypingEngine";

export async function saveSession(params: {
  userId: string;
  stats: TypingStats;
  mode: string;
  duration: number;
  textUsed: string;
}) {
  const supabase = createClient();
  const { userId, stats, mode, duration, textUsed } = params;

  // 1. Save the session
  const { error: sessionError } = await supabase.from("sessions").insert({
    user_id: userId,
    wpm: stats.wpm,
    raw_wpm: stats.rawWpm,
    accuracy: stats.accuracy,
    errors: stats.errors,
    mode,
    duration,
    text_used: textUsed.substring(0, 1000), // Limit text length
  });

  if (sessionError) {
    console.error("Error saving session:", sessionError);
    return { error: sessionError };
  }

  // 2. Update profile stats (XP, level, streak)
  // Simple XP formula: WPM * Accuracy% * (Duration/15) + 10 base
  const xpGained = Math.round((stats.wpm * (stats.accuracy / 100)) * (duration / 15) + 10);

  // Get current profile for streak logic
  const { data: profile } = await supabase
    .from("profiles")
    .select("xp, level, streak_current, streak_best")
    .eq("id", userId)
    .single();

  if (profile) {
    const newXp = profile.xp + xpGained;
    const newLevel = Math.floor(newXp / 4000) + 1; // 4000 XP per level
    
    // Simple streak logic: if last session was today, keep streak; if yesterday, increment.
    // For now, let's just increment if it's a new day (simplified).
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        xp: newXp,
        level: newLevel,
        // Streak logic would ideally check the last session timestamp
      })
      .eq("id", userId);

    if (profileError) {
      console.error("Error updating profile:", profileError);
    }
  }

  // 3. Update weak keys
  // This would require tracking WHICH keys were errors, which the engine doesn't do yet.
  // We'll skip this for now or update the engine later to track specific key errors.

  return { success: true, xpGained };
}
