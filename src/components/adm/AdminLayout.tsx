"use client";

import { ReactNode, useState } from "react";
import { HeaderAdm } from "./HeaderAdm";
import { SidebarAdm } from "./SidebarAdm";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-violet-50">
      <HeaderAdm
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        sidebarOpen={sidebarOpen}
      />

      <div className="flex">
        <aside
          className={`fixed h-[calc(100vh-3.5rem)] border-r bg-white transition-all duration-300 ${
            sidebarOpen ? "w-64" : "w-0 overflow-hidden"
          }`}
        >
          <SidebarAdm />
        </aside>

        <main
          className={`flex-1 p-6 transition-all duration-300 ${
            sidebarOpen ? "ml-64" : "ml-0"
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
