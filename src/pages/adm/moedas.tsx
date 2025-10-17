import { useState } from "react";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/Input";
import {
  ArrowUpDown,
  Settings,
  Coins,
  History,
  Plus,
  Minus,
  Filter,
  Download,
  Search,
} from "lucide-react";
import { ConfigurarRegrasDialog } from "@/components/adm/dialogs/ConfigurarRegrasDialog";
import { AjustarMoedasDialog } from "@/components/adm/dialogs/AjustarMoedasDialog";
import { createLog } from "@/services/api/logs";
import { createNotification, composeMessages } from "@/services/api/notifications";

// Interfaces
interface RegrasDistribuicao {
  atividadeEntregue: number;
  atividadeNotaMaxima: number;
  resumoPostado: number;
  quizConcluido: number;
  limiteAluno: number;
  periodoDias: number;
}

interface HistoricoMovimentacao {
  id: string;
  alunoId: string;
  alunoNome: string;
  disciplinaId: string;
  disciplinaNome: string;
  quantidade: number;
  tipo: "ganho" | "gasto" | "ajuste";
  origem: string;
  data: string;
  adminId?: string;
  adminNome?: string;
  justificativa?: string;
}

interface SaldoAluno {
  id: string;
  nome: string;
  turma: string;
  saldoTotal: number;
  saldoPorDisciplina: {
    disciplinaId: string;
    disciplinaNome: string;
    saldo: number;
  }[];
}

// Mock data
const mockRegras: RegrasDistribuicao = {
  atividadeEntregue: 10,
  atividadeNotaMaxima: 20,
  resumoPostado: 15,
  quizConcluido: 25,
  limiteAluno: 500,
  periodoDias: 180,
};

const mockMovimentacoes: HistoricoMovimentacao[] = [
  {
    id: "1",
    alunoId: "1",
    alunoNome: "João Silva",
    disciplinaId: "1",
    disciplinaNome: "Matemática",
    quantidade: 10,
    tipo: "ganho",
    origem: "Atividade Entregue",
    data: "2025-10-12T10:00:00Z"
  },
  // Adicione mais exemplos aqui
];

const mockSaldos: SaldoAluno[] = [
  {
    id: "1",
    nome: "João Silva",
    turma: "3º A",
    saldoTotal: 370,
    saldoPorDisciplina: [
      { disciplinaId: "1", disciplinaNome: "Matemática", saldo: 250 },
      { disciplinaId: "2", disciplinaNome: "História", saldo: 120 }
    ]
  },
  // Adicione mais exemplos aqui
];

export default function MoedasPage() {
  const [currentTab, setCurrentTab] = useState("saldos");
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfigDialog, setShowConfigDialog] = useState(false);
  const [showAjusteDialog, setShowAjusteDialog] = useState(false);
  const [selectedPeriodo, setSelectedPeriodo] = useState("semestre");
  
  const saldoGeral = mockSaldos.reduce((total, aluno) => total + aluno.saldoTotal, 0);

  const filteredSaldos = mockSaldos.filter(aluno =>
    aluno.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    aluno.turma.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMovimentacoes = mockMovimentacoes.filter(mov =>
    mov.alunoNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mov.disciplinaNome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Dialogs */}
        <ConfigurarRegrasDialog
          open={showConfigDialog}
          onClose={() => setShowConfigDialog(false)}
          regrasAtuais={mockRegras}
          onSave={(novasRegras) => {
            console.log("Novas regras:", novasRegras);
            // Log administrativo (sessão)
            createLog({
              usuarioNome: "Administrador (sessão)",
              usuarioPerfil: "Administrador",
              acao: `Atualizou regras de moedas: ${JSON.stringify(novasRegras)}`,
            });
            setShowConfigDialog(false);
          }}
        />

        <AjustarMoedasDialog
          open={showAjusteDialog}
          onClose={() => setShowAjusteDialog(false)}
          onSave={(ajuste) => {
            console.log("Novo ajuste:", ajuste);
            // Log administrativo (sessão)
            try {
              const alvo = ajuste.alunoId || "aluno";
              const disc = ajuste.disciplinaId || "disciplina";
              const qtd = ajuste.quantidade;
              const just = ajuste.justificativa ? ` (justificativa: ${ajuste.justificativa})` : "";
              createLog({
                usuarioNome: "Administrador (sessão)",
                usuarioPerfil: "Administrador",
                acao: `Ajuste manual de moedas: ${qtd} para ${alvo} em ${disc}${just}`,
              });
              const { message, actionType } = composeMessages.coinsAdjusted({
                adminNome: "Administrador (sessão)",
                alunoId: ajuste.alunoId,
                disciplinaId: ajuste.disciplinaId,
                quantidade: ajuste.quantidade,
                justificativa: ajuste.justificativa,
              });
              createNotification({
                message,
                actionType,
                recipients: ["Administrador", "Coordenador"],
                context: { ...ajuste },
              });
            } catch {}
            setShowAjusteDialog(false);
          }}
        />

        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">Gestão de Moedas</h1>
            <p className="text-muted-foreground">
              Configure regras, monitore saldos e faça ajustes no sistema de moedas
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="rounded-lg"
              onClick={() => setShowConfigDialog(true)}
            >
              <Settings className="mr-2 h-4 w-4" />
              Configurar Regras
            </Button>
            <Button
              variant="outline"
              className="rounded-lg"
              onClick={() => setShowAjusteDialog(true)}
            >
              <ArrowUpDown className="mr-2 h-4 w-4" />
              Ajuste Manual
            </Button>
          </div>
        </header>

        {/* Overview Card */}
        <Card className="rounded-xl">
          <CardContent className="p-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Saldo Geral do Sistema</h3>
                <p className="text-3xl font-bold text-violet-600">{saldoGeral}</p>
                <p className="text-sm text-muted-foreground">moedas distribuídas</p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Limite por Aluno</h3>
                <p className="text-3xl font-bold text-violet-600">{mockRegras.limiteAluno}</p>
                <p className="text-sm text-muted-foreground">
                  moedas/{selectedPeriodo}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Média por Aluno</h3>
                <p className="text-3xl font-bold text-violet-600">
                  {Math.round(saldoGeral / mockSaldos.length)}
                </p>
                <p className="text-sm text-muted-foreground">moedas/aluno</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="saldos">Saldos</TabsTrigger>
            <TabsTrigger value="historico">Histórico</TabsTrigger>
          </TabsList>

          <Card className="mt-4 rounded-xl">
            <CardContent className="p-6">
              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex max-w-[320px] items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nome ou turma..."
                    className="rounded-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
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

              <TabsContent value="saldos" className="mt-0">
                <div className="rounded-lg border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="py-3 px-4 text-left text-sm font-medium">Aluno</th>
                        <th className="py-3 px-4 text-left text-sm font-medium">Turma</th>
                        <th className="py-3 px-4 text-left text-sm font-medium">Saldo Total</th>
                        <th className="py-3 px-4 text-left text-sm font-medium">Por Disciplina</th>
                        <th className="py-3 px-4 text-left text-sm font-medium">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSaldos.map((aluno) => (
                        <tr key={aluno.id} className="border-b">
                          <td className="py-3 px-4">{aluno.nome}</td>
                          <td className="py-3 px-4">{aluno.turma}</td>
                          <td className="py-3 px-4">
                            <span className="font-medium text-violet-600">
                              {aluno.saldoTotal}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="space-y-1">
                              {aluno.saldoPorDisciplina.map((disc) => (
                                <div key={disc.disciplinaId} className="text-sm">
                                  {disc.disciplinaNome}: {disc.saldo}
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-lg"
                                onClick={() => setShowAjusteDialog(true)}
                              >
                                <ArrowUpDown className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-lg"
                              >
                                <History className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="historico" className="mt-0">
                <div className="rounded-lg border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="py-3 px-4 text-left text-sm font-medium">Data</th>
                        <th className="py-3 px-4 text-left text-sm font-medium">Aluno</th>
                        <th className="py-3 px-4 text-left text-sm font-medium">Disciplina</th>
                        <th className="py-3 px-4 text-left text-sm font-medium">Tipo</th>
                        <th className="py-3 px-4 text-left text-sm font-medium">Quantidade</th>
                        <th className="py-3 px-4 text-left text-sm font-medium">Origem</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMovimentacoes.map((mov) => (
                        <tr key={mov.id} className="border-b">
                          <td className="py-3 px-4 text-sm">
                            {new Date(mov.data).toLocaleDateString("pt-BR")}
                          </td>
                          <td className="py-3 px-4">{mov.alunoNome}</td>
                          <td className="py-3 px-4">{mov.disciplinaNome}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                mov.tipo === "ganho"
                                  ? "bg-green-100 text-green-700"
                                  : mov.tipo === "gasto"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {mov.tipo === "ganho"
                                ? "Ganho"
                                : mov.tipo === "gasto"
                                ? "Gasto"
                                : "Ajuste"}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={
                                mov.tipo === "ganho"
                                  ? "text-green-600"
                                  : mov.tipo === "gasto"
                                  ? "text-red-600"
                                  : "text-yellow-600"
                              }
                            >
                              {mov.tipo === "gasto" ? "-" : "+"}{mov.quantidade}
                            </span>
                          </td>
                          <td className="py-3 px-4">{mov.origem}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </AdminLayout>
  );
}