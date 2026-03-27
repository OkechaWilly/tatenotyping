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
    text_used: textUsed.substring(0, 1000),
  });

  if (sessionError) {
    console.error("Error saving session:", sessionError);
    return { error: sessionError };
  }

  // 2. Update profile stats (XP, level, streak)
  const xpGained = Math.round(
    (stats.wpm * (stats.accuracy / 100)) * (duration > 0 ? duration / 15 : 1) + 10
  );

  const { data: profile } = await supabase
    .from("profiles")
    .select("xp, level, streak_current, streak_best")
    .eq("id", userId)
    .single();

  if (profile) {
    const newXp = profile.xp + xpGained;
    const newLevel = Math.floor(newXp / 4000) + 1;

    // Streak logic: look at the last 2 sessions (the one just saved + prior)
    const { data: lastSessions } = await supabase
      .from("sessions")
      .select("created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(2);

    let newStreak = profile.streak_current;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (lastSessions && lastSessions.length >= 2) {
      const prevDate = new Date(lastSessions[1].created_at);
      prevDate.setHours(0, 0, 0, 0);
      const diffDays = Math.round(
        (today.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 0) {
        newStreak = profile.streak_current;
      } else if (diffDays === 1) {
        newStreak = profile.streak_current + 1;
      } else {
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }

    const newBestStreak = Math.max(profile.streak_best || 0, newStreak);

    await supabase
      .from("profiles")
      .update({
        xp: newXp,
        level: newLevel,
        streak_current: newStreak,
        streak_best: newBestStreak,
      })
      .eq("id", userId);

    // 3. Unlock achievements
    const { getNewAchievements } = await import("@/data/achievements");
    const { data: existingAchievements } = await supabase
      .from("achievements")
      .select("achievement_key")
      .eq("user_id", userId);

    const { count: sessionCount } = await supabase
      .from("sessions")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId);

    const existingKeys = (existingAchievements || []).map((a) => a.achievement_key);
    const newlyUnlocked = getNewAchievements({
      wpm: stats.wpm,
      accuracy: stats.accuracy,
      errors: stats.errors,
      streakCurrent: newStreak,
      totalSessions: sessionCount || 0,
      existing: existingKeys,
    });

    for (const key of newlyUnlocked) {
      await supabase.from("achievements").upsert(
        { user_id: userId, achievement_key: key, unlocked_at: new Date().toISOString() },
        { onConflict: "user_id,achievement_key" }
      );
    }

    return { success: true, xpGained, newlyUnlocked };
  }


  // 3. Update weak keys
  if (keyStats) {
    for (const [key, data] of Object.entries(keyStats)) {
      if (data.attempts === 0) continue;

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
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId)
          .eq("key_char", key);
      } else {
        await supabase.from("weak_keys").insert({
          user_id: userId,
          key_char: key,
          error_count: data.errors,
          total_attempts: data.attempts,
        });
      }
    }
  }

  return { success: true, xpGained };
}
