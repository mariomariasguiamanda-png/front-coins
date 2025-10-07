import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { BarChart3, TrendingUp, Award, Calendar } from "lucide-react";

interface DashboardProps {
  aluno: {
    nome: string;
    matricula: string;
    saldoTotal: number;
  };
  moedasPorMes: Array<{ mes: string; valor: number }>;
  rankingTurma: Array<{ posicao: number; nome: string; moedas: number }>;
  proximoPrazo?: string;
}

const Dashboard = ({
  aluno,
  moedasPorMes,
  rankingTurma,
  proximoPrazo,
}: DashboardProps) => {
  return (
    <div className="space-y-6">
      {/* Header de boas-vindas */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Bem-vindo(a), {aluno.nome}!</h2>
          <p className="text-sm text-gray-700">
            Matrícula {aluno.matricula} • Saldo total {aluno.saldoTotal} moedas
          </p>
        </div>
        {proximoPrazo && (
          <div className="hidden sm:flex items-center gap-2 text-xs bg-gray-100 rounded-lg px-3 py-1.5 border border-gray-200">
            <span>Próximo prazo:</span>
            <strong>{proximoPrazo}</strong>
          </div>
        )}
      </div>

      {/* Cartão do aluno */}
      <Card className="rounded-2xl bg-white border border-gray-200">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <div className="rounded-lg bg-white border border-gray-200 p-3">
              <div className="text-gray-600">Aluno</div>
              <div className="font-semibold">{aluno.nome}</div>
            </div>
            <div className="rounded-lg bg-white border border-gray-200 p-3">
              <div className="text-gray-600">Matrícula</div>
              <div className="font-semibold">{aluno.matricula}</div>
            </div>
            <div className="rounded-lg bg-white border border-gray-200 p-3">
              <div className="text-gray-600">Saldo de moedas</div>
              <div className="font-semibold text-amber-300">
                {aluno.saldoTotal}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">
                  Total de Moedas
                </p>
                <p className="text-2xl font-bold text-blue-900">1,234</p>
              </div>
              <Award className="h-8 w-8 text-blue-500" />
            </div>
            <div className="flex items-center mt-2 text-xs text-blue-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% este mês
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">
                  Atividades Concluídas
                </p>
                <p className="text-2xl font-bold text-green-900">28</p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-500" />
            </div>
            <div className="flex items-center mt-2 text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +5 esta semana
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600">
                  Ranking na Turma
                </p>
                <p className="text-2xl font-bold text-amber-900">3º</p>
              </div>
              <Award className="h-8 w-8 text-amber-500" />
            </div>
            <div className="flex items-center mt-2 text-xs text-amber-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              Subiu 2 posições
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">
                  Próximas Atividades
                </p>
                <p className="text-2xl font-bold text-purple-900">4</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
            <div className="flex items-center mt-2 text-xs text-purple-600">
              <Calendar className="h-3 w-3 mr-1" />
              Até sexta-feira
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de desempenho */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Desempenho Semanal</h3>
            <div className="space-y-3">
              {[
                { dia: "Segunda", atividades: 3, moedas: 45 },
                { dia: "Terça", atividades: 5, moedas: 75 },
                { dia: "Quarta", atividades: 2, moedas: 30 },
                { dia: "Quinta", atividades: 4, moedas: 60 },
                { dia: "Sexta", atividades: 6, moedas: 90 },
                { dia: "Sábado", atividades: 1, moedas: 15 },
                { dia: "Domingo", atividades: 2, moedas: 30 },
              ].map((item) => (
                <div
                  key={item.dia}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm font-medium">{item.dia}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-600">
                      {item.atividades} atividades
                    </span>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(item.moedas / 90) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-blue-600">
                      {item.moedas} moedas
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Atividades Recentes</h3>
            <div className="space-y-3">
              {[
                {
                  titulo: "Exercícios de Matemática",
                  disciplina: "Matemática",
                  moedas: 15,
                  status: "concluído",
                },
                {
                  titulo: "Redação sobre História",
                  disciplina: "Português",
                  moedas: 20,
                  status: "concluído",
                },
                {
                  titulo: "Laboratório de Física",
                  disciplina: "Física",
                  moedas: 25,
                  status: "pendente",
                },
                {
                  titulo: "Apresentação de Geografia",
                  disciplina: "Geografia",
                  moedas: 30,
                  status: "pendente",
                },
              ].map((atividade, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium">{atividade.titulo}</p>
                    <p className="text-xs text-gray-600">
                      {atividade.disciplina}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-amber-600">
                      {atividade.moedas} moedas
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        atividade.status === "concluído"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {atividade.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Linha de widgets: desempenho e ranking */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="rounded-2xl bg-white border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Moedas por mês</h3>
              <span className="text-xs text-gray-600">2025</span>
            </div>
            <div className="h-28 flex items-end gap-2">
              {moedasPorMes.slice(0, 8).map((m) => (
                <div
                  key={m.mes}
                  className="flex-1 flex flex-col justify-end items-center gap-1"
                >
                  <div
                    className="w-full rounded-t bg-amber-400/90"
                    style={{ height: `${Math.max(8, m.valor)}px` }}
                  />
                  <span className="text-[10px] text-gray-600">{m.mes}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl bg-white border border-gray-200">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">Ranking da turma</h3>
            <ul className="space-y-1 text-sm">
              {rankingTurma.map((r) => (
                <li
                  key={r.posicao}
                  className={`flex items-center justify-between rounded-lg px-2 py-1 ${
                    r.nome === aluno.nome ? "bg-gray-100" : ""
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-gray-100 text-[10px]">
                      {r.posicao}
                    </span>
                    {r.nome}
                  </span>
                  <span className="text-xs text-gray-600">
                    {r.moedas} moedas
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
