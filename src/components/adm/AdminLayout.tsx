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

  // estado controlado + hidratação de preferência
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState<string>("dashboard");

  // tema no body + hidratar preferência do sidebar
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.classList.add("admin-body");
      const saved = localStorage.getItem("adminSidebarOpen");
      if (saved !== null) setSidebarOpen(saved === "1");
      return () => {
        document.body.classList.remove("admin-body");
      };
    }
  }, []);

  // persistir preferência
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("adminSidebarOpen", sidebarOpen ? "1" : "0");
    }
  }, [sidebarOpen]);

  // definir item ativo quando o router estiver disponível (evita erro de leitura em hydration)
  useEffect(() => {
    const path = router?.pathname;
    if (path) {
      const parts = path.split("/");
      setActiveItem((parts[2] as string) || "dashboard");
    }
  }, [router?.pathname]);

  // largura do aside conforme estado
  const asideWidth = sidebarOpen ? "w-64" : "w-16";
  const mainOffset = sidebarOpen ? "ml-64" : "ml-16";

  return (
    <div className="min-h-screen bg-violet-50 admin-theme">
      <HeaderAdm />

      {/* header fixo (assumindo 4rem de altura) */}
      <div className="flex pt-16">
        {/* aside fixo como na feat/, porém controlado por estado */}
        <aside
          className={`fixed h-[calc(100vh-4rem)] ${asideWidth} border-r bg-white transition-all duration-300`}
        >
          <SidebarAdm />
        </aside>

        {/* conteúdo com offset variável */}
        <main
          className={`${mainOffset} flex-1 p-6 transition-all duration-300`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
