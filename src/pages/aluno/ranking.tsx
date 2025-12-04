"use client";

import { useState, useEffect } from "react";
import AlunoLayout from "@/components/layout/AlunoLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Trophy,
  Medal,
  Award,
  ChevronDown,
  ChevronUp,
  Users,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

type RankingRowFromDB = {
  id_turma: number;
  nome_turma: string;
  id_aluno: number;
  nome_aluno: string;
  total_moedas_ganhas: number;
};

type RankingAluno = {
  id_aluno: number;
  nome: string;
  moedas: number;
  posicao: number;
};

export default function RankingPage() {
  const [showFullRanking, setShowFullRanking] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [ranking, setRanking] = useState<RankingAluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const fetchRanking = async () => {
      try {
        setLoading(true);
        setError(null);

        // TODO: substituir pelo id da turma do aluno logado
        const idTurma = 1;

        const { data, error } = await supabase
          .rpc("get_ranking_moedas_turma", { p_id_turma: idTurma });

        if (error) throw error;

        const rows = (data ?? []) as RankingRowFromDB[];

        const mapped: RankingAluno[] = rows.map((row, index) => ({
          id_aluno: row.id_aluno,
          nome: row.nome_aluno,
          moedas: row.total_moedas_ganhas,
          posicao: index + 1,
        }));

        setRanking(mapped);
      } catch (err) {
        console.error(err);
        setError("Não foi possível carregar o ranking agora.");
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, [mounted]);

  if (!mounted) return null;

  if (loading) {
    return (
      <AlunoLayout>
        <div className="page-enter flex items-center justify-center h-full">
          <p className="text-sm text-gray-500">
            Carregando ranking da turma...
          </p>
        </div>
      </AlunoLayout>
    );
  }

  if (error) {
    return (
      <AlunoLayout>
        <div className="page-enter flex items-center justify-center h-full">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      </AlunoLayout>
    );
  }

  // Mostrar apenas os top 3 inicialmente
  const topRanking = ranking.slice(0, 3);
  const displayedRanking = showFullRanking ? ranking : topRanking;

  return (
    <AlunoLayout>
      <div className="page-enter space-y-6">
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

        <Card className="rounded-2xl bg-white border border-gray-200 card-bounce card-bounce-delay-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Medal className="h-5 w-5 text-amber-500" />
                Ranking Geral por Moedas
              </h2>

              <Button
                onClick={() => setShowFullRanking(!showFullRanking)}
                size="sm"
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0 shadow-md hover:shadow-lg smooth-transition"
              >
                <Users className="h-4 w-4 mr-2" />
                <span className="font-medium">
                  {showFullRanking ? "Ver Top 3" : "Ver Ranking Completo"}
                </span>
                {showFullRanking ? (
                  <ChevronUp className="h-4 w-4 ml-2" />
                ) : (
                  <ChevronDown className="h-4 w-4 ml-2" />
                )}
              </Button>
            </div>

            <div className="space-y-3">
              {displayedRanking.map((aluno, displayIndex) => {
                const isCurrentUser = aluno.nome === "Ana Souza";
                const actualPosition = aluno.posicao - 1; // Índice real baseado na posição

                return (
                  <div
                    key={aluno.nome}
                    className={`flex items-center justify-between p-4 rounded-lg border smooth-transition ${
                      isCurrentUser
                        ? "bg-gradient-to-r from-violet-50 to-purple-50 border-violet-200 ring-2 ring-violet-200"
                        : actualPosition === 0
                          ? "bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200"
                          : actualPosition === 1
                            ? "bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200"
                            : actualPosition === 2
                              ? "bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200"
                              : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          isCurrentUser
                            ? "bg-violet-500 text-white"
                            : actualPosition === 0
                              ? "bg-amber-500 text-white"
                              : actualPosition === 1
                                ? "bg-gray-400 text-white"
                                : actualPosition === 2
                                  ? "bg-orange-500 text-white"
                                  : "bg-gray-300 text-gray-700"
                        }`}
                      >
                        {aluno.posicao}
                      </div>
                      <div>
                        <p
                          className={`font-medium ${
                            isCurrentUser ? "text-violet-700" : ""
                          }`}
                        >
                          {aluno.nome}
                          {isCurrentUser && (
                            <span className="ml-2 px-2 py-1 bg-violet-100 text-violet-700 text-xs rounded-full">
                              Você
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-600">
                          {actualPosition < 3
                            ? actualPosition === 0
                              ? "🥇 Primeiro lugar"
                              : actualPosition === 1
                                ? "🥈 Segundo lugar"
                                : "🥉 Terceiro lugar"
                            : `Posição #${aluno.posicao}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Award
                        className={`h-4 w-4 ${
                          isCurrentUser ? "text-violet-500" : "text-amber-500"
                        }`}
                      />
                      <span
                        className={`font-semibold ${
                          isCurrentUser ? "text-violet-600" : "text-amber-600"
                        }`}
                      >
                        {aluno.moedas} moedas
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {!showFullRanking && ranking.length > 3 && (
              <div className="mt-4 text-center text-sm text-gray-500">
                Mostrando top 3 de {ranking.length} alunos
              </div>
            )}

            {showFullRanking && (
              <div className="mt-4 text-center text-sm text-gray-500">
                Exibindo todos os {ranking.length} alunos da turma
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl bg-white border border-gray-200 card-bounce card-bounce-delay-2">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-blue-500" />
              Estatísticas da Turma
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg hover-lift smooth-transition">
                <div className="text-2xl font-bold text-blue-600">
                  {ranking.length}
                </div>
                <div className="text-sm text-blue-700">Total de Alunos</div>
              </div>

              <div className="text-center p-4 bg-green-50 rounded-lg hover-lift smooth-transition">
                <div className="text-2xl font-bold text-green-600">
                  {ranking.length > 0
                    ? Math.round(
                        ranking.reduce((acc, aluno) => acc + aluno.moedas, 0) /
                          ranking.length
                      )
                    : 0}
                </div>
                <div className="text-sm text-green-700">Média de Moedas</div>
              </div>

              <div className="text-center p-4 bg-purple-50 rounded-lg hover-lift smooth-transition">
                <div className="text-2xl font-bold text-purple-600">
                  {ranking.length > 0
                    ? Math.max(...ranking.map((aluno) => aluno.moedas))
                    : 0}
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
