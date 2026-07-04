import Link from "next/link";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { AdmQuickActionsCard } from "@/components/adm/AdmQuickActionsCard";
import { Card, CardContent } from "@/components/ui/Card";
import { 
  BarChart2, 
  School, 
  Download, 
  LineChart as LineChartIcon,
  ArrowRight,
  TrendingUp,
  FileText
} from "lucide-react";

export default function RelatoriosHubPage() {
  // Mock stats
  const stats = {
    totalRelatorios: 156,
    exportacoesHoje: 12,
    alunosMonitorados: 450,
    turmasAtivas: 15,
  };

  const items = [
    {
      href: "/adm/relatorios-turmas",
      title: "Relatórios por Turmas",
      desc: "Evolução mensal, distribuição de moedas e ranking por turma",
      icon: School,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      gradient: "from-purple-500 to-purple-600",
    },
    {
      href: "/adm/relatorios-exportacoes",
      title: "Exportações em CSV",
      desc: "Exporte dados de alunos, turmas ou disciplinas em formato CSV",
      icon: Download,
      color: "text-green-600",
      bgColor: "bg-green-100",
      gradient: "from-green-500 to-green-600",
    },
  ];

  const quickActions = [
    {
      href: "/adm/relatorios-exportacoes",
      label: "Exportar Dados",
      icon: Download,
      accent: "green" as const,
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6 pb-8">
        {/* Header */}
        <header className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center">
              <LineChartIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Relatórios de Desempenho</h1>
              <p className="text-muted-foreground mt-1">
                Analise indicadores, monitore evolução e exporte dados
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <Card className="rounded-xl border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Exportações Hoje</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.exportacoesHoje}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <Download className="h-5 w-5 text-green-600" />
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
                    <div
                      className={`h-12 w-12 rounded-xl ${item.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}
                    >
                      <item.icon className={`h-6 w-6 ${item.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>

                  {/* Action Link */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm group-hover:text-violet-700 transition-colors">
                      <span className="font-medium text-gray-700 group-hover:text-violet-700">
                        Acessar relatório
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
          cardAccent="violet"
          columnsClassName="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
        />
      </div>
    </AdminLayout>
  );
}
