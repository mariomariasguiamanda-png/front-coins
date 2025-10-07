"use client";

import { useRouter } from "next/router";
import AlunoLayout from "@/components/layout/AlunoLayout";
import { Card, CardContent } from "@/components/ui/Card";
import {
  disciplinas as mockDisciplinas,
  resumos as mockResumos,
} from "@/lib/mock/aluno";
import { ArrowLeft, FileText } from "lucide-react";
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

export default function ResumosPage() {
  const { query, push } = useRouter();
  const id = String(query.id || "");

  const disc = mockDisciplinas.find((d) => d.id === id);
  const resumos = mockResumos.filter((r) => r.disciplinaId === id);

  const tituloDisciplina = disc?.nome || nomePorSlug(id);
  const tema = resolverTema({ id, nome: disc?.nome, queryTema: query.tema });

  return (
    <AlunoLayout>
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div className="flex items-start gap-4">
          <button
            onClick={() => push(`/homepage-aluno/disciplinas/${id}`)}
            className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg bg-gradient-to-br ${tema.grad} bg-opacity-10`}
            >
              <FileText className={`h-5 w-5 ${tema.text}`} />
            </div>
            <div>
              <h1
                className="text-2xl font-bold"
                style={{ color: disc?.cor || "#6B7280" }}
              >
                Resumos
              </h1>
              <p className="text-sm text-gray-600">
                Material de estudo organizado por tópicos
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {tituloDisciplina} · {resumos.length} resumo
                {resumos.length !== 1 ? "s" : ""} disponível
                {resumos.length !== 1 ? "is" : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Lista de resumos */}
        <div className="space-y-4">
          {resumos.map((resumo) => (
            <Card
              key={resumo.id}
              className="rounded-2xl bg-white border border-gray-200"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className={`p-2 rounded-lg bg-gradient-to-br ${tema.grad} bg-opacity-10`}
                      >
                        <FileText className={`h-4 w-4 ${tema.text}`} />
                      </div>
                      <h3 className="font-semibold text-lg">{resumo.titulo}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {resumo.conteudo}
                    </p>
                    {resumo.atividadeVinculada && (
                      <p className="text-xs text-blue-600">
                        Vinculado à atividade: {resumo.atividadeVinculada}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() =>
                      push(
                        `/homepage-aluno/disciplinas/${id}/resumos/${resumo.id}`
                      )
                    }
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                  >
                    Ler Resumo
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {resumos.length === 0 && (
          <Card className="rounded-2xl bg-white border border-gray-200">
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum resumo disponível
              </h3>
              <p className="text-gray-600">
                Os resumos aparecerão aqui conforme o conteúdo for
                disponibilizado.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AlunoLayout>
  );
}
