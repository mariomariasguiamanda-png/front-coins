import { ProfessorLayout } from "@/components/professor/ProfessorLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Download, 
  Eye, 
  CheckCircle2, 
  XCircle,
  Clock,
  FileText,
  User,
  Calendar,
  Coins,
  Save
} from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";

interface Submission {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  submittedAt: string;
  status: "pendente" | "aprovada" | "reprovada";
  grade?: number;
  feedback?: string;
  files: {
    name: string;
    url: string;
    size: string;
  }[];
}

export default function CorrigirAtividadePage() {
  const router = useRouter();
  const { id } = router.query;

  // Mock data
  const [activity] = useState({
    id: "1",
    title: "Lista de Exercícios - Funções Quadráticas",
    description: "Resolver os exercícios 1 a 15 sobre funções quadráticas. Inclui análise de gráficos e aplicações práticas.",
    dueDate: "2024-11-15",
    coins: 15,
    discipline: "Matemática"
  });

  const [submissions, setSubmissions] = useState<Submission[]>([
    {
      id: "1",
      studentId: "s1",
      studentName: "Ana Silva",
      submittedAt: "2024-11-14 18:30",
      status: "pendente",
      files: [
        { name: "exercicios-1-a-15.pdf", url: "#", size: "2.3 MB" }
      ]
    },
    {
      id: "2",
      studentId: "s2",
      studentName: "Bruno Costa",
      submittedAt: "2024-11-15 09:15",
      status: "aprovada",
      grade: 9.5,
      feedback: "Excelente trabalho! Todos os exercícios corretos.",
      files: [
        { name: "resolucao-funcoes.pdf", url: "#", size: "1.8 MB" }
      ]
    },
    {
      id: "3",
      studentId: "s3",
      studentName: "Carlos Santos",
      submittedAt: "2024-11-13 20:45",
      status: "pendente",
      files: [
        { name: "atividade-matematica.pdf", url: "#", size: "3.1 MB" },
        { name: "graficos.jpg", url: "#", size: "450 KB" }
      ]
    },
    {
      id: "4",
      studentId: "s4",
      studentName: "Diana Oliveira",
      submittedAt: "2024-11-14 22:00",
      status: "aprovada",
      grade: 8.0,
      feedback: "Bom trabalho, mas atenção aos exercícios 10 e 12.",
      files: [
        { name: "lista-completa.pdf", url: "#", size: "2.7 MB" }
      ]
    },
    {
      id: "5",
      studentId: "s5",
      studentName: "Eduardo Lima",
      submittedAt: "2024-11-15 23:50",
      status: "reprovada",
      grade: 4.5,
      feedback: "Muitos erros conceituais. Por favor, revise a teoria antes de refazer.",
      files: [
        { name: "tentativa-exercicios.pdf", url: "#", size: "1.2 MB" }
      ]
    },
  ]);

  const [expandedSubmission, setExpandedSubmission] = useState<string | null>(null);
  const [editingGrades, setEditingGrades] = useState<{[key: string]: {grade: number, feedback: string}}>({});

  // Função para fazer download do arquivo
  const handleDownloadFile = (fileName: string, fileUrl: string) => {
    // Simula o download (em produção, seria uma chamada real à API)
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.target = '_blank';
    
    // Se for produção com URL real, apenas abrir o link
    if (fileUrl === '#') {
      // Mock: criar um blob fake para simular download
      alert(`Download iniciado: ${fileName}\n\nEm produção, o arquivo seria baixado automaticamente.`);
    } else {
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleSaveGrade = (submissionId: string) => {
    const gradeData = editingGrades[submissionId];
    if (!gradeData) return;

    setSubmissions(submissions.map(sub => 
      sub.id === submissionId 
        ? { 
            ...sub, 
            grade: gradeData.grade,
            feedback: gradeData.feedback,
            status: gradeData.grade >= 6 ? "aprovada" : "reprovada"
          } 
        : sub
    ));
    
    // Remove from editing
    const newEditingGrades = { ...editingGrades };
    delete newEditingGrades[submissionId];
    setEditingGrades(newEditingGrades);
    setExpandedSubmission(null);
  };

  const getStatusConfig = (status: string) => {
    switch(status) {
      case "pendente":
        return { color: "bg-amber-100 text-amber-700 border-amber-200", icon: Clock, label: "Pendente" };
      case "aprovada":
        return { color: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle2, label: "Aprovada" };
      case "reprovada":
        return { color: "bg-red-100 text-red-700 border-red-200", icon: XCircle, label: "Reprovada" };
      default:
        return { color: "bg-gray-100 text-gray-700 border-gray-200", icon: Clock, label: status };
    }
  };

  const stats = {
    total: submissions.length,
    pendente: submissions.filter(s => s.status === "pendente").length,
    aprovada: submissions.filter(s => s.status === "aprovada").length,
    reprovada: submissions.filter(s => s.status === "reprovada").length,
  };

  return (
    <ProfessorLayout>
      <div className="space-y-6 pb-8">
        {/* Header */}
        <div>
          <Button
            variant="outline"
            onClick={() => router.push("/professor/atividades")}
            className="rounded-xl mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Atividades
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{activity.title}</h1>
              <p className="text-gray-600 mt-1">{activity.description}</p>
              <div className="flex items-center gap-4 mt-3 text-sm">
                <span className="flex items-center gap-1.5 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  Entrega: {activity.dueDate}
                </span>
                <span className="flex items-center gap-1.5 text-amber-600 font-semibold">
                  <Coins className="h-4 w-4" />
                  {activity.coins} moedas
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="rounded-xl shadow-sm border-l-4 border-l-violet-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Entregas</p>
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

          <Card className="rounded-xl shadow-sm border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Aprovadas</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.aprovada}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl shadow-sm border-l-4 border-l-red-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Reprovadas</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.reprovada}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Entregas */}
        <div className="space-y-4">
          {submissions.map((submission) => {
            const statusConfig = getStatusConfig(submission.status);
            const StatusIcon = statusConfig.icon;
            const isExpanded = expandedSubmission === submission.id;
            const isEditing = !!editingGrades[submission.id];

            return (
              <Card key={submission.id} className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  {/* Header da Entrega */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-violet-100 flex items-center justify-center">
                        <span className="text-lg font-bold text-violet-700">
                          {submission.studentName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          {submission.studentName}
                          <Badge className={`${statusConfig.color} border font-semibold`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusConfig.label}
                          </Badge>
                        </h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1.5 mt-1">
                          <Clock className="h-3.5 w-3.5" />
                          Entregue em: {submission.submittedAt}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setExpandedSubmission(isExpanded ? null : submission.id)}
                        className="rounded-xl"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        {isExpanded ? "Recolher" : "Detalhes"}
                      </Button>
                    </div>
                  </div>

                  {/* Arquivos */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {submission.files.map((file, idx) => (
                      <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <span className="text-xs text-gray-500">({file.size})</span>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-6 w-6 p-0 ml-1 hover:bg-violet-100 hover:border-violet-300"
                          onClick={() => handleDownloadFile(file.name, file.url)}
                          title={`Baixar ${file.name}`}
                        >
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* Nota e Feedback Existente */}
                  {submission.grade !== undefined && !isEditing && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Nota:</span>
                        <span className={`text-2xl font-bold ${
                          submission.grade >= 6 ? "text-green-600" : "text-red-600"
                        }`}>
                          {submission.grade.toFixed(1)}
                        </span>
                      </div>
                      {submission.feedback && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">Feedback:</span>
                          <p className="text-sm text-gray-600 mt-1">{submission.feedback}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Formulário de Correção (Expandido) */}
                  {isExpanded && (
                    <div className="border-t pt-4 mt-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-4">Avaliar Entrega</h4>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Nota (0 a 10)</Label>
                          <Input
                            type="number"
                            min="0"
                            max="10"
                            step="0.5"
                            defaultValue={submission.grade || 0}
                            onChange={(e) => setEditingGrades({
                              ...editingGrades,
                              [submission.id]: {
                                grade: parseFloat(e.target.value),
                                feedback: editingGrades[submission.id]?.feedback || submission.feedback || ""
                              }
                            })}
                            className="rounded-xl mt-1"
                            placeholder="Ex: 8.5"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Feedback</Label>
                          <Textarea
                            defaultValue={submission.feedback || ""}
                            onChange={(e) => setEditingGrades({
                              ...editingGrades,
                              [submission.id]: {
                                grade: editingGrades[submission.id]?.grade || submission.grade || 0,
                                feedback: e.target.value
                              }
                            })}
                            className="rounded-xl mt-1"
                            rows={3}
                            placeholder="Comentários sobre o desempenho do aluno..."
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleSaveGrade(submission.id)}
                            disabled={!editingGrades[submission.id]}
                            className="rounded-xl bg-green-600 hover:bg-green-700"
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Salvar Avaliação
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setExpandedSubmission(null)}
                            className="rounded-xl"
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </ProfessorLayout>
  );
}
