import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Skeleton,
  SkeletonCard,
  SkeletonStats,
  SkeletonTable,
} from "@/components/ui/Skeleton";
import { ViewUserDialog } from "@/components/adm/dialogs/ViewUserDialog";
import { EditUserDialog } from "@/components/adm/dialogs/EditUserDialog";
import { CreateUserDialog } from "@/components/adm/dialogs/CreateUserDialog";
import { ImportUsersDialog } from "@/components/adm/dialogs/ImportUsersDialog";
import {
  ArrowLeft,
  Eye,
  Search,
  UserPlus,
  Upload,
  Download,
  Edit,
  Power,
  PowerOff,
  Users,
  GraduationCap,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";

type UserType = "student" | "teacher" | "admin";

type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  type: UserType;
  status: "active" | "inactive" | "pending";
  createdAt: string;
  lastAccess?: string;
};

function getTypeLabel(type: UserType) {
  if (type === "student") return "Aluno";
  if (type === "teacher") return "Professor";
  return "Administrador";
}

function UserCard({
  user,
  onViewUser,
  onEditUser,
  onToggleStatus,
}: {
  user: User;
  onViewUser: (u: User) => void;
  onEditUser: (u: User) => void;
  onToggleStatus: (u: User) => void;
}) {
  const statusConfig = {
    active: {
      label: "Ativo",
      color: "bg-green-100 text-green-700 border-green-200",
    },
    inactive: {
      label: "Inativo",
      color: "bg-gray-100 text-gray-700 border-gray-200",
    },
    pending: {
      label: "Pendente",
      color: "bg-amber-100 text-amber-700 border-amber-200",
    },
  };

  const status = statusConfig[user.status];

  return (
    <Card className="rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border-0">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`h-12 w-12 rounded-full ${
                user.type === "student"
                  ? "bg-blue-100"
                  : user.type === "teacher"
                  ? "bg-green-100"
                  : "bg-purple-100"
              } flex items-center justify-center`}
            >
              {user.type === "student" ? (
                <Users className="h-6 w-6 text-blue-600" />
              ) : user.type === "teacher" ? (
                <GraduationCap className="h-6 w-6 text-green-600" />
              ) : (
                <Users className="h-6 w-6 text-purple-600" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{user.name}</h3>
              <p className="text-xs text-gray-500">{getTypeLabel(user.type)}</p>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium border ${status.color}`}
          >
            {status.label}
          </span>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="h-4 w-4" />
            <span className="truncate">{user.email}</span>
          </div>
          {user.phone && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="h-4 w-4" />
              <span>{user.phone}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>
              Cadastro: {new Date(user.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="flex gap-2 pt-4 border-t border-gray-100">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 rounded-lg text-xs"
            onClick={() => onViewUser(user)}
          >
            <Eye className="h-3 w-3" />
            Ver
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 rounded-lg text-xs"
            onClick={() => onEditUser(user)}
          >
            <Edit className="h-3 w-3" />
            Editar
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={`flex-1 rounded-lg text-xs ${
              user.status === "active"
                ? "text-red-600 hover:bg-red-50"
                : "text-green-600 hover:bg-green-50"
            }`}
            onClick={() => onToggleStatus(user)}
          >
            {user.status === "active" ? (
              <>
                <PowerOff className="h-3 w-3" /> Desativar
              </>
            ) : (
              <>
                <Power className="h-3 w-3" /> Ativar
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function UsersTable({
  users,
  onViewUser,
  onEditUser,
  onToggleStatus,
}: {
  users: User[];
  onViewUser: (u: User) => void;
  onEditUser: (u: User) => void;
  onToggleStatus: (u: User) => void;
}) {
  const statusConfig = {
    active: { label: "Ativo", color: "bg-green-100 text-green-700" },
    inactive: { label: "Inativo", color: "bg-gray-100 text-gray-700" },
    pending: { label: "Pendente", color: "bg-amber-100 text-amber-700" },
  };

  return (
    <Card className="rounded-xl shadow-sm border-0">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Usuário
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Data Cadastro
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => {
                const status = statusConfig[user.status];
                return (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-10 w-10 rounded-full ${
                            user.type === "student"
                              ? "bg-blue-100"
                              : user.type === "teacher"
                              ? "bg-green-100"
                              : "bg-purple-100"
                          } flex items-center justify-center flex-shrink-0`}
                        >
                          {user.type === "student" ? (
                            <Users className="h-5 w-5 text-blue-600" />
                          ) : user.type === "teacher" ? (
                            <GraduationCap className="h-5 w-5 text-green-600" />
                          ) : (
                            <Users className="h-5 w-5 text-purple-600" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {user.name}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-700">
                        {getTypeLabel(user.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}
                      >
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onViewUser(user)}
                          className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors"
                          title="Ver detalhes"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onEditUser(user)}
                          className="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-50 rounded transition-colors"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onToggleStatus(user)}
                          className={`p-1 rounded transition-colors ${
                            user.status === "active"
                              ? "text-red-600 hover:text-red-900 hover:bg-red-50"
                              : "text-green-600 hover:text-green-900 hover:bg-green-50"
                          }`}
                          title={
                            user.status === "active" ? "Desativar" : "Ativar"
                          }
                        >
                          {user.status === "active" ? (
                            <PowerOff className="h-4 w-4" />
                          ) : (
                            <Power className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {users.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">Nenhum usuário encontrado</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function UsuariosListaPage() {
  const [search, setSearch] = useState("");
  const [tipo, setTipo] = useState<"all" | UserType>("all");
  const [viewUser, setViewUser] = useState<User | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [createUserOpen, setCreateUserOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState<User[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("adm-users");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (error) {
          console.error("Erro ao carregar usuários:", error);
        }
      }
    }
    return [
      {
        id: "1",
        name: "João Silva",
        email: "joao.silva@escola.edu.br",
        phone: "(11) 98765-4321",
        type: "student",
        status: "active",
        createdAt: "2023-10-01",
        lastAccess: "2024-11-02",
      },
      {
        id: "2",
        name: "Maria Santos",
        email: "maria.santos@escola.edu.br",
        phone: "(11) 98765-4322",
        type: "teacher",
        status: "pending",
        createdAt: "2023-10-02",
      },
      {
        id: "3",
        name: "Pedro Oliveira",
        email: "pedro.oliveira@escola.edu.br",
        type: "student",
        status: "active",
        createdAt: "2023-09-15",
      },
      {
        id: "4",
        name: "Ana Costa",
        email: "ana.costa@escola.edu.br",
        type: "teacher",
        status: "active",
        createdAt: "2023-08-20",
      },
      {
        id: "5",
        name: "Carlos Mendes",
        email: "carlos.mendes@escola.edu.br",
        type: "student",
        status: "inactive",
        createdAt: "2023-07-10",
      },
    ];
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("adm-users", JSON.stringify(users));
    }
  }, [users]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return users.filter((u) => {
      const matchesText =
        !s ||
        u.name.toLowerCase().includes(s) ||
        u.email.toLowerCase().includes(s);
      const matchesTipo = tipo === "all" || u.type === tipo;
      return matchesText && matchesTipo;
    });
  }, [users, search, tipo]);

  const stats = useMemo(
    () => ({
      total: filtered.length,
      alunos: filtered.filter((u) => u.type === "student").length,
      professores: filtered.filter((u) => u.type === "teacher").length,
      ativos: filtered.filter((u) => u.status === "active").length,
    }),
    [filtered]
  );

  const handleExportar = () => {
    if (filtered.length === 0) {
      toast.warning("Nenhum usuário para exportar");
      return;
    }

    const csv = [
      "Nome,Email,Telefone,Tipo,Status,Data Cadastro",
      ...filtered.map(
        (u) =>
          `"${u.name}","${u.email}","${u.phone || ""}","${getTypeLabel(
            u.type
          )}","${u.status}","${new Date(u.createdAt).toLocaleDateString()}"`
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `usuarios-lista-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    link.click();
    URL.revokeObjectURL(url);

    toast.success(`${filtered.length} usuários exportados com sucesso!`);
  };

  const handleCreateUser = async (data: {
    name: string;
    email: string;
    phone: string;
    type: UserType;
    status: "active" | "inactive";
    password: string;
  }) => {
    try {
      const resp = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const body = await resp.json().catch(() => ({} as any));

      if (!resp.ok) {
        if (
          body?.error ===
          "A user with this email address has already been registered"
        ) {
          throw new Error("Já existe um usuário cadastrado com este e-mail.");
        }

        throw new Error(body?.error || "Erro ao criar usuário");
      }
      const createdId = body?.user?.id || body?.id || crypto.randomUUID();

      // Atualiza a lista local para refletir imediatamente na UI
      setUsers((prev) => [
        ...prev,
        {
          id: createdId,
          name: data.name,
          email: data.email,
          phone: data.phone,
          type: data.type,
          status: data.status,
          createdAt: new Date().toISOString().split("T")[0],
        },
      ]);

      toast.success(`Usuário ${data.name} criado com sucesso!`);
      setCreateUserOpen(false);
    } catch (error: any) {
      console.error("Erro ao criar usuário:", error);
      if (!error?.message) toast.error("Erro ao criar usuário");
      throw error;
    }
  };

  const handleImportUsers = async (
    users: Array<{
      name: string;
      email: string;
      phone: string;
      type: UserType;
      status: "active" | "inactive";
    }>
  ) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const success = Math.floor(users.length * 0.9);
      const errors = users.length - success;

      if (errors > 0) {
        toast.warning(
          `Importação concluída: ${success} sucesso, ${errors} erros`
        );
      } else {
        toast.success(`${success} usuários importados com sucesso!`);
      }

      return { success, errors };
    } catch (error) {
      console.error("Erro ao importar usuários:", error);
      throw error;
    }
  };

  const handleToggleStatus = (user: User) => {
    const newStatus = user.status === "active" ? "inactive" : "active";
    const action = newStatus === "active" ? "ativar" : "desativar";

    const confirmed = confirm(
      `Deseja realmente ${action} o usuário ${user.name}?`
    );

    if (!confirmed) return;

    try {
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === user.id ? { ...u, status: newStatus } : u
        )
      );

      toast.success(
        `Usuário ${
          newStatus === "active" ? "ativado" : "desativado"
        } com sucesso!`
      );
    } catch (error) {
      console.error("Erro ao alterar status do usuário:", error);
      toast.error("Erro ao alterar status do usuário");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 pb-8">
        <ViewUserDialog
          open={!!viewUser}
          onClose={() => setViewUser(null)}
          user={viewUser as any}
        />
        <EditUserDialog
          open={!!editUser}
          onClose={() => setEditUser(null)}
          onSave={(data: any) => {
            console.log("save user", data);
          }}
          user={editUser as any}
        />
        <CreateUserDialog
          open={createUserOpen}
          onClose={() => setCreateUserOpen(false)}
          onSave={handleCreateUser}
        />
        <ImportUsersDialog
          open={importOpen}
          onClose={() => setImportOpen(false)}
          onImport={handleImportUsers}
        />

        {/* Header */}
        <header className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link
                href="/adm/usuarios"
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">
                Lista de Usuários
              </h1>
            </div>
            <p className="text-gray-600">
              Gerencie alunos, professores e administradores do sistema
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="rounded-lg inline-flex items-center gap-2"
              onClick={() => setImportOpen(true)}
            >
              <Upload className="h-4 w-4" /> Importar
            </Button>
            <Button
              variant="outline"
              className="rounded-lg inline-flex items-center gap-2"
              onClick={handleExportar}
            >
              <Download className="h-4 w-4" /> Exportar
            </Button>
            <Button
              className="rounded-lg inline-flex items-center gap-2"
              onClick={() => setCreateUserOpen(true)}
            >
              <UserPlus className="h-4 w-4" /> Novo Usuário
            </Button>
          </div>
        </header>

        {/* Stats */}
        {loading ? (
          <SkeletonStats />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="rounded-xl border-0 bg-gradient-to-br from-blue-50 to-white shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Filtrado</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stats.total}
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-0 bg-gradient-to-br from-green-50 to-white shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Alunos</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stats.alunos}
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-0 bg-gradient-to-br from-purple-50 to-white shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Professores</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stats.professores}
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <GraduationCap className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-0 bg-gradient-to-br from-violet-50 to-white shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Ativos</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stats.ativos}
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-violet-100 flex items-center justify-center">
                    <Power className="h-5 w-5 text-violet-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="rounded-xl shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar por nome ou e-mail..."
                    className="input-field rounded-lg pl-10"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Select value={tipo} onValueChange={(v: any) => setTipo(v)}>
                  <SelectTrigger className="rounded-lg bg-white min-w-[160px]">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    <SelectItem value="student">Alunos</SelectItem>
                    <SelectItem value="teacher">Professores</SelectItem>
                    <SelectItem value="admin">Administradores</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex gap-1 border border-gray-200 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("table")}
                    className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                      viewMode === "table"
                        ? "bg-violet-100 text-violet-700"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    Tabela
                  </button>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                      viewMode === "grid"
                        ? "bg-violet-100 text-violet-700"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    Grade
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        {loading ? (
          viewMode === "table" ? (
            <Card className="rounded-xl shadow-sm border-0">
              <CardContent className="p-6">
                <SkeletonTable rows={8} />
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )
        ) : viewMode === "table" ? (
          <UsersTable
            users={filtered}
            onViewUser={(u) => setViewUser(u)}
            onEditUser={(u) => setEditUser(u)}
            onToggleStatus={handleToggleStatus}
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onViewUser={(u) => setViewUser(u)}
                onEditUser={(u) => setEditUser(u)}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
