import { useEffect } from "react";
import { useTypingEngine } from "@/hooks/useTypingEngine";

interface TypingEngineProps {
  engine: ReturnType<typeof useTypingEngine>;
  mode: string;
}

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
        // Dispatch event for other components (like Nav) to sync if needed
        window.dispatchEvent(new Event("storage"));
    };

  return (
    <div className="flex flex-col h-full bg-bg relative">
      {/* ProgressBar */}
      <div className="h-[2px] bg-border shrink-0">
        <div 
          className="h-full bg-accent transition-all duration-100 rounded-r-[1px]" 
          style={{ width: `${Math.min(100, (typed.length / text.length) * 100)}%` }} 
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-12 py-8 relative overflow-hidden" onClick={focusInput}>
        {/* Meta */}
        <div className="flex items-center gap-3 mb-6 self-start max-w-[760px] w-full mx-auto">
          <div className="font-mono text-[10px] tracking-[0.08em] uppercase text-ink-3">en-US · Performance</div>
          <div className="font-mono text-[10px] px-2 py-0.5 rounded-[2px] border border-border text-ink-3 shrink-0 capitalize">{difficulty}</div>
          <div className="font-mono text-[10px] px-2 py-0.5 rounded-[2px] border border-border text-ink-3 shrink-0 uppercase">{mode}</div>
        </div>

        {/* Display */}
        <div className={`relative max-w-[760px] w-full bg-surface border border-border rounded-lg px-9 py-8 shadow-sm mx-auto transition-all ${isActive ? 'ring-1 ring-accent/20 border-accent/30' : ''}`}>
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-accent rounded-l-lg opacity-0 transition-opacity duration-300 before-marker" style={{ opacity: isActive ? 1 : 0 }} />
          
          <div className="font-mono text-[20px] leading-[1.7] tracking-[0.01em] text-pending break-words select-none text-left">
            {text.split('').map((char, i) => {
              let charClass = "relative transition-colors duration-75 ";
              if (i < typed.length) {
                charClass += typed[i] === char ? "text-ink " : "text-error bg-error/10 rounded-[1px] ";
              }
              if (i === typed.length && isActive) {
                charClass += "text-ink after:content-[''] after:absolute after:left-0 after:top-[2px] after:bottom-[2px] after:w-[2px] after:bg-accent after:rounded-[1px] after:animate-blink";
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
              className="absolute inset-0 flex items-center justify-center rounded-lg cursor-text transition-all duration-200 group bg-surface/40 backdrop-blur-[1px]"
              onClick={startTest}
            >
              <div className="flex items-center gap-2 bg-surface border border-border px-5 py-2.5 rounded-full text-[13px] text-ink-2 shadow-md transition-all duration-200 pointer-events-none group-hover:-translate-y-1">
                Click or press any key to begin 
                <kbd className="bg-surface-2 border border-border-strong rounded-[3px] px-1.5 py-[1px] font-mono text-[11px] text-ink shadow-[0_2px_0_var(--border-strong)]">↵</kbd>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-center gap-3 px-8 py-4 border-t border-border bg-surface shrink-0">
        <button 
          onClick={() => resetTest(text)} 
          className="flex items-center gap-1.5 px-4 y-1.5 rounded border border-border bg-surface-2 font-body text-[12px] font-medium text-ink-2 cursor-pointer transition-all duration-150 hover:border-border-strong hover:bg-surface hover:text-ink">
          ↺ Restart <kbd className="bg-surface-3 rounded-[2px] px-1 py-[0.5px] font-mono text-[10px] text-ink-3 ml-1">Tab</kbd>
        </button>
        <button 
          onClick={() => resetTest()} 
          className="flex items-center gap-1.5 px-4 y-1.5 rounded border border-ink bg-ink font-body text-[12px] font-medium text-white cursor-pointer transition-all duration-150 hover:bg-[#2D2A27]">
          New Test <kbd className="bg-white/20 rounded-[2px] px-1 py-[0.5px] font-mono text-[10px] text-white ml-1">↵</kbd>
        </button>
        <button 
            onClick={toggleTheme}
            className="flex items-center gap-1.5 px-4 y-1.5 rounded border border-border bg-surface-2 font-body text-[12px] font-medium text-ink-2 cursor-pointer transition-all duration-150 hover:border-border-strong hover:bg-surface hover:text-ink">
          ⊕ Theme
        </button>
      </div>

      {/* Results Overlay */}
      {isFinished && (
        <div className="absolute inset-0 z-50 bg-bg/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-xl px-12 py-10 max-w-[540px] w-full shadow-md animate-slideUp">
            <div className="flex items-baseline justify-between mb-8 border-b border-border pb-5">
              <h2 className="font-display text-[22px] font-medium">Session Complete</h2>
              <div className="font-mono text-[11px] px-3 py-1 rounded-full bg-accent-light text-accent border border-accent/20">
                Performance Verified
              </div>
            </div>

            <div className="grid grid-cols-3 gap-px bg-border rounded-lg overflow-hidden mb-8">
              <div className="bg-surface p-4 flex flex-col items-center gap-1">
                <div className="font-mono text-[32px] font-normal text-ink tracking-[-0.02em]">{stats.wpm}</div>
                <div className="font-mono text-[9px] tracking-[0.1em] uppercase text-ink-3">WPM</div>
              </div>
              <div className="bg-surface p-4 flex flex-col items-center gap-1">
                <div className="font-mono text-[32px] font-normal text-ink tracking-[-0.02em]">{stats.accuracy}%</div>
                <div className="font-mono text-[9px] tracking-[0.1em] uppercase text-ink-3">Accuracy</div>
              </div>
              <div className="bg-surface p-4 flex flex-col items-center gap-1">
                <div className="font-mono text-[32px] font-normal text-ink tracking-[-0.02em]">{stats.errors}</div>
                <div className="font-mono text-[9px] tracking-[0.1em] uppercase text-ink-3">Errors</div>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => resetTest()} className="flex-1 bg-ink text-white font-medium text-[13px] py-2.5 rounded border border-ink hover:bg-[#2D2A27] transition-colors">
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
