import Link from "next/link";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { AdmQuickActionsCard } from "@/components/adm/AdmQuickActionsCard";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  MessageCircle,
  HelpCircle,
  FileText,
  LifeBuoy,
  ArrowRight,
} from "lucide-react";

export default function SuporteHubPage() {
  const quickActions = [
    {
      href: "/adm/suporte-chamados?status=aberto",
      label: "Chamados Pendentes",
      icon: MessageCircle,
      accent: "blue" as const,
    },
    {
      href: "/adm/suporte-faqs?action=new",
      label: "Novo FAQ",
      icon: HelpCircle,
      accent: "blue" as const,
    },
    {
      href: "/adm/suporte-respostas?action=new",
      label: "Nova Resposta",
      icon: FileText,
      accent: "blue" as const,
    },
  ];

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
              <p className="text-muted-foreground mt-1">Gerenciamento completo de atendimento e FAQs</p>
            </div>
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
              
              <Link href="/adm/suporte-respostas" className="no-underline">
                <Button className="w-full rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 inline-flex items-center justify-center gap-2">
                  Acessar
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <AdmQuickActionsCard
          items={quickActions}
          cardAccent="blue"
          columnsClassName="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
        />
      </div>
    </AdminLayout>
  );
}