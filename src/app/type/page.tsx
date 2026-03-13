import AppLayout from "@/components/layout/AppLayout";
import Sidebar from "@/components/layout/Sidebar";
import RightPanel from "@/components/layout/RightPanel";
import TypingContainer from "@/components/typing/TypingContainer";
import { TypingProvider } from "@/context/TypingContext";

export default function TypePage() {
  return (
    <AppLayout>
      <TypingProvider>
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_200px] flex-1 overflow-hidden h-full">
          <Sidebar />
          <TypingContainer />
          <RightPanel />
        </div>
      </TypingProvider>
    </AppLayout>
  );
}
