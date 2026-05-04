import Link from "next/link";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import {
  ShoppingCart,
  Receipt,
  Settings,
  ArrowRight,
  Calendar,
  CheckCircle,
} from "lucide-react";

export default function ComprasHubPage() {
  // Mock stats
  const stats = {
    transacoesHoje: 24,
    totalMes: 1580,
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
    },
    {
      href: "/adm/compras-configuracoes",
      title: "Configurações",
      desc: "Regras, limites e políticas",
      icon: Settings,
      color: "purple",
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-white",
    },
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
              <p className="text-muted-foreground mt-1">
                Controle de transações e troca de moedas por pontos
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
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


          </div>
        </header>

        {/* Main Sections */}
        <div className="grid gap-6 lg:grid-cols-2">
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
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}