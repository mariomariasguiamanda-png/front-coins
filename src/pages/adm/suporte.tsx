import Link from "next/link";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  MessageCircle,
  HelpCircle,
  FileText,
  BarChart2,
  LifeBuoy,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  Users,
  Zap,
} from "lucide-react";

export default function SuporteHubPage() {
  return (
    <AdminLayout>
      <div className="space-y-6 pb-8">
        {/* Header */}
        <header className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <LifeBuoy className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Central de Suporte</h1>
              <p className="text-gray-600 mt-1">Gerenciamento completo de atendimento e FAQs</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="rounded-xl border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Chamados Abertos</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">12</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Resolvidos Hoje</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">28</p>
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
                    <p className="text-sm font-medium text-gray-600">Tempo Médio</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">2.4h</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Satisfação</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">94%</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </header>

        {/* Section Cards */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Chamados */}
          <Card className="rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-xl"></div>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Gerenciar Chamados</h3>
                    <p className="text-sm text-gray-600">Solicitações de usuários</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-blue-50 to-white border border-blue-100">
                  <span className="text-sm font-medium text-gray-700">Abertos</span>
                  <span className="text-lg font-bold text-blue-600">12</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-green-50 to-white border border-green-100">
                  <span className="text-sm font-medium text-gray-700">Resolvidos</span>
                  <span className="text-lg font-bold text-green-600">156</span>
                </div>
              </div>

              <Link href="/adm/suporte-chamados" className="no-underline">
                <Button className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 inline-flex items-center justify-center gap-2">
                  Acessar
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* FAQs */}
          <Card className="rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
            <div className="h-2 bg-gradient-to-r from-green-500 to-green-600 rounded-t-xl"></div>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                    <HelpCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Base de Conhecimento</h3>
                    <p className="text-sm text-gray-600">FAQs e tutoriais</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-green-50 to-white border border-green-100">
                  <span className="text-sm font-medium text-gray-700">Artigos</span>
                  <span className="text-lg font-bold text-green-600">45</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-purple-50 to-white border border-purple-100">
                  <span className="text-sm font-medium text-gray-700">Categorias</span>
                  <span className="text-lg font-bold text-purple-600">8</span>
                </div>
              </div>

              <Link href="/adm/suporte-faqs" className="no-underline">
                <Button className="w-full rounded-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 inline-flex items-center justify-center gap-2">
                  Acessar
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Respostas Padrão */}
          <Card className="rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
            <div className="h-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-t-xl"></div>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Respostas Padrão</h3>
                    <p className="text-sm text-gray-600">Templates de resposta</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-purple-50 to-white border border-purple-100">
                  <span className="text-sm font-medium text-gray-700">Templates</span>
                  <span className="text-lg font-bold text-purple-600">24</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-amber-50 to-white border border-amber-100">
                  <span className="text-sm font-medium text-gray-700">Mais Usados</span>
                  <span className="text-lg font-bold text-amber-600">12</span>
                </div>
              </div>

              <Link href="/adm/suporte-respostas" className="no-underline">
                <Button className="w-full rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 inline-flex items-center justify-center gap-2">
                  Acessar
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Card */}
        <Card className="rounded-xl shadow-sm">
          <div className="h-2 bg-gradient-to-r from-amber-500 to-amber-600 rounded-t-xl"></div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                  <BarChart2 className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Analytics e Métricas</h3>
                  <p className="text-sm text-gray-600">Indicadores de desempenho do suporte</p>
                </div>
              </div>
              <Link href="/adm/suporte-analytics" className="no-underline">
                <Button className="rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 inline-flex items-center gap-2">
                  Ver Relatórios
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="rounded-xl shadow-sm border-0 bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              Ações Rápidas
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Link 
                href="/adm/suporte-chamados?status=aberto"
                className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Chamados Pendentes</span>
              </Link>
              
              <Link 
                href="/adm/suporte-faqs?action=new"
                className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <HelpCircle className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Novo FAQ</span>
              </Link>
              
              <Link 
                href="/adm/suporte-respostas?action=new"
                className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Nova Resposta</span>
              </Link>
              
              <Link 
                href="/adm/suporte-analytics"
                className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <BarChart2 className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Ver Métricas</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}