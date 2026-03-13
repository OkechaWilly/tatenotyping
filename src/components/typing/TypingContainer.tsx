"use client";

import { useState } from "react";
import StatsBar from "./StatsBar";
import TypingEngine from "./TypingEngine";
import { useTypingEngine } from "@/hooks/useTypingEngine";

const DEFAULT_TEXT = "the quick brown fox jumps over the lazy dog while the sun sets behind the mountains casting long shadows across the valley floor every great developer you know got there by solving problems";

export default function TypingContainer() {
  const [duration] = useState(30);
  const engine = useTypingEngine(DEFAULT_TEXT, duration);

  return (
    <main className="flex flex-col bg-bg overflow-hidden relative flex-1">
      <StatsBar
        wpm={engine.isActive || engine.isFinished ? engine.stats.wpm : null}
        rawWpm={engine.isActive || engine.isFinished ? engine.stats.rawWpm : null}
        accuracy={engine.isActive || engine.isFinished ? engine.stats.accuracy : null}
        errors={engine.stats.errors}
        timeLeft={engine.timeLeft}
        totalTime={duration}
      />
      <div className="flex-1 overflow-hidden">
        <TypingEngine engine={engine} />
      </div>
    </main>
  );
}
