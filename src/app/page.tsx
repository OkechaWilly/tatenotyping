"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Nav from "@/components/layout/Nav";
import { Zap, BarChart3, BookOpen, ChevronRight } from "lucide-react";

export default function Home() {
  const [demoText, setDemoText] = useState("");
  const targetText = "The ultimate typing experience is here.";
  
  useEffect(() => {
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
        <section className="relative pt-40 pb-24 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,var(--accent-mid),transparent_60%)]" />
          
          <div className="max-w-screen-xl mx-auto px-6 text-center">
            <h1 className="font-body text-6xl md:text-8xl font-bold tracking-tight mb-8 animate-fadeUp text-gradient">
              Type with Purpose. <br />
              Master your Craft.
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-ink-2 mb-12 animate-fadeUp opacity-90" style={{ animationDelay: "0.1s" }}>
              Tateno is a minimalist, high-performance typing interface designed for writers, 
              developers, and enthusiasts who value aesthetics and progress.
            </p>
            
            <div className="flex items-center justify-center gap-6 animate-fadeUp" style={{ animationDelay: "0.2s" }}>
              <Link 
                href="/type" 
                className="px-10 py-4 bg-accent text-white rounded-full font-medium shadow-2xl hover:brightness-110 hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 group shadow-accent/20"
              >
                Start Typing
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/lessons" 
                className="px-10 py-4 bg-surface/40 backdrop-blur-md border border-border rounded-full font-medium hover:bg-surface/60 transition-all duration-300"
              >
                Curriculum
              </Link>
            </div>
            
            {/* Interactive Demo Preview */}
            <div className="mt-24 max-w-4xl mx-auto glass-card p-2 animate-fadeUp" style={{ animationDelay: "0.3s" }}>
              <div className="bg-surface/80 backdrop-blur-sm rounded-xl p-10 text-left min-h-[240px] flex flex-col justify-center border border-white/10">
                <div className="font-mono text-3xl md:text-4xl leading-relaxed whitespace-pre-wrap tracking-tight">
                  <span className="text-ink">{demoText}</span>
                  <span className="w-[3px] h-[40px] bg-accent inline-block align-middle ml-1 animate-blink" />
                </div>
                <div className="mt-12 flex gap-4 opacity-20">
                  <div className="w-16 h-1.5 bg-ink rounded-full" />
                  <div className="w-16 h-1.5 bg-ink rounded-full" />
                  <div className="w-16 h-1.5 bg-ink rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-32 border-t border-border bg-bg/50">
          <div className="max-w-screen-xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-16">
              <div className="flex flex-col gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-accent/5 flex items-center justify-center text-accent group-hover:bg-accent/10 transition-colors duration-300">
                  <Zap size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3">Performance Native</h3>
                  <p className="text-ink-3 leading-relaxed text-lg">
                    Zero latency, sub-millisecond input handling. Every keystroke is captured with precision.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-blue/5 flex items-center justify-center text-blue group-hover:bg-blue/10 transition-colors duration-300">
                  <BarChart3 size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3">Deep Analytics</h3>
                  <p className="text-ink-3 leading-relaxed text-lg">
                    Track your progress with heatmaps, trend lines, and weak-key analysis.
                  </p>
                </div>
              </div>
              <Link 
                href="/type?mode=realworld"
                className="flex flex-col gap-6 group hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-green/5 flex items-center justify-center text-green group-hover:bg-green/10 transition-colors duration-300">
                  <BookOpen size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3 flex items-center gap-2 group-hover:text-accent transition-colors">
                    Real World Context
                    <ChevronRight size={20} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  </h3>
                  <p className="text-ink-3 leading-relaxed text-lg">
                    Practice with real prose, code snippets, and literature. Learning that sticks.
                  </p>
                </div>
              </Link>
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
