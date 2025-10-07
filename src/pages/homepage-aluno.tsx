"use client";

import { useMemo, useState } from "react";
import { Roboto } from "next/font/google";
import { BarChart3, Medal, CalendarDays, HelpCircle } from "lucide-react";
import { PiBooksBold } from "react-icons/pi";
import { FaUserAlt } from "react-icons/fa";
import { IoHome } from "react-icons/io5";
import { Card, CardContent } from "@/components/ui/Card";
import AlunoHeader from "@/components/layout/AlunoHeader";
import SidebarAluno from "@/components/layout/SidebarAluno";
import {
  aluno,
  atividades as mockAtividades,
  disciplinas,
  moedasPorMes,
  rankingTurma,
} from "@/lib/mock/aluno";

import Disciplinas from "@/modules/aluno/Disciplinas";
import MinhasNotas from "@/modules/aluno/MinhasNotas";
import ComprarPontos from "@/modules/aluno/ComprarPontos";
import Frequencia from "@/modules/aluno/Frequencia";
import Perfil from "@/modules/aluno/Perfil";
import Ajuda from "@/modules/aluno/Ajuda";
import Dashboard from "@/modules/aluno/Dashboard";

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"] });

type TabKey =
  | "dashboard"
  | "disciplinas"
  | "notas"
  | "comprar"
  | "frequencia"
  | "perfil"
  | "ajuda";

export default function PaginaAluno() {
  const [active, setActive] = useState<TabKey>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const saldoTotal = aluno.saldoTotal;

  const menu: Array<{
    key: TabKey;
    label: string;
    icon: React.ElementType;
  }> = [
    { key: "dashboard", label: "Início", icon: IoHome },
    { key: "disciplinas", label: "Disciplinas", icon: PiBooksBold },
    { key: "notas", label: "Minhas Notas", icon: BarChart3 },
    { key: "comprar", label: "Comprar Pontos", icon: Medal },
    { key: "perfil", label: "Meu Perfil", icon: FaUserAlt },
    { key: "frequencia", label: "Calendário", icon: CalendarDays },
    { key: "ajuda", label: "Ajuda", icon: HelpCircle },
  ];

  const renderActive = () => {
    switch (active) {
      case "dashboard":
        return (
          <Dashboard
            aluno={{
              nome: aluno.nome,
              matricula: aluno.matricula,
              saldoTotal: saldoTotal,
            }}
            moedasPorMes={moedasPorMes}
            rankingTurma={rankingTurma}
            proximoPrazo={new Date(
              mockAtividades[0]?.prazo || Date.now()
            ).toLocaleDateString("pt-BR")}
          />
        );
      case "disciplinas":
        return <Disciplinas />;
      case "notas":
        return <MinhasNotas />;
      case "comprar":
        return <ComprarPontos />;
      case "frequencia":
        return <Frequencia />;
      case "perfil":
        return <Perfil />;
      case "ajuda":
        return <Ajuda />;
      default:
        return (
          <Dashboard
            aluno={{
              nome: aluno.nome,
              matricula: aluno.matricula,
              saldoTotal: saldoTotal,
            }}
            moedasPorMes={moedasPorMes}
            rankingTurma={rankingTurma}
            proximoPrazo={new Date(
              mockAtividades[0]?.prazo || Date.now()
            ).toLocaleDateString("pt-BR")}
          />
        );
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
          active={active}
          items={menu}
          onChange={(k) => setActive(k as TabKey)}
        />

        {/* Painel principal rolável */}
        <main className="p-6 flex-1">
          <div className="max-w-5xl mx-auto">
            <Card className="rounded-2xl bg-white border border-gray-200">
              <CardContent className="p-6">{renderActive()}</CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
