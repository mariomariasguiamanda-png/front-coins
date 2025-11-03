import Link from "next/link";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Paintbrush,
  Calendar as CalendarIcon,
  Link as LinkIcon,
  Shield,
  Settings,
  ArrowRight,
  Palette,
  Users,
  Clock,
  CheckCircle,
} from "lucide-react";

export default function ConfiguracoesHubPage() {
  return (
    <AdminLayout>
      <div className="space-y-6 pb-8">
        {/* Header */}
        <header className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Configurações do Sistema</h1>
              <p className="text-gray-600 mt-1">Personalize e gerencie as configurações da plataforma</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="rounded-xl border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Temas Disponíveis</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">3</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Palette className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Perfis Ativos</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">4</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Integrações</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">5</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <LinkIcon className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-l-4 border-l-amber-500 bg-gradient-to-br from-amber-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Eventos Ativos</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">12</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </header>

        {/* Section Cards */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Identidade Visual */}
          <Card className="rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
            <div className="h-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-t-xl"></div>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                    <Paintbrush className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Identidade Visual</h3>
                    <p className="text-sm text-gray-600">Personalize a aparência</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-purple-50 to-white border border-purple-100">
                  <span className="text-sm font-medium text-gray-700">Logo</span>
                  <CheckCircle className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-blue-50 to-white border border-blue-100">
                  <span className="text-sm font-medium text-gray-700">Cores</span>
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                </div>
              </div>

              <Link href="/adm/configuracoes-visual" className="no-underline">
                <Button className="w-full rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 inline-flex items-center justify-center gap-2">
                  Acessar
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Calendário */}
          <Card className="rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-xl"></div>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                    <CalendarIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Calendário Acadêmico</h3>
                    <p className="text-sm text-gray-600">Períodos e eventos</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-blue-50 to-white border border-blue-100">
                  <span className="text-sm font-medium text-gray-700">Períodos Letivos</span>
                  <span className="text-lg font-bold text-blue-600">4</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-amber-50 to-white border border-amber-100">
                  <span className="text-sm font-medium text-gray-700">Eventos</span>
                  <span className="text-lg font-bold text-amber-600">12</span>
                </div>
              </div>

              <Link href="/adm/configuracoes-calendario" className="no-underline">
                <Button className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 inline-flex items-center justify-center gap-2">
                  Acessar
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Integrações */}
          <Card className="rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
            <div className="h-2 bg-gradient-to-r from-green-500 to-green-600 rounded-t-xl"></div>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                    <LinkIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Integrações</h3>
                    <p className="text-sm text-gray-600">Serviços e APIs</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-green-50 to-white border border-green-100">
                  <span className="text-sm font-medium text-gray-700">Ativas</span>
                  <span className="text-lg font-bold text-green-600">5</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-gray-50 to-white border border-gray-100">
                  <span className="text-sm font-medium text-gray-700">Disponíveis</span>
                  <span className="text-lg font-bold text-gray-600">8</span>
                </div>
              </div>

              <Link href="/adm/configuracoes-integracoes" className="no-underline">
                <Button className="w-full rounded-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 inline-flex items-center justify-center gap-2">
                  Acessar
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Permissões */}
          <Card className="rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
            <div className="h-2 bg-gradient-to-r from-amber-500 to-amber-600 rounded-t-xl"></div>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Permissões</h3>
                    <p className="text-sm text-gray-600">Perfis e acessos</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-amber-50 to-white border border-amber-100">
                  <span className="text-sm font-medium text-gray-700">Perfis</span>
                  <span className="text-lg font-bold text-amber-600">4</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-purple-50 to-white border border-purple-100">
                  <span className="text-sm font-medium text-gray-700">Módulos</span>
                  <span className="text-lg font-bold text-purple-600">12</span>
                </div>
              </div>

              <Link href="/adm/configuracoes-permissoes" className="no-underline">
                <Button className="w-full rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 inline-flex items-center justify-center gap-2">
                  Acessar
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}