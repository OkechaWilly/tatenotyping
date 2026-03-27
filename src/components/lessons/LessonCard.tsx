import { Lock, CheckCircle2, Play, Trophy } from "lucide-react";

interface LessonCardProps {
  lesson: {
    id: string;
    title: string;
    description: string;
    category: string;
    keys: string[];
    index: number;
  };
  progress: {
    completed: boolean;
    best_wpm: number;
    best_accuracy: number;
  } | null;
  isLocked: boolean;
  isActive: boolean;
  onSelect: () => void;
}

export default function LessonCard({ lesson, progress, isLocked, isActive, onSelect }: LessonCardProps) {
  return (
    <div 
      onClick={!isLocked ? onSelect : undefined}
      className={`group relative flex flex-col p-5 rounded-2xl border-2 transition-all duration-300 ${
        isLocked 
          ? "bg-surface-2 border-border opacity-60 cursor-not-allowed" 
          : isActive
            ? "bg-surface border-accent shadow-xl shadow-accent/10 cursor-pointer scale-[1.02] z-10"
            : "bg-surface border-border hover:border-accent/40 cursor-pointer hover:shadow-lg hover:-translate-y-1"
      }`}
    >
      {/* Status Icon */}
      <div className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center ${
        isLocked 
          ? "bg-surface-3 text-ink-3" 
          : progress?.completed 
            ? "bg-green/10 text-green" 
            : isActive 
              ? "bg-accent text-bg" 
              : "bg-surface-2 text-ink-3"
      }`}>
        {isLocked ? <Lock size={14} /> : progress?.completed ? <CheckCircle2 size={16} /> : <Play size={14} fill="currentColor" />}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-0.5">
          <div className={`font-mono text-[10px] uppercase tracking-widest font-bold ${isActive ? "text-accent" : "text-ink-3"}`}>
            Lesson {String(lesson.index + 1).padStart(2, '0')}
          </div>
          <h3 className={`font-display text-[17px] font-semibold leading-tight ${isLocked ? "text-ink-3" : "text-ink"}`}>
            {lesson.title}
          </h3>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-1">
            {lesson.keys.map(key => (
              <span key={key} className={`font-mono text-[10px] px-1.5 py-0.5 rounded border uppercase ${
                isLocked ? "bg-surface-3 border-border-strong text-ink-4" : "bg-surface-2 border-border text-ink-2"
              }`}>
                {key === ' ' ? 'Space' : key}
              </span>
            ))}
          </div>
          
          <p className="text-[11px] text-ink-3 line-clamp-2 leading-relaxed">
            {lesson.description}
          </p>
        </div>

        {/* Progress Section */}
        {!isLocked && progress && (
          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span className="font-mono text-[8px] uppercase tracking-wider text-ink-4">Best WPM</span>
                <span className="font-mono text-[13px] font-bold text-ink">{progress.best_wpm}</span>
              </div>
              <div className="w-px h-6 bg-border" />
              <div className="flex flex-col">
                <span className="font-mono text-[8px] uppercase tracking-wider text-ink-4">Accuracy</span>
                <span className="font-mono text-[13px] font-bold text-ink">{progress.best_accuracy}%</span>
              </div>
            </div>
            {progress.best_wpm >= 60 && <Trophy size={14} className="text-gold opacity-60" />}
          </div>
        )}

        {isActive && !progress?.completed && (
          <div className="mt-4 flex items-center justify-center bg-accent text-bg py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest shadow-lg shadow-accent/20 animate-pulse">
            Continue Journey
          </div>
        )}
      </div>

      {isLocked && (
        <div className="absolute inset-0 bg-surface-2/40 backdrop-blur-[1px] rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-ink-2 text-bg px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
            Complete previous lesson
          </div>
        </div>
      )}
    </div>
  );
}
