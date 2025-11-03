import Link from "next/link";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { 
  BarChart2, 
  Coins, 
  Settings, 
  ArrowUpDown,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Activity
} from "lucide-react";

export default function MoedasHubPage() {
  // Mock stats - substituir por dados reais da API
  const stats = {
    totalCirculacao: 50000,
    distribuidas: 35000,
    disponiveis: 15000,
    taxaDistribuicao: 70,
    mediaAluno: 70,
    ajustesHoje: 12,
  };

  const items = [
    { 
      href: "/adm/moedas-relatorio-saldos", 
      title: "Controle de Saldos", 
      desc: "Visualize relatórios completos, histórico de movimentações e saldos por aluno",
      icon: BarChart2,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      gradient: "from-blue-500 to-blue-600",
      stats: [
        { label: "Alunos", value: 500 },
        { label: "Movimentações", value: 1250 },
      ]
    },
    { 
      href: "/adm/moedas-configuracoes", 
      title: "Regras e Limites", 
      desc: "Configure regras de distribuição automática e limites por período",
      icon: Settings,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      gradient: "from-purple-500 to-purple-600",
      stats: [
        { label: "Regras Ativas", value: 5 },
        { label: "Limite Período", value: 500 },
      ]
    },
    { 
      href: "/adm/moedas-ajustes", 
      title: "Ajustes Manuais", 
      desc: "Realize créditos ou débitos com justificativa e acompanhe logs",
      icon: ArrowUpDown,
      color: "text-green-600",
      bgColor: "bg-green-100",
      gradient: "from-green-500 to-green-600",
      stats: [
        { label: "Hoje", value: stats.ajustesHoje },
        { label: "Semana", value: 87 },
      ]
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6 pb-8">
        {/* Header */}
        <header className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <Coins className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestão de Moedas</h1>
              <p className="text-gray-600 mt-1">
                Configure regras, monitore saldos e gerencie a economia do sistema
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="rounded-xl border-l-4 border-l-amber-500 bg-gradient-to-br from-amber-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total em Circulação</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalCirculacao.toLocaleString()}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Coins className="h-5 w-5 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Moedas Distribuídas</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.distribuidas.toLocaleString()}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Taxa de Distribuição</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.taxaDistribuicao}%</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Activity className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Média por Aluno</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.mediaAluno}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </header>

        {/* Main Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Link key={item.href} href={item.href} className="group">
              <Card className="rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 border-0 overflow-hidden h-full">
                {/* Gradient Header */}
                <div className={`h-2 bg-gradient-to-r ${item.gradient}`}></div>
                
                <CardContent className="p-6">
                  {/* Icon and Title */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`h-12 w-12 rounded-xl ${item.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                      <item.icon className={`h-6 w-6 ${item.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                    {item.stats.map((stat, idx) => (
                      <div key={idx} className="text-center p-2 rounded-lg bg-gray-50">
                        <p className="text-xs text-gray-600 mb-1">{stat.label}</p>
                        <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Action Link */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm group-hover:text-violet-700 transition-colors">
                      <span className="font-medium text-gray-700 group-hover:text-violet-700">
                        Acessar seção
                      </span>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-violet-700 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="rounded-xl shadow-sm border-0 bg-gradient-to-br from-amber-50 to-white">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Link 
                href="/adm/moedas-relatorio-saldos"
                className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <BarChart2 className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Ver Saldos</span>
              </Link>
              
              <Link 
                href="/adm/moedas-ajustes"
                className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-200 hover:border-green-300 hover:shadow-sm transition-all"
              >
                <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <ArrowUpDown className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Novo Ajuste</span>
              </Link>

              <Link 
                href="/adm/moedas-configuracoes"
                className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-200 hover:border-purple-300 hover:shadow-sm transition-all"
              >
                <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Settings className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Configurar Regras</span>
              </Link>

              <Link 
                href="/adm/moedas-ajustes"
                className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-200 hover:border-amber-300 hover:shadow-sm transition-all"
              >
                <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Coins className="h-4 w-4 text-amber-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Histórico</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}