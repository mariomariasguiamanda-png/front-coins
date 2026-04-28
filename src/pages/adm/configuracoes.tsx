import Link from "next/link";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { AdmQuickActionsCard } from "@/components/adm/AdmQuickActionsCard";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Calendar as CalendarIcon,
  Link as LinkIcon,
  Settings,
  ArrowRight,
  Clock,
} from "lucide-react";

export default function ConfiguracoesHubPage() {
  const quickActions = [
    {
      href: "/adm/configuracoes-calendario?action=novo-periodo",
      label: "Novo Período",
      icon: CalendarIcon,
      accent: "blue" as const,
    },
    {
      href: "/adm/configuracoes-calendario?action=novo-evento",
      label: "Novo Evento",
      icon: Clock,
      accent: "green" as const,
    },
    {
      href: "/adm/configuracoes-integracoes?action=nova",
      label: "Nova Integração",
      icon: LinkIcon,
      accent: "purple" as const,
    },
  ];

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
              <p className="text-muted-foreground mt-1">Personalize e gerencie as configurações da plataforma</p>
            </div>
          </div>

        </header>

        {/* Section Cards */}
        <div className="grid gap-6 lg:grid-cols-2">
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
              
              <Link href="/adm/configuracoes-integracoes" className="no-underline">
                <Button className="w-full rounded-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 inline-flex items-center justify-center gap-2">
                  Acessar
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

        </div>

        <AdmQuickActionsCard
          items={quickActions}
          cardAccent="purple"
          columnsClassName="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        />
      </div>
    </AdminLayout>
  );
}