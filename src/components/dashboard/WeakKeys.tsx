"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function WeakKeys() {
  const { user } = useAuth();
  interface WeakKey {
    key: string;
    err: number;
    cls: string;
  }
  const [weakKeys, setWeakKeys] = useState<WeakKey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchWeakKeys = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("weak_keys")
        .select("*")
        .eq("user_id", user.id)
        .order("error_count", { ascending: false })
        .limit(8);

      if (data) {
        const mapped = data.map(item => {
          const errRate = Math.round((item.error_count / Math.max(1, item.total_attempts)) * 100);
          let cls = "bg-surface-2 border-border-strong text-ink-3 shadow-[0_2px_0_var(--border-strong)]";

          if (errRate > 5) {
            cls = "bg-[#C4431A26] border-accent text-accent shadow-[0_2px_0_#943212]";
          } else if (errRate > 2) {
            cls = "bg-[#B8860B1F] border-gold text-gold shadow-[0_2px_0_#8A6408]";
          }

          return {
            key: item.key_char.toUpperCase(),
            err: errRate,
            cls
          };
        });
        setWeakKeys(mapped);
      }
      setLoading(false);
    };

    fetchWeakKeys();
  }, [user]);

  return (
    <div className="bg-surface border border-border rounded-[10px] p-6 shadow-sm h-full flex flex-col justify-between">
      <div>
        <div className="flex items-baseline justify-between mb-4">
          <div className="font-mono text-[10px] font-medium tracking-[0.12em] text-ink-3 uppercase">Weak Keys</div>
          <Link href="/drill" className="font-mono text-[10px] text-accent hover:underline">Train →</Link>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3 content-start">
          {loading ? (
            <div className="font-mono text-[10px] text-ink-3">Loading keys...</div>
          ) : weakKeys.length === 0 ? (
            <div className="font-mono text-[10px] text-ink-3">No weak keys detected yet</div>
          ) : (
            weakKeys.map((item) => (
              <div key={item.key} className="flex flex-col items-center gap-[3px]">
                <div
                  className={`w-[30px] sm:w-[34px] h-[30px] sm:h-[34px] rounded-[5px] border flex items-center justify-center font-mono text-[12px] sm:text-[13px] font-medium transition-transform duration-150 hover:-translate-y-[2px] cursor-default ${item.cls}`}
                >
                  {item.key}
                </div>
                <div className="font-mono text-[8px] sm:text-[9px] text-ink-3">{item.err}%</div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-4 border-t border-border pt-3 font-mono text-[10px] text-ink-3 leading-[1.6]">
        Error rate calculated across session history. Keys above 5% flagged for practice.
      </div>
    </div>
  );
}
