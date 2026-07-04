import Link from "next/link";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { AdmQuickActionsCard } from "@/components/adm/AdmQuickActionsCard";
import { Card, CardContent } from "@/components/ui/Card";
import { 
  BookOpen, 
  Settings,
  ArrowRight,
  BookMarked,
  Users,
  Coins,
  CheckCircle2
} from "lucide-react";

export default function DisciplinasHubPage() {
  // Mock stats - substituir por dados reais da API
  const stats = {
    total: 12,
    ativas: 10,
    arquivadas: 2,
    professores: 25,
    alunos: 500,
    moedas: 16500,
  };

  const items = [
    { 
      href: "/adm/disciplinas-lista", 
      title: "Lista de Disciplinas", 
      desc: "Gerencie todas as disciplinas, professores e configurações de pontos",
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      gradient: "from-blue-500 to-blue-600",
    },
    { 
      href: "/adm/disciplinas-config", 
      title: "Configurações Gerais", 
      desc: "Defina regras padrão de pontos e integrações do sistema",
      icon: Settings,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      gradient: "from-purple-500 to-purple-600",
    },
  ];

  const quickActions = [
    {
      href: "/adm/disciplinas-lista",
      label: "Nova Disciplina",
      icon: BookOpen,
      accent: "blue" as const,
    },
    {
      href: "/adm/disciplinas-lista",
      label: "Atribuir Professores",
      icon: Users,
      accent: "purple" as const,
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6 pb-8">
        {/* Header */}
        <header className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestão de Disciplinas</h1>
            <p className="text-muted-foreground mt-1">
              Administre disciplinas, professores, turmas e regras de pontuação
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <Card className="rounded-xl border-l-4 border-l-amber-500 bg-gradient-to-br from-amber-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Moedas Distribuídas</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.moedas.toLocaleString()}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Coins className="h-5 w-5 text-amber-600" />
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
          cardAccent="violet"
          columnsClassName="grid gap-3 sm:grid-cols-2 lg:grid-cols-2"
        />
      </div>
    </AdminLayout>
  );
}