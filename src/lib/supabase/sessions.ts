import { createClient } from "@/lib/supabase/client";
import { type TypingStats } from "@/hooks/useTypingEngine";

export async function saveSession(params: {
  userId: string;
  stats: TypingStats;
  mode: string;
  duration: number;
  textUsed: string;
  keyStats?: Record<string, { attempts: number; errors: number }>;
}) {
  const supabase = createClient();
  const { userId, stats, mode, duration, textUsed, keyStats } = params;

  // 1. Save the session
  const { error: sessionError } = await supabase.from("sessions").insert({
    user_id: userId,
    wpm: stats.wpm,
    raw_wpm: stats.rawWpm,
    accuracy: stats.accuracy,
    errors: stats.errors,
    best_wpm: stats.bestWpm,
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
  const xpGained = Math.round((stats.wpm * (stats.accuracy / 100)) * (duration > 0 ? duration / 15 : 1) + 10);

  // Get current profile for streak logic
  const { data: profile } = await supabase
    .from("profiles")
    .select("xp, level")
    .eq("id", userId)
    .single();

  if (profile) {
    const newXp = profile.xp + xpGained;
    const newLevel = Math.floor(newXp / 4000) + 1; // 4000 XP per level
    
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        xp: newXp,
        level: newLevel,
      })
      .eq("id", userId);

    if (profileError) {
      console.error("Error updating profile:", profileError);
    }
  }

  // 3. Update weak keys
  if (keyStats) {
    for (const [key, data] of Object.entries(keyStats)) {
      if (data.attempts === 0) continue;

      // Increment errors and attempts in weak_keys table
      const { data: existing } = await supabase
        .from("weak_keys")
        .select("error_count, total_attempts")
        .eq("user_id", userId)
        .eq("key_char", key)
        .single();

      if (existing) {
        await supabase
          .from("weak_keys")
          .update({
            error_count: existing.error_count + data.errors,
            total_attempts: existing.total_attempts + data.attempts,
            updated_at: new Date().toISOString()
          })
          .eq("user_id", userId)
          .eq("key_char", key);
      } else {
        await supabase
          .from("weak_keys")
          .insert({
            user_id: userId,
            key_char: key,
            error_count: data.errors,
            total_attempts: data.attempts
          });
      }
    }
  }

  return { success: true, xpGained };
}
