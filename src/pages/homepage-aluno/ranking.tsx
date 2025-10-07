"use client";

import AlunoLayout from "@/components/layout/AlunoLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Trophy, Medal, Award } from "lucide-react";
import { rankingTurma } from "@/lib/mock/aluno";

export default function RankingPage() {
  return (
    <AlunoLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 bg-opacity-10">
            <Trophy className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-amber-600">
              Ranking da Turma
            </h1>
            <p className="text-sm text-gray-600">
              Veja sua posição no ranking geral e por disciplinas
            </p>
          </div>
        </div>

        <Card className="rounded-2xl bg-white border border-gray-200">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Medal className="h-5 w-5 text-amber-500" />
              Ranking Geral por Moedas
            </h2>

            <div className="space-y-3">
              {rankingTurma.map((aluno, index) => (
                <div
                  key={aluno.nome}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    index === 0
                      ? "bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200"
                      : index === 1
                      ? "bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200"
                      : index === 2
                      ? "bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        index === 0
                          ? "bg-amber-500 text-white"
                          : index === 1
                          ? "bg-gray-400 text-white"
                          : index === 2
                          ? "bg-orange-500 text-white"
                          : "bg-gray-300 text-gray-700"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{aluno.nome}</p>
                      <p className="text-sm text-gray-600">
                        Posição #{aluno.posicao}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-amber-500" />
                    <span className="font-semibold text-amber-600">
                      {aluno.moedas} moedas
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl bg-white border border-gray-200">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">
              Estatísticas da Turma
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {rankingTurma.length}
                </div>
                <div className="text-sm text-blue-700">Total de Alunos</div>
              </div>

              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(
                    rankingTurma.reduce((acc, aluno) => acc + aluno.moedas, 0) /
                      rankingTurma.length
                  )}
                </div>
                <div className="text-sm text-green-700">Média de Moedas</div>
              </div>

              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.max(...rankingTurma.map((aluno) => aluno.moedas))}
                </div>
                <div className="text-sm text-purple-700">Maior Pontuação</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AlunoLayout>
  );
}
