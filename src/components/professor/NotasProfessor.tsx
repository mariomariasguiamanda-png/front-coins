import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Star, 
  History, 
  Download,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  TrendingUp,
  Users,
  Award,
  BookOpen,
  AlertCircle,
  AlertTriangle,
  Save,
  Upload,
  FileSpreadsheet,
  X
} from "lucide-react";
import { useState } from "react";

interface Grade {
  id: string;
  studentName: string;
  studentId: string;
  activity: string;
  grade: number;
  maxGrade: number;
  date: string;
  discipline: string;
  class: string;
}

interface NotasProfessorProps {
  grades: Grade[];
  onAddGrade: (grade: Omit<Grade, "id">) => void;
  onEditGrade: (id: string, grade: Partial<Grade>) => void;
  onDeleteGrade: (id: string) => void;
  onExportGrades: () => void;
  onImportGrades: (grades: Omit<Grade, "id">[]) => void;
}

export function NotasProfessor({
  grades = [],
  onAddGrade,
  onEditGrade,
  onDeleteGrade,
  onExportGrades,
  onImportGrades,
}: NotasProfessorProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null);
  const [deletingGradeId, setDeletingGradeId] = useState<string | null>(null);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [filterDiscipline, setFilterDiscipline] = useState<string>("todas");
  const [filterClass, setFilterClass] = useState<string>("todas");
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrar notas
  const filteredGrades = grades.filter(grade => {
    const matchesSearch = grade.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         grade.activity.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDiscipline = filterDiscipline === "todas" || grade.discipline === filterDiscipline;
    const matchesClass = filterClass === "todas" || grade.class === filterClass;
    return matchesSearch && matchesDiscipline && matchesClass;
  });

  // Estatísticas
  const stats = {
    total: grades.length,
    avgGrade: grades.length > 0 ? (grades.reduce((acc, g) => acc + (g.grade / g.maxGrade * 10), 0) / grades.length).toFixed(1) : "0.0",
    students: new Set(grades.map(g => g.studentId)).size,
    aboveAvg: grades.filter(g => (g.grade / g.maxGrade * 10) >= 7).length,
  };

  // Listas únicas
  const disciplines = ["todas", ...Array.from(new Set(grades.map(g => g.discipline)))];
  const classes = ["todas", ...Array.from(new Set(grades.map(g => g.class)))];

  const getGradeColor = (grade: number, maxGrade: number) => {
    const percentage = (grade / maxGrade) * 100;
    if (percentage >= 70) return "text-green-700 bg-green-100 border-green-200";
    if (percentage >= 50) return "text-amber-700 bg-amber-100 border-amber-200";
    return "text-red-700 bg-red-100 border-red-200";
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      
      // Ignorar cabeçalho
      const dataLines = lines.slice(1);
      
      const importedGrades: Omit<Grade, "id">[] = dataLines.map(line => {
        const [studentName, studentId, activity, grade, maxGrade, date, discipline, classValue] = line.split(',').map(item => item.trim());
        return {
          studentName,
          studentId,
          activity,
          grade: parseFloat(grade),
          maxGrade: parseFloat(maxGrade),
          date,
          discipline,
          class: classValue,
        };
      }).filter(grade => grade.studentName && !isNaN(grade.grade));

      if (importedGrades.length > 0) {
        onImportGrades(importedGrades);
        setShowImportDialog(false);
        alert(`${importedGrades.length} notas importadas com sucesso!`);
      } else {
        alert('Nenhuma nota válida encontrada no arquivo.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notas</h1>
          <p className="text-gray-600 mt-1">Gerencie as notas dos alunos por disciplina e turma</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() => setShowImportDialog(true)}
          >
            <Upload className="h-4 w-4 mr-2" />
            Importar
          </Button>
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={onExportGrades}
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="rounded-xl bg-violet-600 hover:bg-violet-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="rounded-xl shadow-sm border-l-4 border-l-violet-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Notas</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-violet-100 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-violet-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Média Geral</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.avgGrade}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Acima da Média</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.aboveAvg}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Award className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Alunos</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.students}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Formulário de Adicionar Nota */}
      {showAddForm && (
        <Card className="rounded-xl shadow-md border-2 border-violet-200">
          <CardContent className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-violet-100 flex items-center justify-center">
                  <Plus className="h-5 w-5 text-violet-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Adicionar Nota</h2>
                  <p className="text-sm text-gray-500">Registre a nota de um aluno</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowAddForm(false)}
                className="rounded-xl"
              >
                Cancelar
              </Button>
            </div>

            <form 
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                
                const disciplina = formData.get('disciplina');
                const turma = formData.get('turma');
                const atividade = formData.get('atividade');
                const aluno = formData.get('aluno');
                const nota = parseFloat(formData.get('nota') as string);
                const data = formData.get('data');

                if (!disciplina || !turma || !atividade || !aluno || !nota || !data) {
                  alert('Por favor, preencha todos os campos obrigatórios');
                  return;
                }

                if (nota < 0 || nota > 10) {
                  alert('A nota deve estar entre 0 e 10');
                  return;
                }

                // Adicionar nova nota via prop
                onAddGrade({
                  studentName: formData.get('aluno') as string,
                  studentId: `student_${Date.now()}`,
                  activity: formData.get('atividade') as string,
                  grade: nota,
                  maxGrade: 10,
                  date: formData.get('data') as string,
                  discipline: formData.get('disciplina') as string,
                  class: formData.get('turma') as string
                });

                // Fechar formulário e resetar
                setShowAddForm(false);
                e.currentTarget.reset();
                alert('Nota salva com sucesso!');
              }}
            >
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Disciplina *</Label>
                  <select 
                    name="disciplina" 
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl bg-white mt-1"
                  >
                    <option value="">Selecione a disciplina</option>
                    <option value="Matemática">Matemática</option>
                    <option value="Física">Física</option>
                    <option value="Química">Química</option>
                    <option value="Biologia">Biologia</option>
                    <option value="História">História</option>
                    <option value="Português">Português</option>
                  </select>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Turma *</Label>
                  <select 
                    name="turma" 
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl bg-white mt-1"
                  >
                    <option value="">Selecione a turma</option>
                    <option value="1º A">1º A</option>
                    <option value="1º B">1º B</option>
                    <option value="2º A">2º A</option>
                    <option value="2º B">2º B</option>
                    <option value="3º A">3º A</option>
                    <option value="3º C">3º C</option>
                  </select>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Atividade *</Label>
                  <select 
                    name="atividade" 
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl bg-white mt-1"
                  >
                    <option value="">Selecione a atividade</option>
                    <option value="Prova 1">Prova 1</option>
                    <option value="Prova 2">Prova 2</option>
                    <option value="Trabalho em Grupo">Trabalho em Grupo</option>
                    <option value="Lista de Exercícios">Lista de Exercícios</option>
                    <option value="Seminário">Seminário</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Aluno *</Label>
                  <select 
                    name="aluno" 
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl bg-white mt-1"
                  >
                    <option value="">Selecione o aluno</option>
                    <option value="João Silva">João Silva</option>
                    <option value="Maria Santos">Maria Santos</option>
                    <option value="Pedro Oliveira">Pedro Oliveira</option>
                    <option value="Ana Costa">Ana Costa</option>
                  </select>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Nota *</Label>
                  <Input
                    name="nota"
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    placeholder="Ex: 8.5"
                    className="rounded-xl mt-1"
                    required
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Data *</Label>
                  <Input 
                    name="data"
                    type="date" 
                    className="rounded-xl mt-1" 
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button type="submit" className="rounded-xl bg-violet-600 hover:bg-violet-700">
                  <Star className="h-4 w-4 mr-2" />
                  Salvar Nota
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Filtros e Busca */}
      <Card className="rounded-xl shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            {/* Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Buscar por aluno ou atividade..."
                className="rounded-xl pl-10 h-12 text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Filtros em Pills */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-gray-700">Disciplina:</span>
                {disciplines.map((discipline) => (
                  <button
                    key={discipline}
                    onClick={() => setFilterDiscipline(discipline)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all capitalize ${
                      filterDiscipline === discipline
                        ? "bg-violet-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {discipline}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-gray-700">Turma:</span>
                {classes.map((classItem) => (
                  <button
                    key={classItem}
                    onClick={() => setFilterClass(classItem)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all capitalize ${
                      filterClass === classItem
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {classItem}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Histórico de Notas */}
      <Card className="rounded-xl shadow-sm">
        <CardContent className="p-6">
          <div className="mb-6 flex items-center gap-3">
            <History className="h-5 w-5 text-violet-600" />
            <h2 className="text-lg font-semibold text-gray-900">Histórico de Notas</h2>
            <span className="text-sm text-gray-500 ml-auto">
              {filteredGrades.length} {filteredGrades.length === 1 ? 'registro' : 'registros'}
            </span>
          </div>

          {filteredGrades.length === 0 ? (
            <div className="py-12 text-center">
              <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma nota encontrada</h3>
              <p className="text-gray-600">
                {searchTerm || filterDiscipline !== "todas" || filterClass !== "todas"
                  ? "Tente ajustar os filtros de busca"
                  : "Comece adicionando a primeira nota"
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b-2 text-left bg-gray-50">
                  <tr>
                    <th className="pb-3 pt-3 px-4 font-semibold text-gray-700">Aluno</th>
                    <th className="pb-3 pt-3 px-4 font-semibold text-gray-700">Disciplina</th>
                    <th className="pb-3 pt-3 px-4 font-semibold text-gray-700">Turma</th>
                    <th className="pb-3 pt-3 px-4 font-semibold text-gray-700">Atividade</th>
                    <th className="pb-3 pt-3 px-4 font-semibold text-gray-700">Nota</th>
                    <th className="pb-3 pt-3 px-4 font-semibold text-gray-700">Data</th>
                    <th className="pb-3 pt-3 px-4 font-semibold text-gray-700">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredGrades.map((grade) => {
                    const gradeColor = getGradeColor(grade.grade, grade.maxGrade);
                    return (
                      <tr key={grade.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-violet-100 flex items-center justify-center">
                              <span className="text-xs font-semibold text-violet-600">
                                {grade.studentName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{grade.studentName}</p>
                              <p className="text-xs text-gray-500">{grade.studentId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-700">{grade.discipline}</td>
                        <td className="py-4 px-4">
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                            {grade.class}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-700">{grade.activity}</td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${gradeColor}`}>
                            <Star className="h-3 w-3" />
                            {grade.grade}/{grade.maxGrade}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-600 text-xs">
                          {new Date(grade.date).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-xl"
                              onClick={() => setEditingGrade(grade)}
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-xl text-red-600 hover:bg-red-50 hover:border-red-300"
                              onClick={() => setDeletingGradeId(grade.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Formulário de Editar Nota */}
      {editingGrade && (
        <Card className="rounded-xl shadow-md border-2 border-blue-200 fixed inset-4 z-50 overflow-auto bg-white">
          <CardContent className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Edit2 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Editar Nota</h2>
                  <p className="text-sm text-gray-500">Atualize as informações abaixo</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setEditingGrade(null)}
                className="rounded-xl"
              >
                Cancelar
              </Button>
            </div>

            <form className="space-y-4" onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              onEditGrade(editingGrade.id, {
                studentName: formData.get('studentName') as string,
                studentId: formData.get('studentId') as string,
                activity: formData.get('activity') as string,
                discipline: formData.get('discipline') as string,
                class: formData.get('class') as string,
                grade: parseFloat(formData.get('grade') as string),
                maxGrade: parseFloat(formData.get('maxGrade') as string),
                date: formData.get('date') as string,
              });
              setEditingGrade(null);
            }}>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Nome do Aluno</Label>
                  <Input
                    name="studentName"
                    defaultValue={editingGrade.studentName}
                    placeholder="Ex: João Silva"
                    className="rounded-xl mt-1"
                    required
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Matrícula</Label>
                  <Input
                    name="studentId"
                    defaultValue={editingGrade.studentId}
                    placeholder="Ex: 2024001"
                    className="rounded-xl mt-1"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Disciplina</Label>
                  <Input
                    name="discipline"
                    defaultValue={editingGrade.discipline}
                    placeholder="Ex: Matemática"
                    className="rounded-xl mt-1"
                    required
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Turma</Label>
                  <Input
                    name="class"
                    defaultValue={editingGrade.class}
                    placeholder="Ex: 1º A"
                    className="rounded-xl mt-1"
                    required
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Atividade</Label>
                <Input
                  name="activity"
                  defaultValue={editingGrade.activity}
                  placeholder="Ex: Prova 1 - Funções"
                  className="rounded-xl mt-1"
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Nota</Label>
                  <Input
                    name="grade"
                    type="number"
                    step="0.1"
                    min="0"
                    defaultValue={editingGrade.grade}
                    className="rounded-xl mt-1"
                    required
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Nota Máxima</Label>
                  <Input
                    name="maxGrade"
                    type="number"
                    step="0.1"
                    min="0"
                    defaultValue={editingGrade.maxGrade}
                    className="rounded-xl mt-1"
                    required
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Data</Label>
                  <Input
                    name="date"
                    type="date"
                    defaultValue={editingGrade.date}
                    className="rounded-xl mt-1"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button type="submit" className="rounded-xl bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Alterações
                </Button>
                <Button 
                  type="button"
                  variant="outline" 
                  className="rounded-xl"
                  onClick={() => setEditingGrade(null)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog open={!!deletingGradeId} onOpenChange={(open) => !open && setDeletingGradeId(null)}>
        <DialogContent className="rounded-xl max-w-md bg-white">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <DialogTitle className="text-xl text-gray-900">Excluir Nota?</DialogTitle>
            </div>
            <DialogDescription className="text-base text-gray-600 pt-2">
              Tem certeza que deseja excluir esta nota? Esta ação não pode ser desfeita e o registro será perdido permanentemente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={() => setDeletingGradeId(null)}
              className="rounded-xl"
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                if (deletingGradeId) {
                  onDeleteGrade(deletingGradeId);
                  setDeletingGradeId(null);
                }
              }}
              className="rounded-xl bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Sim, Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Importação de Notas */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="rounded-xl max-w-2xl bg-white max-h-[90vh] flex flex-col">
          <DialogHeader className="border-b pb-4 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-violet-100 flex items-center justify-center">
                <Upload className="h-6 w-6 text-violet-600" />
              </div>
              <div>
                <DialogTitle className="text-2xl text-gray-900">Importar Notas em Lote</DialogTitle>
                <p className="text-sm text-gray-600 mt-1">Faça upload de um arquivo CSV ou Excel com as notas</p>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6 py-4 overflow-y-auto flex-1">
            {/* Instruções */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold mb-2">Formato do arquivo CSV:</p>
                  <p className="mb-2">O arquivo deve conter as seguintes colunas nesta ordem:</p>
                  <code className="block bg-white p-2 rounded text-xs font-mono">
                    Nome do Aluno, Matrícula, Atividade, Nota, Nota Máxima, Data, Disciplina, Turma
                  </code>
                  <p className="mt-2 text-xs">Exemplo:</p>
                  <code className="block bg-white p-2 rounded text-xs font-mono">
                    João Silva, 2024001, Prova 1, 8.5, 10, 2024-02-15, Matemática, 1º A
                  </code>
                </div>
              </div>
            </div>

            {/* Botão de Download do Template */}
            <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="h-8 w-8 text-green-600" />
                <div>
                  <p className="font-semibold text-gray-900">Template CSV</p>
                  <p className="text-sm text-gray-600">Baixe o modelo para facilitar o preenchimento</p>
                </div>
              </div>
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => {
                  const template = "Nome do Aluno,Matrícula,Atividade,Nota,Nota Máxima,Data,Disciplina,Turma\nJoão Silva,2024001,Prova 1,8.5,10,2024-02-15,Matemática,1º A\nMaria Santos,2024002,Prova 1,9.0,10,2024-02-15,Matemática,1º A";
                  const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
                  const link = document.createElement('a');
                  link.href = URL.createObjectURL(blob);
                  link.download = 'template_notas.csv';
                  link.click();
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Baixar Template
              </Button>
            </div>

            {/* Upload de Arquivo */}
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-violet-400 transition-colors">
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileImport}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-semibold text-gray-900 mb-2">
                  Clique para fazer upload do arquivo
                </p>
                <p className="text-sm text-gray-600">
                  Formatos aceitos: CSV, Excel (.xlsx, .xls)
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl mt-4"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Selecionar Arquivo
                </Button>
              </label>
            </div>
          </div>

          <DialogFooter className="border-t pt-4 flex-shrink-0">
            <Button
              variant="outline"
              onClick={() => setShowImportDialog(false)}
              className="rounded-xl"
            >
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}