import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import AlunoLayout from "../../components/layout/AlunoLayout";
import { Card, CardContent } from "../../components/ui/Card";
import {
  TrendingUp,
  Award,
  BookOpen,
  Target,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient"; // <- AJUSTA O CAMINHO

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

export default function Inicio() {
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [expandirDificuldades, setExpandirDificuldades] = useState(false);
  const [totalMoedas, setTotalMoedas] = useState(0);
  const [atividadesConcluidas, setAtividadesConcluidas] = useState(0);
  const [disciplinasAtivas, setDisciplinasAtivas] = useState(0);
  const [progressoGeral, setProgressoGeral] = useState(0);
  const [atividadesRecentes, setAtividadesRecentes] = useState<
    AtividadeRecente[]
  >([]);
  const [dificuldades, setDificuldades] = useState<
    Array<{ materia: string; nota: number }>
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [nomeAluno, setNomeAluno] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);

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

        // 4) Buscar total de moedas (vw_disciplinas_moedas_aluno)
        const { data: moedasRows, error: moedasError } = await supabase
          .from("vw_disciplinas_moedas_aluno")
          .select("moedas_conquistadas")
          .eq("id_aluno", idAluno);

        if (moedasError) throw moedasError;

        const totalMoedasCalc =
          moedasRows?.reduce(
            (sum, row: any) => sum + (row.moedas_conquistadas ?? 0),
            0,
          ) ?? 0;
        setTotalMoedas(totalMoedasCalc);

        // 5) Atividades concluídas (progresso_atividades)
        const { count: atividadesCount, error: atividadesError } =
          await supabase
            .from("progresso_atividades")
            .select("*", { count: "exact", head: true })
            .eq("id_aluno", idAluno)
            .eq("status", "concluida"); // ajuste aqui se o texto no banco for outro

        if (atividadesError) throw atividadesError;

        setAtividadesConcluidas(atividadesCount ?? 0);

        // 6) Disciplinas ativas (vw_disciplinas_por_aluno)
        const { data: discRows, error: discError } = await supabase
          .from("vw_disciplinas_por_aluno")
          .select("id_disciplina")
          .eq("id_aluno", idAluno);

        if (discError) throw discError;

        const disciplinasSet = new Set(
          discRows?.map((row: any) => row.id_disciplina),
        );
        setDisciplinasAtivas(disciplinasSet.size);

        // 7) Progresso geral (média de progresso_percent)
        const { data: progRows, error: progError } = await supabase
          .from("vw_disciplinas_moedas_aluno")
          .select("progresso_percent")
          .eq("id_aluno", idAluno);

        if (progError) throw progError;

        const progresso =
          progRows && progRows.length > 0
            ? Math.round(
                progRows.reduce(
                  (sum: number, row: any) =>
                    sum + Number(row.progresso_percent ?? 0),
                  0,
                ) / progRows.length,
              )
            : 0;

        setProgressoGeral(progresso);

        // 8) Atividades recentes
        const { data: recentes, error: recentesError } = await supabase
          .from("vw_dashboard_atividades_recentes")
          .select("*")
          .eq("id_aluno", idAluno)
          .limit(5);

        if (recentesError) throw recentesError;

        const formatadas: AtividadeRecente[] =
          recentes?.map((row: any) => ({
            atividade: row.atividade_nome,
            disciplina: row.disciplina_nome,
            status:
              row.status === "concluida"
                ? "Concluída"
                : row.status === "pendente"
                  ? "Pendente"
                  : "Em Progresso",
            moedas: row.moedas ?? 0,
          })) ?? [];

        setAtividadesRecentes(formatadas);

        // 9) Buscar Conteúdos com Dificuldade (Nota < 7)
        const { data: notasBaixas, error: notasError } = await supabase
          .from("progresso_atividades")
          .select(
            `
            nota,
            status,
            atividades (
              titulo,
              disciplinas (
                nome
              )
            )
          `,
          )
          .eq("id_aluno", idAluno)
          .ilike("status", "concluid%")
          .lt("nota", 7);

        if (!notasError && notasBaixas) {
          console.log("Dificuldades encontradas:", notasBaixas);
          const formatado = notasBaixas.map((item: any) => ({
            materia: item.atividades?.disciplinas?.nome || "Indefinida",
            nota: Number(item.nota),
          }));
          setDificuldades(formatado);
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message ?? "Erro ao carregar dashboard.");
      } finally {
        setLoading(false);
      }
    };

    carregarDashboard();
  }, []);

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

        {/* 2. NOVO BANNER DE DIFICULDADES (ENTRE OS CARDS E O GRÁFICO) */}
        {mounted && dificuldades.length > 0 && (
          <Card className="mt-8 mb-4 border-2 border-red-200 rounded-3xl bg-white shadow-2xl overflow-hidden transition-all duration-300">
            <CardContent className="p-0">
              <div className="flex flex-col lg:flex-row">
                {/* Lado Esquerdo: Alerta Vermelho Profundo */}
                <div className="bg-gradient-to-br from-red-600 via-red-700 to-red-900 p-8 flex flex-col items-center justify-center text-white lg:w-64">
                  <div className="bg-white/10 p-4 rounded-full backdrop-blur-md mb-3 border border-white/20 animate-pulse">
                    <AlertTriangle className="h-12 w-12 text-white" />
                  </div>
                  <p className="text-5xl font-black drop-shadow-lg">
                    {dificuldades.length}
                  </p>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-200 mt-1">
                    Risco Acadêmico
                  </p>
                </div>

                {/* Lado Direito */}
                <div className="p-8 flex-1 bg-slate-50/30">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                      <h3 className="text-2xl font-black text-red-950 tracking-tight flex items-center gap-2">
                        Zona de Atenção Crítica
                      </h3>
                      <p className="text-sm text-slate-500 font-semibold">
                        Resultados abaixo de 7.0 detectados no seu histórico
                        recente.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-full shadow-lg shadow-red-200">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        Ação Imediata
                      </span>
                    </div>
                  </div>

                  {/* Listagem com Animação e Cores Novas */}
                  <div
                    className={`grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 transition-all duration-700 ease-in-out overflow-hidden ${
                      expandirDificuldades ? "max-h-[2000px]" : "max-h-[280px]"
                    }`}
                  >
                    {dificuldades
                      .slice(0, expandirDificuldades ? dificuldades.length : 4)
                      .map((item, idx) => (
                        <div
                          key={idx}
                          className="group relative animate-in fade-in slide-in-from-top-2"
                        >
                          <div className="flex justify-between items-end mb-2">
                            <div className="flex flex-col">
                              <span className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1">
                                {item.materia}
                              </span>
                              <span className="text-sm font-black text-slate-800">
                                Desempenho: {item.nota} / 10
                              </span>
                            </div>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden shadow-inner border border-slate-300">
                            <div
                              className="bg-gradient-to-r from-red-500 to-red-800 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(220,38,38,0.5)]"
                              style={{ width: `${(item.nota / 10) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                  </div>

                  {dificuldades.length > 4 && (
                    <div className="mt-10 flex justify-center border-t border-slate-200 pt-6">
                      <button
                        onClick={() =>
                          setExpandirDificuldades(!expandirDificuldades)
                        }
                        className="group flex items-center gap-3 px-6 py-2 bg-slate-100 hover:bg-red-600 rounded-full transition-all duration-300"
                      >
                        <span className="text-xs font-black uppercase tracking-widest text-slate-500 group-hover:text-white">
                          {expandirDificuldades
                            ? "Recolher Alertas"
                            : `Ver todos os ${dificuldades.length} alertas`}
                        </span>
                        {expandirDificuldades ? (
                          <ChevronUp className="h-4 w-4 text-slate-400 group-hover:text-white transition-transform" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-white transition-transform" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Gráfico de Evolução de Moedas */}
        <GraficoMoedas />

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
