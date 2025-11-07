import { AdminLayout } from "@/components/adm/AdminLayout";
import { DashboardCards } from "@/components/adm/DashboardCards";
import { Card, CardContent } from "@/components/ui/Card";
import { Skeleton, SkeletonStats } from "@/components/ui/Skeleton";
import { 
  AlertTriangle, 
  BarChart2, 
  PieChart, 
  TrendingUp, 
  Clock,
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
import { toast } from "sonner";

// Mock data - replace with API calls
const studentEvolutionData = [
  { month: "Jan", active: 150, total: 180 },
  { month: "Fev", active: 180, total: 200 },
  { month: "Mar", active: 200, total: 230 },
  { month: "Abr", active: 220, total: 250 },
  { month: "Mai", active: 250, total: 280 },
  { month: "Jun", active: 280, total: 320 },
];

const coinsByDisciplineData = [
  { discipline: "Matemática", coins: 5000, students: 120 },
  { discipline: "Física", coins: 3500, students: 95 },
  { discipline: "Química", coins: 4200, students: 110 },
  { discipline: "Biologia", coins: 3800, students: 100 },
];

const activityData = [
  { day: "Seg", purchases: 45, coins: 1200 },
  { day: "Ter", purchases: 52, coins: 1450 },
  { day: "Qua", purchases: 38, coins: 980 },
  { day: "Qui", purchases: 61, coins: 1680 },
  { day: "Sex", purchases: 48, coins: 1300 },
  { day: "Sáb", purchases: 25, coins: 650 },
  { day: "Dom", purchases: 18, coins: 420 },
];

const COLORS = ["#8b5cf6", "#3b82f6", "#22c55e", "#eab308"];

const recentActivities = [
  {
    id: 1,
    type: "user",
    message: "Novo professor cadastrado: Maria Silva",
    time: "5 min atrás",
    status: "success",
  },
  {
    id: 2,
    type: "coin",
    message: "150 moedas distribuídas em Matemática",
    time: "12 min atrás",
    status: "info",
  },
  {
    id: 3,
    type: "alert",
    message: "Sistema de backup concluído",
    time: "1 hora atrás",
    status: "success",
  },
  {
    id: 4,
    type: "purchase",
    message: "Compra realizada: João - Certificado",
    time: "2 horas atrás",
    status: "info",
  },
];

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  // Simulate loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

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

  // Cálculo de métricas
  const metrics = useMemo(() => {
    const lastMonth = studentEvolutionData[studentEvolutionData.length - 2];
    const currentMonth = studentEvolutionData[studentEvolutionData.length - 1];
    const growth = ((currentMonth.active - lastMonth.active) / lastMonth.active) * 100;
    
    return {
      studentGrowth: growth.toFixed(1),
      coinDistributionRate: ((dashboardStats.coins.distributed / dashboardStats.coins.total) * 100).toFixed(1),
      activeRate: ((dashboardStats.students.active / dashboardStats.students.total) * 100).toFixed(1),
    };
  }, [dashboardStats]);

  return (
    <AdminLayout>
      <div className="space-y-6 pb-8">
        {/* Header com Welcome Message */}
        <header className="space-y-1">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Bem-vindo de volta! Aqui está o resumo do sistema hoje.
              </p>
            </div>
            <div className="hidden lg:flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>Última atualização: Agora</span>
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
        ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="rounded-xl border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Crescimento Mensal</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">+{metrics.studentGrowth}%</p>
                  <p className="text-xs text-gray-500 mt-1">Alunos ativos</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-l-4 border-l-violet-500 bg-gradient-to-br from-violet-50 to-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Taxa de Distribuição</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{metrics.coinDistributionRate}%</p>
                  <p className="text-xs text-gray-500 mt-1">Moedas em circulação</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-violet-100 flex items-center justify-center">
                  <Activity className="h-6 w-6 text-violet-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Taxa de Atividade</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{metrics.activeRate}%</p>
                  <p className="text-xs text-gray-500 mt-1">Alunos engajados</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        )}

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
                  href="/adm/relatorios-alunos"
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
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorTotal)"
                      name="Total"
                    />
                    <Area
                      type="monotone"
                      dataKey="active"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorActive)"
                      name="Ativos"
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
                    <p className="text-sm text-gray-500">Compras e moedas distribuídas</p>
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
                      dataKey="purchases" 
                      fill="#22c55e" 
                      radius={[8, 8, 0, 0]}
                      name="Compras"
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

          {/* Atividades Recentes e Alertas */}
          <Card className="rounded-xl shadow-sm lg:col-span-3">
            <CardContent className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Atividades Recentes
                  </h2>
                </div>
              </div>

              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div 
                    key={activity.id}
                    className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className={`h-2 w-2 rounded-full mt-2 ${
                      activity.status === 'success' ? 'bg-green-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
                    </div>
                    {activity.status === 'success' && (
                      <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  <h3 className="font-semibold text-gray-900">Alertas Importantes</h3>
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
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}