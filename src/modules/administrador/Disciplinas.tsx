import { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Save,
  Search,
  Calculator,
  Book,
  Beaker,
  Globe,
  Palette,
} from "lucide-react";

interface Disciplina {
  id: number;
  nome: string;
  codigo: string;
  area: "exatas" | "humanas" | "biologicas" | "linguagens";
  cargaHoraria: number;
  ativa: boolean;
  cor: string;
  professor?: string;
}

const mockDisciplinas: Disciplina[] = [
  {
    id: 1,
    nome: "Matemática",
    codigo: "MAT01",
    area: "exatas",
    cargaHoraria: 120,
    ativa: true,
    cor: "#3B82F6",
    professor: "Prof. Ana Silva",
  },
  {
    id: 2,
    nome: "Português",
    codigo: "POR01",
    area: "linguagens",
    cargaHoraria: 100,
    ativa: true,
    cor: "#EF4444",
    professor: "Prof. João Santos",
  },
  {
    id: 3,
    nome: "História",
    codigo: "HIS01",
    area: "humanas",
    cargaHoraria: 80,
    ativa: true,
    cor: "#F59E0B",
    professor: "Prof. Maria Oliveira",
  },
  {
    id: 4,
    nome: "Física",
    codigo: "FIS01",
    area: "exatas",
    cargaHoraria: 100,
    ativa: true,
    cor: "#8B5CF6",
    professor: "Prof. Pedro Costa",
  },
  {
    id: 5,
    nome: "Biologia",
    codigo: "BIO01",
    area: "biologicas",
    cargaHoraria: 80,
    ativa: false,
    cor: "#10B981",
    professor: "Prof. Lucas Ferreira",
  },
];

export default function Disciplinas() {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>(mockDisciplinas);
  const [filtroArea, setFiltroArea] = useState<string>("todas");
  const [editandoDisciplina, setEditandoDisciplina] = useState<number | null>(
    null
  );
  const [novaDisciplina, setNovaDisciplina] = useState<Partial<Disciplina>>({});

  const areas = ["exatas", "humanas", "biologicas", "linguagens"];

  const getAreaIcon = (area: string) => {
    switch (area) {
      case "exatas":
        return <Calculator className="h-4 w-4" />;
      case "humanas":
        return <Globe className="h-4 w-4" />;
      case "biologicas":
        return <Beaker className="h-4 w-4" />;
      case "linguagens":
        return <Book className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const getAreaColor = (area: string) => {
    const colors = {
      exatas: "bg-blue-100 text-blue-800 border-blue-200",
      humanas: "bg-orange-100 text-orange-800 border-orange-200",
      biologicas: "bg-green-100 text-green-800 border-green-200",
      linguagens: "bg-purple-100 text-purple-800 border-purple-200",
    };
    return colors[area as keyof typeof colors] || colors.exatas;
  };

  const disciplinasFiltradas =
    filtroArea === "todas"
      ? disciplinas
      : disciplinas.filter((d) => d.area === filtroArea);

  const handleAdicionarDisciplina = () => {
    const nova: Disciplina = {
      id: Date.now(),
      nome: "Nova Disciplina",
      codigo: "NOV01",
      area: "exatas",
      cargaHoraria: 60,
      ativa: true,
      cor: "#6B7280",
    };
    setDisciplinas([...disciplinas, nova]);
    setEditandoDisciplina(nova.id);
  };

  const handleSalvarDisciplina = (id: number) => {
    setEditandoDisciplina(null);
    console.log("Disciplina salva:", id);
  };

  const handleExcluirDisciplina = (id: number) => {
    setDisciplinas((prev) => prev.filter((d) => d.id !== id));
  };

  const handleToggleAtiva = (id: number) => {
    setDisciplinas((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ativa: !d.ativa } : d))
    );
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho da seção */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            📚 Disciplinas
          </h2>
          <p className="text-white/80">
            Gerencie as disciplinas oferecidas pela sua instituição.
          </p>
        </div>
        <Button
          onClick={handleAdicionarDisciplina}
          className="bg-white/20 hover:bg-white/30 text-white border-white/30"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova disciplina
        </Button>
      </div>

      {/* Filtros e busca */}
      <Card className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-white/60" />
              <Input
                placeholder="Buscar disciplinas..."
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
            </div>
            <div className="flex gap-2">
              {["todas", ...areas].map((area) => (
                <Button
                  key={area}
                  variant={filtroArea === area ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setFiltroArea(area)}
                  className={
                    filtroArea === area
                      ? "bg-white/20 text-white border-white/30"
                      : "bg-transparent border-white/20 text-white/80 hover:bg-white/10"
                  }
                >
                  {area.charAt(0).toUpperCase() + area.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de disciplinas */}
      <div className="grid gap-4">
        {disciplinasFiltradas.map((disciplina) => (
          <Card
            key={disciplina.id}
            className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${disciplina.cor}20` }}
                  >
                    {getAreaIcon(disciplina.area)}
                  </div>
                  <div className="flex-1">
                    {editandoDisciplina === disciplina.id ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-white/80 text-sm">
                              Nome da Disciplina
                            </Label>
                            <Input
                              value={disciplina.nome}
                              className="bg-white/10 border-white/20 text-white"
                              onChange={(e) => {
                                setDisciplinas((prev) =>
                                  prev.map((d) =>
                                    d.id === disciplina.id
                                      ? { ...d, nome: e.target.value }
                                      : d
                                  )
                                );
                              }}
                            />
                          </div>
                          <div>
                            <Label className="text-white/80 text-sm">
                              Código
                            </Label>
                            <Input
                              value={disciplina.codigo}
                              className="bg-white/10 border-white/20 text-white"
                              onChange={(e) => {
                                setDisciplinas((prev) =>
                                  prev.map((d) =>
                                    d.id === disciplina.id
                                      ? { ...d, codigo: e.target.value }
                                      : d
                                  )
                                );
                              }}
                            />
                          </div>
                          <div>
                            <Label className="text-white/80 text-sm">
                              Área
                            </Label>
                            <select
                              value={disciplina.area}
                              onChange={(e) => {
                                setDisciplinas((prev) =>
                                  prev.map((d) =>
                                    d.id === disciplina.id
                                      ? { ...d, area: e.target.value as any }
                                      : d
                                  )
                                );
                              }}
                              className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm"
                            >
                              {areas.map((area) => (
                                <option key={area} value={area}>
                                  {area.charAt(0).toUpperCase() + area.slice(1)}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <Label className="text-white/80 text-sm">
                              Carga Horária
                            </Label>
                            <Input
                              type="number"
                              value={disciplina.cargaHoraria}
                              className="bg-white/10 border-white/20 text-white"
                              onChange={(e) => {
                                setDisciplinas((prev) =>
                                  prev.map((d) =>
                                    d.id === disciplina.id
                                      ? {
                                          ...d,
                                          cargaHoraria:
                                            parseInt(e.target.value) || 0,
                                        }
                                      : d
                                  )
                                );
                              }}
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() =>
                              handleSalvarDisciplina(disciplina.id)
                            }
                            className="bg-green-500/20 text-green-300 border-green-300/30 hover:bg-green-500/30"
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Salvar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditandoDisciplina(null)}
                            className="bg-transparent border-white/20 text-white/80 hover:bg-white/10"
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-white">
                            {disciplina.nome}
                          </h3>
                          <Badge className="bg-gray-100 text-gray-800 border-gray-200 text-xs">
                            {disciplina.codigo}
                          </Badge>
                          <Badge
                            className={`text-xs ${getAreaColor(
                              disciplina.area
                            )}`}
                          >
                            {disciplina.area}
                          </Badge>
                          <Badge
                            className={
                              disciplina.ativa
                                ? "bg-green-100 text-green-800 border-green-200 text-xs"
                                : "bg-red-100 text-red-800 border-red-200 text-xs"
                            }
                          >
                            {disciplina.ativa ? "Ativa" : "Inativa"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-white/70 mb-3">
                          <span>
                            {disciplina.cargaHoraria}h de carga horária
                          </span>
                          {disciplina.professor && (
                            <>
                              <span>•</span>
                              <span>{disciplina.professor}</span>
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {editandoDisciplina !== disciplina.id && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-transparent border-white/20 text-white/80 hover:bg-white/10"
                      onClick={() => setEditandoDisciplina(disciplina.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleAtiva(disciplina.id)}
                      className={
                        disciplina.ativa
                          ? "bg-transparent border-yellow-300/20 text-yellow-300 hover:bg-yellow-500/10"
                          : "bg-transparent border-green-300/20 text-green-300 hover:bg-green-500/10"
                      }
                    >
                      {disciplina.ativa ? "Desativar" : "Ativar"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-transparent border-red-300/20 text-red-300 hover:bg-red-500/10"
                      onClick={() => handleExcluirDisciplina(disciplina.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-white">
              {disciplinas.length}
            </div>
            <div className="text-sm text-white/70">Total de disciplinas</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {disciplinas.filter((d) => d.ativa).length}
            </div>
            <div className="text-sm text-white/70">Disciplinas ativas</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">
              {Math.round(
                disciplinas.reduce((acc, d) => acc + d.cargaHoraria, 0) /
                  disciplinas.length
              )}
              h
            </div>
            <div className="text-sm text-white/70">Carga média</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">
              {areas.length}
            </div>
            <div className="text-sm text-white/70">Áreas do conhecimento</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
