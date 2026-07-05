"use client";

import { useState, useEffect } from "react";
import { getAlunoLayout } from "@/components/aluno/AlunoLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import {
  Trophy,
  Medal,
  Award,
  ChevronDown,
  ChevronUp,
  Users,
} from "lucide-react";
import { api, resolveMediaUrl } from "@/lib/api";
import type { NextPageWithLayout } from "@/pages/_app";

type RankingAluno = {
  id_aluno: number;
  nome_aluno: string;
  total_moedas_ganhas: number;
  foto_url: string | null;
};

type RankingAlunoWithPos = RankingAluno & { posicao: number };

const RankingPage: NextPageWithLayout = () => {
  const [showFullRanking, setShowFullRanking] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [ranking, setRanking] = useState<RankingAlunoWithPos[]>([]);
  const [meuIdAluno, setMeuIdAluno] = useState<number | null>(null);
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

        // Turma e id do próprio aluno vêm do perfil/sessão - não é mais hardcoded
        const [me, perfil] = await Promise.all([
          api.get("/auth/me"),
          api.get("/aluno/perfil"),
        ]);

        setMeuIdAluno(me?.id_aluno ?? null);

        const idTurma = perfil?.turma?.id_turma;
        if (!idTurma) {
          setRanking([]);
          return;
        }

        const data = await api.get(`/aluno/moedas/ranking?turma=${idTurma}`);

        const mapped: RankingAlunoWithPos[] = (data?.alunos ?? []).map(
          (row: any) => ({
            id_aluno: row.id_aluno,
            nome_aluno: row.nome,
            total_moedas_ganhas: row.total_moedas_historico,
            foto_url: row.foto_url,
            posicao: row.posicao,
          })
        );

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
      <div className="page-enter space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-3 w-56" />
          </div>
        </div>
        <Card className="rounded-2xl bg-white border border-gray-200">
          <CardContent className="p-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 p-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-enter flex items-center justify-center h-full">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  // Mostrar apenas os top 3 inicialmente
  const topRanking = ranking.slice(0, 3);
  const displayedRanking = showFullRanking ? ranking : topRanking;

  return (
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
              <div>
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Medal className="h-5 w-5 text-amber-500" />
                  Ranking Geral por Moedas
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Total histórico de moedas conquistadas — comprar pontos não
                  reduz sua posição no ranking.
                </p>
              </div>

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
                const isCurrentUser = aluno.id_aluno === meuIdAluno;
                const actualPosition = aluno.posicao - 1; // Índice real baseado na posição

                return (
                  <div
                    key={aluno.id_aluno}
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
                      <div className="flex items-center gap-3">
                        {aluno.foto_url ? (
                          <img
                            src={resolveMediaUrl(aluno.foto_url) ?? undefined}
                            alt={aluno.nome_aluno}
                            className="w-10 h-10 rounded-full object-cover border border-gray-300 shadow-sm"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-semibold shadow-sm">
                            {aluno.nome_aluno
                              ? aluno.nome_aluno.charAt(0).toUpperCase()
                              : "?"}
                          </div>
                        )}

                        <div>
                          <p
                            className={`font-medium ${
                              isCurrentUser ? "text-violet-700" : ""
                            }`}
                          >
                            {aluno.nome_aluno}
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
                        {aluno.total_moedas_ganhas} moedas
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
                        ranking.reduce(
                          (acc, aluno) => acc + aluno.total_moedas_ganhas,
                          0
                        ) / ranking.length
                      )
                    : 0}
                </div>
                <div className="text-sm text-green-700">Média de Moedas</div>
              </div>

              <div className="text-center p-4 bg-purple-50 rounded-lg hover-lift smooth-transition">
                <div className="text-2xl font-bold text-purple-600">
                  {ranking.length > 0
                    ? Math.max(
                        ...ranking.map((aluno) => aluno.total_moedas_ganhas)
                      )
                    : 0}
                </div>
                <div className="text-sm text-purple-700">Maior Pontuação</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
  );
};

RankingPage.getLayout = getAlunoLayout;

export default RankingPage;
