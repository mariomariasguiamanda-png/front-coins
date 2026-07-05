import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  Plus,
  Edit2,
  Trash2,
  Users,
  Coins,
  FileText,
  AlertTriangle,
  ClipboardCheck,
  Download,
  X,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/router";

interface Activity {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  coins: number;
  status: "pendente" | "entregue" | "corrigida";
  submissions: number;
  totalStudents: number;
  discipline: string;
  id_disciplina: string;
}

interface DisciplinaOption {
  id: string;
  nome: string;
}

type TipoPergunta = "descritiva" | "multipla" | "vf";

interface PerguntaDraft {
  tempId: string;
  tipo: TipoPergunta;
  enunciado: string;
  peso: string;
  alternativa_a: string;
  alternativa_b: string;
  alternativa_c: string;
  alternativa_d: string;
  letra_correta: string;
  correta: boolean | null;
}

export interface PerguntaPayload {
  tipo: TipoPergunta;
  enunciado: string;
  peso?: number;
  alternativa_a?: string;
  alternativa_b?: string;
  alternativa_c?: string;
  alternativa_d?: string;
  letra_correta?: string;
  correta?: boolean;
}

const novaPerguntaVazia = (): PerguntaDraft => ({
  tempId: Math.random().toString(36).slice(2),
  tipo: "descritiva",
  enunciado: "",
  peso: "1",
  alternativa_a: "",
  alternativa_b: "",
  alternativa_c: "",
  alternativa_d: "",
  letra_correta: "",
  correta: null,
});

interface AtividadesProfessorProps {
  activities: Activity[];
  disciplinas: DisciplinaOption[];
  onCreateActivity: (dados: {
    titulo: string;
    descricao: string;
    id_disciplina: string;
    data_vencimento: string;
    recompensa_moedas: number;
  }) => Promise<string>;
  onCreateQuestion: (id_atividade: string, pergunta: PerguntaPayload) => Promise<void>;
  onEditActivity: (
    id: string,
    dados: { titulo: string; descricao: string; data_vencimento: string; recompensa_moedas: number }
  ) => Promise<void>;
  onDeleteActivity: (id: string) => Promise<void>;
}

export function AtividadesProfessor({
  activities = [],
  disciplinas = [],
  onCreateActivity,
  onCreateQuestion,
  onEditActivity,
  onDeleteActivity,
}: AtividadesProfessorProps) {
  const router = useRouter();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [deletingActivityId, setDeletingActivityId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("todas");
  const [searchTerm, setSearchTerm] = useState("");
  const [perguntas, setPerguntas] = useState<PerguntaDraft[]>([]);
  const [publicando, setPublicando] = useState(false);

  const atualizarPergunta = (tempId: string, patch: Partial<PerguntaDraft>) => {
    setPerguntas(perguntas.map(p => (p.tempId === tempId ? { ...p, ...patch } : p)));
  };

  const validarPerguntas = (): string | null => {
    for (const p of perguntas) {
      if (!p.enunciado.trim()) return "Toda pergunta precisa de um enunciado.";
      const peso = Number(p.peso);
      if (!p.peso.trim() || Number.isNaN(peso) || peso < 1) {
        return "O peso da pergunta precisa ser um número maior ou igual a 1.";
      }
      if (p.tipo === "multipla") {
        if (!p.alternativa_a.trim() || !p.alternativa_b.trim()) {
          return "Perguntas de múltipla escolha precisam de pelo menos as alternativas A e B.";
        }
        if (!p.letra_correta) return "Selecione qual alternativa é a correta.";
      }
      if (p.tipo === "vf" && p.correta === null) {
        return "Selecione se a afirmação é verdadeira ou falsa.";
      }
    }
    return null;
  };

  const perguntaParaPayload = (p: PerguntaDraft): PerguntaPayload => {
    const peso = Number(p.peso) || 1;
    if (p.tipo === "multipla") {
      return {
        tipo: "multipla",
        enunciado: p.enunciado,
        peso,
        alternativa_a: p.alternativa_a,
        alternativa_b: p.alternativa_b,
        alternativa_c: p.alternativa_c || undefined,
        alternativa_d: p.alternativa_d || undefined,
        letra_correta: p.letra_correta,
      };
    }
    if (p.tipo === "vf") {
      return { tipo: "vf", enunciado: p.enunciado, peso, correta: p.correta ?? undefined };
    }
    return { tipo: "descritiva", enunciado: p.enunciado, peso };
  };

  const exportarRelatorio = () => {
    const csvHeader = "Título,Disciplina,Data de Entrega,Moedas,Status,Entregas,Total de Alunos,Taxa de Entrega\n";
    const csvRows = activities.map(activity => {
      const submissionRate = activity.totalStudents
        ? ((activity.submissions / activity.totalStudents) * 100).toFixed(0)
        : 0;

      return [
        `"${activity.title}"`,
        `"${activity.discipline}"`,
        activity.dueDate,
        activity.coins,
        activity.status,
        activity.submissions,
        activity.totalStudents,
        `${submissionRate}%`
      ].join(",");
    }).join("\n");

    const csvContent = csvHeader + csvRows;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `relatorio_atividades_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "todas" || activity.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: activities.length,
    pendente: activities.filter(a => a.status === "pendente").length,
    entregue: activities.filter(a => a.status === "entregue").length,
    corrigida: activities.filter(a => a.status === "corrigida").length,
  };

  const getStatusConfig = (status: string) => {
    switch(status) {
      case "pendente":
        return {
          color: "text-amber-700 bg-amber-100 border-amber-200",
          icon: Clock,
          label: "Aguardando entregas"
        };
      case "entregue":
        return {
          color: "text-blue-700 bg-blue-100 border-blue-200",
          icon: AlertCircle,
          label: "Pendente correção"
        };
      case "corrigida":
        return {
          color: "text-green-700 bg-green-100 border-green-200",
          icon: CheckCircle2,
          label: "Corrigida"
        };
      default:
        return {
          color: "text-gray-700 bg-gray-100 border-gray-200",
          icon: Clock,
          label: status
        };
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Atividades</h1>
          <p className="text-gray-600 mt-1">Gerencie e acompanhe as atividades das suas turmas</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={exportarRelatorio}
            variant="outline"
            className="rounded-xl"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar Relatório
          </Button>
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="rounded-xl bg-violet-600 hover:bg-violet-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Atividade
          </Button>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="rounded-xl shadow-sm border-l-4 border-l-violet-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-violet-100 flex items-center justify-center">
                <FileText className="h-5 w-5 text-violet-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.pendente}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Entregues</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.entregue}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Corrigidas</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.corrigida}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Formulário de Criar Atividade */}
      {showCreateForm && (
        <Card className="rounded-xl shadow-md border-2 border-violet-200">
          <CardContent className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-violet-100 flex items-center justify-center">
                  <Plus className="h-5 w-5 text-violet-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Nova Atividade</h2>
                  <p className="text-sm text-gray-500">Preencha os dados abaixo</p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowCreateForm(false)}
                className="rounded-xl"
              >
                Cancelar
              </Button>
            </div>

            <form
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();

                const erroPerguntas = validarPerguntas();
                if (erroPerguntas) {
                  alert(erroPerguntas);
                  return;
                }

                const formData = new FormData(e.currentTarget);
                setPublicando(true);
                try {
                  const id_atividade = await onCreateActivity({
                    titulo: formData.get('titulo') as string,
                    descricao: formData.get('descricao') as string,
                    id_disciplina: formData.get('id_disciplina') as string,
                    data_vencimento: formData.get('data_vencimento') as string,
                    recompensa_moedas: Number(formData.get('recompensa_moedas')),
                  });

                  for (const pergunta of perguntas) {
                    await onCreateQuestion(id_atividade, perguntaParaPayload(pergunta));
                  }

                  setPerguntas([]);
                  setShowCreateForm(false);
                } catch (err) {
                  console.error(err);
                  alert("Erro ao criar atividade.");
                } finally {
                  setPublicando(false);
                }
              }}
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Título</Label>
                  <Input
                    name="titulo"
                    placeholder="Ex: Lista de Exercícios 1"
                    className="rounded-xl mt-1"
                    required
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Disciplina</Label>
                  <Select name="id_disciplina" required>
                    <SelectTrigger className="rounded-xl mt-1 bg-white">
                      <SelectValue placeholder="Selecione a disciplina" />
                    </SelectTrigger>
                    <SelectContent>
                      {disciplinas.map((d) => (
                        <SelectItem key={d.id} value={d.id}>{d.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Data de entrega</Label>
                  <Input name="data_vencimento" type="date" className="rounded-xl mt-1" required />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Moedas</Label>
                  <Input
                    name="recompensa_moedas"
                    type="number"
                    defaultValue={10}
                    className="rounded-xl mt-1"
                    min={1}
                    required
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Descrição</Label>
                <Textarea
                  name="descricao"
                  placeholder="Instruções, objetivos, critérios de avaliação..."
                  className="rounded-xl bg-white mt-1"
                  rows={4}
                  required
                />
              </div>

              {/* Perguntas */}
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Perguntas (opcional)</Label>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Descritiva (o aluno escreve a resposta), múltipla escolha ou verdadeiro/falso.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-xl"
                    onClick={() => setPerguntas([...perguntas, novaPerguntaVazia()])}
                  >
                    <Plus className="h-4 w-4 mr-1.5" />
                    Adicionar pergunta
                  </Button>
                </div>

                {perguntas.length > 0 && (
                  <div className="space-y-4">
                    {perguntas.map((pergunta, index) => (
                      <Card key={pergunta.tempId} className="rounded-xl border border-gray-200 bg-gray-50">
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <span className="text-xs font-semibold text-gray-500 mt-2">Pergunta {index + 1}</span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="rounded-xl text-red-600 hover:bg-red-50"
                              onClick={() => setPerguntas(perguntas.filter(p => p.tempId !== pergunta.tempId))}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="grid gap-3 md:grid-cols-2">
                            <div>
                              <Label className="text-xs font-medium text-gray-700">Tipo</Label>
                              <Select
                                value={pergunta.tipo}
                                onValueChange={(value: TipoPergunta) => atualizarPergunta(pergunta.tempId, { tipo: value })}
                              >
                                <SelectTrigger className="rounded-xl mt-1 bg-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="descritiva">Descritiva</SelectItem>
                                  <SelectItem value="multipla">Múltipla escolha</SelectItem>
                                  <SelectItem value="vf">Verdadeiro ou Falso</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-xs font-medium text-gray-700">Peso (pontos)</Label>
                              <Input
                                type="number"
                                min={1}
                                value={pergunta.peso}
                                onChange={(e) => atualizarPergunta(pergunta.tempId, { peso: e.target.value })}
                                className="rounded-xl mt-1 bg-white"
                              />
                            </div>
                          </div>

                          <div>
                            <Label className="text-xs font-medium text-gray-700">Enunciado</Label>
                            <Textarea
                              value={pergunta.enunciado}
                              onChange={(e) => atualizarPergunta(pergunta.tempId, { enunciado: e.target.value })}
                              className="rounded-xl mt-1 bg-white"
                              rows={2}
                              placeholder="Digite a pergunta..."
                            />
                          </div>

                          {pergunta.tipo === "multipla" && (
                            <div className="space-y-2">
                              <div className="grid gap-2 md:grid-cols-2">
                                <Input
                                  value={pergunta.alternativa_a}
                                  onChange={(e) => atualizarPergunta(pergunta.tempId, { alternativa_a: e.target.value })}
                                  placeholder="Alternativa A"
                                  className="rounded-xl bg-white"
                                />
                                <Input
                                  value={pergunta.alternativa_b}
                                  onChange={(e) => atualizarPergunta(pergunta.tempId, { alternativa_b: e.target.value })}
                                  placeholder="Alternativa B"
                                  className="rounded-xl bg-white"
                                />
                                <Input
                                  value={pergunta.alternativa_c}
                                  onChange={(e) => atualizarPergunta(pergunta.tempId, { alternativa_c: e.target.value })}
                                  placeholder="Alternativa C (opcional)"
                                  className="rounded-xl bg-white"
                                />
                                <Input
                                  value={pergunta.alternativa_d}
                                  onChange={(e) => atualizarPergunta(pergunta.tempId, { alternativa_d: e.target.value })}
                                  placeholder="Alternativa D (opcional)"
                                  className="rounded-xl bg-white"
                                />
                              </div>
                              <div>
                                <Label className="text-xs font-medium text-gray-700">Alternativa correta</Label>
                                <Select
                                  value={pergunta.letra_correta}
                                  onValueChange={(value) => atualizarPergunta(pergunta.tempId, { letra_correta: value })}
                                >
                                  <SelectTrigger className="rounded-xl mt-1 bg-white">
                                    <SelectValue placeholder="Selecione" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {pergunta.alternativa_a && <SelectItem value="A">A</SelectItem>}
                                    {pergunta.alternativa_b && <SelectItem value="B">B</SelectItem>}
                                    {pergunta.alternativa_c && <SelectItem value="C">C</SelectItem>}
                                    {pergunta.alternativa_d && <SelectItem value="D">D</SelectItem>}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          )}

                          {pergunta.tipo === "vf" && (
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                className={`rounded-xl flex-1 ${pergunta.correta === true ? "bg-green-600 hover:bg-green-700 text-white border-green-600" : ""}`}
                                onClick={() => atualizarPergunta(pergunta.tempId, { correta: true })}
                              >
                                Verdadeiro
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                className={`rounded-xl flex-1 ${pergunta.correta === false ? "bg-red-600 hover:bg-red-700 text-white border-red-600" : ""}`}
                                onClick={() => atualizarPergunta(pergunta.tempId, { correta: false })}
                              >
                                Falso
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button type="submit" disabled={publicando} className="rounded-xl bg-violet-600 hover:bg-violet-700">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  {publicando ? "Publicando..." : "Publicar Atividade"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Formulário de Editar Atividade */}
      {editingActivity && (
        <Card className="rounded-xl shadow-md border-2 border-blue-200">
          <CardContent className="p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Edit2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Editar Atividade</h2>
                <p className="text-sm text-gray-500">Atualize os dados abaixo</p>
              </div>
            </div>

            <form className="space-y-4" onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              await onEditActivity(editingActivity.id, {
                titulo: formData.get('titulo') as string,
                descricao: formData.get('descricao') as string,
                data_vencimento: formData.get('data_vencimento') as string,
                recompensa_moedas: Number(formData.get('recompensa_moedas')),
              });
              setEditingActivity(null);
            }}>
              <div>
                <Label className="text-sm font-medium text-gray-700">Título</Label>
                <Input
                  name="titulo"
                  defaultValue={editingActivity.title}
                  placeholder="Ex: Lista de Exercícios 1"
                  className="rounded-xl mt-1"
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Data de entrega</Label>
                  <Input
                    name="data_vencimento"
                    type="date"
                    defaultValue={editingActivity.dueDate}
                    className="rounded-xl mt-1"
                    required
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Moedas</Label>
                  <Input
                    name="recompensa_moedas"
                    type="number"
                    defaultValue={editingActivity.coins}
                    className="rounded-xl mt-1"
                    min={1}
                    required
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Descrição</Label>
                <Textarea
                  name="descricao"
                  defaultValue={editingActivity.description}
                  placeholder="Instruções, objetivos, critérios de avaliação..."
                  className="rounded-xl bg-white mt-1"
                  rows={4}
                  required
                />
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button type="submit" className="rounded-xl bg-blue-600 hover:bg-blue-700">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Salvar Alterações
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => setEditingActivity(null)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Filtros e Busca */}
      <Card className="rounded-xl shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Buscar por título ou descrição..."
                className="rounded-xl pl-10 h-12 text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-gray-700">Filtrar por:</span>
              <button
                onClick={() => setFilterStatus("todas")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filterStatus === "todas"
                    ? "bg-violet-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Todas ({stats.total})
              </button>
              <button
                onClick={() => setFilterStatus("pendente")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filterStatus === "pendente"
                    ? "bg-amber-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Clock className="h-3.5 w-3.5 inline mr-1.5" />
                Pendentes ({stats.pendente})
              </button>
              <button
                onClick={() => setFilterStatus("entregue")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filterStatus === "entregue"
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <AlertCircle className="h-3.5 w-3.5 inline mr-1.5" />
                Para Corrigir ({stats.entregue})
              </button>
              <button
                onClick={() => setFilterStatus("corrigida")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filterStatus === "corrigida"
                    ? "bg-green-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <CheckCircle2 className="h-3.5 w-3.5 inline mr-1.5" />
                Corrigidas ({stats.corrigida})
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Atividades */}
      <div className="space-y-4">
        {filteredActivities.length === 0 ? (
          <Card className="rounded-xl shadow-sm">
            <CardContent className="p-12 text-center">
              <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma atividade encontrada</h3>
              <p className="text-gray-600">
                {searchTerm || filterStatus !== "todas"
                  ? "Tente ajustar os filtros de busca"
                  : "Comece criando sua primeira atividade"
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredActivities.map((activity) => {
            const statusConfig = getStatusConfig(activity.status);
            const StatusIcon = statusConfig.icon;
            const submissionRate = activity.totalStudents
              ? ((activity.submissions / activity.totalStudents) * 100).toFixed(0)
              : "0";

            return (
              <Card key={activity.id} className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{activity.title}</h3>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusConfig.color}`}>
                          <StatusIcon className="h-3 w-3" />
                          {statusConfig.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl"
                        onClick={() => setEditingActivity(activity)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl text-red-600 hover:bg-red-50 hover:border-red-300"
                        onClick={() => setDeletingActivityId(activity.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Entrega:</span>
                      <span className="font-semibold text-gray-900">{activity.dueDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Coins className="h-4 w-4 text-amber-500" />
                      <span className="text-gray-600">Recompensa:</span>
                      <span className="font-semibold text-amber-600">{activity.coins} moedas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Entregas:</span>
                      <span className="font-semibold text-gray-900">
                        {activity.submissions}/{activity.totalStudents}
                      </span>
                      <span className="text-gray-500">({submissionRate}%)</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-600">Progresso de entregas</span>
                      <span className="text-xs font-semibold text-gray-900">{submissionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div
                        className="bg-violet-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${submissionRate}%` }}
                      />
                    </div>
                    {activity.submissions > 0 ? (
                      <Button
                        onClick={() => router.push(`/professor/atividades/${activity.id}/corrigir`)}
                        className="w-full rounded-xl bg-violet-600 hover:bg-violet-700"
                        size="sm"
                      >
                        <ClipboardCheck className="h-4 w-4 mr-2" />
                        Corrigir ({activity.submissions})
                      </Button>
                    ) : (
                      <Button
                        disabled
                        variant="outline"
                        className="w-full rounded-xl"
                        size="sm"
                      >
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Aguardando entregas
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog open={!!deletingActivityId} onOpenChange={(open) => !open && setDeletingActivityId(null)}>
        <DialogContent className="rounded-xl max-w-md bg-white">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <DialogTitle className="text-xl text-gray-900">Excluir Atividade?</DialogTitle>
            </div>
            <DialogDescription className="text-base text-gray-600 pt-2">
              Tem certeza que deseja excluir esta atividade? Esta ação não pode ser desfeita e todos os dados relacionados serão perdidos permanentemente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={() => setDeletingActivityId(null)}
              className="rounded-xl"
            >
              Cancelar
            </Button>
            <Button
              onClick={async () => {
                if (deletingActivityId) {
                  await onDeleteActivity(deletingActivityId);
                  setDeletingActivityId(null);
                }
              }}
              className="rounded-xl bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Sim, Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
