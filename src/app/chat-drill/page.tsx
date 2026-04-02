"use client";

import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { MessageSquare } from "lucide-react";
import FreeChatEngine from "@/components/typing/FreeChatEngine";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

import { FreeTypingStats } from "@/hooks/useFreeTypingEngine";

export default function ChatDrillPage() {
  const { user } = useAuth();
  const { addAchievementToast } = useToast();
  const [completedStats, setCompletedStats] = useState<FreeTypingStats | null>(null);

  const handleComplete = async ({ stats, keyStats }: { stats: FreeTypingStats; keyStats: Record<string, { attempts: number; errors: number }> }) => {
    setCompletedStats(stats);
    if (!user) return;

    const { saveSession } = await import("@/lib/supabase/sessions");

    const res = await saveSession({
      userId: user.id,
      stats,
      mode: "chat-drill",
      duration: 0,
      textUsed: "Freeform Conversation session",
      keyStats
    });

    if (res.newlyUnlocked) {
      res.newlyUnlocked.forEach((key: string) => addAchievementToast(key));
    }
  };

  if (!completedStats) {
    return (
      <AppLayout>
         {/* We stretch this explicitly so FreeChatEngine fills the whole page neatly */}
         <div className="flex-1 flex flex-col h-full bg-bg">
           <FreeChatEngine onComplete={handleComplete} />
         </div>
      </AppLayout>
    );
  }

  // Completion Screen
  return (
    <AppLayout>
      <div className="flex-1 overflow-y-auto bg-bg pt-10">
        <div className="max-w-3xl mx-auto py-20 px-6 sm:px-10 flex flex-col items-center gap-8 text-center animate-fadeUp">
          <div className="w-24 h-24 rounded-full bg-green/10 text-green flex items-center justify-center mb-4 border border-green/20">
            <MessageSquare size={40} className="translate-y-1" />
          </div>
          
          <h1 className="font-display text-4xl font-bold text-ink">Session Saved</h1>
          <p className="text-ink-3 text-[15px] max-w-lg">
             Your freeform keystrokes have been securely evaluated and tracked into your profile&apos;s weak keys. Come chat anytime!
          </p>

          <div className="grid grid-cols-2 gap-4 w-full mt-8">
            <div className="flex flex-col items-center bg-surface border border-border p-8 rounded-3xl shadow-sm">
               <span className="text-[11px] font-mono text-ink-4 uppercase tracking-widest mb-2 font-bold">Session Speed</span>
               <div className="flex items-baseline gap-2">
                 <span className="text-5xl font-extrabold font-mono text-accent">{completedStats.wpm}</span>
                 <span className="text-[12px] font-mono font-bold text-ink-4 uppercase">WPM</span>
               </div>
            </div>
            <div className="flex flex-col items-center bg-surface border border-border p-8 rounded-3xl shadow-sm">
               <span className="text-[11px] font-mono text-ink-4 uppercase tracking-widest mb-2 font-bold">Accuracy</span>
               <div className="flex items-baseline gap-2">
                 <span className={`text-5xl font-extrabold font-mono ${completedStats.accuracy >= 98 ? "text-gold" : "text-green"}`}>{completedStats.accuracy}</span>
                 <span className="text-[20px] font-mono font-bold text-ink-4 uppercase">%</span>
               </div>
            </div>
          </div>

          <div className="flex gap-4 mt-8 w-full sm:w-auto">
            <button 
              onClick={() => setCompletedStats(null)}
              className="flex-1 sm:flex-none px-8 py-4 bg-accent text-white rounded-2xl font-bold text-[14px] shadow-xl shadow-accent/20 hover:scale-105 active:scale-95 transition-all"
            >
              Start New Chat
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
