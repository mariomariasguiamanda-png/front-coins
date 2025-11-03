import { AdminLayout } from "@/components/adm/AdminLayout";
import { Card, CardContent } from "@/components/ui/Card";
import {
  MessageCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  BarChart2,
  ChevronLeft,
  TrendingUp,
  Users,
  ThumbsUp,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function SuporteAnalyticsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6 pb-8">
        {/* Header */}
        <header className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                <BarChart2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Analytics e Métricas</h1>
                <p className="text-gray-600 mt-1">Indicadores de desempenho do suporte</p>
              </div>
            </div>
            <Link href="/adm/suporte" className="no-underline">
              <Button variant="outline" className="rounded-lg inline-flex items-center gap-2">
                <ChevronLeft className="h-4 w-4" />
                Voltar ao hub
              </Button>
            </Link>
          </div>

          {/* Primary Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="rounded-xl border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total de Chamados</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">48</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-l-4 border-l-amber-500 bg-gradient-to-br from-amber-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tempo Médio</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">2.5h</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Taxa Resolução</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">92%</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-l-4 border-l-red-500 bg-gradient-to-br from-red-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pendentes &gt; Prazo</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">3</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </header>

        {/* Secondary Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="rounded-xl shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Satisfação</p>
                  <p className="text-2xl font-bold text-purple-600 mt-1">94%</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <ThumbsUp className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Atendentes Ativos</p>
                  <p className="text-2xl font-bold text-blue-600 mt-1">8</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Crescimento</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">+12%</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Esta Semana</p>
                  <p className="text-2xl font-bold text-amber-600 mt-1">32</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Overview */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="rounded-xl shadow-sm">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-xl"></div>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-blue-600" />
                Chamados por Status
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-amber-50 to-white border border-amber-100">
                  <span className="text-sm font-medium text-gray-700">Abertos</span>
                  <span className="text-lg font-bold text-amber-600">12</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-blue-50 to-white border border-blue-100">
                  <span className="text-sm font-medium text-gray-700">Em Andamento</span>
                  <span className="text-lg font-bold text-blue-600">18</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-green-50 to-white border border-green-100">
                  <span className="text-sm font-medium text-gray-700">Resolvidos</span>
                  <span className="text-lg font-bold text-green-600">156</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl shadow-sm">
            <div className="h-2 bg-gradient-to-r from-green-500 to-green-600 rounded-t-xl"></div>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-600" />
                Tempo de Resposta
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-green-50 to-white border border-green-100">
                  <span className="text-sm font-medium text-gray-700">&lt; 1 hora</span>
                  <span className="text-lg font-bold text-green-600">45%</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-blue-50 to-white border border-blue-100">
                  <span className="text-sm font-medium text-gray-700">1-4 horas</span>
                  <span className="text-lg font-bold text-blue-600">35%</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-amber-50 to-white border border-amber-100">
                  <span className="text-sm font-medium text-gray-700">&gt; 4 horas</span>
                  <span className="text-lg font-bold text-amber-600">20%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Categories */}
        <Card className="rounded-xl shadow-sm">
          <div className="h-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-t-xl"></div>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-purple-600" />
              Categorias Mais Frequentes
            </h3>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-white border border-blue-100">
                <p className="text-sm font-medium text-gray-700 mb-1">Técnico</p>
                <p className="text-2xl font-bold text-blue-600">28</p>
                <p className="text-xs text-gray-500 mt-1">58% do total</p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-white border border-green-100">
                <p className="text-sm font-medium text-gray-700 mb-1">Pedagógico</p>
                <p className="text-2xl font-bold text-green-600">14</p>
                <p className="text-xs text-gray-500 mt-1">29% do total</p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-white border border-purple-100">
                <p className="text-sm font-medium text-gray-700 mb-1">Administrativo</p>
                <p className="text-2xl font-bold text-purple-600">6</p>
                <p className="text-xs text-gray-500 mt-1">13% do total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
