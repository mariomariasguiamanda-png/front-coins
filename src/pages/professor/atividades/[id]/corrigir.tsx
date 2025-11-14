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
import { useState, useEffect } from "react";

interface Submission {
  id: string;
  studentName: string;
  studentEmail: string;
  submittedAt: string;
  status: "pendente" | "aprovado" | "reprovado";
  grade?: number;
  file?: string;
}

export default function CorrigirAtividadePage() {
  const router = useRouter();
  const { id, studentId } = router.query;

  // Mock data
  const [activity] = useState({
    id: "1",
    title: "Lista de Exercícios - Funções Quadráticas",
    description: "Resolver os exercícios 1 a 15 sobre funções quadráticas. Inclui análise de gráficos e aplicações práticas.",
    dueDate: "2024-11-15",
    coins: 15,
    discipline: "Matemática",
    submissions: 15
  });

  // Mesma lista de nomes usada em AtividadesProfessor
  const studentNames = [
    { name: "João Silva", email: "joao@email.com" },
    { name: "Maria Santos", email: "maria@email.com" },
    { name: "Pedro Costa", email: "pedro@email.com" },
    { name: "Ana Oliveira", email: "ana@email.com" },
    { name: "Carlos Mendes", email: "carlos@email.com" },
    { name: "Beatriz Lima", email: "beatriz@email.com" },
    { name: "Rafael Souza", email: "rafael@email.com" },
    { name: "Juliana Rocha", email: "juliana@email.com" },
    { name: "Lucas Ferreira", email: "lucas@email.com" },
    { name: "Camila Alves", email: "camila@email.com" },
    { name: "Felipe Barbosa", email: "felipe@email.com" },
    { name: "Larissa Martins", email: "larissa@email.com" },
    { name: "Bruno Silva", email: "bruno@email.com" },
    { name: "Patricia Souza", email: "patricia@email.com" },
    { name: "Ricardo Lima", email: "ricardo@email.com" },
    { name: "Fernanda Costa", email: "fernanda@email.com" },
    { name: "Thiago Santos", email: "thiago@email.com" },
    { name: "Amanda Rocha", email: "amanda@email.com" },
    { name: "Gabriel Alves", email: "gabriel@email.com" },
    { name: "Mariana Dias", email: "mariana@email.com" },
    { name: "Rodrigo Carvalho", email: "rodrigo@email.com" },
    { name: "Isabela Teixeira", email: "isabela@email.com" },
    { name: "Diego Monteiro", email: "diego@email.com" },
    { name: "Carolina Nunes", email: "carolina@email.com" },
    { name: "Vinícius Castro", email: "vinicius@email.com" },
    { name: "Aline Cardoso", email: "aline@email.com" },
    { name: "Mateus Ribeiro", email: "mateus@email.com" },
    { name: "Sabrina Moreira", email: "sabrina@email.com" },
    { name: "Eduardo Araújo", email: "eduardo@email.com" },
    { name: "Letícia Freitas", email: "leticia@email.com" }
  ];

  // Função para gerar número pseudoaleatório baseado em seed
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  // Gerar submissões usando a mesma lógica
  const generateSubmissions = (): Submission[] => {
    const count = activity.submissions || 0;
    const submissions: Submission[] = [];
    const activitySeed = parseInt(activity.id) || 1;
    
    for (let i = 0; i < count; i++) {
      const student = studentNames[i % studentNames.length];
      const randomStatus = seededRandom(activitySeed * 1000 + i);
      const status: "pendente" | "aprovado" | "reprovado" = 
        randomStatus > 0.7 ? "pendente" : randomStatus > 0.1 ? "aprovado" : "reprovado";
      const gradeRandom = seededRandom(activitySeed * 1000 + i + 500);
      const grade = status === "aprovado" ? (7 + gradeRandom * 3) : status === "reprovado" ? (gradeRandom * 6) : undefined;
      
      const dayRandom = seededRandom(activitySeed * 100 + i);
      const hourRandom = seededRandom(activitySeed * 200 + i);
      const minuteRandom = seededRandom(activitySeed * 300 + i);
      
      submissions.push({
        id: `${i + 1}`,
        studentName: `${student.name}${i >= studentNames.length ? ` ${Math.floor(i / studentNames.length) + 1}` : ''}`,
        studentEmail: student.email,
        submittedAt: `2024-11-${String(Math.floor(dayRandom * 7) + 1).padStart(2, '0')} ${String(Math.floor(hourRandom * 12) + 8).padStart(2, '0')}:${String(Math.floor(minuteRandom * 60)).padStart(2, '0')}`,
        status,
        grade: grade ? parseFloat(grade.toFixed(1)) : undefined,
        file: `trabalho_${student.name.split(' ')[0].toLowerCase()}_${i + 1}.pdf`
      });
    }
    
    return submissions;
  };

  const [submissions, setSubmissions] = useState<Submission[]>(generateSubmissions());
  const [editingGrades, setEditingGrades] = useState<{[key: string]: {grade: string, feedback: string}}>({});
  const [expandedSubmission, setExpandedSubmission] = useState<string | null>(null);

  useEffect(() => {
    if (router.isReady && studentId && typeof studentId === 'string') {
      setExpandedSubmission(studentId);
      setTimeout(() => {
        const element = document.getElementById(`submission-${studentId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  }, [router.isReady, studentId]);

  const stats = {
    total: submissions.length,
    pendente: submissions.filter(s => s.status === "pendente").length,
    aprovada: submissions.filter(s => s.status === "aprovado").length,
    reprovada: submissions.filter(s => s.status === "reprovado").length,
  };

  const getStatusConfig = (status: string) => {
    switch(status) {
      case "pendente":
        return { 
          color: "text-amber-700 bg-amber-100 border-amber-200", 
          icon: Clock,
          label: "Pendente"
        };
      case "aprovado":
        return { 
          color: "text-green-700 bg-green-100 border-green-200", 
          icon: CheckCircle2,
          label: "Aprovada"
        };
      case "reprovado":
        return { 
          color: "text-red-700 bg-red-100 border-red-200", 
          icon: XCircle,
          label: "Reprovada"
        };
      default:
        return { 
          color: "text-gray-700 bg-gray-100 border-gray-200", 
          icon: FileText,
          label: status
        };
    }
  };

  const handleStartEdit = (submissionId: string, currentGrade?: number, currentFeedback?: string) => {
    setEditingGrades({
      ...editingGrades,
      [submissionId]: {
        grade: currentGrade?.toString() || '',
        feedback: currentFeedback || ''
      }
    });
  };

  const handleSaveGrade = (submissionId: string) => {
    const editData = editingGrades[submissionId];
    if (!editData) return;

    setSubmissions(submissions.map(sub => {
      if (sub.id === submissionId) {
        const grade = parseFloat(editData.grade);
        return {
          ...sub,
          grade: isNaN(grade) ? undefined : grade,
          status: isNaN(grade) ? "pendente" : grade >= 7 ? "aprovado" : "reprovado"
        };
      }
      return sub;
    }));

    const newEditingGrades = {...editingGrades};
    delete newEditingGrades[submissionId];
    setEditingGrades(newEditingGrades);
  };

  const handleCancelEdit = (submissionId: string) => {
    const newEditingGrades = {...editingGrades};
    delete newEditingGrades[submissionId];
    setEditingGrades(newEditingGrades);
  };

  const handleDownloadFile = (fileName: string) => {
    const content = `Conteúdo simulado do arquivo: ${fileName}`;
    const blob = new Blob([content], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
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
              <div 
                key={submission.id} 
                id={`submission-${submission.id}`}
                className="scroll-mt-20"
              >
                <Card className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
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

                  {/* Arquivo */}
                  {submission.file && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{submission.file}</span>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-6 w-6 p-0 ml-1 hover:bg-violet-100 hover:border-violet-300"
                          onClick={() => handleDownloadFile(submission.file!)}
                          title={`Baixar ${submission.file}`}
                        >
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Nota Existente */}
                  {submission.grade !== undefined && !isEditing && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Nota:</span>
                        <span className={`text-2xl font-bold ${
                          submission.grade >= 7 ? "text-green-600" : "text-red-600"
                        }`}>
                          {submission.grade.toFixed(1)}
                        </span>
                      </div>
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
                                grade: e.target.value,
                                feedback: editingGrades[submission.id]?.feedback || ""
                              }
                            })}
                            className="rounded-xl mt-1"
                            placeholder="Ex: 8.5"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Feedback</Label>
                          <Textarea
                            defaultValue=""
                            onChange={(e) => setEditingGrades({
                              ...editingGrades,
                              [submission.id]: {
                                grade: editingGrades[submission.id]?.grade || submission.grade?.toString() || "0",
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
              </div>
            );
          })}
        </div>
      </div>
    </ProfessorLayout>
  );
}
