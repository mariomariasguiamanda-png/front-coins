"use client";

import { useMemo } from "react";
import { useRouter } from "next/router";
import { Card, CardContent } from "@/components/ui/Card";
import {
  disciplinas as mockDisciplinas,
  atividades as mockAtividades,
  resumos as mockResumos,
  videoaulas as mockVideos,
} from "@/lib/mock/aluno";
import {
  BookOpen,
  FileText,
  Activity as LActivity,
  Play,
  ArrowLeft,
  Award,
} from "lucide-react";
import {
  FaCalculator,
  FaFlask,
  FaGlobeAmericas,
  FaBook,
  FaAtom,
  FaPalette,
} from "react-icons/fa";
import { resolverTema } from "@/modules/aluno/tema";

type IconComponent = (props: { className?: string }) => JSX.Element;

const iconByNome: Record<string, IconComponent> = {
  matemática: (p) => <FaCalculator {...p} />,
  português: (p) => <FaBook {...p} />,
  historia: (p) => <FaBook {...p} />,
  história: (p) => <FaBook {...p} />,
  biologia: (p) => <FaFlask {...p} />,
  física: (p) => <FaAtom {...p} />,
  geografia: (p) => <FaGlobeAmericas {...p} />,
  artes: (p) => <FaPalette {...p} />,
};

function nomeToSlug(nome: string): string {
  const n = nome.toLowerCase();
  if (n === "matemática") return "mat";
  if (n === "português") return "port";
  if (n === "história" || n === "historia") return "hist";
  if (n === "geografia") return "geo";
  if (n === "biologia") return "bio";
  if (n === "física" || n === "fisica") return "fis";
  if (n === "artes") return "art";
  return n;
}

export default function DisciplinaDetalhePage() {
  const { query, back, push } = useRouter();
  const id = String(query.id || "");

  // Buscar disciplina por id (slug do mock)
  const disciplina = mockDisciplinas.find((d) => d.id === id);

  const stats = useMemo(() => {
    const acts = mockAtividades.filter((a) => a.disciplinaId === id);
    const sums = mockResumos.filter((r) => r.disciplinaId === id);
    const vids = mockVideos.filter((v) => v.disciplinaId === id);
    const concluidas = acts.filter(
      (a) => a.status === "corrigido" || a.status === "enviado"
    ).length;
    const pendentes = acts.filter((a) => a.status === "pendente").length;
    return { acts, sums, vids, concluidas, pendentes };
  }, [id]);

  // Fallbacks se disciplina não existir no mock
  const nome = disciplina?.nome || id;
  const slug = disciplina ? disciplina.id : nomeToSlug(nome);
  // Tema via util compartilhado (query.tema > id > nome)
  const tema = resolverTema({ id, nome, queryTema: query.tema });
  const Icon: IconComponent =
    iconByNome[nome.toLowerCase()] || ((p) => <BookOpen {...p} />);
  const moedas = disciplina?.moedas ?? 0;
  const progresso = disciplina?.progresso ?? 0;

  // Estimar totalMoedas a partir do progresso quando possível
  const totalEstimado =
    progresso > 0 ? Math.round(moedas / (progresso / 100)) : moedas;

  return (
    <div className="min-h-dvh bg-white text-gray-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => push(`/homepage-aluno/${id}`)}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-xl text-white bg-gradient-to-br ${tema.grad}`}
            >
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{nome}</h1>
              <p className="text-sm text-gray-600">
                {moedas} de {totalEstimado} moedas conquistadas
              </p>
            </div>
          </div>
        </div>

        {/* Gráfico de desempenho + estatísticas rápidas */}
        <Card className="border border-gray-200 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                Desempenho na Disciplina
              </h3>
              <span className={`font-bold text-2xl ${tema.text}`}>
                {progresso}%
              </span>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progresso Geral</span>
                  <span>{progresso}%</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${tema.bar}`}
                    style={{ width: `${progresso}%` }}
                  />
                </div>
              </div>

              {/* Estatísticas rápidas */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${tema.text}`}>
                    {moedas}
                  </div>
                  <div className="text-sm text-gray-600">Moedas</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${tema.text}`}>
                    {stats.concluidas}
                  </div>
                  <div className="text-sm text-gray-600">Concluídas</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${tema.text}`}>
                    {stats.vids.length}
                  </div>
                  <div className="text-sm text-gray-600">Videoaulas</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Opções disponíveis */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Resumos */}
          <Card className="hover:shadow-lg transition-shadow border border-gray-200 rounded-2xl">
            <CardContent className="p-6">
              <div
                className="cursor-pointer"
                role="button"
                onClick={() => push(`/disciplinas/${slug}/resumos`)}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`p-2 rounded-lg bg-gradient-to-br ${tema.grad} bg-opacity-10`}
                  ></div>
                  <FileText className={`h-5 w-5 ${tema.text}`} />
                  <h3 className="font-semibold">Resumos</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Materiais de estudo e resumos postados pelos professores
                </p>
                <div className="flex items-center justify-between">
                  <span className={`text-2xl font-bold ${tema.text}`}>
                    {stats.sums.length}
                  </span>
                  <Award className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Atividades */}
          <Card className="hover:shadow-lg transition-shadow border border-gray-200 rounded-2xl">
            <CardContent className="p-6">
              <div
                className="cursor-pointer"
                role="button"
                onClick={() => push(`/disciplinas/${slug}/atividades`)}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`p-2 rounded-lg bg-gradient-to-br ${tema.grad} bg-opacity-10`}
                  ></div>
                  <LActivity className={`h-5 w-5 ${tema.text}`} />
                  <h3 className="font-semibold">Atividades</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Concluídas</span>
                    <span className="font-semibold">{stats.concluidas}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Pendentes</span>
                    <span className="font-semibold">{stats.pendentes}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Videoaulas */}
          <Card className="hover:shadow-lg transition-shadow border border-gray-200 rounded-2xl">
            <CardContent className="p-6">
              <div
                className="cursor-pointer"
                role="button"
                onClick={() => push(`/disciplinas/${slug}/videoaulas`)}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`p-2 rounded-lg bg-gradient-to-br ${tema.grad} bg-opacity-10`}
                  ></div>
                  <Play className={`h-5 w-5 ${tema.text}`} />
                  <h3 className="font-semibold">Videoaulas</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Quantidade</span>
                    <span className="font-semibold">{stats.vids.length}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Barra de progressão detalhada */}
        <Card className="border border-gray-200 rounded-2xl">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Progresso */}
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progresso Geral</span>
                  <span>{progresso}%</span>
                </div>
                <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${tema.bar}`}
                    style={{ width: `${progresso}%` }}
                  />
                </div>
              </div>

              {/* Moedas */}
              <div className="text-center">
                <div className={`text-3xl font-bold ${tema.text}`}>
                  {moedas}
                </div>
                <div className="text-sm text-gray-600">Moedas conquistadas</div>
              </div>

              {/* Vídeos assistidos (proxy: total de videoaulas por enquanto) */}
              <div className="text-center">
                <div className={`text-3xl font-bold ${tema.text}`}>
                  {stats.vids.length}
                </div>
                <div className="text-sm text-gray-600">
                  Videoaulas disponíveis
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
