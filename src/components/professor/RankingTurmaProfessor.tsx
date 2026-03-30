import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/Input";
import { Trophy, Medal, Award, Search, Filter, Users, Coins } from "lucide-react";

type RankingItem = {
  studentId: string;
  studentName: string;
  class: string;
  discipline: string;
  averageGrade: number;
  totalCoins: number;
  attendance: number;
};

type RankingTurmaProfessorProps = {
  rankingData: RankingItem[];
};

export function RankingTurmaProfessor({ rankingData }: RankingTurmaProfessorProps) {
  const [selectedClass, setSelectedClass] = useState("todas");
  const [selectedDiscipline, setSelectedDiscipline] = useState("todas");
  const [search, setSearch] = useState("");
  const [showFullRanking, setShowFullRanking] = useState(false);

  const classes = useMemo(
    () => Array.from(new Set(rankingData.map((item) => item.class))).sort(),
    [rankingData]
  );

  const disciplines = useMemo(
    () => Array.from(new Set(rankingData.map((item) => item.discipline))).sort(),
    [rankingData]
  );

  const filteredRanking = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const filtered = rankingData.filter((item) => {
      const classMatch = selectedClass === "todas" || item.class === selectedClass;
      const disciplineMatch =
        selectedDiscipline === "todas" || item.discipline === selectedDiscipline;
      const searchMatch =
        !normalizedSearch ||
        item.studentName.toLowerCase().includes(normalizedSearch) ||
        item.studentId.toLowerCase().includes(normalizedSearch);

      return classMatch && disciplineMatch && searchMatch;
    });

    return filtered
      .slice()
      .sort((a, b) => b.totalCoins - a.totalCoins || b.averageGrade - a.averageGrade)
      .map((item, index) => ({ ...item, rank: index + 1 }));
  }, [rankingData, search, selectedClass, selectedDiscipline]);

  const displayedRanking = showFullRanking ? filteredRanking : filteredRanking.slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ranking por Turma</h1>
          <p className="text-gray-600 mt-1">
            Compare os alunos por moedas, média e frequência com filtros por turma.
          </p>
        </div>
      </div>

      <Card className="rounded-xl shadow-sm border border-violet-100 bg-white">
        <CardContent className="p-5">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="relative">
              <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por nome ou matrícula"
                className="pl-9 rounded-xl h-11"
              />
            </div>

            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="rounded-xl h-11">
                <SelectValue placeholder="Filtrar turma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as turmas</SelectItem>
                {classes.map((className) => (
                  <SelectItem key={className} value={className}>
                    {className}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedDiscipline} onValueChange={setSelectedDiscipline}>
              <SelectTrigger className="rounded-xl h-11">
                <SelectValue placeholder="Filtrar disciplina" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as disciplinas</SelectItem>
                {disciplines.map((discipline) => (
                  <SelectItem key={discipline} value={discipline}>
                    {discipline}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <Filter className="h-4 w-4" />
            <span>{filteredRanking.length} aluno(s) no ranking atual</span>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl shadow-sm border border-amber-100">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              Ranking Geral por Moedas
            </h2>

            <Button
              size="sm"
              variant="outline"
              className="rounded-xl"
              onClick={() => setShowFullRanking((prev) => !prev)}
            >
              {showFullRanking ? "Ver Top 3" : "Ver Ranking Completo"}
            </Button>
          </div>

          {displayedRanking.length === 0 ? (
            <div className="py-10 text-center text-sm text-gray-500">
              Nenhum aluno encontrado para os filtros selecionados.
            </div>
          ) : (
            <div className="space-y-3">
              {displayedRanking.map((student) => {
                const podiumStyle =
                  student.rank === 1
                    ? "bg-amber-50 border-amber-200"
                    : student.rank === 2
                      ? "bg-slate-50 border-slate-200"
                      : student.rank === 3
                        ? "bg-orange-50 border-orange-200"
                        : "bg-gray-50 border-gray-200";

                return (
                  <div
                    key={student.studentId}
                    className={`flex items-center justify-between gap-3 rounded-xl border p-4 ${podiumStyle}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-9 w-9 rounded-full bg-white border flex items-center justify-center text-sm font-bold text-gray-700">
                        {student.rank}
                      </div>

                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{student.studentName}</p>
                        <div className="text-xs text-gray-600 flex items-center gap-2">
                          <span>{student.studentId}</span>
                          <span>•</span>
                          <span>{student.class}</span>
                          <span>•</span>
                          <span>{student.discipline}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {student.rank <= 3 && (
                        <span className="text-gray-600">
                          {student.rank === 1 ? (
                            <Trophy className="h-4 w-4 text-amber-500" />
                          ) : student.rank === 2 ? (
                            <Medal className="h-4 w-4 text-slate-500" />
                          ) : (
                            <Award className="h-4 w-4 text-orange-500" />
                          )}
                        </span>
                      )}

                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900 inline-flex items-center gap-1">
                          <Coins className="h-4 w-4 text-amber-500" />
                          {student.totalCoins}
                        </p>
                        <p className="text-xs text-gray-600">
                          Média {student.averageGrade.toFixed(1)} • Freq. {student.attendance}%
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!showFullRanking && filteredRanking.length > 3 && (
            <p className="text-center text-xs text-gray-500 mt-4">
              Exibindo top 3 de {filteredRanking.length} alunos
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-xl shadow-sm border border-gray-100">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Users className="h-4 w-4 text-violet-600" />
            <h3 className="font-semibold text-gray-900">Leitura Rápida</h3>
          </div>
          <p className="text-sm text-gray-600">
            O ranking está ordenado por moedas e desempate por média geral. Use os filtros para comparar alunos entre turmas e disciplinas.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
