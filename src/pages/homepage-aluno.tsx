"use client";

import { useMemo, useState } from "react";
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
import AlunoHeader from "@/components/layout/AlunoHeader";
import { aluno, atividades as mockAtividades, disciplinas, moedasPorMes, rankingTurma } from "@/lib/mock/aluno";

import Atividades from "@/modules/aluno/Atividades";
import Disciplinas from "@/modules/aluno/Disciplinas";
import MinhasNotas from "@/modules/aluno/MinhasNotas";
import Videoaulas from "@/modules/aluno/Videoaulas";
import Resumos from "@/modules/aluno/Resumos";
import ComprarPontos from "@/modules/aluno/ComprarPontos";
import Frequencia from "@/modules/aluno/Frequencia";
import Perfil from "@/modules/aluno/Perfil";
import Ajuda from "@/modules/aluno/Ajuda";

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"] });

type TabKey =
  | "disciplinas"
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
  const saldoTotal = aluno.saldoTotal;

  const menu: Array<{
    key: TabKey;
    label: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  }> = [
    { key: "disciplinas", label: "Disciplinas", icon: BookOpen },
    { key: "atividades", label: "Atividades", icon: BookOpen },
    { key: "notas", label: "Minhas Notas", icon: BarChart3 },
    { key: "videoaulas", label: "Videoaulas", icon: Film },
    { key: "resumos", label: "Resumos", icon: BookMarked },
  { key: "comprar", label: "Comprar Pontos", icon: Medal },
  { key: "frequencia", label: "Calendário", icon: CalendarDays },
    { key: "perfil", label: "Meu Perfil", icon: Settings },
    { key: "ajuda", label: "Ajuda", icon: HelpCircle },
  ];

  const renderActive = () => {
    switch (active) {
      case "disciplinas":
        return <Disciplinas />;
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
    <div className={`${roboto.className} h-screen w-screen overflow-hidden bg-gradient-to-br from-[#C084FC] via-[#7C3AED] to-[#0B0614] text-white`}> 
      <AlunoHeader />
      <div className="grid md:grid-cols-[260px_minmax(0,1fr)] h-[calc(100vh-56px)]">
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

        {/* Cartões rápidos de disciplinas */}
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {disciplinas.slice(0, 4).map((d) => (
            <div key={d.id} className="rounded-xl p-3 border border-white/15 bg-white/10">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold" style={{ color: d.cor }}>{d.nome}</span>
                <span className="text-xs text-white/80">{d.moedas} moedas</span>
              </div>
              <div className="mt-2 h-2 w-full rounded bg-white/10 overflow-hidden">
                <div className="h-full bg-amber-400" style={{ width: `${d.progresso}%` }} />
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Painel principal rolável com Card vidro */}
      <main className="h-full overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">Bem-vindo(a), {aluno.nome}!</h2>
              <p className="text-sm text-white/80">Matrícula {aluno.matricula} • Saldo total {saldoTotal} moedas</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs bg-white/10 rounded-lg px-3 py-1.5 border border-white/20">
              <span>Próximo prazo:</span>
              <strong>{new Date(mockAtividades[0]?.prazo || Date.now()).toLocaleDateString("pt-BR")}</strong>
            </div>
          </div>

          {/* Cartão do aluno */}
          <Card className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                <div className="rounded-lg bg-white/5 border border-white/10 p-3">
                  <div className="text-white/70">Aluno</div>
                  <div className="font-semibold">{aluno.nome}</div>
                </div>
                <div className="rounded-lg bg-white/5 border border-white/10 p-3">
                  <div className="text-white/70">Matrícula</div>
                  <div className="font-semibold">{aluno.matricula}</div>
                </div>
                <div className="rounded-lg bg-white/5 border border-white/10 p-3">
                  <div className="text-white/70">Saldo de moedas</div>
                  <div className="font-semibold text-amber-300">{saldoTotal}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
            <CardContent className="p-6">{renderActive()}</CardContent>
          </Card>

          {/* Linha de widgets: desempenho e ranking */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Moedas por mês</h3>
                  <span className="text-xs text-white/70">2025</span>
                </div>
                <div className="h-28 flex items-end gap-2">
                  {moedasPorMes.slice(0, 8).map((m) => (
                    <div key={m.mes} className="flex-1 flex flex-col justify-end items-center gap-1">
                      <div className="w-full rounded-t bg-amber-400/90" style={{ height: `${Math.max(8, m.valor)}px` }} />
                      <span className="text-[10px] text-white/80">{m.mes}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Ranking da turma</h3>
                <ul className="space-y-1 text-sm">
                  {rankingTurma.map((r) => (
                    <li key={r.posicao} className={`flex items-center justify-between rounded-lg px-2 py-1 ${r.nome === aluno.nome ? "bg-white/10" : ""}`}>
                      <span className="flex items-center gap-2">
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-white/10 text-[10px]">{r.posicao}</span>
                        {r.nome}
                      </span>
                      <span className="text-xs text-white/80">{r.moedas} moedas</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}
