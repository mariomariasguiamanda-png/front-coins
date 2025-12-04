import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import AlunoLayout from "../../components/layout/AlunoLayout";
import { Card, CardContent } from "../../components/ui/Card";
import { TrendingUp, Award, BookOpen, Target } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

// Dynamic import para o gráfico
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
  id: number;
  disciplina: string;
  atividade: string;
  status: string;
  moedas: number;
};

type DashboardData = {
  totalMoedas: number;
  atividadesConcluidas: number;
  disciplinasAtivas: number;
  progressoSemanal: number;
  atividadesRecentes: AtividadeRecente[];
};

export default function Inicio() {
  const [dados, setDados] = useState<DashboardData>({
    totalMoedas: 0,
    atividadesConcluidas: 0,
    disciplinasAtivas: 0,
    progressoSemanal: 0,
    atividadesRecentes: [],
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function carregarDashboardAluno() {
      try {
        setLoading(true);
        setError(null);

        // 1) Sessão do usuário logado (Supabase Auth)
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;
        if (!session) {
          setError("Sessão expirada. Faça login novamente.");
          setLoading(false);
          return;
        }

        const authUserId = session.user.id; // UUID do Supabase Auth

        // 2) Buscar o usuário na tabela "usuarios" usando auth_user_id
        const { data: usuarioRow, error: usuarioError } = await supabase
          .from("usuarios")
          .select("id_usuario, auth_user_id")
          .eq("auth_user_id", authUserId)
          .single();

        if (usuarioError) throw usuarioError;
        if (!usuarioRow) {
          setError("Usuário não encontrado na tabela usuarios.");
          setLoading(false);
          return;
        }

        // ESTE é o ID que é usado nas tabelas relacionais (alunos_atividades, alunos_turmas, transacoes_moedas)
        const alunoId = usuarioRow.id_usuario as number;

        // 3) TOTAL DE MOEDAS (tabela transacoes_moedas)
        const { data: transacoes, error: transacoesError } = await supabase
          .from("transacoes_moedas")
          .select("quantidade, tipo")
          .eq("id_aluno", alunoId);

        if (transacoesError) throw transacoesError;

        const totalMoedas =
          transacoes?.reduce((acc, t: any) => {
            const qtd = Number(t.quantidade) || 0;
            return acc + (t.tipo === "ganho" ? qtd : -qtd);
          }, 0) ?? 0;

        // 4) ATIVIDADES CONCLUÍDAS (tabela alunos_atividades)
        const {
          data: atividadesConcluidasData,
          error: atvError,
        } = await supabase
          .from("alunos_atividades")
          .select("status")
          .eq("id_aluno", alunoId)
          .eq("status", "concluida");

        if (atvError) throw atvError;

        const atividadesConcluidas = atividadesConcluidasData?.length ?? 0;

        // 5) DISCIPLINAS / TURMAS ATIVAS (tabela alunos_turmas)
        const { data: turmasData, error: turmasError } = await supabase
          .from("alunos_turmas")
          .select("id_turma")
          .eq("id_aluno", alunoId);

        if (turmasError) throw turmasError;

        const disciplinasAtivas = turmasData?.length ?? 0;

        // 6) PROGRESSO SEMANAL (atividades concluídas nos últimos 7 dias)
        const seteDiasAtras = new Date();
        seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);

        const { data: atividadesSemana, error: semanaError } = await supabase
          .from("alunos_atividades")
          .select("id_atividade, concluido_em")
          .eq("id_aluno", alunoId)
          .eq("status", "concluida")
          .gte("concluido_em", seteDiasAtras.toISOString());

        if (semanaError) throw semanaError;

        const progressoSemanal = Math.min(
          100,
          Math.round(((atividadesSemana?.length ?? 0) / 20) * 100)
        );

        // 7) ATIVIDADES RECENTES
        const {
          data: atividadesRecentesData,
          error: recentesError,
        } = await supabase
          .from("alunos_atividades")
          .select(
            `
            id_atividade,
            status,
            concluido_em,
            atividades (
              titulo,
              recompensa_moedas,
              disciplinas (nome)
            )
          `
          )
          .eq("id_aluno", alunoId)
          .order("concluido_em", { ascending: false })
          .limit(5);

        if (recentesError) throw recentesError;

        const atividadesRecentes: AtividadeRecente[] =
          atividadesRecentesData?.map((item: any) => ({
            id: item.id_atividade,
            atividade: item.atividades?.titulo ?? "Atividade",
            disciplina: item.atividades?.disciplinas?.nome ?? "Disciplina",
            status: item.status,
            moedas: item.atividades?.recompensa_moedas ?? 0,
          })) ?? [];

        // 8) Atualizar o estado com tudo
        setDados({
          totalMoedas,
          atividadesConcluidas,
          disciplinasAtivas,
          progressoSemanal,
          atividadesRecentes,
        });
      } catch (err: any) {
        console.error("Erro no dashboard do aluno:", err);
        setError("Erro ao carregar dados do dashboard do aluno.");
      } finally {
        setLoading(false);
      }
    }

    carregarDashboardAluno();
  }, []);

  return (
    <AlunoLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-violet-700">Bem-vindo(a)!</h1>
          <p className="text-gray-600 mt-2">
            Resumo do seu desempenho semanal, moedas e atividades recentes.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-100 text-red-700 text-sm">
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
                    {loading ? "..." : dados.totalMoedas}
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
                    {loading ? "..." : dados.atividadesConcluidas}
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
                    {loading ? "..." : dados.disciplinasAtivas}
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
                    Progresso Semanal
                  </p>
                  <p className="text-2xl font-bold text-violet-700">
                    {loading ? "..." : `${dados.progressoSemanal}%`}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-violet-400 to-violet-500 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de evolução de moedas */}
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
                    <div className="space-y-2">
                      <div className="h-3 w-40 bg-gray-200 rounded" />
                      <div className="h-3 w-24 bg-gray-200 rounded" />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-5 w-20 bg-gray-200 rounded-full" />
                      <div className="h-3 w-24 bg-gray-200 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : dados.atividadesRecentes.length === 0 ? (
              <p className="text-sm text-gray-600">
                Você ainda não possui atividades recentes.
              </p>
            ) : (
              <div className="space-y-3">
                {dados.atividadesRecentes.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {item.atividade}
                      </p>
                      <p className="text-sm text-gray-600">
                        {item.disciplina}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === "concluida"
                            ? "bg-green-100 text-green-700"
                            : item.status === "pendente"
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
