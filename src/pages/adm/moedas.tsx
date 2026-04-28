import Link from "next/link";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { AdmQuickActionsCard } from "@/components/adm/AdmQuickActionsCard";
import { Card, CardContent } from "@/components/ui/Card";
import { 
  BarChart2, 
  Coins, 
  ArrowUpDown,
  ArrowRight,
  TrendingUp,
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
    },
    { 
      href: "/adm/moedas-ajustes", 
      title: "Ajustes Manuais", 
      desc: "Realize créditos ou débitos com justificativa e acompanhe logs",
      icon: ArrowUpDown,
      color: "text-green-600",
      bgColor: "bg-green-100",
      gradient: "from-green-500 to-green-600",
    },
  ];

  const quickActions = [
    {
      href: "/adm/moedas-ajustes",
      label: "Novo Ajuste",
      icon: ArrowUpDown,
      accent: "green" as const,
    },
    {
      href: "/adm/moedas-ajustes",
      label: "Histórico",
      icon: Coins,
      accent: "amber" as const,
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
              <p className="text-muted-foreground mt-1">
                Configure regras, monitore saldos e gerencie a economia do sistema
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
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
          </div>
        </header>

        {/* Main Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
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

        <AdmQuickActionsCard
          items={quickActions}
          cardAccent="amber"
          columnsClassName="grid gap-3 sm:grid-cols-2 lg:grid-cols-2"
        />
      </div>
    </AdminLayout>
  );
}