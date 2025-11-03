import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ViewUserDialog } from "@/components/adm/dialogs/ViewUserDialog";
import { EditUserDialog } from "@/components/adm/dialogs/EditUserDialog";
import { Eye, Filter, Search, UserPlus, Upload, Download } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  type: "student" | "teacher";
  status: "active" | "inactive" | "pending";
  createdAt: string;
}

interface TableProps {
  users: User[];
  onViewUser: (id: string) => void;
  onEditUser: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

function UsersTable({ users, onViewUser, onEditUser, onToggleStatus }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b text-left">
          <tr>
            <th className="pb-4 font-medium">Nome</th>
            <th className="pb-4 font-medium">E-mail</th>
            <th className="pb-4 font-medium">Tipo</th>
            <th className="pb-4 font-medium">Status</th>
            <th className="pb-4 font-medium">Data de Cadastro</th>
            <th className="pb-4 font-medium">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="py-4">{user.name}</td>
              <td className="py-4">{user.email}</td>
              <td className="py-4">
                {user.type === "student" ? "Aluno" : "Professor"}
              </td>
              <td className="py-4">
                <span
                  className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                    user.status === "active"
                      ? "bg-green-100 text-green-700"
                      : user.status === "inactive"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
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
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl"
                    onClick={() => onViewUser(user.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl"
                    onClick={() => onEditUser(user.id)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`rounded-xl ${
                      user.status === "active"
                        ? "text-red-600 hover:bg-red-50"
                        : "text-green-600 hover:bg-green-50"
                    }`}
                    onClick={() => onToggleStatus(user.id)}
                  >
                    {user.status === "active" ? "Desativar" : "Ativar"}
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function UsuariosPage() {
  const [viewUser, setViewUser] = useState<User | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);
  
  // Mock data - replace with API calls
  const users: User[] = [
    {
      id: "1",
      name: "João Silva",
      email: "joao.silva@escola.edu.br",
      type: "student",
      status: "active",
      createdAt: "2023-10-01",
    },
    {
      id: "2",
      name: "Maria Santos",
      email: "maria.santos@escola.edu.br",
      type: "teacher",
      status: "pending",
      createdAt: "2023-10-02",
    },
  ];

  const handleSaveUser = (userData: Omit<User, 'createdAt'>) => {
    console.log('Save user:', userData);
    // Add API call here
  };

  const handleToggleStatus = (id: string) => {
    console.log('Toggle status:', id);
    // Add API call here
  };

  return (
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
      
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Gestão de Usuários</h1>
          <p className="text-muted-foreground">
            Gerencie alunos e professores do sistema
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl">
            <Upload className="mr-2 h-4 w-4" />
            Importar CSV
          </Button>
          <Button className="rounded-xl">
            <UserPlus className="mr-2 h-4 w-4" />
            Novo Usuário
          </Button>
        </div>
      </header>

      <Card className="rounded-xl">
        <CardContent className="p-6">
          <Tabs defaultValue="all">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <TabsList className="rounded-2xl">
                <TabsTrigger value="all" className="rounded-2xl">
                  Todos
                </TabsTrigger>
                <TabsTrigger value="students" className="rounded-2xl">
                  Alunos
                </TabsTrigger>
                <TabsTrigger value="teachers" className="rounded-2xl">
                  Professores
                </TabsTrigger>
              </TabsList>

              <div className="flex gap-2">
                <div className="flex max-w-[320px] items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Buscar usuários..." className="rounded-xl" />
                </div>
                <Button variant="outline" className="rounded-xl">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtros
                </Button>
                <Button variant="outline" className="rounded-xl">
                  <Download className="mr-2 h-4 w-4" />
                  Exportar
                </Button>
              </div>
            </div>

            <TabsContent value="all">
              <UsersTable
                users={users}
                onViewUser={(id) => setViewUser(users.find(u => u.id === id) || null)}
                onEditUser={(id) => setEditUser(users.find(u => u.id === id) || null)}
                onToggleStatus={handleToggleStatus}
              />
            </TabsContent>

            <TabsContent value="students">
              <UsersTable
                users={users.filter((u) => u.type === "student")}
                onViewUser={(id) => console.log("View user", id)}
                onEditUser={(id) => console.log("Edit user", id)}
                onToggleStatus={(id) => console.log("Toggle status", id)}
              />
            </TabsContent>

            <TabsContent value="teachers">
              <UsersTable
                users={users.filter((u) => u.type === "teacher")}
                onViewUser={(id) => console.log("View user", id)}
                onEditUser={(id) => console.log("Edit user", id)}
                onToggleStatus={(id) => console.log("Toggle status", id)}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}