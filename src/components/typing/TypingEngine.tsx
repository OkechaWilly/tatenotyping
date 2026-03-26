import { useEffect } from "react";
import { useTypingEngine } from "@/hooks/useTypingEngine";

interface TypingEngineProps {
  engine: ReturnType<typeof useTypingEngine>;
  mode: string;
  onNewTest: () => void;
  onPrescriptionDrill?: (weakKeys: string[]) => void;
  rwCategory?: string;
  onRwCategoryChange?: (cat: string) => void;
}

import { RefreshCw, Plus, Palette, Terminal, Activity, Zap } from "lucide-react";

export default function TypingEngine({ 
  engine, 
  mode, 
  onNewTest, 
  onPrescriptionDrill,
  rwCategory,
  onRwCategoryChange 
}: TypingEngineProps) {
  const { text, typed, isActive, isFinished, stats, weakKeys, errorMap, notifications, inputRef, handleInput, startTest, resetTest, focusInput, difficulty } = engine;
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
    <div
      className="flex flex-col items-center justify-center h-full px-6 py-12 cursor-text transition-colors duration-200"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Toast Notifications */}
      <div className="fixed top-24 right-8 z-[100] flex flex-col gap-3 pointer-events-none">
        {notifications.map(n => (
          <div key={n.id} className="bg-surface/80 backdrop-blur-md border border-accent/20 px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 animate-slideIn select-none max-w-sm">
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0 ring-1 ring-accent/20">
              <Zap size={16} />
            </div>
            <p className="text-xs font-bold text-ink leading-tight tracking-wide">{n.message}</p>
          </div>
        ))}
      </div>

      {mode === "realworld" && (
        <div className="flex gap-1.5 mb-10 bg-surface-2/50 backdrop-blur-sm p-1.5 rounded-2xl border border-border/50 shadow-lg">
          {[
            { id: "email", label: "Email" },
            { id: "documentation", label: "Documentation" },
            { id: "businessLetter", label: "Business Letter" },
            { id: "personalLetter", label: "Personal Letter" }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={(e) => {
                e.stopPropagation();
                onRwCategoryChange?.(cat.id);
              }}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
                rwCategory === cat.id
                  ? "bg-accent text-white shadow-xl shadow-accent/30 scale-105"
                  : "text-ink-3 hover:text-ink-2 hover:bg-surface-3"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}
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
          onClick={onNewTest} 
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

            <div className="grid grid-cols-4 gap-px bg-border rounded-lg overflow-hidden mb-6 sm:mb-8">
              <div className="bg-surface p-2 sm:p-4 flex flex-col items-center gap-1">
                <div className="font-mono text-[24px] sm:text-[32px] font-normal text-ink tracking-[-0.02em]">{stats.wpm}</div>
                <div className="font-mono text-[8px] sm:text-[9px] tracking-[0.1em] uppercase text-ink-3">AVG WPM</div>
              </div>
              <div className="bg-surface p-2 sm:p-4 flex flex-col items-center gap-1">
                <div className="font-mono text-[24px] sm:text-[32px] font-normal text-accent tracking-[-0.02em]">{stats.bestWpm}</div>
                <div className="font-mono text-[8px] sm:text-[9px] tracking-[0.1em] uppercase text-accent/70">BEST WPM</div>
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

            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <button onClick={onNewTest} className="flex-1 bg-accent text-white font-bold text-[13px] py-2.5 rounded border border-accent hover:brightness-110 transition-colors shadow-sm">
                  New Test
                </button>
                <button onClick={() => resetTest(text)} className="flex-1 bg-surface-2 text-ink-2 font-medium text-[13px] py-2.5 rounded border border-border hover:bg-surface hover:text-ink transition-colors">
                  Retry
                </button>
              </div>
              {weakKeys.length > 0 && onPrescriptionDrill && (
                <div className="mt-4 p-4 rounded-xl bg-surface-2 border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-ink-3">Detailed Error Analysis</span>
                      <span className="text-[11px] text-ink-4">Keys requiring focus based on this session</span>
                    </div>
                    <div className="flex gap-1.5">
                      {Object.entries(errorMap).sort((a,b) => b[1] - a[1]).slice(0, 5).map(([char, count]) => (
                        <div key={char} className="flex flex-col items-center">
                          <span className="w-6 h-6 rounded bg-error/10 border border-error/20 flex items-center justify-center text-[10px] font-mono font-bold text-error uppercase">
                            {char === ' ' ? '␣' : char}
                          </span>
                          <span className="text-[8px] mt-0.5 text-error/60 font-bold">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mini Keyboard Visualization */}
                  <div className="flex flex-col gap-1 mb-6 opacity-80">
                    {[
                      ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
                      ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";"],
                      ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/"]
                    ].map((row, rIdx) => (
                      <div key={rIdx} className="flex justify-center gap-1">
                        {row.map(key => {
                          const errorCount = errorMap[key] || 0;
                          const hasError = errorCount > 0;
                          return (
                            <div 
                              key={key} 
                              className={`w-4 h-4 rounded-[2px] border flex items-center justify-center text-[7px] font-mono transition-colors ${
                                hasError 
                                  ? "bg-error border-error-strong text-white" 
                                  : "bg-surface-3 border-border text-ink-4"
                              }`}
                            >
                              {key.toUpperCase()}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => onPrescriptionDrill(weakKeys)}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-[13px] py-3 rounded shadow-lg hover:brightness-110 transition-all group"
                  >
                    <Activity size={16} className="group-hover:animate-pulse" />
                    Train These Keys
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
