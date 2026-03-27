"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { ACHIEVEMENT_DEFS } from "@/data/achievements";

export interface ToastMessage {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface ToastContextType {
  addAchievementToast: (achievementKey: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addAchievementToast = useCallback((key: string) => {
    const def = ACHIEVEMENT_DEFS.find((a) => a.key === key);
    if (!def) return;

    const newToast: ToastMessage = {
      id: Math.random().toString(36).substring(7),
      title: def.title,
      description: def.description,
      icon: def.icon,
    };

    setToasts((prev) => [...prev, newToast]);

    // Play a delightful chime using Web Audio API if sound is enabled
    try {
      if (localStorage.getItem("tateno_sound") !== "false") {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        if (ctx.state === "suspended") ctx.resume();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.3, ctx.currentTime + 0.25);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
      }
    } catch(e) {}

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 5000);
  }, []);

  return (
    <ToastContext.Provider value={{ addAchievementToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="w-80 bg-surface border border-gold/40 rounded-2xl shadow-2xl p-4 flex items-start gap-4 animate-slideInRight pointer-events-auto backdrop-blur-md"
          >
            <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-3xl shrink-0 border border-gold/20 shadow-inner">
              {toast.icon}
            </div>
            <div className="flex flex-col pt-0.5">
              <div className="font-mono text-[9px] uppercase tracking-widest text-gold font-bold mb-1">
                Achievement Unlocked
              </div>
              <h4 className="font-bold text-ink text-[14px] leading-tight mb-1">{toast.title}</h4>
              <p className="text-ink-3 text-[11px] leading-snug">{toast.description}</p>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
