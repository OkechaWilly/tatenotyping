"use client";

import { useState, useRef, useEffect } from "react";
import { User, Sparkles, CheckCircle2 } from "lucide-react";

interface ChatMessage {
  id: string;
  sender: 'user' | 'opponent';
  text: string;
}

import { useFreeTypingEngine, FreeTypingStats } from "@/hooks/useFreeTypingEngine";

interface FreeChatEngineProps {
  onComplete: (data: { stats: FreeTypingStats; keyStats: Record<string, { attempts: number; errors: number }> }) => void;
}

export default function FreeChatEngine({ onComplete }: FreeChatEngineProps) {
  const [visibleMessages, setVisibleMessages] = useState<ChatMessage[]>([]);
  const [isOpponentTyping, setIsOpponentTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  const {
    typed,
    handleInput,
    resetTest,
    setTyped,
    stats,
    keyStats
  } = useFreeTypingEngine();

  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleMessages, isOpponentTyping, typed]);

  // Initial Greeting
  useEffect(() => {
    if (!hasStarted) {
      setHasStarted(true);
      setIsOpponentTyping(true);
      setTimeout(() => {
         setIsOpponentTyping(false);
         setVisibleMessages([
           { id: "1", sender: "opponent", text: "Hi! How's your typing coming along today? Want to chat naturally?" }
         ]);
         resetTest();
      }, 1500);
    }
  }, [hasStarted, resetTest]);

  const advanceBot = async (userText: string) => {
    setIsOpponentTyping(true);
    try {
      // Map existing visible messages + the latest user message
      const conversationHistory = visibleMessages.map(m => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text
      }));
      conversationHistory.push({ role: "user", content: userText });

      const res = await fetch("/api/chat", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ messages: conversationHistory })
      });
      const data = await res.json();
      setVisibleMessages(prev => [...prev, { id: Math.random().toString(), sender: "opponent", text: data.reply }]);
    } catch {
       setVisibleMessages(prev => [...prev, { id: Math.random().toString(), sender: "opponent", text: "Haha my connection is acting up. Say that again?" }]);
    }
    setIsOpponentTyping(false);
    resetTest();
  };

  const sendUserMessage = () => {
    if (!typed.trim()) return;
    const newMsg: ChatMessage = {
       id: Math.random().toString(),
       sender: "user",
       text: typed.trim()
    };
    setVisibleMessages(prev => [...prev, newMsg]);
    const userText = typed.trim();
    setTyped("");
    advanceBot(userText);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && typed.trim() !== "") {
      sendUserMessage();
    }
  };

  const isUserTurn = !isOpponentTyping && visibleMessages[visibleMessages.length - 1]?.sender === "opponent";

  return (
    <div className="flex-1 flex flex-col bg-bg overflow-hidden relative" onClick={() => isUserTurn && inputRef.current?.focus()}>
      {/* Chat Header */}
      <div className="px-6 py-4 bg-surface border-b border-border flex items-center justify-between z-10 shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-f-index/10 text-f-index rounded-full flex items-center justify-center border border-f-index/20 shadow-inner overflow-hidden relative">
              <User size={20} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-ink text-[15px]">Tateno Companion</span>
              <span className="text-[11px] text-green font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
                Online
              </span>
            </div>
          </div>
        </div>
        
        {/* Live Stats */}
        <div className="flex items-center gap-4 bg-surface-2 px-4 py-2 rounded-2xl border border-border">
          <div className="flex flex-col items-center border-r border-border pr-4 gap-0.5 group">
             <button 
                onClick={() => onComplete({ stats, keyStats })}
                className="flex items-center gap-1.5 px-3 py-1 bg-ink text-surface rounded-full text-[10px] uppercase font-mono tracking-widest font-bold hover:scale-105 active:scale-95 transition-all outline-none"
             >
                End Chat <CheckCircle2 size={12}/>
             </button>
             <span className="text-[8px] font-mono mt-0.5 text-ink-3 uppercase opacity-0 group-hover:opacity-100 transition-opacity">Saves stats</span>
          </div>

          <div className="flex items-center gap-1.5">
             <Sparkles size={14} className="text-gold" />
             <span className="text-[9px] font-mono text-gold uppercase font-bold tracking-widest hidden sm:inline-block pl-1 border-l border-gold/20">Pro Mode</span>
          </div>
          <div className="w-px h-6 bg-border" />
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-mono uppercase text-ink-4 tracking-widest">Raw WPM</span>
            <span className="font-mono font-bold text-accent text-[14px]">{stats.wpm}</span>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 sm:p-10 flex flex-col gap-6 scroll-smooth"
      >
        <div className="text-center mb-6 mt-4">
          <span className="bg-surface-2 border border-border text-ink-4 text-[10px] uppercase font-mono tracking-widest px-3 py-1 rounded-full">
            Today
          </span>
          <p className="text-[12px] text-ink-3 max-w-sm mt-4 mx-auto leading-relaxed">
             This is a freeform chat interface. There is no predefined script. Just chat naturally and I will track your keystrokes to identify any weak spots.
          </p>
        </div>

        {visibleMessages.map((msg, idx) => {
          const isUser = msg.sender === "user";
          return (
            <div key={idx} className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
              {!isUser && (
                <div className="w-8 h-8 rounded-full bg-f-index/10 text-f-index flex items-center justify-center border border-f-index/20 mr-3 mt-auto shrink-0">
                  <User size={14} />
                </div>
              )}
              <div 
                className={`max-w-[80%] md:max-w-[60%] px-5 py-3.5 rounded-[22px] text-[15px] leading-relaxed shadow-sm ${
                  isUser 
                    ? "bg-accent text-white rounded-br-[4px]" 
                    : "bg-surface border border-border text-ink rounded-bl-[4px]"
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}

        {isOpponentTyping && (
           <div className="flex w-full justify-start items-center">
             <div className="w-8 h-8 rounded-full bg-f-index/10 text-f-index flex items-center justify-center border border-f-index/20 mr-3 shrink-0">
               <User size={14} />
             </div>
             <div className="bg-surface border border-border px-4 py-3.5 rounded-[22px] rounded-bl-[4px] shadow-sm flex gap-1 items-center h-12">
               <span className="w-1.5 h-1.5 bg-ink-4 rounded-full animate-bounce [animation-delay:-0.3s]" />
               <span className="w-1.5 h-1.5 bg-ink-4 rounded-full animate-bounce [animation-delay:-0.15s]" />
               <span className="w-1.5 h-1.5 bg-ink-4 rounded-full animate-bounce" />
             </div>
           </div>
        )}

        {isUserTurn && (
           <div className="flex w-full justify-end mt-2 animate-fadeUp">
             <div className="max-w-[80%] md:max-w-[60%] px-5 py-3.5 rounded-[22px] rounded-br-[4px] bg-accent/5 border border-accent/20 border-dashed min-h-[50px] shadow-sm text-[15px] leading-relaxed text-ink min-w-[100px] break-words">
                {typed === "" ? (
                  <span className="opacity-40 animate-pulse text-accent">Type your reply...</span>
                ) : (
                  <span>{typed}<span className="inline-block w-[3px] h-[15px] bg-accent ml-0.5 animate-pulse translate-y-[2px]" /></span>
                )}
             </div>
           </div>
        )}
      </div>

      {/* Actual Input - keeping it focused invisibly */}
      <input
        ref={inputRef}
        type="text"
        className="absolute opacity-0 pointer-events-none"
        value={typed}
        onChange={(e) => handleInput(e.target.value)}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
      />
      
      {/* Footer controls */}
      <div className="p-4 sm:p-6 bg-surface border-t border-border flex items-center gap-4">
         <div className="flex-1 text-[11px] font-mono text-ink-4/80 uppercase tracking-widest flex items-center justify-center gap-2">
           <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" /> Keys tracked dynamically in the background. 
         </div>
         <button 
           onClick={sendUserMessage}
           disabled={typed.trim() === ""}
           className={`px-6 h-12 rounded-full font-bold text-[14px] flex items-center gap-2 transition-all ${
             typed.trim() !== "" ? "bg-accent text-white shadow-lg hover:scale-105" : "bg-surface-2 text-ink-5 pointer-events-none"
           }`}
         >
           Send <kbd className="hidden sm:inline-block ml-1 bg-black/10 px-1.5 py-0.5 rounded text-[10px] font-mono opacity-80 uppercase tracking-wider font-bold">Enter</kbd>
         </button>
      </div>
    </div>
  );
}
