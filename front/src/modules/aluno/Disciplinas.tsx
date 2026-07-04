import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  BookOpen,
  Calculator,
  Atom,
  Palette,
  Zap,
  Globe2,
  Flame,
  ScrollText,
} from "lucide-react";
import { api } from "@/lib/api";

type IconComponent = React.ComponentType<{ className?: string }>;

type DisciplinaUI = {
  id: number;
  codigo: string; // mat, hist, bio, qui, etc
  nome: string;
  icon: IconComponent;
  cor: keyof typeof cores;
  progresso: number;
  moedas_conquistadas: number;
  moedas_totais_disciplina?: number;
};

const cores = {
  blue: { grad: "from-blue-500 to-blue-600" },
  amber: { grad: "from-amber-500 to-amber-600" },
  green: { grad: "from-green-500 to-green-600" },
  purple: { grad: "from-purple-500 to-purple-600" },
  teal: { grad: "from-teal-500 to-teal-600" },
  pink: { grad: "from-pink-500 to-pink-600" },
  orange: { grad: "from-orange-500 to-red-500" },
} as const;

// Só visual (ícone + cor), nada de número mock
const DISCIPLINA_VISUAL: Record<
  string,
  { icon: IconComponent; cor: keyof typeof cores }
> = {
  matematica: { icon: Calculator, cor: "blue" },
  historia: { icon: ScrollText, cor: "amber" },
  biologia: { icon: Atom, cor: "green" },
  fisica: { icon: Zap, cor: "purple" },
  geografia: { icon: Globe2, cor: "teal" },
  artes: { icon: Palette, cor: "pink" },
  portugues: { icon: BookOpen, cor: "green" },
  quimica: { icon: Flame, cor: "orange" },
};

// Normaliza nome vindo do banco (remove acentos e põe minúsculo)
// e já trata null/undefined pra não quebrar
function normalizarNome(nome?: string | null): string {
  if (!nome) return "";
  return nome
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function DisciplinaCardSkeleton() {
  return (
    <div className="border border-gray-200 rounded-xl bg-white shadow-sm h-[140px] p-4 flex flex-col justify-between">
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-9 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between">
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-3 w-8" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
      </div>
    </div>
  );
}

const Disciplinas = () => {
  const [disciplinas, setDisciplinas] = useState<DisciplinaUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // Carrega disciplinas + stats reais do aluno logado - a API já resolve
  // id_aluno a partir do JWT e devolve tudo agregado numa chamada só.
  useEffect(() => {
    let cancelado = false;

    async function carregarDisciplinasAluno() {
      try {
        setErro(null);

        const rows = await api.get("/aluno/disciplinas");
        if (cancelado) return;

        const disciplinasUI: DisciplinaUI[] = (rows ?? []).map((row: any) => {
          const nomeDisciplina: string = row.nome || "Disciplina";
          const codigoDisciplina: string = row.codigo || "";

          const key = normalizarNome(nomeDisciplina);
          const visual =
            DISCIPLINA_VISUAL[key] || DISCIPLINA_VISUAL["matematica"];

          return {
            id: row.id_disciplina,
            codigo: codigoDisciplina,
            nome: nomeDisciplina,
            icon: visual.icon,
            cor: visual.cor,
            progresso: row.progresso_percent ?? 0,
            moedas_conquistadas: row.moedas_conquistadas ?? 0,
            moedas_totais_disciplina: row.moedas_totais_disciplina ?? 0,
          };
        });

        setDisciplinas(disciplinasUI);
      } catch (e: any) {
        if (cancelado) return;
        console.error(e);
        setErro("Erro ao carregar disciplinas.");
      } finally {
        if (!cancelado) setLoading(false);
      }
    }

    carregarDisciplinasAluno();
    return () => {
      cancelado = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BookOpen className="h-6 w-6 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">Disciplinas</h1>
      </div>
      <p className="text-gray-600">
        Acompanhe seu progresso em cada disciplina e acesse conteúdos
        exclusivos.
      </p>

      {erro && <p className="text-red-500 text-sm">{erro}</p>}

      {!erro && loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {[1, 2, 3].map((i) => (
            <DisciplinaCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!erro && !loading && disciplinas.length === 0 && (
        <p className="text-gray-600">
          Nenhuma disciplina encontrada para o seu usuário.
        </p>
      )}

      {!erro && !loading && disciplinas.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {disciplinas.map((disciplina) => {
            const t = cores[disciplina.cor];
            const Icon = disciplina.icon;
            const slug = disciplina.codigo || String(disciplina.id);
            const tema = normalizarNome(disciplina.nome);

            return (
              <Link
                key={disciplina.id}
                href={{
                  pathname: `/aluno/disciplinas/${slug}`,
                  query: { tema },
                }}
                className="block"
              >
                <Card className="border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 h-[140px] cursor-pointer">
                  <CardContent className="p-4 h-full flex flex-col justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg bg-gradient-to-br ${t.grad}`}
                      >
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {disciplina.nome}
                        </h3>
                        <p className="text-xs text-gray-600">
                          {disciplina.moedas_conquistadas} moedas conquistadas
                          {typeof disciplina.moedas_totais_disciplina ===
                            "number" && (
                            <> / {disciplina.moedas_totais_disciplina}</>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Progresso</span>
                        <span className="font-medium text-violet-700">
                          {disciplina.progresso}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${t.grad} transition-all duration-500`}
                          style={{ width: `${disciplina.progresso}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Disciplinas;
