"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";
import AlunoLayout from "@/components/layout/AlunoLayout";
import { Card, CardContent } from "@/components/ui/Card";

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
const STATUS_CONCLUIDO_ATV = new Set(["concluida", "concluido", "corrigido", "entregue", "enviado"]);
const STATUS_CONCLUIDO_RES = new Set(["lido", "concluido", "concluida"]);
const STATUS_CONCLUIDO_VID = new Set(["assistido", "concluido", "concluida"]);

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

export default function AtividadesPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"atividades" | "resumos" | "videoaulas">("atividades");
  const [filtroStatus, setFiltroStatus] = useState<"todos" | "pendente" | "concluido">("todos");
  const [filtroDisciplina, setFiltroDisciplina] = useState("todas");

  const [atividades, setAtividades] = useState<any[]>([]);
  const [resumos, setResumos] = useState<any[]>([]);
  const [videoaulas, setVideoaulas] = useState<any[]>([]);
  const [disciplinas, setDisciplinas] = useState<any[]>([]);

  const [alunoId, setAlunoId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // ── Mapa id_disciplina → nome (O(1) lookup no render) ─────────────────────
  const disciplinaMapaNome = useMemo<Record<number, string>>(() => {
    const map: Record<number, string> = {};
    disciplinas.forEach((d) => { map[d.id_disciplina] = d.disciplina_nome; });
    return map;
  }, [disciplinas]);

  // ── 1️⃣ Buscar usuário → aluno → dados iniciais de uma só vez ────────────
  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: usuario } = await supabase
        .from("usuarios")
        .select("id_usuario")
        .eq("auth_user_id", user.id)
        .maybeSingle();

      if (!usuario?.id_usuario) return;

      const { data: aluno } = await supabase
        .from("alunos")
        .select("id_aluno")
        .eq("id_usuario", usuario.id_usuario)
        .maybeSingle();

      if (!aluno?.id_aluno) return;

      const id = aluno.id_aluno;
      setAlunoId(id);

      // Busca disciplinas + dados do painel em paralelo (economiza 2 round-trips)
      const [discResult, atvResult, resResult, vidResult] = await Promise.all([
        supabase
          .from("vw_disciplinas_unicas_aluno")
          .select("id_disciplina, disciplina_nome")
          .eq("id_aluno", id),

        supabase
          .from("vw_painel_atividades_geral")
          .select("*")
          .or(`id_aluno.eq.${id},id_aluno.is.null`),

        supabase
          .from("resumos")
          .select("*, disciplinas(nome), progresso_resumos!left(status, lido_em)")
          .eq("progresso_resumos.id_aluno", id),

        supabase
          .from("vw_painel_videoaulas_geral")
          .select("*")
          .or(`id_aluno.eq.${id},id_aluno.is.null`),
      ]);

      setDisciplinas(discResult.data || []);

      // Deduplicar atividades com Map (O(n)) em vez de findIndex (O(n²))
      const atvMap = new Map<number, any>();
      for (const curr of atvResult.data ?? []) {
        const existing = atvMap.get(curr.id_atividade);
        if (!existing || curr.id_aluno) {
          atvMap.set(curr.id_atividade, curr);
        }
      }
      setAtividades(Array.from(atvMap.values()));
      setResumos(resResult.data || []);
      setVideoaulas(vidResult.data || []);
      setLoading(false);
    };

    init();
  }, []); // ← roda só uma vez; filtros são aplicados no client

  // ── Estatísticas (memo) ───────────────────────────────────────────────────
  const estatisticas = useMemo(() => {
    const concluidas = atividades.filter((a) =>
      STATUS_CONCLUIDO_ATV.has(a.status_progresso ?? a.status)
    ).length;

    const resumosLidos = resumos.filter(
      (r) => r.progresso_resumos?.[0]?.status === "lido"
    ).length;

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
      const statusAtual = a.status_progresso ?? a.status ?? "pendente";
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
      const statusResumo =
        r.progresso_resumos?.length > 0
          ? r.progresso_resumos[0]?.status
          : "pendente";
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
      const statusVideo = v.status_progresso ?? "pendente";
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
      <AlunoLayout>
        <div className="text-center py-20">
          <p className="text-lg text-gray-600">Carregando atividades...</p>
        </div>
      </AlunoLayout>
    );
  }

  return (
    <AlunoLayout>
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
                      {d.disciplina_nome}
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
                  const discNome = disciplinaMapaNome[a.id_disciplina];
                  const discCor = resolverCorByNome(discNome ?? a.disciplina_nome);
                  const DiscIcon = resolverIconByNome(discNome ?? a.disciplina_nome);
                  const prazoInfo = formatarPrazo(a.valido_ate);
                  const status = a.status_progresso ?? "pendente";
                  const isConcluido = STATUS_CONCLUIDO_ATV.has(status);

                  return (
                    <Card
                      key={a.id_progresso_atividade ?? a.id_atividade}
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
                                  {a.disciplina_nome}
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
                                {a.atividade_titulo}
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
                            onClick={() => router.push(`/aluno/disciplinas/${a.id_disciplina}`)}
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
                  const statusResumo =
                    r.progresso_resumos?.length > 0
                      ? r.progresso_resumos[0]?.status
                      : null;
                  const isLido = statusResumo === "lido";

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
                            onClick={() => router.push(`/aluno/disciplinas/${r.id_disciplina}/resumos`)}
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
                    disciplinaMapaNome[v.id_disciplina] ??
                    v.videoaulas?.disciplinas?.nome;
                  const discCor = resolverCorByNome(discNome);
                  const DiscIcon = resolverIconByNome(discNome);

                  return (
                    <Card
                      key={v.videoaulas?.id_videoaula ?? v.id_videoaula}
                      className="border border-gray-200 hover:shadow-lg transition"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-lg bg-gradient-to-br ${discCor.grad}`}>
                            <DiscIcon className="h-5 w-5 text-white" />
                          </div>

                          <div className="flex-1">
                            <p className={`text-sm font-medium ${discCor.text}`}>
                              {v.videoaulas?.disciplinas?.nome ?? discNome}
                            </p>
                            <h3 className="text-lg font-semibold">{v.videoaulas?.titulo}</h3>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {v.videoaulas?.descricao}
                            </p>
                          </div>

                          <button
                            onClick={() =>
                              router.push(`/aluno/disciplinas/${v.id_disciplina}/videoaulas`)
                            }
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white"
                          >
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
