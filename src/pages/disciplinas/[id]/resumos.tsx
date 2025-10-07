"use client";

import { useRouter } from "next/router";
import { BookOpen, FileText } from "lucide-react";
import { Card } from "@/components/ui/Card";

// Tipos para os dados
interface Resumo {
  id: string;
  disciplina: string;
  titulo: string;
  atividadeVinculada: string;
}

// Mapeamento de cores e gradientes por disciplina
const coresDisciplinas = {
  mat: {
    nome: "Matemática",
    cor: "#3B82F6",
    gradiente: "from-blue-500 to-blue-600",
  },
  hist: {
    nome: "História",
    cor: "#F97316",
    gradiente: "from-orange-500 to-orange-600",
  },
  bio: {
    nome: "Biologia",
    cor: "#10B981",
    gradiente: "from-emerald-500 to-emerald-600",
  },
  fis: {
    nome: "Física",
    cor: "#8B5CF6",
    gradiente: "from-violet-500 to-violet-600",
  },
  geo: {
    nome: "Geografia",
    cor: "#14B8A6",
    gradiente: "from-teal-500 to-teal-600",
  },
  art: {
    nome: "Artes",
    cor: "#EC4899",
    gradiente: "from-pink-500 to-pink-600",
  },
  port: {
    nome: "Português",
    cor: "#22C55E",
    gradiente: "from-green-500 to-green-600",
  },
} as const;

// Dados mock dos resumos
const resumosMock: Resumo[] = [
  {
    id: "1",
    disciplina: "Matemática",
    titulo: "Funções do Primeiro Grau",
    atividadeVinculada: "Exercícios de Álgebra Linear",
  },
  {
    id: "2",
    disciplina: "Matemática",
    titulo: "Teorema de Pitágoras",
    atividadeVinculada: "Geometria Plana - Lista 1",
  },
  {
    id: "3",
    disciplina: "História",
    titulo: "Revolução Industrial",
    atividadeVinculada: "Século XVIII - Transformações",
  },
  {
    id: "4",
    disciplina: "História",
    titulo: "Primeira Guerra Mundial",
    atividadeVinculada: "Conflitos do Século XX",
  },
  {
    id: "5",
    disciplina: "Biologia",
    titulo: "Divisão Celular",
    atividadeVinculada: "Citologia - Processos",
  },
  {
    id: "6",
    disciplina: "Física",
    titulo: "Leis de Newton",
    atividadeVinculada: "Mecânica Clássica",
  },
  {
    id: "7",
    disciplina: "Geografia",
    titulo: "Relevo Brasileiro",
    atividadeVinculada: "Geografia Física do Brasil",
  },
  {
    id: "8",
    disciplina: "Artes",
    titulo: "Renascimento Artístico",
    atividadeVinculada: "História da Arte - Período Clássico",
  },
  {
    id: "9",
    disciplina: "Português",
    titulo: "Análise Sintática",
    atividadeVinculada: "Gramática - Período Composto",
  },
];

export default function Resumos() {
  const router = useRouter();
  const { id } = router.query;

  if (typeof id !== "string") {
    return <div>Carregando...</div>;
  }

  // Buscar informações da disciplina
  const disciplinaInfo = coresDisciplinas[id as keyof typeof coresDisciplinas];

  if (!disciplinaInfo) {
    return <div>Disciplina não encontrada</div>;
  }

  // Filtrar resumos por disciplina
  const resumos = resumosMock.filter(
    (resumo) =>
      resumo.disciplina.toLowerCase() === disciplinaInfo.nome.toLowerCase()
  );

  // Estatísticas
  const totalResumos = resumos.length;
  const resumosRecentes = resumos.filter((_, index) => index < 3).length;

  return (
    <main className="min-h-screen bg-gray-50 px-8 py-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Botão de voltar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push(`/homepage-aluno/disciplinas/${id}`)}
            className="flex items-center justify-center p-3 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke={disciplinaInfo.cor}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>

        {/* Cabeçalho da página */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div
              className="p-3 rounded-2xl text-white shadow-lg"
              style={{ backgroundColor: disciplinaInfo.cor }}
            >
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Resumos - {disciplinaInfo.nome}
              </h1>
              <p className="text-gray-600">
                Materiais de estudo organizados por atividade
              </p>
            </div>
          </div>
        </div>
        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total de Resumos
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {totalResumos}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${disciplinaInfo.gradiente} flex items-center justify-center`}
                >
                  <FileText className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-white border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Resumos Recentes
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {resumosRecentes}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-white border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Disciplina
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    {disciplinaInfo.nome}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-white border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <p className="text-lg font-bold text-green-600">Ativo</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Grid de resumos */}
        {resumos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {resumos.map((resumo) => (
              <div
                key={resumo.id}
                className="cursor-pointer group"
                onClick={() =>
                  router.push(`/disciplinas/${id}/resumos/${resumo.id}`)
                }
              >
                <Card className="bg-white border border-gray-200 hover:shadow-lg transition-all duration-300 h-[140px]">
                  <div className="p-6 h-full flex flex-col">
                    <div className="flex items-start gap-3 flex-1">
                      <div
                        className={`w-10 h-10 rounded-lg bg-gradient-to-br ${disciplinaInfo.gradiente} flex items-center justify-center flex-shrink-0`}
                      >
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 group-hover:text-gray-700 transition-colors">
                          {resumo.titulo}
                        </h3>
                        <p className="text-xs text-gray-600 mb-3">
                          {resumo.atividadeVinculada}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <span className="text-xs text-gray-500">
                        {disciplinaInfo.nome}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <FileText size={12} />
                        Resumo
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum resumo encontrado
            </h3>
            <p className="text-gray-600">
              Os resumos para {disciplinaInfo.nome} aparecerão aqui quando
              disponíveis.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
