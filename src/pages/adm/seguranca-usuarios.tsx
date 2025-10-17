import { useMemo, useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/Input";
import {
  Shield,
  Users,
  Eye,
  Settings,
  Key,
  Download,
  RefreshCw,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createLog as apiCreateLog } from "@/services/api/logs";
import { createNotification, composeMessages } from "@/services/api/notifications";

type UserStatus = "ativo" | "pendente" | "bloqueado";
type UserRole = "Administrador" | "Professor" | "Aluno";

interface User {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  dataCadastro: string; // ISO date
}

const roleDescriptions: Record<UserRole, string> = {
  Administrador: "Acesso total ao sistema e gestão de usuários",
  Professor: "Gerencia turmas, atividades e avaliação de alunos",
  Aluno: "Acompanha atividades, notas e progresso de estudos",
};

const mockUsuarios: User[] = [
  {
    id: "1",
    nome: "Ana Souza",
    email: "ana.souza@example.com",
    role: "Administrador",
    status: "ativo",
    dataCadastro: "2025-01-10T10:00:00Z",
  },
  {
    id: "2",
    nome: "Bruno Pereira",
    email: "bruno.pereira@example.com",
    role: "Professor",
    status: "ativo",
    dataCadastro: "2025-03-15T09:30:00Z",
  },
  {
    id: "3",
    nome: "Carla Lima",
    email: "carla.lima@example.com",
    role: "Aluno",
    status: "pendente",
    dataCadastro: "2025-04-20T14:45:00Z",
  },
  {
    id: "4",
    nome: "Diego Santos",
    email: "diego.santos@example.com",
    role: "Aluno",
    status: "ativo",
    dataCadastro: "2025-02-05T08:15:00Z",
  },
  {
    id: "5",
    nome: "Eduarda Nunes",
    email: "eduarda.nunes@example.com",
    role: "Professor",
    status: "bloqueado",
    dataCadastro: "2025-05-01T12:10:00Z",
  },
  {
    id: "6",
    nome: "Fernando Alves",
    email: "fernando.alves@example.com",
    role: "Administrador",
    status: "pendente",
    dataCadastro: "2025-06-12T11:20:00Z",
  },
];

export default function SegurancaGestaoUsuariosPage() {
  const [usuarios, setUsuarios] = useState<User[]>(mockUsuarios);

  // Busca e filtros
  const [search, setSearch] = useState("");
  const [statusTab, setStatusTab] = useState<"todos" | UserStatus>("todos");

  // Seleção e aplicação de filtro por perfil (cards)
  const [selectedRoleForFilter, setSelectedRoleForFilter] = useState<UserRole | null>(null);
  const [appliedRoleFilter, setAppliedRoleFilter] = useState<UserRole | null>(null);

  // Modais e seleção de usuário
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [userSelecionado, setUserSelecionado] = useState<User | null>(null);

  // Helpers
  async function addLog(entry: Parameters<typeof apiCreateLog>[0]) {
    await apiCreateLog(entry);
  }

  async function pushNotification(params: { message: string; actionType: any; context?: Record<string, any> }) {
    await createNotification({
      message: params.message,
      actionType: params.actionType,
      recipients: ["Administrador", "Coordenador"],
      context: params.context,
    });
  }

  // Contagens por perfil
  const contagensPorPerfil = useMemo(() => {
    const base: Record<UserRole, { ativo: number; pendente: number; bloqueado: number }> = {
      Administrador: { ativo: 0, pendente: 0, bloqueado: 0 },
      Professor: { ativo: 0, pendente: 0, bloqueado: 0 },
      Aluno: { ativo: 0, pendente: 0, bloqueado: 0 },
    };
    for (const u of usuarios) base[u.role][u.status] += 1 as number;
    return base;
  }, [usuarios]);

  const resetSenhasEmLote = async () => {
    alert("Resetar senhas em lote (placeholder)");
    const alvo = filteredUsuarios.map((u) => u.nome).join(", ");
    await addLog({
      usuarioNome: "Administrador (sessão)",
      usuarioPerfil: "Administrador",
      acao: `Resetou senhas em lote para: ${alvo || "(nenhum usuário filtrado)"}`,
    });
  };

  const exportarLista = () => {
    alert("Exportar lista (placeholder)");
  };

  const resetSenhaUsuario = async (user: User) => {
    alert(`Senha resetada (placeholder) para ${user.nome}`);
    await addLog({
      usuarioNome: "Administrador (sessão)",
      usuarioPerfil: "Administrador",
      acao: `Resetou a senha do usuário ${user.nome} (${user.email})`,
    });
  };

  const filteredUsuarios = useMemo(() => {
    return usuarios
      .filter((u) => (appliedRoleFilter ? u.role === appliedRoleFilter : true))
      .filter((u) => (statusTab === "todos" ? true : u.status === statusTab))
      .filter((u) => {
        const q = search.toLowerCase();
        return u.nome.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      });
  }, [usuarios, appliedRoleFilter, statusTab, search]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">Gestão de Usuários</h1>
            <p className="text-muted-foreground">
              Gerencie perfis de acesso e garanta a integridade dos dados da plataforma
            </p>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <Link href="/adm/seguranca" className="hidden md:block">
              <Button variant="outline" className="rounded-xl">Voltar ao Hub</Button>
            </Link>
            <Button
              variant="outline"
              className="rounded-xl border-violet-100 hover:border-violet-200 hover:bg-violet-50/50"
              onClick={resetSenhasEmLote}
            >
              <div className="flex items-center justify-center">
                <RefreshCw className="mr-2 h-4 w-4 text-violet-500" />
                <span className="text-violet-700">Resetar Senhas em Lote</span>
              </div>
            </Button>
            <Button
              variant="outline"
              className="rounded-xl border-violet-100 hover:border-violet-200 hover:bg-violet-50/50"
              onClick={exportarLista}
            >
              <div className="flex items-center justify-center">
                <Download className="mr-2 h-4 w-4 text-violet-500" />
                <span className="text-violet-700">Exportar Lista</span>
              </div>
            </Button>
          </div>
        </header>

        {/* Cards de Perfis */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(["Administrador", "Professor", "Aluno"] as UserRole[]).map((role) => {
            const counts = contagensPorPerfil[role];
            const selected = selectedRoleForFilter === role;
            return (
              <Card key={role} className={`rounded-xl shadow-sm transition-all ${selected ? "ring-2 ring-violet-500" : "hover:shadow-md"}`}>
                <button
                  type="button"
                  className="w-full text-left"
                  onClick={() =>
                    setSelectedRoleForFilter((prev) => {
                      const next = prev === role ? null : role;
                      setAppliedRoleFilter(next);
                      return next;
                    })
                  }
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-violet-500" />
                        <h3 className="text-lg font-semibold">{role}</h3>
                      </div>
                      <Users className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{roleDescriptions[role]}</p>
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <div className="rounded-lg bg-green-50 p-3 text-center">
                        <div className="text-xs text-green-700">Ativos</div>
                        <div className="text-lg font-semibold text-green-700">{counts.ativo}</div>
                      </div>
                      <div className="rounded-lg bg-yellow-50 p-3 text-center">
                        <div className="text-xs text-yellow-700">Pendentes</div>
                        <div className="text-lg font-semibold text-yellow-700">{counts.pendente}</div>
                      </div>
                      <div className="rounded-lg bg-red-50 p-3 text-center">
                        <div className="text-xs text-red-700">Bloqueados</div>
                        <div className="text-lg font-semibold text-red-700">{counts.bloqueado}</div>
                      </div>
                    </div>
                  </CardContent>
                </button>
              </Card>
            );
          })}
        </div>

        {/* Filtros e Tabela */}
        <Card className="rounded-xl">
          <CardContent className="p-6">
            <Tabs value={statusTab} onValueChange={(v) => setStatusTab(v as any)}>
              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex max-w-[360px] items-center gap-2">
                  <Input
                    placeholder="Buscar por nome ou e-mail..."
                    className="rounded-lg"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {appliedRoleFilter && (
                    <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">Filtro: {appliedRoleFilter}</span>
                  )}
                </div>

                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="todos">Todos</TabsTrigger>
                  <TabsTrigger value="ativo">Ativos</TabsTrigger>
                  <TabsTrigger value="pendente">Pendentes</TabsTrigger>
                  <TabsTrigger value="bloqueado">Bloqueados</TabsTrigger>
                </TabsList>
              </div>

              {["todos", "ativo", "pendente", "bloqueado"].map((tab) => (
                <TabsContent key={tab} value={tab as any} className="mt-0">
                  <div className="rounded-lg border">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="py-3 px-4 text-left text-sm font-medium">Nome</th>
                          <th className="py-3 px-4 text-left text-sm font-medium">E-mail</th>
                          <th className="py-3 px-4 text-left text-sm font-medium">Tipo</th>
                          <th className="py-3 px-4 text-left text-sm font-medium">Status</th>
                          <th className="py-3 px-4 text-left text-sm font-medium">Data de Cadastro</th>
                          <th className="py-3 px-4 text-left text-sm font-medium">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsuarios.map((u) => (
                          <tr key={u.id} className="border-b">
                            <td className="py-3 px-4">{u.nome}</td>
                            <td className="py-3 px-4">{u.email}</td>
                            <td className="py-3 px-4">{u.role}</td>
                            <td className="py-3 px-4">
                              <span
                                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                  u.status === "ativo"
                                    ? "bg-green-100 text-green-700"
                                    : u.status === "pendente"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {u.status === "ativo" ? "Ativo" : u.status === "pendente" ? "Pendente" : "Bloqueado"}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-sm">{new Date(u.dataCadastro).toLocaleDateString("pt-BR")}</td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="rounded-xl border-violet-100 hover:border-violet-200 hover:bg-violet-50/50"
                                  onClick={() => {
                                    setUserSelecionado(u);
                                    setViewOpen(true);
                                  }}
                                >
                                  <div className="flex items-center justify-center">
                                    <Eye className="h-4 w-4 text-violet-500" />
                                  </div>
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="rounded-xl border-violet-100 hover:border-violet-200 hover:bg-violet-50/50"
                                  onClick={() => {
                                    setUserSelecionado(u);
                                    setEditOpen(true);
                                  }}
                                >
                                  <div className="flex items-center justify-center">
                                    <Settings className="h-4 w-4 text-violet-500" />
                                  </div>
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="rounded-xl border-red-100 hover:border-red-200 hover:bg-red-50/50"
                                  onClick={() => resetSenhaUsuario(u)}
                                >
                                  <div className="flex items-center justify-center">
                                    <Key className="h-4 w-4 text-red-500" />
                                  </div>
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Dialog Visualizar Usuário */}
        <Dialog open={viewOpen} onOpenChange={setViewOpen}>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle>Detalhes do Usuário</DialogTitle>
              <DialogDescription>Informações do usuário selecionado</DialogDescription>
            </DialogHeader>
            {userSelecionado && (
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-muted-foreground">Nome</div>
                  <div className="font-medium">{userSelecionado.nome}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">E-mail</div>
                  <div className="font-medium">{userSelecionado.email}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground">Tipo</div>
                    <div className="font-medium">{userSelecionado.role}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Status</div>
                    <div className="font-medium">{userSelecionado.status === "ativo" ? "Ativo" : userSelecionado.status === "pendente" ? "Pendente" : "Bloqueado"}</div>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Data de Cadastro</div>
                  <div className="font-medium">{new Date(userSelecionado.dataCadastro).toLocaleDateString("pt-BR")}</div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Dialog Editar Usuário */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="sm:max-w-[520px]">
            <DialogHeader>
              <DialogTitle>Editar Usuário</DialogTitle>
              <DialogDescription>Atualize os dados do usuário</DialogDescription>
            </DialogHeader>
            {userSelecionado && (
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  // detect changes for logging
                  setUsuarios((prev) => {
                    const before = prev.find((u) => u.id === userSelecionado.id);
                    const next = prev.map((u) => (u.id === userSelecionado.id ? userSelecionado : u));
                    if (before) {
                      const diffs: string[] = [];
                      if (before.nome !== userSelecionado.nome) diffs.push(`nome: "${before.nome}" -> "${userSelecionado.nome}"`);
                      if (before.email !== userSelecionado.email) diffs.push(`email: ${before.email} -> ${userSelecionado.email}`);
                      if (before.role !== userSelecionado.role) diffs.push(`tipo: ${before.role} -> ${userSelecionado.role}`);
                      if (before.status !== userSelecionado.status) diffs.push(`status: ${before.status} -> ${userSelecionado.status}`);
                      if (diffs.length) {
                        addLog({
                          usuarioNome: "Administrador (sessão)",
                          usuarioPerfil: "Administrador",
                          acao: `Editou usuário ${before.nome} (${before.email}) – alterações: ${diffs.join(", ")}`,
                        });
                        // Notifications: role/status changes
                        if (before.role !== userSelecionado.role) {
                          const { message, actionType } = composeMessages.userRoleChanged({
                            adminNome: "Administrador (sessão)",
                            userNome: before.nome,
                            de: before.role,
                            para: userSelecionado.role,
                          });
                          pushNotification({ message, actionType });
                        }
                        if (before.status !== userSelecionado.status) {
                          const { message, actionType } = composeMessages.userStatusChanged({
                            adminNome: "Administrador",
                            userNome: before.nome,
                            de: before.status,
                            para: userSelecionado.status,
                          });
                          pushNotification({ message, actionType });
                        }
                      }
                    }
                    return next;
                  });
                  setEditOpen(false);
                }}
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nome</label>
                  <Input
                    className="rounded-lg"
                    value={userSelecionado.nome}
                    onChange={(e) => setUserSelecionado({ ...userSelecionado, nome: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">E-mail</label>
                  <Input
                    className="rounded-lg"
                    value={userSelecionado.email}
                    onChange={(e) => setUserSelecionado({ ...userSelecionado, email: e.target.value })}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tipo</label>
                    <select
                      className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      value={userSelecionado.role}
                      onChange={(e) => setUserSelecionado({ ...userSelecionado, role: e.target.value as UserRole })}
                    >
                      {(["Administrador", "Professor", "Aluno"] as UserRole[]).map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <select
                      className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      value={userSelecionado.status}
                      onChange={(e) => setUserSelecionado({ ...userSelecionado, status: e.target.value as UserStatus })}
                    >
                      <option value="ativo">Ativo</option>
                      <option value="pendente">Pendente</option>
                      <option value="bloqueado">Bloqueado</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" className="rounded-xl" onClick={() => setEditOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="rounded-xl bg-violet-600 hover:bg-violet-700">
                    Salvar Alterações
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
