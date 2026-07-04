import { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Save,
  Settings,
  School,
  Building,
  BookOpen,
} from "lucide-react";

interface ModeloEnsino {
  id: string;
  nome: string;
  descricao: string;
  ativo: boolean;
  configuracoes: {
    seriesDisponiveis: string[];
    disciplinasObrigatorias: string[];
    cargaHorariaMinima: number;
  };
}

const mockModelos: ModeloEnsino[] = [
  {
    id: "fundamental",
    nome: "Ensino Fundamental",
    descricao: "1º ao 9º ano - Formação básica",
    ativo: false,
    configuracoes: {
      seriesDisponiveis: [
        "1º ano",
        "2º ano",
        "3º ano",
        "4º ano",
        "5º ano",
        "6º ano",
        "7º ano",
        "8º ano",
        "9º ano",
      ],
      disciplinasObrigatorias: [
        "Português",
        "Matemática",
        "História",
        "Geografia",
        "Ciências",
      ],
      cargaHorariaMinima: 800,
    },
  },
  {
    id: "medio",
    nome: "Ensino Médio",
    descricao: "1º ao 3º ano - Preparação para vestibular",
    ativo: true,
    configuracoes: {
      seriesDisponiveis: ["1º ano", "2º ano", "3º ano"],
      disciplinasObrigatorias: [
        "Português",
        "Matemática",
        "História",
        "Geografia",
        "Física",
        "Química",
        "Biologia",
      ],
      cargaHorariaMinima: 1000,
    },
  },
  {
    id: "tecnico",
    nome: "Ensino Técnico",
    descricao: "Cursos técnicos profissionalizantes",
    ativo: false,
    configuracoes: {
      seriesDisponiveis: ["1º módulo", "2º módulo", "3º módulo", "4º módulo"],
      disciplinasObrigatorias: [
        "Português",
        "Matemática",
        "Disciplinas Técnicas",
      ],
      cargaHorariaMinima: 1200,
    },
  },
  {
    id: "personalizado",
    nome: "Modelo Personalizado",
    descricao: "Configuração customizada pela instituição",
    ativo: false,
    configuracoes: {
      seriesDisponiveis: ["Série A", "Série B", "Série C"],
      disciplinasObrigatorias: ["Disciplina 1", "Disciplina 2"],
      cargaHorariaMinima: 600,
    },
  },
];

export default function ModeloEnsino() {
  const [modelos, setModelos] = useState<ModeloEnsino[]>(mockModelos);
  const [modeloSelecionado, setModeloSelecionado] = useState<string>("medio");

  const getModeloIcon = (id: string) => {
    switch (id) {
      case "fundamental":
        return <School className="h-5 w-5" />;
      case "medio":
        return <GraduationCap className="h-5 w-5" />;
      case "tecnico":
        return <Building className="h-5 w-5" />;
      case "personalizado":
        return <Settings className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  const handleAtivarModelo = (id: string) => {
    setModelos((prev) =>
      prev.map((modelo) => ({
        ...modelo,
        ativo: modelo.id === id,
      }))
    );
    setModeloSelecionado(id);
  };

  const modeloAtivo = modelos.find((m) => m.ativo);

  return (
    <div className="space-y-6">
      {/* Cabeçalho da seção */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
            <GraduationCap className="h-6 w-6" />
            🎓 Modelo de Ensino
          </h2>
          <p className="text-white/80">
            Configure o modelo educacional da sua instituição.
          </p>
        </div>
        <Button className="bg-green-500/20 text-green-300 border-green-300/30 hover:bg-green-500/30">
          <Save className="h-4 w-4 mr-2" />
          Salvar configurações
        </Button>
      </div>

      {/* Seleção de modelos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {modelos.map((modelo) => (
          <Card
            key={modelo.id}
            className={`rounded-2xl transition-all ${
              modelo.ativo
                ? "bg-white/20 border-white/40 ring-2 ring-white/30"
                : "bg-white/5 border-white/10"
            }`}
          >
            <CardContent className="p-6 text-center">
              <div
                className={`mx-auto mb-4 p-3 rounded-full ${
                  modelo.ativo ? "bg-white/30" : "bg-white/10"
                }`}
              >
                {getModeloIcon(modelo.id)}
              </div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <h3 className="font-semibold text-white">{modelo.nome}</h3>
                {modelo.ativo && (
                  <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                    Ativo
                  </Badge>
                )}
              </div>
              <p className="text-sm text-white/70 mb-4">{modelo.descricao}</p>
              <Button
                size="sm"
                onClick={() => handleAtivarModelo(modelo.id)}
                variant={modelo.ativo ? "primary" : "outline"}
                className={
                  modelo.ativo
                    ? "bg-green-500/20 text-green-300 border-green-300/30 hover:bg-green-500/30"
                    : "bg-transparent border-white/20 text-white/80 hover:bg-white/10"
                }
              >
                {modelo.ativo ? "Ativo" : "Ativar"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Configurações do modelo ativo */}
      {modeloAtivo && (
        <Card className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configurações: {modeloAtivo.nome}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Séries disponíveis */}
              <div>
                <h4 className="font-medium text-white mb-3">
                  Séries/Anos Disponíveis
                </h4>
                <div className="space-y-2">
                  {modeloAtivo.configuracoes.seriesDisponiveis.map(
                    (serie, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-white/5 rounded-lg"
                      >
                        <span className="text-white/80 text-sm">{serie}</span>
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
                          Ativo
                        </Badge>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Disciplinas obrigatórias */}
              <div>
                <h4 className="font-medium text-white mb-3">
                  Disciplinas Obrigatórias
                </h4>
                <div className="space-y-2">
                  {modeloAtivo.configuracoes.disciplinasObrigatorias.map(
                    (disciplina, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-white/5 rounded-lg"
                      >
                        <span className="text-white/80 text-sm">
                          {disciplina}
                        </span>
                        <Badge className="bg-purple-100 text-purple-800 border-purple-200 text-xs">
                          Obrigatória
                        </Badge>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Configurações gerais */}
              <div>
                <h4 className="font-medium text-white mb-3">
                  Configurações Gerais
                </h4>
                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-lg">
                    <div className="text-sm text-white/70 mb-1">
                      Carga Horária Mínima
                    </div>
                    <div className="text-xl font-bold text-white">
                      {modeloAtivo.configuracoes.cargaHorariaMinima}h
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 rounded-lg">
                    <div className="text-sm text-white/70 mb-1">
                      Total de Séries
                    </div>
                    <div className="text-xl font-bold text-white">
                      {modeloAtivo.configuracoes.seriesDisponiveis.length}
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 rounded-lg">
                    <div className="text-sm text-white/70 mb-1">
                      Disciplinas Base
                    </div>
                    <div className="text-xl font-bold text-white">
                      {modeloAtivo.configuracoes.disciplinasObrigatorias.length}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resumo das configurações */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-white">
              {modelos.filter((m) => m.ativo).length}
            </div>
            <div className="text-sm text-white/70">Modelo ativo</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">
              {modeloAtivo?.configuracoes.seriesDisponiveis.length || 0}
            </div>
            <div className="text-sm text-white/70">Séries configuradas</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">
              {modeloAtivo?.configuracoes.disciplinasObrigatorias.length || 0}
            </div>
            <div className="text-sm text-white/70">Disciplinas base</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {modeloAtivo?.configuracoes.cargaHorariaMinima || 0}h
            </div>
            <div className="text-sm text-white/70">Carga horária</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
