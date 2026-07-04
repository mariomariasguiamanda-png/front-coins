"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { api } from "@/lib/api";
import AlunoLayout from "@/components/layout/AlunoLayout";
import { CheckCircle2, BookOpen, Loader2 } from "lucide-react";

type Resumo = {
  id_resumo: number;
  titulo: string;
  conteudo: string | null;
  id_disciplina: number;
  status: "pendente" | "lido";
  lido_em: string | null;
};

const ResumoDetalhePage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [resumo, setResumo] = useState<Resumo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusResumo, setStatusResumo] = useState<"pendente" | "lido">(
    "pendente"
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchResumo = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        const idNumber = Number(id);
        if (Number.isNaN(idNumber)) {
          throw new Error("ID de resumo inválido.");
        }

        // A API já resolve o aluno logado (JWT) e devolve status/lido_em junto
        const data: Resumo = await api.get(`/aluno/resumos/${idNumber}`);
        setResumo(data);
        setStatusResumo(data.status === "lido" ? "lido" : "pendente");
      } catch (err: any) {
        setError(err.message ?? "Erro ao carregar o resumo.");
      } finally {
        setLoading(false);
      }
    };

    fetchResumo();
  }, [id]);

  const handleVoltar = () => {
    router.back(); // volta para a página anterior (normalmente a disciplina)
  };

  const handleMarcarComoLido = async () => {
    if (!resumo || statusResumo === "lido") return;

    try {
      setSaving(true);
      await api.post(`/aluno/resumos/${resumo.id_resumo}/concluir`, {});
      setStatusResumo("lido");
    } catch (err) {
      console.error("Erro ao marcar resumo como lido:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AlunoLayout>
        <div className="px-8 py-6 text-sm text-gray-600">
          Carregando resumo...
        </div>
      </AlunoLayout>
    );
  }

  if (error || !resumo) {
    return (
      <AlunoLayout>
        <div className="px-8 py-6 space-y-4">
          <p className="text-sm text-red-500">
            {error || "Resumo não encontrado."}
          </p>
          <button
            onClick={handleVoltar}
            className="inline-flex items-center rounded-lg bg-purple-600 text-white text-sm font-medium px-4 py-2 hover:bg-purple-700 transition-colors"
          >
            Voltar
          </button>
        </div>
      </AlunoLayout>
    );
  }

  return (
    <AlunoLayout>
      <div className="px-8 py-6 flex justify-center">
        <div className="w-full max-w-3xl space-y-6">
          {/* Cabeçalho */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {resumo.titulo}
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Resumo #{resumo.id_resumo}
              </p>
              <div className="mt-2 inline-flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-medium ${
                    statusResumo === "lido"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {statusResumo === "lido" ? (
                    <>
                      <CheckCircle2 className="h-3 w-3" />
                      Já lido
                    </>
                  ) : (
                    <>
                      <BookOpen className="h-3 w-3" />
                      Ainda não lido
                    </>
                  )}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleVoltar}
                className="inline-flex items-center rounded-lg border border-gray-200 text-gray-700 text-sm font-medium px-4 py-2 hover:bg-gray-50 transition-colors"
              >
                Voltar
              </button>

              <button
                onClick={handleMarcarComoLido}
                disabled={statusResumo === "lido" || saving}
                className={`inline-flex items-center gap-2 rounded-lg text-sm font-medium px-4 py-2 transition-colors ${
                  statusResumo === "lido"
                    ? "bg-emerald-50 text-emerald-700 cursor-default"
                    : "bg-purple-600 text-white hover:bg-purple-700"
                }`}
              >
                {statusResumo === "lido" ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Lido
                  </>
                ) : saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <BookOpen className="h-4 w-4" />
                    Marcar como lido
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Conteúdo do resumo */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
            {resumo.conteudo ? (
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {resumo.conteudo}
              </p>
            ) : (
              <p className="text-sm text-gray-500">
                Este resumo ainda não possui conteúdo cadastrado.
              </p>
            )}
          </div>
        </div>
      </div>
    </AlunoLayout>
  );
};

export default ResumoDetalhePage;
