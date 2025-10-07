"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import { Card, CardContent } from "@/components/ui/Card";
import {
  disciplinas as mockDisciplinas,
  atividades as mockAtividades,
} from "@/lib/mock/aluno";
import { CalendarDays, ClipboardList, Info, X } from "lucide-react";
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

function badgeColor(status: string) {
  switch (status) {
    case "pendente":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "enviado":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "corrigido":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

export default function AtividadesPage() {
  const { query, back, push } = useRouter();
  const id = String(query.id || "");
  const disc = mockDisciplinas.find((d) => d.id === id);
  const atividadesBase = useMemo(
    () => mockAtividades.filter((a) => a.disciplinaId === id),
    [id]
  );

  // Revisão espaçada
  const [diasSelecionados, setDiasSelecionados] = useState<number[]>([
    1, 3, 7, 15,
  ]);
  const [revisoesGeradas, setRevisoesGeradas] = useState<number>(0);
  const [mostrarInstrucoes, setMostrarInstrucoes] = useState<string | null>(
    null
  );

  const atividades = atividadesBase; // base por enquanto (mock)

  const tituloDisciplina = disc?.nome || nomePorSlug(id);
  const cor = disc?.cor || "#6B7280";
  const tema = resolverTema({ id, nome: disc?.nome, queryTema: query.tema });

  return (
    <div className="min-h-dvh bg-white text-gray-900 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
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
              <ClipboardList className={`h-5 w-5 ${tema.text}`} />
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: cor }}>
                Atividades
              </h1>
              <p className="text-sm text-gray-600">
                Envie revisões e colete moedas.
              </p>
              {disc && (
                <p className="text-xs text-gray-600 mt-1">
                  {tituloDisciplina} · Moedas: {disc.moedas} · Progresso:{" "}
                  {disc.progresso}%
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Revisão espaçada */}
        <Card className="rounded-2xl bg-white border border-gray-200">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-gray-600" />
              <div className="font-semibold">Revisão espaçada (Ebbinghaus)</div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {[1, 3, 7, 15].map((d) => (
                <label
                  key={d}
                  className="inline-flex items-center gap-2 text-sm"
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4"
                    checked={diasSelecionados.includes(d)}
                    onChange={(e) => {
                      setDiasSelecionados((prev) =>
                        e.target.checked
                          ? [...prev, d]
                          : prev.filter((x) => x !== d)
                      );
                    }}
                  />
                  <span>{d}d</span>
                </label>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-600 flex items-center gap-1">
                <Info className="h-4 w-4" />
                As revisões sugeridas ajudam a fixar o conteúdo ao longo do
                tempo.
              </div>
              <button
                className={`px-4 py-2 rounded-lg text-white font-medium ${tema.bar} hover:opacity-90`}
                onClick={() =>
                  setRevisoesGeradas(Math.floor(Math.random() * 3) + 1)
                }
              >
                Gerar revisão de hoje
              </button>
            </div>
            {revisoesGeradas > 0 && (
              <div className="text-sm text-gray-700">
                {revisoesGeradas} revisão(ões) geradas para hoje nesta
                disciplina (mock).
              </div>
            )}
          </CardContent>
        </Card>

        {/* Lista de atividades */}
        <Card className="rounded-2xl bg-white border border-gray-200">
          <CardContent className="p-5">
            {atividades.length === 0 ? (
              <p className="text-sm text-gray-700">
                Nenhuma atividade encontrada para esta disciplina.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {atividades.map((a) => (
                  <div
                    key={a.id}
                    className="rounded-xl bg-gray-50 border border-gray-200 p-4"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-semibold" style={{ color: cor }}>
                        {a.titulo}
                      </div>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border ${badgeColor(
                          a.status
                        )}`}
                      >
                        {a.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">
                      Prazo: {new Date(a.prazo).toLocaleDateString("pt-BR")}
                    </div>
                    <div className="text-xs text-gray-700 mt-1">
                      Moedas: {a.moedas}
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button
                        className={`px-3 py-1.5 rounded-lg text-white text-sm ${tema.bar} hover:opacity-90`}
                        onClick={() =>
                          push(`/disciplinas/${id}/atividades/${a.id}`)
                        }
                      >
                        Abrir
                      </button>
                      <button
                        className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm"
                        onClick={() => setMostrarInstrucoes(a.id)}
                      >
                        Instruções
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialog simples de instruções */}
        {mostrarInstrucoes && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setMostrarInstrucoes(null)}
            />
            <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white border border-gray-200 shadow-lg">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="font-semibold">Instruções da atividade</div>
                <button
                  className="p-1 rounded hover:bg-gray-100"
                  onClick={() => setMostrarInstrucoes(null)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-4 text-sm text-gray-700 space-y-2">
                <p>
                  Leia o enunciado completo e siga as orientações do professor.
                </p>
                <p>
                  Capriche na justificativa e cite as fontes quando necessário.
                </p>
                <p>
                  Ao terminar, use o botão "Abrir" e envie sua resposta na
                  página da atividade.
                </p>
              </div>
              <div className="p-4 pt-0 flex justify-end gap-2">
                <button
                  className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm"
                  onClick={() => setMostrarInstrucoes(null)}
                >
                  Fechar
                </button>
                <button
                  className="px-3 py-1.5 rounded-lg text-white text-sm"
                  style={{ backgroundColor: cor }}
                  onClick={() => {
                    setMostrarInstrucoes(null);
                  }}
                >
                  Abrir atividade
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
