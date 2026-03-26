import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  Users,
  
  Search,
  Filter,
  GraduationCap,
  Calendar,
  Clock,
  BookOpen,
  AlertCircle,
  TrendingUp,
  Award,
  ChevronRight,
  Coins,
  X,
  Settings,
} from "lucide-react";
import { useState } from "react";

interface Student {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive";
  averageGrade?: number;
  totalCoins?: number;
}

export interface Class {
  id: string;
  name: string;
  shift: "morning" | "afternoon" | "night";
  totalStudents: number;
  activeStudents: number;
  disciplines: string[];
  averageGrade: number;
  students?: Student[];
}

interface TurmasProfessorProps {
  classes: Class[];
  onCreateClass: (classData: Omit<Class, "id">) => void;
  onEditClass: (id: string, classData: Partial<Class>) => void;
  onDeleteClass: (id: string) => void;
}

export function TurmasProfessor({
  classes = [],
  onCreateClass,
  onEditClass,
  onDeleteClass,
}: TurmasProfessorProps) {
  const [viewingClass, setViewingClass] = useState<Class | null>(null);
  const [detailsViewMode, setDetailsViewMode] = useState<"overview" | "students">("overview");
  const [showCreateForm, setShowCreateForm] = useState(false); // kept for compatibility with other pages
  const [editingClass, setEditingClass] = useState<Class | null>(null); // kept but not used (no UI triggers)
  const [searchTerm, setSearchTerm] = useState("");
  const [filterShift, setFilterShift] = useState<string>("todos");

  // Filtrar turmas
  const filteredClasses = classes.filter((cls) => {
    const matchesSearch = cls.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter = filterShift === "todos" || cls.shift === filterShift;
    return matchesSearch && matchesFilter;
  });

  // Estatísticas
  const stats = {
    totalClasses: classes.length,
    totalStudents: classes.reduce((acc, cls) => acc + cls.totalStudents, 0),
    activeStudents: classes.reduce((acc, cls) => acc + cls.activeStudents, 0),
    avgGrade:
      classes.length > 0
        ? (
            classes.reduce((acc, cls) => acc + cls.averageGrade, 0) /
            classes.length
          ).toFixed(1)
        : "0.0",
  };

  const getShiftLabel = (shift: string) => {
    switch (shift) {
      case "morning":
        return "Manhã";
      case "afternoon":
        return "Tarde";
      case "night":
        return "Noite";
      default:
        return shift;
    }
  };

  const getShiftColor = (shift: string) => {
    switch (shift) {
      case "morning":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "afternoon":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "night":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // Handlers para criação/edição mantidos para segurança (verificam presença de callbacks)
  const handleCreateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const newClass: Omit<Class, "id"> = {
      name: (formData.get("name") as string) || "",
      shift: (formData.get("shift") as "morning" | "afternoon" | "night") || "morning",
      totalStudents: 0,
      activeStudents: 0,
      disciplines: [],
      averageGrade: 0,
    };

    if (typeof onCreateClass === "function") {
      onCreateClass(newClass);
    }

    setShowCreateForm(false);
  };

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingClass) return;

    const formData = new FormData(e.currentTarget);

    const updatedClass: Partial<Class> = {
      name: (formData.get("name") as string) || editingClass.name,
      shift: (formData.get("shift") as "morning" | "afternoon" | "night") || editingClass.shift,
    };

    if (typeof onEditClass === "function") {
      onEditClass(editingClass.id, updatedClass);
    }

    setEditingClass(null);
  };

  // Exclusão pela UI removida para professores nesta página

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Turmas</h1>
          <p className="text-gray-600 mt-1">
            Gerencie suas turmas e acompanhe o desempenho
          </p>
        </div>
        {/* Criação de turma removida para professores nesta página */}
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="rounded-xl shadow-sm border-l-4 border-l-violet-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total de Turmas
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.totalClasses}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-violet-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-violet-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total de Alunos
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.totalStudents}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-blue-600" />
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
                placeholder="Buscar turma..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-xl"
              />
            </div>
            <Select value={filterShift} onValueChange={setFilterShift}>
              <SelectTrigger className="rounded-xl w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrar por turno" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os turnos</SelectItem>
                <SelectItem value="morning">Manhã</SelectItem>
                <SelectItem value="afternoon">Tarde</SelectItem>
                <SelectItem value="night">Noite</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Turmas */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredClasses.length === 0 ? (
          <div className="col-span-full">
            <Card className="rounded-xl shadow-sm">
              <CardContent className="p-12 text-center">
                <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhuma turma encontrada
                </h3>
                <p className="text-gray-600">
                  {searchTerm || filterShift !== "todos"
                    ? "Tente ajustar os filtros de busca"
                    : "Comece criando sua primeira turma"}
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredClasses.map((cls) => (
            <Card
              key={cls.id}
              className="rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">
                        {cls.name}
                      </h3>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getShiftColor(cls.shift)}`}
                    >
                      {getShiftLabel(cls.shift)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                    <div>
                      <p className="text-xs text-gray-600">Alunos</p>
                      <p className="text-lg font-bold text-gray-900">
                        {cls.totalStudents}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Média</p>
                      <p className="text-lg font-bold text-gray-900">
                        {cls.averageGrade.toFixed(1)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-3 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setDetailsViewMode("overview");
                        setViewingClass(cls);
                      }}
                      className="flex-1 rounded-xl"
                    >
                      <ChevronRight className="h-4 w-4 mr-1" />
                      Detalhes
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setDetailsViewMode("students");
                        setViewingClass(cls);
                      }}
                      className="flex-1 rounded-xl"
                    >
                      <Users className="h-4 w-4 mr-1" />
                      Alunos
                    </Button>
                    {/* Edição de turma removida para professores nesta página */}
                    {/* Exclusão removida para professores nesta página */}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Dialog de Criar Turma */}
      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="rounded-xl max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl text-gray-900">
              Nova Turma
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-1">
              Preencha as informações para criar uma nova turma
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Turma *</Label>
              <Input
                id="name"
                name="name"
                placeholder="Ex: 3º Ano A"
                required
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shift">Turno *</Label>
              <Select name="shift" required>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Selecione o turno" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Manhã</SelectItem>
                  <SelectItem value="afternoon">Tarde</SelectItem>
                  <SelectItem value="night">Noite</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateForm(false)}
                className="rounded-xl"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl"
              >
                Criar Turma
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog de Editar Turma */}
      <Dialog
        open={!!editingClass}
        onOpenChange={(open) => !open && setEditingClass(null)}
      >
        <DialogContent className="rounded-xl max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl text-gray-900">
              Editar Turma
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-1">
              Atualize as informações da turma
            </DialogDescription>
          </DialogHeader>

          {editingClass && (
            <form onSubmit={handleEditSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nome da Turma *</Label>
                <Input
                  id="edit-name"
                  name="name"
                  defaultValue={editingClass.name}
                  required
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-shift">Turno *</Label>
                <Select name="shift" defaultValue={editingClass.shift} required>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Manhã</SelectItem>
                    <SelectItem value="afternoon">Tarde</SelectItem>
                    <SelectItem value="night">Noite</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter className="gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingClass(null)}
                  className="rounded-xl"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl"
                >
                  Salvar Alterações
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo de exclusão removido (professores não podem excluir turmas aqui) */}

      {/* Dialog de Detalhes */}
      <Dialog
        open={!!viewingClass}
        onOpenChange={(open) => !open && setViewingClass(null)}
      >
        <DialogContent className="rounded-xl max-w-3xl bg-white max-h-[90vh] overflow-auto">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-violet-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-violet-600" />
              </div>
              <div>
                <DialogTitle className="text-2xl text-gray-900">
                  {viewingClass?.name}
                </DialogTitle>
              </div>
            </div>
          </DialogHeader>

          {viewingClass && (
            <div className="space-y-6 py-4">
              {detailsViewMode === "overview" && (
                <>
                  {/* Informações Gerais */}
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card className="rounded-xl shadow-sm border-l-4 border-l-violet-500">
                      <CardContent className="p-4">
                        <p className="text-xs text-gray-600 mb-1">Turno</p>
                        <p className="text-lg font-bold text-gray-900">
                          {getShiftLabel(viewingClass.shift)}
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="rounded-xl shadow-sm border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <p className="text-xs text-gray-600 mb-1">
                          Total de Alunos
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {viewingClass.totalStudents}
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="rounded-xl shadow-sm border-l-4 border-l-green-500">
                      <CardContent className="p-4">
                        <p className="text-xs text-gray-600 mb-1">Média da Turma</p>
                        <p className="text-lg font-bold text-gray-900">
                          {viewingClass.averageGrade.toFixed(1)}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Disciplinas */}
                  {viewingClass.disciplines.length > 0 && (
                    <Card className="rounded-xl shadow-sm">
                      <CardContent className="p-4">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-violet-600" />
                          Disciplinas ({viewingClass.disciplines.length})
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {viewingClass.disciplines.map((discipline, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 border border-blue-200"
                            >
                              {discipline}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}

              {/* Lista Completa de Alunos */}
              <Card className="rounded-xl shadow-sm">
                <CardContent className="p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Users className="h-4 w-4 text-violet-600" />
                    Lista Completa de Alunos ({viewingClass.students?.length || 0})
                  </h3>

                  {viewingClass.students && viewingClass.students.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b">
                          <tr>
                            <th className="text-left px-3 py-2 font-semibold text-gray-700">Aluno</th>
                            <th className="text-left px-3 py-2 font-semibold text-gray-700">Média</th>
                            <th className="text-left px-3 py-2 font-semibold text-gray-700">Moedas</th>
                            <th className="text-left px-3 py-2 font-semibold text-gray-700">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {viewingClass.students.map((student) => (
                            <tr key={student.id} className="hover:bg-gray-50">
                              <td className="px-3 py-2">
                                <div>
                                  <p className="font-medium text-gray-900">{student.name}</p>
                                  <p className="text-xs text-gray-500">{student.email}</p>
                                </div>
                              </td>
                              <td className="px-3 py-2 font-semibold text-gray-800">
                                {typeof student.averageGrade === "number" ? student.averageGrade.toFixed(1) : "-"}
                              </td>
                              <td className="px-3 py-2">
                                <div className="inline-flex items-center gap-1 text-amber-700 font-semibold">
                                  <Coins className="h-4 w-4" />
                                  {student.totalCoins ?? 0}
                                </div>
                              </td>
                              <td className="px-3 py-2">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    student.status === "active"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-gray-100 text-gray-700"
                                  }`}
                                >
                                  {student.status === "active" ? "Ativo" : "Inativo"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed border-gray-200 p-6 text-center">
                      <p className="text-sm text-gray-600">Sem alunos vinculados para esta turma no momento.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setViewingClass(null)}
              className="rounded-xl"
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
