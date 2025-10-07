import { AdminLayout } from "@/components/adm/AdminLayout";
import { DashboardCards } from "@/components/adm/DashboardCards";
import { Card, CardContent } from "@/components/ui/Card";
import { AlertTriangle, BarChart2, PieChart } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
} from "recharts";

// Mock data - replace with API calls
const studentEvolutionData = [
  { month: "Jan", active: 150 },
  { month: "Fev", active: 180 },
  { month: "Mar", active: 200 },
  { month: "Abr", active: 220 },
  { month: "Mai", active: 250 },
  { month: "Jun", active: 280 },
];

const coinsByDisciplineData = [
  { discipline: "Matemática", coins: 5000 },
  { discipline: "Física", coins: 3500 },
  { discipline: "Química", coins: 4200 },
  { discipline: "Biologia", coins: 3800 },
];

const COLORS = ["#8b5cf6", "#3b82f6", "#22c55e", "#eab308"];

export default function DashboardPage() {
  // Mock stats - replace with API calls
  const dashboardStats = {
    students: {
      total: 500,
      active: 450,
      inactive: 50,
    },
    teachers: {
      total: 30,
      active: 25,
      pending: 5,
    },
    disciplines: {
      total: 12,
      active: 10,
      inactive: 2,
    },
    coins: {
      total: 50000,
      distributed: 35000,
      available: 15000,
    },
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral do sistema e indicadores principais
          </p>
        </header>

        <DashboardCards stats={dashboardStats} />

        <div className="grid gap-6 md:grid-cols-2">
          {/* Student Evolution Chart */}
          <Card className="rounded-xl">
            <CardContent className="p-6">
              <div className="mb-6 flex items-center gap-3">
                <BarChart2 className="h-5 w-5 text-violet-600" />
                <h2 className="text-lg font-semibold">
                  Evolução de Alunos Ativos
                </h2>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={studentEvolutionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="active"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Coins by Discipline Chart */}
          <Card className="rounded-xl">
            <CardContent className="p-6">
              <div className="mb-6 flex items-center gap-3">
                <PieChart className="h-5 w-5 text-violet-600" />
                <h2 className="text-lg font-semibold">
                  Moedas por Disciplina
                </h2>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={coinsByDisciplineData}
                      dataKey="coins"
                      nameKey="discipline"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {coinsByDisciplineData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts Section */}
        <Card className="rounded-xl">
          <CardContent className="p-6">
            <div className="mb-6 flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <h2 className="text-lg font-semibold">Alertas</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-yellow-500" />
                  <div>
                    <p className="font-medium">5 solicitações de suporte abertas</p>
                    <p className="text-sm text-muted-foreground">
                      2 com prioridade alta
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <div>
                    <p className="font-medium">
                      3 professores aguardando aprovação
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Pendentes há 2 dias
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}