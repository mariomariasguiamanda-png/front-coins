import { useState } from "react";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Search,
  Filter,
  Download,
  XCircle,
  ArrowRight,
  TrendingUp,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CancelarCompraDialog } from "@/components/adm/dialogs/CancelarCompraDialog";
import { createNotification, composeMessages } from "@/services/api/notifications";

// Interfaces
interface Transacao {
  id: string;
  alunoId: string;
  alunoNome: string;
  alunoTurma: string;
  disciplinaId: string;
  disciplinaNome: string;
  professorNome: string;
  pontosComprados: number;
  moedasGastas: number;
  saldoAntes: number;
  saldoDepois: number;
  data: string;
  status: "concluida" | "cancelada";
  cancelamento?: {
    data: string;
    adminNome: string;
    motivo: string;
  };
}

// Mock data
const mockTransacoes: Transacao[] = [
  {
    id: "1",
    alunoId: "1",
    alunoNome: "Ana Souza",
    alunoTurma: "3º A",
    disciplinaId: "1",
    disciplinaNome: "Matemática",
    professorNome: "João Silva",
    pontosComprados: 3,
    moedasGastas: 60,
    saldoAntes: 150,
    saldoDepois: 90,
    data: "2025-10-12T10:30:00Z",
    status: "concluida"
  },
  {
    id: "2",
    alunoId: "2",
    alunoNome: "Pedro Santos",
    alunoTurma: "3º B",
    disciplinaId: "2",
    disciplinaNome: "História",
    professorNome: "Maria Oliveira",
    pontosComprados: 2,
    moedasGastas: 40,
    saldoAntes: 100,
    saldoDepois: 60,
    data: "2025-10-12T09:15:00Z",
    status: "cancelada",
    cancelamento: {
      data: "2025-10-12T09:30:00Z",
      adminNome: "Admin Principal",
      motivo: "Erro técnico no sistema"
    }
  }
];

export default function ComprasPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState("todas");
  const [filtroTurma, setFiltroTurma] = useState("todas");
  const [filtroDisciplina, setFiltroDisciplina] = useState("todas");
  const [selectedTransacao, setSelectedTransacao] = useState<Transacao | null>(null);
  const [showCancelarDialog, setShowCancelarDialog] = useState(false);

  // Dados únicos para filtros
  const turmas = Array.from(new Set(mockTransacoes.map(t => t.alunoTurma)));
  const disciplinas = Array.from(new Set(mockTransacoes.map(t => t.disciplinaNome)));

  // Filtragem de transações
  const transacoesFiltradas = mockTransacoes.filter(transacao => {
    const matchesSearch = 
      transacao.alunoNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transacao.disciplinaNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transacao.professorNome.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      currentTab === "todas" || 
      (currentTab === "concluidas" && transacao.status === "concluida") ||
      (currentTab === "canceladas" && transacao.status === "cancelada");
    
    const matchesTurma = 
      filtroTurma === "todas" || transacao.alunoTurma === filtroTurma;
    
    const matchesDisciplina = 
      filtroDisciplina === "todas" || transacao.disciplinaNome === filtroDisciplina;

    return matchesSearch && matchesStatus && matchesTurma && matchesDisciplina;
  });

  // Cálculos de estatísticas
  const totalTransacoes = transacoesFiltradas.length;
  const totalPontosComprados = transacoesFiltradas.reduce((sum, t) => sum + t.pontosComprados, 0);
  const totalMoedasGastas = transacoesFiltradas.reduce((sum, t) => sum + t.moedasGastas, 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Dialog de Cancelamento */}
        <CancelarCompraDialog
          open={showCancelarDialog}
          onClose={() => {
            setShowCancelarDialog(false);
            setSelectedTransacao(null);
          }}
          transacao={selectedTransacao}
          onConfirm={async (motivo) => {
            console.log("Cancelar transação:", selectedTransacao?.id, motivo);
            if (selectedTransacao) {
              const { alunoNome, moedasGastas } = selectedTransacao;
              const { message, actionType } = composeMessages.purchaseCanceled({
                adminNome: "Administrador (sessão)",
                alunoNome,
                valor: moedasGastas,
              });
              await createNotification({ message, actionType, recipients: ["Administrador", "Coordenador"], context: { motivo, transacaoId: selectedTransacao.id } });
            }
            setShowCancelarDialog(false);
            setSelectedTransacao(null);
          }}
        />

        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">Controle de Compras de Pontos</h1>
            <p className="text-muted-foreground">
              Gerencie e monitore as transações de compra de pontos no sistema
            </p>
          </div>
          <Button
            className="rounded-lg bg-violet-600 hover:bg-violet-700"
            onClick={() => {
              // Implementar exportação
              console.log("Exportar relatório");
            }}
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar Relatório
          </Button>
        </header>

        {/* Overview Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-violet-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total de Transações</p>
                  <p className="text-2xl font-bold text-violet-600">{totalTransacoes}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <ArrowRight className="h-5 w-5 text-emerald-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Pontos Comprados</p>
                  <p className="text-2xl font-bold text-emerald-600">{totalPontosComprados}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-amber-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Moedas Gastas</p>
                  <p className="text-2xl font-bold text-amber-600">{totalMoedasGastas}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="rounded-xl">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex max-w-[320px] items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por aluno, disciplina..."
                  className="rounded-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Select value={filtroTurma} onValueChange={setFiltroTurma}>
                  <SelectTrigger className="w-[150px] rounded-lg">
                    <SelectValue placeholder="Turma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas as turmas</SelectItem>
                    {turmas.map((turma) => (
                      <SelectItem key={turma} value={turma}>
                        {turma}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filtroDisciplina} onValueChange={setFiltroDisciplina}>
                  <SelectTrigger className="w-[180px] rounded-lg">
                    <SelectValue placeholder="Disciplina" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas as disciplinas</SelectItem>
                    {disciplinas.map((disciplina) => (
                      <SelectItem key={disciplina} value={disciplina}>
                        {disciplina}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button variant="outline" className="rounded-lg">
                  <Filter className="mr-2 h-4 w-4" />
                  Mais Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs e Tabela */}
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="todas">Todas</TabsTrigger>
            <TabsTrigger value="concluidas">Concluídas</TabsTrigger>
            <TabsTrigger value="canceladas">Canceladas</TabsTrigger>
          </TabsList>

          <Card className="mt-4 rounded-xl">
            <CardContent className="p-6">
              <div className="rounded-lg border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="py-3 px-4 text-left text-sm font-medium">Data/Hora</th>
                      <th className="py-3 px-4 text-left text-sm font-medium">Aluno</th>
                      <th className="py-3 px-4 text-left text-sm font-medium">Disciplina</th>
                      <th className="py-3 px-4 text-left text-sm font-medium">Pontos</th>
                      <th className="py-3 px-4 text-left text-sm font-medium">Moedas</th>
                      <th className="py-3 px-4 text-left text-sm font-medium">Status</th>
                      <th className="py-3 px-4 text-left text-sm font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transacoesFiltradas.map((transacao) => (
                      <tr key={transacao.id} className="border-b">
                        <td className="py-3 px-4 text-sm">
                          {new Date(transacao.data).toLocaleString("pt-BR")}
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{transacao.alunoNome}</p>
                            <p className="text-sm text-muted-foreground">{transacao.alunoTurma}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p>{transacao.disciplinaNome}</p>
                            <p className="text-sm text-muted-foreground">Prof. {transacao.professorNome}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-emerald-600">
                            +{transacao.pontosComprados}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-amber-600">
                            -{transacao.moedasGastas}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              transacao.status === "concluida"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {transacao.status === "concluida" ? "Concluída" : "Cancelada"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700"
                              onClick={() => {
                                setSelectedTransacao(transacao);
                                setShowCancelarDialog(true);
                              }}
                              disabled={transacao.status === "cancelada"}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </AdminLayout>
  );
}