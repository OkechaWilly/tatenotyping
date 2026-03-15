"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Nav from "@/components/layout/Nav";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [demoText, setDemoText] = useState("");
  const targetText = "The ultimate typing experience is here.";
  
  useEffect(() => {
    setMounted(true);
    let i = 0;
    const interval = setInterval(() => {
      setDemoText(targetText.slice(0, i));
      i++;
      if (i > targetText.length) {
        setTimeout(() => { i = 0; }, 2000);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Nav />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,var(--accent-mid),transparent_50%)]" />
          
          <div className="max-w-screen-xl mx-auto px-6 text-center">
            <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-fadeUp text-gradient">
              Type with Purpose. <br />
              Master your Craft.
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-ink-2 mb-10 animate-fadeUp" style={{ animationDelay: "0.1s" }}>
              Tateno is a minimalist, high-performance typing interface designed for writers, 
              developers, and enthusiasts who value aesthetics and progress.
            </p>
            
            <div className="flex items-center justify-center gap-4 animate-fadeUp" style={{ animationDelay: "0.2s" }}>
              <Link 
                href="/type" 
                className="px-8 py-3.5 bg-accent text-white rounded-full font-medium shadow-lg hover:shadow-xl hover:-translate-y-px transition-all duration-200"
              >
                Start Typing
              </Link>
              <Link 
                href="/lessons" 
                className="px-8 py-3.5 bg-surface border border-border rounded-full font-medium hover:bg-surface-2 transition-all duration-200"
              >
                Curriculum
              </Link>
            </div>
            
            {/* Interactive Demo Preview */}
            <div className="mt-20 max-w-3xl mx-auto glass-card p-1 animate-fadeUp" style={{ animationDelay: "0.3s" }}>
              <div className="bg-surface rounded-lg p-8 text-left min-h-[200px] flex flex-col justify-center border border-border">
                <div className="font-mono text-2xl md:text-3xl leading-relaxed whitespace-pre-wrap">
                  <span className="text-ink">{demoText}</span>
                  <span className="w-[2px] h-[34px] bg-accent inline-block align-middle ml-1 animate-pulse" />
                </div>
                <div className="mt-8 flex gap-3 opacity-40">
                  <div className="w-12 h-1 bg-ink-4 rounded-full" />
                  <div className="w-12 h-1 bg-ink-4 rounded-full" />
                  <div className="w-12 h-1 bg-ink-4 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-surface-2/50">
          <div className="max-w-screen-xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-2xl">⚡</div>
                <h3 className="font-display text-xl font-bold">Performance Native</h3>
                <p className="text-ink-3 leading-relaxed">
                  Zero latency, sub-millisecond input handling. Every keystroke is captured with precision.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 rounded-xl bg-green/10 flex items-center justify-center text-2xl">◎</div>
                <h3 className="font-display text-xl font-bold">Deep Analytics</h3>
                <p className="text-ink-3 leading-relaxed">
                  Track your progress with heatmaps, trend lines, and weak-key analysis.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-2xl">📖</div>
                <h3 className="font-display text-xl font-bold">Real World Context</h3>
                <p className="text-ink-3 leading-relaxed">
                  Practice with real prose, code snippets, and literature. Learning that sticks.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-border mt-auto">
        <div className="max-w-screen-xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-ink flex items-center justify-center text-white font-display font-bold text-lg italic">T</div>
            <span className="font-display font-semibold tracking-tight">Tateno</span>
          </div>
          <div className="flex gap-8 text-ink-3 text-sm">
            <Link href="/type" className="hover:text-ink transition-colors">Typing Test</Link>
            <Link href="/lessons" className="hover:text-ink transition-colors">Lessons</Link>
            <Link href="/dashboard" className="hover:text-ink transition-colors">Dashboard</Link>
          </div>
          <p className="text-ink-4 text-[12px] font-mono uppercase tracking-widest">
            &copy; 2026 Tateno Systems
          </p>
        </div>
      </footer>
    </div>
  );
}
