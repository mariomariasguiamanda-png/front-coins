"use client";

import { useState } from "react";
import { Roboto } from "next/font/google";
import {
  GraduationCap,
  BookOpen,
  Clock,
  Layers,
  Target,
  Users,
  Settings,
  HelpCircle,
  Shield,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

import ModeloEnsino from "@/modules/administrador/ModeloEnsino";
import Disciplinas from "@/modules/administrador/Disciplinas";
import PrazoMoedas from "@/modules/administrador/PrazoMoedas";
import SeparacaoPorDisciplina from "@/modules/administrador/SeparacaoPorDisciplina";
import MediasPorDisciplina from "@/modules/administrador/MediasPorDisciplina";
import Usuarios from "@/modules/administrador/Usuarios";

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"] });

type TabKey =
  | "modelo"
  | "disciplinas"
  | "prazo"
  | "separacao"
  | "medias"
  | "usuarios"
  | "perfil"
  | "ajuda";

export default function PaginaAdministrador() {
  const [active, setActive] = useState<TabKey>("modelo");

  const menu: Array<{
    key: TabKey;
    label: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  }> = [
    { key: "modelo", label: "Modelo de Ensino", icon: GraduationCap },
    { key: "disciplinas", label: "Disciplinas", icon: BookOpen },
    { key: "prazo", label: "Prazo das Moedas", icon: Clock },
    { key: "separacao", label: "Separação por Disciplina", icon: Layers },
    { key: "medias", label: "Médias por Disciplina", icon: Target },
    { key: "usuarios", label: "Usuários", icon: Users },
    { key: "perfil", label: "Meu Perfil", icon: Settings },
    { key: "ajuda", label: "Ajuda", icon: HelpCircle },
  ];

  const renderActive = () => {
    switch (active) {
      case "modelo":
        return <ModeloEnsino />;
      case "disciplinas":
        return <Disciplinas />;
      case "prazo":
        return <PrazoMoedas />;
      case "separacao":
        return <SeparacaoPorDisciplina />;
      case "medias":
        return <MediasPorDisciplina />;
      case "usuarios":
        return <Usuarios />;
      case "perfil":
        return (
          <div className="text-center text-white">
            Módulo em desenvolvimento
          </div>
        );
      case "ajuda":
        return (
          <div className="text-center text-white">
            Módulo em desenvolvimento
          </div>
        );
      default:
        return <ModeloEnsino />;
    }
  };

  return (
    <div
      className={`${roboto.className} h-screen w-screen overflow-hidden grid md:grid-cols-[260px_minmax(0,1fr)] bg-gradient-to-br from-[#C084FC] via-[#7C3AED] to-[#1E1E1E] text-white`}
    >
      {/* Sidebar fixa (estilo vidro) */}
      <aside className="h-full bg-white/10 backdrop-blur-lg border-r border-white/20 p-4 flex flex-col gap-4">
        <div className="px-2 flex items-center gap-2">
          <Shield className="h-6 w-6" />
          <div>
            <h1 className="text-lg font-bold leading-tight">
              Painel do Administrador
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

        {/* Informações do administrador */}
        <div className="mt-auto p-3 rounded-lg bg-white/5 border border-white/10">
          <div className="text-sm font-medium text-white">Admin. Sistema</div>
          <div className="text-xs text-white/70">Administrador Geral</div>
          <div className="text-xs text-white/60 mt-1">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              Sistema operacional
            </div>
          </div>
        </div>
      </aside>

      {/* Painel principal rolável com Card vidro */}
      <main className="h-full overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto space-y-4">
          <div>
            <h2 className="text-xl font-bold">Bem-vindo, Administrador</h2>
            <p className="text-sm text-white/80">
              Configure modelos, disciplinas, prazos e usuários do sistema.
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
