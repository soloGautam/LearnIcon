import type { ReactNode } from "react";
import { Sidebar, MobileTabBar } from "./Sidebar";
import { Footer } from "./Footer";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full">
      <Sidebar />
      <div className="md:pl-16">
        <main className="px-4 pb-24 pt-6 md:px-8 md:pt-8">{children}</main>
        <Footer />
      </div>
      <MobileTabBar />
    </div>
  );
}