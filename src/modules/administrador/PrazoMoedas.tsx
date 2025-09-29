import { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Save,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react";

interface ConfigPrazo {
  id: string;
  nome: string;
  prazoMeses: number;
  notificacaoPrevia: number;
  aplicarA: "todas" | "disciplinas_especificas";
  disciplinasEspecificas?: string[];
  ativo: boolean;
}

const mockConfiguracoes: ConfigPrazo[] = [
  {
    id: "default",
    nome: "Configuração Padrão",
    prazoMeses: 6,
    notificacaoPrevia: 30,
    aplicarA: "todas",
    ativo: true,
  },
  {
    id: "exatas",
    nome: "Disciplinas Exatas",
    prazoMeses: 12,
    notificacaoPrevia: 60,
    aplicarA: "disciplinas_especificas",
    disciplinasEspecificas: ["Matemática", "Física", "Química"],
    ativo: false,
  },
  {
    id: "humanas",
    nome: "Disciplinas Humanas",
    prazoMeses: 4,
    notificacaoPrevia: 15,
    aplicarA: "disciplinas_especificas",
    disciplinasEspecificas: ["História", "Geografia", "Filosofia"],
    ativo: false,
  },
];

interface EstatisticaMoedas {
  totalMoedas: number;
  moedasVencendo: number;
  moedasVencidas: number;
  proximoVencimento: string;
}

const mockEstatisticas: EstatisticaMoedas = {
  totalMoedas: 15420,
  moedasVencendo: 1250,
  moedasVencidas: 380,
  proximoVencimento: "2024-10-15",
};

export default function PrazoMoedas() {
  const [configuracoes, setConfiguracoes] =
    useState<ConfigPrazo[]>(mockConfiguracoes);
  const [configAtiva, setConfigAtiva] = useState<string>("default");
  const [estatisticas] = useState<EstatisticaMoedas>(mockEstatisticas);

  const handleSalvarConfiguracao = () => {
    console.log("Configurações de prazo salvas");
  };

  const handleAtivarConfig = (id: string) => {
    setConfiguracoes((prev) =>
      prev.map((config) => ({
        ...config,
        ativo: config.id === id,
      }))
    );
    setConfigAtiva(id);
  };

  const configuracaoAtual = configuracoes.find((c) => c.id === configAtiva);

  const calcularDataVencimento = (prazoMeses: number) => {
    const data = new Date();
    data.setMonth(data.getMonth() + prazoMeses);
    return data.toLocaleDateString("pt-BR");
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho da seção */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
            <Clock className="h-6 w-6" />⏰ Prazo das Moedas
          </h2>
          <p className="text-white/80">
            Configure a validade das moedas ganhas pelos alunos.
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

      {/* Alertas de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl bg-blue-500/10 border border-blue-300/20">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-blue-400" />
              <span className="text-2xl font-bold text-blue-400">
                {estatisticas.totalMoedas.toLocaleString()}
              </span>
            </div>
            <div className="text-sm text-blue-300">Moedas ativas</div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl bg-yellow-500/10 border border-yellow-300/20">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              <span className="text-2xl font-bold text-yellow-400">
                {estatisticas.moedasVencendo.toLocaleString()}
              </span>
            </div>
            <div className="text-sm text-yellow-300">Vencendo em 30 dias</div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl bg-red-500/10 border border-red-300/20">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-red-400" />
              <span className="text-2xl font-bold text-red-400">
                {estatisticas.moedasVencidas.toLocaleString()}
              </span>
            </div>
            <div className="text-sm text-red-300">Moedas vencidas</div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl bg-purple-500/10 border border-purple-300/20">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-purple-400" />
              <span className="text-sm font-bold text-purple-400">
                {new Date(estatisticas.proximoVencimento).toLocaleDateString(
                  "pt-BR"
                )}
              </span>
            </div>
            <div className="text-sm text-purple-300">Próximo vencimento</div>
          </CardContent>
        </Card>
      </div>

      {/* Seleção de configuração */}
      <Card className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {configuracoes.map((config) => (
              <Button
                key={config.id}
                variant={configAtiva === config.id ? "primary" : "outline"}
                size="sm"
                onClick={() => setConfigAtiva(config.id)}
                className={
                  configAtiva === config.id
                    ? "bg-white/20 text-white border-white/30"
                    : "bg-transparent border-white/20 text-white/80 hover:bg-white/10"
                }
              >
                {config.nome}
                {config.ativo && (
                  <Badge className="ml-2 bg-green-100 text-green-800 border-green-200 text-xs">
                    Ativo
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Configuração detalhada */}
      {configuracaoAtual && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulário de configuração */}
          <Card className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Configurar: {configuracaoAtual.nome}
              </h3>

              <div className="space-y-4">
                <div>
                  <Label className="text-white/80">Nome da Configuração</Label>
                  <Input
                    value={configuracaoAtual.nome}
                    className="bg-white/10 border-white/20 text-white"
                    onChange={(e) => {
                      setConfiguracoes((prev) =>
                        prev.map((c) =>
                          c.id === configAtiva
                            ? { ...c, nome: e.target.value }
                            : c
                        )
                      );
                    }}
                  />
                </div>

                <div>
                  <Label className="text-white/80">
                    Prazo de Validade (meses)
                  </Label>
                  <Input
                    type="number"
                    value={configuracaoAtual.prazoMeses}
                    className="bg-white/10 border-white/20 text-white"
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 1;
                      setConfiguracoes((prev) =>
                        prev.map((c) =>
                          c.id === configAtiva ? { ...c, prazoMeses: value } : c
                        )
                      );
                    }}
                  />
                  <div className="text-xs text-white/60 mt-1">
                    Vencimento:{" "}
                    {calcularDataVencimento(configuracaoAtual.prazoMeses)}
                  </div>
                </div>

                <div>
                  <Label className="text-white/80">
                    Notificação Prévia (dias)
                  </Label>
                  <Input
                    type="number"
                    value={configuracaoAtual.notificacaoPrevia}
                    className="bg-white/10 border-white/20 text-white"
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 1;
                      setConfiguracoes((prev) =>
                        prev.map((c) =>
                          c.id === configAtiva
                            ? { ...c, notificacaoPrevia: value }
                            : c
                        )
                      );
                    }}
                  />
                </div>

                <div>
                  <Label className="text-white/80">Aplicar À</Label>
                  <select
                    value={configuracaoAtual.aplicarA}
                    onChange={(e) => {
                      const value = e.target.value as
                        | "todas"
                        | "disciplinas_especificas";
                      setConfiguracoes((prev) =>
                        prev.map((c) =>
                          c.id === configAtiva ? { ...c, aplicarA: value } : c
                        )
                      );
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
                  >
                    <option value="todas">Todas as disciplinas</option>
                    <option value="disciplinas_especificas">
                      Disciplinas específicas
                    </option>
                  </select>
                </div>

                {configuracaoAtual.aplicarA === "disciplinas_especificas" && (
                  <div>
                    <Label className="text-white/80">
                      Disciplinas Selecionadas
                    </Label>
                    <div className="mt-2 space-y-2">
                      {configuracaoAtual.disciplinasEspecificas?.map(
                        (disciplina, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-white/5 rounded-lg"
                          >
                            <span className="text-white/80 text-sm">
                              {disciplina}
                            </span>
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
                              Aplicado
                            </Badge>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4">
                  <Button
                    onClick={() => handleAtivarConfig(configuracaoAtual.id)}
                    className={
                      configuracaoAtual.ativo
                        ? "bg-green-500/20 text-green-300 border-green-300/30"
                        : "bg-blue-500/20 text-blue-300 border-blue-300/30 hover:bg-blue-500/30"
                    }
                  >
                    {configuracaoAtual.ativo
                      ? "Configuração Ativa"
                      : "Ativar Configuração"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview e simulações */}
          <Card className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Info className="h-5 w-5" />
                Simulação de Prazos
              </h3>

              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <h4 className="font-medium text-white mb-3">
                    Exemplo de Cronograma
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/70">Moeda ganha hoje:</span>
                      <span className="text-white">
                        {new Date().toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">
                        Notificação de vencimento:
                      </span>
                      <span className="text-yellow-400">
                        {calcularDataVencimento(
                          configuracaoAtual.prazoMeses -
                            configuracaoAtual.notificacaoPrevia / 30
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Data de vencimento:</span>
                      <span className="text-red-400">
                        {calcularDataVencimento(configuracaoAtual.prazoMeses)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <h4 className="font-medium text-white mb-3">
                    Impacto da Configuração
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-white/80">
                        Moedas válidas por {configuracaoAtual.prazoMeses} meses
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm text-white/80">
                        Alerta {configuracaoAtual.notificacaoPrevia} dias antes
                        do vencimento
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-blue-400" />
                      <span className="text-sm text-white/80">
                        {configuracaoAtual.aplicarA === "todas"
                          ? "Aplicado a todas as disciplinas"
                          : `Aplicado a ${
                              configuracaoAtual.disciplinasEspecificas
                                ?.length || 0
                            } disciplinas`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-300/20">
                  <h4 className="font-medium text-white mb-2">
                    💡 Recomendação
                  </h4>
                  <p className="text-sm text-white/80">
                    Para disciplinas práticas, recomendamos prazos de 3-6 meses.
                    Para disciplinas teóricas, prazos de 6-12 meses são mais
                    adequados.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
