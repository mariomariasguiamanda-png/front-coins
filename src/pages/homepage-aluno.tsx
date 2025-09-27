"use client";

import { useState } from "react";
import { Roboto } from "next/font/google";
import {
  BookOpen,
  BarChart3,
  Film,
  BookMarked,
  Medal,
  CalendarDays,
  Settings,
  HelpCircle,
  GraduationCap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

import Atividades from "@/modules/aluno/Atividades";
import MinhasNotas from "@/modules/aluno/MinhasNotas";
import Videoaulas from "@/modules/aluno/Videoaulas";
import Resumos from "@/modules/aluno/Resumos";
import ComprarPontos from "@/modules/aluno/ComprarPontos";
import Frequencia from "@/modules/aluno/Frequencia";
import Perfil from "@/modules/aluno/Perfil";
import Ajuda from "@/modules/aluno/Ajuda";

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"] });

type TabKey =
  | "atividades"
  | "notas"
  | "videoaulas"
  | "resumos"
  | "comprar"
  | "frequencia"
  | "perfil"
  | "ajuda";

export default function PaginaAluno() {
  const [active, setActive] = useState<TabKey>("atividades");

  const menu: Array<{
    key: TabKey;
    label: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  }> = [
    { key: "atividades", label: "Atividades", icon: BookOpen },
    { key: "notas", label: "Minhas Notas", icon: BarChart3 },
    { key: "videoaulas", label: "Videoaulas", icon: Film },
    { key: "resumos", label: "Resumos", icon: BookMarked },
    { key: "comprar", label: "Comprar Pontos", icon: Medal },
    { key: "frequencia", label: "Frequência", icon: CalendarDays },
    { key: "perfil", label: "Meu Perfil", icon: Settings },
    { key: "ajuda", label: "Ajuda", icon: HelpCircle },
  ];

  const renderActive = () => {
    switch (active) {
      case "atividades":
        return <Atividades />;
      case "notas":
        return <MinhasNotas />;
      case "videoaulas":
        return <Videoaulas />;
      case "resumos":
        return <Resumos />;
      case "comprar":
        return <ComprarPontos />;
      case "frequencia":
        return <Frequencia />;
      case "perfil":
        return <Perfil />;
      case "ajuda":
        return <Ajuda />;
      default:
        return <Atividades />;
    }
  };

  return (
    <div
      className={`${roboto.className} h-screen w-screen overflow-hidden grid md:grid-cols-[260px_minmax(0,1fr)] bg-gradient-to-br from-[#C084FC] via-[#7C3AED] to-[#1E1E1E] text-white`}
    >
      {/* Sidebar fixa (estilo vidro) */}
      <aside className="h-full bg-white/10 backdrop-blur-lg border-r border-white/20 p-4 flex flex-col gap-4">
        <div className="px-2 flex items-center gap-2">
          <GraduationCap className="h-6 w-6" />
          <div>
            <h1 className="text-lg font-bold leading-tight">Área do Aluno</h1>
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
      </aside>

      {/* Painel principal rolável com Card vidro */}
      <main className="h-full overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto space-y-4">
          <div>
            <h2 className="text-xl font-bold">Bem-vindo</h2>
            <p className="text-sm text-white/80">
              Revisões, notas e recompensas por aprendizado.
            </p>
          </div>

          <Card className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
            <CardContent className="p-6">{renderActive()}</CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
