import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { 
  Coins,
  DollarSign,
  Zap,
  BookOpen,
} from "lucide-react";
import { useState } from "react";

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
  onUpdateConfig?: (disciplinaId: string, precoMoedas: number, pontosDisponiveis: number) => void;
}

export function ConfigMoedasProfessor({ 
  disciplinas = [],
  onUpdateConfig,
}: ConfigMoedasProps) {
  const [tempValues, setTempValues] = useState<Record<string, { preco: number; pontos: number }>>({});

  // Estatísticas gerais
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
          const values = tempValues[disciplina.id] || {
            preco: disciplina.precoMoedas,
            pontos: disciplina.pontosDisponiveis,
          };

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
                    <Input
                      type="number"
                      min="0"
                      value={values.pontos}
                      onChange={(e) =>
                        setTempValues((prev) => ({
                          ...prev,
                          [disciplina.id]: {
                            ...values,
                            pontos: Number(e.target.value),
                          },
                        }))
                      }
                      className="h-10 rounded-lg bg-white"
                    />
                  </div>

                  <div className="rounded-xl border border-violet-100 bg-white px-4 py-3">
                    <p className="text-xs font-medium text-violet-700 mb-1">Preço</p>
                    <div className="relative">
                      <Coins className="h-4 w-4 text-violet-600 absolute left-3 top-1/2 -translate-y-1/2" />
                      <Input
                        type="number"
                        min="1"
                        value={values.preco}
                        onChange={(e) =>
                          setTempValues((prev) => ({
                            ...prev,
                            [disciplina.id]: {
                              ...values,
                              preco: Number(e.target.value),
                            },
                          }))
                        }
                        className="h-10 rounded-lg pl-9"
                      />
                    </div>
                  </div>

                  <Button
                    className="w-full rounded-xl bg-violet-600 hover:bg-violet-700"
                    onClick={() => onUpdateConfig?.(disciplina.id, values.preco, values.pontos)}
                  >
                    Salvar alterações
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}