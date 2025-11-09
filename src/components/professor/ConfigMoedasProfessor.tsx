import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { 
  Coins, 
  History, 
  Settings,
  TrendingUp,
  DollarSign,
  Zap,
  BookOpen,
  Check,
  AlertCircle,
  Info
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
  onUpdateConfig: (disciplinaId: string, precoMoedas: number, pontosDisponiveis: number) => void;
  historico?: Array<{
    id: string;
    disciplina: string;
    alteracao: string;
    usuario: string;
    data: string;
  }>;
}

export function ConfigMoedasProfessor({ 
  disciplinas = [], 
  onUpdateConfig,
  historico = []
}: ConfigMoedasProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempValues, setTempValues] = useState<Record<string, { preco: number; pontos: number }>>({});

  const handleEdit = (disciplina: any) => {
    setEditingId(disciplina.id);
    setTempValues({
      ...tempValues,
      [disciplina.id]: {
        preco: disciplina.precoMoedas,
        pontos: disciplina.pontosDisponiveis
      }
    });
  };

  const handleCancel = (id: string) => {
    setEditingId(null);
    const newValues = { ...tempValues };
    delete newValues[id];
    setTempValues(newValues);
  };

  const handleSave = (id: string) => {
    const values = tempValues[id];
    if (values) {
      onUpdateConfig(id, values.preco, values.pontos);
      setEditingId(null);
    }
  };

  // Estatísticas gerais
  const stats = {
    totalDisciplinas: disciplinas.length,
    precoMedio: disciplinas.length > 0 
      ? (disciplinas.reduce((acc, d) => acc + d.precoMoedas, 0) / disciplinas.length).toFixed(1)
      : "0.0",
    totalPontos: disciplinas.reduce((acc, d) => acc + d.pontosDisponiveis, 0),
    totalMoedas: disciplinas.reduce((acc, d) => acc + (d.moedasCirculacao || 0), 0),
  };

  const getColorClass = (cor?: string) => {
    const colors: Record<string, string> = {
      azul: "bg-blue-100 border-blue-200",
      verde: "bg-green-100 border-green-200",
      roxo: "bg-purple-100 border-purple-200",
      laranja: "bg-orange-100 border-orange-200",
      rosa: "bg-pink-100 border-pink-200",
      amarelo: "bg-yellow-100 border-yellow-200",
    };
    return colors[cor || "azul"] || colors.azul;
  };

  const getIconColor = (cor?: string) => {
    const colors: Record<string, string> = {
      azul: "text-blue-600",
      verde: "text-green-600",
      roxo: "text-purple-600",
      laranja: "text-orange-600",
      rosa: "text-pink-600",
      amarelo: "text-yellow-600",
    };
    return colors[cor || "azul"] || colors.azul;
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configuração de Pontos</h1>
          <p className="text-gray-600 mt-1">Defina o preço em moedas e pontos disponíveis por disciplina</p>
        </div>
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
          <Settings className="h-6 w-6 text-white" />
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="rounded-xl shadow-sm border-l-4 border-l-violet-500">
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

        <Card className="rounded-xl shadow-sm border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Preço Médio</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.precoMedio}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Coins className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Pontos</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalPontos}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Zap className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Moedas em Circulação</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalMoedas}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info Box */}
      <Card className="rounded-xl shadow-sm border-l-4 border-l-blue-400 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900 mb-1">Como funciona?</p>
              <p className="text-sm text-blue-800">
                O <strong>preço em moedas</strong> define quantas moedas os alunos precisam gastar para obter 1 ponto na disciplina. 
                Os <strong>pontos disponíveis</strong> são o total de pontos que podem ser trocados por moedas nesta disciplina.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid de Disciplinas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {disciplinas.map((disciplina) => {
          const isEditing = editingId === disciplina.id;
          const values = tempValues[disciplina.id] || { 
            preco: disciplina.precoMoedas, 
            pontos: disciplina.pontosDisponiveis 
          };

          return (
            <Card 
              key={disciplina.id} 
              className={`rounded-xl shadow-sm hover:shadow-md transition-shadow ${
                isEditing ? 'border-2 border-violet-300' : ''
              }`}
            >
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-12 w-12 rounded-xl ${getColorClass(disciplina.cor)} border-2 flex items-center justify-center`}>
                      <BookOpen className={`h-6 w-6 ${getIconColor(disciplina.cor)}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-base">{disciplina.nome}</h3>
                      {disciplina.totalAlunos && (
                        <p className="text-xs text-gray-500">{disciplina.totalAlunos} alunos</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Coins className="h-4 w-4 text-amber-600" />
                      Preço (moedas → 1 ponto)
                    </Label>
                    <Input
                      type="number"
                      min="1"
                      value={values.preco}
                      disabled={!isEditing}
                      onChange={(e) => setTempValues({
                        ...tempValues,
                        [disciplina.id]: { ...values, preco: Number(e.target.value) }
                      })}
                      className={`rounded-xl mt-1 ${!isEditing ? 'bg-gray-50' : ''}`}
                    />
                    {isEditing && (
                      <p className="text-xs text-gray-500 mt-1">
                        Os alunos gastarão {values.preco} moedas por ponto
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-blue-600" />
                      Pontos disponíveis
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      value={values.pontos}
                      disabled={!isEditing}
                      onChange={(e) => setTempValues({
                        ...tempValues,
                        [disciplina.id]: { ...values, pontos: Number(e.target.value) }
                      })}
                      className={`rounded-xl mt-1 ${!isEditing ? 'bg-gray-50' : ''}`}
                    />
                    {isEditing && (
                      <p className="text-xs text-gray-500 mt-1">
                        Total que pode ser convertido em moedas
                      </p>
                    )}
                  </div>

                  {disciplina.moedasCirculacao !== undefined && !isEditing && (
                    <div className="pt-3 border-t">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Em circulação:</span>
                        <span className="font-semibold text-green-700 flex items-center gap-1">
                          <Coins className="h-4 w-4" />
                          {disciplina.moedasCirculacao}
                        </span>
                      </div>
                    </div>
                  )}

                  {isEditing ? (
                    <div className="flex gap-2 pt-2">
                      <Button 
                        onClick={() => handleSave(disciplina.id)}
                        className="flex-1 rounded-xl bg-violet-600 hover:bg-violet-700"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Salvar
                      </Button>
                      <Button 
                        onClick={() => handleCancel(disciplina.id)}
                        variant="outline"
                        className="rounded-xl"
                      >
                        Cancelar
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      onClick={() => handleEdit(disciplina)}
                      variant="outline"
                      className="w-full rounded-xl"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Editar Configuração
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Histórico de Alterações */}
      {historico.length > 0 && (
        <Card className="rounded-xl shadow-sm">
          <CardContent className="p-6">
            <div className="mb-6 flex items-center gap-3">
              <History className="h-5 w-5 text-violet-600" />
              <h2 className="text-lg font-semibold text-gray-900">Histórico de Alterações</h2>
              <span className="text-sm text-gray-500 ml-auto">
                {historico.length} {historico.length === 1 ? 'registro' : 'registros'}
              </span>
            </div>

            <div className="space-y-3">
              {historico.map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div className="h-10 w-10 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
                      <Settings className="h-5 w-5 text-violet-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">{item.disciplina}</p>
                      <p className="text-sm text-gray-600 mt-0.5">{item.alteracao}</p>
                      <p className="text-xs text-gray-500 mt-1">Por: {item.usuario}</p>
                    </div>
                  </div>
                  <div className="text-right ml-4 flex-shrink-0">
                    <p className="text-xs text-gray-500">
                      {new Date(item.data).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(item.data).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}