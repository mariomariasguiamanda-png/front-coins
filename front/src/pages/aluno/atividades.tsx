"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { api } from "@/lib/api";
import { getAlunoLayout } from "@/components/layout/AlunoLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import type { NextPageWithLayout } from "@/pages/_app";

import {
  Activity,
  Play,
  FileText,
  Award,
  Clock,
  CheckCircle,
} from "lucide-react";

import {
  FaCalculator,
  FaFlask,
  FaGlobeAmericas,
  FaBook,
  FaAtom,
  FaPalette,
} from "react-icons/fa";

type IconComponent = (props: { className?: string }) => JSX.Element;

// ── Constantes fora do componente (não recriadas a cada render) ──────────────
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
  { grad: string; text: string; bgLight: string; border: string }
> = {
  mat: { grad: "from-blue-500 to-blue-600", text: "text-blue-600", bgLight: "bg-blue-50", border: "border-blue-200" },
  port: { grad: "from-purple-500 to-purple-600", text: "text-purple-600", bgLight: "bg-purple-50", border: "border-purple-200" },
  hist: { grad: "from-amber-500 to-amber-600", text: "text-amber-600", bgLight: "bg-amber-50", border: "border-amber-200" },
  geo: { grad: "from-teal-500 to-teal-600", text: "text-teal-600", bgLight: "bg-teal-50", border: "border-teal-200" },
  bio: { grad: "from-green-500 to-green-600", text: "text-green-600", bgLight: "bg-green-50", border: "border-green-200" },
  fis: { grad: "from-indigo-500 to-indigo-600", text: "text-indigo-600", bgLight: "bg-indigo-50", border: "border-indigo-200" },
};

// Status de conclusão como Sets para lookup O(1) em vez de Array.includes O(n)
// (valores reais da API: atividades pendente/entregue/corrigida, resumos pendente/lido,
// videoaulas pendente/assistida - "assistida" corrige um bug do front antigo que só
// reconhecia "assistido", nunca batendo com o valor real gravado no banco)
const STATUS_CONCLUIDO_ATV = new Set(["concluida", "concluido", "corrigido", "corrigida", "entregue", "enviado"]);
const STATUS_CONCLUIDO_RES = new Set(["lido", "concluido", "concluida"]);
const STATUS_CONCLUIDO_VID = new Set(["assistido", "assistida", "concluido", "concluida"]);

// Resolve cor e ícone pelo nome da disciplina (fora do componente, puro)
function resolverCorByNome(nome: string | undefined) {
  if (!nome) return coresByDisciplina.mat;
  const n = nome.toLowerCase();
  if (n.includes("mat")) return coresByDisciplina.mat;
  if (n.includes("port")) return coresByDisciplina.port;
  if (n.includes("hist")) return coresByDisciplina.hist;
  if (n.includes("geo")) return coresByDisciplina.geo;
  if (n.includes("bio")) return coresByDisciplina.bio;
  if (n.includes("fis")) return coresByDisciplina.fis;
  return coresByDisciplina.mat;
}

function resolverIconByNome(nome: string | undefined): IconComponent {
  if (!nome) return iconByDisciplina.mat;
  const n = nome.toLowerCase();
  if (n.includes("mat")) return iconByDisciplina.mat;
  if (n.includes("port")) return iconByDisciplina.port;
  if (n.includes("hist")) return iconByDisciplina.hist;
  if (n.includes("geo")) return iconByDisciplina.geo;
  if (n.includes("bio")) return iconByDisciplina.bio;
  if (n.includes("fis")) return iconByDisciplina.fis;
  return iconByDisciplina.mat;
}

function formatarPrazo(prazo: string | null) {
  if (!prazo) return { texto: "Sem prazo", cor: "text-gray-500", bgCor: "bg-gray-50" };
  const data = new Date(prazo);
  const hoje = new Date();
  const diffDays = Math.ceil((data.getTime() - hoje.getTime()) / 86400000);
  if (diffDays < 0) return { texto: "Atrasado", cor: "text-red-600", bgCor: "bg-red-50" };
  if (diffDays === 0) return { texto: "Hoje", cor: "text-orange-600", bgCor: "bg-orange-50" };
  if (diffDays === 1) return { texto: "Amanhã", cor: "text-yellow-600", bgCor: "bg-yellow-50" };
  return { texto: `${diffDays} dias`, cor: "text-green-600", bgCor: "bg-green-50" };
}

// ─────────────────────────────────────────────────────────────────────────────

const AtividadesPage: NextPageWithLayout = () => {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"atividades" | "resumos" | "videoaulas">("atividades");
  const [filtroStatus, setFiltroStatus] = useState<"todos" | "pendente" | "concluido">("todos");
  const [filtroDisciplina, setFiltroDisciplina] = useState("todas");

  const [atividades, setAtividades] = useState<any[]>([]);
  const [resumos, setResumos] = useState<any[]>([]);
  const [videoaulas, setVideoaulas] = useState<any[]>([]);
  const [disciplinas, setDisciplinas] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  // ── Mapa id_disciplina → nome (O(1) lookup no render) ─────────────────────
  const disciplinaMapaNome = useMemo<Record<number, string>>(() => {
    const map: Record<number, string> = {};
    disciplinas.forEach((d) => { map[d.id_disciplina] = d.nome; });
    return map;
  }, [disciplinas]);

  // ── 1️⃣ Buscar dados do aluno logado - a API resolve id_aluno sozinha a partir do JWT ─
  useEffect(() => {
    const init = async () => {
      try {
        const [disc, atv, res, vid] = await Promise.all([
          api.get("/aluno/disciplinas"),
          api.get("/aluno/atividades"),
          api.get("/aluno/resumos"),
          api.get("/aluno/videoaulas"),
        ]);

        setDisciplinas(disc || []);
        setAtividades(atv || []);
        setResumos(res || []);
        setVideoaulas(vid || []);
      } catch (err) {
        console.error("Erro ao carregar painel de desempenho:", err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []); // ← roda só uma vez; filtros são aplicados no client

  // ── Estatísticas (memo) ───────────────────────────────────────────────────
  const estatisticas = useMemo(() => {
    const concluidas = atividades.filter((a) =>
      STATUS_CONCLUIDO_ATV.has(a.status)
    ).length;

    const resumosLidos = resumos.filter((r) => r.status === "lido").length;

    return {
      atividadesConcluidas: concluidas,
      atividadesPendentes: atividades.length - concluidas,
      resumosLidos,
      resumosTotal: resumos.length,
      totalVideoaulas: videoaulas.length,
      totalAtividades: atividades.length,
    };
  }, [atividades, resumos, videoaulas]);

  // ── Listas filtradas (memo, só recalcula quando deps mudam) ──────────────
  const atividadesFiltradas = useMemo(() => {
    return atividades.filter((a) => {
      const statusAtual = a.status ?? "pendente";
      const isConcluido = STATUS_CONCLUIDO_ATV.has(statusAtual);
      const sMatch =
        filtroStatus === "todos" ||
        (filtroStatus === "concluido" ? isConcluido : !isConcluido);
      const dMatch =
        filtroDisciplina === "todas" ||
        Number(a.id_disciplina) === Number(filtroDisciplina);
      return sMatch && dMatch;
    });
  }, [atividades, filtroStatus, filtroDisciplina]);

  const resumosFiltrados = useMemo(() => {
    return resumos.filter((r) => {
      const statusResumo = r.status ?? "pendente";
      const isConcluido = STATUS_CONCLUIDO_RES.has(statusResumo);
      const sMatch =
        filtroStatus === "todos" ||
        (filtroStatus === "concluido" ? isConcluido : !isConcluido);
      const dMatch =
        filtroDisciplina === "todas" ||
        r.id_disciplina?.toString() === filtroDisciplina.toString();
      return sMatch && dMatch;
    });
  }, [resumos, filtroStatus, filtroDisciplina]);

  const videoaulasFiltradas = useMemo(() => {
    return videoaulas.filter((v) => {
      const statusVideo = v.status ?? "pendente";
      const isConcluido = STATUS_CONCLUIDO_VID.has(statusVideo);
      const sMatch =
        filtroStatus === "todos" ||
        (filtroStatus === "concluido" ? isConcluido : !isConcluido);
      const dMatch =
        filtroDisciplina === "todas" ||
        v.id_disciplina?.toString() === filtroDisciplina.toString();
      return sMatch && dMatch;
    });
  }, [videoaulas, filtroStatus, filtroDisciplina]);

  const limparFiltros = useCallback(() => {
    setFiltroStatus("todos");
    setFiltroDisciplina("todas");
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-xl" />
          <Skeleton className="h-7 w-56" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2].map((i) => (
            <Card key={i} className="border border-gray-200">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-6 w-10" />
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Skeleton className="h-16 w-full rounded-xl" />
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border border-gray-200">
              <CardContent className="p-6 flex items-start gap-4">
                <Skeleton className="h-11 w-11 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-9 w-20 rounded-lg" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Painel de Desempenho</h1>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border border-green-200 bg-green-50 hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Concluídas</p>
                <p className="text-2xl font-bold text-green-700">
                  {estatisticas.atividadesConcluidas}
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
                  {estatisticas.resumosLidos}{" "}
                  <span className="text-sm font-normal text-blue-600">
                    de {estatisticas.resumosTotal}
                  </span>
                </p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Status:</label>
                <select
                  value={filtroStatus}
                  onChange={(e) => setFiltroStatus(e.target.value as any)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white"
                >
                  <option value="todos">Todos</option>
                  <option value="pendente">Pendente</option>
                  <option value="concluido">Concluído</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Disciplina:</label>
                <select
                  value={filtroDisciplina}
                  onChange={(e) => setFiltroDisciplina(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white"
                >
                  <option value="todas">Todas</option>
                  {disciplinas.map((d) => (
                    <option key={d.id_disciplina} value={d.id_disciplina}>
                      {d.nome}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={limparFiltros}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 underline"
              >
                Limpar filtros
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Abas */}
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

          {/* ABA ATIVIDADES */}
          {activeTab === "atividades" && (
            <div className="grid gap-4">
              {atividadesFiltradas.length === 0 ? (
                <p className="text-center text-gray-500 py-10">
                  Nenhuma atividade encontrada com os filtros selecionados
                </p>
              ) : (
                atividadesFiltradas.map((a) => {
                  const discNome = disciplinaMapaNome[a.id_disciplina] ?? a.disciplinas?.nome;
                  const discCor = resolverCorByNome(discNome);
                  const DiscIcon = resolverIconByNome(discNome);
                  const prazoInfo = formatarPrazo(a.data_vencimento);
                  const status = a.status ?? "pendente";
                  const isConcluido = STATUS_CONCLUIDO_ATV.has(status);

                  return (
                    <Card
                      key={a.id_atividade}
                      className="border border-gray-200 hover:shadow-lg transition-all duration-200"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <div className={`p-3 rounded-lg bg-gradient-to-br ${discCor.grad}`}>
                              <DiscIcon className="h-5 w-5 text-white" />
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`text-sm font-medium ${discCor.text}`}>
                                  {discNome}
                                </span>
                                <span
                                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    isConcluido
                                      ? "bg-green-100 text-green-700"
                                      : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {isConcluido ? status : "Pendente"}
                                </span>
                              </div>

                              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {a.titulo}
                              </h3>

                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span className={prazoInfo.cor}>{prazoInfo.texto}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Award className="h-4 w-4 text-amber-500" />
                                  <span>{a.recompensa_moedas} moedas</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => router.push(`/aluno/atividades/${a.id_atividade}`)}
                            className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-all"
                          >
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

          {/* ABA RESUMOS */}
          {activeTab === "resumos" && (
            <div className="grid gap-4">
              {resumosFiltrados.length === 0 ? (
                <p className="text-center text-gray-500 py-10">
                  Nenhum resumo encontrado com os filtros selecionados
                </p>
              ) : (
                resumosFiltrados.map((r) => {
                  const discNome = disciplinaMapaNome[r.id_disciplina] ?? r.disciplinas?.nome;
                  const discCor = resolverCorByNome(discNome);
                  const DiscIcon = resolverIconByNome(discNome);
                  const isLido = r.status === "lido";

                  return (
                    <Card
                      key={r.id_resumo}
                      className="border border-gray-200 hover:shadow-lg transition"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-lg bg-gradient-to-br ${discCor.grad}`}>
                            <DiscIcon className="h-5 w-5 text-white" />
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className={`text-sm font-medium ${discCor.text}`}>
                                {r.disciplinas?.nome ?? discNome}
                              </p>
                              <span
                                className={`px-2 py-0.5 text-[11px] font-medium rounded-full ${
                                  isLido
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-amber-50 text-amber-700"
                                }`}
                              >
                                {isLido ? "Lido" : "Pendente"}
                              </span>
                            </div>

                            <h3 className="text-lg font-semibold">{r.titulo}</h3>
                            <p className="text-sm text-gray-600 line-clamp-2">{r.conteudo}</p>
                          </div>

                          <button
                            onClick={() => router.push(`/aluno/resumos/${r.id_resumo}`)}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                          >
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

          {/* ABA VIDEOAULAS */}
          {activeTab === "videoaulas" && (
            <div className="grid gap-4">
              {videoaulasFiltradas.length === 0 ? (
                <p className="text-center text-gray-500 py-10">
                  Nenhuma videoaula encontrada com os filtros selecionados
                </p>
              ) : (
                videoaulasFiltradas.map((v) => {
                  const discNome =
                    disciplinaMapaNome[v.id_disciplina] ?? v.disciplinas?.nome;
                  const discCor = resolverCorByNome(discNome);
                  const DiscIcon = resolverIconByNome(discNome);
                  const statusVideo = v.status ?? "pendente";
                  const isAssistida = STATUS_CONCLUIDO_VID.has(statusVideo);

                  return (
                    <Card
                      key={v.id_videoaula}
                      className="border border-gray-200 hover:shadow-lg transition"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-lg bg-gradient-to-br ${discCor.grad}`}>
                            <DiscIcon className="h-5 w-5 text-white" />
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className={`text-sm font-medium ${discCor.text}`}>
                                {discNome}
                              </p>
                              <span
                                className={`px-2 py-0.5 text-[11px] font-medium rounded-full ${
                                  isAssistida
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-amber-50 text-amber-700"
                                }`}
                              >
                                {isAssistida ? "Assistida" : "Pendente"}
                              </span>
                            </div>
                            <h3 className="text-lg font-semibold">{v.titulo}</h3>
                          </div>

                          <button
                            onClick={() =>
                              router.push(`/aluno/videoaulas/${v.id_videoaula}`)
                            }
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors ${
                              isAssistida
                                ? "bg-gray-400 hover:bg-gray-500"
                                : "bg-red-600 hover:bg-red-700"
                            }`}
                          >
                            {isAssistida && <CheckCircle className="h-4 w-4" />}
                            {isAssistida ? "Assistido" : "Assistir"}
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
  );
};

AtividadesPage.getLayout = getAlunoLayout;

export default AtividadesPage;
