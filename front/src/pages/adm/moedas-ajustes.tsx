import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { AdmBackButton } from "@/components/adm/AdmBackButton";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/lib/api";
import {
  ArrowUpDown,
  Plus,
  Minus,
  History,
  Save,
  TrendingUp,
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

type AlunoOption = { id: string; nome: string; turma: string };
type DisciplinaOption = { id: string; nome: string };
type Transacao = {
  id_transacao: number;
  quantidade: number;
  descricao: string | null;
  criado_em: string | null;
  alunos?: { matricula: string; usuarios: { nome: string } };
  disciplinas?: { nome: string };
};

export default function MoedasAjustesPage() {
  const [form, setForm] = useState<AjusteForm>({
    alunoId: "",
    disciplinaId: "",
    quantidade: 0,
    tipo: "credito",
    justificativa: "",
  });
  const [alunos, setAlunos] = useState<AlunoOption[]>([]);
  const [disciplinas, setDisciplinas] = useState<DisciplinaOption[]>([]);
  const [historico, setHistorico] = useState<Transacao[]>([]);
  const [saved, setSaved] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const carregarHistorico = async () => {
    try {
      const data = await api.get("/admin/moedas/transacoes?tipo=ajuste_admin");
      setHistorico((data ?? []).slice(0, 15));
    } catch {
      // noop
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [saldos, discs] = await Promise.all([
          api.get("/admin/moedas/saldos"),
          api.get("/disciplinas"),
        ]);
        if (!mounted) return;
        setAlunos(
          (saldos ?? []).map((a: any) => ({
            id: String(a.id_aluno),
            nome: a.nome,
            turma: a.turma ?? "Sem turma",
          })),
        );
        setDisciplinas(
          (discs ?? []).map((d: any) => ({ id: String(d.id_disciplina), nome: d.nome })),
        );
      } catch (err) {
        console.error("Erro ao carregar alunos/disciplinas:", err);
      }
    })();
    carregarHistorico();
    return () => {
      mounted = false;
    };
  }, []);

  const handleAjustar = async () => {
    if (!form.alunoId || !form.disciplinaId || !form.quantidade || !form.justificativa.trim()) {
      alert("Preencha todos os campos obrigatórios (incluindo a justificativa)");
      return;
    }

    try {
      setSalvando(true);
      setErro(null);

      await api.post("/admin/moedas/ajuste", {
        id_aluno: form.alunoId,
        id_disciplina: form.disciplinaId,
        quantidade: form.tipo === "debito" ? -form.quantidade : form.quantidade,
        motivo: form.justificativa.trim(),
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      setForm({ alunoId: "", disciplinaId: "", quantidade: 0, tipo: "credito", justificativa: "" });
      await carregarHistorico();
    } catch (err: any) {
      console.error(err);
      setErro(err?.message ?? "Erro ao realizar o ajuste");
    } finally {
      setSalvando(false);
    }
  };

  const alunoSelecionado = alunos.find((a) => a.id === form.alunoId);
  const disciplinaSelecionada = disciplinas.find((d) => d.id === form.disciplinaId);

  const hoje = new Date().toDateString();
  const ajustesHoje = historico.filter(
    (t) => t.criado_em && new Date(t.criado_em).toDateString() === hoje,
  );
  const stats = {
    ajustesHoje: ajustesHoje.length,
    creditosHoje: ajustesHoje.filter((t) => t.quantidade > 0).length,
    debitosHoje: ajustesHoje.filter((t) => t.quantidade < 0).length,
    totalMoedas: ajustesHoje.reduce((s, t) => s + t.quantidade, 0),
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
            <AdmBackButton href="/adm/moedas" className="no-underline" />
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
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stats.totalMoedas >= 0 ? "+" : ""}
                      {stats.totalMoedas}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">moedas líquidas (hoje)</p>
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
                    {alunos.map((aluno) => (
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
                    {disciplinas.map((disc) => (
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
                disabled={salvando || !form.alunoId || !form.disciplinaId || !form.quantidade}
              >
                <Save className="h-4 w-4" />
                {salvando
                  ? "Salvando..."
                  : saved
                  ? "Ajuste Realizado!"
                  : form.tipo === "credito"
                  ? "Creditar Moedas"
                  : "Debitar Moedas"}
              </Button>
            </div>
            {erro && <p className="text-sm text-red-600 text-right">{erro}</p>}
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
              {historico.length === 0 && (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Nenhum ajuste registrado</p>
                </div>
              )}
              {historico.map((t) => {
                const isCredito = t.quantidade > 0;
                const borderColor = isCredito ? "border-l-green-500" : "border-l-red-500";

                return (
                  <Card
                    key={t.id_transacao}
                    className={`rounded-lg border-l-4 hover:shadow-sm transition-shadow ${borderColor}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div
                            className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              isCredito ? "bg-green-100" : "bg-red-100"
                            }`}
                          >
                            {isCredito ? (
                              <Plus className="h-4 w-4 text-green-600" />
                            ) : (
                              <Minus className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 mb-1">
                              {t.alunos?.usuarios?.nome ?? "Aluno"}
                              {t.disciplinas?.nome ? ` • ${t.disciplinas.nome}` : ""}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className={`font-bold ${isCredito ? "text-green-600" : "text-red-600"}`}>
                                {isCredito ? "+" : ""}
                                {t.quantidade} moedas
                              </span>
                              {t.descricao ? ` — ${t.descricao}` : ""}
                            </p>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-xs text-gray-500">
                            {t.criado_em ? new Date(t.criado_em).toLocaleString("pt-BR") : "-"}
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
