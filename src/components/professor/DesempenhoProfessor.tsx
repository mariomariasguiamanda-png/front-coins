import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  BarChart2,
  Download, 
  Filter, 
  Award,
  Users,
  Target,
  AlertCircle,
  PieChart
} from "lucide-react";
import { useState } from "react";

interface PerformanceData {
  studentId: string;
  studentName: string;
  grades: {
    activity: string;
    grade: number;
    maxGrade: number;
    date: string;
  }[];
  averageGrade: number;
  totalCoins: number;
  ranking: number;
  discipline: string;
  class: string;
  trend?: "up" | "down" | "stable";
  attendance?: number;
}

interface DesempenhoProfessorProps {
  performanceData: PerformanceData[];
  onExportReport: () => void;
  onFilterChange: (filters: {
    discipline?: string;
    class?: string;
  }) => void;
}

export function DesempenhoProfessor({
  performanceData = [],
  onExportReport,
  onFilterChange,
}: DesempenhoProfessorProps) {
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("todas");
  const [selectedClass, setSelectedClass] = useState<string>("todas");

  // Filtrar dados
  const filteredData = performanceData.filter(data => {
    const matchesDiscipline = selectedDiscipline === "todas" || data.discipline === selectedDiscipline;
    const matchesClass = selectedClass === "todas" || data.class === selectedClass;
    return matchesDiscipline && matchesClass;
  });

  // Estatísticas
  const stats = {
    totalStudents: filteredData.length,
    avgGrade: filteredData.length > 0 
      ? (filteredData.reduce((acc, d) => acc + d.averageGrade, 0) / filteredData.length).toFixed(1)
      : "0.0",
    aboveAvg: filteredData.filter(d => d.averageGrade >= 7).length,
    belowAvg: filteredData.filter(d => d.averageGrade < 7).length,
  };

  const gradeRanges = {
    excellent: filteredData.filter(d => d.averageGrade >= 9).length,
    good: filteredData.filter(d => d.averageGrade >= 7 && d.averageGrade < 9).length,
    average: filteredData.filter(d => d.averageGrade >= 5 && d.averageGrade < 7).length,
    belowAvg: filteredData.filter(d => d.averageGrade < 5).length,
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Desempenho</h1>
          <p className="text-gray-600 mt-1">Acompanhe o progresso e desempenho dos alunos</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/professor/ranking-turma">
            <Button variant="outline" className="rounded-xl">
              Ranking por Turma
            </Button>
          </Link>
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={onExportReport}
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-xl shadow-sm border-l-4 border-l-violet-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Alunos</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalStudents}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-violet-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-violet-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Média Geral</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.avgGrade}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Acima da Média</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.aboveAvg}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Award className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Abaixo da Média</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.belowAvg}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Filtros */}
      <Card className="rounded-xl shadow-sm border-violet-100">
        <CardContent className="p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-violet-100 flex items-center justify-center">
              <Filter className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
              <p className="text-sm text-gray-500">Refine os resultados por disciplina e turma</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-violet-100 bg-violet-50/40 p-3">
              <label className="text-xs font-semibold uppercase tracking-wide text-violet-700 mb-2 block">Disciplina</label>
              <Select
                value={selectedDiscipline}
                onValueChange={(value) => {
                  setSelectedDiscipline(value);
                  onFilterChange({ discipline: value });
                }}
              >
                <SelectTrigger className="rounded-xl bg-white border-violet-200">
                  <SelectValue placeholder="Todas as disciplinas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  <SelectItem value="Matemática">Matemática</SelectItem>
                  <SelectItem value="Física">Física</SelectItem>
                  <SelectItem value="Química">Química</SelectItem>
                  <SelectItem value="Biologia">Biologia</SelectItem>
                  <SelectItem value="História">História</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-3">
              <label className="text-xs font-semibold uppercase tracking-wide text-blue-700 mb-2 block">Turma</label>
              <Select
                value={selectedClass}
                onValueChange={(value) => {
                  setSelectedClass(value);
                  onFilterChange({ class: value });
                }}
              >
                <SelectTrigger className="rounded-xl bg-white border-blue-200">
                  <SelectValue placeholder="Todas as turmas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  <SelectItem value="1º A">1º A</SelectItem>
                  <SelectItem value="1º B">1º B</SelectItem>
                  <SelectItem value="2º A">2º A</SelectItem>
                  <SelectItem value="2º B">2º B</SelectItem>
                  <SelectItem value="3º C">3º C</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Distribuição de Desempenho */}
      <Card className="rounded-xl shadow-sm">
        <CardContent className="p-6">
          <div className="mb-6 flex items-center gap-3">
            <BarChart2 className="h-5 w-5 text-violet-600" />
            <h2 className="text-lg font-semibold text-gray-900">Distribuição de Desempenho</h2>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Excelente (9.0 - 10.0)</span>
                <span className="text-sm font-semibold text-gray-700">{gradeRanges.excellent} alunos</span>
              </div>
              <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-end px-3 text-white text-xs font-semibold transition-all duration-500"
                  style={{ width: filteredData.length > 0 ? `${(gradeRanges.excellent / filteredData.length) * 100}%` : "0%" }}
                >
                  {filteredData.length > 0 && gradeRanges.excellent > 0 && `${Math.round((gradeRanges.excellent / filteredData.length) * 100)}%`}
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Bom (7.0 - 8.9)</span>
                <span className="text-sm font-semibold text-gray-700">{gradeRanges.good} alunos</span>
              </div>
              <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-end px-3 text-white text-xs font-semibold transition-all duration-500"
                  style={{ width: filteredData.length > 0 ? `${(gradeRanges.good / filteredData.length) * 100}%` : "0%" }}
                >
                  {filteredData.length > 0 && gradeRanges.good > 0 && `${Math.round((gradeRanges.good / filteredData.length) * 100)}%`}
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Regular (5.0 - 6.9)</span>
                <span className="text-sm font-semibold text-gray-700">{gradeRanges.average} alunos</span>
              </div>
              <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-end px-3 text-white text-xs font-semibold transition-all duration-500"
                  style={{ width: filteredData.length > 0 ? `${(gradeRanges.average / filteredData.length) * 100}%` : "0%" }}
                >
                  {filteredData.length > 0 && gradeRanges.average > 0 && `${Math.round((gradeRanges.average / filteredData.length) * 100)}%`}
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Abaixo da Média (&lt; 5.0)</span>
                <span className="text-sm font-semibold text-gray-700">{gradeRanges.belowAvg} alunos</span>
              </div>
              <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-end px-3 text-white text-xs font-semibold transition-all duration-500"
                  style={{ width: filteredData.length > 0 ? `${(gradeRanges.belowAvg / filteredData.length) * 100}%` : "0%" }}
                >
                  {filteredData.length > 0 && gradeRanges.belowAvg > 0 && `${Math.round((gradeRanges.belowAvg / filteredData.length) * 100)}%`}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Desempenho Médio por Turma */}
      <Card className="rounded-xl shadow-sm">
        <CardContent className="p-6">
          <div className="mb-6 flex items-center gap-3">
            <PieChart className="h-5 w-5 text-violet-600" />
            <h2 className="text-lg font-semibold text-gray-900">Desempenho Médio por Turma</h2>
          </div>
          <div className="space-y-4">
            {Array.from(new Set(filteredData.map(d => d.class))).map((className) => {
              const classStudents = filteredData.filter(d => d.class === className);
              const avgGrade = classStudents.reduce((acc, s) => acc + s.averageGrade, 0) / classStudents.length;
              const maxAvg = Math.max(
                ...Array.from(new Set(filteredData.map(d => d.class))).map(c => {
                  const students = filteredData.filter(d => d.class === c);
                  return students.reduce((acc, s) => acc + s.averageGrade, 0) / students.length;
                })
              );
              const width = (avgGrade / maxAvg) * 100;

              return (
                <div key={className} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full text-sm font-semibold bg-violet-100 text-violet-700">
                        {className}
                      </span>
                      <span className="text-sm text-gray-600">{classStudents.length} alunos</span>
                    </div>
                    <div className="text-right text-sm">
                      <span className="font-bold text-gray-900">{avgGrade.toFixed(1)}</span>
                      <span className="text-gray-600 ml-1">média</span>
                    </div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full flex items-center justify-end px-3 transition-all duration-500"
                      style={{ width: `${width}%` }}
                    >
                      <span className="text-xs font-bold text-white">{avgGrade.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Desempenho vs Moedas - Top 10 */}
      <Card className="rounded-xl shadow-sm">
        <CardContent className="p-6">
          <div className="mb-6 flex items-center gap-3">
            <BarChart2 className="h-5 w-5 text-violet-600" />
            <h2 className="text-lg font-semibold text-gray-900">Desempenho vs Moedas - Top 10</h2>
          </div>
          <div className="space-y-3">
            {[...filteredData]
              .sort((a, b) => b.averageGrade - a.averageGrade)
              .slice(0, 10)
              .map((student) => {
                const maxGrade = Math.max(...filteredData.map((d) => d.averageGrade));
                const maxCoins = Math.max(...filteredData.map((d) => d.totalCoins));
                const gradeWidth = (student.averageGrade / maxGrade) * 100;
                const coinsWidth = (student.totalCoins / maxCoins) * 100;

                return (
                  <div key={student.studentId} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-violet-100 flex items-center justify-center">
                          <span className="text-xs font-bold text-violet-600">
                            {student.studentName.split(" ").map((n) => n[0]).join("").substring(0, 2)}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{student.studentName}</span>
                      </div>
                      <span className="text-xs text-gray-500">{student.class}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-600">Média</span>
                          <span className="text-xs font-bold text-gray-700">{student.averageGrade.toFixed(1)}</span>
                        </div>
                        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                            style={{ width: `${gradeWidth}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-600">Moedas</span>
                          <span className="text-xs font-bold text-gray-700">{student.totalCoins}</span>
                        </div>
                        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-500"
                            style={{ width: `${coinsWidth}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}