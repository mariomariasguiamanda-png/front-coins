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
import { Card, CardContent } from "@/components/ui/Card";
import ProfessorHeader from "@/components/layout/ProfessorHeader";
import SidebarProfessor from "@/components/layout/SidebarProfessor";

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"] });

type ProfessorLayoutProps = {
  children: ReactNode;
};

export default function ProfessorLayout({ children }: ProfessorLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();

  // Detecta a rota ativa baseada na URL atual
  const getActiveKey = () => {
    const path = router.asPath;
    if (path === "/professor" || path === "/professor/") return "dashboard";
    if (path.includes("/disciplinas")) return "disciplinas";
    if (path.includes("/desempenho")) return "desempenho";
    if (path.includes("/notas-alunos")) return "notas";
    if (path.includes("/moedas-atividade")) return "moedas";
    if (path.includes("/pontos-precos")) return "pontos";
    if (path.includes("/revisoes")) return "revisoes";
    if (path.includes("/perfil")) return "perfil";
    if (path.includes("/ajuda")) return "ajuda";
    return "dashboard";
  };

  const menu = [
    {
      key: "dashboard",
      label: "Início",
      icon: IoHome,
      href: "/professor/inicio",
    },
    {
      key: "disciplinas",
      label: "Disciplinas",
      icon: PiBooksBold,
      href: "/professor/disciplinas",
    },
    {
      key: "desempenho",
      label: "Desempenho por Turma",
      icon: Activity,
      href: "/professor/desempenho",
    },
    {
      key: "notas",
      label: "Notas dos Alunos",
      icon: BarChart3,
      href: "/professor/notas-alunos",
    },
    {
      key: "moedas",
      label: "Moedas por Atividade",
      icon: Medal,
      href: "/professor/moedas-atividade",
    },
    {
      key: "pontos",
      label: "Pontos e Preços",
      icon: Settings,
      href: "/professor/pontos-precos",
    },
    {
      key: "revisoes",
      label: "Revisões de Resumos",
      icon: BookOpen,
      href: "/professor/revisoes",
    },
    {
      key: "perfil",
      label: "Meu Perfil",
      icon: FaUserAlt,
      href: "/professor/perfil",
    },
    {
      key: "ajuda",
      label: "Ajuda",
      icon: HelpCircle,
      href: "/professor/ajuda",
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