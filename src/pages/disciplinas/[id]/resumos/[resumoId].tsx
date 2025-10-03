"use client";

import { useRouter } from "next/router";
import { Card, CardContent } from "@/components/ui/Card";
import {
  disciplinas as mockDisciplinas,
  resumos as mockResumos,
} from "@/lib/mock/aluno";
import { ArrowLeft, FileText } from "lucide-react";
import { resolverTema } from "@/modules/aluno/tema";

export default function ResumoDetalhePage() {
  const { query, back } = useRouter();
  const id = String(query.id || "");
  const resumoId = String(query.resumoId || "");

  const disc = mockDisciplinas.find((d) => d.id === id);
  const resumo = mockResumos.find(
    (r) => r.id === resumoId && r.disciplinaId === id
  );
  const tema = resolverTema({ id, nome: disc?.nome, queryTema: query.tema });

  if (!resumo) {
    return (
      <div className="min-h-dvh grid place-items-center bg-white text-black p-6">
        Resumo não encontrado.
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-white text-gray-900 p-6">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => back()}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <div
              className={`p-2 rounded-lg bg-gradient-to-br ${tema.grad} bg-opacity-10`}
            >
              <FileText className={`h-5 w-5 ${tema.text}`} />
            </div>
            <div>
              <h1 className={`text-xl font-bold ${tema.text}`}>
                {resumo.titulo}
              </h1>
              {disc && <p className="text-sm text-gray-600">{disc.nome}</p>}
            </div>
          </div>
        </div>

        <Card className="border border-gray-200 rounded-2xl">
          <CardContent className="p-6">
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-800 whitespace-pre-line">
                {resumo.conteudo}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
