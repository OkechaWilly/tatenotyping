"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Nav() {
  const pathname = usePathname();

  const links = [
    { name: "Practice", href: "/type" },
    { name: "Lessons", href: "/lessons" },
    { name: "Real-World", href: "/type?mode=realworld" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Compete", href: "/compete" },
  ];

  const [theme, setTheme] = useState("light");
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("tateno-theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("tateno-theme", next);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    if (authMode === "signin") {
      await supabase.auth.signInWithPassword({ email, password });
    } else {
      await supabase.auth.signUp({ email, password });
    }
    setShowAuth(false);
  };

  const handleGoogleAuth = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({ provider: "google" });
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
  }

  return (
    <nav className="flex items-center justify-between px-8 h-14 bg-surface border-b border-border sticky top-0 z-40 relative">
      <div className="flex items-baseline gap-2">
        <div className="font-display text-xl font-medium text-ink tracking-[-0.3px]">
          Taten<span className="text-accent">o</span>
        </div>
        <div className="font-mono text-[10px] text-ink-3 tracking-[0.08em] uppercase border-l border-border pl-2">
          Performance Edition
        </div>
      </div>
      
      <div className="flex gap-[2px]">
        {links.map((link) => {
          const isActive = 
            pathname === link.href || 
            (pathname === "/" && link.name === "Practice" && link.href === "/type") ||
            (link.href.includes("?") && pathname === link.href.split("?")[0]); 

          return (
            <Link
              key={link.name}
              href={link.href}
              className={`px-3.5 py-1.5 rounded font-body text-[13px] transition-all duration-150 ${
                isActive
                  ? "bg-ink text-white font-medium"
                  : "bg-transparent text-ink-2 font-normal hover:bg-surface-2 hover:text-ink"
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-4 relative">
        <button 
          onClick={toggleTheme}
          className="text-[14px] hover:scale-110 transition-transform text-ink-2"
          title="Toggle Theme"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
        {user ? (
          <>
            <div className="flex items-center gap-[5px] bg-gold-light border border-[#B8860B33] px-2.5 py-1 rounded-full text-xs font-medium text-gold">
              🔥 <span>7</span> day streak
            </div>
            <div 
              className="w-[30px] h-[30px] rounded-full bg-ink text-white flex items-center justify-center text-[11px] font-semibold font-mono cursor-pointer"
              onClick={handleSignOut}
              title="Sign Out"
            >
              {user.email?.substring(0,2).toUpperCase()}
            </div>
          </>
        ) : (
          <button 
            onClick={() => setShowAuth(!showAuth)}
            className="text-[13px] font-medium text-ink bg-surface-2 px-3 py-1.5 rounded hover:bg-surface-3 transition-colors"
          >
            Sign In
          </button>
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
                className="w-full px-3 py-2 bg-surface-2 border border-border rounded text-[13px] text-ink outline-none focus:border-ink"
                required
              />
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-surface-2 border border-border rounded text-[13px] text-ink outline-none focus:border-ink"
                required
              />
              <button type="submit" className="w-full bg-ink text-white font-medium text-[13px] py-2 rounded hover:bg-[#2D2A27]">
                {authMode === "signin" ? "Sign In" : "Sign Up"}
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
