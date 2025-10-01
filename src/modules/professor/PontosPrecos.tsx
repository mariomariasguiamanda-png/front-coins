import { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Badge } from "@/components/ui/badge";
import {
  Medal,
  Save,
  Plus,
  Edit,
  Trash2,
  Coins,
  Target,
  Gift,
} from "lucide-react";

interface PrecoItem {
  id: number;
  nome: string;
  categoria: "recompensa" | "beneficio" | "premium";
  custo: number;
  descricao: string;
  disponivel: boolean;
  disciplina: string;
}

interface ConfigPontos {
  disciplina: string;
  pontosAtividade: number;
  pontosProva: number;
  pontosParticipacao: number;
  bonusMedia: number;
}

const mockPrecos: PrecoItem[] = [
  {
    id: 1,
    nome: "Material Extra",
    categoria: "beneficio",
    custo: 50,
    descricao: "Acesso a exercícios extras",
    disponivel: true,
    disciplina: "Matemática",
  },
  {
    id: 2,
    nome: "Revisão Personalizada",
    categoria: "premium",
    custo: 100,
    descricao: "Sessão de revisão individual",
    disponivel: true,
    disciplina: "Matemática",
  },
  {
    id: 3,
    nome: "Certificado de Mérito",
    categoria: "recompensa",
    custo: 200,
    descricao: "Certificado de excelência",
    disponivel: true,
    disciplina: "História",
  },
];

const mockConfigPontos: ConfigPontos[] = [
  {
    disciplina: "Matemática",
    pontosAtividade: 10,
    pontosProva: 25,
    pontosParticipacao: 5,
    bonusMedia: 50,
  },
  {
    disciplina: "História",
    pontosAtividade: 8,
    pontosProva: 20,
    pontosParticipacao: 4,
    bonusMedia: 40,
  },
  {
    disciplina: "Física",
    pontosAtividade: 12,
    pontosProva: 30,
    pontosParticipacao: 6,
    bonusMedia: 60,
  },
];

export default function PontosPrecos() {
  const [precos, setPrecos] = useState<PrecoItem[]>(mockPrecos);
  const [configPontos, setConfigPontos] =
    useState<ConfigPontos[]>(mockConfigPontos);
  const [disciplinaAtiva, setDisciplinaAtiva] = useState<string>("Matemática");
  const [editandoPreco, setEditandoPreco] = useState<number | null>(null);

  const disciplinas = Array.from(
    new Set(configPontos.map((c) => c.disciplina))
  );

  const getCategoriaColor = (categoria: string) => {
    const colors = {
      recompensa: "bg-yellow-100 text-yellow-800 border-yellow-200",
      beneficio: "bg-blue-100 text-blue-800 border-blue-200",
      premium: "bg-purple-100 text-purple-800 border-purple-200",
    };
    return colors[categoria as keyof typeof colors] || colors.beneficio;
  };

  const getCategoriaIcon = (categoria: string) => {
    switch (categoria) {
      case "recompensa":
        return <Gift className="h-4 w-4" />;
      case "beneficio":
        return <Target className="h-4 w-4" />;
      case "premium":
        return <Medal className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  const precosFiltrados = precos.filter(
    (p) => p.disciplina === disciplinaAtiva
  );
  const configAtual = configPontos.find(
    (c) => c.disciplina === disciplinaAtiva
  );

  const handleSalvarConfig = () => {
    // Simulação de salvamento
    console.log("Configurações salvas para", disciplinaAtiva);
  };

  const handleAdicionarPreco = () => {
    const novoPreco: PrecoItem = {
      id: Date.now(),
      nome: "Novo Item",
      categoria: "beneficio",
      custo: 25,
      descricao: "Descrição do item",
      disponivel: true,
      disciplina: disciplinaAtiva,
    };
    setPrecos([...precos, novoPreco]);
    setEditandoPreco(novoPreco.id);
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho da seção */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
            <Medal className="h-6 w-6" />
            🏆 Pontos & Preços
          </h2>
          <p className="text-white/80">
            Configure pontuações por atividade e gerencie o catálogo de
            recompensas.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleSalvarConfig}
            className="bg-green-500/20 text-green-300 border-green-300/30 hover:bg-green-500/30"
          >
            <Save className="h-4 w-4 mr-2" />
            Salvar configurações
          </Button>
        </div>
      </div>

      {/* Seletor de disciplinas */}
      <Card className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {disciplinas.map((disciplina) => (
              <Button
                key={disciplina}
                variant={disciplinaAtiva === disciplina ? "primary" : "outline"}
                size="sm"
                onClick={() => setDisciplinaAtiva(disciplina)}
                className={
                  disciplinaAtiva === disciplina
                    ? "bg-white/20 text-white border-white/30"
                    : "bg-transparent border-white/20 text-white/80 hover:bg-white/10"
                }
              >
                {disciplina}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuração de pontos */}
        <Card className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Coins className="h-5 w-5" />
              <h3 className="text-lg font-semibold text-white">
                Configuração de Pontos
              </h3>
            </div>

            {configAtual && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white/80">
                      Pontos por Atividade
                    </Label>
                    <Input
                      type="number"
                      value={configAtual.pontosAtividade}
                      className="bg-white/10 border-white/20 text-white"
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value) || 0;
                        setConfigPontos((prev) =>
                          prev.map((c) =>
                            c.disciplina === disciplinaAtiva
                              ? { ...c, pontosAtividade: newValue }
                              : c
                          )
                        );
                      }}
                    />
                  </div>
                  <div>
                    <Label className="text-white/80">Pontos por Prova</Label>
                    <Input
                      type="number"
                      value={configAtual.pontosProva}
                      className="bg-white/10 border-white/20 text-white"
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value) || 0;
                        setConfigPontos((prev) =>
                          prev.map((c) =>
                            c.disciplina === disciplinaAtiva
                              ? { ...c, pontosProva: newValue }
                              : c
                          )
                        );
                      }}
                    />
                  </div>
                  <div>
                    <Label className="text-white/80">
                      Pontos por Participação
                    </Label>
                    <Input
                      type="number"
                      value={configAtual.pontosParticipacao}
                      className="bg-white/10 border-white/20 text-white"
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value) || 0;
                        setConfigPontos((prev) =>
                          prev.map((c) =>
                            c.disciplina === disciplinaAtiva
                              ? { ...c, pontosParticipacao: newValue }
                              : c
                          )
                        );
                      }}
                    />
                  </div>
                  <div>
                    <Label className="text-white/80">Bônus Média 8+</Label>
                    <Input
                      type="number"
                      value={configAtual.bonusMedia}
                      className="bg-white/10 border-white/20 text-white"
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value) || 0;
                        setConfigPontos((prev) =>
                          prev.map((c) =>
                            c.disciplina === disciplinaAtiva
                              ? { ...c, bonusMedia: newValue }
                              : c
                          )
                        );
                      }}
                    />
                  </div>
                </div>

                {/* Simulador de pontos */}
                <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
                  <h4 className="font-semibold text-white mb-3">
                    Simulador de Pontos
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-white/70">
                      5 atividades:{" "}
                      <span className="text-white font-medium">
                        {configAtual.pontosAtividade * 5} pts
                      </span>
                    </div>
                    <div className="text-white/70">
                      2 provas:{" "}
                      <span className="text-white font-medium">
                        {configAtual.pontosProva * 2} pts
                      </span>
                    </div>
                    <div className="text-white/70">
                      10 participações:{" "}
                      <span className="text-white font-medium">
                        {configAtual.pontosParticipacao * 10} pts
                      </span>
                    </div>
                    <div className="text-white/70">
                      Bônus média:{" "}
                      <span className="text-white font-medium">
                        {configAtual.bonusMedia} pts
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <div className="font-semibold text-green-400">
                      Total estimado:{" "}
                      {configAtual.pontosAtividade * 5 +
                        configAtual.pontosProva * 2 +
                        configAtual.pontosParticipacao * 10 +
                        configAtual.bonusMedia}{" "}
                      pontos
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Catálogo de preços */}
        <Card className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                <h3 className="text-lg font-semibold text-white">
                  Catálogo de Recompensas
                </h3>
              </div>
              <Button
                size="sm"
                onClick={handleAdicionarPreco}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
            </div>

            <div className="space-y-3">
              {precosFiltrados.map((item) => (
                <Card
                  key={item.id}
                  className="rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="p-1.5 rounded-lg bg-white/10">
                          {getCategoriaIcon(item.categoria)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-white">
                              {item.nome}
                            </h4>
                            <Badge
                              className={`text-xs ${getCategoriaColor(
                                item.categoria
                              )}`}
                            >
                              {item.categoria}
                            </Badge>
                          </div>
                          <p className="text-sm text-white/70 mb-2">
                            {item.descricao}
                          </p>
                          <div className="flex items-center gap-4">
                            <span className="text-yellow-400 font-semibold">
                              {item.custo} pts
                            </span>
                            <Badge
                              className={
                                item.disponivel
                                  ? "bg-green-100 text-green-800 border-green-200"
                                  : "bg-gray-100 text-gray-800 border-gray-200"
                              }
                            >
                              {item.disponivel ? "Disponível" : "Indisponível"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-transparent border-white/20 text-white/80 hover:bg-white/10"
                          onClick={() => setEditandoPreco(item.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-transparent border-red-300/20 text-red-300 hover:bg-red-500/10"
                          onClick={() =>
                            setPrecos((prev) =>
                              prev.filter((p) => p.id !== item.id)
                            )
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estatísticas gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-white">
              {precosFiltrados.length}
            </div>
            <div className="text-sm text-white/70">Itens disponíveis</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {Math.min(...precosFiltrados.map((p) => p.custo))}
            </div>
            <div className="text-sm text-white/70">Menor preço</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {Math.max(...precosFiltrados.map((p) => p.custo))}
            </div>
            <div className="text-sm text-white/70">Maior preço</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {Math.round(
                precosFiltrados.reduce((acc, p) => acc + p.custo, 0) /
                  precosFiltrados.length
              )}
            </div>
            <div className="text-sm text-white/70">Preço médio</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
