import { useMemo, useState } from "react";
import Link from "next/link";
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
  ArrowLeft,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CancelarCompraDialog } from "@/components/adm/dialogs/CancelarCompraDialog";
import { createNotification, composeMessages } from "@/services/api/notifications";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

// Shared mock
import { Transacao, mockTransacoes } from "@/lib/mock/compras";

export default function ComprasTransacoesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState("todas");
  const [filtroTurma, setFiltroTurma] = useState("todas");
  const [filtroDisciplina, setFiltroDisciplina] = useState("todas");
  const [filtroAluno, setFiltroAluno] = useState<string>("todos");
  const [selectedTransacao, setSelectedTransacao] = useState<Transacao | null>(null);
  const [showCancelarDialog, setShowCancelarDialog] = useState(false);
  const [filtrosOpen, setFiltrosOpen] = useState(false);
  const [filtroProfessor, setFiltroProfessor] = useState<string>("todos");
  const [periodoDe, setPeriodoDe] = useState<string>("");
  const [periodoAte, setPeriodoAte] = useState<string>("");
  const [detalhesOpen, setDetalhesOpen] = useState(false);
  const [logsCancelamentos, setLogsCancelamentos] = useState<Array<{id:string; quando:string; admin:string; motivo:string;}>>([]);

  // Dados únicos para filtros
  const turmas = useMemo(() => Array.from(new Set(mockTransacoes.map(t => t.alunoTurma))), []);
  const disciplinas = useMemo(() => Array.from(new Set(mockTransacoes.map(t => t.disciplinaNome))), []);
  const professores = useMemo(() => Array.from(new Set(mockTransacoes.map(t => t.professorNome))), []);
  const alunos = useMemo(() => Array.from(new Set(mockTransacoes.map(t => t.alunoNome))), []);

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

    const matchesAluno =
      filtroAluno === "todos" || transacao.alunoNome === filtroAluno;

    const matchesProfessor =
      filtroProfessor === "todos" || transacao.professorNome === filtroProfessor;

    const matchesPeriodo = (() => {
      if (!periodoDe && !periodoAte) return true;
      const ts = new Date(transacao.data).getTime();
      const de = periodoDe ? new Date(periodoDe).getTime() : -Infinity;
      const ate = periodoAte ? new Date(periodoAte).getTime() + 24*60*60*1000 - 1 : Infinity;
      return ts >= de && ts <= ate;
    })();

    return matchesSearch && matchesStatus && matchesTurma && matchesDisciplina && matchesAluno && matchesProfessor && matchesPeriodo;
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
            if (selectedTransacao) {
              const { alunoNome, moedasGastas } = selectedTransacao;
              const { message, actionType } = composeMessages.purchaseCanceled({
                adminNome: "Administrador (sessão)",
                alunoNome,
                valor: moedasGastas,
              });
              await createNotification({ message, actionType, recipients: ["Administrador", "Coordenador"], context: { motivo, transacaoId: selectedTransacao.id } });
              setLogsCancelamentos((prev) => [
                { id: selectedTransacao.id, quando: new Date().toISOString(), admin: "Administrador (sessão)", motivo },
                ...prev,
              ]);
            }
            setShowCancelarDialog(false);
            setSelectedTransacao(null);
          }}
        />

        {/* Dialog de Detalhes */}
        <Dialog open={detalhesOpen} onOpenChange={setDetalhesOpen}>
          <DialogContent className="rounded-xl">
            <DialogHeader>
              <DialogTitle>Detalhes da Transação</DialogTitle>
            </DialogHeader>
            {selectedTransacao && (
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-muted-foreground">Aluno</p>
                    <p className="font-medium">{selectedTransacao.alunoNome}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Turma</p>
                    <p className="font-medium">{selectedTransacao.alunoTurma}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Disciplina</p>
                    <p className="font-medium">{selectedTransacao.disciplinaNome}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Professor</p>
                    <p className="font-medium">{selectedTransacao.professorNome}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-muted-foreground">Pontos comprados</p>
                    <p className="font-semibold text-emerald-600">+{selectedTransacao.pontosComprados}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Moedas gastas</p>
                    <p className="font-semibold text-amber-600">-{selectedTransacao.moedasGastas}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Saldo antes</p>
                    <p className="font-medium">{selectedTransacao.saldoAntes}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Saldo depois</p>
                    <p className="font-medium">{selectedTransacao.saldoDepois}</p>
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground">Data/Hora</p>
                  <p className="font-medium">{new Date(selectedTransacao.data).toLocaleString("pt-BR")}</p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setDetalhesOpen(false)}>Fechar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">Transações de Compras</h1>
            <p className="text-muted-foreground">Gerencie e monitore as transações de compra de pontos</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/adm/compras" className="hidden md:block">
              <Button variant="outline" className="rounded-xl">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao Hub
              </Button>
            </Link>
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
          </div>
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

                <Button variant="outline" className="rounded-lg" onClick={() => setFiltrosOpen(true)}>
                  <Filter className="mr-2 h-4 w-4" />
                  Mais Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dialog Mais Filtros */}
        <Dialog open={filtrosOpen} onOpenChange={setFiltrosOpen}>
          <DialogContent className="rounded-xl">
            <DialogHeader>
              <DialogTitle>Filtros Avançados</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Aluno</p>
                <Select value={filtroAluno} onValueChange={setFiltroAluno}>
                  <SelectTrigger className="w-full rounded-lg">
                    <SelectValue placeholder="Aluno" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    {alunos.map((al) => (
                      <SelectItem key={al} value={al}>{al}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Professor</p>
                <Select value={filtroProfessor} onValueChange={setFiltroProfessor}>
                  <SelectTrigger className="w-full rounded-lg">
                    <SelectValue placeholder="Professor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    {professores.map((prof) => (
                      <SelectItem key={prof} value={prof}>{prof}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Período - de</p>
                  <Input type="date" value={periodoDe} onChange={(e) => setPeriodoDe(e.target.value)} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Período - até</p>
                  <Input type="date" value={periodoAte} onChange={(e) => setPeriodoAte(e.target.value)} />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setFiltrosOpen(false)}>Fechar</Button>
              <Button onClick={() => setFiltrosOpen(false)}>Aplicar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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
                            <Link href={{ pathname: "/adm/compras-relatorios", query: { disciplina: transacao.disciplinaNome } }} className="text-violet-600 hover:underline">
                              {transacao.disciplinaNome}
                            </Link>
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
                              className="rounded-lg"
                              onClick={() => {
                                setSelectedTransacao(transacao);
                                setDetalhesOpen(true);
                              }}
                            >
                              Detalhes
                            </Button>
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

        {/* Logs de cancelamento (simples) */}
        {logsCancelamentos.length > 0 && (
          <Card className="rounded-xl">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-3">Registros de Cancelamento</h2>
              <div className="space-y-2 text-sm">
                {logsCancelamentos.map((l, idx) => (
                  <div key={`${l.id}-${idx}`} className="flex items-center justify-between border-b py-2">
                    <div>
                      <p className="font-medium">Transação {l.id}</p>
                      <p className="text-muted-foreground">Motivo: {l.motivo}</p>
                    </div>
                    <div className="text-right text-muted-foreground">
                      <p>{new Date(l.quando).toLocaleString("pt-BR")}</p>
                      <p>{l.admin}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
