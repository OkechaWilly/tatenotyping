import { useEffect } from "react";
import { useTypingEngine } from "@/hooks/useTypingEngine";

interface TypingEngineProps {
  engine: ReturnType<typeof useTypingEngine>;
  mode: string;
}

import { RefreshCw, Plus, Palette, Terminal } from "lucide-react";

export default function TypingEngine({ engine, mode }: TypingEngineProps) {
  const { text, typed, isActive, isFinished, stats, inputRef, handleInput, startTest, resetTest, focusInput, difficulty } = engine;
    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Tab") {
                e.preventDefault();
                resetTest(text);
            }
            if (e.key === "Enter" && isFinished) {
                resetTest();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isFinished, resetTest, text]);

    const toggleTheme = () => {
        const current = document.documentElement.getAttribute("data-theme") || "light";
        const next = current === "light" ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem("tateno-theme", next);
        window.dispatchEvent(new Event("storage"));
    };

  return (
    <div className="flex flex-col h-full bg-bg relative">
      {/* ProgressBar */}
      <div className="h-1 bg-surface-3 shrink-0">
        <div 
          className="h-full bg-accent transition-all duration-300 rounded-r-full shadow-[0_0_10px_var(--accent)]" 
          style={{ width: `${Math.min(100, (typed.length / text.length) * 100)}%` }} 
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12 relative overflow-hidden" onClick={focusInput}>
        {/* Meta */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-6 sm:mb-8 self-center max-w-[840px] w-full mx-auto justify-between">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2 font-mono text-[10px] sm:text-[11px] tracking-wider text-ink-3 uppercase bg-surface-2 px-2.5 py-1 rounded-full border border-border">
              <Terminal size={12} />
              en-US
            </div>
            <div className="font-mono text-[10px] sm:text-[11px] px-2.5 py-1 rounded-full border border-border text-ink-2 bg-surface capitalize font-bold">{difficulty}</div>
            <div className="font-mono text-[10px] sm:text-[11px] px-2.5 py-1 rounded-full border border-border text-ink-2 bg-surface uppercase font-bold tracking-tighter">{mode}</div>
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px] sm:text-[11px] text-accent font-bold animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            LIVE PERFORMANCE
          </div>
        </div>

        {/* Display */}
        <div className={`relative max-w-[840px] w-full bg-surface border-2 border-border rounded-2xl px-6 sm:px-12 py-8 sm:py-12 shadow-2xl mx-auto transition-all duration-500 scale-[1.01] ${isActive ? 'border-accent/40 shadow-accent/5' : ''}`}>
          <div className="font-mono text-[18px] sm:text-[24px] leading-[1.6] sm:leading-[1.8] tracking-[0.02em] text-ink-4 break-words select-none text-left">
            {text.split('').map((char, i) => {
              let charClass = "relative transition-all duration-75 ";
              if (i < typed.length) {
                charClass += typed[i] === char ? "text-ink " : "text-error bg-error/5 ring-1 ring-error/20 rounded-[2px] ";
              }
              if (i === typed.length && isActive) {
                charClass += "text-ink after:content-[''] after:absolute after:left-0 after:top-[4px] after:bottom-[4px] after:w-[3px] after:bg-accent after:rounded-full after:animate-blink shadow-[0_0_15px_var(--accent)]";
              }
              
              return (
                <span key={i} className={charClass}>
                  {char === ' ' ? '\u00A0' : char}
                </span>
              );
            })}
          </div>

          <input
            ref={inputRef}
            type="text"
            className="absolute opacity-0 w-px h-px pointer-events-none"
            autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false"
            value={typed}
            onChange={(e) => handleInput(e.target.value)}
          />

          {/* Start Overlay */}
          {!isActive && !isFinished && (
            <div 
              className="absolute inset-0 flex items-center justify-center rounded-2xl cursor-text transition-all duration-300 group bg-surface/20 backdrop-blur-[2px]"
              onClick={startTest}
            >
              <div className="flex items-center gap-3 bg-accent text-white px-8 py-4 rounded-full text-sm font-bold shadow-2xl transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-1">
                Press any key to begin 
                <kbd className="bg-white/20 border border-white/30 rounded-lg px-2 py-1 font-mono text-xs text-white">↵</kbd>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 px-4 sm:px-8 py-4 sm:py-6 border-t border-border bg-surface shrink-0">
        <button 
          onClick={() => resetTest(text)} 
          className="group flex items-center gap-2 px-4 sm:px-6 py-2 rounded-full border border-border bg-surface-2 font-body text-[12px] sm:text-[13px] font-bold text-ink-2 cursor-pointer transition-all duration-200 hover:border-ink hover:bg-surface hover:text-ink">
          <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
          Restart <kbd className="hidden sm:inline opacity-50 font-mono text-[10px] ml-1">Tab</kbd>
        </button>
        <button 
          onClick={() => resetTest()} 
          className="group flex items-center gap-2 px-6 sm:px-8 py-2 rounded-full border border-accent bg-accent font-body text-[12px] sm:text-[13px] font-bold text-white cursor-pointer transition-all duration-200 hover:brightness-110 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 shadow-md shadow-accent/20">
          <Plus size={16} />
          New Test <kbd className="hidden sm:inline opacity-30 font-mono text-[10px] ml-1">↵</kbd>
        </button>
        <button 
            onClick={toggleTheme}
            className="flex items-center gap-2 px-4 sm:px-6 py-2 rounded-full border border-border bg-surface-2 font-body text-[12px] sm:text-[13px] font-bold text-ink-2 cursor-pointer transition-all duration-200 hover:border-ink hover:bg-surface hover:text-ink">
          <Palette size={16} />
          Theme
        </button>
      </div>

      {/* Results Overlay */}
      {isFinished && (
        <div className="absolute inset-0 z-50 bg-bg/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-xl px-6 sm:px-12 py-8 sm:py-10 max-w-[540px] w-full shadow-md animate-slideUp">
            <div className="flex items-baseline justify-between mb-6 sm:mb-8 border-b border-border pb-5 gap-4">
              <h2 className="font-body text-[18px] sm:text-[22px] font-medium">Session Complete</h2>
              <div className="font-mono text-[11px] px-3 py-1 rounded-full bg-accent-light text-accent border border-accent/20">
                Performance Verified
              </div>
            </div>

            <div className="grid grid-cols-3 gap-px bg-border rounded-lg overflow-hidden mb-6 sm:mb-8">
              <div className="bg-surface p-2 sm:p-4 flex flex-col items-center gap-1">
                <div className="font-mono text-[24px] sm:text-[32px] font-normal text-ink tracking-[-0.02em]">{stats.wpm}</div>
                <div className="font-mono text-[8px] sm:text-[9px] tracking-[0.1em] uppercase text-ink-3">WPM</div>
              </div>
              <div className="bg-surface p-2 sm:p-4 flex flex-col items-center gap-1">
                <div className="font-mono text-[24px] sm:text-[32px] font-normal text-ink tracking-[-0.02em]">{stats.accuracy}%</div>
                <div className="font-mono text-[8px] sm:text-[9px] tracking-[0.1em] uppercase text-ink-3">Accuracy</div>
              </div>
              <div className="bg-surface p-2 sm:p-4 flex flex-col items-center gap-1">
                <div className="font-mono text-[24px] sm:text-[32px] font-normal text-ink tracking-[-0.02em]">{stats.errors}</div>
                <div className="font-mono text-[8px] sm:text-[9px] tracking-[0.1em] uppercase text-ink-3">Errors</div>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => resetTest()} className="flex-1 bg-accent text-white font-bold text-[13px] py-2.5 rounded border border-accent hover:brightness-110 transition-colors shadow-sm">
                New Test
              </button>
              <button onClick={() => resetTest(text)} className="flex-1 bg-surface-2 text-ink-2 font-medium text-[13px] py-2.5 rounded border border-border hover:bg-surface hover:text-ink transition-colors">
                Retry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
