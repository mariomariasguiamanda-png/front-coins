"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { api, resolveMediaUrl } from "@/lib/api";
import { getAlunoLayout } from "@/components/layout/AlunoLayout";
import { Skeleton } from "@/components/ui/Skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  CheckCircle2,
  BookOpen,
  Loader2,
  Paperclip,
  ExternalLink,
  Download,
  Eye,
  AlertTriangle,
} from "lucide-react";
import type { NextPageWithLayout } from "@/pages/_app";

const EXTENSOES_IMAGEM = ["png", "jpg", "jpeg", "gif", "webp"];

function extensaoDoArquivo(caminho: string) {
  const partes = caminho.split(".");
  return partes.length > 1 ? partes.pop()!.toLowerCase() : "";
}

type AnexoSelecionado = { url: string; nome: string; extensao: string };

type Resumo = {
  id_resumo: number;
  titulo: string;
  conteudo: string | null;
  id_disciplina: number;
  status: "pendente" | "lido";
  lido_em: string | null;
  anexos_urls: string[];
  links: string[];
};

const ResumoDetalhePage: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;

  const [resumo, setResumo] = useState<Resumo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusResumo, setStatusResumo] = useState<"pendente" | "lido">(
    "pendente"
  );
  const [saving, setSaving] = useState(false);
  const [anexoSelecionado, setAnexoSelecionado] = useState<AnexoSelecionado | null>(null);

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
      <div className="px-8 py-6 flex justify-center">
        <div className="w-full max-w-3xl space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-7 w-64" />
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-5 w-28 rounded-full" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-9 w-20 rounded-lg" />
              <Skeleton className="h-9 w-40 rounded-lg" />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-3">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !resumo) {
    return (
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
    );
  }

  return (
    <>
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

          {/* Anexos */}
          {resumo.anexos_urls && resumo.anexos_urls.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Paperclip className="h-4 w-4 text-purple-600" />
                Arquivos anexos ({resumo.anexos_urls.length})
              </h2>
              <div className="space-y-2">
                {resumo.anexos_urls.map((caminho, index) => {
                  const nome = caminho.split("/").pop() ?? `Anexo ${index + 1}`;
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() =>
                        setAnexoSelecionado({
                          url: resolveMediaUrl(caminho) ?? caminho,
                          nome,
                          extensao: extensaoDoArquivo(caminho),
                        })
                      }
                      className="flex w-full items-center justify-between gap-3 rounded-lg border border-gray-100 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors text-left"
                    >
                      <span className="truncate">{nome}</span>
                      <Eye className="h-4 w-4 text-gray-400 shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Links de referência */}
          {resumo.links && resumo.links.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <ExternalLink className="h-4 w-4 text-purple-600" />
                Links de referência ({resumo.links.length})
              </h2>
              <div className="space-y-2">
                {resumo.links.map((link, index) => (
                  <a
                    key={index}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-4 py-2.5 text-sm text-purple-700 hover:bg-gray-100 transition-colors break-all"
                  >
                    <ExternalLink className="h-4 w-4 shrink-0" />
                    {link}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog open={!!anexoSelecionado} onOpenChange={(v) => !v && setAnexoSelecionado(null)}>
        <DialogContent className="w-[95vw] sm:max-w-4xl h-[85vh] bg-white text-gray-900 border-gray-200 p-0 flex flex-col gap-0">
          <DialogHeader className="flex-row items-center justify-between gap-4 space-y-0 border-b border-gray-100 p-4 pr-10">
            <DialogTitle className="text-gray-900 truncate text-base">
              {anexoSelecionado?.nome}
            </DialogTitle>
            {anexoSelecionado && (
              <a
                href={anexoSelecionado.url}
                download
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                Baixar
              </a>
            )}
          </DialogHeader>

          <div className="flex-1 min-h-0 bg-gray-50">
            {anexoSelecionado && anexoSelecionado.extensao === "pdf" && (
              <iframe
                src={anexoSelecionado.url}
                title={anexoSelecionado.nome}
                className="w-full h-full border-0"
              />
            )}

            {anexoSelecionado && EXTENSOES_IMAGEM.includes(anexoSelecionado.extensao) && (
              <div className="w-full h-full flex items-center justify-center p-4 overflow-auto">
                <img
                  src={anexoSelecionado.url}
                  alt={anexoSelecionado.nome}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            )}

            {anexoSelecionado &&
              anexoSelecionado.extensao !== "pdf" &&
              !EXTENSOES_IMAGEM.includes(anexoSelecionado.extensao) && (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-6 text-center text-gray-500">
                  <AlertTriangle className="h-10 w-10 text-amber-500" />
                  <p className="text-sm">
                    Não é possível pré-visualizar arquivos .{anexoSelecionado.extensao} dentro da
                    aplicação. Baixe o arquivo para abri-lo.
                  </p>
                  <a
                    href={anexoSelecionado.url}
                    download
                    className="inline-flex items-center gap-2 rounded-lg bg-purple-600 text-white text-sm font-medium px-4 py-2 hover:bg-purple-700 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Baixar arquivo
                  </a>
                </div>
              )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

ResumoDetalhePage.getLayout = getAlunoLayout;

export default ResumoDetalhePage;
