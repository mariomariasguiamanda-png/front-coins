import { AdminLayout } from "@/components/adm/AdminLayout";
import { DashboardCards } from "@/components/adm/DashboardCards";
import { Card, CardContent } from "@/components/ui/Card";
import { Skeleton, SkeletonStats } from "@/components/ui/Skeleton";
import { 
  AlertTriangle, 
  BarChart2, 
  PieChart, 
  TrendingUp, 
  ArrowRight,
  CheckCircle2,
  XCircle,
  Activity
} from "lucide-react";
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
  AreaChart,
  Area,
} from "recharts";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { api } from "@/lib/api";

const COLORS = ["#8b5cf6", "#3b82f6", "#22c55e", "#eab308"];

type DashboardData = {
  students: { total: number; active: number; inactive: number };
  teachers: { total: number; active: number };
  disciplines: { total: number; active: number; inactive: number };
  coins: { distributed: number; spent: number; circulating: number };
  openTickets: number;
  coinsByDiscipline: { discipline: string; coins: number; students: number }[];
  activityLast7Days: { day: string; date: string; purchases: number; coins: number }[];
  studentEvolution: { month: string; total: number }[];
};

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const result = await api.get("/admin/dashboard");
        setData(result);
      } catch (err) {
        console.error("Erro ao carregar dashboard:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const studentEvolutionData = data?.studentEvolution ?? [];
  const coinsByDisciplineData = data?.coinsByDiscipline ?? [];
  const activityData = data?.activityLast7Days ?? [];

  const dashboardStats = {
    students: data?.students ?? { total: 0, active: 0, inactive: 0 },
    teachers: { ...(data?.teachers ?? { total: 0, active: 0 }), pending: 0 },
    disciplines: data?.disciplines ?? { total: 0, active: 0, inactive: 0 },
    coins: {
      total: data?.coins.distributed ?? 0,
      distributed: data?.coins.spent ?? 0,
      available: data?.coins.circulating ?? 0,
    },
  };

  // Cálculo de métricas
  const metrics = useMemo(() => {
    const lastMonth = studentEvolutionData[studentEvolutionData.length - 2];
    const currentMonth = studentEvolutionData[studentEvolutionData.length - 1];
    const growth =
      lastMonth && currentMonth && lastMonth.total > 0
        ? ((currentMonth.total - lastMonth.total) / lastMonth.total) * 100
        : 0;

    return {
      studentGrowth: growth.toFixed(1),
      coinDistributionRate:
        dashboardStats.coins.total > 0
          ? ((dashboardStats.coins.distributed / dashboardStats.coins.total) * 100).toFixed(1)
          : "0",
      activeRate:
        dashboardStats.students.total > 0
          ? ((dashboardStats.students.active / dashboardStats.students.total) * 100).toFixed(1)
          : "0",
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <AdminLayout>
      <div className="space-y-6 pb-8">
        {/* Header com Welcome Message */}
        <header className="space-y-1">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Bem-vindo de volta! Aqui está o resumo do sistema hoje.
              </p>
            </div>
          </div>
        </header>

        {/* Cards Principais */}
        {loading ? (
          <SkeletonStats />
        ) : (
          <DashboardCards stats={dashboardStats} />
        )}

        {/* Métricas Rápidas */}
        {loading ? (
          <div className="grid gap-4 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-xl border border-gray-200 bg-white p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-7 w-20" />
                    <Skeleton className="h-2 w-24" />
                  </div>
                  <Skeleton className="h-12 w-12 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {/* Gráficos Principais */}
        {loading ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {[...Array(2)].map((_, i) => (
              <Card key={i} className="rounded-xl shadow-sm">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-lg" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-48" />
                        </div>
                      </div>
                    </div>
                    <Skeleton className="h-64 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Student Evolution Chart - Melhorado */}
          <Card className="rounded-xl shadow-sm">
            <CardContent className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-violet-100 flex items-center justify-center">
                    <BarChart2 className="h-5 w-5 text-violet-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Evolução de Alunos
                    </h2>
                    <p className="text-sm text-gray-500">Últimos 6 meses</p>
                  </div>
                </div>
                <Link 
                  href="/adm/relatorios-hub"
                  className="text-sm text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1"
                >
                  Ver mais
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={studentEvolutionData}>
                    <defs>
                      <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                      axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <YAxis 
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                      axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorActive)"
                      name="Alunos cadastrados"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Activity Chart - Novo */}
          <Card className="rounded-xl shadow-sm">
            <CardContent className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <Activity className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Atividade Semanal
                    </h2>
                    <p className="text-sm text-gray-500">Moedas distribuídas</p>
                  </div>
                </div>
                <Link 
                  href="/adm/compras-transacoes"
                  className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
                >
                  Ver mais
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="day" 
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                      axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <YAxis 
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                      axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="coins" 
                      fill="#22c55e" 
                      radius={[8, 8, 0, 0]}
                      name="Moedas distribuídas"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        )}

        {/* Segunda linha de gráficos */}
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Coins by Discipline - Melhorado */}
          <Card className="rounded-xl shadow-sm lg:col-span-2">
            <CardContent className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <PieChart className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Moedas por Disciplina
                    </h2>
                    <p className="text-sm text-gray-500">Distribuição atual</p>
                  </div>
                </div>
              </div>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={coinsByDisciplineData}
                      dataKey="coins"
                      nameKey="discipline"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label={(entry: any) => `${entry.name} ${(entry.percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {coinsByDisciplineData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Alertas Importantes */}
          <Card className="rounded-xl shadow-sm lg:col-span-3">
            <CardContent className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Alertas Importantes</h2>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-amber-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">5 solicitações de suporte abertas</p>
                      <p className="text-xs text-gray-600">2 com prioridade alta</p>
                    </div>
                  </div>
                  <Link 
                    href="/adm/suporte-chamados"
                    className="text-xs text-amber-700 hover:text-amber-800 font-medium"
                  >
                    Ver →
                  </Link>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">3 professores aguardando aprovação</p>
                      <p className="text-xs text-gray-600">Pendentes há 2 dias</p>
                    </div>
                  </div>
                  <Link 
                    href="/adm/usuarios-lista"
                    className="text-xs text-blue-700 hover:text-blue-800 font-medium"
                  >
                    Ver →
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}