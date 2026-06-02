import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import AlunoLayout from "../../components/layout/AlunoLayout";
import { Card, CardContent } from "../../components/ui/Card";
import { TrendingUp, Award, BookOpen, Target } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

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
  }
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

type ProgressoAtividadeRow = {
  status: string | null;
  concluido_em: string | null;
  criado_em: string | null;
  atividades:
    | {
        titulo: string | null;
        recompensa_moedas: number | null;
        id_disciplina: number | null;
        disciplinas:
          | {
              nome: string | null;
            }
          | {
              nome: string | null;
            }[]
          | null;
      }
    | {
        titulo: string | null;
        recompensa_moedas: number | null;
        id_disciplina: number | null;
        disciplinas:
          | {
              nome: string | null;
            }
          | {
              nome: string | null;
            }[]
          | null;
      }[]
    | null;
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

const statusParaExibicao = (status: string | null | undefined) => {
  const normalizado = normalizarStatus(status);

  if (normalizado === "concluida" || normalizado === "concluido") {
    return "Concluída";
  }

  if (normalizado === "pendente") {
    return "Pendente";
  }

  return "Em Progresso";
};

const isConcluida = (status: string | null | undefined) => {
  const normalizado = normalizarStatus(status);
  return normalizado === "concluida" || normalizado === "concluido";
};

const obterAtividade = (row: ProgressoAtividadeRow) => {
  if (!row.atividades) return null;
  return Array.isArray(row.atividades) ? row.atividades[0] ?? null : row.atividades;
};

const obterNomeDisciplina = (row: ProgressoAtividadeRow) => {
  const atividade = obterAtividade(row);
  const disciplinas = atividade?.disciplinas;

  if (!disciplinas) return "Disciplina";

  if (Array.isArray(disciplinas)) {
    return disciplinas[0]?.nome ?? "Disciplina";
  }

  return disciplinas.nome ?? "Disciplina";
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

const obterDataReferencia = (row: ProgressoAtividadeRow) => {
  const candidates = [
    row.concluido_em,
    (row as any).concluido_at,
    row.criado_em,
    (row as any).criado_at,
    (row as any).created_at,
    (row as any).updated_at,
  ];

  for (const c of candidates) {
    const d = parseDateAssumingUTC(c);
    if (d) return d;
  }

  return null;
};

const obterPrazoAtividade = (row: ProgressoAtividadeRow) => {
  const atividade: any = obterAtividade(row);
  const candidates = [
    atividade?.prazo,
    atividade?.prazo_em,
    atividade?.prazo_at,
    atividade?.due_date,
    (row as any).prazo,
    (row as any).prazo_em,
  ];

  for (const c of candidates) {
    const d = parseDateAssumingUTC(c);
    if (d) return d;
  }

  return null;
};

const obterCriadoEspecifico = (row: ProgressoAtividadeRow) => {
  const atividade: any = obterAtividade(row);
  const candidates = [
    row.criado_em,
    (row as any).criado_at,
    atividade?.criado_em,
    atividade?.created_at,
  ];

  for (const c of candidates) {
    const d = parseDateAssumingUTC(c);
    if (d) return d;
  }

  return null;
};

export default function Inicio() {
  const [loading, setLoading] = useState(true);
  const [periodoSelecionado, setPeriodoSelecionado] =
    useState<PeriodoFiltro>("esseMes");
  const [progressoAtividades, setProgressoAtividades] = useState<
    ProgressoAtividadeRow[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [nomeAluno, setNomeAluno] = useState<string | null>(null);

  useEffect(() => {
    const carregarDashboard = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1) Descobrir usuário autenticado
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          throw new Error("Não foi possível obter o usuário autenticado.");
        }

        // 2) Buscar id_usuario na tabela usuarios
        const { data: usuarios, error: usuariosError } = await supabase
          .from("usuarios")
          .select("id_usuario")
          .eq("auth_user_id", user.id)
          .maybeSingle();

        if (usuariosError || !usuarios) {
          throw new Error("Usuário não encontrado na tabela usuarios.");
        }

        const idUsuario = usuarios.id_usuario as number;

        // 3) Buscar id_aluno na tabela alunos
        const { data: aluno, error: alunoError } = await supabase
          .from("alunos")
          .select("id_aluno")
          .eq("id_usuario", idUsuario)
          .maybeSingle();

        if (alunoError || !aluno) {
          throw new Error("Aluno não encontrado na tabela alunos.");
        }

        const idAluno = aluno.id_aluno as number;

        // 3b) Buscar nome do aluno na tabela usuarios
        const { data: usuarioNome, error: nomeError } = await supabase
          .from("usuarios")
          .select("nome")
          .eq("id_usuario", idUsuario)
          .maybeSingle();

        if (!nomeError && usuarioNome) {
          setNomeAluno(usuarioNome.nome || null);
        }

        // 4) Buscar base completa para aplicação dos filtros por período
        // Use a safe select(*) with atividades subselect to avoid DB errors when columns differ
        const { data: progressoRows, error: progressoError } = await supabase
          .from("progresso_atividades")
          .select(
            `
            *,
            atividades (
              titulo,
              recompensa_moedas,
              id_disciplina,
              disciplinas (
                nome
              )
            )
          `
          )
          .eq("id_aluno", idAluno);

        if (progressoError) throw progressoError;

        setProgressoAtividades((progressoRows as ProgressoAtividadeRow[]) ?? []);
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

  const totalMoedas = useMemo(() => {
    return concluidasFiltradas.reduce((acc, row) => {
      const atividade = obterAtividade(row);
      return acc + Number(atividade?.recompensa_moedas ?? 0);
    }, 0);
  }, [concluidasFiltradas]);

  const itensAtencaoCritica = useMemo(() => {
    if (progressoAtividades.length === 0) return [];

    const agora = new Date();
    const seteDiasMs = 7 * 24 * 60 * 60 * 1000;

    return progressoAtividades
      .filter((row) => {
        // deve ser não concluída
        if (isConcluida(row.status)) return false;

        const criado = obterCriadoEspecifico(row) ?? obterDataReferencia(row);
        const prazo = obterPrazoAtividade(row);

        const pendenteMais7dias = criado ? agora.getTime() - criado.getTime() > seteDiasMs : false;
        const prazoExpirado = prazo ? prazo.getTime() < agora.getTime() : false;

        return pendenteMais7dias || prazoExpirado;
      })
      .map((row) => {
        const atividade = obterAtividade(row);
        return {
          titulo: atividade?.titulo ?? "Atividade",
          disciplina: obterNomeDisciplina(row),
          status: statusParaExibicao(row.status),
          criadoEm: obterCriadoEspecifico(row) ?? obterDataReferencia(row),
          prazo: obterPrazoAtividade(row),
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

  const riscoNumero = useMemo(() => Math.max(0, itensAtencaoCritica.length), [itensAtencaoCritica]);

  const desempenhoDisciplinas = useMemo(() => {
    const lista = dadosGrafico.slice(0, 4);
    const max = lista.reduce((m, x) => Math.max(m, x.moedas), 0) || 1;
    // performance: 0-10 where higher is better (based on moedas)
    return lista.map((d) => ({
      nome: d.label,
      score: Math.max(0, Math.round((d.moedas / max) * 10)),
    }));
  }, [dadosGrafico]);

  const LIMIAR_CRITICO = 7;
  const disciplinasCriticas = useMemo(
    () => desempenhoDisciplinas.filter((d) => d.score < LIMIAR_CRITICO),
    [desempenhoDisciplinas]
  );

  

  return (
    <AlunoLayout>
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

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border border-gray-200 rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total de Moedas
                  </p>
                  <p className="text-2xl font-bold text-violet-700">
                    {loading ? "..." : totalMoedas}
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
          totalAcumulado={totalMoedas}
          loading={loading}
          error={error}
        />

        {/* Zona de Atenção Crítica - usa dados completos (não filtrados pelo período) */}
        <Card className="border border-red-200 rounded-2xl">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-red-700 mb-4">
              Zona de Atenção Crítica
            </h3>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-red-50 rounded-lg animate-pulse"
                  >
                    <div>
                      <div className="h-4 w-48 bg-red-200 rounded mb-2" />
                      <div className="h-3 w-32 bg-red-200 rounded" />
                    </div>
                    <div className="h-4 w-16 bg-red-200 rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                <div className="col-span-1 bg-gradient-to-b from-red-600 to-red-400 text-white rounded-lg p-6 flex flex-col items-center justify-center">
                  <div className="rounded-full bg-red-500/20 p-4 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    </svg>
                  </div>
                  <div className="text-5xl font-bold">{riscoNumero}</div>
                  <div className="text-xs uppercase mt-2">Risco Acadêmico</div>
                </div>

                <div className="col-span-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">Zona de Atenção Crítica</h4>
                      <p className="text-sm text-gray-500">Resultados abaixo de 7.0 detectados no seu histórico recente.</p>
                    </div>
                    <button className="bg-red-600 text-white px-4 py-2 rounded-full shadow">Ação Imediata</button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    {disciplinasCriticas.length === 0 ? (
                      <div className="p-4 bg-white rounded-lg border">
                        <p className="text-sm text-gray-600">Nenhuma disciplina com desempenho crítico no período selecionado.</p>
                      </div>
                    ) : (
                      disciplinasCriticas.map((d, i) => (
                        <div key={i} className="p-4 bg-white rounded-lg border">
                          <div className="text-xs font-semibold text-red-600">{d.nome}</div>
                          <div className="text-sm font-medium mt-1">Desempenho: {d.score} / 10</div>
                          <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
                            <div className="bg-red-500 h-3 rounded-full" style={{ width: `${Math.max(5, d.score * 10)}%` }} />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
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
    </AlunoLayout>
  );
}
