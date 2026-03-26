"use client";

import { useState } from "react";
import { Hand, Globe } from "lucide-react";

const FINGER_COLORS: Record<string, string> = {
  left_pinky: "bg-pink-500/20 text-pink-500 border-pink-500/30",
  left_ring: "bg-blue-500/20 text-blue-500 border-blue-500/30",
  left_middle: "bg-green-500/20 text-green-500 border-green-500/30",
  left_index: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
  thumb: "bg-purple-500/20 text-purple-500 border-purple-500/30",
  right_index: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
  right_middle: "bg-green-500/20 text-green-500 border-green-500/30",
  right_ring: "bg-blue-500/20 text-blue-500 border-blue-500/30",
  right_pinky: "bg-pink-500/20 text-pink-500 border-pink-500/30",
};

const KEY_TO_FINGER: Record<string, string> = {
  // Left Hand
  'q': 'left_pinky', 'a': 'left_pinky', 'z': 'left_pinky', '1': 'left_pinky', '`': 'left_pinky', 'tab': 'left_pinky', 'caps': 'left_pinky', 'shift': 'left_pinky',
  'w': 'left_ring', 's': 'left_ring', 'x': 'left_ring', '2': 'left_ring',
  'e': 'left_middle', 'd': 'left_middle', 'c': 'left_middle', '3': 'left_middle',
  'r': 'left_index', 'f': 'left_index', 'v': 'left_index', '4': 'left_index',
  't': 'left_index', 'g': 'left_index', 'b': 'left_index', '5': 'left_index',
  
  // Thumbs
  ' ': 'thumb',
  
  // Right Hand
  'y': 'right_index', 'h': 'right_index', 'n': 'right_index', '6': 'right_index',
  'u': 'right_index', 'j': 'right_index', 'm': 'right_index', '7': 'right_index',
  'i': 'right_middle', 'k': 'right_middle', ',': 'right_middle', '8': 'right_middle',
  'o': 'right_ring', 'l': 'right_ring', '.': 'right_ring', '9': 'right_ring',
  'p': 'right_pinky', ';': 'right_pinky', '/': 'right_pinky', '0': 'right_pinky', '-': 'right_pinky', '=': 'right_pinky', '[': 'right_pinky', ']': 'right_pinky', '\\': 'right_pinky', 'enter': 'right_pinky', 'backspace': 'right_pinky', "'": 'right_pinky'
};

export default function FingerMap() {
  const [hoveredFinger, setHoveredFinger] = useState<string | null>(null);

  const renderKey = (label: string, width: string = "w-10") => {
    const finger = KEY_TO_FINGER[label.toLowerCase()] || "thumb";
    const isActive = hoveredFinger === finger;
    const colorClass = FINGER_COLORS[finger];

    return (
      <div 
        onMouseEnter={() => setHoveredFinger(finger)}
        onMouseLeave={() => setHoveredFinger(null)}
        className={`h-10 ${width} flex items-center justify-center rounded-lg border font-mono text-xs font-bold transition-all duration-300 ${
          isActive ? colorClass : "bg-surface-2 border-border text-ink-3 opacity-60"
        }`}
      >
        {label.toUpperCase()}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-12 w-full max-w-4xl mx-auto p-8 bg-surface rounded-3xl border border-border shadow-2xl">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-ink">Finger Mapping Reference</h2>
        <p className="text-ink-3 text-sm">Hover over a key or a finger to see the correct mapping.</p>
      </div>

      {/* Hands Visualization */}
      <div className="flex justify-between items-end px-12 h-48">
        {/* Left Hand */}
        <div className="flex items-end gap-2 h-full">
          {['left_pinky', 'left_ring', 'left_middle', 'left_index'].map((f) => (
            <div 
              key={f}
              onMouseEnter={() => setHoveredFinger(f)}
              onMouseLeave={() => setHoveredFinger(null)}
              className={`w-4 rounded-full transition-all duration-300 cursor-help ${
                hoveredFinger === f ? FINGER_COLORS[f].split(' ')[0] : "bg-border opacity-40"
              }`}
              style={{ height: f === 'left_middle' ? '100%' : f === 'left_ring' ? '90%' : f === 'left_pinky' ? '70%' : '90%' }}
            />
          ))}
          <div 
             onMouseEnter={() => setHoveredFinger('thumb')}
             onMouseLeave={() => setHoveredFinger(null)}
             className={`w-6 h-28 rounded-full translate-x-4 -rotate-12 transition-all duration-300 cursor-help ${
               hoveredFinger === 'thumb' ? FINGER_COLORS['thumb'].split(' ')[0] : "bg-border opacity-40"
             }`}
          />
        </div>

        {/* Right Hand */}
        <div className="flex items-end gap-2 h-full">
           <div 
             onMouseEnter={() => setHoveredFinger('thumb')}
             onMouseLeave={() => setHoveredFinger(null)}
             className={`w-6 h-28 rounded-full -translate-x-4 rotate-12 transition-all duration-300 cursor-help ${
               hoveredFinger === 'thumb' ? FINGER_COLORS['thumb'].split(' ')[0] : "bg-border opacity-40"
             }`}
          />
          {['right_index', 'right_middle', 'right_ring', 'right_pinky'].map((f) => (
            <div 
              key={f}
              onMouseEnter={() => setHoveredFinger(f)}
              onMouseLeave={() => setHoveredFinger(null)}
              className={`w-4 rounded-full transition-all duration-300 cursor-help ${
                hoveredFinger === f ? FINGER_COLORS[f].split(' ')[0] : "bg-border opacity-40"
              }`}
              style={{ height: f === 'right_middle' ? '100%' : f === 'right_ring' ? '90%' : f === 'right_pinky' ? '70%' : '90%' }}
            />
          ))}
        </div>
      </div>

      {/* Keyboard Grid */}
      <div className="flex flex-col gap-2 bg-surface-2 p-4 rounded-2xl border border-border shadow-inner">
        {/* Row 1 */}
        <div className="flex gap-1">
          {['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'backspace'].map(k => renderKey(k, k === 'backspace' ? 'w-24' : 'w-10'))}
        </div>
        {/* Row 2 */}
        <div className="flex gap-1">
          {['tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'].map(k => renderKey(k, k === 'tab' ? 'w-16' : 'w-10'))}
        </div>
        {/* Row 3 */}
        <div className="flex gap-1">
          {['caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'enter'].map(k => renderKey(k, k === 'caps' ? 'w-20' : k === 'enter' ? 'w-20' : 'w-10'))}
        </div>
        {/* Row 4 */}
        <div className="flex gap-1">
          {['shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'shift'].map(k => renderKey(k, 'w-10 flex-1'))}
        </div>
        {/* Row 5 */}
        <div className="flex gap-1 justify-center">
          {renderKey(' ', 'w-64')}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-surface-2 border border-border flex items-start gap-4">
          <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
            <Hand size={18} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-ink">Posture Tip</span>
            <span className="text-xs text-ink-3">Keep your wrists lifted and fingers curved like you&apos;re holding a ball.</span>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-surface-2 border border-border flex items-start gap-4">
          <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
            <Globe size={18} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-ink">Home Row</span>
            <span className="text-xs text-ink-3">Always return to A S D F and J K L ; between words.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
