import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  Search,
  Users,
  Clock,
  AlertCircle,
  Award,
  TrendingUp,
  FileText,
  ChevronRight,
  Target,
} from "lucide-react";
import { useState, useEffect } from "react";

interface Discipline {
  id: string;
  name: string;
  code: string;
  description: string;
  workload: number; // horas
  classes: string[]; // turmas que cursam
  totalStudents: number;
  averageGrade: number | null;
  completionRate: number; // %
  status: "active" | "inactive";
}

interface DisciplinasProfessorProps {
  disciplines: Discipline[];
  initialViewCode?: string | null;
}

export function DisciplinasProfessor({
  disciplines = [],
  initialViewCode = null,
}: DisciplinasProfessorProps) {
  const [viewingDiscipline, setViewingDiscipline] = useState<Discipline | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("todas");

  // Abrir modal automaticamente se initialViewCode for passado
  useEffect(() => {
    if (initialViewCode) {
      const discipline = disciplines.find((d) => d.code === initialViewCode);
      if (discipline) {
        setViewingDiscipline(discipline);
      }
    }
  }, [initialViewCode, disciplines]);

  // Filtrar disciplinas
  const filteredDisciplines = disciplines.filter((disc) => {
    const matchesSearch =
      disc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      disc.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      disc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "todas" || disc.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Estatísticas
  const disciplinesComNota = disciplines.filter((d) => d.averageGrade !== null);
  const stats = {
    totalDisciplines: disciplines.length,
    activeDisciplines: disciplines.filter((d) => d.status === "active").length,
    totalStudents: disciplines.reduce((acc, disc) => acc + disc.totalStudents, 0),
    avgGrade:
      disciplinesComNota.length > 0
        ? (
            disciplinesComNota.reduce((acc, disc) => acc + (disc.averageGrade ?? 0), 0) /
            disciplinesComNota.length
          ).toFixed(1)
        : "0.0",
    avgCompletion:
      disciplines.length > 0
        ? Math.round(
            disciplines.reduce((acc, disc) => acc + disc.completionRate, 0) / disciplines.length
          )
        : 0,
  };

  const getStatusConfig = (status: string) => {
    return status === "active"
      ? { label: "Ativa", color: "bg-green-100 text-green-700 border-green-200" }
      : { label: "Inativa", color: "bg-gray-100 text-gray-700 border-gray-200" };
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Disciplinas</h1>
        <p className="text-gray-600 mt-1">Acompanhe o desempenho das suas disciplinas</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-6 md:grid-cols-5">
        <Card className="rounded-xl shadow-sm border-l-4 border-l-violet-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalDisciplines}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-violet-100 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-violet-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ativas</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.activeDisciplines}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Target className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Alunos</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalStudents}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Média</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.avgGrade}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Award className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conclusão</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.avgCompletion}%</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Busca */}
      <Card className="rounded-xl shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar disciplina..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-xl"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="rounded-xl w-full md:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                <SelectItem value="active">Ativas</SelectItem>
                <SelectItem value="inactive">Inativas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Disciplinas */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredDisciplines.length === 0 ? (
          <div className="col-span-full">
            <Card className="rounded-xl shadow-sm">
              <CardContent className="p-12 text-center">
                <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma disciplina encontrada</h3>
                <p className="text-gray-600">
                  {searchTerm || filterStatus !== "todas"
                    ? "Tente ajustar os filtros de busca"
                    : "Você ainda não leciona nenhuma disciplina"}
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredDisciplines.map((disc) => (
            <Card key={disc.id} className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">{disc.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{disc.code}</p>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusConfig(disc.status).color}`}
                    >
                      {getStatusConfig(disc.status).label}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2">{disc.description}</p>

                  <div className="grid grid-cols-3 gap-3 pt-3 border-t">
                    <div>
                      <p className="text-xs text-gray-600">Alunos</p>
                      <p className="text-lg font-bold text-gray-900">{disc.totalStudents}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Média</p>
                      <p className="text-lg font-bold text-gray-900">
                        {disc.averageGrade !== null ? disc.averageGrade.toFixed(1) : "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Conclusão</p>
                      <p className="text-lg font-bold text-gray-900">{disc.completionRate}%</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Clock className="h-3 w-3" />
                    <span>{disc.workload}h</span>
                  </div>

                  <div className="pt-3 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setViewingDiscipline(disc)}
                      className="w-full rounded-xl"
                    >
                      <ChevronRight className="h-4 w-4 mr-1" />
                      Detalhes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Dialog de Detalhes */}
      <Dialog open={!!viewingDiscipline} onOpenChange={(open) => !open && setViewingDiscipline(null)}>
        <DialogContent className="rounded-xl max-w-3xl bg-white max-h-[90vh] overflow-auto">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-violet-100 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-violet-600" />
              </div>
              <div>
                <DialogTitle className="text-2xl text-gray-900">{viewingDiscipline?.name}</DialogTitle>
                <p className="text-sm text-gray-600 mt-1">{viewingDiscipline?.code}</p>
              </div>
            </div>
          </DialogHeader>

          {viewingDiscipline && (
            <div className="space-y-6 py-4">
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getStatusConfig(viewingDiscipline.status).color}`}
              >
                {getStatusConfig(viewingDiscipline.status).label}
              </span>

              {/* Descrição */}
              {viewingDiscipline.description && (
                <Card className="rounded-xl shadow-sm">
                  <CardContent className="p-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-violet-600" />
                      Descrição
                    </h3>
                    <p className="text-sm text-gray-700">{viewingDiscipline.description}</p>
                  </CardContent>
                </Card>
              )}

              {/* Estatísticas */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="rounded-xl shadow-sm border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <p className="text-xs text-gray-600 mb-1">Total de Alunos</p>
                    <p className="text-2xl font-bold text-gray-900">{viewingDiscipline.totalStudents}</p>
                  </CardContent>
                </Card>
                <Card className="rounded-xl shadow-sm border-l-4 border-l-amber-500">
                  <CardContent className="p-4">
                    <p className="text-xs text-gray-600 mb-1">Média Geral</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {viewingDiscipline.averageGrade !== null
                        ? viewingDiscipline.averageGrade.toFixed(1)
                        : "-"}
                    </p>
                  </CardContent>
                </Card>
                <Card className="rounded-xl shadow-sm border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    <p className="text-xs text-gray-600 mb-1">Taxa de Conclusão</p>
                    <p className="text-2xl font-bold text-gray-900">{viewingDiscipline.completionRate}%</p>
                  </CardContent>
                </Card>
              </div>

              {/* Carga Horária */}
              <Card className="rounded-xl shadow-sm">
                <CardContent className="p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-violet-600" />
                    Carga Horária
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="font-bold text-lg">{viewingDiscipline.workload}</span>
                    <span>horas totais</span>
                  </div>
                </CardContent>
              </Card>

              {/* Turmas */}
              {viewingDiscipline.classes.length > 0 && (
                <Card className="rounded-xl shadow-sm">
                  <CardContent className="p-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Users className="h-4 w-4 text-violet-600" />
                      Turmas ({viewingDiscipline.classes.length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {viewingDiscipline.classes.map((className, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 border border-blue-200"
                        >
                          {className}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewingDiscipline(null)} className="rounded-xl">
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
