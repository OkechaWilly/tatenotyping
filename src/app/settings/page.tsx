"use client";

import AppLayout from "@/components/layout/AppLayout";
import { useAuth } from "@/context/AuthContext";
import { useTypingContext } from "@/context/TypingContext";
import { 
  Settings, 
  User, 
  Bell, 
  Volume2, 
  Zap, 
  Monitor, 
  Moon, 
  Sun,
  Shield,
  LogOut,
  ChevronRight,
  Check,
  Layout
} from "lucide-react";

export default function SettingsPage() {
  const { user, profile, signOut } = useAuth();
  const { settings, updateSettings } = useTypingContext();

  const handleToggle = (key: keyof typeof settings) => {
    if (typeof settings[key] === 'boolean') {
      updateSettings({ [key]: !settings[key] });
    }
  };

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    updateSettings({ theme });
    // Note: Actual CSS theme switching should be hooked into this state change in AppLayout or a separate ThemeProvider
  };

  return (
    <AppLayout>
      <div className="flex-1 overflow-y-auto bg-bg">
        <div className="layout-container py-12 px-6 max-w-[800px] mx-auto">
          
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center text-accent shadow-sm">
              <Settings size={24} />
            </div>
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold text-ink tracking-tight">Settings</h1>
              <p className="text-ink-3 text-sm">Customize your typing experience and account</p>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            
            {/* Account Section */}
            <section className="flex flex-col gap-4">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-ink-4 px-2">Account Profile</h3>
              <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                 <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-surface-2 border-2 border-border flex items-center justify-center text-2xl font-bold text-ink-2 shadow-inner">
                      {profile?.username?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-ink">{profile?.username || "Guest User"}</span>
                      <span className="text-xs text-ink-3 tracking-wide">Level {profile?.level || 1} • {profile?.xp || 0} XP earned</span>
                    </div>
                 </div>
                 {user ? (
                   <button 
                    onClick={() => signOut()}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-error/20 text-error bg-error/5 hover:bg-error/10 font-bold text-[13px] transition-all"
                   >
                     <LogOut size={16} />
                     Sign Out
                   </button>
                 ) : (
                   <button className="px-6 py-2.5 rounded-xl bg-accent text-white font-bold text-[13px] shadow-lg shadow-accent/20">Sign In to Save Progress</button>
                 )}
              </div>
            </section>

            {/* Application Settings */}
            <section className="flex flex-col gap-4">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-ink-4 px-2">Preferences</h3>
              <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
                 
                 <SettingItem 
                    icon={<Volume2 size={18} />} 
                    title="Sound Effects" 
                    description="Auditory cues for correct keys and errors" 
                    active={settings.sound_effects} 
                    onToggle={() => handleToggle("sound_effects")} 
                 />

                 <SettingItem 
                    icon={<Zap size={18} />} 
                    title="Live Performance" 
                    description="Show WPM and accuracy real-time while typing" 
                    active={settings.live_wpm} 
                    onToggle={() => handleToggle("live_wpm")} 
                 />

                 <SettingItem 
                    icon={<Monitor size={18} />} 
                    title="Screen Shake" 
                    description="Subtle visual feedback on errors (impact)" 
                    active={settings.screen_shake} 
                    onToggle={() => handleToggle("screen_shake")} 
                    last
                 />

              </div>
            </section>

            {/* Appearance */}
            <section className="flex flex-col gap-4 pb-12">
               <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-ink-4 px-2">Interface Theme</h3>
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { id: 'light', icon: <Sun size={20} />, label: 'Light' },
                    { id: 'dark', icon: <Moon size={20} />, label: 'Dark' },
                    { id: 'system', icon: <Layout size={20} />, label: 'System' }
                  ].map((t) => (
                    <button 
                      key={t.id}
                      onClick={() => handleThemeChange(t.id as any)}
                      className={`flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all ${
                        settings.theme === t.id 
                          ? "bg-accent/5 border-accent text-accent ring-1 ring-accent/20" 
                          : "bg-surface border-border text-ink-3 hover:border-ink-4"
                      }`}
                    >
                      {t.icon}
                      <span className="text-[12px] font-bold uppercase tracking-widest">{t.label}</span>
                      {settings.theme === t.id && <Check size={14} className="mt-1" />}
                    </button>
                  ))}
               </div>
            </section>

          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function SettingItem({ icon, title, description, active, onToggle, last }: any) {
  return (
    <div className={`p-6 flex items-center justify-between transition-colors hover:bg-surface-2/50 ${!last ? 'border-b border-border' : ''}`}>
      <div className="flex items-center gap-5">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border ${
          active ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-surface-2 border-border text-ink-4'
        }`}>
          {icon}
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-ink tracking-tight">{title}</span>
          <span className="text-xs text-ink-4 leading-tight">{description}</span>
        </div>
      </div>
      <button 
        onClick={onToggle}
        className={`w-12 h-6 rounded-full relative transition-all duration-300 ${
          active ? 'bg-accent shadow-inner' : 'bg-surface-3 border border-border'
        }`}
      >
        <div className={`absolute top-1 bottom-1 w-4 rounded-full transition-all duration-300 ${
          active ? 'left-7 bg-white shadow-md' : 'left-1 bg-ink-4'
        }`} />
      </button>
    </div>
  );
}
