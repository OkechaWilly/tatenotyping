import AppLayout from "@/components/layout/AppLayout";
import ProfileHero from "@/components/dashboard/ProfileHero";
import KPICards from "@/components/dashboard/KPICards";
import ProgressChart from "@/components/dashboard/ProgressChart";
import LetterPerformance from "@/components/dashboard/LetterPerformance";
import ActivityCalendar from "@/components/dashboard/ActivityCalendar";
import SkillBreakdown from "@/components/dashboard/SkillBreakdown";
import SessionsTable from "@/components/dashboard/SessionsTable";
import WeakKeys from "@/components/dashboard/WeakKeys";
import Achievements from "@/components/dashboard/Achievements";

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="flex-1 overflow-y-auto bg-bg">
        <div className="layout-container pb-16 pt-8 flex flex-col gap-7">
          <ProfileHero />
          <KPICards />
          
          <div className="animate-fadeUp" style={{ animationDelay: "0.2s" }}>
            <ProgressChart />
          </div>

          <div className="animate-fadeUp" style={{ animationDelay: "0.22s" }}>
            <LetterPerformance />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 animate-fadeUp" style={{ animationDelay: "0.14s" }}>
            <ActivityCalendar />
            <SkillBreakdown />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5 animate-fadeUp" style={{ animationDelay: "0.26s" }}>
            <SessionsTable />
            <WeakKeys />
          </div>

          <div className="flex items-center gap-3 font-mono text-[9px] tracking-[0.12em] uppercase text-ink-4 mt-2 mb-1">
            <div className="flex-1 h-px bg-border" />
            Achievements
            <div className="flex-1 h-px bg-border" />
          </div>

          <Achievements />
        </div>
      </div>
    </AppLayout>
  );
}
