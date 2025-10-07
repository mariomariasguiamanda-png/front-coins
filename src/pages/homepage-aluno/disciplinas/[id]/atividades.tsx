"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import AlunoLayout from "@/components/layout/AlunoLayout";
import { Card, CardContent } from "@/components/ui/Card";
import {
  disciplinas as mockDisciplinas,
  atividades as mockAtividades,
} from "@/lib/mock/aluno";
import { CalendarDays, ClipboardList, ArrowLeft, Info, X } from "lucide-react";
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
  const { query, push } = useRouter();
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

  const atividades = atividadesBase;

  const tituloDisciplina = disc?.nome || nomePorSlug(id);
  const cor = disc?.cor || "#6B7280";
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
              <CalendarDays className="h-5 w-5 text-purple-600" />
              <h2 className="text-lg font-semibold">
                Sistema de Revisão Espaçada
              </h2>
              <button
                onClick={() =>
                  setMostrarInstrucoes(mostrarInstrucoes ? null : "revisao")
                }
                className="p-1 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600"
              >
                <Info className="h-4 w-4" />
              </button>
            </div>

            {mostrarInstrucoes === "revisao" && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 relative">
                <button
                  onClick={() => setMostrarInstrucoes(null)}
                  className="absolute top-2 right-2 p-1 rounded-full hover:bg-blue-200"
                >
                  <X className="h-4 w-4" />
                </button>
                <h3 className="font-medium text-blue-800 mb-2">
                  Como funciona a Revisão Espaçada?
                </h3>
                <p className="text-sm text-blue-700">
                  Selecione os dias em que deseja revisar o conteúdo após o
                  envio inicial. O sistema criará automaticamente lembretes e
                  atividades de revisão nos intervalos escolhidos, otimizando
                  sua retenção de memória.
                </p>
              </div>
            )}

            <div className="space-y-3">
              <h3 className="font-medium">
                Escolha os dias para revisão automática:
              </h3>
              <div className="flex flex-wrap gap-2">
                {[1, 3, 7, 15, 30].map((dia) => (
                  <button
                    key={dia}
                    onClick={() =>
                      setDiasSelecionados((prev) =>
                        prev.includes(dia)
                          ? prev.filter((d) => d !== dia)
                          : [...prev, dia].sort((a, b) => a - b)
                      )
                    }
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                      diasSelecionados.includes(dia)
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                  >
                    {dia} dia{dia > 1 ? "s" : ""}
                  </button>
                ))}
              </div>

              {diasSelecionados.length > 0 && (
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <p className="text-sm text-green-700">
                    <strong>Revisões programadas:</strong>{" "}
                    {diasSelecionados.join(", ")} dia
                    {diasSelecionados.length > 1 ? "s" : ""} após o envio
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Lista de atividades */}
        <div className="space-y-4">
          {atividades.map((atividade) => (
            <Card
              key={atividade.id}
              className="rounded-2xl bg-white border border-gray-200"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">
                        {atividade.titulo}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${badgeColor(
                          atividade.status
                        )}`}
                      >
                        {atividade.status === "pendente" && "Pendente"}
                        {atividade.status === "enviado" && "Enviado"}
                        {atividade.status === "corrigido" && "Corrigido"}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>
                        Prazo:{" "}
                        {new Date(atividade.prazo).toLocaleDateString("pt-BR")}
                      </span>
                      <span>Moedas: {atividade.moedas}</span>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      push(
                        `/homepage-aluno/disciplinas/${id}/atividades/${atividade.id}`
                      )
                    }
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                  >
                    {atividade.status === "pendente"
                      ? "Fazer Atividade"
                      : "Ver Detalhes"}
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {atividades.length === 0 && (
          <Card className="rounded-2xl bg-white border border-gray-200">
            <CardContent className="p-8 text-center">
              <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma atividade disponível
              </h3>
              <p className="text-gray-600">
                Novas atividades aparecerão aqui quando disponibilizadas pelo
                professor.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AlunoLayout>
  );
}
