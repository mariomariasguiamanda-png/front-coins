import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdminLog, createLog, listLogs } from "@/services/api/logs";
import { createNotification, composeMessages } from "@/services/api/notifications";
import {
  ArrowUpDown,
  Plus,
  Minus,
  History,
  ChevronLeft,
  Save,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertCircle,
  User,
  BookOpen,
  Clock,
  FileText,
} from "lucide-react";

interface AjusteForm {
  alunoId: string;
  disciplinaId: string;
  quantidade: number;
  tipo: "credito" | "debito";
  justificativa: string;
}

// Mock data para dropdowns
const mockAlunos = [
  { id: "1", nome: "João Silva", turma: "3º A" },
  { id: "2", nome: "Maria Souza", turma: "3º A" },
  { id: "3", nome: "Pedro Santos", turma: "3º B" },
  { id: "4", nome: "Ana Costa", turma: "3º A" },
  { id: "5", nome: "Carlos Lima", turma: "3º B" },
];

const mockDisciplinas = [
  { id: "1", nome: "Matemática" },
  { id: "2", nome: "Português" },
  { id: "3", nome: "Física" },
  { id: "4", nome: "Química" },
  { id: "5", nome: "Biologia" },
];

export default function MoedasAjustesPage() {
  const [form, setForm] = useState<AjusteForm>({
    alunoId: "",
    disciplinaId: "",
    quantidade: 0,
    tipo: "credito",
    justificativa: "",
  });
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await listLogs();
        if (mounted) setLogs(data.slice(-15).reverse());
      } catch {
        // noop
      }
    })();
    return () => {
      mounted = false;
    };
  }, [saved]);

  const handleAjustar = () => {
    if (!form.alunoId || !form.disciplinaId || !form.quantidade) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      const { message, actionType } = composeMessages.coinsAdjusted({
        adminNome: "Administrador (sessão)",
        alunoId: form.alunoId,
        disciplinaId: form.disciplinaId,
        quantidade: form.tipo === "debito" ? -form.quantidade : form.quantidade,
        justificativa: form.justificativa,
      });
      createNotification({
        message,
        actionType,
        recipients: ["Administrador", "Coordenador"],
        context: { ...form },
      });
    } catch {}

    createLog({
      usuarioNome: "Administrador (sessão)",
      usuarioPerfil: "Administrador",
      acao: `Ajuste manual (${form.tipo}): Aluno ${form.alunoId}, Disciplina ${form.disciplinaId}, ${form.tipo === "debito" ? "-" : "+"}${form.quantidade} moedas - ${form.justificativa}`,
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);

    setForm({
      alunoId: "",
      disciplinaId: "",
      quantidade: 0,
      tipo: "credito",
      justificativa: "",
    });
  };

  const alunoSelecionado = mockAlunos.find((a) => a.id === form.alunoId);
  const disciplinaSelecionada = mockDisciplinas.find((d) => d.id === form.disciplinaId);

  const stats = {
    ajustesHoje: 12,
    creditosHoje: 8,
    debitosHoje: 4,
    totalMoedas: 450,
  };

  return (
    <AdminLayout>
      <div className="space-y-6 pb-8">
        {/* Header */}
        <header className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <ArrowUpDown className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Ajustes Manuais</h1>
                <p className="text-gray-600 mt-1">Credite ou debite moedas com justificativa</p>
              </div>
            </div>
            <a href="/adm/moedas" className="no-underline">
              <Button variant="outline" className="rounded-lg inline-flex items-center gap-2">
                <ChevronLeft className="h-4 w-4" />
                Voltar ao hub
              </Button>
            </a>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="rounded-xl border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Ajustes Hoje</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.ajustesHoje}</p>
                    <p className="text-xs text-gray-500 mt-1">total de operações</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Activity className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Créditos</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.creditosHoje}</p>
                    <p className="text-xs text-gray-500 mt-1">adições hoje</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <Plus className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-l-4 border-l-red-500 bg-gradient-to-br from-red-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Débitos</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.debitosHoje}</p>
                    <p className="text-xs text-gray-500 mt-1">remoções hoje</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                    <Minus className="h-5 w-5 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-l-4 border-l-amber-500 bg-gradient-to-br from-amber-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Ajustado</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">+{stats.totalMoedas}</p>
                    <p className="text-xs text-gray-500 mt-1">moedas líquidas</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </header>

        {/* Alert */}
        <Card className="rounded-xl border-l-4 border-l-amber-500 bg-gradient-to-br from-amber-50 to-white">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Atenção</h4>
                <p className="text-sm text-gray-600">
                  Ajustes manuais afetam imediatamente o saldo do aluno e são registrados no histórico.
                  Sempre forneça uma justificativa clara para auditoria.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Card */}
        <Card className="rounded-xl shadow-sm">
          <div className="h-2 bg-gradient-to-r from-green-500 to-green-600 rounded-t-xl"></div>
          <CardContent className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Novo Ajuste</h2>
              <p className="text-sm text-gray-600">
                Preencha os dados abaixo para realizar um ajuste manual no saldo do aluno.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {/* Selecionar Aluno */}
              <div className="space-y-2">
                <Label htmlFor="aluno" className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-600" />
                  Aluno
                </Label>
                <Select value={form.alunoId} onValueChange={(v) => setForm((f) => ({ ...f, alunoId: v }))}>
                  <SelectTrigger id="aluno" className="rounded-lg">
                    <SelectValue placeholder="Selecione um aluno" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockAlunos.map((aluno) => (
                      <SelectItem key={aluno.id} value={aluno.id}>
                        {aluno.nome} - {aluno.turma}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {alunoSelecionado && (
                  <p className="text-xs text-gray-600">Turma: {alunoSelecionado.turma}</p>
                )}
              </div>

              {/* Selecionar Disciplina */}
              <div className="space-y-2">
                <Label htmlFor="disciplina" className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-gray-600" />
                  Disciplina
                </Label>
                <Select value={form.disciplinaId} onValueChange={(v) => setForm((f) => ({ ...f, disciplinaId: v }))}>
                  <SelectTrigger id="disciplina" className="rounded-lg">
                    <SelectValue placeholder="Selecione uma disciplina" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockDisciplinas.map((disc) => (
                      <SelectItem key={disc.id} value={disc.id}>
                        {disc.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tipo de Ajuste */}
              <div className="space-y-2">
                <Label htmlFor="tipo" className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4 text-gray-600" />
                  Tipo de Ajuste
                </Label>
                <Select value={form.tipo} onValueChange={(v: "credito" | "debito") => setForm((f) => ({ ...f, tipo: v }))}>
                  <SelectTrigger id="tipo" className="rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credito">
                      <div className="flex items-center gap-2">
                        <Plus className="h-4 w-4 text-green-600" />
                        Crédito (adicionar moedas)
                      </div>
                    </SelectItem>
                    <SelectItem value="debito">
                      <div className="flex items-center gap-2">
                        <Minus className="h-4 w-4 text-red-600" />
                        Débito (remover moedas)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Quantidade */}
              <div className="space-y-2">
                <Label htmlFor="quantidade" className="text-sm font-semibold text-gray-900">
                  Quantidade de Moedas
                </Label>
                <Input
                  id="quantidade"
                  type="number"
                  min="0"
                  value={form.quantidade || ""}
                  onChange={(e) => setForm((f) => ({ ...f, quantidade: Number(e.target.value) }))}
                  placeholder="ex: 50"
                  className="rounded-lg text-lg font-bold text-center"
                />
              </div>

              {/* Justificativa */}
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="justificativa" className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-600" />
                  Justificativa
                </Label>
                <Input
                  id="justificativa"
                  value={form.justificativa}
                  onChange={(e) => setForm((f) => ({ ...f, justificativa: e.target.value }))}
                  placeholder="Ex: Correção de lançamento incorreto"
                  className="rounded-lg"
                />
                <p className="text-xs text-gray-600">
                  Descreva o motivo deste ajuste para registro no histórico
                </p>
              </div>
            </div>

            {/* Preview */}
            {form.alunoId && form.disciplinaId && form.quantidade > 0 && (
              <Card className="rounded-lg bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200">
                <CardContent className="p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Resumo do Ajuste</h3>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="text-gray-600">Aluno:</span>{" "}
                      <span className="font-semibold text-gray-900">{alunoSelecionado?.nome}</span>
                    </p>
                    <p>
                      <span className="text-gray-600">Disciplina:</span>{" "}
                      <span className="font-semibold text-gray-900">{disciplinaSelecionada?.nome}</span>
                    </p>
                    <p>
                      <span className="text-gray-600">Operação:</span>{" "}
                      <span className={`font-bold ${form.tipo === "credito" ? "text-green-600" : "text-red-600"}`}>
                        {form.tipo === "credito" ? "+" : "-"}
                        {form.quantidade} moedas
                      </span>
                    </p>
                    {form.justificativa && (
                      <p>
                        <span className="text-gray-600">Justificativa:</span>{" "}
                        <span className="text-gray-900">{form.justificativa}</span>
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-3">
              <Button
                variant="outline"
                className="rounded-lg"
                onClick={() =>
                  setForm({
                    alunoId: "",
                    disciplinaId: "",
                    quantidade: 0,
                    tipo: "credito",
                    justificativa: "",
                  })
                }
              >
                Limpar
              </Button>
              <Button
                className={`rounded-lg inline-flex items-center gap-2 ${
                  form.tipo === "credito"
                    ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                    : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                }`}
                onClick={handleAjustar}
                disabled={!form.alunoId || !form.disciplinaId || !form.quantidade}
              >
                <Save className="h-4 w-4" />
                {saved ? "Ajuste Realizado!" : form.tipo === "credito" ? "Creditar Moedas" : "Debitar Moedas"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Histórico */}
        <Card className="rounded-xl shadow-sm">
          <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-xl"></div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <History className="h-5 w-5 text-gray-600" />
                <h3 className="text-xl font-bold text-gray-900">Histórico Recente</h3>
              </div>
              <p className="text-sm text-gray-600">Últimos 15 registros</p>
            </div>

            <div className="space-y-3">
              {logs.length === 0 && (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Nenhum registro encontrado</p>
                </div>
              )}
              {logs.map((log: AdminLog, idx: number) => {
                const isCredito = log.acao.includes("credito") || log.acao.includes("+");
                const isDebito = log.acao.includes("debito") || log.acao.includes("-");
                const borderColor = isCredito ? "border-l-green-500" : isDebito ? "border-l-red-500" : "border-l-blue-500";

                return (
                  <Card
                    key={log.id ?? idx}
                    className={`rounded-lg border-l-4 hover:shadow-sm transition-shadow ${borderColor}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div
                            className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              isCredito
                                ? "bg-green-100"
                                : isDebito
                                ? "bg-red-100"
                                : "bg-blue-100"
                            }`}
                          >
                            {isCredito ? (
                              <Plus className="h-4 w-4 text-green-600" />
                            ) : isDebito ? (
                              <Minus className="h-4 w-4 text-red-600" />
                            ) : (
                              <Activity className="h-4 w-4 text-blue-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 mb-1">{log.usuarioNome}</p>
                            <p className="text-sm text-gray-600">{log.acao}</p>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-xs text-gray-500">
                            {new Date(log.dataHora).toLocaleString("pt-BR")}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
