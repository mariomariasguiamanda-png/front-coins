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
} from "lucide-react";
import { PiBooksBold } from "react-icons/pi";
import { FaUserAlt } from "react-icons/fa";
import { IoHome } from "react-icons/io5";
import { Card, CardContent } from "@/components/ui/Card";
import AlunoHeader from "@/components/layout/AlunoHeader";
import SidebarAluno from "@/components/layout/SidebarAluno";

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"] });

type AlunoLayoutProps = {
  children: ReactNode;
};

export default function AlunoLayout({ children }: AlunoLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();

  // Detecta a rota ativa baseada na URL atual
  const getActiveKey = () => {
    const path = router.asPath;
    if (path === "/homepage-aluno" || path === "/homepage-aluno/")
      return "dashboard";
    if (path.includes("/disciplinas")) return "disciplinas";
    if (path.includes("/minhas-notas")) return "notas";
    if (path.includes("/comprar-pontos")) return "comprar";
    if (path.includes("/calendario")) return "frequencia";
    if (path.includes("/perfil")) return "perfil";
    if (path.includes("/ajuda")) return "ajuda";
    if (path.includes("/ranking")) return "ranking";
    return "dashboard";
  };

  const menu = [
    {
      key: "dashboard",
      label: "Início",
      icon: IoHome,
      href: "/homepage-aluno/inicio",
    },
    {
      key: "disciplinas",
      label: "Disciplinas",
      icon: PiBooksBold,
      href: "/homepage-aluno/disciplinas",
    },
    {
      key: "notas",
      label: "Minhas Notas",
      icon: BarChart3,
      href: "/homepage-aluno/minhas-notas",
    },
    {
      key: "ranking",
      label: "Ranking",
      icon: Trophy,
      href: "/homepage-aluno/ranking",
    },
    {
      key: "comprar",
      label: "Comprar Pontos",
      icon: Medal,
      href: "/homepage-aluno/comprar-pontos",
    },
    {
      key: "frequencia",
      label: "Calendário",
      icon: CalendarDays,
      href: "/homepage-aluno/calendario",
    },
    {
      key: "perfil",
      label: "Meu Perfil",
      icon: FaUserAlt,
      href: "/homepage-aluno/perfil",
    },
    {
      key: "ajuda",
      label: "Ajuda",
      icon: HelpCircle,
      href: "/homepage-aluno/ajuda",
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
      <AlunoHeader
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        sidebarOpen={sidebarOpen}
      />
      <div className="flex">
        <SidebarAluno
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
