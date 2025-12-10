"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";
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

  // Estados
  const [activeTab, setActiveTab] = useState<
    "atividades" | "resumos" | "videoaulas"
  >("atividades");

  const [filtroStatus, setFiltroStatus] = useState<
    "todos" | "pendente" | "enviado" | "concluido"
  >("todos");

  const [filtroDisciplina, setFiltroDisciplina] = useState("todas");

  const [atividades, setAtividades] = useState<any[]>([]);
  const [resumos, setResumos] = useState<any[]>([]);
  const [videoaulas, setVideoaulas] = useState<any[]>([]);
  const [disciplinas, setDisciplinas] = useState<any[]>([]);

  const [alunoId, setAlunoId] = useState<number | null>(null);
  const [usuarioId, setUsuarioId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // 1️⃣ Buscar usuário logado → aluno → disciplinas do aluno
  useEffect(() => {
    const carregarIdentificacao = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: usuario } = await supabase
        .from("usuarios")
        .select("id_usuario")
        .eq("auth_user_id", user.id)
        .maybeSingle();

      setUsuarioId(usuario?.id_usuario);

      const { data: aluno } = await supabase
        .from("alunos")
        .select("id_aluno")
        .eq("id_usuario", usuario?.id_usuario)
        .maybeSingle();

      setAlunoId(aluno?.id_aluno);
    };

    carregarIdentificacao();
  }, []);

  // 2️⃣ Buscar dados após saber o ID do aluno
  useEffect(() => {
    if (!alunoId) return;

    const carregarDados = async () => {
      setLoading(true);

      // 📌 disciplinas do aluno
      const { data: disc } = await supabase
        .from("alunos_disciplinas")
        .select(
          `
        id_disciplina,
        disciplinas (nome, id_disciplina)
      `
        )
        .eq("id_aluno", alunoId);

      setDisciplinas(disc || []);

      // 📌 atividades do aluno
      const { data: atv } = await supabase
        .from("progresso_atividades")
        .select(
          `
        id_progresso_atividade,
        status,
        nota,
        concluido_em,
        criado_em,
        atividades (
          id_atividade,
          titulo,
          descricao,
          recompensa_moedas,
          valido_ate,
          id_disciplina,
          disciplinas (nome)
        )
      `
        )
        .eq("id_aluno", alunoId);

      setAtividades(atv || []);

      // 📌 resumos do aluno
      const { data: rs } = await supabase
        .from("progresso_resumos")
        .select(
          `
        status,
        lido_em,
        resumos (
          id_resumo,
          titulo,
          conteudo,
          id_disciplina,
          disciplinas (nome)
        )
      `
        )
        .eq("id_aluno", alunoId);

      setResumos(rs || []);

      // 📌 videoaulas do aluno
      const { data: vids } = await supabase
        .from("progresso_videoaulas")
        .select(
          `
        status,
        percentual_assistido,
        videoaulas (
          id_videoaula,
          titulo,
          descricao,
          recompensa_moedas,
          id_disciplina,
          disciplinas (nome)
        )
      `
        )
        .eq("id_aluno", alunoId);

      setVideoaulas(vids || []);

      setLoading(false);
    };

    carregarDados();
  }, [alunoId]);

  // 3️⃣ Estatísticas superiores
  const estatisticas = useMemo(() => {
    const pendentes = atividades.filter((a) => a.status === "pendente").length;

    const enviadas = atividades.filter(
      (a) => a.status === "enviado" || a.status === "concluida"
    ).length;

    const moedasPendentes = atividades
      .filter((a) => a.status === "pendente")
      .reduce((s, a) => s + (a.atividades?.recompensa_moedas ?? 0), 0);

    return {
      atividadesPendentes: pendentes,
      atividadesEnviadas: enviadas,
      totalResumos: resumos.length,
      totalVideoaulas: videoaulas.length,
      moedasPendentes,
      totalAtividades: atividades.length,
    };
  }, [atividades, resumos, videoaulas]);

  const formatarPrazo = (prazo: string | null) => {
    if (!prazo)
      return { texto: "Sem prazo", cor: "text-gray-500", bgCor: "bg-gray-50" };

    const data = new Date(prazo);
    const hoje = new Date();
    const diffTime = data.getTime() - hoje.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0)
      return { texto: "Atrasado", cor: "text-red-600", bgCor: "bg-red-50" };
    if (diffDays === 0)
      return { texto: "Hoje", cor: "text-orange-600", bgCor: "bg-orange-50" };
    if (diffDays === 1)
      return { texto: "Amanhã", cor: "text-yellow-600", bgCor: "bg-yellow-50" };

    return {
      texto: `${diffDays} dias`,
      cor: "text-green-600",
      bgCor: "bg-green-50",
    };
  };

  const getDisciplinaCor = (disciplinaId: number) => {
    const disciplina = disciplinas.find(
      (d) => d.disciplinas.id_disciplina === disciplinaId
    );

    const nome = disciplina?.disciplinas?.nome?.toLowerCase();

    if (!nome) return coresByDisciplina.mat;

    if (nome.includes("mat")) return coresByDisciplina.mat;
    if (nome.includes("port")) return coresByDisciplina.port;
    if (nome.includes("hist")) return coresByDisciplina.hist;
    if (nome.includes("geo")) return coresByDisciplina.geo;
    if (nome.includes("bio")) return coresByDisciplina.bio;
    if (nome.includes("fis")) return coresByDisciplina.fis;

    return coresByDisciplina.mat;
  };

  const getDisciplinaIcon = (disciplinaId: number) => {
    const disciplina = disciplinas.find(
      (d) => d.disciplinas.id_disciplina === disciplinaId
    );

    const nome = disciplina?.disciplinas?.nome?.toLowerCase();

    if (!nome) return iconByDisciplina.mat;

    if (nome.includes("mat")) return iconByDisciplina.mat;
    if (nome.includes("port")) return iconByDisciplina.port;
    if (nome.includes("hist")) return iconByDisciplina.hist;
    if (nome.includes("geo")) return iconByDisciplina.geo;
    if (nome.includes("bio")) return iconByDisciplina.bio;
    if (nome.includes("fis")) return iconByDisciplina.fis;

    return iconByDisciplina.mat;
  };

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
          {/* <Card className="border border-red-200 bg-red-50 hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Pendentes</p>
                <p className="text-2xl font-bold text-red-700">
                  {estatisticas.atividadesPendentes}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </CardContent>
          </Card> */}

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
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white"
                >
                  <option value="todos">Todos</option>
                  <option value="pendente">Pendente</option>
                  <option value="enviado">Enviado</option>
                  <option value="concluido">Concluído</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Disciplina:
                </label>
                <select
                  value={filtroDisciplina}
                  onChange={(e) => setFiltroDisciplina(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white"
                >
                  <option value="todas">Todas</option>

                  {disciplinas.map((d) => (
                    <option
                      key={d.disciplinas.id_disciplina}
                      value={d.disciplinas.id_disciplina}
                    >
                      {d.disciplinas.nome}
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
              {atividades
                .filter((a) => {
                  const sMatch =
                    filtroStatus === "todos" ||
                    a.status === filtroStatus ||
                    (filtroStatus === "enviado" &&
                      (a.status === "enviado" || a.status === "concluida"));

                  const dMatch =
                    filtroDisciplina === "todas" ||
                    a.atividades.id_disciplina.toString() ===
                      filtroDisciplina.toString();

                  return sMatch && dMatch;
                })
                .map((a) => {
                  const discId = a.atividades.id_disciplina;
                  const discCor = getDisciplinaCor(discId);
                  const DiscIcon = getDisciplinaIcon(discId);

                  const prazoInfo = formatarPrazo(a.atividades.valido_ate);

                  return (
                    <Card
                      key={a.id_progresso_atividade}
                      className="border border-gray-200 hover:shadow-lg transition-all duration-200"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            {/* Ícone */}
                            <div
                              className={`p-3 rounded-lg bg-gradient-to-br ${discCor.grad}`}
                            >
                              <DiscIcon className="h-5 w-5 text-white" />
                            </div>

                            {/* Conteúdo */}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span
                                  className={`text-sm font-medium ${discCor.text}`}
                                >
                                  {a.atividades.disciplinas.nome}
                                </span>

                                {/* Status */}
                                <span
                                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    a.status === "pendente"
                                      ? "bg-red-100 text-red-700"
                                      : a.status === "enviado"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-blue-100 text-blue-700"
                                  }`}
                                >
                                  {a.status}
                                </span>
                              </div>

                              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {a.atividades.titulo}
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
                                  <span>
                                    {a.atividades.recompensa_moedas} moedas
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() =>
                              router.push(`/aluno/disciplinas/${discId}`)
                            }
                            className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-all"
                          >
                            Abrir
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          )}

          {/* ABA RESUMOS */}
          {activeTab === "resumos" && (
            <div className="grid gap-4">
              {resumos.length === 0 && (
                <p className="text-center text-gray-500 py-10">
                  Nenhum resumo disponível
                </p>
              )}

              {resumos.map((r) => {
                const discId = r.resumos.id_disciplina;
                const DiscIcon = getDisciplinaIcon(discId);
                const discCor = getDisciplinaCor(discId);

                return (
                  <Card
                    key={r.resumos.id_resumo}
                    className="border border-gray-200 hover:shadow-lg transition"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div
                          className={`p-3 rounded-lg bg-gradient-to-br ${discCor.grad}`}
                        >
                          <DiscIcon className="h-5 w-5 text-white" />
                        </div>

                        <div className="flex-1">
                          <p className={`text-sm font-medium ${discCor.text}`}>
                            {r.resumos.disciplinas.nome}
                          </p>

                          <h3 className="text-lg font-semibold">
                            {r.resumos.titulo}
                          </h3>

                          <p className="text-sm text-gray-600 line-clamp-2">
                            {r.resumos.conteudo}
                          </p>
                        </div>

                        <button
                          onClick={() =>
                            router.push(`/aluno/disciplinas/${discId}/resumos`)
                          }
                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                        >
                          Ver
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* ABA VIDEOAULAS */}
          {activeTab === "videoaulas" && (
            <div className="grid gap-4">
              {videoaulas.length === 0 && (
                <p className="text-center text-gray-500 py-10">
                  Nenhuma videoaula disponível
                </p>
              )}

              {videoaulas.map((v) => {
                const discId = v.videoaulas.id_disciplina;
                const DiscIcon = getDisciplinaIcon(discId);
                const discCor = getDisciplinaCor(discId);

                return (
                  <Card
                    key={v.videoaulas.id_videoaula}
                    className="border border-gray-200 hover:shadow-lg transition"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div
                          className={`p-3 rounded-lg bg-gradient-to-br ${discCor.grad}`}
                        >
                          <DiscIcon className="h-5 w-5 text-white" />
                        </div>

                        <div className="flex-1">
                          <p className={`text-sm font-medium ${discCor.text}`}>
                            {v.videoaulas.disciplinas.nome}
                          </p>

                          <h3 className="text-lg font-semibold">
                            {v.videoaulas.titulo}
                          </h3>

                          <p className="text-sm text-gray-600 line-clamp-2">
                            {v.videoaulas.descricao}
                          </p>
                        </div>

                        <button
                          onClick={() =>
                            router.push(
                              `/aluno/disciplinas/${discId}/videoaulas`
                            )
                          }
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white"
                        >
                          Assistir
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AlunoLayout>
  );
}
