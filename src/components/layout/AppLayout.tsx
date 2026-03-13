"use client";

import Nav from "@/components/layout/Nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      {/* 
        This is a shell component. 
        Individual pages (like /type and /dashboard) define their own internal layout grids.
      */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {children}
      </div>
    </>
  );
}
