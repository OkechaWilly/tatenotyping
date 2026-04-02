"use client";

import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { useSettings } from "@/context/SettingsContext";
import { Volume2, VolumeX, Moon, Sun, Monitor, Settings2, Bell, Keyboard as KeyboardIcon } from "lucide-react";

export default function SettingsPage() {
  const { soundEnabled, setSoundEnabled, playKeystrokeSound } = useSettings();
  const [theme, setTheme] = useState<string>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("tateno-theme") || "light";
    setTheme(savedTheme);
  }, []);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("tateno-theme", newTheme);
  };

  const handleSoundToggle = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    if (nextState) {
      // Small delay to ensure state update before playing demo
      setTimeout(() => playKeystrokeSound(), 50);
    }
  };

  if (!mounted) return null;

  return (
    <AppLayout>
      <div className="flex-1 overflow-y-auto bg-bg">
        <div className="max-w-4xl mx-auto py-12 px-6">
          <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="flex flex-col gap-3">
              <div className="inline-flex items-center gap-2 text-accent font-mono text-[10px] uppercase tracking-[0.2em] font-bold">
                <Settings2 size={14} />
                Preferences
              </div>
              <h1 className="font-display text-4xl font-bold text-ink">Settings</h1>
              <p className="text-ink-3 text-[14px] max-w-[500px] leading-relaxed">
                Customize your typing experience, adjust sound feedback, and choose your preferred visual theme.
              </p>
            </div>

            <div className="grid gap-6">

              {/* Sound Preferences */}
              <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm flex flex-col gap-6">
                <div className="flex items-center gap-3 border-b border-border/50 pb-4">
                  <Bell size={20} className="text-accent" />
                  <h3 className="text-lg font-bold text-ink">Audio & Feedback</h3>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-surface-2 border border-border hover:border-ink-4 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                      {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                    </div>
                    <div>
                      <h4 className="font-bold text-ink text-[14px]">Mechanical Keyboard Sounds</h4>
                      <p className="text-[12px] text-ink-3">Play a satisfying &quot;thock&quot; sound on every keystroke</p>
                    </div>
                  </div>
                  <button
                    onClick={handleSoundToggle}
                    className={`relative w-14 h-8 rounded-full transition-colors duration-300 focus:outline-none ${
                       soundEnabled ? "bg-accent" : "bg-ink-4/30"
                    }`}
                  >
                    <div className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 ${
                       soundEnabled ? "translate-x-6" : "translate-x-0"
                    }`} />
                  </button>
                </div>
              </div>


              {/* Appearance */}
              <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm flex flex-col gap-6">
                <div className="flex items-center gap-3 border-b border-border/50 pb-4">
                  <Monitor size={20} className="text-accent" />
                  <h3 className="text-lg font-bold text-ink">Appearance & Theme</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Light Theme */}
                  <button
                    onClick={() => handleThemeChange("light")}
                    className={`p-5 rounded-xl border-2 transition-all flex flex-col gap-4 text-left ${
                      theme === "light" 
                        ? "border-accent bg-accent/5 ring-4 ring-accent/10" 
                        : "border-border bg-surface-2 hover:border-ink-4"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-800 shadow-sm">
                        <Sun size={18} />
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 ${theme === "light" ? "border-accent border-4" : "border-ink-4"}`} />
                    </div>
                    <div>
                      <h4 className="font-bold text-ink text-[15px] mb-1">Light Mode</h4>
                      <p className="text-[12px] text-ink-3">Clean and bright for daytime sessions</p>
                    </div>
                  </button>

                  {/* Dark Theme */}
                  <button
                    onClick={() => handleThemeChange("dark")}
                    className={`p-5 rounded-xl border-2 transition-all flex flex-col gap-4 text-left ${
                      theme === "dark" 
                        ? "border-accent bg-accent/5 ring-4 ring-accent/10" 
                        : "border-border bg-surface-2 hover:border-ink-4"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-full bg-[#111] border border-gray-800 flex items-center justify-center text-gray-300 shadow-sm">
                        <Moon size={18} />
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 ${theme === "dark" ? "border-accent border-4" : "border-ink-4"}`} />
                    </div>
                    <div>
                      <h4 className="font-bold text-ink text-[15px] mb-1">Dark Mode</h4>
                      <p className="text-[12px] text-ink-3">Easy on the eyes, perfect for night focus</p>
                    </div>
                  </button>
                </div>
              </div>


              {/* Keyboard Customization (Placeholder for future) */}
              <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm flex flex-col gap-6 opacity-60 pointer-events-none">
                <div className="flex items-center gap-3 border-b border-border/50 pb-4">
                  <KeyboardIcon size={20} className="text-ink-3" />
                  <h3 className="text-lg font-bold text-ink">Keyboard Overlay (Coming Soon)</h3>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-surface-2 border border-border">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-ink-4/10 text-ink-3 flex items-center justify-center">
                      <KeyboardIcon size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-ink text-[14px]">Finger Guidance</h4>
                      <p className="text-[12px] text-ink-3">Show structural overlay indicating which finger to use</p>
                    </div>
                  </div>
                  <button className="relative w-14 h-8 rounded-full bg-ink-4/30">
                    <div className="absolute top-1 left-1 w-6 h-6 rounded-full bg-white opacity-50 transition-transform duration-300" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
