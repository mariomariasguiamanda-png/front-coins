import { Card, CardContent } from "@/components/ui/Card";
import { Award, BarChart2, BookOpen, Clock, Users } from "lucide-react";

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

export function DashboardProfessor({ teacherName, activities = [] }: DashboardProps) {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">
          Bem-vindo(a), Professor(a) {teacherName}
        </h1>
        <p className="text-muted-foreground">
          Acompanhe suas atividades e o desempenho dos alunos
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {activities.map((activity, index) => (
          <Card key={index} className={`rounded-xl border-l-4 ${activity.color}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{activity.discipline}</h3>
                <BookOpen className="h-5 w-5 text-muted-foreground" />
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total de atividades:</span>
                  <span className="font-medium">{activity.total}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Pendentes:</span>
                  <span className="font-medium text-yellow-600">{activity.pending}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Corrigidas:</span>
                  <span className="font-medium text-green-600">{activity.corrected}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-violet-600" />
              <h3 className="font-semibold">Desempenho por Turma</h3>
            </div>
            <div className="mt-4 h-[200px] flex items-center justify-center text-muted-foreground">
              [Gráfico será implementado aqui]
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-violet-600" />
              <h3 className="font-semibold">Ranking da Turma</h3>
            </div>
            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🥇</span>
                <div className="flex-1">
                  <p className="font-medium">João Silva</p>
                  <p className="text-sm text-muted-foreground">950 moedas</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🥈</span>
                <div className="flex-1">
                  <p className="font-medium">Maria Santos</p>
                  <p className="text-sm text-muted-foreground">820 moedas</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🥉</span>
                <div className="flex-1">
                  <p className="font-medium">Pedro Oliveira</p>
                  <p className="text-sm text-muted-foreground">780 moedas</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}