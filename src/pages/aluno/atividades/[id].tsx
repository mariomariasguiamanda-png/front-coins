"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";
import AlunoLayout from "@/components/layout/AlunoLayout";
import { ArrowLeft, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import Modal from "@/components/ui/Modal";

type Atividade = {
  id_atividade: number;
  titulo: string;
  descricao: string | null;
  id_disciplina: number;
};

type ProgressoAtividade = {
  id_progresso_atividade?: number;
  id_atividade: number;
  id_aluno: number;
  status: "pendente" | "concluida";
  nota: number | null;
  concluido_em: string | null;
};

// Questões da atividade (VF + múltipla escolha)
type Questao = {
  id_questao: number;
  enunciado: string;
  correta: boolean | null; // usado nas questões V/F
  alternativa_a: string | null;
  alternativa_b: string | null;
  alternativa_c: string | null;
  alternativa_d: string | null;
  letra_correta: "A" | "B" | "C" | "D" | null; // usado nas de múltipla escolha
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
  const [alunoId, setAlunoId] = useState<number | null>(null);

  const [progresso, setProgresso] = useState<ProgressoAtividade | null>(null);
  const [notaInput, setNotaInput] = useState<string>("");
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [respostas, setRespostas] = useState<Record<number, string | null>>({});
  const [corrigindo, setCorrigindo] = useState(false);
  const [showReenvioModal, setShowReenvioModal] = useState(false);

  // ========= helper: descobrir id_aluno =========
  const fetchAlunoId = async (): Promise<number | null> => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("Erro ao obter usuário autenticado:", userError);
        return null;
      }

      if (!user || !user.id) {
        console.warn("Nenhum usuário autenticado ou id ausente.");
        return null;
      }

      // 1) usuarios
      const { data: usuario, error: usuarioError } = await supabase
        .from("usuarios")
        .select("id_usuario")
        .eq("auth_user_id", user.id)
        .maybeSingle();

      if (usuarioError) {
        console.error("Erro ao buscar usuario em `usuarios`:", usuarioError);
        return null;
      }

      if (!usuario) {
        console.warn(
          "Nenhum registro encontrado em `usuarios` para esse email."
        );
        return null;
      }

      // 2) alunos
      const { data: aluno, error: alunoError } = await supabase
        .from("alunos")
        .select("id_aluno")
        .eq("id_usuario", usuario.id_usuario)
        .maybeSingle();

      if (alunoError) {
        console.error("Erro ao buscar aluno em `alunos`:", alunoError);
        return null;
      }

      if (!aluno) {
        console.warn("Nenhum aluno associado a esse usuário.");
        return null;
      }

      return aluno.id_aluno as number;
    } catch (err) {
      console.error("Erro inesperado ao obter id_aluno:", err);
      return null;
    }
  };

  // ========= carregar atividade + progresso =========
  const loadData = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const idAtividade = Number(id);
      if (Number.isNaN(idAtividade)) {
        throw new Error("ID de atividade inválido.");
      }

      // 1) garantir alunoId em memória
      let alunoIdLocal = alunoId;
      if (!alunoIdLocal) {
        alunoIdLocal = await fetchAlunoId();
        if (!alunoIdLocal) {
          throw new Error("Não foi possível identificar o aluno logado.");
        }
        setAlunoId(alunoIdLocal);
      }

      // 2) buscar atividade
      const { data: atividadeData, error: atividadeError } = await supabase
        .from("atividades")
        .select("*")
        .eq("id_atividade", idAtividade)
        .maybeSingle();

      if (atividadeError) throw new Error(atividadeError.message);
      if (!atividadeData) throw new Error("Atividade não encontrada.");

      setAtividade(atividadeData as Atividade);

      // 3) buscar progresso dessa atividade para esse aluno
      const { data: progData, error: progError } = await supabase
        .from("progresso_atividades")
        .select("*")
        .eq("id_atividade", idAtividade)
        .eq("id_aluno", alunoIdLocal)
        .maybeSingle();

      if (progError) {
        console.error("Erro ao buscar progresso_atividades:", progError);
      }

      if (progData) {
        setProgresso(progData as ProgressoAtividade);
        setNotaInput(
          progData.nota !== null && progData.nota !== undefined
            ? String(progData.nota)
            : ""
        );
      } else {
        setProgresso(null);
        setNotaInput("");
      }

      // 4) buscar questões dessa atividade
      const { data: questoesData, error: questoesError } = await supabase
        .from("questoes_atividade")
        .select(
          "id_questao, enunciado, correta, alternativa_a, alternativa_b, alternativa_c, alternativa_d, letra_correta"
        )
        .eq("id_atividade", idAtividade)
        .order("id_questao", { ascending: true });

      if (questoesError) throw new Error(questoesError.message);

      const qs = (questoesData || []) as Questao[];
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

  // ========= ação: marcar como concluída =========
  const handleMarcarConcluida = async () => {
    try {
      setError(null);

      if (!atividade) return;
      if (!alunoId) {
        throw new Error("Aluno não identificado.");
      }
      if (progresso?.status === "concluida") {
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

      // Calcula acertos (VF + múltipla escolha)
      let acertos = 0;

      questoes.forEach((q) => {
        const resp = respostas[q.id_questao];
        if (!resp) return;

        let acertou = false;

        if (isVFQuestao(q)) {
          // questão Verdadeiro/Falso: compara "true"/"false" com o gabarito boolean
          if (q.correta !== null && q.correta !== undefined) {
            const gabarito = q.correta ? "true" : "false";
            acertou = resp === gabarito;
          }
        } else if (q.letra_correta) {
          // múltipla escolha: compara letra marcada com letra_correta
          acertou = resp === q.letra_correta;
        }

        if (acertou) acertos++;
      });

      const total = questoes.length;
      const notaCalculada =
        total > 0 ? Number(((acertos / total) * 10).toFixed(2)) : 0;

      // Monta array de respostas para salvar no banco
      const respostasParaSalvar = questoes.map((q) => {
        const resp = respostas[q.id_questao];

        let correta = false;

        if (resp) {
          if (isVFQuestao(q)) {
            if (q.correta !== null && q.correta !== undefined) {
              const gabarito = q.correta ? "true" : "false";
              correta = resp === gabarito;
            }
          } else if (q.letra_correta) {
            correta = resp === q.letra_correta;
          }
        }

        return {
          id_atividade: atividade.id_atividade,
          id_questao: q.id_questao,
          id_aluno: alunoId,
          resposta: resp, // string: "true"/"false"/"A"/"B"/"C"/"D"
          correta,
        };
      });

      // Salva/atualiza respostas do aluno
      const { error: respError } = await supabase
        .from("respostas_atividade_aluno")
        .upsert(respostasParaSalvar, {
          onConflict: "id_atividade,id_questao,id_aluno",
        });

      if (respError) throw new Error(respError.message);

      const payload = {
        id_atividade: atividade.id_atividade,
        id_aluno: alunoId,
        status: "concluida" as const,
        nota: notaCalculada,
        concluido_em: new Date().toISOString(),
      };

      const { error: upsertError } = await supabase
        .from("progresso_atividades")
        .upsert(payload, {
          onConflict: "id_atividade,id_aluno",
        });

      if (upsertError) throw new Error(upsertError.message);

      // Recarrega dados (pra atualizar progresso/nota na tela)
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

  const isConcluida = progresso?.status === "concluida";

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
                {progresso?.concluido_em && (
                  <span className="text-[11px] text-gray-500">
                    Concluída em{" "}
                    {new Date(progresso.concluido_em).toLocaleString("pt-BR")}
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
                  Sua nota nessa atividade (opcional)
                </p>
                <p className="text-xs text-gray-500">
                  Você pode registrar a nota que tirou ao marcar como concluída.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">
                  Nota calculada:{" "}
                  <span className="font-semibold">
                    {progresso?.nota ?? "—"}
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
