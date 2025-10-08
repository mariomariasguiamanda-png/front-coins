"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/router";
import AlunoLayout from "@/components/layout/AlunoLayout";
import { Card, CardContent } from "@/components/ui/Card";
import {
  Calendar,
  Activity,
  BookOpen,
  Play,
  FileText,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Users,
} from "lucide-react";
import {
  FaCalculator,
  FaFlask,
  FaGlobeAmericas,
  FaBook,
  FaAtom,
  FaPalette,
} from "react-icons/fa";
import {
  atividades as mockAtividades,
  resumos as mockResumos,
  videoaulas as mockVideoaulas,
  disciplinas as mockDisciplinas,
} from "@/lib/mock/aluno";

type IconComponent = (props: { className?: string }) => JSX.Element;

const iconByDisciplina: Record<string, IconComponent> = {
  mat: (p) => <FaCalculator {...p} />,
  port: (p) => <FaBook {...p} />,
  hist: (p) => <FaBook {...p} />,
  geo: (p) => <FaGlobeAmericas {...p} />,
  bio: (p) => <FaFlask {...p} />,
  fis: (p) => <FaAtom {...p} />,
  art: (p) => <FaPalette {...p} />,
};

const coresByDisciplina: Record<
  string,
  {
    grad: string;
    text: string;
    bgLight: string;
    border: string;
  }
> = {
  mat: {
    grad: "from-blue-500 to-blue-600",
    text: "text-blue-600",
    bgLight: "bg-blue-50",
    border: "border-blue-200",
  },
  port: {
    grad: "from-purple-500 to-purple-600",
    text: "text-purple-600",
    bgLight: "bg-purple-50",
    border: "border-purple-200",
  },
  hist: {
    grad: "from-amber-500 to-amber-600",
    text: "text-amber-600",
    bgLight: "bg-amber-50",
    border: "border-amber-200",
  },
  geo: {
    grad: "from-teal-500 to-teal-600",
    text: "text-teal-600",
    bgLight: "bg-teal-50",
    border: "border-teal-200",
  },
  bio: {
    grad: "from-green-500 to-green-600",
    text: "text-green-600",
    bgLight: "bg-green-50",
    border: "border-green-200",
  },
  fis: {
    grad: "from-indigo-500 to-indigo-600",
    text: "text-indigo-600",
    bgLight: "bg-indigo-50",
    border: "border-indigo-200",
  },
};

export default function AtividadesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "atividades" | "resumos" | "videoaulas"
  >("atividades");
  const [filtroStatus, setFiltroStatus] = useState<
    "todos" | "pendente" | "enviado" | "corrigido"
  >("todos");
  const [filtroDisciplina, setFiltroDisciplina] = useState<string>("todas");

  // Estatísticas das atividades
  const estatisticas = useMemo(() => {
    const atividadesPendentes = mockAtividades.filter(
      (a) => a.status === "pendente"
    ).length;
    const atividadesEnviadas = mockAtividades.filter(
      (a) => a.status === "enviado"
    ).length;
    const totalResumos = mockResumos.length;
    const totalVideoaulas = mockVideoaulas.length;
    const moedasPendentes = mockAtividades
      .filter((a) => a.status === "pendente")
      .reduce((sum, a) => sum + a.moedas, 0);

    return {
      atividadesPendentes,
      atividadesEnviadas,
      totalResumos,
      totalVideoaulas,
      moedasPendentes,
      totalAtividades: mockAtividades.length,
    };
  }, []);

  const formatarPrazo = (prazo: string) => {
    const data = new Date(prazo);
    const hoje = new Date();
    const diffTime = data.getTime() - hoje.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { texto: "Atrasado", cor: "text-red-600", bgCor: "bg-red-50" };
    } else if (diffDays === 0) {
      return { texto: "Hoje", cor: "text-orange-600", bgCor: "bg-orange-50" };
    } else if (diffDays === 1) {
      return { texto: "Amanhã", cor: "text-yellow-600", bgCor: "bg-yellow-50" };
    } else {
      return {
        texto: `${diffDays} dias`,
        cor: "text-green-600",
        bgCor: "bg-green-50",
      };
    }
  };

  const getDisciplinaNome = (disciplinaId: string) => {
    const disciplina = mockDisciplinas.find((d) => d.id === disciplinaId);
    return disciplina?.nome || disciplinaId;
  };

  const getDisciplinaCor = (disciplinaId: string) => {
    return coresByDisciplina[disciplinaId] || coresByDisciplina.mat;
  };

  const getDisciplinaIcon = (disciplinaId: string) => {
    return iconByDisciplina[disciplinaId] || iconByDisciplina.mat;
  };

  return (
    <AlunoLayout>
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Atividades</h1>
            <p className="text-gray-600">Envie revisões e colete moedas</p>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border border-red-200 bg-red-50 hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Pendentes</p>
                <p className="text-2xl font-bold text-red-700">
                  {estatisticas.atividadesPendentes}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </CardContent>
          </Card>

          <Card className="border border-green-200 bg-green-50 hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Enviadas</p>
                <p className="text-2xl font-bold text-green-700">
                  {estatisticas.atividadesEnviadas}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </CardContent>
          </Card>

          <Card className="border border-blue-200 bg-blue-50 hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Resumos</p>
                <p className="text-2xl font-bold text-blue-700">
                  {estatisticas.totalResumos}
                </p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </CardContent>
          </Card>

          <Card className="border border-amber-200 bg-amber-50 hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600">
                  Moedas Pendentes
                </p>
                <p className="text-2xl font-bold text-amber-700">
                  {estatisticas.moedasPendentes}
                </p>
              </div>
              <Award className="h-8 w-8 text-amber-500" />
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Status:
                </label>
                <select
                  value={filtroStatus}
                  onChange={(e) => setFiltroStatus(e.target.value as any)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="todos">Todos</option>
                  <option value="pendente">Pendente</option>
                  <option value="enviado">Enviado</option>
                  <option value="corrigido">Corrigido</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Disciplina:
                </label>
                <select
                  value={filtroDisciplina}
                  onChange={(e) => setFiltroDisciplina(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="todas">Todas</option>
                  {mockDisciplinas.map((disciplina) => (
                    <option key={disciplina.id} value={disciplina.id}>
                      {disciplina.nome}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => {
                  setFiltroStatus("todos");
                  setFiltroDisciplina("todas");
                }}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 underline"
              >
                Limpar filtros
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Abas de Navegação */}
        <div className="flex border-b border-gray-200">
          {[
            { key: "atividades", label: "Atividades", icon: Activity },
            { key: "resumos", label: "Resumos", icon: FileText },
            { key: "videoaulas", label: "Videoaulas", icon: Play },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-3 -mb-px text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "text-purple-600 border-purple-600"
                  : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Conteúdo das Abas */}
        <div className="space-y-4">
          {activeTab === "atividades" && (
            <div className="grid gap-4">
              {mockAtividades.filter((atividade) => {
                const statusMatch =
                  filtroStatus === "todos" || atividade.status === filtroStatus;
                const disciplinaMatch =
                  filtroDisciplina === "todas" ||
                  atividade.disciplinaId === filtroDisciplina;
                return statusMatch && disciplinaMatch;
              }).length === 0 ? (
                <Card className="border border-gray-200">
                  <CardContent className="p-8 text-center">
                    <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Nenhuma atividade encontrada
                    </h3>
                    <p className="text-gray-600">
                      {filtroStatus !== "todos" || filtroDisciplina !== "todas"
                        ? "Nenhuma atividade corresponde aos filtros selecionados."
                        : "Não há atividades disponíveis no momento."}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                mockAtividades
                  .filter((atividade) => {
                    const statusMatch =
                      filtroStatus === "todos" ||
                      atividade.status === filtroStatus;
                    const disciplinaMatch =
                      filtroDisciplina === "todas" ||
                      atividade.disciplinaId === filtroDisciplina;
                    return statusMatch && disciplinaMatch;
                  })
                  .map((atividade) => {
                    const disciplinaCor = getDisciplinaCor(
                      atividade.disciplinaId
                    );
                    const DisciplinaIcon = getDisciplinaIcon(
                      atividade.disciplinaId
                    );
                    const prazoInfo = formatarPrazo(atividade.prazo);

                    return (
                      <Card
                        key={atividade.id}
                        className="border border-gray-200 hover:shadow-lg transition-all duration-200"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4 flex-1">
                              {/* Ícone da Disciplina */}
                              <div
                                className={`p-3 rounded-lg bg-gradient-to-br ${disciplinaCor.grad}`}
                              >
                                <DisciplinaIcon className="h-5 w-5 text-white" />
                              </div>

                              {/* Informações da Atividade */}
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span
                                    className={`text-sm font-medium ${disciplinaCor.text}`}
                                  >
                                    {getDisciplinaNome(atividade.disciplinaId)}
                                  </span>
                                  <span
                                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                                      atividade.status === "pendente"
                                        ? "bg-red-100 text-red-700"
                                        : atividade.status === "enviado"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-blue-100 text-blue-700"
                                    }`}
                                  >
                                    {atividade.status === "pendente"
                                      ? "Pendente"
                                      : atividade.status === "enviado"
                                      ? "Enviado"
                                      : "Corrigido"}
                                  </span>
                                </div>

                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                  {atividade.titulo}
                                </h3>

                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    <span className={prazoInfo.cor}>
                                      {prazoInfo.texto}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Award className="h-4 w-4 text-amber-500" />
                                    <span className="font-medium">
                                      {atividade.moedas} moedas
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Botão de Ação */}
                            <button
                              onClick={() => {
                                router.push(
                                  `/aluno/disciplinas/${atividade.disciplinaId}/atividades`
                                );
                              }}
                              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                                atividade.status === "pendente"
                                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                            >
                              <BookOpen className="h-4 w-4" />
                              Abrir
                            </button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
              )}
            </div>
          )}

          {activeTab === "resumos" && (
            <div className="grid gap-4">
              {mockResumos.length === 0 ? (
                <Card className="border border-gray-200">
                  <CardContent className="p-8 text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Nenhum resumo encontrado
                    </h3>
                    <p className="text-gray-600">
                      Não há resumos disponíveis no momento.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                mockResumos.map((resumo) => {
                  const disciplinaCor = getDisciplinaCor(resumo.disciplinaId);
                  const DisciplinaIcon = getDisciplinaIcon(resumo.disciplinaId);

                  return (
                    <Card
                      key={resumo.id}
                      className="border border-gray-200 hover:shadow-lg transition-all duration-200"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <div
                              className={`p-3 rounded-lg bg-gradient-to-br ${disciplinaCor.grad}`}
                            >
                              <DisciplinaIcon className="h-5 w-5 text-white" />
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span
                                  className={`text-sm font-medium ${disciplinaCor.text}`}
                                >
                                  {getDisciplinaNome(resumo.disciplinaId)}
                                </span>
                                {resumo.atividadeVinculada && (
                                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                                    Vinculado
                                  </span>
                                )}
                              </div>

                              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {resumo.titulo}
                              </h3>

                              <p className="text-sm text-gray-600 line-clamp-2">
                                {resumo.conteudo}
                              </p>

                              {resumo.atividadeVinculada && (
                                <p className="text-xs text-gray-500 mt-2">
                                  Vinculado à: {resumo.atividadeVinculada}
                                </p>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              router.push(
                                `/aluno/disciplinas/${resumo.disciplinaId}/resumos`
                              );
                            }}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all duration-200 flex items-center gap-2"
                          >
                            <FileText className="h-4 w-4" />
                            Ver
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          )}

          {activeTab === "videoaulas" && (
            <div className="grid gap-4">
              {mockVideoaulas.length === 0 ? (
                <Card className="border border-gray-200">
                  <CardContent className="p-8 text-center">
                    <Play className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Nenhuma videoaula encontrada
                    </h3>
                    <p className="text-gray-600">
                      Não há videoaulas disponíveis no momento.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                mockVideoaulas.map((video) => {
                  const disciplinaCor = getDisciplinaCor(video.disciplinaId);
                  const DisciplinaIcon = getDisciplinaIcon(video.disciplinaId);

                  return (
                    <Card
                      key={video.id}
                      className="border border-gray-200 hover:shadow-lg transition-all duration-200"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <div
                              className={`p-3 rounded-lg bg-gradient-to-br ${disciplinaCor.grad}`}
                            >
                              <DisciplinaIcon className="h-5 w-5 text-white" />
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span
                                  className={`text-sm font-medium ${disciplinaCor.text}`}
                                >
                                  {getDisciplinaNome(video.disciplinaId)}
                                </span>
                                <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                                  Vídeo
                                </span>
                              </div>

                              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {video.titulo}
                              </h3>

                              <p className="text-sm text-gray-600">
                                {video.descricao}
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              router.push(
                                `/aluno/disciplinas/${video.disciplinaId}/videoaulas`
                              );
                            }}
                            className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center gap-2"
                          >
                            <Play className="h-4 w-4" />
                            Assistir
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </AlunoLayout>
  );
}
