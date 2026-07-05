import { getProfessorLayout } from "@/components/professor/ProfessorLayout";
import type { NextPageWithLayout } from "@/pages/_app";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Eye,
  CheckCircle2,
  Clock,
  FileText,
  Calendar,
  Coins,
  Save,
  Award,
} from "lucide-react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

type RespostaQuestao = {
  id_questao: number;
  enunciado: string;
  tipo: "vf" | "multipla" | "descritiva";
  peso: number;
  resposta: string;
  correta: boolean | null;
  pontuacao: number | null;
};

type Entrega = {
  id: string;
  id_aluno: number;
  studentName: string;
  matricula: string;
  submittedAt: string | null;
  status: "entregue" | "corrigida";
  grade: number | null;
  feedback: string | null;
  respostaTexto: string | null;
  respostasQuestoes: RespostaQuestao[];
};

type Atividade = {
  title: string;
  description: string;
  dueDate: string;
  coins: number;
  discipline: string;
};

function CorrigirAtividadePage() {
  const router = useRouter();
  const { id } = router.query;

  const [activity, setActivity] = useState<Atividade | null>(null);
  const [entregas, setEntregas] = useState<Entrega[]>([]);
  const [editingGrades, setEditingGrades] = useState<{ [key: string]: { grade: string; feedback: string } }>({});
  const [expandedSubmission, setExpandedSubmission] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [pontuacoesDraft, setPontuacoesDraft] = useState<{ [key: string]: string }>({});
  const [savingPontuacao, setSavingPontuacao] = useState<string | null>(null);

  const carregarEntregas = async (atividadeId: string) => {
    const data = await api.get(`/professor/atividades/${atividadeId}/entregas`);
    setEntregas(
      (data ?? []).map((e: any) => ({
        id: String(e.id),
        id_aluno: Number(e.id_aluno),
        studentName: e.alunos.usuarios.nome,
        matricula: e.alunos.matricula,
        submittedAt: e.data_entrega,
        status: e.status,
        grade: e.nota !== null && e.nota !== undefined ? Number(e.nota) : null,
        feedback: e.feedback,
        respostaTexto: e.resposta_texto,
        respostasQuestoes: (e.respostas_questoes ?? []).map((r: any) => ({
          id_questao: Number(r.id_questao),
          enunciado: r.enunciado,
          tipo: r.tipo,
          peso: r.peso,
          resposta: r.resposta,
          correta: r.correta,
          pontuacao: r.pontuacao,
        })),
      }))
    );
  };

  useEffect(() => {
    if (!router.isReady || typeof id !== "string") return;

    async function carregar() {
      try {
        const [atividade] = await Promise.all([
          api.get(`/aluno/atividades/${id}`),
          carregarEntregas(id as string),
        ]);
        setActivity({
          title: atividade.titulo,
          description: atividade.descricao ?? "",
          dueDate: atividade.data_vencimento ? atividade.data_vencimento.split("T")[0] : "",
          coins: atividade.recompensa_moedas ?? 0,
          discipline: atividade.disciplinas?.nome ?? "",
        });
      } catch (err) {
        console.error("Erro ao carregar atividade:", err);
      }
    }

    carregar();
  }, [router.isReady, id]);

  const stats = {
    total: entregas.length,
    aguardando: entregas.filter(e => e.status === "entregue").length,
    corrigidas: entregas.filter(e => e.status === "corrigida").length,
    media: (() => {
      const notas = entregas.filter(e => e.grade !== null).map(e => e.grade as number);
      return notas.length > 0 ? notas.reduce((s, n) => s + n, 0) / notas.length : null;
    })(),
  };

  const getStatusConfig = (status: string) => {
    if (status === "corrigida") {
      return { color: "text-green-700 bg-green-100 border-green-200", icon: CheckCircle2, label: "Corrigida" };
    }
    return { color: "text-amber-700 bg-amber-100 border-amber-200", icon: Clock, label: "Aguardando correção" };
  };

  const handleSaveGrade = async (entrega: Entrega) => {
    const editData = editingGrades[entrega.id];
    if (!editData || typeof id !== "string") return;

    const nota = parseFloat(editData.grade);
    if (Number.isNaN(nota) || nota < 0 || nota > 10) {
      alert("Informe uma nota entre 0 e 10.");
      return;
    }

    setSaving(entrega.id);
    try {
      await api.post(`/professor/atividades/${id}/corrigir`, {
        id_aluno: String(entrega.id_aluno),
        nota,
        feedback: editData.feedback || undefined,
      });

      await carregarEntregas(id);
      const newEditingGrades = { ...editingGrades };
      delete newEditingGrades[entrega.id];
      setEditingGrades(newEditingGrades);
      setExpandedSubmission(null);
    } catch (err) {
      console.error("Erro ao salvar avaliação:", err);
      alert("Erro ao salvar avaliação.");
    } finally {
      setSaving(null);
    }
  };

  const handleSalvarPontuacao = async (entrega: Entrega, resposta: RespostaQuestao) => {
    const chave = `${entrega.id_aluno}-${resposta.id_questao}`;
    const valorDigitado = pontuacoesDraft[chave];
    if (valorDigitado === undefined || typeof id !== "string") return;

    const pontuacao = parseFloat(valorDigitado);
    if (Number.isNaN(pontuacao) || pontuacao < 0 || pontuacao > resposta.peso) {
      alert(`Informe uma pontuação entre 0 e ${resposta.peso}.`);
      return;
    }

    setSavingPontuacao(chave);
    try {
      await api.patch(
        `/professor/atividades/${id}/entregas/${entrega.id_aluno}/questoes/${resposta.id_questao}`,
        { pontuacao }
      );
      await carregarEntregas(id);

      // a nota sugerida mudou - descarta o rascunho de nota final (se houver)
      // pra não salvar um valor que não bate mais com o que aparece na tela
      const novosEditingGrades = { ...editingGrades };
      delete novosEditingGrades[entrega.id];
      setEditingGrades(novosEditingGrades);

      const novoDraft = { ...pontuacoesDraft };
      delete novoDraft[chave];
      setPontuacoesDraft(novoDraft);
    } catch (err) {
      console.error("Erro ao salvar pontuação:", err);
      alert("Erro ao salvar pontuação.");
    } finally {
      setSavingPontuacao(null);
    }
  };

  if (!activity) {
    return (
      <>
        <div className="p-6 text-gray-500">Carregando atividade...</div>
      </>
    );
  }

  return (
    <>
      <div className="space-y-6 pb-8">
        {/* Header */}
        <div>
          <Button
            variant="outline"
            onClick={() => router.push("/professor/atividades")}
            className="rounded-xl mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Atividades
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{activity.title}</h1>
              <p className="text-gray-600 mt-1">{activity.description}</p>
              <div className="flex items-center gap-4 mt-3 text-sm">
                <span className="flex items-center gap-1.5 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  Entrega: {activity.dueDate}
                </span>
                <span className="flex items-center gap-1.5 text-amber-600 font-semibold">
                  <Coins className="h-4 w-4" />
                  {activity.coins} moedas
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="rounded-xl shadow-sm border-l-4 border-l-violet-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Entregas</p>
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
                  <p className="text-sm font-medium text-gray-600">Aguardando</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.aguardando}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl shadow-sm border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Corrigidas</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.corrigidas}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl shadow-sm border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Média</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stats.media !== null ? stats.media.toFixed(1) : "-"}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Award className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Entregas */}
        <div className="space-y-4">
          {entregas.length === 0 ? (
            <Card className="rounded-xl shadow-sm">
              <CardContent className="p-12 text-center text-gray-500">
                Nenhuma entrega recebida ainda para esta atividade.
              </CardContent>
            </Card>
          ) : (
            entregas.map((entrega) => {
              const statusConfig = getStatusConfig(entrega.status);
              const StatusIcon = statusConfig.icon;
              const isExpanded = expandedSubmission === entrega.id;
              const isEditing = !!editingGrades[entrega.id];

              return (
                <div key={entrega.id} id={`submission-${entrega.id}`} className="scroll-mt-20">
                  <Card className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-full bg-violet-100 flex items-center justify-center">
                            <span className="text-lg font-bold text-violet-700">
                              {entrega.studentName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                              {entrega.studentName}
                              <Badge className={`${statusConfig.color} border font-semibold`}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {statusConfig.label}
                              </Badge>
                            </h3>
                            <p className="text-sm text-gray-600 flex items-center gap-1.5 mt-1">
                              <Clock className="h-3.5 w-3.5" />
                              {entrega.submittedAt
                                ? `Entregue em: ${new Date(entrega.submittedAt).toLocaleString('pt-BR')}`
                                : "Data de entrega não registrada"}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setExpandedSubmission(isExpanded ? null : entrega.id)}
                          className="rounded-xl"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          {isExpanded ? "Recolher" : "Detalhes"}
                        </Button>
                      </div>

                      {entrega.respostaTexto && (
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg border text-sm text-gray-700 whitespace-pre-wrap">
                          {entrega.respostaTexto}
                        </div>
                      )}

                      {entrega.respostasQuestoes.length > 0 && (
                        <div className="mb-4 space-y-3">
                          {entrega.respostasQuestoes.map((r) => {
                            const chave = `${entrega.id_aluno}-${r.id_questao}`;
                            return (
                              <div key={r.id_questao} className="p-3 bg-gray-50 rounded-lg border">
                                <div className="flex items-start justify-between gap-2 mb-1.5">
                                  <p className="text-sm font-medium text-gray-900">{r.enunciado}</p>
                                  <div className="flex items-center gap-2 shrink-0">
                                    <span className="text-xs text-gray-500">Peso: {r.peso}</span>
                                    {r.correta !== null && (
                                      <Badge
                                        className={`${
                                          r.correta
                                            ? "bg-green-100 text-green-700 border-green-200"
                                            : "bg-red-100 text-red-700 border-red-200"
                                        } border`}
                                      >
                                        {r.correta ? "Correta" : "Incorreta"}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                  {r.tipo === "vf"
                                    ? (r.resposta === "true" ? "Verdadeiro" : "Falso")
                                    : r.resposta}
                                </p>

                                {r.tipo === "descritiva" && (
                                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
                                    <Label className="text-xs font-medium text-gray-700 shrink-0">
                                      Pontuação (0 a {r.peso}):
                                    </Label>
                                    <Input
                                      type="number"
                                      min={0}
                                      max={r.peso}
                                      step="0.5"
                                      defaultValue={r.pontuacao ?? undefined}
                                      onChange={(e) =>
                                        setPontuacoesDraft({ ...pontuacoesDraft, [chave]: e.target.value })
                                      }
                                      className="rounded-lg w-24 h-8"
                                    />
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      disabled={pontuacoesDraft[chave] === undefined || savingPontuacao === chave}
                                      onClick={() => handleSalvarPontuacao(entrega, r)}
                                      className="rounded-lg"
                                    >
                                      {savingPontuacao === chave ? "Salvando..." : "Salvar"}
                                    </Button>
                                    {r.pontuacao !== null && (
                                      <span className="text-xs text-gray-500">
                                        Avaliada: {r.pontuacao}/{r.peso}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {entrega.grade !== null && !isEditing && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Nota:</span>
                            <span className={`text-2xl font-bold ${entrega.grade >= 6 ? "text-green-600" : "text-red-600"}`}>
                              {entrega.grade.toFixed(1)}
                            </span>
                          </div>
                          {entrega.feedback && (
                            <p className="text-sm text-gray-600 mt-2">{entrega.feedback}</p>
                          )}
                        </div>
                      )}

                      {isExpanded && (
                        <div className="border-t pt-4 mt-4">
                          <h4 className="text-sm font-semibold text-gray-900 mb-4">Avaliar Entrega</h4>
                          <div className="space-y-4">
                            <div>
                              <Label className="text-sm font-medium text-gray-700">
                                Nota (0 a 10) {entrega.respostasQuestoes.length > 0 && "— sugerida com base no peso das questões já avaliadas"}
                              </Label>
                              <Input
                                key={`nota-${entrega.id}-${entrega.grade ?? "vazia"}`}
                                type="number"
                                min="0"
                                max="10"
                                step="0.5"
                                defaultValue={entrega.grade ?? undefined}
                                onChange={(e) => setEditingGrades({
                                  ...editingGrades,
                                  [entrega.id]: {
                                    grade: e.target.value,
                                    feedback: editingGrades[entrega.id]?.feedback ?? entrega.feedback ?? "",
                                  },
                                })}
                                className="rounded-xl mt-1"
                                placeholder="Ex: 8.5"
                              />
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-700">Feedback</Label>
                              <Textarea
                                defaultValue={entrega.feedback ?? ""}
                                onChange={(e) => setEditingGrades({
                                  ...editingGrades,
                                  [entrega.id]: {
                                    grade: editingGrades[entrega.id]?.grade ?? entrega.grade?.toString() ?? "",
                                    feedback: e.target.value,
                                  },
                                })}
                                className="rounded-xl mt-1"
                                rows={3}
                                placeholder="Comentários sobre o desempenho do aluno..."
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleSaveGrade(entrega)}
                                disabled={!editingGrades[entrega.id] || saving === entrega.id}
                                className="rounded-xl bg-green-600 hover:bg-green-700"
                              >
                                <Save className="h-4 w-4 mr-2" />
                                {saving === entrega.id ? "Salvando..." : "Salvar Avaliação"}
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => setExpandedSubmission(null)}
                                className="rounded-xl"
                              >
                                Cancelar
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}

(CorrigirAtividadePage as NextPageWithLayout).getLayout = getProfessorLayout;

export default CorrigirAtividadePage;
