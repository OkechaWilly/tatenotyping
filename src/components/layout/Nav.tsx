"use client";

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

  useEffect(() => {
    const savedTheme = localStorage.getItem("tateno-theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("tateno-theme", next);
  };

  return (
    <nav className="flex items-center justify-between px-8 h-14 bg-surface border-b border-border sticky top-0 z-50">
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
          // Naive check for active
          const isActive = 
            pathname === link.href || 
            (pathname === "/" && link.name === "Practice" && link.href === "/type") ||
            (link.href.includes("?") && pathname === link.href.split("?")[0]); // TODO: handle query params cleanly later

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

      <div className="flex items-center gap-4">
        <button 
          onClick={toggleTheme}
          className="text-[14px] hover:scale-110 transition-transform text-ink-2"
          title="Toggle Theme"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
        <div className="flex items-center gap-[5px] bg-gold-light border border-[#B8860B33] px-2.5 py-1 rounded-full text-xs font-medium text-gold">
          🔥 <span>7</span> day streak
        </div>
        <div className="w-[30px] h-[30px] rounded-full bg-ink text-white flex items-center justify-center text-[11px] font-semibold font-mono cursor-pointer">
          JD
        </div>
      </div>
    </nav>
  );
}
