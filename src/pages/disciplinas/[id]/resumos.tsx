"use client";

import { useRouter } from "next/router";
import { Card, CardContent } from "@/components/ui/Card";
import {
  disciplinas as mockDisciplinas,
  resumos as mockResumos,
} from "@/lib/mock/aluno";
import { BookOpen } from "lucide-react";
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
  const { query, back, push } = useRouter();
  const id = String(query.id || "");

  const disc = mockDisciplinas.find((d) => d.id === id);
  const resumos = mockResumos.filter((r) => r.disciplinaId === id);

  const tituloDisciplina = disc?.nome || nomePorSlug(id);
  const tema = resolverTema({ id, nome: disc?.nome, queryTema: query.tema });

  return (
    <div className="min-h-dvh bg-white text-gray-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Cabeçalho */}
        <div className="flex items-start gap-4">
          <button
            onClick={() => back()}
            className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm"
          >
            Voltar
          </button>
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg bg-gradient-to-br ${tema.grad} bg-opacity-10`}
            >
              <BookOpen className={`h-5 w-5 ${tema.text}`} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Resumos</h1>
              <p className="text-sm text-gray-600">Leitura e download.</p>
              {disc && (
                <p className="text-xs text-gray-600 mt-1">
                  {tituloDisciplina} · Moedas: {disc.moedas} · Progresso:{" "}
                  {disc.progresso}%
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Lista de resumos */}
        <div>
          {resumos.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-4xl mb-2">📄</div>
              <div className="text-gray-700 font-medium">
                Sem resumos ainda.
              </div>
              <div className="text-sm text-gray-600">
                Assim que os professores publicarem, eles aparecerão aqui.
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {resumos.map((r) => (
                <Card
                  key={r.id}
                  className={`rounded-2xl overflow-hidden bg-gradient-to-br ${tema.grad} text-white`}
                >
                  <CardContent className="p-5">
                    <div className="min-h-[10rem] flex flex-col justify-between">
                      <div>
                        <div className="text-violet-200 text-xs mb-1">
                          {tituloDisciplina}
                        </div>
                        <div className="text-white font-bold text-lg leading-snug">
                          {r.titulo}
                        </div>
                        {r.atividadeVinculada && (
                          <div className="text-violet-200 text-xs mt-1">
                            Atividade: {r.atividadeVinculada}
                          </div>
                        )}
                      </div>
                      <div className="pt-4">
                        <button
                          className="bg-white font-semibold rounded-xl px-4 py-2 hover:bg-violet-100 flex items-center gap-2"
                          onClick={() =>
                            push(`/disciplinas/${id}/resumos/${r.id}`)
                          }
                        >
                          <BookOpen className={`h-4 w-4 ${tema.text}`} />
                          <span className={`${tema.text}`}>Ler</span>
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
