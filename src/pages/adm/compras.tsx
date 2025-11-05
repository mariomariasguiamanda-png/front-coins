import Link from "next/link";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import {
  ShoppingCart,
  TrendingUp,
  Receipt,
  Settings,
  ArrowRight,
  DollarSign,
  Users,
  Calendar,
  CheckCircle,
} from "lucide-react";

export default function ComprasHubPage() {
  // Mock stats
  const stats = {
    transacoesHoje: 24,
    totalMes: 1580,
    pontosTrocados: 4250,
    mediaCompra: 8.5,
  };

  const sections = [
    {
      href: "/adm/compras-transacoes",
      title: "Gerenciar Transações",
      desc: "Histórico completo e controle de compras",
      icon: Receipt,
      color: "blue",
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-white",
      stats: [
        { label: "Transações Hoje", value: stats.transacoesHoje },
        { label: "Total no Mês", value: stats.totalMes },
      ],
    },
    {
      href: "/adm/compras-relatorios",
      title: "Relatórios e Análises",
      desc: "KPIs e histórico por disciplina",
      icon: TrendingUp,
      color: "green",
      gradient: "from-green-500 to-green-600",
      bgGradient: "from-green-50 to-white",
      stats: [
        { label: "Pontos Trocados", value: stats.pontosTrocados },
        { label: "Média por Compra", value: stats.mediaCompra.toFixed(1) },
      ],
    },
    {
      href: "/adm/compras-configuracoes",
      title: "Configurações",
      desc: "Regras, limites e políticas",
      icon: Settings,
      color: "purple",
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-white",
      stats: [
        { label: "Limite por Compra", value: "5 pts" },
        { label: "Limite Diário", value: "200 ⚡" },
      ],
    },
  ];

  const quickActions = [
    { label: "Gerenciar Transações", href: "/adm/compras-transacoes", icon: Receipt },
    { label: "Ver Relatórios", href: "/adm/compras-relatorios", icon: TrendingUp },
    { label: "Ajustar Limites", href: "/adm/compras-configuracoes", icon: Settings },
    { label: "Exportar Dados", href: "/adm/compras-relatorios", icon: DollarSign },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6 pb-8">
        {/* Header */}
        <header className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Compras</h1>
              <p className="text-gray-600 mt-1">
                Controle de transações e troca de moedas por pontos
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="rounded-xl border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Transações Hoje</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.transacoesHoje}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total no Mês</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalMes}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-l-4 border-l-amber-500 bg-gradient-to-br from-amber-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pontos Trocados</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.pontosTrocados}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Média por Compra</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.mediaCompra.toFixed(1)}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </header>

        {/* Main Sections */}
        <div className="grid gap-6 lg:grid-cols-3">
          {sections.map((section) => (
            <Link key={section.href} href={section.href} className="block group">
              <Card className="rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${section.gradient}`}></div>
                <CardContent className={`p-6 bg-gradient-to-br ${section.bgGradient}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`h-12 w-12 rounded-lg bg-gradient-to-br ${section.gradient} flex items-center justify-center`}
                    >
                      <section.icon className="h-6 w-6 text-white" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">{section.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{section.desc}</p>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200">
                    {section.stats.map((stat, idx) => (
                      <div key={idx}>
                        <p className="text-xs text-gray-500">{stat.label}</p>
                        <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="rounded-xl shadow-sm border-0 bg-gradient-to-br from-green-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingCart className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Ações Rápidas</h3>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Link 
                href="/adm/compras-transacoes"
                className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-200 hover:border-green-300 hover:shadow-sm transition-all"
              >
                <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <Receipt className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Gerenciar Transações</span>
              </Link>

              <Link 
                href="/adm/compras-relatorios"
                className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-200 hover:border-green-300 hover:shadow-sm transition-all"
              >
                <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Ver Relatórios</span>
              </Link>

              <Link 
                href="/adm/compras-configuracoes"
                className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-200 hover:border-green-300 hover:shadow-sm transition-all"
              >
                <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <Settings className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Ajustar Limites</span>
              </Link>

              <Link 
                href="/adm/compras-relatorios"
                className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-200 hover:border-green-300 hover:shadow-sm transition-all"
              >
                <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Exportar Dados</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}