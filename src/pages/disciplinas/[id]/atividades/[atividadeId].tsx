"use client";

import { useRouter } from "next/router";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import {
  disciplinas as mockDisciplinas,
  atividades as mockAtividades,
} from "@/lib/mock/aluno";
import { ArrowLeft, ClipboardList } from "lucide-react";
import { resolverTema } from "@/modules/aluno/tema";

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

export default function AtividadeDetalhePage() {
  const { query, back, push } = useRouter();
  const id = String(query.id || "");
  const atividadeId = String(query.atividadeId || "");
  const [resposta, setResposta] = useState("");
  const [arquivo, setArquivo] = useState<File | null>(null);

  const disc = mockDisciplinas.find((d) => d.id === id);
  const atividade = mockAtividades.find(
    (a) => a.id === atividadeId && a.disciplinaId === id
  );
  const tema = resolverTema({ id, nome: disc?.nome, queryTema: query.tema });
  const [statusLocal, setStatusLocal] = useState<string>(
    atividade?.status || "pendente"
  );

  if (!atividade) {
    return (
      <div className="min-h-dvh grid place-items-center bg-white text-black p-6">
        Atividade não encontrada.
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-white text-gray-900 p-6">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => push(`/homepage-aluno/disciplinas/${id}/atividades`)}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <div
              className={`p-2 rounded-lg bg-gradient-to-br ${tema.grad} bg-opacity-10`}
            >
              <ClipboardList className={`h-5 w-5 ${tema.text}`} />
            </div>
            <div>
              <h1 className={`text-xl font-bold ${tema.text}`}>
                {atividade.titulo}
              </h1>
              {disc && <p className="text-sm text-gray-600">{disc.nome}</p>}
            </div>
          </div>
        </div>

        <Card className="border border-gray-200 rounded-2xl">
          <CardContent className="p-6 space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span
                className={`px-2 py-0.5 rounded-full border ${badgeColor(
                  statusLocal
                )}`}
              >
                {statusLocal}
              </span>
              <span className="text-gray-600">
                Prazo: {new Date(atividade.prazo).toLocaleDateString("pt-BR")}
              </span>
              <span className="text-gray-600">
                Vale {atividade.moedas} moedas
              </span>
            </div>

            <div className="text-gray-800 text-sm">
              Resolva a atividade abaixo e envie sua resposta. (Mock)
            </div>

            <textarea
              className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
              rows={6}
              placeholder="Digite sua resposta aqui..."
              value={resposta}
              onChange={(e) => setResposta(e.target.value)}
            />

            <div>
              <label className="text-sm font-medium text-gray-700">
                Anexar arquivo (opcional)
              </label>
              <input
                type="file"
                className="mt-1 block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                onChange={(e) => setArquivo(e.target.files?.[0] || null)}
              />
              {arquivo && (
                <div className="text-xs text-gray-600 mt-1">
                  Selecionado: {arquivo.name}
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                className={`px-4 py-2 rounded-lg text-white ${tema.bar} hover:opacity-90`}
                onClick={() => {
                  setStatusLocal("enviado");
                  alert("Atividade enviada (mock). Status: enviado");
                }}
              >
                Enviar atividade
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
