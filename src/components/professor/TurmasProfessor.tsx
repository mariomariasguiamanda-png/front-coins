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
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  GraduationCap,
  Calendar,
  Clock,
  BookOpen,
  UserCheck,
  AlertCircle,
  TrendingUp,
  Award,
  ChevronRight,
  X,
  Settings
} from "lucide-react";
import { useState } from "react";

interface Student {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive";
}

interface Class {
  id: string;
  name: string;
  year: string;
  shift: "morning" | "afternoon" | "night";
  totalStudents: number;
  activeStudents: number;
  disciplines: string[];
  averageGrade: number;
  startDate: string;
  endDate: string;
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
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [deletingClassId, setDeletingClassId] = useState<string | null>(null);
  const [viewingClass, setViewingClass] = useState<Class | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterShift, setFilterShift] = useState<string>("todos");

  // Filtrar turmas
  const filteredClasses = classes.filter(cls => {
    const matchesSearch = cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cls.year.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterShift === "todos" || cls.shift === filterShift;
    return matchesSearch && matchesFilter;
  });

  // Estatísticas
  const stats = {
    totalClasses: classes.length,
    totalStudents: classes.reduce((acc, cls) => acc + cls.totalStudents, 0),
    activeStudents: classes.reduce((acc, cls) => acc + cls.activeStudents, 0),
    avgGrade: classes.length > 0 
      ? (classes.reduce((acc, cls) => acc + cls.averageGrade, 0) / classes.length).toFixed(1)
      : "0.0",
  };

  const getShiftLabel = (shift: string) => {
    switch(shift) {
      case "morning": return "Manhã";
      case "afternoon": return "Tarde";
      case "night": return "Noite";
      default: return shift;
    }
  };

  const getShiftColor = (shift: string) => {
    switch(shift) {
      case "morning": return "bg-amber-100 text-amber-700 border-amber-200";
      case "afternoon": return "bg-blue-100 text-blue-700 border-blue-200";
      case "night": return "bg-purple-100 text-purple-700 border-purple-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const handleCreateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newClass: Omit<Class, "id"> = {
      name: formData.get("name") as string,
      year: formData.get("year") as string,
      shift: formData.get("shift") as "morning" | "afternoon" | "night",
      totalStudents: 0,
      activeStudents: 0,
      disciplines: [],
      averageGrade: 0,
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
    };

    onCreateClass(newClass);
    setShowCreateForm(false);
  };

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingClass) return;

    const formData = new FormData(e.currentTarget);
    
    const updatedClass: Partial<Class> = {
      name: formData.get("name") as string,
      year: formData.get("year") as string,
      shift: formData.get("shift") as "morning" | "afternoon" | "night",
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
    };

    onEditClass(editingClass.id, updatedClass);
    setEditingClass(null);
  };

  const handleDelete = () => {
    if (deletingClassId) {
      onDeleteClass(deletingClassId);
      setDeletingClassId(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Turmas</h1>
          <p className="text-gray-600 mt-1">Gerencie suas turmas e acompanhe o desempenho</p>
        </div>
        <Button
          onClick={() => setShowCreateForm(true)}
          className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Turma
        </Button>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="rounded-xl shadow-sm border-l-4 border-l-violet-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Turmas</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalClasses}</p>
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
                <p className="text-sm font-medium text-gray-600">Total de Alunos</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalStudents}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Alunos Ativos</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.activeStudents}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                <UserCheck className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Média Geral</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.avgGrade}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Award className="h-5 w-5 text-amber-600" />
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
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma turma encontrada</h3>
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
            <Card key={cls.id} className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">{cls.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{cls.year}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getShiftColor(cls.shift)}`}>
                      {getShiftLabel(cls.shift)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                    <div>
                      <p className="text-xs text-gray-600">Alunos</p>
                      <p className="text-lg font-bold text-gray-900">{cls.totalStudents}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Média</p>
                      <p className="text-lg font-bold text-gray-900">{cls.averageGrade.toFixed(1)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(cls.startDate).toLocaleDateString('pt-BR')} - {new Date(cls.endDate).toLocaleDateString('pt-BR')}</span>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setViewingClass(cls)}
                      className="flex-1 rounded-xl"
                    >
                      <ChevronRight className="h-4 w-4 mr-1" />
                      Detalhes
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingClass(cls)}
                      className="rounded-xl"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeletingClassId(cls.id)}
                      className="rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
            <DialogTitle className="text-2xl text-gray-900">Nova Turma</DialogTitle>
            <DialogDescription className="text-gray-600 mt-1">
              Preencha as informações para criar uma nova turma
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="space-y-4 py-4">
            <div className="grid gap-4 md:grid-cols-2">
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
                <Label htmlFor="year">Ano Letivo *</Label>
                <Input
                  id="year"
                  name="year"
                  placeholder="Ex: 2025"
                  required
                  className="rounded-xl"
                />
              </div>
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

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startDate">Data de Início *</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  required
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">Data de Término *</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  required
                  className="rounded-xl"
                />
              </div>
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
              <Button type="submit" className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl">
                Criar Turma
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog de Editar Turma */}
      <Dialog open={!!editingClass} onOpenChange={(open) => !open && setEditingClass(null)}>
        <DialogContent className="rounded-xl max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl text-gray-900">Editar Turma</DialogTitle>
            <DialogDescription className="text-gray-600 mt-1">
              Atualize as informações da turma
            </DialogDescription>
          </DialogHeader>

          {editingClass && (
            <form onSubmit={handleEditSubmit} className="space-y-4 py-4">
              <div className="grid gap-4 md:grid-cols-2">
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
                  <Label htmlFor="edit-year">Ano Letivo *</Label>
                  <Input
                    id="edit-year"
                    name="year"
                    defaultValue={editingClass.year}
                    required
                    className="rounded-xl"
                  />
                </div>
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

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-startDate">Data de Início *</Label>
                  <Input
                    id="edit-startDate"
                    name="startDate"
                    type="date"
                    defaultValue={editingClass.startDate}
                    required
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-endDate">Data de Término *</Label>
                  <Input
                    id="edit-endDate"
                    name="endDate"
                    type="date"
                    defaultValue={editingClass.endDate}
                    required
                    className="rounded-xl"
                  />
                </div>
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
                <Button type="submit" className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl">
                  Salvar Alterações
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de Deletar */}
      <Dialog open={!!deletingClassId} onOpenChange={(open) => !open && setDeletingClassId(null)}>
        <DialogContent className="rounded-xl max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl text-gray-900">Confirmar Exclusão</DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              Tem certeza que deseja excluir esta turma? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeletingClassId(null)}
              className="rounded-xl"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Detalhes */}
      <Dialog open={!!viewingClass} onOpenChange={(open) => !open && setViewingClass(null)}>
        <DialogContent className="rounded-xl max-w-3xl bg-white max-h-[90vh] overflow-auto">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-violet-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-violet-600" />
              </div>
              <div>
                <DialogTitle className="text-2xl text-gray-900">{viewingClass?.name}</DialogTitle>
                <p className="text-sm text-gray-600 mt-1">{viewingClass?.year}</p>
              </div>
            </div>
          </DialogHeader>

          {viewingClass && (
            <div className="space-y-6 py-4">
              {/* Informações Gerais */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="rounded-xl shadow-sm border-l-4 border-l-violet-500">
                  <CardContent className="p-4">
                    <p className="text-xs text-gray-600 mb-1">Turno</p>
                    <p className="text-lg font-bold text-gray-900">{getShiftLabel(viewingClass.shift)}</p>
                  </CardContent>
                </Card>
                <Card className="rounded-xl shadow-sm border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <p className="text-xs text-gray-600 mb-1">Total de Alunos</p>
                    <p className="text-lg font-bold text-gray-900">{viewingClass.totalStudents}</p>
                  </CardContent>
                </Card>
                <Card className="rounded-xl shadow-sm border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    <p className="text-xs text-gray-600 mb-1">Média da Turma</p>
                    <p className="text-lg font-bold text-gray-900">{viewingClass.averageGrade.toFixed(1)}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Período */}
              <Card className="rounded-xl shadow-sm">
                <CardContent className="p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-violet-600" />
                    Período Letivo
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-700">
                    <span>Início: {new Date(viewingClass.startDate).toLocaleDateString('pt-BR')}</span>
                    <span>•</span>
                    <span>Término: {new Date(viewingClass.endDate).toLocaleDateString('pt-BR')}</span>
                  </div>
                </CardContent>
              </Card>

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
