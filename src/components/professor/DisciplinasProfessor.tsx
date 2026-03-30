import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/textarea";
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
  BookOpen, 
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  Users,
  Clock,
  Calendar,
  AlertCircle,
  Award,
  TrendingUp,
  FileText,
  ChevronRight,
  X,
  GraduationCap,
  Target,
  BarChart2
} from "lucide-react";
import { useState, useEffect } from "react";

interface Discipline {
  id: string;
  name: string;
  code: string;
  description: string;
  category: string;
  workload: number; // horas
  credits: number;
  semester: string;
  classes: string[]; // turmas que cursam
  totalStudents: number;
  averageGrade: number;
  completionRate: number; // %
  status: "active" | "inactive";
}

interface DisciplinasProfessorProps {
  disciplines: Discipline[];
  onCreateDiscipline: (discipline: Omit<Discipline, "id">) => void;
  onEditDiscipline: (id: string, discipline: Partial<Discipline>) => void;
  onDeleteDiscipline: (id: string) => void;
  initialViewCode?: string | null;
}

export function DisciplinasProfessor({
  disciplines = [],
  onCreateDiscipline,
  onEditDiscipline,
  onDeleteDiscipline,
  initialViewCode = null,
}: DisciplinasProfessorProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingDiscipline, setEditingDiscipline] = useState<Discipline | null>(null);
  const [deletingDisciplineId, setDeletingDisciplineId] = useState<string | null>(null);
  const [viewingDiscipline, setViewingDiscipline] = useState<Discipline | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("todas");
  const [filterStatus, setFilterStatus] = useState<string>("todas");

  // Abrir modal automaticamente se initialViewCode for passado
  useEffect(() => {
    if (initialViewCode) {
      const discipline = disciplines.find(d => d.code === initialViewCode);
      if (discipline) {
        setViewingDiscipline(discipline);
      }
    }
  }, [initialViewCode, disciplines]);

  // Filtrar disciplinas
  const filteredDisciplines = disciplines.filter(disc => {
    const matchesSearch = disc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         disc.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         disc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "todas" || disc.category === filterCategory;
    const matchesStatus = filterStatus === "todas" || disc.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Estatísticas
  const stats = {
    totalDisciplines: disciplines.length,
    activeDisciplines: disciplines.filter(d => d.status === "active").length,
    totalStudents: disciplines.reduce((acc, disc) => acc + disc.totalStudents, 0),
    avgGrade: disciplines.length > 0 
      ? (disciplines.reduce((acc, disc) => acc + disc.averageGrade, 0) / disciplines.length).toFixed(1)
      : "0.0",
    avgCompletion: disciplines.length > 0
      ? Math.round(disciplines.reduce((acc, disc) => acc + disc.completionRate, 0) / disciplines.length)
      : 0,
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Exatas": "bg-blue-100 text-blue-700 border-blue-200",
      "Humanas": "bg-purple-100 text-purple-700 border-purple-200",
      "Biológicas": "bg-green-100 text-green-700 border-green-200",
      "Linguagens": "bg-amber-100 text-amber-700 border-amber-200",
      "Tecnologia": "bg-violet-100 text-violet-700 border-violet-200",
    };
    return colors[category] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getStatusConfig = (status: string) => {
    return status === "active"
      ? { label: "Ativa", color: "bg-green-100 text-green-700 border-green-200" }
      : { label: "Inativa", color: "bg-gray-100 text-gray-700 border-gray-200" };
  };

  const handleCreateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newDiscipline: Omit<Discipline, "id"> = {
      name: formData.get("name") as string,
      code: formData.get("code") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      workload: parseInt(formData.get("workload") as string),
      credits: parseInt(formData.get("credits") as string),
      semester: formData.get("semester") as string,
      classes: [],
      totalStudents: 0,
      averageGrade: 0,
      completionRate: 0,
      status: "active",
    };

    onCreateDiscipline(newDiscipline);
    setShowCreateForm(false);
  };

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingDiscipline) return;

    const formData = new FormData(e.currentTarget);
    
    const updatedDiscipline: Partial<Discipline> = {
      name: formData.get("name") as string,
      code: formData.get("code") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      workload: parseInt(formData.get("workload") as string),
      credits: parseInt(formData.get("credits") as string),
      semester: formData.get("semester") as string,
      status: formData.get("status") as "active" | "inactive",
    };

    onEditDiscipline(editingDiscipline.id, updatedDiscipline);
    setEditingDiscipline(null);
  };

  const handleDelete = () => {
    if (deletingDisciplineId) {
      onDeleteDiscipline(deletingDisciplineId);
      setDeletingDisciplineId(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Disciplinas</h1>
          <p className="text-gray-600 mt-1">Gerencie as disciplinas e acompanhe o desempenho</p>
        </div>
        <Button
          onClick={() => setShowCreateForm(true)}
          className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Disciplina
        </Button>
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
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="rounded-xl w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                <SelectItem value="Exatas">Exatas</SelectItem>
                <SelectItem value="Humanas">Humanas</SelectItem>
                <SelectItem value="Biológicas">Biológicas</SelectItem>
                <SelectItem value="Linguagens">Linguagens</SelectItem>
                <SelectItem value="Tecnologia">Tecnologia</SelectItem>
              </SelectContent>
            </Select>
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
                  {searchTerm || filterCategory !== "todas" || filterStatus !== "todas"
                    ? "Tente ajustar os filtros de busca" 
                    : "Comece criando sua primeira disciplina"}
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
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusConfig(disc.status).color}`}>
                      {getStatusConfig(disc.status).label}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(disc.category)}`}>
                      {disc.category}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                      {disc.semester}
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
                      <p className="text-lg font-bold text-gray-900">{disc.averageGrade.toFixed(1)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Conclusão</p>
                      <p className="text-lg font-bold text-gray-900">{disc.completionRate}%</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Clock className="h-3 w-3" />
                    <span>{disc.workload}h • {disc.credits} créditos</span>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setViewingDiscipline(disc)}
                      className="flex-1 rounded-xl"
                    >
                      <ChevronRight className="h-4 w-4 mr-1" />
                      Detalhes
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingDiscipline(disc)}
                      className="rounded-xl"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeletingDisciplineId(disc.id)}
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

      {/* Dialog de Criar Disciplina */}
      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="rounded-xl max-w-2xl bg-white max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-gray-900">Nova Disciplina</DialogTitle>
            <DialogDescription className="text-gray-600 mt-1">
              Preencha as informações para criar uma nova disciplina
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="space-y-4 py-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Disciplina *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Ex: Matemática"
                  required
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">Código *</Label>
                <Input
                  id="code"
                  name="code"
                  placeholder="Ex: MAT101"
                  required
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Descrição da disciplina..."
                rows={3}
                className="rounded-xl resize-none"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Categoria *</Label>
                <Select name="category" required>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Exatas">Exatas</SelectItem>
                    <SelectItem value="Humanas">Humanas</SelectItem>
                    <SelectItem value="Biológicas">Biológicas</SelectItem>
                    <SelectItem value="Linguagens">Linguagens</SelectItem>
                    <SelectItem value="Tecnologia">Tecnologia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="semester">Período *</Label>
                <Input
                  id="semester"
                  name="semester"
                  placeholder="Ex: 1º Semestre"
                  required
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="workload">Carga Horária (horas) *</Label>
                <Input
                  id="workload"
                  name="workload"
                  type="number"
                  placeholder="Ex: 60"
                  required
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="credits">Créditos *</Label>
                <Input
                  id="credits"
                  name="credits"
                  type="number"
                  placeholder="Ex: 4"
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
                Criar Disciplina
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog de Editar Disciplina */}
      <Dialog open={!!editingDiscipline} onOpenChange={(open) => !open && setEditingDiscipline(null)}>
        <DialogContent className="rounded-xl max-w-2xl bg-white max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-gray-900">Editar Disciplina</DialogTitle>
            <DialogDescription className="text-gray-600 mt-1">
              Atualize as informações da disciplina
            </DialogDescription>
          </DialogHeader>

          {editingDiscipline && (
            <form onSubmit={handleEditSubmit} className="space-y-4 py-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Nome da Disciplina *</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    defaultValue={editingDiscipline.name}
                    required
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-code">Código *</Label>
                  <Input
                    id="edit-code"
                    name="code"
                    defaultValue={editingDiscipline.code}
                    required
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Descrição</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  defaultValue={editingDiscipline.description}
                  rows={3}
                  className="rounded-xl resize-none"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Categoria *</Label>
                  <Select name="category" defaultValue={editingDiscipline.category} required>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Exatas">Exatas</SelectItem>
                      <SelectItem value="Humanas">Humanas</SelectItem>
                      <SelectItem value="Biológicas">Biológicas</SelectItem>
                      <SelectItem value="Linguagens">Linguagens</SelectItem>
                      <SelectItem value="Tecnologia">Tecnologia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-semester">Período *</Label>
                  <Input
                    id="edit-semester"
                    name="semester"
                    defaultValue={editingDiscipline.semester}
                    required
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="edit-workload">Carga Horária *</Label>
                  <Input
                    id="edit-workload"
                    name="workload"
                    type="number"
                    defaultValue={editingDiscipline.workload}
                    required
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-credits">Créditos *</Label>
                  <Input
                    id="edit-credits"
                    name="credits"
                    type="number"
                    defaultValue={editingDiscipline.credits}
                    required
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status *</Label>
                  <Select name="status" defaultValue={editingDiscipline.status} required>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Ativa</SelectItem>
                      <SelectItem value="inactive">Inativa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingDiscipline(null)}
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
      <Dialog open={!!deletingDisciplineId} onOpenChange={(open) => !open && setDeletingDisciplineId(null)}>
        <DialogContent className="rounded-xl max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl text-gray-900">Confirmar Exclusão</DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              Tem certeza que deseja excluir esta disciplina? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeletingDisciplineId(null)}
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
              {/* Badges */}
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getCategoryColor(viewingDiscipline.category)}`}>
                  {viewingDiscipline.category}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusConfig(viewingDiscipline.status).color}`}>
                  {getStatusConfig(viewingDiscipline.status).label}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                  {viewingDiscipline.semester}
                </span>
              </div>

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
              <div className="grid gap-4 md:grid-cols-4">
                <Card className="rounded-xl shadow-sm border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <p className="text-xs text-gray-600 mb-1">Total de Alunos</p>
                    <p className="text-2xl font-bold text-gray-900">{viewingDiscipline.totalStudents}</p>
                  </CardContent>
                </Card>
                <Card className="rounded-xl shadow-sm border-l-4 border-l-amber-500">
                  <CardContent className="p-4">
                    <p className="text-xs text-gray-600 mb-1">Média Geral</p>
                    <p className="text-2xl font-bold text-gray-900">{viewingDiscipline.averageGrade.toFixed(1)}</p>
                  </CardContent>
                </Card>
                <Card className="rounded-xl shadow-sm border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    <p className="text-xs text-gray-600 mb-1">Taxa de Conclusão</p>
                    <p className="text-2xl font-bold text-gray-900">{viewingDiscipline.completionRate}%</p>
                  </CardContent>
                </Card>
                <Card className="rounded-xl shadow-sm border-l-4 border-l-purple-500">
                  <CardContent className="p-4">
                    <p className="text-xs text-gray-600 mb-1">Créditos</p>
                    <p className="text-2xl font-bold text-gray-900">{viewingDiscipline.credits}</p>
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
            <Button
              variant="outline"
              onClick={() => setViewingDiscipline(null)}
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
