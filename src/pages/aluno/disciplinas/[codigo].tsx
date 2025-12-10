"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";
import AlunoLayout from "@/components/layout/AlunoLayout";
import Modal from "@/components/ui/Modal";
import {
  CheckCircle2,
  Clock,
  FileText,
  PlayCircle,
  X,
  ArrowLeft,
  Coins,
} from "lucide-react";

// Paleta de cores por disciplina (ajuste os códigos conforme seu BD)
const DISCIPLINA_CORES: Record<
  string,
  {
    titleText: string;
    badgeBg: string;
    badgeText: string;
    gradFrom: string;
    gradTo: string;
  }
> = {
  // Matemática – azul
  MAT: {
    titleText: "text-blue-700",
    badgeBg: "bg-blue-50",
    badgeText: "text-blue-700",
    gradFrom: "from-blue-500",
    gradTo: "to-blue-400",
  },

  // História – amber
  HIST: {
    titleText: "text-amber-700",
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-700",
    gradFrom: "from-amber-500",
    gradTo: "to-amber-600",
  },

  // Biologia – verde
  BIO: {
    titleText: "text-green-700",
    badgeBg: "bg-green-50",
    badgeText: "text-green-700",
    gradFrom: "from-green-500",
    gradTo: "to-green-400",
  },

  // Física – roxo
  FIS: {
    titleText: "text-purple-700",
    badgeBg: "bg-purple-50",
    badgeText: "text-purple-700",
    gradFrom: "from-purple-500",
    gradTo: "to-purple-400",
  },

  // Geografia – verde/água (turquesa)
  GEO: {
    titleText: "text-emerald-700",
    badgeBg: "bg-emerald-50",
    badgeText: "text-emerald-700",
    gradFrom: "from-emerald-500",
    gradTo: "to-emerald-400",
  },

  // Artes – rosa
  ART: {
    titleText: "text-pink-700",
    badgeBg: "bg-pink-50",
    badgeText: "text-pink-700",
    gradFrom: "from-pink-500",
    gradTo: "to-pink-400",
  },

  // Química – laranja/vermelho
  QUI: {
    titleText: "text-orange-700",
    badgeBg: "bg-orange-50",
    badgeText: "text-orange-700",
    gradFrom: "from-orange-500",
    gradTo: "to-red-500",
  },

  // fallback padrão (mantenho roxo, igual ao texto de progresso da UI)
  DEFAULT: {
    titleText: "text-purple-700",
    badgeBg: "bg-purple-50",
    badgeText: "text-purple-700",
    gradFrom: "from-purple-500",
    gradTo: "to-purple-400",
  },
};

type ModalTipo = "resumos" | "atividades" | "videoaulas" | null;
type ModalFiltro = "todos" | "pendentes" | "concluidos";

const ITEMS_PER_PAGE = 6;

const DisciplinaDetalhePage = () => {
  const router = useRouter();
  const { codigo, tema } = router.query;

  const [disciplina, setDisciplina] = useState<any | null>(null);
  const [atividades, setAtividades] = useState<any[]>([]);
  const [resumos, setResumos] = useState<any[]>([]);
  const [videoaulas, setVideoaulas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Progresso real
  const [alunoId, setAlunoId] = useState<number | null>(null);
  const [atividadesConcluidas, setAtividadesConcluidas] = useState(0);
  const [videosAssistidos, setVideosAssistidos] = useState(0);
  const [resumosLidos, setResumosLidos] = useState(0);
  // Moedas: meta total (atividades + videoaulas) e conquistadas (concluídas/assistidas)
  const [metaMoedas, setMetaMoedas] = useState<number>(0);
  const [moedasConquistadas, setMoedasConquistadas] = useState<number>(0);

  // Mapas de progresso para usar no modal (status por item)
  const [mapProgressoAtividades, setMapProgressoAtividades] = useState<
    Record<number, string>
  >({});
  const [mapProgressoResumos, setMapProgressoResumos] = useState<
    Record<number, string>
  >({});
  const [mapProgressoVideoaulas, setMapProgressoVideoaulas] = useState<
    Record<number, { status: string | null; percentual: number | null }>
  >({});

  // Modal "Ver todos..."
  const [modalTipo, setModalTipo] = useState<ModalTipo>(null);
  const [modalFiltro, setModalFiltro] = useState<ModalFiltro>("todos");
  const [modalPage, setModalPage] = useState<number>(1);

  const openModal = (tipo: ModalTipo) => {
    setModalTipo(tipo);
    setModalFiltro("todos");
    setModalPage(1);
  };

  const closeModal = () => {
    setModalTipo(null);
  };

  // Busca o id_aluno a partir do usuário logado (Supabase Auth -> usuarios -> alunos)
  const fetchAlunoId = async (): Promise<number | null> => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("Erro ao obter usuário autenticado:", userError);
        return null;
      }

      if (!user || !user.email) {
        console.warn("Nenhum usuário autenticado ou email ausente.");
        return null;
      }

      // 1) Busca o usuário na tabela `usuarios` pelo email
      const { data: usuario, error: usuarioError } = await supabase
        .from("usuarios")
        .select("id_usuario")
        .eq("email", user.email)
        .maybeSingle();

      if (usuarioError) {
        console.error("Erro ao buscar usuario em `usuarios`:", usuarioError);
        return null;
      }

      if (!usuario) {
        console.warn(
          "Nenhum registro encontrado em `usuarios` para esse email."
        );
        return null;
      }

      // 2) Busca o aluno correspondente em `alunos`
      const { data: aluno, error: alunoError } = await supabase
        .from("alunos")
        .select("id_aluno")
        .eq("id_usuario", usuario.id_usuario)
        .maybeSingle();

      if (alunoError) {
        console.error("Erro ao buscar aluno em `alunos`:", alunoError);
        return null;
      }

      if (!aluno) {
        console.warn("Nenhum aluno associado a esse usuário.");
        return null;
      }

      return aluno.id_aluno as number;
    } catch (err) {
      console.error("Erro inesperado ao obter id_aluno:", err);
      return null;
    }
  };

  // Carregar dados da disciplina + materiais + progresso
  const loadDisciplinaData = async () => {
    if (!codigo) return;

    try {
      setLoading(true);
      setError(null);

      // Acumuladores locais para cálculo de moedas
      let totalMoedasAtividades = 0;
      let moedasAtividadesConcluidas = 0;
      let totalMoedasVideos = 0;
      let moedasVideosAssistidos = 0;

      const codigoStr = String(codigo); // ex: "mat"

      // Garante que temos id_aluno em memória
      let alunoIdLocal = alunoId;
      if (!alunoIdLocal) {
        alunoIdLocal = await fetchAlunoId();
        if (alunoIdLocal) {
          setAlunoId(alunoIdLocal);
        }
      }

      // 1. Buscar disciplina (case-insensitive) pelo código ou pelo ID numérico
      let disciplinaData;
      let disciplinaError;

      const isNumeric = /^\d+$/.test(codigoStr);

      if (isNumeric) {
        const res = await supabase
          .from("disciplinas")
          .select("*")
          .eq("id_disciplina", Number(codigoStr))
          .maybeSingle();
        disciplinaData = res.data;
        disciplinaError = res.error;
      } else {
        const res = await supabase
          .from("disciplinas")
          .select("*")
          .ilike("codigo", codigoStr)
          .maybeSingle();
        disciplinaData = res.data;
        disciplinaError = res.error;
      }

      if (disciplinaError) {
        throw new Error(disciplinaError.message);
      }

      if (!disciplinaData) {
        throw new Error("Disciplina não encontrada.");
      }

      setDisciplina(disciplinaData);

      // 2. Atividades da disciplina
      const { data: atividadesData, error: atividadesError } = await supabase
        .from("atividades")
        .select("*")
        .eq("id_disciplina", disciplinaData.id_disciplina);

      if (atividadesError) {
        throw new Error(atividadesError.message);
      }

      setAtividades(atividadesData || []);

      // ===== META DE MOEDAS (soma das recompensas das atividades) =====
      totalMoedasAtividades = (atividadesData || []).reduce(
        (total: number, a: any) => total + (a.recompensa_moedas || 0),
        0
      );

      // 2.1 Progresso das atividades para o aluno logado
      if (alunoIdLocal && (atividadesData || []).length > 0) {
        const idsAtividades = (atividadesData || []).map(
          (a: any) => a.id_atividade
        );

        const { data: progressoData, error: progressoError } = await supabase
          .from("progresso_atividades")
          .select("id_atividade, status")
          .eq("id_aluno", alunoIdLocal)
          .in("id_atividade", idsAtividades);

        if (progressoError) {
          throw new Error(progressoError.message);
        }

        const concluidas = (progressoData || []).filter(
          (p: any) => p.status === "concluida"
        ).length;

        setAtividadesConcluidas(concluidas);

        const map: Record<number, string> = {};
        (progressoData || []).forEach((p: any) => {
          map[p.id_atividade] = p.status;
        });
        setMapProgressoAtividades(map);

        // moedas conquistadas em ATIVIDADES concluídas
        const idsAtividadesConcluidas = new Set(
          (progressoData || [])
            .filter((p: any) => p.status === "concluida")
            .map((p: any) => p.id_atividade)
        );

        moedasAtividadesConcluidas = (atividadesData || []).reduce(
          (total: number, a: any) =>
            idsAtividadesConcluidas.has(a.id_atividade)
              ? total + (a.recompensa_moedas || 0)
              : total,
          0
        );
      } else {
        setAtividadesConcluidas(0);
        setMapProgressoAtividades({});
      }

      // 3. Resumos
      const { data: resumosData, error: resumosError } = await supabase
        .from("resumos")
        .select("*")
        .eq("id_disciplina", disciplinaData.id_disciplina);

      if (resumosError) {
        throw new Error(resumosError.message);
      }

      setResumos(resumosData || []);

      // 3.1 Progresso de resumos para o aluno logado
      if (alunoIdLocal && (resumosData || []).length > 0) {
        const idsResumos = (resumosData || []).map((r: any) => r.id_resumo);

        const { data: progressoResumos, error: progressoResumosError } =
          await supabase
            .from("progresso_resumos")
            .select("id_resumo, status, lido_em")
            .eq("id_aluno", alunoIdLocal)
            .in("id_resumo", idsResumos);

        if (progressoResumosError) {
          throw new Error(progressoResumosError.message);
        }

        const lidos = (progressoResumos || []).filter(
          (pr: any) => pr.status === "lido"
        ).length;

        setResumosLidos(lidos);

        const map: Record<number, string> = {};
        (progressoResumos || []).forEach((p: any) => {
          map[p.id_resumo] = p.status;
        });
        setMapProgressoResumos(map);
      } else {
        setResumosLidos(0);
        setMapProgressoResumos({});
      }

      // 4. Videoaulas
      const { data: videoaulasData, error: videoaulasError } = await supabase
        .from("videoaulas")
        .select("*")
        .eq("id_disciplina", disciplinaData.id_disciplina);

      if (videoaulasError) {
        throw new Error(videoaulasError.message);
      }

      setVideoaulas(videoaulasData || []);

      // ===== META DE MOEDAS (acrescenta as recompensas de videoaulas) =====
      totalMoedasVideos = (videoaulasData || []).reduce(
        (total: number, v: any) => total + (v.recompensa_moedas || 0),
        0
      );
      setMetaMoedas(totalMoedasAtividades + totalMoedasVideos);

      // 4.1 Progresso das videoaulas para o aluno logado
      if (alunoIdLocal && (videoaulasData || []).length > 0) {
        const idsVideoaulas = (videoaulasData || []).map(
          (v: any) => v.id_videoaula
        );

        const { data: progressoVideos, error: progressoVideosError } =
          await supabase
            .from("progresso_videoaulas")
            .select("id_videoaula, status, percentual_assistido")
            .eq("id_aluno", alunoIdLocal)
            .in("id_videoaula", idsVideoaulas);

        if (progressoVideosError) {
          throw new Error(progressoVideosError.message);
        }

        const assistidos = (progressoVideos || []).filter((pv: any) => {
          const statusOk = pv.status === "assistida";
          const percentualOk =
            typeof pv.percentual_assistido === "number" &&
            pv.percentual_assistido >= 90;
          return statusOk || percentualOk;
        }).length;

        setVideosAssistidos(assistidos);

        const map: Record<
          number,
          { status: string | null; percentual: number | null }
        > = {};
        (progressoVideos || []).forEach((pv: any) => {
          map[pv.id_videoaula] = {
            status: pv.status,
            percentual: pv.percentual_assistido,
          };
        });
        setMapProgressoVideoaulas(map);

        // moedas conquistadas em VIDEOAULAS assistidas (status assistida OU >=90%)
        const idsVideosAssistidos = new Set(
          (progressoVideos || [])
            .filter((pv: any) => {
              const statusOk = pv.status === "assistida";
              const percentualOk =
                typeof pv.percentual_assistido === "number" &&
                pv.percentual_assistido >= 90;
              return statusOk || percentualOk;
            })
            .map((pv: any) => pv.id_videoaula)
        );

        moedasVideosAssistidos = (videoaulasData || []).reduce(
          (total: number, v: any) =>
            idsVideosAssistidos.has(v.id_videoaula)
              ? total + (v.recompensa_moedas || 0)
              : total,
          0
        );
      } else {
        setVideosAssistidos(0);
        setMapProgressoVideoaulas({});
      }

      // ===== MOEDAS CONQUISTADAS (atividades concluídas + videoaulas assistidas) =====
      setMoedasConquistadas(
        moedasAtividadesConcluidas + moedasVideosAssistidos
      );
      // console.log("Moedas conquistadas:", {
      //   moedasAtividadesConcluidas,
      //   moedasVideosAssistidos,
      //   total: moedasAtividadesConcluidas + moedasVideosAssistidos,
      // });
    } catch (err: any) {
      setError(err.message || "Erro ao carregar os dados da disciplina");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDisciplinaData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codigo]);

  if (loading) {
    return (
      <AlunoLayout>
        <div className="px-8 py-6 text-sm text-gray-600">
          Carregando dados da disciplina...
        </div>
      </AlunoLayout>
    );
  }

  if (error) {
    return (
      <AlunoLayout>
        <div className="px-8 py-6 text-sm text-red-500">Erro: {error}</div>
      </AlunoLayout>
    );
  }

  if (!disciplina) {
    return (
      <AlunoLayout>
        <div className="px-8 py-6 text-sm text-gray-600">
          Nenhuma disciplina encontrada.
        </div>
      </AlunoLayout>
    );
  }

  // ===== MÉTRICAS SIMPLES =====
  const totalAtividades = atividades.length;
  const totalResumos = resumos.length;
  const totalVideoaulas = videoaulas.length;

  const pctMoedas =
    metaMoedas > 0
      ? Math.min(100, Math.round((moedasConquistadas / metaMoedas) * 100))
      : 0;

  const pctAtividades =
    totalAtividades > 0
      ? Math.round((atividadesConcluidas / totalAtividades) * 100)
      : 0;

  const pctVideos =
    totalVideoaulas > 0
      ? Math.round((videosAssistidos / totalVideoaulas) * 100)
      : 0;

  const pctResumos =
    totalResumos > 0 ? Math.round((resumosLidos / totalResumos) * 100) : 0;

  // ===== COR DA DISCIPLINA =====
  const codigoDisciplina = String(disciplina.codigo || "").toUpperCase();
  const cor = DISCIPLINA_CORES[codigoDisciplina] || DISCIPLINA_CORES["DEFAULT"];

  // ====== Helpers para modal ======
  const getStatusInfo = (
    tipo: ModalTipo,
    item: any
  ): { label: string; isConcluido: boolean; className: string } => {
    if (!tipo) {
      return {
        label: "",
        isConcluido: false,
        className:
          "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-600",
      };
    }

    if (tipo === "atividades") {
      const status = mapProgressoAtividades[item.id_atividade] ?? "pendente";

      if (status === "concluida") {
        return {
          label: "Concluída",
          isConcluido: true,
          className:
            "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700",
        };
      }

      return {
        label: "Pendente",
        isConcluido: false,
        className:
          "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700",
      };
    }

    if (tipo === "resumos") {
      const status = mapProgressoResumos[item.id_resumo] ?? "pendente";

      if (status === "lido") {
        return {
          label: "Lido",
          isConcluido: true,
          className:
            "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700",
        };
      }

      return {
        label: "Pendente",
        isConcluido: false,
        className:
          "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700",
      };
    }

    // videoaulas
    const prog = mapProgressoVideoaulas[item.id_videoaula];
    const status = prog?.status ?? "pendente";
    const percentual = prog?.percentual ?? 0;

    const concluida =
      status === "assistida" ||
      (typeof percentual === "number" && percentual >= 90);

    if (concluida) {
      return {
        label: "Assistida",
        isConcluido: true,
        className:
          "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700",
      };
    }

    return {
      label: "Pendente",
      isConcluido: false,
      className:
        "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700",
    };
  };

  const getModalIcon = (tipo: ModalTipo, isConcluido: boolean) => {
    const baseClass = "h-5 w-5 flex-shrink-0";

    if (tipo === "atividades") {
      return isConcluido ? (
        <CheckCircle2 className={`${baseClass} text-emerald-600`} />
      ) : (
        <Clock className={`${baseClass} text-amber-500`} />
      );
    }

    if (tipo === "resumos") {
      return (
        <FileText
          className={`${baseClass} ${
            isConcluido ? "text-emerald-600" : "text-indigo-500"
          }`}
        />
      );
    }

    // videoaulas
    return (
      <PlayCircle
        className={`${baseClass} ${
          isConcluido ? "text-emerald-600" : "text-sky-500"
        }`}
      />
    );
  };

  // ====== Construção da lista para o modal (com filtro + paginação) ======
  const buildModalLista = () => {
    if (!modalTipo) return { itensPagina: [], total: 0 };

    let base: any[] = [];
    if (modalTipo === "atividades") base = atividades;
    if (modalTipo === "resumos") base = resumos;
    if (modalTipo === "videoaulas") base = videoaulas;

    const filtrados = base.filter((item) => {
      const statusInfo = getStatusInfo(modalTipo, item);

      if (modalFiltro === "pendentes") {
        return !statusInfo.isConcluido;
      }

      if (modalFiltro === "concluidos") {
        return statusInfo.isConcluido;
      }

      return true; // todos
    });

    const total = filtrados.length;

    const start = (modalPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;

    return {
      itensPagina: filtrados.slice(start, end),
      total,
    };
  };

  const { itensPagina: modalItensPagina, total: modalTotal } =
    buildModalLista();

  const modalTotalPages =
    modalTotal === 0 ? 1 : Math.ceil(modalTotal / ITEMS_PER_PAGE);

  const canPrev = modalPage > 1;
  const canNext = modalPage < modalTotalPages;

  const handlePrevPage = () => {
    if (canPrev) setModalPage((p) => p - 1);
  };

  const handleNextPage = () => {
    if (canNext) setModalPage((p) => p + 1);
  };

  // ====== Render ======
  return (
    <AlunoLayout>
      <div className="px-8 py-6 space-y-10">
        {/* Botão Voltar */}
        <div>
          <button
            type="button"
            onClick={() => router.push("/aluno/disciplinas")}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full px-3 py-1 transition"
            aria-label="Voltar para lista de disciplinas"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar</span>
          </button>
        </div>
        {/* HEADER + INFO RESUMIDA */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <h1
                className={`text-2xl font-semibold flex items-center gap-2 ${cor.titleText}`}
              >
                {disciplina.nome}
              </h1>
              {typeof tema === "string" && (
                <p className="text-sm text-gray-500 mt-1">
                  Tema: <span className="font-medium">{tema}</span>
                </p>
              )}
            </div>

            <div className="flex flex-col items-start md:items-end gap-1">
              <span className="text-sm text-gray-600">
                <span className={`font-semibold ${cor.titleText}`}>
                  {moedasConquistadas} moedas
                </span>{" "}
                • Progresso:{" "}
                <span className={`font-semibold ${cor.titleText}`}>
                  {pctMoedas}%
                </span>
              </span>
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${cor.badgeBg} ${cor.badgeText}`}
              >
                Dashboard da disciplina
              </span>
            </div>
          </div>

          {/* CARDS NO TOPO (MOEDAS / CONCLUÍDAS / VÍDEOS / RESUMOS) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <div className="rounded-xl border border-purple-100 bg-purple-50/70 p-4 flex flex-col items-center justify-center text-center">
              <span className="text-xs font-medium uppercase tracking-wide text-purple-700">
                Moedas
              </span>
              <span className="text-3xl font-semibold text-purple-800 mt-1">
                {pctMoedas}%
              </span>
              <span className="text-[11px] text-purple-700 mt-1">
                {moedasConquistadas} de {metaMoedas}
              </span>
            </div>

            <div className="rounded-xl border border-emerald-100 bg-emerald-50/80 p-4 flex flex-col items-center justify-center text-center">
              <span className="text-xs font-medium uppercase tracking-wide text-emerald-700">
                Atividades
              </span>
              <span className="text-3xl font-semibold text-emerald-800 mt-1">
                {pctAtividades}%
              </span>
              <span className="text-[11px] text-emerald-700 mt-1">
                {atividadesConcluidas} de {totalAtividades} realizadas
              </span>
            </div>

            <div className="rounded-xl border border-blue-100 bg-blue-50/80 p-4 flex flex-col items-center justify-center text-center">
              <span className="text-xs font-medium uppercase tracking-wide text-blue-700">
                Vídeos
              </span>
              <span className="text-3xl font-semibold text-blue-800 mt-1">
                {pctVideos}%
              </span>
              <span className="text-[11px] text-blue-700 mt-1">
                {videosAssistidos} de {totalVideoaulas} assistidos
              </span>
            </div>

            <div className="rounded-xl border border-fuchsia-100 bg-fuchsia-50/80 p-4 flex flex-col items-center justify-center text-center">
              <span className="text-xs font-medium uppercase tracking-wide text-fuchsia-700">
                Resumos
              </span>
              <span className="text-3xl font-semibold text-fuchsia-800 mt-1">
                {pctResumos}%
              </span>
              <span className="text-[11px] text-fuchsia-700 mt-1">
                {resumosLidos} de {totalResumos} lidos
              </span>
            </div>
          </div>

          {/* BARRAS DE PROGRESSO (AGORA COM COR DA DISCIPLINA) */}
          <div className="mt-6 space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">Moedas conquistadas</span>
                <span className="text-gray-800 font-medium">{pctMoedas}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${cor.gradFrom} ${cor.gradTo} rounded-full`}
                  style={{ width: `${pctMoedas}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">Atividades concluídas</span>
                <span className="text-gray-800 font-medium">
                  {pctAtividades}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${cor.gradFrom} ${cor.gradTo} rounded-full`}
                  style={{ width: `${pctAtividades}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">Videoaulas assistidas</span>
                <span className="text-gray-800 font-medium">{pctVideos}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${cor.gradFrom} ${cor.gradTo} rounded-full`}
                  style={{ width: `${pctVideos}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* OPÇÕES DISPONÍVEIS */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Opções disponíveis
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* CARD RESUMOS */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between">
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-gray-900">
                  Resumos
                </h3>
                <p className="text-xs text-gray-500">
                  Materiais de estudo e resumos postados pelos professores.
                </p>
                <p className="text-sm text-purple-700 font-medium mt-2">
                  {totalResumos} resumos disponíveis
                </p>
              </div>
              <button
                className={`mt-4 w-full inline-flex items-center justify-center rounded-lg bg-purple-600 text-white text-sm font-medium py-2.5 transition-colors ${
                  totalResumos === 0
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:bg-purple-700"
                }`}
                type="button"
                onClick={() => totalResumos > 0 && openModal("resumos")}
                disabled={totalResumos === 0}
              >
                Ver todos os resumos
              </button>
            </div>

            {/* CARD ATIVIDADES */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between">
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-gray-900">
                  Atividades
                </h3>
                <p className="text-xs text-gray-500">
                  Tarefas, exercícios e avaliações para completar.
                </p>
                <p className="text-sm text-purple-700 font-medium mt-2">
                  {totalAtividades} atividades disponíveis
                </p>
              </div>
              <button
                className={`mt-4 w-full inline-flex items-center justify-center rounded-lg bg-purple-600 text-white text-sm font-medium py-2.5 transition-colors ${
                  totalAtividades === 0
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:bg-purple-700"
                }`}
                type="button"
                onClick={() => totalAtividades > 0 && openModal("atividades")}
                disabled={totalAtividades === 0}
              >
                Ver todas as atividades
              </button>
            </div>

            {/* CARD VIDEOAULAS */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between">
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-gray-900">
                  Videoaulas
                </h3>
                <p className="text-xs text-gray-500">
                  Conteúdo em vídeo para aprendizado visual.
                </p>
                <p className="text-sm text-purple-700 font-medium mt-2">
                  {totalVideoaulas} videoaulas disponíveis
                </p>
              </div>
              <button
                className={`mt-4 w-full inline-flex items-center justify-center rounded-lg bg-purple-600 text-white text-sm font-medium py-2.5 transition-colors ${
                  totalVideoaulas === 0
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:bg-purple-700"
                }`}
                type="button"
                onClick={() => totalVideoaulas > 0 && openModal("videoaulas")}
                disabled={totalVideoaulas === 0}
              >
                Ver todas as videoaulas
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* MODAL "VER TODOS" — agora estilizado, com ícones, filtros e paginação */}
      {modalTipo && (
        <Modal onClose={closeModal}>
          <div className="relative max-w-2xl">
            {/* HEADER MODAL */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  {modalTipo === "atividades" && "Atividades da disciplina"}
                  {modalTipo === "resumos" && "Resumos da disciplina"}
                  {modalTipo === "videoaulas" && "Videoaulas da disciplina"}
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Clique em um item para abrir a página completa.
                </p>
              </div>

              {/* <button
                onClick={closeModal}
                className="inline-flex items-center justify-center rounded-full p-1.5 hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition"
                aria-label="Fechar"
              >
                <X className="h-5 w-5" />
              </button> */}
            </div>

            {/* FILTROS */}
            <div className="flex flex-wrap gap-2 mb-4">
              {[
                { id: "todos", label: "Todos" },
                { id: "pendentes", label: "Pendentes" },
                { id: "concluidos", label: "Concluídos" },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    setModalFiltro(f.id as ModalFiltro);
                    setModalPage(1);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition ${
                    modalFiltro === f.id
                      ? "bg-purple-600 text-white border-purple-600"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* LISTA */}
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {modalTotal === 0 ? (
                <p className="text-sm text-gray-500">
                  Nenhum item encontrado para esse filtro.
                </p>
              ) : (
                modalItensPagina.map((item) => {
                  const statusInfo = getStatusInfo(modalTipo, item);
                  const isConcluido = statusInfo.isConcluido;

                  const handleClick = () => {
                    if (modalTipo === "atividades") {
                      router.push(`/aluno/atividades/${item.id_atividade}`);
                    } else if (modalTipo === "resumos") {
                      router.push(`/aluno/resumos/${item.id_resumo}`);
                    } else if (modalTipo === "videoaulas") {
                      router.push(`/aluno/videoaulas/${item.id_videoaula}`);
                    }
                  };

                  return (
                    <button
                      key={
                        modalTipo === "atividades"
                          ? item.id_atividade
                          : modalTipo === "resumos"
                            ? item.id_resumo
                            : item.id_videoaula
                      }
                      type="button"
                      onClick={handleClick}
                      className="w-full text-left bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100 rounded-xl px-4 py-3 flex items-start gap-3"
                    >
                      <div className="mt-1">
                        {getModalIcon(modalTipo, isConcluido)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {item.titulo}
                          </h3>
                          <span className={statusInfo.className}>
                            {statusInfo.label}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {modalTipo === "videoaulas"
                            ? item.url
                            : item.descricao || item.conteudo || ""}
                        </p>

                        {/* Moedas (somente para atividades e videoaulas que têm recompensa) */}
                        {(modalTipo === "atividades" ||
                          modalTipo === "videoaulas") &&
                          typeof item.recompensa_moedas === "number" &&
                          item.recompensa_moedas > 0 && (
                            <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-medium text-amber-700 bg-amber-50 rounded-full px-2 py-0.5">
                              <Coins className="h-3 w-3" />
                              <span>+{item.recompensa_moedas} moedas</span>
                            </div>
                          )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* PAGINAÇÃO */}
            {modalTotal > 0 && (
              <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                <span>
                  Mostrando{" "}
                  <span className="font-semibold">
                    {Math.min((modalPage - 1) * ITEMS_PER_PAGE + 1, modalTotal)}
                  </span>{" "}
                  –{" "}
                  <span className="font-semibold">
                    {Math.min(modalPage * ITEMS_PER_PAGE, modalTotal)}
                  </span>{" "}
                  de <span className="font-semibold">{modalTotal}</span>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrevPage}
                    disabled={!canPrev}
                    className={`px-3 py-1 rounded-full border text-xs font-medium ${
                      canPrev
                        ? "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                        : "bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed"
                    }`}
                  >
                    Anterior
                  </button>
                  <span className="text-[11px]">
                    Página <span className="font-semibold">{modalPage}</span> de{" "}
                    <span className="font-semibold">{modalTotalPages}</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleNextPage}
                    disabled={!canNext}
                    className={`px-3 py-1 rounded-full border text-xs font-medium ${
                      canNext
                        ? "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                        : "bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed"
                    }`}
                  >
                    Próxima
                  </button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </AlunoLayout>
  );
};

export default DisciplinaDetalhePage;
