"use client";

import { useRouter } from "next/router";
import { useState } from "react";
import AlunoLayout from "@/components/layout/AlunoLayout";
import { Card, CardContent } from "@/components/ui/Card";
import {
  disciplinas as mockDisciplinas,
  atividades as mockAtividades,
} from "@/lib/mock/aluno";
import { ArrowLeft, ClipboardList, Upload, CheckCircle } from "lucide-react";
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

export default function AtividadeDetalhePage() {
  const { query, push } = useRouter();
  const id = String(query.id || "");
  const atividadeId = String(query.atividadeId || "");

  const [resposta, setResposta] = useState("");
  const [enviado, setEnviado] = useState(false);

  const disc = mockDisciplinas.find((d) => d.id === id);
  const atividade = mockAtividades.find((a) => a.id === atividadeId);

  if (!atividade) {
    return (
      <AlunoLayout>
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Atividade não encontrada
          </h2>
          <button
            onClick={() => push(`/homepage-aluno/disciplinas/${id}/atividades`)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Voltar às Atividades
          </button>
        </div>
      </AlunoLayout>
    );
  }

  const tituloDisciplina = disc?.nome || nomePorSlug(id);
  const tema = resolverTema({ id, nome: disc?.nome, queryTema: query.tema });

  const handleEnviar = () => {
    if (resposta.trim()) {
      setEnviado(true);
      // Aqui seria feita a integração com a API
      console.log("Enviando resposta:", resposta);
    }
  };

  return (
    <AlunoLayout>
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div className="flex items-start gap-4">
          <button
            onClick={() => push(`/homepage-aluno/disciplinas/${id}/atividades`)}
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
              <h1
                className="text-2xl font-bold"
                style={{ color: disc?.cor || "#6B7280" }}
              >
                {atividade.titulo}
              </h1>
              <p className="text-sm text-gray-600">
                {tituloDisciplina} · {atividade.moedas} moedas
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Prazo: {new Date(atividade.prazo).toLocaleDateString("pt-BR")}
              </p>
            </div>
          </div>
        </div>

        {enviado ? (
          <Card className="rounded-2xl bg-green-50 border border-green-200">
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-green-800 mb-2">
                Atividade Enviada com Sucesso!
              </h2>
              <p className="text-green-700 mb-4">
                Sua resposta foi enviada e está aguardando correção. Você
                receberá {atividade.moedas} moedas quando a atividade for
                corrigida.
              </p>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() =>
                    push(`/homepage-aluno/disciplinas/${id}/atividades`)
                  }
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Ver Outras Atividades
                </button>
                <button
                  onClick={() => push(`/homepage-aluno/disciplinas/${id}`)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Voltar à Disciplina
                </button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Informações da atividade */}
            <Card className="rounded-2xl bg-white border border-gray-200">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">
                  Descrição da Atividade
                </h2>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="text-gray-700">
                    Esta é uma atividade de {tituloDisciplina.toLowerCase()} que
                    vale {atividade.moedas} moedas. Desenvolva sua resposta de
                    forma clara e completa.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">
                      {atividade.moedas}
                    </div>
                    <div className="text-sm text-blue-700">Moedas</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-lg font-bold text-orange-600">
                      {new Date(atividade.prazo).toLocaleDateString("pt-BR")}
                    </div>
                    <div className="text-sm text-orange-700">Prazo</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-lg font-bold text-purple-600">
                      {atividade.status === "pendente" ? "Aberta" : "Fechada"}
                    </div>
                    <div className="text-sm text-purple-700">Status</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Área de resposta */}
            <Card className="rounded-2xl bg-white border border-gray-200">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Sua Resposta</h2>
                <textarea
                  value={resposta}
                  onChange={(e) => setResposta(e.target.value)}
                  placeholder="Digite sua resposta aqui..."
                  className="w-full h-48 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />

                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-500">
                    {resposta.length} caracteres
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setResposta("")}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                      Limpar
                    </button>
                    <button
                      onClick={handleEnviar}
                      disabled={!resposta.trim()}
                      className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Enviar Resposta
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AlunoLayout>
  );
}
