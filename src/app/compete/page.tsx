import AppLayout from "@/components/layout/AppLayout";

export default function CompetePage() {
  return (
    <AppLayout>
      <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-bg">
        <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-ink-3">Coming Soon</div>
        <div className="font-display text-[28px] font-medium text-ink">Global Leaderboard</div>
        <div className="text-[14px] text-ink-3 max-w-[360px] text-center leading-relaxed">
          Compete against typists worldwide. Daily challenges, ranked matches, and live races — launching soon.
        </div>
      </div>
    </AppLayout>
  );
}
