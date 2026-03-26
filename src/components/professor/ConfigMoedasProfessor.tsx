import { Card, CardContent } from "@/components/ui/Card";
import { 
  Coins,
  DollarSign,
  Zap,
  BookOpen,
} from "lucide-react";

interface ConfigMoedasProps {
  disciplinas: Array<{
    id: string;
    nome: string;
    precoMoedas: number;
    pontosDisponiveis: number;
    cor?: string;
    totalAlunos?: number;
    moedasCirculacao?: number;
  }>;
}

export function ConfigMoedasProfessor({ 
  disciplinas = []
}: ConfigMoedasProps) {
  // Estatisticas gerais
  const stats = {
    totalDisciplinas: disciplinas.length,
    precoMedio: disciplinas.length > 0 
      ? (disciplinas.reduce((acc, d) => acc + d.precoMoedas, 0) / disciplinas.length).toFixed(1)
      : "0.0",
    totalPontos: disciplinas.reduce((acc, d) => acc + d.pontosDisponiveis, 0),
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configuração de Pontos</h1>
          <p className="text-gray-600 mt-1">Defina o preço em moedas e pontos disponíveis por disciplina</p>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-xl shadow-sm border border-violet-200 bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Disciplinas</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalDisciplinas}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-violet-100 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-violet-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border border-violet-200 bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Preço Médio</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.precoMedio}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-violet-100 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-violet-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border border-violet-200 bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Pontos</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalPontos}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-violet-100 flex items-center justify-center">
                <Zap className="h-5 w-5 text-violet-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grid de Disciplinas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {disciplinas.map((disciplina) => {
          return (
            <Card key={disciplina.id} className="rounded-xl shadow-sm border border-violet-200 bg-white hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl bg-violet-100 border border-violet-200 flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-violet-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-base">{disciplina.nome}</h3>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="rounded-xl border border-violet-100 bg-violet-50 px-4 py-3">
                    <p className="text-xs font-medium text-violet-700 mb-1">Quantidade de pontos</p>
                    <p className="text-xl font-bold text-gray-900">{disciplina.pontosDisponiveis}</p>
                  </div>

                  <div className="rounded-xl border border-violet-100 bg-white px-4 py-3">
                    <p className="text-xs font-medium text-violet-700 mb-1">Preco</p>
                    <p className="text-xl font-bold text-gray-900 inline-flex items-center gap-1">
                      <Coins className="h-4 w-4 text-violet-600" />
                      {disciplina.precoMoedas}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}