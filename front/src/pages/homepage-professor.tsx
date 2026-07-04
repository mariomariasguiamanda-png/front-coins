"use client";

import { useState } from "react";
import { Roboto } from "next/font/google";
import {
  BookOpen,
  BarChart3,
  TrendingUp,
  Medal,
  Coins,
  Settings,
  HelpCircle,
  GraduationCap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

import RevisoesResumos from "@/modules/professor/RevisoesResumos";
import NotasAlunos from "@/modules/professor/NotasAlunos";
import DesempenhoPorTurma from "@/modules/professor/DesempenhoPorTurma";
import PontosPrecos from "@/modules/professor/PontosPrecos";
import MoedasPorAtividade from "@/modules/professor/MoedasPorAtividade";

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"] });

type TabKey =
  | "revisoes"
  | "notas"
  | "desempenho"
  | "pontos"
  | "moedas"
  | "perfil"
  | "ajuda";

export default function PaginaProfessor() {
  const [active, setActive] = useState<TabKey>("revisoes");

  const menu: Array<{
    key: TabKey;
    label: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  }> = [
    { key: "revisoes", label: "Revisões & Resumos", icon: BookOpen },
    { key: "notas", label: "Notas dos Alunos", icon: BarChart3 },
    { key: "desempenho", label: "Desempenho por Turma", icon: TrendingUp },
    { key: "pontos", label: "Pontos & Preços", icon: Medal },
    { key: "moedas", label: "Moedas por Atividade", icon: Coins },
    { key: "perfil", label: "Meu Perfil", icon: Settings },
    { key: "ajuda", label: "Ajuda", icon: HelpCircle },
  ];

  const renderActive = () => {
    switch (active) {
      case "revisoes":
        return <RevisoesResumos />;
      case "notas":
        return <NotasAlunos />;
      case "desempenho":
        return <DesempenhoPorTurma />;
      case "pontos":
        return <PontosPrecos />;
      case "moedas":
        return <MoedasPorAtividade />;
      case "perfil":
        return (
          <div className="text-center text-black">
            Módulo em desenvolvimento
          </div>
        );
      case "ajuda":
        return (
          <div className="text-center text-black">
            Módulo em desenvolvimento
          </div>
        );
      default:
        return <RevisoesResumos />;
    }
  };

  return (
    <div
      className={`${roboto.className} h-screen w-screen overflow-hidden grid md:grid-cols-[260px_minmax(0,1fr)] bg-white text-black`}
    >
      {/* Sidebar fixa (estilo vidro) */}
      <aside className="h-full bg-gradient-to-br from-[#C084FC] via-[#7C3AED] to-[#1E1E1E] text-white border-r border-white/20 backdrop-blur-lg p-4 flex flex-col gap-4">
        <div className="px-2 flex items-center gap-2">
          <GraduationCap className="h-6 w-6" />
          <div>
            <h1 className="text-lg font-bold leading-tight">
              Área do Professor
            </h1>
            <p className="text-xs text-white/70">Coins for Study</p>
          </div>
        </div>

        <nav className="mt-2 space-y-1">
          {menu.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActive(item.key)}
                className={`flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm hover:bg-white/10 transition ${
                  isActive
                    ? "bg-white/20 text-white font-bold"
                    : "text-white/80"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Informações do professor */}
        <div className="mt-auto p-3 rounded-lg bg-white/5 border border-white/10">
          <div className="text-sm font-medium text-white">Prof. João Silva</div>
          <div className="text-xs text-white/70">
            Matemática • História • Física
          </div>
          <div className="text-xs text-white/60 mt-1">3 turmas • 85 alunos</div>
        </div>
      </aside>

      {/* Painel principal rolável com Card vidro */}
      <main className="h-full overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto space-y-4">
          <div>
            <h2 className="text-xl font-bold">Bem-vindo, Professor</h2>
            <p className="text-sm text-gray-700">
              Gerencie conteúdos, moedas e pontos dos seus alunos.
            </p>
          </div>

          <Card className="rounded-2xl bg-white border border-gray-200">
            <CardContent className="p-6">{renderActive()}</CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
