"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { api } from "@/lib/api";
import AlunoLayout from "@/components/layout/AlunoLayout";
import { ArrowLeft, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import Modal from "@/components/ui/Modal";

// Questões da atividade (VF + múltipla escolha) - sem gabarito (a API não entrega
// correta/letra_correta pro papel aluno)
type Questao = {
  id_questao: number;
  enunciado: string;
  correta?: boolean | null;
  alternativa_a: string | null;
  alternativa_b: string | null;
  alternativa_c: string | null;
  alternativa_d: string | null;
  letra_correta?: "A" | "B" | "C" | "D" | null;
};

type Atividade = {
  id_atividade: number;
  titulo: string;
  descricao: string | null;
  id_disciplina: number;
  questoes_atividade: Questao[];
  status: "pendente" | "entregue" | "corrigida";
  nota: number | null;
  feedback: string | null;
  data_entrega: string | null;
};

// helper: identifica se a questão é Verdadeiro/Falso (sem alternativas)
const isVFQuestao = (q: Questao) =>
  !q.alternativa_a && !q.alternativa_b && !q.alternativa_c && !q.alternativa_d;

const AtividadeDetalhePage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [atividade, setAtividade] = useState<Atividade | null>(null);
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [respostas, setRespostas] = useState<Record<number, string | null>>({});
  const [corrigindo, setCorrigindo] = useState(false);
  const [showReenvioModal, setShowReenvioModal] = useState(false);

  // ========= carregar atividade (já vem com questões + status/nota/feedback do aluno) =========
  const loadData = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const idAtividade = Number(id);
      if (Number.isNaN(idAtividade)) {
        throw new Error("ID de atividade inválido.");
      }

      const data: Atividade = await api.get(`/aluno/atividades/${idAtividade}`);
      setAtividade(data);

      const qs = data.questoes_atividade ?? [];
      setQuestoes(qs);

      // inicia o state de respostas com null (não respondida)
      const respostasIniciais: Record<number, string | null> = {};
      qs.forEach((q) => {
        respostasIniciais[q.id_questao] = null;
      });
      setRespostas(respostasIniciais);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro ao carregar a atividade.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // marcar resposta (string: "true"/"false" ou "A"/"B"/"C"/"D")
  const handleRespostaChange = (idQuestao: number, valor: string) => {
    setRespostas((prev) => ({
      ...prev,
      [idQuestao]: valor,
    }));
  };

  // ========= ação: marcar como concluída (entrega) =========
  // A nota agora é calculada e validada no servidor (decisão de segurança já
  // tomada na Fase 1 - o aluno não tem acesso ao gabarito pra calcular sozinho).
  const handleMarcarConcluida = async () => {
    try {
      setError(null);

      if (!atividade) return;
      if (atividade.status === "entregue" || atividade.status === "corrigida") {
        setShowReenvioModal(true);
        return;
      }

      if (questoes.length === 0) {
        throw new Error(
          "Esta atividade ainda não possui questões cadastradas."
        );
      }

      // Verifica se todas foram respondidas
      const naoRespondidas = questoes.filter(
        (q) =>
          respostas[q.id_questao] === null ||
          respostas[q.id_questao] === undefined
      );

      if (naoRespondidas.length > 0) {
        throw new Error("Responda todas as questões antes de enviar a prova.");
      }

      setCorrigindo(true);

      const respostasParaEnviar = questoes.map((q) => ({
        id_questao: String(q.id_questao),
        resposta: respostas[q.id_questao] as string,
      }));

      await api.post(`/aluno/atividades/${atividade.id_atividade}/entregar`, {
        respostas: respostasParaEnviar,
      });

      // Recarrega dados (pra atualizar status/nota sugerida na tela)
      await loadData();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro ao enviar a prova.");
    } finally {
      setCorrigindo(false);
    }
  };

  // ========= render =========
  if (loading) {
    return (
      <AlunoLayout>
        <div className="px-8 py-6 text-sm text-gray-600">
          Carregando atividade...
        </div>
      </AlunoLayout>
    );
  }

  if (error) {
    return (
      <AlunoLayout>
        <div className="px-8 py-6 space-y-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full px-3 py-1 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>
          <p className="text-sm text-red-500">Erro: {error}</p>
        </div>
      </AlunoLayout>
    );
  }

  if (!atividade) {
    return (
      <AlunoLayout>
        <div className="px-8 py-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full px-3 py-1 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>
          <p className="mt-4 text-sm text-gray-600">
            Atividade não encontrada.
          </p>
        </div>
      </AlunoLayout>
    );
  }

  const isConcluida = atividade.status === "entregue" || atividade.status === "corrigida";

  return (
    <AlunoLayout>
      <div className="px-8 py-6 flex justify-center">
        <div className="w-full max-w-3xl space-y-6">
          {/* Voltar */}
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full px-3 py-1 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>

          {/* Cabeçalho */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                  {atividade.titulo}
                </h1>
                <p className="text-xs text-gray-500 mt-1">
                  ID da atividade:{" "}
                  <span className="font-mono text-gray-700">
                    {atividade.id_atividade}
                  </span>
                </p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                    isConcluida
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {isConcluida ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Clock className="h-4 w-4" />
                  )}
                  {isConcluida ? "Concluída" : "Pendente"}
                </span>
                {atividade.data_entrega && (
                  <span className="text-[11px] text-gray-500">
                    Concluída em{" "}
                    {new Date(atividade.data_entrega).toLocaleString("pt-BR")}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-2 text-sm text-gray-700 whitespace-pre-line">
              {atividade.descricao || "Nenhuma descrição informada."}
            </div>

            {questoes.length > 0 && (
              <div className="mt-6 border-t border-gray-100 pt-4 space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Questões da prova
                </h2>

                <div className="space-y-4">
                  {questoes.map((q, index) => {
                    const respostaAtual = respostas[q.id_questao];
                    const ehVF = isVFQuestao(q);

                    return (
                      <div
                        key={q.id_questao}
                        className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-3"
                      >
                        <p className="text-sm font-medium text-gray-900">
                          {index + 1}. {q.enunciado}
                        </p>

                        {ehVF ? (
                          // ===== Questão Verdadeiro / Falso =====
                          <div className="flex flex-wrap gap-4 text-sm">
                            <label className="inline-flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name={`q-${q.id_questao}`}
                                className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                                checked={respostaAtual === "true"}
                                onChange={() =>
                                  handleRespostaChange(q.id_questao, "true")
                                }
                              />
                              <span>Verdadeiro</span>
                            </label>

                            <label className="inline-flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name={`q-${q.id_questao}`}
                                className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                                checked={respostaAtual === "false"}
                                onChange={() =>
                                  handleRespostaChange(q.id_questao, "false")
                                }
                              />
                              <span>Falso</span>
                            </label>
                          </div>
                        ) : (
                          // ===== Questão Múltipla Escolha =====
                          <div className="flex flex-col gap-2 text-sm">
                            {q.alternativa_a && (
                              <label className="inline-flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  name={`q-${q.id_questao}`}
                                  className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                                  checked={respostaAtual === "A"}
                                  onChange={() =>
                                    handleRespostaChange(q.id_questao, "A")
                                  }
                                />
                                <span>A) {q.alternativa_a}</span>
                              </label>
                            )}
                            {q.alternativa_b && (
                              <label className="inline-flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  name={`q-${q.id_questao}`}
                                  className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                                  checked={respostaAtual === "B"}
                                  onChange={() =>
                                    handleRespostaChange(q.id_questao, "B")
                                  }
                                />
                                <span>B) {q.alternativa_b}</span>
                              </label>
                            )}
                            {q.alternativa_c && (
                              <label className="inline-flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  name={`q-${q.id_questao}`}
                                  className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                                  checked={respostaAtual === "C"}
                                  onChange={() =>
                                    handleRespostaChange(q.id_questao, "C")
                                  }
                                />
                                <span>C) {q.alternativa_c}</span>
                              </label>
                            )}
                            {q.alternativa_d && (
                              <label className="inline-flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  name={`q-${q.id_questao}`}
                                  className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                                  checked={respostaAtual === "D"}
                                  onChange={() =>
                                    handleRespostaChange(q.id_questao, "D")
                                  }
                                />
                                <span>D) {q.alternativa_d}</span>
                              </label>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Nota + Botão de conclusão */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-900">
                  Nota da atividade
                </p>
                <p className="text-xs text-gray-500">
                  {atividade.status === "corrigida"
                    ? "Nota final registrada pelo professor."
                    : "Nota sugerida com base nas respostas - o professor pode ajustar ao corrigir."}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">
                  Nota:{" "}
                  <span className="font-semibold">
                    {atividade.nota ?? "—"}
                  </span>
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleMarcarConcluida}
              disabled={corrigindo || questoes.length === 0}
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-purple-600 text-white text-sm font-medium px-4 py-2.5 hover:bg-purple-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {corrigindo ? (
                <>
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Enviando prova...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  {isConcluida ? "Reenviar prova" : "Enviar prova"}
                </>
              )}
            </button>
          </div>
        </div>
        {showReenvioModal && (
          <Modal onClose={() => setShowReenvioModal(false)}>
            <div className="w-full max-w-md">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Prova já enviada
                  </h2>
                  <p className="text-xs text-gray-500">
                    Você já realizou e enviou esta avaliação. Por segurança, não
                    é possível refazer.
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-amber-50 border border-amber-100 p-3 text-xs text-amber-800 mb-4">
                <p>
                  Caso você acredite que houve algum problema (erro na conexão
                  ou atividade incorreta), entre em contato com o professor
                  responsável.
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowReenvioModal(false)}
                  className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                >
                  Entendi
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </AlunoLayout>
  );
};

export default AtividadeDetalhePage;
