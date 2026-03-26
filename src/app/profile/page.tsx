"use client";

export const dynamic = 'force-dynamic';

import AppLayout from "@/components/layout/AppLayout";
import { useAuth } from "@/context/AuthContext";
import { 
  Trophy, 
  Target, 
  Zap, 
  Clock, 
  Calendar, 
  Share2, 
  Download, 
  Award,
  ChevronRight,
  BarChart3,
  TrendingUp,
  Map,
  Flame
} from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import ProgressChart from "@/components/dashboard/ProgressChart";
import Link from "next/link";

export default function ProfilePage() {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState({
    totalSessions: 0,
    topWpm: 0,
    avgAccuracy: 0,
    totalKeys: 0
  });

  useEffect(() => {
    async function fetchStats() {
      if (!user) return;
      const supabase = createClient();
      const { data } = await supabase
        .from("sessions")
        .select("wpm, accuracy, characters")
        .eq("user_id", user.id);

      if (data && data.length > 0) {
        setStats({
          totalSessions: data.length,
          topWpm: Math.max(...data.map(s => s.wpm)),
          avgAccuracy: Math.round(data.reduce((acc, s) => acc + s.accuracy, 0) / data.length),
          totalKeys: data.reduce((acc, s) => acc + (s.characters || 0), 0)
        });
      }
    }
    fetchStats();
  }, [user]);

  return (
    <AppLayout>
      <div className="flex-1 overflow-y-auto bg-bg">
        <div className="layout-container py-12 px-6 max-w-[1100px] mx-auto">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-surface-2 border-4 border-surface shadow-xl flex items-center justify-center text-4xl font-bold text-ink-2">
                {profile?.username?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-ink tracking-tight">{profile?.username || "Typist"}</h1>
                  <span className="px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-[10px] font-bold text-accent uppercase tracking-widest">
                    Pro Member
                  </span>
                </div>
                <div className="text-ink-4 text-sm mt-1 flex items-center gap-4">
                   <span className="flex items-center gap-1.5"><Calendar size={14} /> Joined {profile ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recently'}</span>
                   <span className="flex items-center gap-1.5"><Map size={14} /> Level {profile?.level || 1}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-ink-2 bg-surface hover:bg-surface-2 font-bold text-xs transition-all">
                <Share2 size={16} />
                Share Profile
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white font-bold text-xs shadow-lg shadow-accent/20 hover:scale-105 transition-all">
                <Download size={16} />
                Get Certificate
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <StatCard icon={<Zap size={20} />} label="Top Speed" value={`${stats.topWpm} WPM`} subValue="Personal Best" color="text-yellow-500" />
            <StatCard icon={<Target size={20} />} label="Avg Accuracy" value={`${stats.avgAccuracy}%`} subValue="Last 10 sessions" color="text-green-500" />
            <StatCard icon={<Flame size={20} />} label="Current Streak" value={`${profile?.streak_current || 0} Days`} subValue={`Best: ${profile?.streak_best || 0}`} color="text-orange-500" />
            <StatCard icon={<Clock size={20} />} label="Total Keys" value={stats.totalKeys.toLocaleString()} subValue="Lifetime typed" color="text-blue-500" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 flex flex-col gap-8">
               <div className="bg-surface border border-border rounded-3xl p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold text-ink flex items-center gap-3">
                       <TrendingUp size={22} className="text-accent" />
                       Performance Trend
                    </h3>
                  </div>
                  <div className="h-[300px]">
                    <ProgressChart />
                  </div>
               </div>

               <div className="bg-surface border border-border rounded-3xl p-8 shadow-sm">
                  <h3 className="text-xl font-bold text-ink mb-8 flex items-center gap-3">
                     <Award size={22} className="text-gold" />
                     Achievements
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                     <Badge icon={<Zap size={20} />} label="Sonic" desc="Reach 80 WPM" unlocked />
                     <Badge icon={<Target size={20} />} label="Sniper" desc="100% Accuracy" unlocked />
                     <Badge icon={<Flame size={20} />} label="Hot Streak" desc="7 Day Streak" />
                     <Badge icon={<Trophy size={20} />} label="Champion" desc="Win first Race" />
                     <Badge icon={<Clock size={20} />} label="Marathon" desc="100 Sessions" />
                     <Badge icon={<Share2 size={20} />} label="Social" desc="Profile Shared" />
                  </div>
               </div>
            </div>

            <div className="flex flex-col gap-8">
               <div className="bg-surface border border-border rounded-3xl p-8 shadow-sm h-fit">
                  <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest mb-6 text-ink-4">Skill Breakdown</h4>
                  <div className="flex flex-col gap-6">
                     <SkillRow label="Words" progress={75} />
                     <SkillRow label="Numbers" progress={40} />
                     <SkillRow label="Punctuation" progress={30} />
                     <SkillRow label="Code" progress={15} />
                  </div>
                  <div className="mt-8 pt-8 border-t border-border">
                     <Link href="/lessons" className="flex items-center justify-between group">
                        <span className="text-sm font-bold text-ink group-hover:text-accent transition-colors">Start next lesson</span>
                        <ChevronRight size={16} className="text-ink-3 group-hover:translate-x-1 group-hover:text-accent transition-all" />
                     </Link>
                  </div>
               </div>

               <div className="bg-gradient-to-br from-accent to-accent-2 rounded-3xl p-8 text-white shadow-xl shadow-accent/20">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                    <BarChart3 size={24} />
                  </div>
                  <h4 className="text-lg font-bold mb-2">Tateno Rank</h4>
                  <p className="text-xs text-white/80 leading-relaxed mb-6">
                    You are in the top 12% of typists this month. Keep practicing to reach Master level!
                  </p>
                  <Link href="/compete" className="block w-full text-center py-3 bg-white text-accent rounded-xl text-xs font-bold hover:bg-ink-1 hover:text-white transition-all shadow-lg">
                    View Leaderboard
                  </Link>
               </div>
            </div>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}

function StatCard({ icon, label, value, subValue, color }: { 
  icon: React.ReactNode; 
  label: string; 
  value: string; 
  subValue: string; 
  color: string; 
}) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm flex flex-col gap-2 hover:border-accent/30 transition-colors">
       <div className={`${color} flex items-center gap-2 mb-1`}>
          {icon}
          <span className="text-[10px] font-mono uppercase tracking-widest font-bold opacity-80">{label}</span>
       </div>
       <div className="text-2xl font-bold text-ink">{value}</div>
       <div className="text-[11px] text-ink-4 font-medium">{subValue}</div>
    </div>
  );
}

function Badge({ icon, label, desc, unlocked }: { 
  icon: React.ReactNode; 
  label: string; 
  desc: string; 
  unlocked?: boolean; 
}) {
  return (
    <div className="flex flex-col items-center text-center gap-3">
       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all ${
         unlocked 
          ? "bg-surface-2 border-accent text-accent shadow-inner" 
          : "bg-surface-3 border-border text-ink-4 opacity-40 grayscale"
       }`}>
          {icon}
       </div>
       <div className="flex flex-col gap-0.5">
          <span className={`text-[11px] font-bold ${unlocked ? "text-ink" : "text-ink-4"}`}>{label}</span>
          <span className="text-[9px] text-ink-4 leading-tight">{desc}</span>
       </div>
    </div>
  );
}

function SkillRow({ label, progress }: { 
  label: string; 
  progress: number; 
}) {
  return (
    <div className="flex flex-col gap-2">
       <div className="flex justify-between text-[11px] font-bold">
          <span className="text-ink">{label}</span>
          <span className="text-ink-4">{progress}%</span>
       </div>
       <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
          <div 
             className="h-full bg-accent rounded-full transition-all duration-1000" 
             style={{ width: `${progress}%` }}
          />
       </div>
    </div>
  );
}
