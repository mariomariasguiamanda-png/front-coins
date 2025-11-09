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
  BookOpen, 
  Calendar, 
  Upload, 
  Clock,
  CheckCircle2,
  AlertCircle,
  Filter,
  Search,
  Plus,
  Edit2,
  Trash2,
  Users,
  Coins,
  FileText,
  AlertTriangle,
  ClipboardCheck,
  Download,
  Eye,
  X
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/router";

interface Activity {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  coins: number;
  status: "pendente" | "entregue" | "corrigida";
  submissions?: number;
  totalStudents?: number;
  discipline?: string;
}

interface Submission {
  id: string;
  studentName: string;
  studentEmail: string;
  submittedAt: string;
  status: "pendente" | "aprovado" | "reprovado";
  grade?: number;
  file?: string;
}

interface AtividadesProfessorProps {
  activities: Activity[];
  onCreateActivity: (activity: Omit<Activity, "id">) => void;
  onEditActivity: (id: string, activity: Partial<Activity>) => void;
  onDeleteActivity: (id: string) => void;
}

export function AtividadesProfessor({
  activities = [],
  onCreateActivity,
  onEditActivity,
  onDeleteActivity,
}: AtividadesProfessorProps) {
  const router = useRouter();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [deletingActivityId, setDeletingActivityId] = useState<string | null>(null);
  const [viewingSubmissions, setViewingSubmissions] = useState<Activity | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("todas");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock de submissões para demonstração
  const mockSubmissions: Submission[] = [
    {
      id: "1",
      studentName: "João Silva",
      studentEmail: "joao@email.com",
      submittedAt: "2024-11-07 14:30",
      status: "pendente",
      file: "exercicios_joao.pdf"
    },
    {
      id: "2",
      studentName: "Maria Santos",
      studentEmail: "maria@email.com",
      submittedAt: "2024-11-07 15:45",
      status: "pendente",
      file: "atividade_maria.docx"
    },
    {
      id: "3",
      studentName: "Pedro Costa",
      studentEmail: "pedro@email.com",
      submittedAt: "2024-11-06 18:20",
      status: "aprovado",
      grade: 9.5,
      file: "resolucao_pedro.pdf"
    },
  ];

  // Função para download de arquivo
  const handleDownloadFile = (fileName: string) => {
    // Em produção, seria uma chamada real à API
    alert(`Download iniciado: ${fileName}\n\nEm produção, o arquivo seria baixado automaticamente.`);
  };

  // Função para exportar relatório
  const exportarRelatorio = () => {
    const csvHeader = "Título,Disciplina,Data de Entrega,Moedas,Status,Entregas,Total de Alunos,Taxa de Entrega\n";
    const csvRows = activities.map(activity => {
      const submissionRate = activity.totalStudents 
        ? ((activity.submissions || 0) / activity.totalStudents * 100).toFixed(0)
        : 0;
      
      return [
        `"${activity.title}"`,
        `"${activity.discipline || 'N/A'}"`,
        activity.dueDate,
        activity.coins,
        activity.status,
        activity.submissions || 0,
        activity.totalStudents || 0,
        `${submissionRate}%`
      ].join(",");
    }).join("\n");

    const csvContent = csvHeader + csvRows;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `relatorio_atividades_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtrar atividades
  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "todas" || activity.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Contar estatísticas
  const stats = {
    total: activities.length,
    pendente: activities.filter(a => a.status === "pendente").length,
    entregue: activities.filter(a => a.status === "entregue").length,
    corrigida: activities.filter(a => a.status === "corrigida").length,
  };

  const getStatusConfig = (status: string) => {
    switch(status) {
      case "pendente":
        return { 
          color: "text-amber-700 bg-amber-100 border-amber-200", 
          icon: Clock,
          label: "Aguardando entregas"
        };
      case "entregue":
        return { 
          color: "text-blue-700 bg-blue-100 border-blue-200", 
          icon: AlertCircle,
          label: "Pendente correção"
        };
      case "corrigida":
        return { 
          color: "text-green-700 bg-green-100 border-green-200", 
          icon: CheckCircle2,
          label: "Corrigida"
        };
      default:
        return { 
          color: "text-gray-700 bg-gray-100 border-gray-200", 
          icon: Clock,
          label: status
        };
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Atividades</h1>
          <p className="text-gray-600 mt-1">Gerencie e acompanhe as atividades das suas turmas</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={exportarRelatorio}
            variant="outline"
            className="rounded-xl"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar Relatório
          </Button>
          <Button 
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="rounded-xl bg-violet-600 hover:bg-violet-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Atividade
          </Button>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="rounded-xl shadow-sm border-l-4 border-l-violet-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-violet-100 flex items-center justify-center">
                <FileText className="h-5 w-5 text-violet-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.pendente}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Entregues</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.entregue}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Corrigidas</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.corrigida}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Formulário de Criar Atividade */}
      {showCreateForm && (
        <Card className="rounded-xl shadow-md border-2 border-violet-200">
          <CardContent className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-violet-100 flex items-center justify-center">
                  <Plus className="h-5 w-5 text-violet-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Nova Atividade</h2>
                  <p className="text-sm text-gray-500">Preencha os dados abaixo</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowCreateForm(false)}
                className="rounded-xl"
              >
                Cancelar
              </Button>
            </div>

            <form className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Título</Label>
                  <Input
                    placeholder="Ex: Lista de Exercícios 1"
                    className="rounded-xl mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Disciplina</Label>
                  <Input
                    placeholder="Ex: Matemática"
                    className="rounded-xl mt-1"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Data de entrega</Label>
                  <Input type="date" className="rounded-xl mt-1" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Moedas</Label>
                  <Input 
                    type="number" 
                    defaultValue={10} 
                    className="rounded-xl mt-1"
                    min={1}
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Descrição</Label>
                <Textarea
                  placeholder="Instruções, objetivos, critérios de avaliação..."
                  className="rounded-xl bg-white mt-1"
                  rows={4}
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Anexos (opcional)</Label>
                <div className="mt-1">
                  <Button 
                    type="button"
                    variant="outline" 
                    className="w-full rounded-xl border-dashed border-2 h-20 hover:bg-violet-50 hover:border-violet-300"
                  >
                    <div className="text-center">
                      <Upload className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                      <span className="text-sm text-gray-600">Clique para selecionar arquivos</span>
                    </div>
                  </Button>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button className="rounded-xl bg-violet-600 hover:bg-violet-700">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Publicar Agora
                </Button>
                <Button variant="outline" className="rounded-xl">
                  <Calendar className="h-4 w-4 mr-2" />
                  Agendar Publicação
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Formulário de Editar Atividade */}
      {editingActivity && (
        <Card className="rounded-xl shadow-md border-2 border-blue-200">
          <CardContent className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Edit2 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Editar Atividade</h2>
                  <p className="text-sm text-gray-500">Atualize os dados abaixo</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setEditingActivity(null)}
                className="rounded-xl"
              >
                Cancelar
              </Button>
            </div>

            <form className="space-y-4" onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              onEditActivity(editingActivity.id, {
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                dueDate: formData.get('dueDate') as string,
                coins: Number(formData.get('coins')),
                discipline: formData.get('discipline') as string,
              });
              setEditingActivity(null);
            }}>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Título</Label>
                  <Input
                    name="title"
                    defaultValue={editingActivity.title}
                    placeholder="Ex: Lista de Exercícios 1"
                    className="rounded-xl mt-1"
                    required
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Disciplina</Label>
                  <Input
                    name="discipline"
                    defaultValue={editingActivity.discipline}
                    placeholder="Ex: Matemática"
                    className="rounded-xl mt-1"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Data de entrega</Label>
                  <Input 
                    name="dueDate"
                    type="date" 
                    defaultValue={editingActivity.dueDate}
                    className="rounded-xl mt-1" 
                    required
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Moedas</Label>
                  <Input 
                    name="coins"
                    type="number" 
                    defaultValue={editingActivity.coins}
                    className="rounded-xl mt-1"
                    min={1}
                    required
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Descrição</Label>
                <Textarea
                  name="description"
                  defaultValue={editingActivity.description}
                  placeholder="Instruções, objetivos, critérios de avaliação..."
                  className="rounded-xl bg-white mt-1"
                  rows={4}
                  required
                />
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button type="submit" className="rounded-xl bg-blue-600 hover:bg-blue-700">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Salvar Alterações
                </Button>
                <Button 
                  type="button"
                  variant="outline" 
                  className="rounded-xl"
                  onClick={() => setEditingActivity(null)}
                >
                  Cancelar
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
                placeholder="Buscar por título ou descrição..."
                className="rounded-xl pl-10 h-12 text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Filtros em Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-gray-700">Filtrar por:</span>
              <button
                onClick={() => setFilterStatus("todas")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filterStatus === "todas"
                    ? "bg-violet-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Todas ({stats.total})
              </button>
              <button
                onClick={() => setFilterStatus("pendente")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filterStatus === "pendente"
                    ? "bg-amber-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Clock className="h-3.5 w-3.5 inline mr-1.5" />
                Pendentes ({stats.pendente})
              </button>
              <button
                onClick={() => setFilterStatus("entregue")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filterStatus === "entregue"
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <AlertCircle className="h-3.5 w-3.5 inline mr-1.5" />
                Para Corrigir ({stats.entregue})
              </button>
              <button
                onClick={() => setFilterStatus("corrigida")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filterStatus === "corrigida"
                    ? "bg-green-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <CheckCircle2 className="h-3.5 w-3.5 inline mr-1.5" />
                Corrigidas ({stats.corrigida})
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Atividades */}
      <div className="space-y-4">
        {filteredActivities.length === 0 ? (
          <Card className="rounded-xl shadow-sm">
            <CardContent className="p-12 text-center">
              <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma atividade encontrada</h3>
              <p className="text-gray-600">
                {searchTerm || filterStatus !== "todas" 
                  ? "Tente ajustar os filtros de busca"
                  : "Comece criando sua primeira atividade"
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredActivities.map((activity) => {
            const statusConfig = getStatusConfig(activity.status);
            const StatusIcon = statusConfig.icon;
            const submissionRate = activity.totalStudents 
              ? ((activity.submissions || 0) / activity.totalStudents * 100).toFixed(0)
              : 0;

            return (
              <Card key={activity.id} className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{activity.title}</h3>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusConfig.color}`}>
                          <StatusIcon className="h-3 w-3" />
                          {statusConfig.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-xl"
                        onClick={() => setEditingActivity(activity)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl text-red-600 hover:bg-red-50 hover:border-red-300"
                        onClick={() => setDeletingActivityId(activity.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Entrega:</span>
                      <span className="font-semibold text-gray-900">{activity.dueDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Coins className="h-4 w-4 text-amber-500" />
                      <span className="text-gray-600">Recompensa:</span>
                      <span className="font-semibold text-amber-600">{activity.coins} moedas</span>
                    </div>
                    {activity.totalStudents && (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">Entregas:</span>
                        <span className="font-semibold text-gray-900">
                          {activity.submissions || 0}/{activity.totalStudents}
                        </span>
                        <span className="text-gray-500">({submissionRate}%)</span>
                      </div>
                    )}
                  </div>

                  {/* Barra de progresso de entregas */}
                  {activity.totalStudents && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-600">Progresso de entregas</span>
                        <span className="text-xs font-semibold text-gray-900">{submissionRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                        <div 
                          className="bg-violet-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${submissionRate}%` }}
                        />
                      </div>
                      <div className="flex gap-2">
                        {activity.submissions && activity.submissions > 0 ? (
                          <>
                            <Button 
                              onClick={() => setViewingSubmissions(activity)}
                              variant="outline"
                              className="flex-1 rounded-xl"
                              size="sm"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Ver Submissões ({activity.submissions})
                            </Button>
                            <Button 
                              onClick={() => router.push(`/professor/atividades/${activity.id}/corrigir`)}
                              className="flex-1 rounded-xl bg-violet-600 hover:bg-violet-700"
                              size="sm"
                            >
                              <ClipboardCheck className="h-4 w-4 mr-2" />
                              Corrigir
                            </Button>
                          </>
                        ) : (
                          <Button 
                            disabled
                            variant="outline"
                            className="w-full rounded-xl"
                            size="sm"
                          >
                            <AlertCircle className="h-4 w-4 mr-2" />
                            Aguardando entregas
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Dialog de Visualização de Submissões */}
      <Dialog open={!!viewingSubmissions} onOpenChange={(open) => !open && setViewingSubmissions(null)}>
        <DialogContent className="rounded-xl max-w-4xl bg-white max-h-[85vh] overflow-hidden">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="text-2xl text-gray-900">
              Submissões - {viewingSubmissions?.title}
            </DialogTitle>
            <p className="text-sm text-gray-600 mt-1">
              {viewingSubmissions?.submissions || 0} aluno(s) entregaram esta atividade
            </p>
          </DialogHeader>
          
          <div className="overflow-y-auto max-h-[calc(85vh-180px)] py-4">
            <div className="space-y-3">
              {mockSubmissions.map((submission) => (
                <Card key={submission.id} className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="h-10 w-10 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                          <Users className="h-5 w-5 text-violet-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900">{submission.studentName}</h4>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                              submission.status === "aprovado" 
                                ? "bg-green-100 text-green-700"
                                : submission.status === "reprovado"
                                ? "bg-red-100 text-red-700"
                                : "bg-amber-100 text-amber-700"
                            }`}>
                              {submission.status === "aprovado" ? "Aprovado" : 
                               submission.status === "reprovado" ? "Reprovado" : "Pendente"}
                            </span>
                            {submission.grade !== undefined && (
                              <span className="text-sm font-semibold text-gray-700">
                                Nota: {submission.grade}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{submission.studentEmail}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {submission.submittedAt}
                            </span>
                            {submission.file && (
                              <span className="flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                {submission.file}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        {submission.file && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-xl"
                            onClick={() => handleDownloadFile(submission.file!)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Baixar
                          </Button>
                        )}
                        <Button
                          onClick={() => {
                            setViewingSubmissions(null);
                            router.push(`/professor/atividades/${viewingSubmissions?.id}/corrigir?studentId=${submission.id}`);
                          }}
                          size="sm"
                          className="rounded-xl bg-violet-600 hover:bg-violet-700"
                        >
                          <ClipboardCheck className="h-4 w-4 mr-1" />
                          Corrigir
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <DialogFooter className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center w-full">
              <div className="text-sm text-gray-600">
                Total de submissões: <span className="font-semibold text-gray-900">{viewingSubmissions?.submissions || 0}</span>
              </div>
              <Button
                variant="outline"
                onClick={() => setViewingSubmissions(null)}
                className="rounded-xl"
              >
                Fechar
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog open={!!deletingActivityId} onOpenChange={(open) => !open && setDeletingActivityId(null)}>
        <DialogContent className="rounded-xl max-w-md bg-white">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <DialogTitle className="text-xl text-gray-900">Excluir Atividade?</DialogTitle>
            </div>
            <DialogDescription className="text-base text-gray-600 pt-2">
              Tem certeza que deseja excluir esta atividade? Esta ação não pode ser desfeita e todos os dados relacionados serão perdidos permanentemente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={() => setDeletingActivityId(null)}
              className="rounded-xl"
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                if (deletingActivityId) {
                  onDeleteActivity(deletingActivityId);
                  setDeletingActivityId(null);
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
    </div>
  );
}