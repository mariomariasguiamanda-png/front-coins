import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";
import AdminHeader from "./AdminHeader";
"use client";

import { ReactNode, useState } from "react";
import { HeaderAdm } from "./HeaderAdm";
import { SidebarAdm } from "./SidebarAdm";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(router.pathname.split("/")[2] || "dashboard");
  // Ensure portal-based overlays (Radix Dialog/Select) inherit admin theme via body class
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.classList.add("admin-body");
      return () => {
        document.body.classList.remove("admin-body");
      };
    }
  }, []);
  return (
  <div className="min-h-screen bg-violet-50 admin-theme">
      <div className="sticky top-0 z-50">
        <AdminHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
      </div>
      
      <div className="flex bg-gray-50/50">
        <div className={`transition-all duration-300 ease-in-out ${sidebarOpen ? "w-[280px]" : "w-[80px]"}`}>
          <SidebarAdm
            open={sidebarOpen}
            active={activeItem}
            onChange={setActiveItem}
          />
        </div>
        
        <main className="flex-1 p-6">
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
