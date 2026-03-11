import { Card, CardContent } from "@/components/ui/Card";
import { 
  Award, 
  BarChart2, 
  BookOpen, 
  Clock, 
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Activity
} from "lucide-react";
import Link from "next/link";

interface ActivityCard {
  discipline: string;
  total: number;
  pending: number;
  corrected: number;
  color: string;
}

interface DashboardProps {
  teacherName: string;
  activities: ActivityCard[];
}

// Mock data para visualizações
const performanceData = [
  { turma: "9A", media: 8.5, participacao: 92 },
  { turma: "9B", media: 7.8, participacao: 85 },
  { turma: "9C", media: 8.2, participacao: 88 },
];

const recentActivity = [
  { id: 1, type: "correction", message: "5 atividades de Matemática corrigidas", time: "10 min atrás" },
  { id: 2, type: "submission", message: "João Silva entregou Exercício 12", time: "25 min atrás" },
  { id: 3, type: "alert", message: "3 atividades próximas do prazo", time: "1 hora atrás" },
];

export function DashboardProfessor({ teacherName, activities = [] }: DashboardProps) {
  // Calcular estatísticas gerais
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
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {activities.map((activity, index) => {
            // Mapeamento de disciplinas para códigos
            const disciplineCodes: Record<string, string> = {
              "Matemática": "MAT301",
              "Física": "FIS201",
              "Química": "QUI101",
              "História": "HIS102",
              "Biologia": "BIO201",
              "Português": "POR101",
            };
            const disciplineCode = disciplineCodes[activity.discipline] || "";
            
            return (
              <Link key={index} href={`/professor/disciplinas?view=${disciplineCode}`}>
                <Card className={`rounded-xl border-l-4 ${activity.color} hover:shadow-md transition-shadow cursor-pointer group`}>
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

                  {/* Progress Bar */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-600">Progresso</span>
                      <span className="text-xs font-semibold text-gray-900">
                        {((activity.corrected / activity.total) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-violet-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(activity.corrected / activity.total) * 100}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )})}
        </div>
      </div>

      {/* Gráficos e Informações */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Desempenho por Turma com barras CSS */}
        <Card className="rounded-xl shadow-sm lg:col-span-3">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-violet-100 flex items-center justify-center">
                  <BarChart2 className="h-5 w-5 text-violet-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Desempenho por Turma</h3>
                  <p className="text-sm text-gray-500">Média</p>
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
            
            <div className="space-y-6">
              {performanceData.map((turma) => (
                <div key={turma.turma} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900">{turma.turma}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-gray-600">Média: <span className="font-semibold text-violet-600">{turma.media}</span></span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">Média</span>
                      <span className="text-xs font-medium text-violet-600">{turma.media}/10</span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-violet-500 to-violet-600 rounded-full transition-all duration-500"
                        style={{ width: `${(turma.media / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ranking e Atividades Recentes */}
        <Card className="rounded-xl shadow-sm lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Award className="h-5 w-5 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Ranking da Turma</h3>
            </div>
            
            <div className="space-y-3 mb-6">
              <Link href="/professor/desempenho#ranking-individual" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                <span className="text-2xl">🥇</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 group-hover:text-violet-600 transition-colors">João Silva</p>
                  <p className="text-sm text-gray-600">950 moedas</p>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-violet-600 transition-colors" />
              </Link>
              
              <Link href="/professor/desempenho#ranking-individual" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                <span className="text-2xl">🥈</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 group-hover:text-violet-600 transition-colors">Maria Santos</p>
                  <p className="text-sm text-gray-600">820 moedas</p>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-violet-600 transition-colors" />
              </Link>
              
              <Link href="/professor/desempenho#ranking-individual" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                <span className="text-2xl">🥉</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 group-hover:text-violet-600 transition-colors">Pedro Oliveira</p>
                  <p className="text-sm text-gray-600">780 moedas</p>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-violet-600 transition-colors" />
              </Link>
            </div>

            {/* Atividades Recentes removidas conforme solicitado */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}