import { Card, CardContent } from "@/components/ui/Card";
import {
  Award,
  BarChart2,
  BookOpen,
  Clock,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Activity,
  Send,
} from "lucide-react";
import Link from "next/link";

interface ActivityCard {
  discipline: string;
  codigo: string;
  total: number;
  pending: number;
  corrected: number;
}

interface TurmaResumo {
  turma: string;
  media: number | null;
  participacao: number;
}

interface RankingAluno {
  nome: string;
  saldo: number;
}

interface AtividadeRecente {
  tipo: "entrega" | "correcao";
  mensagem: string;
  data: string;
}

interface DashboardProps {
  teacherName: string;
  activities: ActivityCard[];
  turmas: TurmaResumo[];
  ranking: RankingAluno[];
  atividadesRecentes: AtividadeRecente[];
}

const CORES_DISCIPLINA = [
  "border-blue-500",
  "border-green-500",
  "border-purple-500",
  "border-amber-500",
  "border-pink-500",
  "border-cyan-500",
];

const MEDALHAS = ["🥇", "🥈", "🥉"];

const formatarTempoRelativo = (dataIso: string): string => {
  const diffMs = Date.now() - new Date(dataIso).getTime();
  const diffMin = Math.round(diffMs / 60000);
  if (diffMin < 1) return "agora mesmo";
  if (diffMin < 60) return `${diffMin} min atrás`;
  const diffHoras = Math.round(diffMin / 60);
  if (diffHoras < 24) return `${diffHoras}h atrás`;
  return `${Math.round(diffHoras / 24)}d atrás`;
};

export function DashboardProfessor({
  teacherName,
  activities = [],
  turmas = [],
  ranking = [],
  atividadesRecentes = [],
}: DashboardProps) {
  const totalActivities = activities.reduce((acc, act) => acc + act.total, 0);
  const totalPending = activities.reduce((acc, act) => acc + act.pending, 0);
  const totalCorrected = activities.reduce((acc, act) => acc + act.corrected, 0);
  const completionRate = totalActivities > 0 ? ((totalCorrected / totalActivities) * 100).toFixed(0) : 0;

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <header className="space-y-1">
        <h1 className="text-3xl font-bold text-gray-900">
          Bem-vindo(a), Professor(a) {teacherName}
        </h1>
        <p className="text-gray-600">
          Acompanhe suas atividades e o desempenho dos alunos
        </p>
      </header>

      {/* Cards de Resumo Rápido */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="rounded-xl shadow-sm border-l-4 border-l-violet-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{totalActivities}</p>
                <p className="text-xs text-gray-500 mt-1">Atividades</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-violet-100 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-violet-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{totalPending}</p>
                <p className="text-xs text-gray-500 mt-1">Para corrigir</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Corrigidas</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{totalCorrected}</p>
                <p className="text-xs text-gray-500 mt-1">Finalizadas</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taxa</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{completionRate}%</p>
                <p className="text-xs text-gray-500 mt-1">Conclusão</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cards de Disciplinas */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Suas Disciplinas</h2>
          <Link
            href="/professor/disciplinas"
            className="text-sm text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1"
          >
            Ver todas
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {activities.length === 0 ? (
          <Card className="rounded-xl shadow-sm">
            <CardContent className="p-8 text-center text-gray-500">
              Você ainda não leciona nenhuma disciplina.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activities.map((activity, index) => {
              const cor = CORES_DISCIPLINA[index % CORES_DISCIPLINA.length];
              const progresso = activity.total > 0 ? (activity.corrected / activity.total) * 100 : 0;

              return (
                <Link key={activity.codigo} href={`/professor/disciplinas?view=${activity.codigo}`}>
                  <Card className={`rounded-xl border-l-4 ${cor} hover:shadow-md transition-shadow cursor-pointer group`}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-violet-600 transition-colors">
                          {activity.discipline}
                        </h3>
                        <BookOpen className="h-5 w-5 text-gray-400 group-hover:text-violet-600 transition-colors" />
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Total de atividades:</span>
                          <span className="text-sm font-semibold text-gray-900">{activity.total}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Pendentes:</span>
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-sm font-semibold">
                            <Clock className="h-3 w-3" />
                            {activity.pending}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Corrigidas:</span>
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                            <CheckCircle2 className="h-3 w-3" />
                            {activity.corrected}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-600">Progresso</span>
                          <span className="text-xs font-semibold text-gray-900">
                            {progresso.toFixed(0)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-violet-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progresso}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Gráficos e Informações */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Desempenho por Turma */}
        <Card className="rounded-xl shadow-sm lg:col-span-3">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-violet-100 flex items-center justify-center">
                  <BarChart2 className="h-5 w-5 text-violet-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Desempenho por Turma</h3>
                  <p className="text-sm text-gray-500">Média e participação</p>
                </div>
              </div>
              <Link
                href="/professor/desempenho"
                className="text-sm text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1"
              >
                Ver mais
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {turmas.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">Nenhuma turma com dados ainda.</p>
            ) : (
              <div className="space-y-6">
                {turmas.map((turma) => (
                  <div key={turma.turma} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900">{turma.turma}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-gray-600">
                          Média: <span className="font-semibold text-violet-600">{turma.media !== null ? turma.media.toFixed(1) : "-"}</span>
                        </span>
                        <span className="text-xs text-gray-600">
                          Participação: <span className="font-semibold text-green-600">{turma.participacao}%</span>
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-500">Média</span>
                          <span className="text-xs font-medium text-violet-600">
                            {turma.media !== null ? `${turma.media.toFixed(1)}/10` : "-"}
                          </span>
                        </div>
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-violet-500 to-violet-600 rounded-full transition-all duration-500"
                            style={{ width: `${((turma.media ?? 0) / 10) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-500">Participação</span>
                          <span className="text-xs font-medium text-green-600">{turma.participacao}%</span>
                        </div>
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500"
                            style={{ width: `${turma.participacao}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Ranking e Atividades Recentes */}
        <Card className="rounded-xl shadow-sm lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Award className="h-5 w-5 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Ranking de Moedas</h3>
            </div>

            <div className="space-y-3 mb-6">
              {ranking.length === 0 ? (
                <p className="text-sm text-gray-500">Nenhum aluno com moedas ainda.</p>
              ) : (
                ranking.map((aluno, index) => (
                  <Link
                    key={aluno.nome}
                    href="/professor/desempenho#ranking-individual"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <span className="text-2xl">{MEDALHAS[index] ?? "🎖️"}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 group-hover:text-violet-600 transition-colors">{aluno.nome}</p>
                      <p className="text-sm text-gray-600">{aluno.saldo} moedas</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-violet-600 transition-colors" />
                  </Link>
                ))
              )}
            </div>

            {/* Atividades Recentes */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="h-4 w-4 text-violet-600" />
                <h4 className="text-sm font-semibold text-gray-900">Atividades Recentes</h4>
              </div>
              {atividadesRecentes.length === 0 ? (
                <p className="text-sm text-gray-500">Nenhuma atividade recente.</p>
              ) : (
                <div className="space-y-3">
                  {atividadesRecentes.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      {item.tipo === "correcao" ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <Send className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{item.mensagem}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{formatarTempoRelativo(item.data)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
