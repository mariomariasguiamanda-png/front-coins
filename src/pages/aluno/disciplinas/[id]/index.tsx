"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/router";
import AlunoLayout from "@/components/layout/AlunoLayout";
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
  Clock,
  CheckCircle,
  TrendingUp,
  Calendar,
  Download,
  Eye,
  BarChart3,
  Users,
  Trophy,
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
  return nome.toLowerCase();
}

function nomePorSlug(id: string) {
  const mapa: Record<string, string> = {
    mat: "Matemática",
    port: "Português",
    hist: "História",
    geo: "Geografia",
    bio: "Biologia",
    fis: "Física",
    art: "Artes",
  };
  return mapa[id] || id;
}

export default function DisciplinaDetalhePage() {
  const { query, push } = useRouter();
  const id = String(query.id || "");

  const disc = mockDisciplinas.find((d) => d.id === id);
  const atividades = useMemo(
    () => mockAtividades.filter((a) => a.disciplinaId === id),
    [id]
  );
  const resumos = useMemo(
    () => mockResumos.filter((r) => r.disciplinaId === id),
    [id]
  );
  const videos = useMemo(
    () => mockVideos.filter((v) => v.disciplinaId === id),
    [id]
  );

  // Estatísticas calculadas para o gráfico de desempenho
  const stats = useMemo(() => {
    const atividadesPendentes = atividades.filter(
      (a) => a.status === "pendente"
    ).length;
    const atividadesConcluidas = atividades.filter(
      (a) => a.status === "corrigido" || a.status === "enviado"
    ).length;
    const videosAssistidos = Math.floor(videos.length * 0.75); // Simulação de progresso
    const totalMoedas = disc?.moedas || 0;
    const maxMoedas = 600; // Valor máximo possível para a disciplina
    const progressoPercentual = disc?.progresso || 0;

    return {
      atividadesPendentes,
      atividadesConcluidas,
      totalAtividades: atividades.length,
      videosAssistidos,
      totalVideos: videos.length,
      totalResumos: resumos.length,
      totalMoedas,
      maxMoedas,
      progressoPercentual,
      moediasPercentual: Math.round((totalMoedas / maxMoedas) * 100),
      atividadesPercentual:
        atividades.length > 0
          ? Math.round((atividadesConcluidas / atividades.length) * 100)
          : 0,
      videosPercentual:
        videos.length > 0
          ? Math.round((videosAssistidos / videos.length) * 100)
          : 0,
    };
  }, [atividades, videos, resumos, disc]);

  const tituloDisciplina = disc?.nome || nomePorSlug(id);
  const tema = resolverTema({ id, nome: disc?.nome, queryTema: query.tema });
  const IconComponent = iconByNome[tituloDisciplina.toLowerCase()] || FaBook;

  return (
    <AlunoLayout>
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div className="flex items-start gap-4">
          <button
            onClick={() => push("/aluno/disciplinas")}
            className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-lg bg-gradient-to-br ${tema.grad}`}>
              <IconComponent className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className={`text-3xl font-bold ${tema.text} mb-1`}>
                {tituloDisciplina}
              </h1>
              <p className="text-sm text-gray-600">
                Explore atividades, resumos e videoaulas
              </p>
              {disc && (
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <Award className="h-4 w-4 text-amber-500" />
                    <span className="text-sm font-medium">
                      {disc.moedas} moedas
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Progresso: {disc.progresso}%
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Gráfico de Desempenho */}
        <Card className="rounded-2xl border bg-gradient-to-br from-gray-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <BarChart3 className={`h-5 w-5 ${tema.text}`} />
                Gráfico de Desempenho
              </h2>
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-medium text-amber-600">
                  {stats.totalMoedas} moedas
                </span>
              </div>
            </div>

            {/* Estatísticas visuais */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-white rounded-lg shadow-sm border">
                <div className={`text-2xl font-bold ${tema.text}`}>
                  {stats.moediasPercentual}%
                </div>
                <div className="text-sm text-gray-600">Moedas</div>
                <div className="text-xs text-gray-500">
                  {stats.totalMoedas}/{stats.maxMoedas}
                </div>
              </div>

              <div className="text-center p-4 bg-white rounded-lg shadow-sm border">
                <div className="text-2xl font-bold text-green-600">
                  {stats.atividadesConcluidas}
                </div>
                <div className="text-sm text-gray-600">Concluídas</div>
                <div className="text-xs text-gray-500">
                  de {stats.totalAtividades}
                </div>
              </div>

              <div className="text-center p-4 bg-white rounded-lg shadow-sm border">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.videosAssistidos}
                </div>
                <div className="text-sm text-gray-600">Vídeos</div>
                <div className="text-xs text-gray-500">
                  de {stats.totalVideos}
                </div>
              </div>

              <div className="text-center p-4 bg-white rounded-lg shadow-sm border">
                <div className="text-2xl font-bold text-purple-600">
                  {stats.totalResumos}
                </div>
                <div className="text-sm text-gray-600">Resumos</div>
                <div className="text-xs text-gray-500">disponíveis</div>
              </div>
            </div>

            {/* Barras de progresso detalhadas */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-700 font-medium">
                    Moedas Conquistadas
                  </span>
                  <span className="font-bold">{stats.moediasPercentual}%</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${tema.grad} transition-all duration-700`}
                    style={{ width: `${stats.moediasPercentual}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-700 font-medium">
                    Atividades Concluídas
                  </span>
                  <span className="font-bold">
                    {stats.atividadesPercentual}%
                  </span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-700"
                    style={{ width: `${stats.atividadesPercentual}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-700 font-medium">
                    Videoaulas Assistidas
                  </span>
                  <span className="font-bold">{stats.videosPercentual}%</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-700"
                    style={{ width: `${stats.videosPercentual}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Opções Disponíveis - Cards de Navegação */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Opções Disponíveis
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card Resumos */}
            <Card className="rounded-2xl border-2 hover:shadow-lg transition-all duration-300 hover:border-blue-300 group">
              <CardContent className="p-6 text-center">
                <div
                  className="cursor-pointer"
                  onClick={() => push(`/aluno/disciplinas/${id}/resumos`)}
                >
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${tema.grad} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Resumos
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Materiais de estudo e resumos postados pelos professores
                  </p>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className={`text-2xl font-bold ${tema.text}`}>
                      {stats.totalResumos}
                    </span>
                    <span className="text-gray-500 text-sm">
                      resumos disponíveis
                    </span>
                  </div>
                  <div
                    className={`px-4 py-2 bg-gradient-to-r ${tema.grad} text-white rounded-lg font-medium group-hover:opacity-90 transition-opacity`}
                  >
                    Ver Todos os Resumos
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card Atividades */}
            <Card className="rounded-2xl border-2 hover:shadow-lg transition-all duration-300 hover:border-orange-300 group">
              <CardContent className="p-6 text-center">
                <div
                  className="cursor-pointer"
                  onClick={() => push(`/aluno/disciplinas/${id}/atividades`)}
                >
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${tema.grad} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <LActivity className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Atividades
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Tarefas, exercícios e avaliações para completar
                  </p>
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="text-center">
                      <span className="text-xl font-bold text-orange-600">
                        {stats.atividadesPendentes}
                      </span>
                      <p className="text-xs text-gray-500">pendentes</p>
                    </div>
                    <div className="text-center">
                      <span className="text-xl font-bold text-green-600">
                        {stats.atividadesConcluidas}
                      </span>
                      <p className="text-xs text-gray-500">concluídas</p>
                    </div>
                  </div>
                  <div
                    className={`px-4 py-2 bg-gradient-to-r ${tema.grad} text-white rounded-lg font-medium group-hover:opacity-90 transition-opacity`}
                  >
                    Ver Todas as Atividades
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card Videoaulas */}
            <Card className="rounded-2xl border-2 hover:shadow-lg transition-all duration-300 hover:border-red-300 group">
              <CardContent className="p-6 text-center">
                <div
                  className="cursor-pointer"
                  onClick={() => push(`/aluno/disciplinas/${id}/videoaulas`)}
                >
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${tema.grad} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Play className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Videoaulas
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Conteúdo em vídeo para aprendizado visual
                  </p>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className={`text-2xl font-bold ${tema.text}`}>
                      {stats.videosAssistidos}
                    </span>
                    <span className="text-gray-500 text-sm">
                      / {stats.totalVideos} assistidos
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div
                      className={`h-2 bg-gradient-to-r ${tema.grad} rounded-full transition-all duration-500`}
                      style={{ width: `${stats.videosPercentual}%` }}
                    />
                  </div>
                  <div
                    className={`px-4 py-2 bg-gradient-to-r ${tema.grad} text-white rounded-lg font-medium group-hover:opacity-90 transition-opacity`}
                  >
                    Ver Todas as Videoaulas
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AlunoLayout>
  );
}
