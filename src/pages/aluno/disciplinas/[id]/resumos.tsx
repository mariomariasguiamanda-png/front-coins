"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import AlunoLayout from "@/components/layout/AlunoLayout";
import { Card, CardContent } from "@/components/ui/Card";
import NotificationCard from "@/components/ui/NotificationCard";
import {
  disciplinas as mockDisciplinas,
  resumos as mockResumos,
} from "@/lib/mock/aluno";
import { ArrowLeft, FileText, Repeat, Target } from "lucide-react";
import {
  FaCalculator,
  FaFlask,
  FaGlobeAmericas,
  FaBook,
  FaAtom,
  FaPalette,
} from "react-icons/fa";
import { resolverTema } from "@/modules/aluno/tema";

type IconComponent = (props: { className?: string }) => JSX.Element;

const iconByDisciplina: Record<string, IconComponent> = {
  mat: (p) => <FaCalculator {...p} />,
  port: (p) => <FaBook {...p} />,
  hist: (p) => <FaBook {...p} />,
  geo: (p) => <FaGlobeAmericas {...p} />,
  bio: (p) => <FaFlask {...p} />,
  fis: (p) => <FaAtom {...p} />,
  art: (p) => <FaPalette {...p} />,
};

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
  const [diasRevisao, setDiasRevisao] = useState<number[]>([1, 3, 7, 15]);

  const disc = mockDisciplinas.find((d) => d.id === id);
  const resumos = mockResumos.filter((r) => r.disciplinaId === id);

  const tituloDisciplina = disc?.nome || nomePorSlug(id);
  const tema = resolverTema({ id, nome: disc?.nome, queryTema: query.tema });
  const IconComponent = iconByDisciplina[id] || FaBook;

  const toggleDiaRevisao = (dia: number) => {
    setDiasRevisao((prev) =>
      prev.includes(dia)
        ? prev.filter((d) => d !== dia)
        : [...prev, dia].sort((a, b) => a - b)
    );
  };

  const [showNotification, setShowNotification] = useState(false);

  const gerarRevisaoHoje = () => {
    setShowNotification(true);
  };

  return (
    <AlunoLayout>
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div className="flex items-start gap-4">
          <button
            onClick={() => push(`/aluno/disciplinas/${id}`)}
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
              <IconComponent className="h-6 w-6 text-white" />
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

        {/* Revisão Espaçada (Ebbinghaus) */}
        <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600">
                <Repeat className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Revisão Espaçada (Ebbinghaus)
                </h3>
                <p className="text-sm text-gray-600">
                  Selecione os intervalos para maximizar sua retenção
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {[1, 3, 7, 15].map((dia) => (
                <label
                  key={dia}
                  className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-white cursor-pointer transition-all"
                >
                  <input
                    type="checkbox"
                    checked={diasRevisao.includes(dia)}
                    onChange={() => toggleDiaRevisao(dia)}
                    className="w-4 h-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {dia} dia{dia > 1 ? "s" : ""}
                  </span>
                </label>
              ))}
            </div>

            <button
              onClick={gerarRevisaoHoje}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 flex items-center gap-2 justify-center"
            >
              <Target className="h-5 w-5" />
              Gerar revisão de hoje
            </button>
          </CardContent>
        </Card>

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
                        className={`p-2 rounded-lg bg-gradient-to-br ${tema.grad}`}
                      >
                        <IconComponent className="h-4 w-4 text-white" />
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
                      push(`/aluno/disciplinas/${id}/resumos/${resumo.id}`)
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

      {/* Componente de Notificação */}
      <NotificationCard
        show={showNotification}
        onClose={() => setShowNotification(false)}
        message="Revisão de resumos gerada com base nos dias selecionados!"
        type="success"
      />
    </AlunoLayout>
  );
}
