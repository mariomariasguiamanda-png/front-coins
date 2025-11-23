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
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.classList.add("admin-body");
      return () => document.body.classList.remove("admin-body");
    }
  }, []);

  return (
    <div className="min-h-screen bg-violet-50"> {/* mesmo fundo claro do professor */}
      <HeaderAdm
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        sidebarOpen={sidebarOpen}
      />


      {/* gap-0 fechado | gap-4 aberto: pequeno espaço entre sidebar e conteúdo */}
      <div className={`flex ${sidebarOpen ? "gap-4" : "gap-0"}`}>
       <aside
  className={`sticky top-16  /* top = altura do header (h-16 = 64px) */
              h-[calc(100vh-4rem)]  /* 100vh - 64px */
              bg-white border-r border-gray-200 shadow-sm
              transition-all duration-300
              ${sidebarOpen ? "w-[280px]" : "w-[80px]"}
            `}
>
  <SidebarAdm open={sidebarOpen} />
</aside>

        <main className="flex-1 p-6 transition-all duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}
