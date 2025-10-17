import { useState } from "react";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { Popover, PopoverItem } from "@/components/ui/Popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/router";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ViewUserDialog } from "@/components/adm/dialogs/ViewUserDialog";
import { EditUserDialog } from "@/components/adm/dialogs/EditUserDialog";
import { TeacherPermissionsDialog } from "@/components/adm/dialogs/TeacherPermissionsDialog";

type ViewUser = Omit<User, 'type'> & {
  type: 'student' | 'teacher';
};
import { 
  Eye, 
  Filter, 
  Search, 
  UserPlus, 
  Upload, 
  Download, 
  Mail,
  GraduationCap,
  BookOpen,
  Users as UsersIcon,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";

interface TeacherPermissions {
  createActivities: boolean;
  assignCoins: boolean;
  createContent: boolean;
  generateReports: boolean;
}

interface TeacherRole {
  subject: string;
  role: "principal" | "collaborator";
  classes: string[];
}

interface User {
  id: string;
  name: string;
  email: string;
  type: "student" | "teacher" | "admin";
  status: "active" | "inactive" | "pending";
  createdAt: string;
  registration?: string; // Matrícula/RA
  class?: string; // Turma
  lastAccess?: string;
  coins?: number;
  // Campos específicos para professores
  subjects?: string[]; // opcional: usado em mocks/visual
  teacherRoles?: TeacherRole[];
  permissions?: TeacherPermissions;
  permissionsHistory?: Array<{
    timestamp: string;
    changedBy: string;
    changes: Partial<TeacherPermissions>;
  }>;
}

interface UserStats {
  total: number;
  students: number;
  teachers: number;
  admins: number;
  active: number;
  pending: number;
}

interface TeacherUser extends User {
  type: "teacher";
  permissions?: TeacherPermissions;
  teacherRoles?: TeacherRole[];
}

interface TableProps {
  users: User[];
  onViewUser: (id: string) => void;
  onEditUser: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onResetPassword: (id: string) => void;
  onEditPermissions?: (user: TeacherUser) => void;
}

// Mock data
const mockUsers: User[] = [
  {
    id: "1",
    name: "João Silva",
    email: "joao.silva@escola.edu.br",
    type: "student",
    status: "active",
    createdAt: "2023-10-01",
    registration: "2023001",
    class: "3º A",
    coins: 150,
    lastAccess: "2023-10-08",
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria.santos@escola.edu.br",
    type: "teacher",
    status: "active",
    createdAt: "2023-10-02",
    subjects: ["Matemática", "Física"],
    lastAccess: "2023-10-07",
  },
  {
    id: "3",
    name: "Pedro Costa",
    email: "pedro.costa@escola.edu.br",
    type: "student",
    status: "pending",
    createdAt: "2023-10-05",
    registration: "2023002",
    class: "2º B",
    coins: 0,
  },
  {
    id: "4",
    name: "Ana Oliveira",
    email: "ana.oliveira@escola.edu.br",
    type: "teacher",
    status: "inactive",
    createdAt: "2023-09-15",
    subjects: ["Português", "Literatura"],
    lastAccess: "2023-09-30",
  },
];

function UsersTable({ users, onViewUser, onEditUser, onToggleStatus, onResetPassword, onEditPermissions }: TableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-600/20";
      case "inactive":
        return "bg-red-100 text-red-700 ring-1 ring-red-600/20";
      case "pending":
        return "bg-amber-100 text-amber-700 ring-1 ring-amber-600/20";
      default:
        return "bg-gray-100 text-gray-700 ring-1 ring-gray-600/20";
    }
  };

  const getUserTypeIcon = (type: string) => {
    switch (type) {
      case "student":
        return <GraduationCap className="h-4 w-4 text-blue-600" />;
      case "teacher":
        return <BookOpen className="h-4 w-4 text-green-600" />;
      case "admin":
        return <ShieldCheck className="h-4 w-4 text-purple-600" />;
      default:
        return <UsersIcon className="h-4 w-4 text-gray-600" />;
    }
  };

  const getUserTypeText = (type: string) => {
    switch (type) {
      case "student":
        return "Aluno";
      case "teacher":
        return "Professor";
      case "admin":
        return "Administrador";
      default:
        return type;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-emerald-600" />;
      case "inactive":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-amber-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b text-left">
          <tr>
            <th className="pb-4 font-medium w-[20%]">Nome</th>
            <th className="pb-4 font-medium w-[20%]">E-mail</th>
            <th className="pb-4 font-medium w-[15%]">Tipo</th>
            <th className="pb-4 font-medium w-[10%]">Status</th>
            <th className="pb-4 font-medium w-[10%]">Data de Cadastro</th>
            <th className="pb-4 font-medium w-[25%]">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="py-4">
                <div className="flex items-center gap-3">
                  {getUserTypeIcon(user.type)}
                  <span>{user.name}</span>
                </div>
              </td>
              <td className="py-4">{user.email}</td>
              <td className="py-4">
                <div className="flex items-center gap-2">
                  {getUserTypeText(user.type)}
                </div>
              </td>
              <td className="py-4">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                    user.status
                  )}`}
                >
                  {getStatusIcon(user.status)}
                  {user.status === "active"
                    ? "Ativo"
                    : user.status === "inactive"
                    ? "Inativo"
                    : "Pendente"}
                </span>
              </td>
              <td className="py-4">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td className="py-4">
                <Popover
                  trigger={
                    <Button variant="outline" size="sm" className="rounded-lg">
                      Mais ações ▾
                    </Button>
                  }
                >
                  <PopoverItem onClick={() => onViewUser(user.id)}>
                    Visualizar
                  </PopoverItem>
                  <PopoverItem onClick={() => onEditUser(user.id)}>
                    Editar
                  </PopoverItem>
                  <PopoverItem onClick={() => onResetPassword(user.id)}>
                    Resetar senha
                  </PopoverItem>
                  {user.type === "teacher" && onEditPermissions && (
                    <PopoverItem onClick={() => onEditPermissions(user as TeacherUser)}>
                      Permissões
                    </PopoverItem>
                  )}
                  <PopoverItem
                    className={user.status === "active" ? "text-red-600" : "text-emerald-600"}
                    onClick={() => onToggleStatus(user.id)}
                  >
                    {user.status === "active" ? "Desativar" : "Ativar"}
                  </PopoverItem>
                </Popover>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function UsuariosPage() {
  const router = useRouter();
  const [viewUser, setViewUser] = useState<ViewUser | null>(null);
  const [editUser, setEditUser] = useState<ViewUser | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState<"all" | "students" | "teachers">("students");
  
  const stats: UserStats = {
    total: users.length,
    students: users.filter(u => u.type === "student").length,
    teachers: users.filter(u => u.type === "teacher").length,
    admins: users.filter(u => u.type === "admin").length,
    active: users.filter(u => u.status === "active").length,
    pending: users.filter(u => u.status === "pending").length,
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      searchTerm === "" ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab = 
      currentTab === "all" ||
      (currentTab === "students" && user.type === "student") ||
      (currentTab === "teachers" && user.type === "teacher");

    return matchesSearch && matchesTab;
  });

  const handleSaveUser = (userData: Omit<User, 'createdAt'>) => {
    console.log('Save user:', userData);
    // Add API call here
  };

  // Remove a função desnecessária setEditPermissions

  const handleSavePermissions = async (permissions: TeacherPermissions, roles: TeacherRole[]) => {
    if (!selectedUser) return;

    try {
      // Placeholder for API call
      // const response = await api.put(`/users/${selectedUser.id}/permissions`, {
      //   permissions,
      //   roles,
      //   timestamp: new Date().toISOString(),
      //   changedBy: "current-admin-id"
      // });

      // Temporary mock update
      const updatedUsers = users.map(u =>
        u.id === selectedUser.id
          ? {
              ...u,
              permissions,
              teacherRoles: roles,
              permissionsHistory: [
                ...(u.permissionsHistory || []),
                {
                  timestamp: new Date().toISOString(),
                  changedBy: "current-admin-id",
                  changes: permissions
                }
              ]
            }
          : u
      );

      // setUsers(updatedUsers);
      setSelectedUser(null); // Fecha o diálogo após salvar
      alert("Permissões atualizadas com sucesso!");
    } catch (error) {
      console.error('Error updating permissions:', error);
      alert('Erro ao atualizar permissões. Tente novamente.');
    }
  };

  const handleToggleStatus = async (id: string) => {
    const user = users.find(u => u.id === id);
    if (!user) return;

    try {
      // Placeholder for API call
      // const response = await api.put(`/users/${id}/status`, {
      //   status: user.status === 'active' ? 'inactive' : 'active'
      // });

      // Temporary mock update
      const updatedUsers = users.map(u => 
        u.id === id 
          ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' }
          : u
      );
      
      // Update users state
      // setUsers(updatedUsers);
      
      const action = user.status === 'active' ? 'desativada' : 'ativada';
      alert(`Conta ${action} com sucesso!`);
    } catch (error) {
      console.error('Error toggling user status:', error);
      alert('Erro ao alterar o status da conta. Tente novamente.');
    }
  };

  const handleResetPassword = async (id: string) => {
    const user = users.find(u => u.id === id);
    if (!user) return;

    if (!confirm(`Deseja realmente resetar a senha de ${user.name}?`)) {
      return;
    }

    try {
      // Placeholder for API call
      // const response = await api.post(`/users/${id}/reset-password`);
      // const { temporaryPassword } = response.data;

      // Temporary mock response
      const temporaryPassword = Math.random().toString(36).slice(-8);

      alert(
        `Senha resetada com sucesso!\n` +
        `Uma nova senha temporária foi enviada para ${user.email}\n` +
        `Senha temporária: ${temporaryPassword}`
      );
    } catch (error) {
      console.error('Error resetting password:', error);
      alert('Erro ao resetar a senha. Tente novamente.');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <ViewUserDialog
          open={!!viewUser}
          onClose={() => setViewUser(null)}
          user={viewUser}
        />
        <EditUserDialog
          open={!!editUser}
          onClose={() => setEditUser(null)}
          onSave={handleSaveUser}
          user={editUser}
        />

        <TeacherPermissionsDialog
          open={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          onSave={handleSavePermissions}
          initialPermissions={selectedUser?.permissions}
          initialRoles={selectedUser?.teacherRoles}
          teacherName={selectedUser?.name || ""}
        />
        
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">Gestão de Usuários</h1>
            <p className="text-muted-foreground">
              Gerencie alunos e professores do sistema
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-lg">
              <Upload className="mr-2 h-4 w-4" />
              Importar CSV
            </Button>
            <Button 
              className="rounded-lg bg-violet-600 hover:bg-violet-700"
              onClick={() => router.push("/adm/novo-usuario")}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Novo Usuário
            </Button>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          <Card className="rounded-xl">
            <CardContent className="p-4">
              <div className="flex items-start space-y-1">
                <UsersIcon className="h-4 w-4 text-violet-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="rounded-xl">
            <CardContent className="p-4">
              <div className="flex items-start space-y-1">
                <GraduationCap className="h-4 w-4 text-blue-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Alunos</p>
                  <p className="text-2xl font-bold">{stats.students}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl">
            <CardContent className="p-4">
              <div className="flex items-start space-y-1">
                <BookOpen className="h-4 w-4 text-green-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Professores</p>
                  <p className="text-2xl font-bold">{stats.teachers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl">
            <CardContent className="p-4">
              <div className="flex items-start space-y-1">
                <ShieldCheck className="h-4 w-4 text-purple-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Admins</p>
                  <p className="text-2xl font-bold">{stats.admins}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl">
            <CardContent className="p-4">
              <div className="flex items-start space-y-1">
                <CheckCircle className="h-4 w-4 text-emerald-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ativos</p>
                  <p className="text-2xl font-bold">{stats.active}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl">
            <CardContent className="p-4">
              <div className="flex items-start space-y-1">
                <Clock className="h-4 w-4 text-amber-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pendentes</p>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="rounded-xl">
          <CardContent className="p-6">
            <Tabs defaultValue="all" onValueChange={(value) => setCurrentTab(value as "all" | "students" | "teachers")}>
              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-6 bg-violet-50 p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <GraduationCap className={cn(
                      "h-5 w-5 transition-colors",
                      currentTab === "students" ? "text-violet-600" : "text-gray-400"
                    )} />
                    <span className={cn(
                      "font-medium transition-colors",
                      currentTab === "students" ? "text-violet-600" : "text-gray-500"
                    )}>
                      Alunos
                    </span>
                    <Switch
                      checked={currentTab === "teachers"}
                      onCheckedChange={(checked) => setCurrentTab(checked ? "teachers" : "students")}
                      className="data-[state=checked]:bg-violet-600"
                    />
                    <span className={cn(
                      "font-medium transition-colors",
                      currentTab === "teachers" ? "text-violet-600" : "text-gray-500"
                    )}>
                      Professores
                    </span>
                    <BookOpen className={cn(
                      "h-5 w-5 transition-colors",
                      currentTab === "teachers" ? "text-violet-600" : "text-gray-400"
                    )} />
                  </div>
                  
                  {/* Botão para ver todos */}
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "rounded-lg font-medium",
                      currentTab === "all" 
                        ? "bg-violet-600 text-white hover:bg-violet-700 border-violet-600" 
                        : "text-gray-500 hover:bg-violet-100 border-gray-200"
                    )}
                    onClick={() => setCurrentTab("all")}
                  >
                    Ver Todos
                  </Button>
                </div>

                <div className="flex gap-2">
                  <div className="flex max-w-[320px] items-center gap-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder={`Buscar ${currentTab === "students" ? "alunos" : currentTab === "teachers" ? "professores" : "usuários"}...`}
                      className="rounded-lg"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" className="rounded-lg">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtros
                  </Button>
                  <Button variant="outline" className="rounded-lg">
                    <Download className="mr-2 h-4 w-4" />
                    Exportar
                  </Button>
                </div>
              </div>

              <div className="mt-6">
                <UsersTable
                  users={
                    currentTab === "all"
                      ? filteredUsers
                      : filteredUsers.filter((u) => u.type === (currentTab === "students" ? "student" : "teacher"))
                  }
                  onViewUser={(id) => {
                    const user = users.find(u => u.id === id);
                    if (user && (user.type === 'student' || user.type === 'teacher')) {
                      setViewUser(user as ViewUser);
                    }
                  }}
                  onEditUser={(id) => {
                    const user = users.find(u => u.id === id);
                    if (user && (user.type === 'student' || user.type === 'teacher')) {
                      setEditUser(user as ViewUser);
                    }
                  }}
                  onToggleStatus={handleToggleStatus}
                  onResetPassword={handleResetPassword}
                  onEditPermissions={(user) => {
                    if (user.type === "teacher") {
                      setSelectedUser(user);
                    }
                  }}
                />
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}