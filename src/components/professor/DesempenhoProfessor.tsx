import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  BarChart2, 
  Download, 
  Filter, 
  TrendingUp,
  TrendingDown,
  Award,
  Users,
  Target,
  Coins,
  Eye,
  ChevronRight,
  Trophy,
  Medal,
  Star,
  AlertCircle,
  Calendar,
  CheckCircle2,
  BookOpen,
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
    period?: string;
  }) => void;
}

export function DesempenhoProfessor({
  performanceData = [],
  onExportReport,
  onFilterChange,
}: DesempenhoProfessorProps) {
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("todas");
  const [selectedClass, setSelectedClass] = useState<string>("todas");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("todos");
  const [selectedStudent, setSelectedStudent] = useState<PerformanceData | null>(null);

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
    avgCoins: filteredData.length > 0
      ? Math.round(filteredData.reduce((acc, d) => acc + d.totalCoins, 0) / filteredData.length)
      : 0,
    aboveAvg: filteredData.filter(d => d.averageGrade >= 7).length,
  };

  // Calcular distribuição de notas para gráfico CSS
  const gradeRanges = {
    excellent: filteredData.filter(d => d.averageGrade >= 9).length,
    good: filteredData.filter(d => d.averageGrade >= 7 && d.averageGrade < 9).length,
    average: filteredData.filter(d => d.averageGrade >= 5 && d.averageGrade < 7).length,
    belowAvg: filteredData.filter(d => d.averageGrade < 5).length,
  };

  const getTrendIcon = (trend?: string) => {
    if (trend === "up") return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend === "down") return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <div className="h-4 w-4" />;
  };

  const getRankingIcon = (ranking: number) => {
    if (ranking === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (ranking === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (ranking === 3) return <Medal className="h-5 w-5 text-amber-600" />;
    return <Star className="h-5 w-5 text-gray-300" />;
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 9) return "text-green-700 bg-green-100 border-green-200";
    if (grade >= 7) return "text-blue-700 bg-blue-100 border-blue-200";
    if (grade >= 5) return "text-amber-700 bg-amber-100 border-amber-200";
    return "text-red-700 bg-red-100 border-red-200";
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Desempenho</h1>
          <p className="text-gray-600 mt-1">Acompanhe o progresso e desempenho dos alunos</p>
        </div>
        <Button
          variant="outline"
          className="rounded-xl"
          onClick={onExportReport}
        >
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-4">
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

        <Card className="rounded-xl shadow-sm border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Média de Moedas</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.avgCoins}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Coins className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="rounded-xl shadow-sm">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center gap-3">
            <Filter className="h-5 w-5 text-violet-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Disciplina</label>
              <Select
                value={selectedDiscipline}
                onValueChange={(value) => {
                  setSelectedDiscipline(value);
                  onFilterChange({ discipline: value });
                }}
              >
                <SelectTrigger className="rounded-xl bg-white">
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

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Turma</label>
              <Select
                value={selectedClass}
                onValueChange={(value) => {
                  setSelectedClass(value);
                  onFilterChange({ class: value });
                }}
              >
                <SelectTrigger className="rounded-xl bg-white">
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

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Período</label>
              <Select
                value={selectedPeriod}
                onValueChange={(value) => {
                  setSelectedPeriod(value);
                  onFilterChange({ period: value });
                }}
              >
                <SelectTrigger className="rounded-xl bg-white">
                  <SelectValue placeholder="Todos os períodos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="bimestre1">1º Bimestre</SelectItem>
                  <SelectItem value="bimestre2">2º Bimestre</SelectItem>
                  <SelectItem value="bimestre3">3º Bimestre</SelectItem>
                  <SelectItem value="bimestre4">4º Bimestre</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de Distribuição com CSS */}
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
                <span className="text-sm font-semibold text-green-700">{gradeRanges.excellent} alunos</span>
              </div>
              <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-end px-3 text-white text-xs font-semibold transition-all duration-500"
                  style={{ width: filteredData.length > 0 ? `${(gradeRanges.excellent / filteredData.length) * 100}%` : '0%' }}
                >
                  {filteredData.length > 0 && gradeRanges.excellent > 0 && `${Math.round((gradeRanges.excellent / filteredData.length) * 100)}%`}
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Bom (7.0 - 8.9)</span>
                <span className="text-sm font-semibold text-blue-700">{gradeRanges.good} alunos</span>
              </div>
              <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-end px-3 text-white text-xs font-semibold transition-all duration-500"
                  style={{ width: filteredData.length > 0 ? `${(gradeRanges.good / filteredData.length) * 100}%` : '0%' }}
                >
                  {filteredData.length > 0 && gradeRanges.good > 0 && `${Math.round((gradeRanges.good / filteredData.length) * 100)}%`}
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Regular (5.0 - 6.9)</span>
                <span className="text-sm font-semibold text-amber-700">{gradeRanges.average} alunos</span>
              </div>
              <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-end px-3 text-white text-xs font-semibold transition-all duration-500"
                  style={{ width: filteredData.length > 0 ? `${(gradeRanges.average / filteredData.length) * 100}%` : '0%' }}
                >
                  {filteredData.length > 0 && gradeRanges.average > 0 && `${Math.round((gradeRanges.average / filteredData.length) * 100)}%`}
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Abaixo da Média (&lt; 5.0)</span>
                <span className="text-sm font-semibold text-red-700">{gradeRanges.belowAvg} alunos</span>
              </div>
              <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-end px-3 text-white text-xs font-semibold transition-all duration-500"
                  style={{ width: filteredData.length > 0 ? `${(gradeRanges.belowAvg / filteredData.length) * 100}%` : '0%' }}
                >
                  {filteredData.length > 0 && gradeRanges.belowAvg > 0 && `${Math.round((gradeRanges.belowAvg / filteredData.length) * 100)}%`}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Análise Comparativa */}
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
                const maxGrade = Math.max(...filteredData.map(d => d.averageGrade));
                const maxCoins = Math.max(...filteredData.map(d => d.totalCoins));
                const gradeWidth = (student.averageGrade / maxGrade) * 100;
                const coinsWidth = (student.totalCoins / maxCoins) * 100;

                return (
                  <div key={student.studentId} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-violet-100 flex items-center justify-center">
                          <span className="text-xs font-bold text-violet-600">
                            {student.studentName.split(' ').map(n => n[0]).join('').substring(0, 2)}
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
                          <span className="text-xs font-bold text-blue-700">{student.averageGrade.toFixed(1)}</span>
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
                          <span className="text-xs font-bold text-amber-700">{student.totalCoins}</span>
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

      {/* Comparação por Turma */}
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
              const avgCoins = Math.round(classStudents.reduce((acc, s) => acc + s.totalCoins, 0) / classStudents.length);
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
                      <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700">
                        {className}
                      </span>
                      <span className="text-sm text-gray-600">{classStudents.length} alunos</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="text-right">
                        <span className="font-bold text-gray-900">{avgGrade.toFixed(1)}</span>
                        <span className="text-gray-600 ml-1">média</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-amber-600">{avgCoins}</span>
                        <span className="text-gray-600 ml-1">moedas</span>
                      </div>
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

      {/* Análise de Tendências */}
      <Card className="rounded-xl shadow-sm bg-gradient-to-br from-violet-50 to-blue-50 border-violet-200">
        <CardContent className="p-6">
          <div className="mb-6 flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-violet-600" />
            <h2 className="text-lg font-semibold text-gray-900">Análise de Tendências</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-gray-900">Em Crescimento</span>
              </div>
              <p className="text-3xl font-bold text-green-700 mb-1">
                {filteredData.filter(d => d.trend === "up").length}
              </p>
              <p className="text-xs text-gray-600">alunos melhorando</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-5 w-5 text-gray-600" />
                <span className="font-semibold text-gray-900">Estável</span>
              </div>
              <p className="text-3xl font-bold text-gray-700 mb-1">
                {filteredData.filter(d => d.trend === "stable" || !d.trend).length}
              </p>
              <p className="text-xs text-gray-600">alunos mantendo</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="h-5 w-5 text-red-600" />
                <span className="font-semibold text-gray-900">Necessitam Atenção</span>
              </div>
              <p className="text-3xl font-bold text-red-700 mb-1">
                {filteredData.filter(d => d.trend === "down").length}
              </p>
              <p className="text-xs text-gray-600">alunos em declínio</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Alunos */}
      <Card className="rounded-xl shadow-sm">
        <CardContent className="p-6">
          <div className="mb-6 flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-violet-600" />
            <h2 className="text-lg font-semibold text-gray-900">Desempenho Individual</h2>
            <span className="text-sm text-gray-500 ml-auto">
              {filteredData.length} {filteredData.length === 1 ? 'aluno' : 'alunos'}
            </span>
          </div>

          {filteredData.length === 0 ? (
            <div className="py-12 text-center">
              <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum aluno encontrado</h3>
              <p className="text-gray-600">Tente ajustar os filtros de busca</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b-2 text-left bg-gray-50">
                  <tr>
                    <th className="pb-3 pt-3 px-4 font-semibold text-gray-700">Ranking</th>
                    <th className="pb-3 pt-3 px-4 font-semibold text-gray-700">Aluno</th>
                    <th className="pb-3 pt-3 px-4 font-semibold text-gray-700">Turma</th>
                    <th className="pb-3 pt-3 px-4 font-semibold text-gray-700">Média</th>
                    <th className="pb-3 pt-3 px-4 font-semibold text-gray-700">Moedas</th>
                    <th className="pb-3 pt-3 px-4 font-semibold text-gray-700">Tendência</th>
                    <th className="pb-3 pt-3 px-4 font-semibold text-gray-700">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredData.map((data) => {
                    const gradeColor = getGradeColor(data.averageGrade);
                    return (
                      <tr key={data.studentId} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            {getRankingIcon(data.ranking)}
                            <span className="font-bold text-gray-900">#{data.ranking}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div className="h-9 w-9 rounded-full bg-violet-100 flex items-center justify-center">
                              <span className="text-sm font-semibold text-violet-600">
                                {data.studentName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{data.studentName}</p>
                              <p className="text-xs text-gray-500">{data.studentId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                            {data.class}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold border ${gradeColor}`}>
                            {data.averageGrade.toFixed(1)}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1.5 text-amber-600">
                            <Coins className="h-4 w-4" />
                            <span className="font-semibold">{data.totalCoins}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          {getTrendIcon(data.trend)}
                        </td>
                        <td className="py-4 px-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-xl"
                            onClick={() => setSelectedStudent(data)}
                          >
                            Ver Detalhes
                            <ChevronRight className="h-3.5 w-3.5 ml-1" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Detalhes do Aluno */}
      <Dialog open={!!selectedStudent} onOpenChange={(open) => !open && setSelectedStudent(null)}>
        <DialogContent className="rounded-xl max-w-2xl bg-white max-h-[90vh] overflow-auto">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-14 w-14 rounded-full bg-violet-100 flex items-center justify-center">
                <span className="text-xl font-bold text-violet-700">
                  {selectedStudent?.studentName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </span>
              </div>
              <div>
                <DialogTitle className="text-2xl text-gray-900">{selectedStudent?.studentName}</DialogTitle>
                <p className="text-sm text-gray-600">Matrícula: {selectedStudent?.studentId}</p>
              </div>
            </div>
          </DialogHeader>

          {selectedStudent && (
            <div className="space-y-6 py-4">
              {/* Cards de Estatísticas do Aluno */}
              <div className="grid gap-4 md:grid-cols-4">
                <Card className="rounded-xl shadow-sm border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex flex-col">
                      <p className="text-xs font-medium text-gray-600 mb-1">Média Geral</p>
                      <p className="text-2xl font-bold text-gray-900">{selectedStudent.averageGrade.toFixed(1)}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-xl shadow-sm border-l-4 border-l-amber-500">
                  <CardContent className="p-4">
                    <div className="flex flex-col">
                      <p className="text-xs font-medium text-gray-600 mb-1">Moedas</p>
                      <p className="text-2xl font-bold text-gray-900">{selectedStudent.totalCoins}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-xl shadow-sm border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    <div className="flex flex-col">
                      <p className="text-xs font-medium text-gray-600 mb-1">Ranking</p>
                      <p className="text-2xl font-bold text-gray-900">#{selectedStudent.ranking}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-xl shadow-sm border-l-4 border-l-purple-500">
                  <CardContent className="p-4">
                    <div className="flex flex-col">
                      <p className="text-xs font-medium text-gray-600 mb-1">Frequência</p>
                      <p className="text-2xl font-bold text-gray-900">{selectedStudent.attendance}%</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Informações da Turma */}
              <Card className="rounded-xl shadow-sm">
                <CardContent className="p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Informações Acadêmicas</h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Disciplina:</span>
                      <span className="text-sm font-semibold text-gray-900">{selectedStudent.discipline}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Turma:</span>
                      <span className="text-sm font-semibold text-gray-900">{selectedStudent.class}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedStudent.trend === "up" ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : selectedStudent.trend === "down" ? (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      ) : (
                        <Target className="h-4 w-4 text-gray-600" />
                      )}
                      <span className="text-sm text-gray-600">Tendência:</span>
                      <span className={`text-sm font-semibold ${
                        selectedStudent.trend === "up" ? "text-green-600" : 
                        selectedStudent.trend === "down" ? "text-red-600" : 
                        "text-gray-600"
                      }`}>
                        {selectedStudent.trend === "up" ? "Crescente" : 
                         selectedStudent.trend === "down" ? "Decrescente" : 
                         "Estável"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Total de Atividades:</span>
                      <span className="text-sm font-semibold text-gray-900">{selectedStudent.grades.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Histórico de Notas */}
              <Card className="rounded-xl shadow-sm">
                <CardContent className="p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Histórico de Avaliações</h3>
                  <div className="space-y-3">
                    {selectedStudent.grades.map((grade, index) => {
                      const percentage = (grade.grade / grade.maxGrade) * 100;
                      const color = percentage >= 90 ? "bg-green-500" :
                                    percentage >= 70 ? "bg-blue-500" :
                                    percentage >= 60 ? "bg-amber-500" : "bg-red-500";
                      
                      return (
                        <div key={index} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-gray-400" />
                              <span className="font-medium text-gray-900">{grade.activity}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(grade.date).toLocaleDateString('pt-BR')}
                              </span>
                              <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                                percentage >= 70 ? "bg-green-100 text-green-700" :
                                percentage >= 60 ? "bg-amber-100 text-amber-700" :
                                "bg-red-100 text-red-700"
                              }`}>
                                {grade.grade.toFixed(1)}/{grade.maxGrade}
                              </span>
                            </div>
                          </div>
                          {/* Barra de Progresso */}
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`${color} h-2 rounded-full transition-all duration-300`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Botão de Fechar */}
              <div className="flex justify-end pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setSelectedStudent(null)}
                  className="rounded-xl"
                >
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}