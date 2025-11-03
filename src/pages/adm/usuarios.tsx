import Link from "next/link";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { 
  Users, 
  Shield, 
  FileText, 
  ArrowRight,
  UserCheck,
  UserX,
  Clock
} from "lucide-react";

export default function UsuariosHubPage() {
  // Mock stats - substituir por dados reais da API
  const stats = {
    total: 530,
    alunos: 500,
    professores: 30,
    ativos: 475,
    pendentes: 5,
    inativos: 50,
  };

  const items = [
    { 
      href: "/adm/usuarios-lista", 
      title: "Lista de Usuários", 
      desc: "Gerencie alunos e professores, edite perfis e controle status",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      gradient: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-50",
      stats: [
        { label: "Alunos", value: stats.alunos },
        { label: "Professores", value: stats.professores },
      ]
    },
    { 
      href: "/adm/usuarios-permissoes", 
      title: "Perfis e Permissões", 
      desc: "Configure regras de acesso e permissões por perfil de usuário",
      icon: Shield,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      gradient: "from-purple-500 to-purple-600",
      iconBg: "bg-purple-50",
      stats: [
        { label: "Perfis", value: 3 },
        { label: "Permissões", value: 12 },
      ]
    },
    { 
      href: "/adm/usuarios-logs", 
      title: "Logs e Auditoria", 
      desc: "Consulte histórico de ações e eventos do sistema",
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-100",
      gradient: "from-green-500 to-green-600",
      iconBg: "bg-green-50",
      stats: [
        { label: "Hoje", value: 145 },
        { label: "Semana", value: 892 },
      ]
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6 pb-8">
        {/* Header */}
        <header className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestão de Usuários</h1>
            <p className="text-gray-600 mt-1">
              Administre usuários, permissões e monitore atividades do sistema
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="rounded-xl border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Usuários</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
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
                    <p className="text-sm font-medium text-gray-600">Usuários Ativos</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.ativos}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <UserCheck className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-l-4 border-l-amber-500 bg-gradient-to-br from-amber-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pendentes</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.pendentes}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-l-4 border-l-gray-500 bg-gradient-to-br from-gray-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Inativos</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.inativos}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    <UserX className="h-5 w-5 text-gray-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </header>

        {/* Main Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                    {item.stats.map((stat, idx) => (
                      <div key={idx} className="text-center p-2 rounded-lg bg-gray-50">
                        <p className="text-xs text-gray-600 mb-1">{stat.label}</p>
                        <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                      </div>
                    ))}
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

        {/* Quick Actions */}
        <Card className="rounded-xl shadow-sm border-0 bg-gradient-to-br from-violet-50 to-white">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Link 
                href="/adm/usuarios-lista"
                className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-200 hover:border-violet-300 hover:shadow-sm transition-all"
              >
                <div className="h-8 w-8 rounded-lg bg-violet-100 flex items-center justify-center">
                  <Users className="h-4 w-4 text-violet-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Adicionar Usuário</span>
              </Link>
              
              <Link 
                href="/adm/usuarios-lista"
                className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-200 hover:border-green-300 hover:shadow-sm transition-all"
              >
                <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <UserCheck className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Aprovar Pendentes</span>
              </Link>

              <Link 
                href="/adm/usuarios-logs"
                className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Ver Logs Recentes</span>
              </Link>

              <Link 
                href="/adm/usuarios-permissoes"
                className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-200 hover:border-purple-300 hover:shadow-sm transition-all"
              >
                <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Shield className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Configurar Permissões</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}