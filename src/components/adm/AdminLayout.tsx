"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { HeaderAdm } from "./HeaderAdm";
import { SidebarAdm } from "./SidebarAdm";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  // Start collapsed by default; then hydrate from persisted preference
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  // Track current route segment for highlighting if needed in future
  // const currentSection = (router?.pathname?.split("/")[2] as string) || "dashboard";

  // Ensure portal-based overlays (Radix Dialog/Select) inherit admin theme via body class
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.classList.add("admin-body");
      // Hydrate sidebar state from localStorage on mount
      const saved = localStorage.getItem("adminSidebarOpen");
      if (saved !== null) {
        setSidebarOpen(saved === "1");
      }
      return () => {
        document.body.classList.remove("admin-body");
      };
    }
  }, []);

  // Persist sidebar preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("adminSidebarOpen", sidebarOpen ? "1" : "0");
    }
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen bg-violet-50">
      <HeaderAdm
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        sidebarOpen={sidebarOpen}
      />

      <div className="flex">
        <aside className={`transition-all duration-300 ${sidebarOpen ? "w-64" : "w-0"}`}>
          {sidebarOpen && <SidebarAdm />}
        </aside>

        <main className="flex-1 p-6 transition-all duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}
