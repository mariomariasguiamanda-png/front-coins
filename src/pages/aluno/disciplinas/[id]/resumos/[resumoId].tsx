"use client";

import { useRouter } from "next/router";
import AlunoLayout from "@/components/layout/AlunoLayout";
import { Card, CardContent } from "@/components/ui/Card";
import {
  disciplinas as mockDisciplinas,
  resumos as mockResumos,
} from "@/lib/mock/aluno";
import { ArrowLeft, FileText, BookOpen } from "lucide-react";
import { resolverTema } from "@/modules/aluno/tema";

function nomePorSlug(id: string) {
  const mapa: Record<string, string> = {
    mat: "Matemática",
    port: "Português",
    hist: "História",
    geo: "Geografia",
    bio: "Biologia",
    fis: "Física",
    art: "Artes",
  };
  return mapa[id] || id;
}

export default function ResumoDetalhePage() {
  const { query, push } = useRouter();
  const id = String(query.id || "");
  const resumoId = String(query.resumoId || "");

  const disc = mockDisciplinas.find((d) => d.id === id);
  const resumo = mockResumos.find((r) => r.id === resumoId);

  if (!resumo) {
    return (
      <AlunoLayout>
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Resumo não encontrado
          </h2>
          <button
            onClick={() => push(`/aluno/disciplinas/${id}/resumos`)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Voltar aos Resumos
          </button>
        </div>
      </AlunoLayout>
    );
  }

  const tituloDisciplina = disc?.nome || nomePorSlug(id);
  const tema = resolverTema({ id, nome: disc?.nome, queryTema: query.tema });

  return (
    <AlunoLayout>
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div className="flex items-start gap-4">
          <button
            onClick={() => push(`/aluno/disciplinas/${id}/resumos`)}
            className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>
          <div className="flex items-center gap-3">
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: disc?.cor || "#6B7280" }}
            >
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1
                className="text-2xl font-bold"
                style={{ color: disc?.cor || "#6B7280" }}
              >
                {resumo.titulo}
              </h1>
              <p className="text-sm text-gray-600">{tituloDisciplina}</p>
              {resumo.atividadeVinculada && (
                <p className="text-xs text-blue-600 mt-1">
                  Vinculado à atividade: {resumo.atividadeVinculada}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Conteúdo do resumo */}
        <Card className="rounded-2xl bg-white border border-gray-200">
          <CardContent className="p-8">
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className="h-5 w-5 text-purple-600" />
              <h2 className="text-lg font-semibold">Conteúdo do Resumo</h2>
            </div>

            <div className="prose max-w-none">
              <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-purple-500">
                <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                  {resumo.conteudo}
                </p>
              </div>
            </div>

            {/* Ações */}
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => push(`/aluno/disciplinas/${id}/resumos`)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Ver Outros Resumos
              </button>
              <button
                onClick={() => push(`/aluno/disciplinas/${id}`)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Voltar à Disciplina
              </button>
              {resumo.atividadeVinculada && (
                <button
                  onClick={() => push(`/aluno/disciplinas/${id}/atividades`)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Ver Atividades
                </button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Dicas de estudo */}
        <Card className="rounded-2xl bg-blue-50 border border-blue-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-blue-800 mb-3">
              💡 Dicas de Estudo
            </h3>
            <ul className="text-blue-700 text-sm space-y-2">
              <li>• Faça anotações importantes enquanto lê</li>
              <li>• Revise este conteúdo regularmente</li>
              <li>• Relacione com outros tópicos da disciplina</li>
              <li>• Use este resumo para revisar antes das avaliações</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AlunoLayout>
  );
}
