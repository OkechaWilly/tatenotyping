"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

import { Sun, Moon, Flame, Menu, X } from "lucide-react";

export default function Nav() {
  const pathname = usePathname();

  const links = [
    { name: "Practice", href: "/type" },
    { name: "Lessons", href: "/lessons" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Profile", href: "/profile" },
    { name: "Compete", href: "/compete" },
    { name: "Settings", href: "/settings" },
  ];

  const { user, signOut, isLoading } = useAuth();
  const [theme, setTheme] = useState("light");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("tateno-theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  useEffect(() => {
    if (user) {
      setShowAuth(false);
      setEmail("");
      setPassword("");
      setAuthError(null);
    }
  }, [user]);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("tateno-theme", next);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsSubmitting(true);
    
    const supabase = (await import("@/lib/supabase/client")).createClient();
    
    try {
      if (authMode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: {
              username: email.split("@")[0], // Default username
            }
          }
        });
        if (error) throw error;
      }
    } catch (err: unknown) {
      const error = err as { message: string };
      setAuthError(error.message || "An authentication error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleAuth = async () => {
    const supabase = (await import("@/lib/supabase/client")).createClient();
    await supabase.auth.signInWithOAuth({ provider: "google" });
  };

  return (
    <nav className="flex items-center justify-between px-8 h-16 bg-surface/80 backdrop-blur-md border-b border-border sticky top-0 z-40 transition-all duration-300">
      <div className="flex items-baseline gap-2 group cursor-pointer" onClick={() => window.location.href = "/"}>
        <div className="font-body text-2xl font-bold text-ink tracking-tight group-hover:text-accent transition-colors">
          Taten<span className="text-accent">o</span>
        </div>
        <div className="font-mono text-[9px] text-ink-3 tracking-[0.15em] uppercase border-l border-border pl-2 group-hover:text-ink transition-colors">
          Performance Edition
        </div>
      </div>
      
      <div className="hidden md:flex gap-[4px] p-1 bg-surface-2 rounded-full">
        {links.map((link) => {
          const isActive = 
            pathname === link.href || 
            (pathname === "/" && link.name === "Practice" && link.href === "/type") ||
            (link.href.includes("?") && pathname === link.href.split("?")[0]); 

          return (
            <Link
              key={link.name}
              href={link.href}
              className={`px-5 py-2 rounded-full font-body text-[13px] transition-all duration-200 ${
                isActive
                  ? "bg-surface text-ink font-bold shadow-sm"
                  : "bg-transparent text-ink-3 font-medium hover:text-ink"
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-2 sm:gap-5 relative">
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full bg-surface-2 hover:bg-surface-3 transition-all duration-200 text-ink-2 hover:scale-110 active:scale-95"
          title="Toggle Theme"
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        <button 
          className="md:hidden p-2 rounded-full bg-surface-2 hover:bg-surface-3 text-ink-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {user ? (
          <div className="hidden sm:flex items-center gap-5">
            <div className="flex items-center gap-[6px] bg-gold/5 border border-gold/20 px-3 py-1.5 rounded-full text-xs font-bold text-gold">
              <Flame size={14} fill="currentColor" /> <span>7</span> day streak
            </div>
            <div 
              className="w-9 h-9 rounded-full bg-accent text-white flex items-center justify-center text-[12px] font-bold font-mono cursor-pointer transition-all hover:scale-110 shadow-lg"
              onClick={signOut}
              title="Sign Out"
            >
              {user.email?.substring(0,2).toUpperCase()}
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setShowAuth(!showAuth)}
            disabled={isLoading}
            className="hidden sm:block text-[13px] font-bold text-white bg-accent px-6 py-2 rounded-full hover:brightness-110 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 shadow-md shadow-accent/20"
          >
            {isLoading ? "..." : "Sign In"}
          </button>
        )}

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="absolute top-[50px] right-0 w-[240px] bg-surface border border-border rounded-xl shadow-xl p-4 z-50 animate-fadeUp md:hidden capitalize">
            <div className="flex flex-col gap-2">
              {links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-[14px] font-medium transition-colors ${
                    pathname === link.href ? "bg-accent-mid text-accent" : "hover:bg-surface-2 text-ink"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <hr className="my-1 border-border" />
              {!user ? (
                <button 
                  onClick={() => { setShowAuth(true); setIsMenuOpen(false); }}
                  className="w-full text-left px-4 py-3 rounded-lg text-[14px] font-bold text-accent"
                >
                  Sign In
                </button>
              ) : (
                <button 
                  onClick={() => { signOut(); setIsMenuOpen(false); }}
                  className="w-full text-left px-4 py-3 rounded-lg text-[14px] font-bold text-error"
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>
        )}

        {showAuth && !user && (
          <div className="absolute top-[40px] right-0 w-[300px] bg-surface border border-border rounded-lg shadow-md p-5 z-50">
            <h3 className="font-display text-[18px] font-medium text-ink mb-4">
              {authMode === "signin" ? "Sign In" : "Create Account"}
            </h3>
            <form onSubmit={handleAuth} className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-surface-2 border border-border rounded text-[13px] text-ink outline-none focus:border-accent transition-colors"
                required
              />
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-surface-2 border border-border rounded text-[13px] text-ink outline-none focus:border-accent transition-colors"
                required
              />
              {authError && (
                <div className="text-[11px] text-error bg-error/10 px-2 py-1.5 rounded border border-error/20">
                  {authError}
                </div>
              )}
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-accent text-white font-bold text-[13px] py-2 rounded hover:brightness-110 transition-colors disabled:opacity-50 shadow-sm"
              >
                {isSubmitting ? "Processing..." : (authMode === "signin" ? "Sign In" : "Sign Up")}
              </button>
            </form>
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-border"></div>
              <div className="text-[11px] text-ink-3">OR</div>
              <div className="flex-1 h-px bg-border"></div>
            </div>
            <button 
              onClick={handleGoogleAuth}
              className="w-full bg-surface-2 text-ink text-[13px] font-medium py-2 rounded border border-border hover:bg-surface-3 transition-colors mb-3"
            >
              Continue with Google
            </button>
            <div className="text-center text-[11px] text-ink-2">
              {authMode === "signin" ? "Don't have an account? " : "Already have an account? "}
              <button 
                className="text-accent hover:underline"
                onClick={() => setAuthMode(authMode === "signin" ? "signup" : "signin")}
              >
                {authMode === "signin" ? "Sign Up" : "Sign In"}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
