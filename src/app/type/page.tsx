import AppLayout from "@/components/layout/AppLayout";
import Sidebar from "@/components/layout/Sidebar";
import RightPanel from "@/components/layout/RightPanel";
import TypingContainer from "@/components/typing/TypingContainer";

export default function TypePage() {
  return (
    <AppLayout>
      <div className="flex flex-col lg:grid lg:grid-cols-[220px_1fr_200px] flex-1 overflow-hidden h-full">
        <div className="hidden lg:block border-r border-border shrink-0">
          <Sidebar />
        </div>
        <TypingContainer />
        <div className="hidden lg:block border-l border-border shrink-0">
          <RightPanel />
        </div>
      </div>
    </AppLayout>
  );
}
