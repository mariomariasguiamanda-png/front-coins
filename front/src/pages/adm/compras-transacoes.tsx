import { useMemo, useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { AdmBackButton } from "@/components/adm/AdmBackButton";
import { AdmFiltersCard } from "@/components/adm/AdmFiltersCard";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Search,
  Download,
  XCircle,
  ArrowRight,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CancelarCompraDialog } from "@/components/adm/dialogs/CancelarCompraDialog";
import { createNotification, composeMessages } from "@/services/api/notifications";

// Shared mock
import { Transacao, mockTransacoes } from "@/lib/mock/compras";

export default function ComprasTransacoesPage() {
  const [transacoes, setTransacoes] = useState<Transacao[]>(mockTransacoes);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState("todas");
  const [filtroTurma, setFiltroTurma] = useState("todas");
  const [filtroDisciplina, setFiltroDisciplina] = useState("todas");
  const [selectedTransacao, setSelectedTransacao] = useState<Transacao | null>(null);
  const [showCancelarDialog, setShowCancelarDialog] = useState(false);
  const [logsCancelamentos, setLogsCancelamentos] = useState<Array<{id:string; quando:string; admin:string; motivo:string;}>>([]);

  // Dados únicos para filtros
  const turmas = useMemo(() => Array.from(new Set(transacoes.map(t => t.alunoTurma))), [transacoes]);
  const disciplinas = useMemo(() => Array.from(new Set(transacoes.map(t => t.disciplinaNome))), [transacoes]);

  // Filtragem de transações
  const transacoesFiltradas = transacoes.filter(transacao => {
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

  const handleExportar = () => {
    const csv = [
      "ID,Data,Aluno,Turma,Disciplina,Professor,Pontos Comprados,Moedas Gastas,Status",
      ...transacoesFiltradas.map(t =>
        `${t.id},${t.data},${t.alunoNome},${t.alunoTurma},${t.disciplinaNome},${t.professorNome},${t.pontosComprados},${t.moedasGastas},${t.status}`
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `transacoes-compras-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCancelarTransacao = async (motivo: string) => {
    if (selectedTransacao) {
      // Atualizar o status da transação
      setTransacoes(prev => 
        prev.map(t => 
          t.id === selectedTransacao.id 
            ? { ...t, status: "cancelada" as const }
            : t
        )
      );

      const { message, actionType } = composeMessages.purchaseCanceled({
        motivo,
        transacaoId: selectedTransacao.id,
      });
      await createNotification({ 
        message, 
        actionType, 
        recipients: ["Administrador", "Coordenador"] 
      });
      
      setLogsCancelamentos((prev) => [
        { 
          id: selectedTransacao.id, 
          quando: new Date().toISOString(), 
          admin: "Administrador (sessão)", 
          motivo 
        },
        ...prev,
      ]);
    }
    setShowCancelarDialog(false);
    setSelectedTransacao(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 pb-8">
        {/* Dialog de Cancelamento */}
        <CancelarCompraDialog
          open={showCancelarDialog}
          onClose={() => {
            setShowCancelarDialog(false);
            setSelectedTransacao(null);
          }}
          transacao={selectedTransacao}
          onConfirm={handleCancelarTransacao}
        />

        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">Transações de Compras</h1>
            <p className="text-muted-foreground">Gerencie e monitore as transações de compra de pontos</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/adm/compras" className="hidden md:block">
              <AdmBackButton href="/adm/compras" />
            </Link>
            <Button
              className="rounded-lg bg-violet-600 hover:bg-violet-700"
              onClick={handleExportar}
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

        <AdmFiltersCard accentClassName="from-violet-500 to-violet-600">
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


              </div>
            </div>
        </AdmFiltersCard>


        {/* Tabs e Tabela */}
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px] rounded-xl border border-slate-200 bg-slate-100 p-1">
            <TabsTrigger
              value="todas"
              className="rounded-lg text-slate-600 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
            >
              Todas
            </TabsTrigger>
            <TabsTrigger
              value="concluidas"
              className="rounded-lg text-slate-600 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
            >
              Concluídas
            </TabsTrigger>
            <TabsTrigger
              value="canceladas"
              className="rounded-lg text-slate-600 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
            >
              Canceladas
            </TabsTrigger>
          </TabsList>

          <Card className="mt-4 rounded-xl">
            <CardContent className="p-6">
              <div className="rounded-lg border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-slate-100">
                      <th className="py-3 px-4 text-left text-sm font-semibold text-slate-700">Data/Hora</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-slate-700">Aluno</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-slate-700">Disciplina</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-slate-700">Pontos</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-slate-700">Moedas</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-slate-700">Status</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-slate-700">Ações</th>
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
