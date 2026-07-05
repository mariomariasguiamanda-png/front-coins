"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { api } from "@/lib/api";
import { getAlunoLayout } from "@/components/aluno/AlunoLayout";
import { Skeleton } from "@/components/ui/Skeleton";
import type { NextPageWithLayout } from "@/pages/_app";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
} from "lucide-react";
import Modal from "@/components/ui/Modal";

// Questões da atividade (VF + múltipla escolha + descritiva) - sem gabarito
// (a API não entrega correta/letra_correta pro papel aluno)
type Questao = {
  id_questao: number;
  tipo: "vf" | "multipla" | "descritiva";
  enunciado: string;
  correta?: boolean | null;
  alternativa_a: string | null;
  alternativa_b: string | null;
  alternativa_c: string | null;
  alternativa_d: string | null;
  letra_correta?: "A" | "B" | "C" | "D" | null;
  resposta_aluno: string | null;
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

// resposta em branco ("" ou null) não conta como respondida, mesmo pra descritiva
const foiRespondida = (valor: string | null | undefined) =>
  valor != null && valor.trim() !== "";

function AtividadeSkeleton() {
  return (
    <div className="px-8 py-6 flex justify-center">
      <div className="w-full max-w-3xl space-y-6">
        <Skeleton className="h-8 w-20 rounded-full" />
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2">
              <Skeleton className="h-7 w-64" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
          <div className="space-y-3 pt-4 border-t border-gray-100">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4 space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const AtividadeDetalhePage: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [atividade, setAtividade] = useState<Atividade | null>(null);
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [respostas, setRespostas] = useState<Record<number, string | null>>({});
  const [enviando, setEnviando] = useState(false);
  const [showReenvioModal, setShowReenvioModal] = useState(false);
  const [showConfirmarModal, setShowConfirmarModal] = useState(false);
  const [questaoDestacada, setQuestaoDestacada] = useState<number | null>(null);

  const questaoRefs = useRef<Record<number, HTMLDivElement | null>>({});

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

      // Pré-preenche com o que o aluno já respondeu antes (entregue/corrigida) -
      // sem isso, reabrir uma atividade já enviada mostrava as opções em branco.
      const respostasIniciais: Record<number, string | null> = {};
      qs.forEach((q) => {
        respostasIniciais[q.id_questao] = q.resposta_aluno ?? null;
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

  const isConcluida = atividade?.status === "entregue" || atividade?.status === "corrigida";
  const totalRespondidas = questoes.filter((q) => foiRespondida(respostas[q.id_questao])).length;
  const todasRespondidas = questoes.length > 0 && totalRespondidas === questoes.length;

  // marcar resposta (string: "true"/"false" ou "A"/"B"/"C"/"D")
  const handleRespostaChange = (idQuestao: number, valor: string) => {
    if (isConcluida) return;
    setRespostas((prev) => ({
      ...prev,
      [idQuestao]: valor,
    }));
  };

  const scrollParaPrimeiraPendente = () => {
    const pendente = questoes.find((q) => !foiRespondida(respostas[q.id_questao]));
    if (!pendente) return;

    questaoRefs.current[pendente.id_questao]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    setQuestaoDestacada(pendente.id_questao);
    setTimeout(() => setQuestaoDestacada(null), 1600);
  };

  // ========= clique em "Enviar prova": valida e abre confirmação =========
  const handleClickEnviar = () => {
    setError(null);

    if (!atividade) return;

    if (isConcluida) {
      setShowReenvioModal(true);
      return;
    }

    if (questoes.length === 0) {
      setError("Esta atividade ainda não possui questões cadastradas.");
      return;
    }

    if (!todasRespondidas) {
      scrollParaPrimeiraPendente();
      return;
    }

    setShowConfirmarModal(true);
  };

  // ========= ação: entrega de verdade (depois da confirmação) =========
  // A nota agora é calculada e validada no servidor (decisão de segurança já
  // tomada na Fase 1 - o aluno não tem acesso ao gabarito pra calcular sozinho).
  const handleConfirmarEnvio = async () => {
    if (!atividade) return;

    try {
      setEnviando(true);
      setShowConfirmarModal(false);

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
      setEnviando(false);
    }
  };

  // ========= render =========
  if (loading) {
    return <AtividadeSkeleton />;
  }

  if (error && !atividade) {
    return (
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
    );
  }

  if (!atividade) {
    return (
      <div className="px-8 py-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full px-3 py-1 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>
        <p className="mt-4 text-sm text-gray-600">Atividade não encontrada.</p>
      </div>
    );
  }

  return (
    <>
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
                <h1 className="text-2xl font-semibold text-gray-900">
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

            <div className="text-sm text-gray-700 whitespace-pre-line">
              {atividade.descricao || "Nenhuma descrição informada."}
            </div>

            {questoes.length > 0 && (
              <>
                {/* Barra de progresso de respostas */}
                {!isConcluida && (
                  <div className="pt-2">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                      <span>
                        {totalRespondidas} de {questoes.length} questões respondidas
                      </span>
                      <span className="font-medium text-purple-700">
                        {Math.round((totalRespondidas / questoes.length) * 100)}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-600 rounded-full transition-all duration-300"
                        style={{
                          width: `${(totalRespondidas / questoes.length) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="mt-2 border-t border-gray-100 pt-4 space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Questões da prova
                  </h2>

                  <div className="space-y-4">
                    {questoes.map((q, index) => {
                      const respostaAtual = respostas[q.id_questao];
                      const respondida = foiRespondida(respostaAtual);
                      const destacada = questaoDestacada === q.id_questao;

                      return (
                        <div
                          key={q.id_questao}
                          ref={(el) => {
                            questaoRefs.current[q.id_questao] = el;
                          }}
                          className={`bg-gray-50 border rounded-xl p-4 space-y-3 transition-all ${
                            destacada
                              ? "border-amber-400 ring-2 ring-amber-200"
                              : "border-gray-100"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span
                              className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                                respondida
                                  ? "bg-purple-600 text-white"
                                  : "bg-gray-200 text-gray-500"
                              }`}
                            >
                              {respondida ? (
                                <CheckCircle2 className="h-4 w-4" />
                              ) : (
                                index + 1
                              )}
                            </span>
                            <p className="text-sm font-medium text-gray-900 pt-0.5">
                              {q.enunciado}
                            </p>
                          </div>

                          {q.tipo === "vf" ? (
                            // ===== Questão Verdadeiro / Falso =====
                            <div className="grid grid-cols-2 gap-3 pl-9">
                              {(["true", "false"] as const).map((valor) => {
                                const selecionado = respostaAtual === valor;
                                return (
                                  <button
                                    key={valor}
                                    type="button"
                                    disabled={isConcluida}
                                    onClick={() =>
                                      handleRespostaChange(q.id_questao, valor)
                                    }
                                    className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed ${
                                      selecionado
                                        ? "border-purple-600 bg-purple-50 text-purple-700"
                                        : "border-gray-200 bg-white text-gray-700 hover:border-purple-300 hover:bg-purple-50/40"
                                    }`}
                                  >
                                    {valor === "true" ? "Verdadeiro" : "Falso"}
                                  </button>
                                );
                              })}
                            </div>
                          ) : q.tipo === "multipla" ? (
                            // ===== Questão Múltipla Escolha =====
                            <div className="flex flex-col gap-2 pl-9">
                              {(
                                [
                                  ["A", q.alternativa_a],
                                  ["B", q.alternativa_b],
                                  ["C", q.alternativa_c],
                                  ["D", q.alternativa_d],
                                ] as const
                              ).map(([letra, texto]) =>
                                texto ? (
                                  <button
                                    key={letra}
                                    type="button"
                                    disabled={isConcluida}
                                    onClick={() =>
                                      handleRespostaChange(q.id_questao, letra)
                                    }
                                    className={`flex items-center gap-3 rounded-lg border px-4 py-2.5 text-left text-sm transition-colors disabled:cursor-not-allowed ${
                                      respostaAtual === letra
                                        ? "border-purple-600 bg-purple-50 text-purple-700"
                                        : "border-gray-200 bg-white text-gray-700 hover:border-purple-300 hover:bg-purple-50/40"
                                    }`}
                                  >
                                    <span
                                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
                                        respostaAtual === letra
                                          ? "bg-purple-600 text-white"
                                          : "bg-gray-100 text-gray-500"
                                      }`}
                                    >
                                      {letra}
                                    </span>
                                    {texto}
                                  </button>
                                ) : null
                              )}
                            </div>
                          ) : (
                            // ===== Questão Descritiva (resposta em texto livre) =====
                            <div className="pl-9">
                              <textarea
                                disabled={isConcluida}
                                value={respostaAtual ?? ""}
                                onChange={(e) =>
                                  handleRespostaChange(q.id_questao, e.target.value)
                                }
                                rows={4}
                                placeholder="Digite sua resposta..."
                                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 transition-colors focus:border-purple-400 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Nota (só depois de corrigida/entregue) */}
          {isConcluida && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
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
              <span className="text-sm text-gray-700">
                Nota: <span className="font-semibold">{atividade.nota ?? "—"}</span>
              </span>
            </div>
          )}

          {error && (
            <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Barra de envio - sticky dentro do container de scroll (não usa
          position:fixed pra não precisar saber a largura do sidebar, que
          pode ser recolhido) */}
      {questoes.length > 0 && (
        <div className="sticky bottom-0 -mx-10 -mb-6 bg-white border-t border-gray-200 px-8 py-4 flex justify-center">
          <div className="w-full max-w-3xl flex items-center justify-between gap-4">
            <p className="text-sm text-gray-600 hidden sm:block">
              {isConcluida
                ? "Você já enviou esta atividade."
                : todasRespondidas
                  ? "Tudo pronto! Revise e envie quando quiser."
                  : `Faltam ${questoes.length - totalRespondidas} questão(ões) para responder.`}
            </p>
            <button
              type="button"
              onClick={handleClickEnviar}
              disabled={enviando}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-purple-600 text-white text-sm font-medium px-5 py-2.5 hover:bg-purple-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {enviando ? (
                <>
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Enviando prova...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  {isConcluida ? "Ver envio" : "Enviar prova"}
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {showConfirmarModal && (
        <Modal onClose={() => setShowConfirmarModal(false)}>
          <div className="w-full max-w-md">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Send className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Enviar prova?
                </h2>
                <p className="text-xs text-gray-500">
                  Você respondeu todas as {questoes.length} questões. Depois de
                  enviada, não é possível refazer.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowConfirmarModal(false)}
                className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Revisar respostas
              </button>
              <button
                type="button"
                onClick={handleConfirmarEnvio}
                className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-purple-600 text-white hover:bg-purple-700 transition-colors"
              >
                Confirmar envio
              </button>
            </div>
          </div>
        </Modal>
      )}

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
    </>
  );
};

AtividadeDetalhePage.getLayout = getAlunoLayout;

export default AtividadeDetalhePage;
