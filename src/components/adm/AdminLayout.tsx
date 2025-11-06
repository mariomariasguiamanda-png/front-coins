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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState(
    (router?.pathname?.split("/")[2] as string) || "dashboard"
  );

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
      <HeaderAdm
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        sidebarOpen={sidebarOpen}
      />

      <div className="flex">
       <aside 
  className={`
    bg-white border-r border-gray-200 
    transition-all duration-300 
    ${sidebarOpen ? "w-64" : "w-0"} 
    overflow-hidden
  `}
>
  <SidebarAdm open={sidebarOpen} active={activeItem} onChange={setActiveItem} />
</aside>
        <SidebarAdm open={sidebarOpen} active={activeItem} onChange={setActiveItem} />

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
