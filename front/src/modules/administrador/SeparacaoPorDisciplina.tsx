import { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import {
  Layers,
  Save,
  ToggleLeft,
  BookOpen,
  ArrowRight,
  Info,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface ConfigSeparacao {
  separacaoAtiva: boolean;
  permitirTransferencia: boolean;
  taxaTransferencia: number;
  disciplinasComSeparacao: string[];
}

interface DisciplinaMoedas {
  id: string;
  nome: string;
  moedasDisponiveis: number;
  moedasGastas: number;
  cor: string;
  ativa: boolean;
}

const mockConfig: ConfigSeparacao = {
  separacaoAtiva: true,
  permitirTransferencia: true,
  taxaTransferencia: 10,
  disciplinasComSeparacao: ["Matemática", "História", "Física"],
};

const mockDisciplinasMoedas: DisciplinaMoedas[] = [
  {
    id: "matematica",
    nome: "Matemática",
    moedasDisponiveis: 1250,
    moedasGastas: 380,
    cor: "#3B82F6",
    ativa: true,
  },
  {
    id: "historia",
    nome: "História",
    moedasDisponiveis: 890,
    moedasGastas: 210,
    cor: "#F59E0B",
    ativa: true,
  },
  {
    id: "fisica",
    nome: "Física",
    moedasDisponiveis: 675,
    moedasGastas: 145,
    cor: "#8B5CF6",
    ativa: true,
  },
  {
    id: "portugues",
    nome: "Português",
    moedasDisponiveis: 1100,
    moedasGastas: 320,
    cor: "#EF4444",
    ativa: false,
  },
];

export default function SeparacaoPorDisciplina() {
  const [config, setConfig] = useState<ConfigSeparacao>(mockConfig);
  const [disciplinasMoedas, setDisciplinasMoedas] = useState<
    DisciplinaMoedas[]
  >(mockDisciplinasMoedas);

  const handleToggleSeparacao = () => {
    setConfig((prev) => ({ ...prev, separacaoAtiva: !prev.separacaoAtiva }));
  };

  const handleToggleTransferencia = () => {
    setConfig((prev) => ({
      ...prev,
      permitirTransferencia: !prev.permitirTransferencia,
    }));
  };

  const handleToggleDisciplina = (disciplinaId: string) => {
    setDisciplinasMoedas((prev) =>
      prev.map((d) => (d.id === disciplinaId ? { ...d, ativa: !d.ativa } : d))
    );
  };

  const handleSalvarConfiguracao = () => {
    console.log("Configurações de separação salvas");
  };

  const totalMoedasAtivas = disciplinasMoedas
    .filter((d) => d.ativa)
    .reduce((acc, d) => acc + d.moedasDisponiveis, 0);

  const totalMoedasGastas = disciplinasMoedas.reduce(
    (acc, d) => acc + d.moedasGastas,
    0
  );

  return (
    <div className="space-y-6">
      {/* Cabeçalho da seção */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
            <Layers className="h-6 w-6" />
            📊 Separação por Disciplina
          </h2>
          <p className="text-white/80">
            Configure se as moedas serão separadas por disciplina ou
            compartilhadas.
          </p>
        </div>
        <Button
          onClick={handleSalvarConfiguracao}
          className="bg-green-500/20 text-green-300 border-green-300/30 hover:bg-green-500/30"
        >
          <Save className="h-4 w-4 mr-2" />
          Salvar configurações
        </Button>
      </div>

      {/* Configuração principal */}
      <Card className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <ToggleLeft className="h-5 w-5" />
                Modo de Separação
              </h3>
              <p className="text-white/70 text-sm">
                {config.separacaoAtiva
                  ? "As moedas são separadas por disciplina - alunos só podem gastar moedas da disciplina onde as ganharam."
                  : "As moedas são compartilhadas - alunos podem gastar moedas de qualquer disciplina em qualquer lugar."}
              </p>
            </div>
            <Button
              onClick={handleToggleSeparacao}
              className={
                config.separacaoAtiva
                  ? "bg-green-500/20 text-green-300 border-green-300/30 hover:bg-green-500/30"
                  : "bg-gray-500/20 text-gray-300 border-gray-300/30 hover:bg-gray-500/30"
              }
            >
              {config.separacaoAtiva ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Separação Ativa
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  Separação Inativa
                </>
              )}
            </Button>
          </div>

          {/* Configurações avançadas (só aparecem se separação estiver ativa) */}
          {config.separacaoAtiva && (
            <div className="border-t border-white/10 pt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-white mb-3">
                    Transferência entre Disciplinas
                  </h4>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <div className="text-white text-sm">
                        Permitir transferência de moedas
                      </div>
                      <div className="text-white/60 text-xs">
                        Alunos podem transferir moedas entre disciplinas
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={handleToggleTransferencia}
                      className={
                        config.permitirTransferencia
                          ? "bg-blue-500/20 text-blue-300 border-blue-300/30"
                          : "bg-gray-500/20 text-gray-300 border-gray-300/30"
                      }
                    >
                      {config.permitirTransferencia ? "Ativado" : "Desativado"}
                    </Button>
                  </div>

                  {config.permitirTransferencia && (
                    <div className="mt-4 p-4 bg-white/5 rounded-lg">
                      <div className="text-white text-sm mb-2">
                        Taxa de Transferência
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="0"
                          max="50"
                          value={config.taxaTransferencia}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              taxaTransferencia: parseInt(e.target.value),
                            }))
                          }
                          className="flex-1"
                        />
                        <span className="text-white text-sm w-12 text-right">
                          {config.taxaTransferencia}%
                        </span>
                      </div>
                      <div className="text-white/60 text-xs mt-1">
                        Ex: Para transferir 100 moedas, o aluno pagará{" "}
                        {config.taxaTransferencia} moedas de taxa
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-medium text-white mb-3">Como Funciona</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-blue-500/10 rounded-lg border border-blue-300/20">
                      <BookOpen className="h-5 w-5 text-blue-400 flex-shrink-0" />
                      <div className="text-sm text-blue-300">
                        Aluno ganha moedas em Matemática
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <ArrowRight className="h-4 w-4 text-white/40" />
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg border border-green-300/20">
                      <Layers className="h-5 w-5 text-green-400 flex-shrink-0" />
                      <div className="text-sm text-green-300">
                        {config.separacaoAtiva
                          ? "Moedas ficam separadas por disciplina"
                          : "Moedas vão para carteira geral"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status das disciplinas */}
      <Card className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Status por Disciplina
          </h3>

          <div className="grid gap-4">
            {disciplinasMoedas.map((disciplina) => (
              <div
                key={disciplina.id}
                className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: disciplina.cor }}
                  />
                  <div>
                    <h4 className="font-medium text-white">
                      {disciplina.nome}
                    </h4>
                    <div className="flex items-center gap-4 text-sm text-white/70">
                      <span>
                        {disciplina.moedasDisponiveis.toLocaleString()}{" "}
                        disponíveis
                      </span>
                      <span>•</span>
                      <span>
                        {disciplina.moedasGastas.toLocaleString()} gastas
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-white font-semibold">
                      {(
                        (disciplina.moedasDisponiveis /
                          (disciplina.moedasDisponiveis +
                            disciplina.moedasGastas)) *
                        100
                      ).toFixed(1)}
                      %
                    </div>
                    <div className="text-xs text-white/60">Taxa disponível</div>
                  </div>

                  {config.separacaoAtiva && (
                    <Button
                      size="sm"
                      onClick={() => handleToggleDisciplina(disciplina.id)}
                      className={
                        disciplina.ativa
                          ? "bg-green-500/20 text-green-300 border-green-300/30"
                          : "bg-red-500/20 text-red-300 border-red-300/30"
                      }
                    >
                      {disciplina.ativa ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Separada
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 mr-1" />
                          Compartilhada
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas resumidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-white">
              {disciplinasMoedas.length}
            </div>
            <div className="text-sm text-white/70">Total disciplinas</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {config.separacaoAtiva
                ? disciplinasMoedas.filter((d) => d.ativa).length
                : "N/A"}
            </div>
            <div className="text-sm text-white/70">Com separação</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">
              {totalMoedasAtivas.toLocaleString()}
            </div>
            <div className="text-sm text-white/70">Moedas disponíveis</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">
              {config.permitirTransferencia
                ? `${config.taxaTransferencia}%`
                : "0%"}
            </div>
            <div className="text-sm text-white/70">Taxa transferência</div>
          </CardContent>
        </Card>
      </div>

      {/* Informações importantes */}
      <Card className="rounded-2xl bg-blue-500/10 border border-blue-300/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-300 mb-2">
                💡 Dica Importante
              </h4>
              <p className="text-sm text-blue-200">
                A separação por disciplina incentiva os alunos a se dedicarem em
                todas as matérias, mas pode limitar a flexibilidade de uso das
                moedas. Considere o perfil da sua instituição ao escolher essa
                configuração.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
