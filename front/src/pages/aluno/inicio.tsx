import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { getAlunoLayout } from "../../components/layout/AlunoLayout";
import { Card, CardContent } from "../../components/ui/Card";
import type { NextPageWithLayout } from "@/pages/_app";
import {
  TrendingUp,
  Award,
  BookOpen,
  Target,
  AlertTriangle,
  Zap,
  ShieldCheck,
  Clock,
  ArrowRight,
} from "lucide-react";
import { api } from "@/lib/api";

const GraficoMoedas = dynamic(
  () => import("../../components/aluno/GraficoMoedas"),
  {
    ssr: false,
    loading: () => (
      <Card className="border border-gray-200 rounded-2xl">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-4 bg-gray-200 rounded w-8"></div>
                  <div className="flex-1 h-3 bg-gray-200 rounded-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    ),
  },
);

type AtividadeRecente = {
  disciplina: string;
  atividade: string;
  status: string;
  moedas: number;
};

type PeriodoFiltro =
  | "hoje"
  | "ultimos7dias"
  | "ultimos30dias"
  | "essaSemana"
  | "esseMes"
  | "todo";

// Formato "achatado" de GET aluno/atividades (já vem com status/nota/disciplinas.nome
// resolvidos pela própria API, sem precisar de joins manuais no client).
type ProgressoAtividadeRow = {
  id_atividade: number | null;
  titulo: string | null;
  recompensa_moedas: number | null;
  id_disciplina: number | null;
  data_criacao: string | null;
  data_vencimento: string | null;
  data_entrega: string | null;
  status: string | null;
  nota: number | string | null;
  disciplinas: { nome: string | null } | null;
};

type FaixaData = {
  inicio: Date;
  fim: Date;
};

const OPCOES_FILTRO: { valor: PeriodoFiltro; label: string }[] = [
  { valor: "todo", label: "Desde o início" },
  { valor: "esseMes", label: "Esse mês" },
  { valor: "essaSemana", label: "Essa semana" },
  { valor: "ultimos30dias", label: "Últimos 30 dias" },
  { valor: "ultimos7dias", label: "Últimos 7 dias" },
  { valor: "hoje", label: "Hoje" },
];

// Use UTC-based start/end of day to avoid timezone shifts when comparing with DB timestamps
const inicioDoDiaUTC = (data: Date) => {
  const y = data.getUTCFullYear();
  const m = data.getUTCMonth();
  const d = data.getUTCDate();
  return new Date(Date.UTC(y, m, d, 0, 0, 0, 0));
};

const fimDoDiaUTC = (data: Date) => {
  const y = data.getUTCFullYear();
  const m = data.getUTCMonth();
  const d = data.getUTCDate();
  return new Date(Date.UTC(y, m, d, 23, 59, 59, 999));
};

const obterFaixaDoPeriodo = (periodo: PeriodoFiltro): FaixaData => {
  const agora = new Date();
  // Work with UTC boundaries to match DB timestamps which usually are in UTC
  if (periodo === "hoje") {
    return { inicio: inicioDoDiaUTC(agora), fim: fimDoDiaUTC(agora) };
  }

  if (periodo === "ultimos7dias") {
    const fim = fimDoDiaUTC(agora);
    const inicio = new Date(fim);
    inicio.setUTCDate(inicio.getUTCDate() - 6);
    inicio.setUTCHours(0, 0, 0, 0);
    return { inicio, fim };
  }

  if (periodo === "ultimos30dias") {
    const fim = fimDoDiaUTC(agora);
    const inicio = new Date(fim);
    inicio.setUTCDate(inicio.getUTCDate() - 29);
    inicio.setUTCHours(0, 0, 0, 0);
    return { inicio, fim };
  }

  if (periodo === "essaSemana") {
    const fim = fimDoDiaUTC(agora);
    const diaSemana = fim.getUTCDay();
    const deslocamentoParaSegunda = diaSemana === 0 ? 6 : diaSemana - 1;
    const inicio = new Date(fim);
    inicio.setUTCDate(inicio.getUTCDate() - deslocamentoParaSegunda);
    inicio.setUTCHours(0, 0, 0, 0);
    return { inicio, fim };
  }

  // esseMes
  const fim = fimDoDiaUTC(agora);
  const inicio = new Date(Date.UTC(agora.getUTCFullYear(), agora.getUTCMonth(), 1, 0, 0, 0, 0));
  return { inicio, fim };
};

const normalizarStatus = (status: string | null | undefined) =>
  (status ?? "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

// Vocabulário real da API: pendente | entregue | corrigida (não mais "concluida").
// "Concluída"/moedas só valem quando o professor corrige (é só aí que a moeda
// é creditada de verdade em moedas_saldo) - "entregue" ainda está aguardando correção.
const statusParaExibicao = (status: string | null | undefined) => {
  const normalizado = normalizarStatus(status);

  if (normalizado === "corrigida") {
    return "Concluída";
  }

  if (normalizado === "entregue") {
    return "Entregue";
  }

  if (normalizado === "pendente") {
    return "Pendente";
  }

  return "Em Progresso";
};

const isConcluida = (status: string | null | undefined) => {
  const normalizado = normalizarStatus(status);
  return normalizado === "corrigida";
};

// A escala de aprovado/recuperação/reprovado é só para nota final de disciplina
// (ver "Minhas Notas"). Aqui, por atividade, o corte é simples: nota < 6 já é
// sinal de que o aluno precisa melhorar naquele ponto.
const NOTA_MINIMA_ESPERADA = 6;

const notaAbaixoDoEsperado = (nota: number | string | null | undefined): boolean => {
  if (nota === null || nota === undefined) return false;
  const valor = Number(nota);
  if (Number.isNaN(valor)) return false;
  return valor < NOTA_MINIMA_ESPERADA;
};

// Shim: a API já entrega o registro achatado (sem nesting de "atividades"),
// então o próprio row já contém titulo/recompensa_moedas/id_disciplina.
const obterAtividade = (row: ProgressoAtividadeRow) => row;

const obterNomeDisciplina = (row: ProgressoAtividadeRow) => {
  return row.disciplinas?.nome ?? "Disciplina";
};

const parseDateAssumingUTC = (val: any): Date | null => {
  if (!val) return null;
  const s = String(val);
  // if contains timezone indicator (Z or ±HH:MM) accept as-is; otherwise assume UTC
  const hasTZ = /Z|[\+\-]\d{2}:?\d{2}$/i.test(s);
  const iso = hasTZ ? s : `${s.endsWith("Z") ? s : s + "Z"}`;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
};

// Data de referência: quando entregue/corrigida, usa a data de entrega; senão,
// cai pra data de criação da atividade (o mais próximo de "quando isso apareceu pro aluno").
const obterDataReferencia = (row: ProgressoAtividadeRow) => {
  return parseDateAssumingUTC(row.data_entrega) ?? parseDateAssumingUTC(row.data_criacao);
};

const obterPrazoAtividade = (row: ProgressoAtividadeRow) => {
  return parseDateAssumingUTC(row.data_vencimento);
};

const obterCriadoEspecifico = (row: ProgressoAtividadeRow) => {
  return parseDateAssumingUTC(row.data_criacao);
};

const Inicio: NextPageWithLayout = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [periodoSelecionado, setPeriodoSelecionado] =
    useState<PeriodoFiltro>("esseMes");
  const [progressoAtividades, setProgressoAtividades] = useState<
    ProgressoAtividadeRow[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [nomeAluno, setNomeAluno] = useState<string | null>(null);
  const [totalMoedasHistorico, setTotalMoedasHistorico] = useState(0);

  useEffect(() => {
    setMounted(true);

    const carregarDashboard = async () => {
      try {
        setLoading(true);
        setError(null);

        // Nome do aluno + atividades (já achatadas com status/nota/disciplinas.nome) + total
        // histórico de moedas (mesmo cálculo do ranking, pra bater com o valor de lá) -
        // não dependem uma da outra, buscar em paralelo evita esperar três round-trips
        // em sequência logo na primeira tela após o login.
        const [me, atividades, totalGanho] = await Promise.all([
          api.get("/auth/me"),
          api.get("/aluno/atividades"),
          api.get("/aluno/moedas/total-ganho"),
        ]);
        setNomeAluno(me?.nome || null);
        setProgressoAtividades((atividades as ProgressoAtividadeRow[]) ?? []);
        setTotalMoedasHistorico(totalGanho?.total_moedas_historico ?? 0);
      } catch (err: any) {
        console.error(err);
        setError(err.message ?? "Erro ao carregar dashboard.");
      } finally {
        setLoading(false);
      }
    };

    carregarDashboard();
  }, []);

  const faixaPeriodo = useMemo(
    () => (periodoSelecionado === "todo" ? null : obterFaixaDoPeriodo(periodoSelecionado)),
    [periodoSelecionado]
  );

  const progressoFiltrado = useMemo(() => {
    if (periodoSelecionado === "todo") return progressoAtividades;
    if (!faixaPeriodo) return [];
    return progressoAtividades.filter((row) => {
      const dataReferencia = obterDataReferencia(row);
      if (!dataReferencia || Number.isNaN(dataReferencia.getTime())) {
        return false;
      }

      return (
        dataReferencia.getTime() >= faixaPeriodo.inicio.getTime() &&
        dataReferencia.getTime() <= faixaPeriodo.fim.getTime()
      );
    });
  }, [faixaPeriodo, progressoAtividades]);

  const concluidasFiltradas = useMemo(
    () => progressoFiltrado.filter((row) => isConcluida(row.status)),
    [progressoFiltrado]
  );

  const itensAtencaoCritica = useMemo(() => {
    if (progressoAtividades.length === 0) return [];

    const agora = new Date();
    const seteDiasMs = 7 * 24 * 60 * 60 * 1000;

    return progressoAtividades
      .filter((row) => {
        // Corrigida com nota abaixo do esperado também é crítica.
        if (isConcluida(row.status)) {
          return notaAbaixoDoEsperado(row.nota);
        }

        const criado = obterCriadoEspecifico(row) ?? obterDataReferencia(row);
        const prazo = obterPrazoAtividade(row);

        const pendenteMais7dias = criado ? agora.getTime() - criado.getTime() > seteDiasMs : false;
        const prazoExpirado = prazo ? prazo.getTime() < agora.getTime() : false;

        return pendenteMais7dias || prazoExpirado;
      })
      .map((row) => {
        const atividade = obterAtividade(row);
        const prazo = obterPrazoAtividade(row);
        const atrasada = prazo ? prazo.getTime() < agora.getTime() : false;
        const notaBaixa = isConcluida(row.status) && notaAbaixoDoEsperado(row.nota);
        return {
          id_atividade: atividade?.id_atividade ?? null,
          titulo: atividade?.titulo ?? "Atividade",
          disciplina: obterNomeDisciplina(row),
          status: statusParaExibicao(row.status),
          criadoEm: obterCriadoEspecifico(row) ?? obterDataReferencia(row),
          prazo: notaBaixa ? null : prazo,
          atrasada: notaBaixa ? false : atrasada,
          notaBaixa,
          nota: row.nota !== null && row.nota !== undefined ? Number(row.nota) : null,
        };
      })
      .sort((a, b) => {
        const ta = a.prazo ? a.prazo.getTime() : a.criadoEm?.getTime() ?? 0;
        const tb = b.prazo ? b.prazo.getTime() : b.criadoEm?.getTime() ?? 0;
        return ta - tb;
      })
      .slice(0, 5);
  }, [progressoAtividades]);

  const atividadesConcluidas = concluidasFiltradas.length;

  const disciplinasAtivas = useMemo(() => {
    const disciplinas = new Set<string>();

    progressoFiltrado.forEach((row) => {
      const atividade = obterAtividade(row);
      const chave = String(atividade?.id_disciplina ?? obterNomeDisciplina(row));
      disciplinas.add(chave);
    });

    return disciplinas.size;
  }, [progressoFiltrado]);

  const progressoGeral = useMemo(() => {
    if (progressoFiltrado.length === 0) return 0;
    return Math.round((concluidasFiltradas.length / progressoFiltrado.length) * 100);
  }, [concluidasFiltradas.length, progressoFiltrado.length]);

  const dadosGrafico = useMemo(() => {
    const acumuladoPorDisciplina = new Map<string, number>();

    concluidasFiltradas.forEach((row) => {
      const atividade = obterAtividade(row);
      const disciplina = obterNomeDisciplina(row);
      const moedas = Number(atividade?.recompensa_moedas ?? 0);
      acumuladoPorDisciplina.set(
        disciplina,
        (acumuladoPorDisciplina.get(disciplina) ?? 0) + moedas
      );
    });

    return Array.from(acumuladoPorDisciplina.entries())
      .map(([label, moedas]) => ({ label, moedas }))
      .sort((a, b) => b.moedas - a.moedas);
  }, [concluidasFiltradas]);

  

  const atividadesRecentes = useMemo<AtividadeRecente[]>(() => {
    return [...progressoFiltrado]
      .sort((a, b) => {
        const dataA = obterDataReferencia(a)?.getTime() ?? 0;
        const dataB = obterDataReferencia(b)?.getTime() ?? 0;
        return dataB - dataA;
      })
      .slice(0, 5)
      .map((row) => {
        const atividade = obterAtividade(row);
        return {
          atividade: atividade?.titulo ?? "Atividade",
          disciplina: obterNomeDisciplina(row),
          status: statusParaExibicao(row.status),
          moedas: Number(atividade?.recompensa_moedas ?? 0),
        };
      });
  }, [progressoFiltrado]);

  // Risco = nº de atividades atrasadas/pendentes há muito tempo (itensAtencaoCritica),
  // não mais uma proporção de moedas por disciplina - essa métrica media "quem ganhou
  // menos moedas no período", o que não é a mesma coisa que "está com atividade atrasada"
  // e podia contradizer o que a tela de Minhas Notas mostra pra mesma disciplina.
  const riscoNumero = itensAtencaoCritica.length;



  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-violet-700">
            Bem-vindo(a){nomeAluno ? `, ${nomeAluno}` : ""}!
          </h1>
          <p className="text-gray-600 mt-2">
            Resumo do seu desempenho, moedas e atividades recentes.
          </p>
        </div>

        <Card className="border border-gray-200 rounded-2xl">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              {OPCOES_FILTRO.map((opcao) => {
                const ativo = periodoSelecionado === opcao.valor;
                return (
                  <button
                    key={opcao.valor}
                    type="button"
                    onClick={() => setPeriodoSelecionado(opcao.valor)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      ativo
                        ? "bg-violet-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {opcao.label}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* painel de depuração removido */}

        {error && (
          <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Cards de estatísticas originais - voltando para 4 colunas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border border-gray-200 rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total de Moedas
                  </p>
                  <p className="text-2xl font-bold text-violet-700">
                    {loading ? "..." : totalMoedasHistorico}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl">
                  <Award className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Atividades Concluídas
                  </p>
                  <p className="text-2xl font-bold text-violet-700">
                    {loading ? "..." : atividadesConcluidas}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-green-400 to-green-500 rounded-xl">
                  <Target className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Disciplinas Ativas
                  </p>
                  <p className="text-2xl font-bold text-violet-700">
                    {loading ? "..." : disciplinasAtivas}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Progresso Geral
                  </p>
                  <p className="text-2xl font-bold text-violet-700">
                    {loading ? "..." : `${progressoGeral}%`}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-violet-400 to-violet-500 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de Evolução de Moedas */}
        <GraficoMoedas
          dados={dadosGrafico}
          totalAcumulado={totalMoedasHistorico}
          loading={loading}
          error={error}
        />

        {/* Zona de Atenção Crítica - visual estilo dashboard */}
        <Card className="overflow-hidden rounded-3xl border border-red-200 bg-white shadow-xl shadow-red-100/70">
          <CardContent className="p-0">
            <style jsx>{`
              @keyframes criticalPulse {
                0%, 100% {
                  transform: scale(1);
                  opacity: 0.65;
                }
                50% {
                  transform: scale(1.18);
                  opacity: 0.18;
                }
              }

              @keyframes criticalGlow {
                0%, 100% {
                  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.75));
                }
                50% {
                  filter: drop-shadow(0 0 24px rgba(255, 255, 255, 1));
                }
              }

              .critical-pulse-ring {
                animation: criticalPulse 1.8s ease-in-out infinite;
              }

              .critical-glow-icon {
                animation: criticalGlow 1.8s ease-in-out infinite;
              }
            `}</style>

            {loading ? (
              <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr]">
                <div className="min-h-[280px] bg-gradient-to-br from-red-800 via-red-600 to-red-500 p-6">
                  <div className="flex h-full flex-col items-center justify-center animate-pulse">
                    <div className="mb-5 h-24 w-24 rounded-full bg-white/20" />
                    <div className="h-12 w-20 rounded-xl bg-white/25" />
                    <div className="mt-3 h-3 w-40 rounded bg-white/20" />
                  </div>
                </div>

                <div className="p-6 lg:p-8">
                  <div className="animate-pulse space-y-5">
                    <div className="h-7 w-64 rounded bg-red-100" />
                    <div className="h-4 w-full max-w-xl rounded bg-gray-100" />
                    <div className="h-24 rounded-2xl bg-gray-100" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr]">
                {/* Lado colorido: vermelho quando há risco, verde quando está tudo em dia */}
                <div
                  className={`relative overflow-hidden p-6 text-white ${
                    riscoNumero > 0
                      ? "bg-gradient-to-br from-red-800 via-red-600 to-red-500"
                      : "bg-gradient-to-br from-emerald-700 via-emerald-600 to-emerald-500"
                  }`}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.24),transparent_34%),radial-gradient(circle_at_90%_85%,rgba(255,255,255,0.14),transparent_26%)]" />
                  <div className="absolute -right-14 -top-14 h-36 w-36 rounded-full bg-white/10 blur-2xl" />
                  <div
                    className={`absolute -bottom-16 -left-16 h-44 w-44 rounded-full blur-2xl ${
                      riscoNumero > 0 ? "bg-red-950/30" : "bg-emerald-950/20"
                    }`}
                  />

                  <div className="relative z-10 flex min-h-[300px] flex-col items-center justify-center text-center">
                    <div className="relative mb-6">
                      {riscoNumero > 0 && (
                        <>
                          <div className="critical-pulse-ring absolute inset-0 rounded-full bg-white/20" />
                          <div className="critical-pulse-ring absolute -inset-5 rounded-full border border-white/25" />
                          <div className="critical-pulse-ring absolute -inset-10 rounded-full border border-white/15" />
                        </>
                      )}

                      <div
                        className={`relative flex h-28 w-28 items-center justify-center rounded-full bg-white/15 ring-2 ring-white/25 backdrop-blur-sm ${
                          riscoNumero > 0 ? "critical-glow-icon" : ""
                        }`}
                      >
                        {riscoNumero > 0 ? (
                          <AlertTriangle
                            className="h-16 w-16 text-white"
                            strokeWidth={2.7}
                          />
                        ) : (
                          <ShieldCheck
                            className="h-16 w-16 text-white"
                            strokeWidth={2.7}
                          />
                        )}
                      </div>
                    </div>

                    <p className="text-7xl font-black leading-none drop-shadow-xl">
                      {riscoNumero}
                    </p>

                    <p className="mt-4 text-[11px] font-black uppercase tracking-[0.35em] text-white">
                      {riscoNumero > 0 ? "Atividades em atenção" : "Tudo em dia"}
                    </p>

                    <div
                      className={`mt-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black uppercase tracking-widest text-white ${
                        riscoNumero > 0 ? "bg-red-950/30" : "bg-emerald-950/20"
                      }`}
                    >
                      {riscoNumero > 0 ? (
                        <>
                          <Zap className="h-4 w-4" />
                          Alerta
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="h-4 w-4" />
                          Em dia
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Lado direito */}
                <div className="flex flex-col justify-center p-6 lg:p-8">
                  <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-xs font-black uppercase tracking-wide text-red-700">
                        <AlertTriangle className="h-4 w-4" />
                        Monitoramento de prazos
                      </div>

                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-9 w-9 text-red-600" />
                        <h3 className="text-3xl font-black tracking-tight text-gray-950">
                          Zona de Atenção Crítica
                        </h3>
                      </div>

                      <div className="mt-4 h-1 w-24 rounded-full bg-red-600" />

                      <p className="mt-4 max-w-2xl text-sm font-medium leading-relaxed text-gray-500">
                        Atividades atrasadas, pendentes há mais de 7 dias ou
                        corrigidas com nota abaixo do esperado, em qualquer
                        disciplina.
                      </p>
                    </div>
                  </div>

                  {itensAtencaoCritica.length === 0 ? (
                    <div className="flex items-center gap-5 rounded-3xl border border-red-100 bg-gradient-to-br from-red-50 via-white to-green-50 p-6">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-green-100 text-green-700">
                        <ShieldCheck className="h-9 w-9" />
                      </div>

                      <div>
                        <p className="text-lg font-black text-green-700">
                          Nenhuma atividade atrasada, pendente há muito tempo
                          ou com nota abaixo do esperado.
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          Continue assim! Você está em dia com seus prazos.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {itensAtencaoCritica.map((item, i) => {
                        const diasReferencia = item.atrasada
                          ? item.prazo
                          : item.criadoEm;
                        const dias = diasReferencia
                          ? Math.max(
                              0,
                              Math.floor(
                                (Date.now() - diasReferencia.getTime()) /
                                  86400000
                              )
                            )
                          : null;

                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() =>
                              item.id_atividade &&
                              router.push(`/aluno/atividades/${item.id_atividade}`)
                            }
                            disabled={!item.id_atividade}
                            className="group text-left rounded-2xl border border-red-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-red-400 hover:shadow-lg disabled:cursor-default disabled:hover:translate-y-0"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="truncate text-sm font-black text-gray-900">
                                  {item.titulo}
                                </p>
                                <p className="mt-0.5 text-xs font-semibold text-gray-500">
                                  {item.disciplina}
                                </p>
                              </div>

                              <AlertTriangle className="h-5 w-5 shrink-0 text-red-500" />
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                              <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                                  item.notaBaixa || item.atrasada
                                    ? "bg-red-100 text-red-700"
                                    : "bg-amber-100 text-amber-700"
                                }`}
                              >
                                {item.notaBaixa ? (
                                  <AlertTriangle className="h-3 w-3" />
                                ) : (
                                  <Clock className="h-3 w-3" />
                                )}
                                {item.notaBaixa
                                  ? `Nota baixa (${item.nota?.toFixed(1)})`
                                  : item.atrasada
                                    ? dias && dias > 0
                                      ? `Atrasada há ${dias} dia${dias > 1 ? "s" : ""}`
                                      : "Atrasada"
                                    : dias && dias > 0
                                      ? `Pendente há ${dias} dias`
                                      : "Pendente"}
                              </span>

                              {item.id_atividade && (
                                <ArrowRight className="h-4 w-4 text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-red-500" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Atividades Recentes */}
        <Card className="border border-gray-200 rounded-2xl">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Atividades Recentes
            </h3>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg animate-pulse"
                  >
                    <div>
                      <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
                      <div className="h-3 w-24 bg-gray-200 rounded" />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-6 w-20 bg-gray-200 rounded-full" />
                      <div className="h-4 w-16 bg-gray-200 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : atividadesRecentes.length === 0 ? (
              <p className="text-sm text-gray-500">
                Você ainda não tem atividades registradas.
              </p>
            ) : (
              <div className="space-y-3">
                {atividadesRecentes.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {item.atividade}
                      </p>
                      <p className="text-sm text-gray-600">{item.disciplina}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === "Concluída"
                            ? "bg-green-100 text-green-700"
                            : item.status === "Pendente"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {item.status}
                      </span>
                      <span className="text-sm font-medium text-yellow-600">
                        +{item.moedas} moedas
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
  );
};

Inicio.getLayout = getAlunoLayout;

export default Inicio;
