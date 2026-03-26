"use client";

interface HandsDiagramProps {
  activeKey: string;
}

export default function HandsDiagram({ activeKey }: HandsDiagramProps) {
  const k = activeKey?.toLowerCase();

  const isPinkyL = ["1", "q", "a", "z"].includes(k);
  const isRingL = ["2", "w", "s", "x"].includes(k);
  const isMiddleL = ["3", "e", "d", "c"].includes(k);
  const isIndexL = ["4", "5", "r", "t", "f", "g", "v", "b"].includes(k);
  const isThumbL = k === " ";

  const isPinkyR = ["0", "p", ";", "/", "-", "=", "[", "]", "'"].includes(k);
  const isRingR = ["9", "o", "l", "."].includes(k);
  const isMiddleR = ["8", "i", "k", ","].includes(k);
  const isIndexR = ["6", "7", "y", "u", "h", "j", "n", "m"].includes(k);
  const isThumbR = k === " ";

  const isShift = k === "shift";
  if (isShift) {
    // Both pinkies highlight for shift
    // Or we could be specific, but for simplicity:
  }

  const fingerBaseClass = "flex flex-col items-center gap-0.5";
  const getBodyColor = (active: boolean, color: string) => active ? color : "bg-[#D4CFC8]";
  const getTipColor = (active: boolean, color: string) => active ? color : "bg-[#C8C2B8]";

  return (
    <div className="flex items-end justify-center gap-11 px-4 mt-2.5">
      {/* Left Hand */}
      <div className="flex flex-col items-center gap-1.5">
        <div className="flex items-end gap-1">
          {/* Pinky */}
          <div className={fingerBaseClass}>
            <div className={`w-[18px] h-[9px] rounded-full mx-auto -mb-[3px] transition-colors duration-150 ${getTipColor(isPinkyL, "bg-f-pinky")}`} />
            <div className={`w-[20px] h-[38px] rounded-t-[10px] rounded-b-[3px] transition-colors duration-150 ${getBodyColor(isPinkyL, "bg-f-pinky")}`} />
            <div className={`font-mono text-[10px] font-medium transition-colors duration-150 mt-0.5 ${isPinkyL ? "text-f-pinky" : "text-ink-3"}`}>A</div>
          </div>
          {/* Ring */}
          <div className={fingerBaseClass}>
            <div className={`w-[18px] h-[9px] rounded-full mx-auto -mb-[3px] transition-colors duration-150 ${getTipColor(isRingL, "bg-f-ring")}`} />
            <div className={`w-[20px] h-[48px] rounded-t-[10px] rounded-b-[3px] transition-colors duration-150 ${getBodyColor(isRingL, "bg-f-ring")}`} />
            <div className={`font-mono text-[10px] font-medium transition-colors duration-150 mt-0.5 ${isRingL ? "text-f-ring" : "text-ink-3"}`}>S</div>
          </div>
          {/* Middle */}
          <div className={fingerBaseClass}>
            <div className={`w-[18px] h-[9px] rounded-full mx-auto -mb-[3px] transition-colors duration-150 ${getTipColor(isMiddleL, "bg-f-middle")}`} />
            <div className={`w-[20px] h-[54px] rounded-t-[10px] rounded-b-[3px] transition-colors duration-150 ${getBodyColor(isMiddleL, "bg-f-middle")}`} />
            <div className={`font-mono text-[10px] font-medium transition-colors duration-150 mt-0.5 ${isMiddleL ? "text-f-middle" : "text-ink-3"}`}>D</div>
          </div>
          {/* Index */}
          <div className={fingerBaseClass}>
            <div className={`w-[18px] h-[9px] rounded-full mx-auto -mb-[3px] transition-colors duration-150 ${getTipColor(isIndexL, "bg-f-index")}`} />
            <div className={`w-[20px] h-[46px] rounded-t-[10px] rounded-b-[3px] transition-colors duration-150 ${getBodyColor(isIndexL, "bg-f-index")}`} />
            <div className={`font-mono text-[10px] font-medium transition-colors duration-150 mt-0.5 ${isIndexL ? "text-f-index" : "text-ink-3"}`}>F</div>
          </div>
          {/* Thumb */}
          <div className={`${fingerBaseClass} ml-[-1px]`}>
            <div className={`w-[15px] h-[9px] rounded-full mx-auto -mb-[3px] transition-colors duration-150 ${getTipColor(isThumbL, "bg-f-thumb")}`} />
            <div className={`w-[17px] h-[24px] rounded-t-[9px] rounded-b-[9px] transition-colors duration-150 ${getBodyColor(isThumbL, "bg-f-thumb")}`} />
            <div className={`font-mono text-[10px] font-medium transition-colors duration-150 mt-0.5 ${isThumbL ? "text-f-thumb" : "text-ink-3"}`}>·</div>
          </div>
        </div>
        <div className="font-mono text-[9px] tracking-[0.1em] text-ink-3 uppercase">Left Hand</div>
      </div>

      {/* Right Hand */}
      <div className="flex flex-col items-center gap-1.5">
        <div className="flex items-end gap-1">
          {/* Thumb */}
          <div className={`${fingerBaseClass} mr-[-1px]`}>
            <div className={`w-[15px] h-[9px] rounded-full mx-auto -mb-[3px] transition-colors duration-150 ${getTipColor(isThumbR, "bg-f-thumb")}`} />
            <div className={`w-[17px] h-[24px] rounded-t-[9px] rounded-b-[9px] transition-colors duration-150 ${getBodyColor(isThumbR, "bg-f-thumb")}`} />
            <div className={`font-mono text-[10px] font-medium transition-colors duration-150 mt-0.5 ${isThumbR ? "text-f-thumb" : "text-ink-3"}`}>·</div>
          </div>
          {/* Index */}
          <div className={fingerBaseClass}>
            <div className={`w-[18px] h-[9px] rounded-full mx-auto -mb-[3px] transition-colors duration-150 ${getTipColor(isIndexR, "bg-f-index")}`} />
            <div className={`w-[20px] h-[46px] rounded-t-[10px] rounded-b-[3px] transition-colors duration-150 ${getBodyColor(isIndexR, "bg-f-index")}`} />
            <div className={`font-mono text-[10px] font-medium transition-colors duration-150 mt-0.5 ${isIndexR ? "text-f-index" : "text-ink-3"}`}>J</div>
          </div>
          {/* Middle */}
          <div className={fingerBaseClass}>
            <div className={`w-[18px] h-[9px] rounded-full mx-auto -mb-[3px] transition-colors duration-150 ${getTipColor(isMiddleR, "bg-f-middle")}`} />
            <div className={`w-[20px] h-[54px] rounded-t-[10px] rounded-b-[3px] transition-colors duration-150 ${getBodyColor(isMiddleR, "bg-f-middle")}`} />
            <div className={`font-mono text-[10px] font-medium transition-colors duration-150 mt-0.5 ${isMiddleR ? "text-f-middle" : "text-ink-3"}`}>K</div>
          </div>
          {/* Ring */}
          <div className={fingerBaseClass}>
            <div className={`w-[18px] h-[9px] rounded-full mx-auto -mb-[3px] transition-colors duration-150 ${getTipColor(isRingR, "bg-f-ring")}`} />
            <div className={`w-[20px] h-[48px] rounded-t-[10px] rounded-b-[3px] transition-colors duration-150 ${getBodyColor(isRingR, "bg-f-ring")}`} />
            <div className={`font-mono text-[10px] font-medium transition-colors duration-150 mt-0.5 ${isRingR ? "text-f-ring" : "text-ink-3"}`}>L</div>
          </div>
          {/* Pinky */}
          <div className={fingerBaseClass}>
            <div className={`w-[18px] h-[9px] rounded-full mx-auto -mb-[3px] transition-colors duration-150 ${getTipColor(isPinkyR, "bg-f-pinky")}`} />
            <div className={`w-[20px] h-[38px] rounded-t-[10px] rounded-b-[3px] transition-colors duration-150 ${getBodyColor(isPinkyR, "bg-f-pinky")}`} />
            <div className={`font-mono text-[10px] font-medium transition-colors duration-150 mt-0.5 ${isPinkyR ? "text-f-pinky" : "text-ink-3"}`}>;</div>
          </div>
        </div>
        <div className="font-mono text-[9px] tracking-[0.1em] text-ink-3 uppercase">Right Hand</div>
      </div>
    </div>
  );
}
