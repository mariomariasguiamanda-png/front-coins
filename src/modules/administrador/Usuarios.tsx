import { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  UserPlus,
  GraduationCap,
  BookOpen,
  Shield,
} from "lucide-react";

interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipo: "aluno" | "professor" | "administrador";
  status: "ativo" | "inativo" | "pendente";
  dataCadastro: string;
  ultimoAcesso: string;
  disciplinas?: string[];
  turma?: string;
  moedas?: number;
}

const mockUsuarios: Usuario[] = [
  {
    id: 1,
    nome: "Ana Silva",
    email: "ana.silva@escola.com",
    tipo: "aluno",
    status: "ativo",
    dataCadastro: "2024-02-15",
    ultimoAcesso: "2024-09-28",
    turma: "3º A",
    moedas: 1250,
  },
  {
    id: 2,
    nome: "Prof. João Santos",
    email: "joao.santos@escola.com",
    tipo: "professor",
    status: "ativo",
    dataCadastro: "2024-01-10",
    ultimoAcesso: "2024-09-27",
    disciplinas: ["Matemática", "Física"],
  },
  {
    id: 3,
    nome: "Maria Oliveira",
    email: "maria.oliveira@escola.com",
    tipo: "aluno",
    status: "inativo",
    dataCadastro: "2024-03-20",
    ultimoAcesso: "2024-08-15",
    turma: "2º B",
    moedas: 380,
  },
  {
    id: 4,
    nome: "Admin Carlos",
    email: "carlos.admin@escola.com",
    tipo: "administrador",
    status: "ativo",
    dataCadastro: "2024-01-01",
    ultimoAcesso: "2024-09-28",
  },
  {
    id: 5,
    nome: "Pedro Costa",
    email: "pedro.costa@escola.com",
    tipo: "aluno",
    status: "pendente",
    dataCadastro: "2024-09-25",
    ultimoAcesso: "2024-09-25",
    turma: "1º C",
    moedas: 0,
  },
];

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>(mockUsuarios);
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [editandoUsuario, setEditandoUsuario] = useState<number | null>(null);

  const tipos = ["aluno", "professor", "administrador"];
  const status = ["ativo", "inativo", "pendente"];

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "aluno":
        return <GraduationCap className="h-4 w-4" />;
      case "professor":
        return <BookOpen className="h-4 w-4" />;
      case "administrador":
        return <Shield className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getTipoColor = (tipo: string) => {
    const colors = {
      aluno: "bg-blue-100 text-blue-800 border-blue-200",
      professor: "bg-green-100 text-green-800 border-green-200",
      administrador: "bg-purple-100 text-purple-800 border-purple-200",
    };
    return colors[tipo as keyof typeof colors] || colors.aluno;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      ativo: "bg-green-100 text-green-800 border-green-200",
      inativo: "bg-red-100 text-red-800 border-red-200",
      pendente: "bg-yellow-100 text-yellow-800 border-yellow-200",
    };
    return colors[status as keyof typeof colors] || colors.pendente;
  };

  const usuariosFiltrados = usuarios.filter((usuario) => {
    const filtroTipoOk = filtroTipo === "todos" || usuario.tipo === filtroTipo;
    const filtroStatusOk =
      filtroStatus === "todos" || usuario.status === filtroStatus;
    return filtroTipoOk && filtroStatusOk;
  });

  const handleAdicionarUsuario = () => {
    const novoUsuario: Usuario = {
      id: Date.now(),
      nome: "Novo Usuário",
      email: "novo@escola.com",
      tipo: "aluno",
      status: "pendente",
      dataCadastro: new Date().toISOString().split("T")[0],
      ultimoAcesso: new Date().toISOString().split("T")[0],
      turma: "1º A",
      moedas: 0,
    };
    setUsuarios([...usuarios, novoUsuario]);
    setEditandoUsuario(novoUsuario.id);
  };

  const handleSalvarUsuario = (id: number) => {
    setEditandoUsuario(null);
    console.log("Usuário salvo:", id);
  };

  const handleExcluirUsuario = (id: number) => {
    setUsuarios((prev) => prev.filter((u) => u.id !== id));
  };

  const handleAlterarStatus = (id: number, novoStatus: string) => {
    setUsuarios((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: novoStatus as any } : u))
    );
  };

  const estatisticas = {
    total: usuarios.length,
    alunos: usuarios.filter((u) => u.tipo === "aluno").length,
    professores: usuarios.filter((u) => u.tipo === "professor").length,
    administradores: usuarios.filter((u) => u.tipo === "administrador").length,
    ativos: usuarios.filter((u) => u.status === "ativo").length,
    pendentes: usuarios.filter((u) => u.status === "pendente").length,
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho da seção */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
            <Users className="h-6 w-6" />
            👥 Usuários
          </h2>
          <p className="text-white/80">
            Gerencie cadastros de alunos, professores e administradores.
          </p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30">
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
          <Button
            onClick={handleAdicionarUsuario}
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Novo usuário
          </Button>
        </div>
      </div>

      {/* Estatísticas rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold text-white">
              {estatisticas.total}
            </div>
            <div className="text-xs text-white/70">Total</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl bg-blue-500/10 border border-blue-300/20">
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold text-blue-400">
              {estatisticas.alunos}
            </div>
            <div className="text-xs text-blue-300">Alunos</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl bg-green-500/10 border border-green-300/20">
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold text-green-400">
              {estatisticas.professores}
            </div>
            <div className="text-xs text-green-300">Professores</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl bg-purple-500/10 border border-purple-300/20">
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold text-purple-400">
              {estatisticas.administradores}
            </div>
            <div className="text-xs text-purple-300">Admins</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl bg-emerald-500/10 border border-emerald-300/20">
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold text-emerald-400">
              {estatisticas.ativos}
            </div>
            <div className="text-xs text-emerald-300">Ativos</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl bg-yellow-500/10 border border-yellow-300/20">
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold text-yellow-400">
              {estatisticas.pendentes}
            </div>
            <div className="text-xs text-yellow-300">Pendentes</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e busca */}
      <Card className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-white/60" />
              <Input
                placeholder="Buscar por nome ou email..."
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm"
              >
                <option value="todos">Todos os tipos</option>
                {tipos.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                  </option>
                ))}
              </select>
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm"
              >
                <option value="todos">Todos os status</option>
                {status.map((st) => (
                  <option key={st} value={st}>
                    {st.charAt(0).toUpperCase() + st.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de usuários */}
      <div className="grid gap-4">
        {usuariosFiltrados.map((usuario) => (
          <Card
            key={usuario.id}
            className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-2 rounded-lg bg-white/10">
                    {getTipoIcon(usuario.tipo)}
                  </div>

                  <div className="flex-1">
                    {editandoUsuario === usuario.id ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-white/80 text-sm">
                              Nome
                            </Label>
                            <Input
                              value={usuario.nome}
                              className="bg-white/10 border-white/20 text-white"
                              onChange={(e) => {
                                setUsuarios((prev) =>
                                  prev.map((u) =>
                                    u.id === usuario.id
                                      ? { ...u, nome: e.target.value }
                                      : u
                                  )
                                );
                              }}
                            />
                          </div>
                          <div>
                            <Label className="text-white/80 text-sm">
                              Email
                            </Label>
                            <Input
                              value={usuario.email}
                              className="bg-white/10 border-white/20 text-white"
                              onChange={(e) => {
                                setUsuarios((prev) =>
                                  prev.map((u) =>
                                    u.id === usuario.id
                                      ? { ...u, email: e.target.value }
                                      : u
                                  )
                                );
                              }}
                            />
                          </div>
                          <div>
                            <Label className="text-white/80 text-sm">
                              Tipo
                            </Label>
                            <select
                              value={usuario.tipo}
                              onChange={(e) => {
                                setUsuarios((prev) =>
                                  prev.map((u) =>
                                    u.id === usuario.id
                                      ? { ...u, tipo: e.target.value as any }
                                      : u
                                  )
                                );
                              }}
                              className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm"
                            >
                              {tipos.map((tipo) => (
                                <option key={tipo} value={tipo}>
                                  {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                                </option>
                              ))}
                            </select>
                          </div>
                          {usuario.tipo === "aluno" && (
                            <div>
                              <Label className="text-white/80 text-sm">
                                Turma
                              </Label>
                              <Input
                                value={usuario.turma || ""}
                                className="bg-white/10 border-white/20 text-white"
                                onChange={(e) => {
                                  setUsuarios((prev) =>
                                    prev.map((u) =>
                                      u.id === usuario.id
                                        ? { ...u, turma: e.target.value }
                                        : u
                                    )
                                  );
                                }}
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleSalvarUsuario(usuario.id)}
                            className="bg-green-500/20 text-green-300 border-green-300/30 hover:bg-green-500/30"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Salvar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditandoUsuario(null)}
                            className="bg-transparent border-white/20 text-white/80 hover:bg-white/10"
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-white">
                            {usuario.nome}
                          </h3>
                          <Badge
                            className={`text-xs ${getTipoColor(usuario.tipo)}`}
                          >
                            {usuario.tipo}
                          </Badge>
                          <Badge
                            className={`text-xs ${getStatusColor(
                              usuario.status
                            )}`}
                          >
                            {usuario.status}
                          </Badge>
                        </div>

                        <div className="text-white/70 text-sm mb-2">
                          {usuario.email}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-white/60">Cadastro:</span>
                            <div className="text-white">
                              {new Date(
                                usuario.dataCadastro
                              ).toLocaleDateString("pt-BR")}
                            </div>
                          </div>
                          <div>
                            <span className="text-white/60">
                              Último acesso:
                            </span>
                            <div className="text-white">
                              {new Date(
                                usuario.ultimoAcesso
                              ).toLocaleDateString("pt-BR")}
                            </div>
                          </div>
                          {usuario.turma && (
                            <div>
                              <span className="text-white/60">Turma:</span>
                              <div className="text-white">{usuario.turma}</div>
                            </div>
                          )}
                          {usuario.moedas !== undefined && (
                            <div>
                              <span className="text-white/60">Moedas:</span>
                              <div className="text-yellow-400 font-semibold">
                                {usuario.moedas}
                              </div>
                            </div>
                          )}
                          {usuario.disciplinas && (
                            <div className="md:col-span-2">
                              <span className="text-white/60">
                                Disciplinas:
                              </span>
                              <div className="text-white">
                                {usuario.disciplinas.join(", ")}
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {editandoUsuario !== usuario.id && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-transparent border-white/20 text-white/80 hover:bg-white/10"
                      onClick={() => setEditandoUsuario(usuario.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>

                    {usuario.status === "pendente" && (
                      <Button
                        size="sm"
                        className="bg-green-500/20 text-green-300 border-green-300/30 hover:bg-green-500/30"
                        onClick={() => handleAlterarStatus(usuario.id, "ativo")}
                      >
                        Aprovar
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-transparent border-red-300/20 text-red-300 hover:bg-red-500/10"
                      onClick={() => handleExcluirUsuario(usuario.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
