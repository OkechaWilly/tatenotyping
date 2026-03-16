"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";

export default function SessionsTable() {
  interface Session {
    wpm: number;
    raw_wpm: number;
    accuracy: number;
    mode: string;
    duration: number;
    created_at: string;
  }
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchSessions = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("sessions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true }); // We'll reverse for display

      if (data) {
        setSessions([...data].reverse().slice(0, 10)); // Last 10
      }
      setLoading(false);
    };

    fetchSessions();
  }, [user]);

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(mins / 60);
    const days = Math.floor(hrs / 24);

    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    if (hrs < 24) return `${hrs}h ago`;
    if (days === 1) return "Yesterday";
    return `${days}d ago`;
  };

  return (
    <div className="bg-surface border border-border rounded-[10px] py-[22px] shadow-sm flex flex-col h-full">
      <div className="flex items-baseline justify-between px-6 mb-4">
        <div className="font-mono text-[10px] font-medium tracking-[0.12em] text-ink-3 uppercase">Recent Sessions</div>
        <button className="font-mono text-[10px] text-accent hover:underline">All sessions →</button>
      </div>

      <div className="overflow-x-auto no-scrollbar px-6 flex-1">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="font-mono text-[9px] font-medium tracking-[0.1em] uppercase text-ink-3 text-left pb-2.5 px-3 border-b border-border">WPM</th>
              <th className="hidden sm:table-cell font-mono text-[9px] font-medium tracking-[0.1em] uppercase text-ink-3 text-left pb-2.5 px-3 border-b border-border">Raw</th>
              <th className="font-mono text-[9px] font-medium tracking-[0.1em] uppercase text-ink-3 text-left pb-2.5 px-3 border-b border-border">Accuracy</th>
              <th className="hidden md:table-cell font-mono text-[9px] font-medium tracking-[0.1em] uppercase text-ink-3 text-left pb-2.5 px-3 border-b border-border">Mode</th>
              <th className="hidden sm:table-cell font-mono text-[9px] font-medium tracking-[0.1em] uppercase text-ink-3 text-left pb-2.5 px-3 border-b border-border">Duration</th>
              <th className="font-mono text-[9px] font-medium tracking-[0.1em] uppercase text-ink-3 text-left pb-2.5 px-3 border-b border-border text-right sm:text-left">Time</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="py-8 text-center font-mono text-[10px] text-ink-3">Loading sessions...</td></tr>
            ) : sessions.length === 0 ? (
              <tr><td colSpan={6} className="py-8 text-center font-mono text-[10px] text-ink-3">No sessions found</td></tr>
            ) : (
              sessions.map((s, i) => (
                <tr key={i} className="hover:bg-surface-2 transition-colors">
                  <td className="py-2.5 px-3 border-b border-border font-mono text-[14px] sm:text-[15px] font-medium text-ink">
                    {s.wpm}
                  </td>
                  <td className="hidden sm:table-cell py-2.5 px-3 border-b border-border font-mono text-[12px] text-ink-2">{s.raw_wpm}</td>
                  <td className="py-2.5 px-3 border-b border-border font-mono text-[12px] text-ink-2">
                    <div className="flex items-center gap-2">
                      <div className="hidden xs:flex flex-1 h-1 bg-surface-2 rounded-full overflow-hidden border border-border min-w-[50px] sm:min-w-[60px]">
                        <div className="h-full bg-green" style={{ width: `${s.accuracy}%` }} />
                      </div>
                      <span className="font-bold sm:font-normal">{s.accuracy}%</span>
                    </div>
                  </td>
                  <td className="hidden md:table-cell py-2.5 px-3 border-b border-border">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full font-mono text-[10px] border border-border bg-surface-2 text-ink-3 whitespace-nowrap">
                      {s.mode.charAt(0).toUpperCase() + s.mode.slice(1)}
                    </span>
                  </td>
                  <td className="hidden sm:table-cell py-2.5 px-3 border-b border-border font-mono text-[12px] text-ink-2">{s.duration}s</td>
                  <td className="py-2.5 px-3 border-b border-border font-mono text-[11px] sm:text-[12px] text-ink-3 sm:text-ink-2 whitespace-nowrap text-right sm:text-left">{formatTime(s.created_at)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
