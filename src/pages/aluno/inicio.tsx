import dynamic from "next/dynamic";
import AlunoLayout from "../../components/layout/AlunoLayout";
import { Card, CardContent } from "../../components/ui/Card";
import { TrendingUp, Award, BookOpen, Target } from "lucide-react";

// Dynamic import para componente pesado (gráfico)
const GraficoMoedas = dynamic(
  () => import("../../components/aluno/GraficoMoedas"),
  {
    ssr: false,
    loading: () => (
      <Card className="border border-gray-200 rounded-2xl">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-4 bg-gray-200 rounded w-8"></div>
                  <div className="flex-1 h-3 bg-gray-200 rounded-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    ),
  }
);

export default function Inicio() {
  return (
    <AlunoLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-violet-700">Bem-vindo(a)!</h1>
          <p className="text-gray-600 mt-2">
            Resumo do seu desempenho semanal, moedas e atividades recentes.
          </p>
        </div>

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border border-gray-200 rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total de Moedas
                  </p>
                  <p className="text-2xl font-bold text-violet-700">1,250</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl">
                  <Award className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Atividades Concluídas
                  </p>
                  <p className="text-2xl font-bold text-violet-700">24</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-green-400 to-green-500 rounded-xl">
                  <Target className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Disciplinas Ativas
                  </p>
                  <p className="text-2xl font-bold text-violet-700">7</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Progresso Semanal
                  </p>
                  <p className="text-2xl font-bold text-violet-700">85%</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-violet-400 to-violet-500 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de Evolução de Moedas - Carregamento Dinâmico */}
        <GraficoMoedas />

        {/* Atividades Recentes */}
        <Card className="border border-gray-200 rounded-2xl">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Atividades Recentes
            </h3>
            <div className="space-y-3">
              {[
                {
                  disciplina: "Matemática",
                  atividade: "Equações do 2º Grau",
                  status: "Concluída",
                  moedas: 50,
                },
                {
                  disciplina: "História",
                  atividade: "Revolução Industrial",
                  status: "Pendente",
                  moedas: 30,
                },
                {
                  disciplina: "Biologia",
                  atividade: "Sistema Circulatório",
                  status: "Em Progresso",
                  moedas: 40,
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {item.atividade}
                    </p>
                    <p className="text-sm text-gray-600">{item.disciplina}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === "Concluída"
                          ? "bg-green-100 text-green-700"
                          : item.status === "Pendente"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {item.status}
                    </span>
                    <span className="text-sm font-medium text-yellow-600">
                      +{item.moedas} moedas
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AlunoLayout>
  );
}
