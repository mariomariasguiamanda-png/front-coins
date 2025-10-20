"use client";

import { ReactNode, useState } from "react";
import { useRouter } from "next/router";
import { Roboto } from "next/font/google";
import {
  BarChart3,
  Medal,
  CalendarDays,
  HelpCircle,
  Trophy,
  Activity,
  Users,
  BookOpen,
  Settings,
} from "lucide-react";
import { PiBooksBold } from "react-icons/pi";
import { FaUserAlt } from "react-icons/fa";
import { IoHome } from "react-icons/io5";
import ProfessorHeader from "@/components/layout/ProfessorHeader";
import SidebarProfessor from "@/components/layout/SidebarProfessor";

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"] });

interface ProfessorLayoutProps {
  children: ReactNode;
}

export function ProfessorLayout({ children }: ProfessorLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();

  // Detecta a rota ativa baseada na URL atual
  const getActiveKey = () => {
    const path = router.asPath;
    if (path === "/professor" || path === "/professor/") return "dashboard";
    if (path.includes("/disciplinas")) return "disciplinas";
    if (path.includes("/desempenho")) return "desempenho";
    if (path.includes("/notas")) return "notas";
    if (path.includes("/config-moedas")) return "moedas";
    if (path.includes("/pontos-precos")) return "pontos";
    if (path.includes("/resumos")) return "resumos";
    if (path.includes("/videoaulas")) return "videoaulas";
    if (path.includes("/atividades")) return "atividades";
    if (path.includes("/perfil")) return "perfil";
    if (path.includes("/dashboard")) return "dashboard";
    return "dashboard";
  };

  const menu = [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: IoHome,
      href: "/professor/dashboard",
    },
    {
      key: "atividades",
      label: "Atividades",
      icon: Activity,
      href: "/professor/atividades",
    },
    {
      key: "resumos",
      label: "Resumos",
      icon: BookOpen,
      href: "/professor/resumos",
    },
    {
      key: "videoaulas",
      label: "Videoaulas",
      icon: PiBooksBold,
      href: "/professor/videoaulas",
    },
    {
      key: "notas",
      label: "Notas",
      icon: BarChart3,
      href: "/professor/notas",
    },
    {
      key: "desempenho",
      label: "Desempenho",
      icon: Trophy,
      href: "/professor/desempenho",
    },
    {
      key: "moedas",
      label: "Configurar Pontos",
      icon: Settings,
      href: "/professor/config-moedas",
    },
    {
      key: "perfil",
      label: "Perfil",
      icon: FaUserAlt,
      href: "/professor/perfil",
    },
  ];

  const handleMenuChange = (key: string) => {
    const menuItem = menu.find((item) => item.key === key);
    if (menuItem) {
      router.push(menuItem.href);
    }
  };

  return (
    <div
      className={`${roboto.className} min-h-screen w-screen bg-white text-black`}
    >
      <ProfessorHeader
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        sidebarOpen={sidebarOpen}
      />
      <div className="flex">
        <SidebarProfessor
          open={sidebarOpen}
          active={getActiveKey()}
          items={menu}
          onChange={handleMenuChange}
        />

        {/* Painel principal rolável */}
        <main className="flex-1 overflow-y-auto px-10 py-6 bg-gray-50 w-full max-w-[1600px] mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}