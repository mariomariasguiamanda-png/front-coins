import { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Badge } from "@/components/ui/badge";
import {
  Coins,
  Save,
  Plus,
  Edit,
  Search,
  BookOpen,
  Award,
  Calculator,
  Trophy,
} from "lucide-react";

interface AtividadeMoedas {
  id: number;
  nome: string;
  tipo: "exercicio" | "prova" | "projeto" | "participacao";
  disciplina: string;
  moedasBase: number;
  multiplicadorNota: number;
  bonusPerfeito: number;
  status: "ativa" | "inativa";
  dataLimite?: string;
}

const mockAtividades: AtividadeMoedas[] = [
  {
    id: 1,
    nome: "Lista de Exercícios - Funções",
    tipo: "exercicio",
    disciplina: "Matemática",
    moedasBase: 10,
    multiplicadorNota: 1.5,
    bonusPerfeito: 5,
    status: "ativa",
    dataLimite: "2024-10-15",
  },
  {
    id: 2,
    nome: "Prova P1 - Matemática",
    tipo: "prova",
    disciplina: "Matemática",
    moedasBase: 25,
    multiplicadorNota: 2.0,
    bonusPerfeito: 15,
    status: "ativa",
    dataLimite: "2024-10-20",
  },
  {
    id: 3,
    nome: "Projeto - Revolução Industrial",
    tipo: "projeto",
    disciplina: "História",
    moedasBase: 30,
    multiplicadorNota: 2.5,
    bonusPerfeito: 20,
    status: "ativa",
    dataLimite: "2024-11-01",
  },
  {
    id: 4,
    nome: "Participação em Aula",
    tipo: "participacao",
    disciplina: "Física",
    moedasBase: 5,
    multiplicadorNota: 1.0,
    bonusPerfeito: 2,
    status: "ativa",
  },
];

export default function MoedasPorAtividade() {
  const [atividades, setAtividades] =
    useState<AtividadeMoedas[]>(mockAtividades);
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [disciplinaFiltro, setDisciplinaFiltro] = useState<string>("todas");
  const [editandoAtividade, setEditandoAtividade] = useState<number | null>(
    null
  );

  const disciplinas = Array.from(new Set(atividades.map((a) => a.disciplina)));
  const tipos = ["exercicio", "prova", "projeto", "participacao"];

  const getTipoColor = (tipo: string) => {
    const colors = {
      exercicio: "bg-blue-100 text-blue-800 border-blue-200",
      prova: "bg-red-100 text-red-800 border-red-200",
      projeto: "bg-purple-100 text-purple-800 border-purple-200",
      participacao: "bg-green-100 text-green-800 border-green-200",
    };
    return colors[tipo as keyof typeof colors] || colors.exercicio;
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "exercicio":
        return <BookOpen className="h-4 w-4" />;
      case "prova":
        return <Award className="h-4 w-4" />;
      case "projeto":
        return <Trophy className="h-4 w-4" />;
      case "participacao":
        return <Calculator className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    return status === "ativa"
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-gray-100 text-gray-800 border-gray-200";
  };

  const calcularMoedasExemplo = (atividade: AtividadeMoedas, nota: number) => {
    const moedasNota =
      atividade.moedasBase + nota * atividade.multiplicadorNota;
    const bonus = nota === 10 ? atividade.bonusPerfeito : 0;
    return Math.round(moedasNota + bonus);
  };

  const atividadesFiltradas = atividades.filter((atividade) => {
    const filtroTipoOk =
      filtroTipo === "todos" || atividade.tipo === filtroTipo;
    const filtroDisciplinaOk =
      disciplinaFiltro === "todas" || atividade.disciplina === disciplinaFiltro;
    return filtroTipoOk && filtroDisciplinaOk;
  });

  const handleSalvarAtividade = (id: number) => {
    setEditandoAtividade(null);
    // Simulação de salvamento
    console.log("Atividade salva:", id);
  };

  const handleAdicionarAtividade = () => {
    const novaAtividade: AtividadeMoedas = {
      id: Date.now(),
      nome: "Nova Atividade",
      tipo: "exercicio",
      disciplina: disciplinas[0] || "Matemática",
      moedasBase: 10,
      multiplicadorNota: 1.0,
      bonusPerfeito: 5,
      status: "ativa",
    };
    setAtividades([...atividades, novaAtividade]);
    setEditandoAtividade(novaAtividade.id);
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho da seção */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
            <Coins className="h-6 w-6" />
            💰 Moedas por Atividade
          </h2>
          <p className="text-white/80">
            Configure a quantidade de moedas que cada atividade distribui aos
            alunos.
          </p>
        </div>
        <Button
          onClick={handleAdicionarAtividade}
          className="bg-white/20 hover:bg-white/30 text-white border-white/30"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova atividade
        </Button>
      </div>

      {/* Filtros */}
      <Card className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-white/60" />
              <Input
                placeholder="Buscar atividades..."
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <select
                value={disciplinaFiltro}
                onChange={(e) => setDisciplinaFiltro(e.target.value)}
                className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm"
              >
                <option value="todas">Todas disciplinas</option>
                {disciplinas.map((disciplina) => (
                  <option key={disciplina} value={disciplina}>
                    {disciplina}
                  </option>
                ))}
              </select>
              {["todos", ...tipos].map((tipo) => (
                <Button
                  key={tipo}
                  variant={filtroTipo === tipo ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setFiltroTipo(tipo)}
                  className={
                    filtroTipo === tipo
                      ? "bg-white/20 text-white border-white/30"
                      : "bg-transparent border-white/20 text-white/80 hover:bg-white/10"
                  }
                >
                  {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de atividades */}
      <div className="grid gap-4">
        {atividadesFiltradas.map((atividade) => (
          <Card
            key={atividade.id}
            className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-2 rounded-lg bg-white/10">
                    {getTipoIcon(atividade.tipo)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-white">
                        {atividade.nome}
                      </h3>
                      <Badge
                        className={`text-xs ${getTipoColor(atividade.tipo)}`}
                      >
                        {atividade.tipo}
                      </Badge>
                      <Badge
                        className={`text-xs ${getStatusBadge(
                          atividade.status
                        )}`}
                      >
                        {atividade.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-white/70 mb-3">
                      <span>{atividade.disciplina}</span>
                      {atividade.dataLimite && (
                        <>
                          <span>•</span>
                          <span>
                            Prazo:{" "}
                            {new Date(atividade.dataLimite).toLocaleDateString(
                              "pt-BR"
                            )}
                          </span>
                        </>
                      )}
                    </div>

                    {editandoAtividade === atividade.id ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
                        <div>
                          <Label className="text-white/80 text-xs">
                            Moedas Base
                          </Label>
                          <Input
                            type="number"
                            value={atividade.moedasBase}
                            className="bg-white/10 border-white/20 text-white text-sm"
                            onChange={(e) => {
                              const newValue = parseInt(e.target.value) || 0;
                              setAtividades((prev) =>
                                prev.map((a) =>
                                  a.id === atividade.id
                                    ? { ...a, moedasBase: newValue }
                                    : a
                                )
                              );
                            }}
                          />
                        </div>
                        <div>
                          <Label className="text-white/80 text-xs">
                            Multiplicador por Nota
                          </Label>
                          <Input
                            type="number"
                            step="0.1"
                            value={atividade.multiplicadorNota}
                            className="bg-white/10 border-white/20 text-white text-sm"
                            onChange={(e) => {
                              const newValue = parseFloat(e.target.value) || 0;
                              setAtividades((prev) =>
                                prev.map((a) =>
                                  a.id === atividade.id
                                    ? { ...a, multiplicadorNota: newValue }
                                    : a
                                )
                              );
                            }}
                          />
                        </div>
                        <div>
                          <Label className="text-white/80 text-xs">
                            Bônus Nota 10
                          </Label>
                          <Input
                            type="number"
                            value={atividade.bonusPerfeito}
                            className="bg-white/10 border-white/20 text-white text-sm"
                            onChange={(e) => {
                              const newValue = parseInt(e.target.value) || 0;
                              setAtividades((prev) =>
                                prev.map((a) =>
                                  a.id === atividade.id
                                    ? { ...a, bonusPerfeito: newValue }
                                    : a
                                )
                              );
                            }}
                          />
                        </div>
                        <div className="md:col-span-3 flex gap-2 justify-end">
                          <Button
                            size="sm"
                            onClick={() => handleSalvarAtividade(atividade.id)}
                            className="bg-green-500/20 text-green-300 border-green-300/30 hover:bg-green-500/30"
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Salvar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditandoAtividade(null)}
                            className="bg-transparent border-white/20 text-white/80 hover:bg-white/10"
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-white/5 rounded-lg">
                          <div className="text-yellow-400 font-bold">
                            {atividade.moedasBase}
                          </div>
                          <div className="text-xs text-white/60">Base</div>
                        </div>
                        <div className="text-center p-3 bg-white/5 rounded-lg">
                          <div className="text-blue-400 font-bold">
                            ×{atividade.multiplicadorNota}
                          </div>
                          <div className="text-xs text-white/60">
                            Multiplicador
                          </div>
                        </div>
                        <div className="text-center p-3 bg-white/5 rounded-lg">
                          <div className="text-green-400 font-bold">
                            +{atividade.bonusPerfeito}
                          </div>
                          <div className="text-xs text-white/60">Bônus 10</div>
                        </div>
                        <div className="text-center p-3 bg-white/5 rounded-lg">
                          <div className="text-purple-400 font-bold">
                            {calcularMoedasExemplo(atividade, 8)}
                          </div>
                          <div className="text-xs text-white/60">
                            Exemplo (nota 8)
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-transparent border-white/20 text-white/80 hover:bg-white/10"
                    onClick={() => setEditandoAtividade(atividade.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Calculadora de moedas */}
      <Card className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Simulador de Moedas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center">
            {[5, 6, 7, 8, 9, 10].map((nota) => (
              <div
                key={nota}
                className="p-3 bg-white/5 rounded-lg border border-white/10"
              >
                <div className="font-semibold text-white mb-2">Nota {nota}</div>
                <div className="space-y-1 text-sm">
                  {tipos.map((tipo) => {
                    const atividadeExemplo = atividades.find(
                      (a) => a.tipo === tipo
                    );
                    if (!atividadeExemplo) return null;
                    return (
                      <div key={tipo} className="flex justify-between">
                        <span className="text-white/60 capitalize">
                          {tipo}:
                        </span>
                        <span className="text-yellow-400 font-medium">
                          {calcularMoedasExemplo(atividadeExemplo, nota)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-white">
              {atividades.length}
            </div>
            <div className="text-sm text-white/70">Total de atividades</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {atividades.filter((a) => a.status === "ativa").length}
            </div>
            <div className="text-sm text-white/70">Ativas</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {Math.round(
                atividades.reduce((acc, a) => acc + a.moedasBase, 0) /
                  atividades.length
              )}
            </div>
            <div className="text-sm text-white/70">Média base</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">
              {Math.max(...atividades.map((a) => calcularMoedasExemplo(a, 10)))}
            </div>
            <div className="text-sm text-white/70">Máximo possível</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
