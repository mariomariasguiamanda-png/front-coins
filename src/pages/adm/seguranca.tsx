import Link from "next/link";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Shield,
  Users,
  FileText,
  Bell,
  Settings,
  ArrowRight,
  Lock,
  AlertTriangle,
  CheckCircle,
  Activity,
} from "lucide-react";

export default function SegurancaHubPage() {
  return (
    <AdminLayout>
      <div className="space-y-6 pb-8">
        {/* Header */}
        <header className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Central de Segurança</h1>
              <p className="text-gray-600 mt-1">Gestão completa de acessos e monitoramento</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="rounded-xl border-l-4 border-l-red-500 bg-gradient-to-br from-red-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Usuários Ativos</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">156</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                    <Users className="h-5 w-5 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-l-4 border-l-amber-500 bg-gradient-to-br from-amber-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Alertas Pendentes</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">3</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">2FA Habilitado</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">85%</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <Lock className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Logs Hoje</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">247</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Activity className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </header>

        {/* Section Cards */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Gestão de Usuários */}
          <Card className="rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
            <div className="h-2 bg-gradient-to-r from-red-500 to-red-600 rounded-t-xl"></div>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                    <Users className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Gestão de Usuários</h3>
                    <p className="text-sm text-gray-600">Controle de acessos</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-green-50 to-white border border-green-100">
                  <span className="text-sm font-medium text-gray-700">Ativos</span>
                  <span className="text-lg font-bold text-green-600">156</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-amber-50 to-white border border-amber-100">
                  <span className="text-sm font-medium text-gray-700">Bloqueados</span>
                  <span className="text-lg font-bold text-amber-600">8</span>
                </div>
              </div>

              <Link href="/adm/seguranca-usuarios" className="no-underline">
                <Button className="w-full rounded-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 inline-flex items-center justify-center gap-2">
                  Acessar
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Logs de Atividades */}
          <Card className="rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-xl"></div>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Logs de Atividades</h3>
                    <p className="text-sm text-gray-600">Auditoria e histórico</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-blue-50 to-white border border-blue-100">
                  <span className="text-sm font-medium text-gray-700">Hoje</span>
                  <span className="text-lg font-bold text-blue-600">247</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-purple-50 to-white border border-purple-100">
                  <span className="text-sm font-medium text-gray-700">Esta Semana</span>
                  <span className="text-lg font-bold text-purple-600">1,542</span>
                </div>
              </div>

              <Link href="/adm/seguranca-logs" className="no-underline">
                <Button className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 inline-flex items-center justify-center gap-2">
                  Acessar
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Notificações */}
          <Card className="rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
            <div className="h-2 bg-gradient-to-r from-amber-500 to-amber-600 rounded-t-xl"></div>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                    <Bell className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Notificações</h3>
                    <p className="text-sm text-gray-600">Alertas do sistema</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-amber-50 to-white border border-amber-100">
                  <span className="text-sm font-medium text-gray-700">Pendentes</span>
                  <span className="text-lg font-bold text-amber-600">3</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-green-50 to-white border border-green-100">
                  <span className="text-sm font-medium text-gray-700">Lidas</span>
                  <span className="text-lg font-bold text-green-600">124</span>
                </div>
              </div>

              <Link href="/adm/seguranca-notificacoes" className="no-underline">
                <Button className="w-full rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 inline-flex items-center justify-center gap-2">
                  Acessar
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Configurações */}
          <Card className="rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
            <div className="h-2 bg-gradient-to-r from-green-500 to-green-600 rounded-t-xl"></div>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                    <Settings className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Configurações</h3>
                    <p className="text-sm text-gray-600">Políticas de segurança</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-green-50 to-white border border-green-100">
                  <span className="text-sm font-medium text-gray-700">2FA</span>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-blue-50 to-white border border-blue-100">
                  <span className="text-sm font-medium text-gray-700">Backup</span>
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                </div>
              </div>

              <Link href="/adm/seguranca-configuracoes" className="no-underline">
                <Button className="w-full rounded-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 inline-flex items-center justify-center gap-2">
                  Acessar
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="rounded-xl shadow-sm border-0 bg-gradient-to-br from-red-50 to-white">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Link 
                href="/adm/seguranca-usuarios?action=bloquear"
                className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-200 hover:border-red-300 hover:shadow-sm transition-all"
              >
                <div className="h-8 w-8 rounded-lg bg-red-100 flex items-center justify-center">
                  <Lock className="h-4 w-4 text-red-600" />
                </div>
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Bloquear Usuário</span>
              </Link>

              <Link 
                href="/adm/seguranca-logs?filter=today"
                className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Ver Logs de Hoje</span>
              </Link>

              <Link 
                href="/adm/seguranca-notificacoes?status=pendentes"
                className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-200 hover:border-amber-300 hover:shadow-sm transition-all"
              >
                <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                </div>
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Alertas Pendentes</span>
              </Link>

              <Link 
                href="/adm/seguranca-configuracoes"
                className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-200 hover:border-green-300 hover:shadow-sm transition-all"
              >
                <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <Settings className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Configurar 2FA</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}