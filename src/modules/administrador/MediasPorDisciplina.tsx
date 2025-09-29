import { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Badge } from "@/components/ui/badge";
import {
  Target,
  Save,
  BookOpen,
  TrendingUp,
  Award,
  AlertTriangle,
} from "lucide-react";

interface MediaDisciplina {
  id: string;
  nome: string;
  mediaMinima: number;
  mediaAtual: number;
  totalAlunos: number;
  alunosAcimaDaMedia: number;
  cor: string;
  ativa: boolean;
}

const mockMedias: MediaDisciplina[] = [
  {
    id: "matematica",
    nome: "Matemática",
    mediaMinima: 7.0,
    mediaAtual: 7.8,
    totalAlunos: 32,
    alunosAcimaDaMedia: 26,
    cor: "#3B82F6",
    ativa: true,
  },
  {
    id: "historia",
    nome: "História",
    mediaMinima: 6.5,
    mediaAtual: 8.2,
    totalAlunos: 30,
    alunosAcimaDaMedia: 28,
    cor: "#F59E0B",
    ativa: true,
  },
  {
    id: "fisica",
    nome: "Física",
    mediaMinima: 7.5,
    mediaAtual: 6.9,
    totalAlunos: 25,
    alunosAcimaDaMedia: 18,
    cor: "#8B5CF6",
    ativa: true,
  },
  {
    id: "portugues",
    nome: "Português",
    mediaMinima: 6.0,
    mediaAtual: 7.5,
    totalAlunos: 35,
    alunosAcimaDaMedia: 30,
    cor: "#EF4444",
    ativa: true,
  },
];

interface ConfigGeral {
  mediaGeralMinima: number;
  bonusPorMedia: number;
  penalizacaoAbaixoMedia: boolean;
  notificarProfessores: boolean;
}

const mockConfigGeral: ConfigGeral = {
  mediaGeralMinima: 7.0,
  bonusPorMedia: 50,
  penalizacaoAbaixoMedia: true,
  notificarProfessores: true,
};

export default function MediasPorDisciplina() {
  const [disciplinas, setDisciplinas] = useState<MediaDisciplina[]>(mockMedias);
  const [configGeral, setConfigGeral] = useState<ConfigGeral>(mockConfigGeral);

  const handleSalvarConfiguracao = () => {
    console.log("Configurações de médias salvas");
  };

  const handleAtualizarMedia = (id: string, novaMedia: number) => {
    setDisciplinas((prev) =>
      prev.map((d) => (d.id === id ? { ...d, mediaMinima: novaMedia } : d))
    );
  };

  const handleToggleAtiva = (id: string) => {
    setDisciplinas((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ativa: !d.ativa } : d))
    );
  };

  const getStatusColor = (disciplina: MediaDisciplina) => {
    if (disciplina.mediaAtual >= disciplina.mediaMinima) {
      return "text-green-400";
    } else if (disciplina.mediaAtual >= disciplina.mediaMinima - 0.5) {
      return "text-yellow-400";
    } else {
      return "text-red-400";
    }
  };

  const getStatusBadge = (disciplina: MediaDisciplina) => {
    if (disciplina.mediaAtual >= disciplina.mediaMinima) {
      return "bg-green-100 text-green-800 border-green-200";
    } else if (disciplina.mediaAtual >= disciplina.mediaMinima - 0.5) {
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    } else {
      return "bg-red-100 text-red-800 border-red-200";
    }
  };

  const getStatusText = (disciplina: MediaDisciplina) => {
    if (disciplina.mediaAtual >= disciplina.mediaMinima) {
      return "Acima da meta";
    } else if (disciplina.mediaAtual >= disciplina.mediaMinima - 0.5) {
      return "Próximo da meta";
    } else {
      return "Abaixo da meta";
    }
  };

  const disciplinasAtivas = disciplinas.filter((d) => d.ativa);
  const mediaGeralTurma =
    disciplinasAtivas.reduce((acc, d) => acc + d.mediaAtual, 0) /
    disciplinasAtivas.length;
  const disciplinasAcimaDaMeta = disciplinasAtivas.filter(
    (d) => d.mediaAtual >= d.mediaMinima
  ).length;

  return (
    <div className="space-y-6">
      {/* Cabeçalho da seção */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
            <Target className="h-6 w-6" />
            🎯 Médias por Disciplina
          </h2>
          <p className="text-white/80">
            Configure a média mínima necessária para ganhar moedas em cada
            disciplina.
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

      {/* Configurações gerais */}
      <Card className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Award className="h-5 w-5" />
            Configurações Gerais
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-white/80">
                  Média Geral Mínima da Instituição
                </Label>
                <Input
                  type="number"
                  step="0.1"
                  value={configGeral.mediaGeralMinima}
                  className="bg-white/10 border-white/20 text-white"
                  onChange={(e) =>
                    setConfigGeral((prev) => ({
                      ...prev,
                      mediaGeralMinima: parseFloat(e.target.value) || 0,
                    }))
                  }
                />
                <div className="text-xs text-white/60 mt-1">
                  Média mínima para ter direito a ganhar moedas
                </div>
              </div>

              <div>
                <Label className="text-white/80">
                  Bônus por Média Alta (em moedas)
                </Label>
                <Input
                  type="number"
                  value={configGeral.bonusPorMedia}
                  className="bg-white/10 border-white/20 text-white"
                  onChange={(e) =>
                    setConfigGeral((prev) => ({
                      ...prev,
                      bonusPorMedia: parseInt(e.target.value) || 0,
                    }))
                  }
                />
                <div className="text-xs text-white/60 mt-1">
                  Moedas extras para alunos com média acima de 8.0
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div>
                  <div className="text-white text-sm">
                    Penalizar abaixo da média
                  </div>
                  <div className="text-white/60 text-xs">
                    Alunos abaixo da média ganham 50% menos moedas
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() =>
                    setConfigGeral((prev) => ({
                      ...prev,
                      penalizacaoAbaixoMedia: !prev.penalizacaoAbaixoMedia,
                    }))
                  }
                  className={
                    configGeral.penalizacaoAbaixoMedia
                      ? "bg-orange-500/20 text-orange-300 border-orange-300/30"
                      : "bg-gray-500/20 text-gray-300 border-gray-300/30"
                  }
                >
                  {configGeral.penalizacaoAbaixoMedia
                    ? "Ativado"
                    : "Desativado"}
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div>
                  <div className="text-white text-sm">
                    Notificar professores
                  </div>
                  <div className="text-white/60 text-xs">
                    Enviar alertas quando média da turma estiver baixa
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() =>
                    setConfigGeral((prev) => ({
                      ...prev,
                      notificarProfessores: !prev.notificarProfessores,
                    }))
                  }
                  className={
                    configGeral.notificarProfessores
                      ? "bg-blue-500/20 text-blue-300 border-blue-300/30"
                      : "bg-gray-500/20 text-gray-300 border-gray-300/30"
                  }
                >
                  {configGeral.notificarProfessores ? "Ativado" : "Desativado"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Médias por disciplina */}
      <Card className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Configuração por Disciplina
          </h3>

          <div className="grid gap-4">
            {disciplinas.map((disciplina) => (
              <div
                key={disciplina.id}
                className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: `${disciplina.cor}20` }}
                    >
                      <BookOpen
                        className="h-5 w-5"
                        style={{ color: disciplina.cor }}
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-white">
                          {disciplina.nome}
                        </h4>
                        <Badge
                          className={`text-xs ${getStatusBadge(disciplina)}`}
                        >
                          {getStatusText(disciplina)}
                        </Badge>
                        {!disciplina.ativa && (
                          <Badge className="bg-gray-100 text-gray-800 border-gray-200 text-xs">
                            Inativa
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <Label className="text-white/80 text-xs">
                            Média Mínima
                          </Label>
                          <Input
                            type="number"
                            step="0.1"
                            value={disciplina.mediaMinima}
                            className="bg-white/10 border-white/20 text-white text-sm mt-1"
                            onChange={(e) =>
                              handleAtualizarMedia(
                                disciplina.id,
                                parseFloat(e.target.value) || 0
                              )
                            }
                          />
                        </div>

                        <div className="text-center">
                          <div className="text-xs text-white/60 mb-1">
                            Média Atual
                          </div>
                          <div
                            className={`text-lg font-bold ${getStatusColor(
                              disciplina
                            )}`}
                          >
                            {disciplina.mediaAtual.toFixed(1)}
                          </div>
                        </div>

                        <div className="text-center">
                          <div className="text-xs text-white/60 mb-1">
                            Alunos
                          </div>
                          <div className="text-lg font-bold text-white">
                            {disciplina.totalAlunos}
                          </div>
                        </div>

                        <div className="text-center">
                          <div className="text-xs text-white/60 mb-1">
                            Acima da Meta
                          </div>
                          <div className="text-lg font-bold text-green-400">
                            {disciplina.alunosAcimaDaMedia}
                            <span className="text-sm text-white/60">
                              /{disciplina.totalAlunos}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="text-sm text-white/70">
                          Taxa de aproveitamento:{" "}
                          {(
                            (disciplina.alunosAcimaDaMedia /
                              disciplina.totalAlunos) *
                            100
                          ).toFixed(1)}
                          %
                        </div>

                        {disciplina.mediaAtual < disciplina.mediaMinima && (
                          <div className="flex items-center gap-1 text-red-400 text-sm">
                            <AlertTriangle className="h-4 w-4" />
                            <span>Atenção necessária</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => handleToggleAtiva(disciplina.id)}
                    className={
                      disciplina.ativa
                        ? "bg-green-500/20 text-green-300 border-green-300/30"
                        : "bg-gray-500/20 text-gray-300 border-gray-300/30"
                    }
                  >
                    {disciplina.ativa ? "Ativa" : "Inativa"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
          <CardContent className="p-4 text-center">
            <div
              className={`text-2xl font-bold ${
                mediaGeralTurma >= configGeral.mediaGeralMinima
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {mediaGeralTurma.toFixed(1)}
            </div>
            <div className="text-sm text-white/70">Média geral</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">
              {disciplinasAcimaDaMeta}
            </div>
            <div className="text-sm text-white/70">Disciplinas na meta</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">
              {configGeral.bonusPorMedia}
            </div>
            <div className="text-sm text-white/70">Bônus por média alta</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {(
                (disciplinasAcimaDaMeta / disciplinasAtivas.length) *
                100
              ).toFixed(0)}
              %
            </div>
            <div className="text-sm text-white/70">Taxa de sucesso</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
