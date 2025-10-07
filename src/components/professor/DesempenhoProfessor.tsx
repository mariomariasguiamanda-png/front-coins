import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart2, Download, Filter, TrendingUp } from "lucide-react";

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
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Desempenho</h1>
          <p className="text-muted-foreground">
            Acompanhe o progresso dos alunos
          </p>
        </div>
        <Button
          variant="outline"
          className="rounded-xl"
          onClick={onExportReport}
        >
          <Download className="mr-2 h-4 w-4" />
          Exportar Relatório
        </Button>
      </header>

      {/* Filtros */}
      <Card className="rounded-xl">
        <CardContent className="p-6">
          <div className="mb-6 flex items-center gap-3">
            <Filter className="h-5 w-5 text-violet-600" />
            <h2 className="text-lg font-semibold">Filtros</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Select onValueChange={(value) => onFilterChange({ discipline: value })}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Disciplina" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="matematica">Matemática</SelectItem>
                <SelectItem value="fisica">Física</SelectItem>
                <SelectItem value="quimica">Química</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => onFilterChange({ class: value })}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Turma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1a">1º A</SelectItem>
                <SelectItem value="2b">2º B</SelectItem>
                <SelectItem value="3c">3º C</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => onFilterChange({ period: value })}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bimestre1">1º Bimestre</SelectItem>
                <SelectItem value="bimestre2">2º Bimestre</SelectItem>
                <SelectItem value="bimestre3">3º Bimestre</SelectItem>
                <SelectItem value="bimestre4">4º Bimestre</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de Desempenho */}
      <Card className="rounded-xl">
        <CardContent className="p-6">
          <div className="mb-6 flex items-center gap-3">
            <BarChart2 className="h-5 w-5 text-violet-600" />
            <h2 className="text-lg font-semibold">Média da Turma</h2>
          </div>

          <div className="h-[300px] w-full">
            {/* Placeholder para o gráfico - implementar com biblioteca de gráficos */}
            <div className="flex h-full items-center justify-center text-muted-foreground">
              [Gráfico de desempenho será implementado aqui]
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Alunos */}
      <Card className="rounded-xl">
        <CardContent className="p-6">
          <div className="mb-6 flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-violet-600" />
            <h2 className="text-lg font-semibold">Desempenho Individual</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b text-left">
                <tr>
                  <th className="pb-4 font-medium">Aluno</th>
                  <th className="pb-4 font-medium">Turma</th>
                  <th className="pb-4 font-medium">Média</th>
                  <th className="pb-4 font-medium">Moedas</th>
                  <th className="pb-4 font-medium">Ranking</th>
                  <th className="pb-4 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {performanceData.map((data) => (
                  <tr key={data.studentId}>
                    <td className="py-4">{data.studentName}</td>
                    <td className="py-4">{data.class}</td>
                    <td className="py-4">{data.averageGrade.toFixed(1)}</td>
                    <td className="py-4">{data.totalCoins}</td>
                    <td className="py-4">#{data.ranking}</td>
                    <td className="py-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl"
                      >
                        Ver Detalhes
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}