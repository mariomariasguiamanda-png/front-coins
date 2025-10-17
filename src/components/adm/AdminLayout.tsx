"use client";

import { ReactNode, useState } from "react";
import { HeaderAdm } from "./HeaderAdm";
import { SidebarAdm } from "./SidebarAdm";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState(router.pathname.split("/")[2] || "dashboard");

  return (
    <div className="min-h-screen bg-violet-50">
      <HeaderAdm
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        sidebarOpen={sidebarOpen}
      />

      <div className="flex">
        <SidebarAdm
          open={sidebarOpen}
          active={activeItem}
          onChange={setActiveItem}
        />

        <main
          className={`flex-1 p-6 transition-all duration-300 ${
            sidebarOpen ? "ml-[280px]" : "ml-[80px]"
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
