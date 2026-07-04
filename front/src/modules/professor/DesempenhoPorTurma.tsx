import { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Users,
  BookOpen,
  Award,
  BarChart3,
  PieChart,
  Calendar,
} from "lucide-react";

interface TurmaStats {
  id: string;
  nome: string;
  disciplina: string;
  totalAlunos: number;
  mediaGeral: number;
  aprovacoes: number;
  reprovacoes: number;
  moedas: number;
}

interface DesempenhoMes {
  mes: string;
  media: number;
  participacao: number;
}

const mockTurmas: TurmaStats[] = [
  {
    id: "MAT101",
    nome: "Matemática - Turma A",
    disciplina: "Matemática",
    totalAlunos: 32,
    mediaGeral: 7.8,
    aprovacoes: 28,
    reprovacoes: 4,
    moedas: 1250,
  },
  {
    id: "HIS201",
    nome: "História - Turma B",
    disciplina: "História",
    totalAlunos: 28,
    mediaGeral: 8.2,
    aprovacoes: 26,
    reprovacoes: 2,
    moedas: 890,
  },
  {
    id: "FIS301",
    nome: "Física - Turma C",
    disciplina: "Física",
    totalAlunos: 25,
    mediaGeral: 6.9,
    aprovacoes: 18,
    reprovacoes: 7,
    moedas: 675,
  },
];

const mockDesempenhoMensal: DesempenhoMes[] = [
  { mes: "Jan", media: 7.2, participacao: 85 },
  { mes: "Fev", media: 7.5, participacao: 88 },
  { mes: "Mar", media: 7.8, participacao: 90 },
  { mes: "Abr", media: 7.6, participacao: 87 },
  { mes: "Mai", media: 8.1, participacao: 92 },
  { mes: "Jun", media: 7.9, participacao: 89 },
];

export default function DesempenhoPorTurma() {
  const [turmas] = useState<TurmaStats[]>(mockTurmas);
  const [turmaAtiva, setTurmaAtiva] = useState<string>(mockTurmas[0].id);
  const [desempenhoMensal] = useState<DesempenhoMes[]>(mockDesempenhoMensal);

  const turmaAtual = turmas.find((t) => t.id === turmaAtiva) || turmas[0];

  const getMediaColor = (media: number) => {
    if (media >= 8) return "text-green-400";
    if (media >= 7) return "text-yellow-400";
    return "text-red-400";
  };

  const getTaxaAprovacao = (turma: TurmaStats) => {
    return ((turma.aprovacoes / turma.totalAlunos) * 100).toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho da seção */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            📊 Desempenho por Turma
          </h2>
          <p className="text-white/80">
            Analise gráficos de desempenho, evolução e estatísticas das suas
            turmas.
          </p>
        </div>
        <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30">
          <Calendar className="h-4 w-4 mr-2" />
          Relatório mensal
        </Button>
      </div>

      {/* Seletor de turmas */}
      <Card className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {turmas.map((turma) => (
              <Button
                key={turma.id}
                variant={turmaAtiva === turma.id ? "primary" : "outline"}
                size="sm"
                onClick={() => setTurmaAtiva(turma.id)}
                className={
                  turmaAtiva === turma.id
                    ? "bg-white/20 text-white border-white/30"
                    : "bg-transparent border-white/20 text-white/80 hover:bg-white/10"
                }
              >
                {turma.nome}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cards de estatísticas principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Users className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <div className="text-lg font-bold text-white">
                  {turmaAtual.totalAlunos}
                </div>
                <div className="text-sm text-white/70">Total de alunos</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <Award className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <div
                  className={`text-lg font-bold ${getMediaColor(
                    turmaAtual.mediaGeral
                  )}`}
                >
                  {turmaAtual.mediaGeral.toFixed(1)}
                </div>
                <div className="text-sm text-white/70">Média geral</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <BarChart3 className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <div className="text-lg font-bold text-emerald-400">
                  {getTaxaAprovacao(turmaAtual)}%
                </div>
                <div className="text-sm text-white/70">Taxa aprovação</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/20">
                <BookOpen className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <div className="text-lg font-bold text-yellow-400">
                  {turmaAtual.moedas}
                </div>
                <div className="text-sm text-white/70">Moedas ganhas</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos de desempenho */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de evolução mensal */}
        <Card className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-5 w-5" />
              <h3 className="text-lg font-semibold text-white">
                Evolução das Médias
              </h3>
            </div>

            {/* Gráfico simulado com barras CSS */}
            <div className="space-y-3">
              {desempenhoMensal.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-8 text-sm text-white/70">{item.mes}</div>
                  <div className="flex-1 relative">
                    <div className="w-full bg-white/10 rounded-full h-6">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-6 rounded-full flex items-center justify-end pr-2"
                        style={{ width: `${(item.media / 10) * 100}%` }}
                      >
                        <span className="text-xs font-medium text-white">
                          {item.media.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Gráfico de participação */}
        <Card className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <PieChart className="h-5 w-5" />
              <h3 className="text-lg font-semibold text-white">
                Taxa de Participação
              </h3>
            </div>

            {/* Gráfico simulado com barras CSS */}
            <div className="space-y-3">
              {desempenhoMensal.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-8 text-sm text-white/70">{item.mes}</div>
                  <div className="flex-1 relative">
                    <div className="w-full bg-white/10 rounded-full h-6">
                      <div
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-6 rounded-full flex items-center justify-end pr-2"
                        style={{ width: `${item.participacao}%` }}
                      >
                        <span className="text-xs font-medium text-white">
                          {item.participacao}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comparativo entre turmas */}
      <Card className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Comparativo de Turmas
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-3 text-white font-semibold">
                    Turma
                  </th>
                  <th className="text-center p-3 text-white font-semibold">
                    Alunos
                  </th>
                  <th className="text-center p-3 text-white font-semibold">
                    Média
                  </th>
                  <th className="text-center p-3 text-white font-semibold">
                    Aprovação
                  </th>
                  <th className="text-center p-3 text-white font-semibold">
                    Moedas
                  </th>
                </tr>
              </thead>
              <tbody>
                {turmas.map((turma) => (
                  <tr
                    key={turma.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="p-3">
                      <div>
                        <div className="font-medium text-white">
                          {turma.nome}
                        </div>
                        <div className="text-sm text-white/60">
                          {turma.disciplina}
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-center text-white">
                      {turma.totalAlunos}
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`font-bold ${getMediaColor(
                          turma.mediaGeral
                        )}`}
                      >
                        {turma.mediaGeral.toFixed(1)}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                        {getTaxaAprovacao(turma)}%
                      </Badge>
                    </td>
                    <td className="p-3 text-center text-yellow-400 font-semibold">
                      {turma.moedas}
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
