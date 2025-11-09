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
  FileText, 
  LinkIcon, 
  Upload,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  Paperclip,
  ExternalLink,
  AlertTriangle,
  Save,
  Eye,
  X,
  User,
  Calendar,
  Download,
  Link2
} from "lucide-react";
import { useState } from "react";

interface Summary {
  id: string;
  title: string;
  content: string;
  attachments?: string[];
  links?: string[];
  discipline: string;
  createdAt: string;
  status: "pending" | "approved" | "rejected";
  views?: number;
  author?: string;
  date?: string;
}

interface ResumosProfessorProps {
  summaries: Summary[];
  onCreateSummary: (summary: Omit<Summary, "id" | "createdAt" | "status">) => void;
  onEditSummary: (id: string, summary: Partial<Summary>) => void;
  onDeleteSummary: (id: string) => void;
  onApproveSummary: (id: string) => void;
  onRejectSummary: (id: string) => void;
}

export function ResumosProfessor({
  summaries = [],
  onCreateSummary,
  onEditSummary,
  onDeleteSummary,
  onApproveSummary,
  onRejectSummary,
}: ResumosProfessorProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingSummary, setEditingSummary] = useState<Summary | null>(null);
  const [deletingSummaryId, setDeletingSummaryId] = useState<string | null>(null);
  const [viewingSummary, setViewingSummary] = useState<Summary | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("todos");
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrar resumos
  const filteredSummaries = summaries.filter(summary => {
    const matchesSearch = summary.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         summary.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         summary.discipline.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "todos" || summary.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Estatísticas
  const stats = {
    total: summaries.length,
    approved: summaries.filter(s => s.status === "approved").length,
    pending: summaries.filter(s => s.status === "pending").length,
    rejected: summaries.filter(s => s.status === "rejected").length,
  };

  const getStatusConfig = (status: string) => {
    switch(status) {
      case "approved":
        return { 
          color: "text-green-700 bg-green-100 border-green-200", 
          icon: CheckCircle2,
          label: "Aprovado"
        };
      case "pending":
        return { 
          color: "text-amber-700 bg-amber-100 border-amber-200", 
          icon: Clock,
          label: "Pendente"
        };
      case "rejected":
        return { 
          color: "text-red-700 bg-red-100 border-red-200", 
          icon: XCircle,
          label: "Rejeitado"
        };
      default:
        return { 
          color: "text-gray-700 bg-gray-100 border-gray-200", 
          icon: Clock,
          label: status
        };
    }
  };

  const handleViewSummary = (summary: Summary) => {
    setViewingSummary(summary);
  };

  const handleDownloadAttachment = (fileName: string) => {
    alert(`Baixando arquivo: ${fileName}\n\nEm produção, isso iniciaria o download do arquivo.`);
  };


  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Resumos</h1>
          <p className="text-gray-600 mt-1">Gerencie os resumos e materiais de estudo das suas disciplinas</p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="rounded-xl bg-violet-600 hover:bg-violet-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Resumo
        </Button>
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

        <Card className="rounded-xl shadow-sm border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aprovados</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.approved}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.pending}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejeitados</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.rejected}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Formulário de Criar Resumo */}
      {showCreateForm && (
        <Card className="rounded-xl shadow-md border-2 border-violet-200">
          <CardContent className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-violet-100 flex items-center justify-center">
                  <Plus className="h-5 w-5 text-violet-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Novo Resumo</h2>
                  <p className="text-sm text-gray-500">Crie um material de estudo para seus alunos</p>
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
                    placeholder="Ex: Revisão - Funções do 2º Grau" 
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

              <div>
                <Label className="text-sm font-medium text-gray-700">Conteúdo</Label>
                <Textarea 
                  placeholder="Digite o conteúdo do resumo, conceitos principais, exemplos..." 
                  className="min-h-[180px] rounded-xl mt-1" 
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Link de referência (opcional)</Label>
                  <div className="flex gap-2 mt-1">
                    <Input 
                      placeholder="https://exemplo.com" 
                      className="rounded-xl" 
                    />
                    <Button 
                      type="button"
                      variant="outline" 
                      size="sm" 
                      className="rounded-xl"
                    >
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Anexos (opcional)</Label>
                  <Button 
                    type="button"
                    variant="outline" 
                    className="w-full rounded-xl mt-1"
                  >
                    <Upload className="h-4 w-4 mr-2" /> 
                    Selecionar arquivos
                  </Button>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button className="rounded-xl bg-violet-600 hover:bg-violet-700">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Publicar Resumo
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
                placeholder="Buscar por título, conteúdo ou disciplina..."
                className="rounded-xl pl-10 h-12 text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Filtros em Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-gray-700">Filtrar por:</span>
              <button
                onClick={() => setFilterStatus("todos")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filterStatus === "todos"
                    ? "bg-violet-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Todos ({stats.total})
              </button>
              <button
                onClick={() => setFilterStatus("approved")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filterStatus === "approved"
                    ? "bg-green-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <CheckCircle2 className="h-3.5 w-3.5 inline mr-1.5" />
                Aprovados ({stats.approved})
              </button>
              <button
                onClick={() => setFilterStatus("pending")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filterStatus === "pending"
                    ? "bg-amber-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Clock className="h-3.5 w-3.5 inline mr-1.5" />
                Pendentes ({stats.pending})
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Resumos */}
      <div className="space-y-4">
        {filteredSummaries.length === 0 ? (
          <Card className="rounded-xl shadow-sm">
            <CardContent className="p-12 text-center">
              <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum resumo encontrado</h3>
              <p className="text-gray-600">
                {searchTerm || filterStatus !== "todos" 
                  ? "Tente ajustar os filtros de busca"
                  : "Comece criando seu primeiro resumo"
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredSummaries.map((summary) => {
            const statusConfig = getStatusConfig(summary.status);
            const StatusIcon = statusConfig.icon;

            return (
              <Card key={summary.id} className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
                          <FileText className="h-5 w-5 text-violet-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-lg font-semibold text-gray-900">{summary.title}</h3>
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusConfig.color}`}>
                              <StatusIcon className="h-3 w-3" />
                              {statusConfig.label}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{summary.discipline}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-xl"
                        onClick={() => handleViewSummary(summary)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalhes
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-xl"
                        onClick={() => setEditingSummary(summary)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl text-red-600 hover:bg-red-50 hover:border-red-300"
                        onClick={() => setDeletingSummaryId(summary.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="text-sm text-gray-700 leading-relaxed mb-4">
                    {summary.content.length > 250 
                      ? `${summary.content.substring(0, 250)}...` 
                      : summary.content
                    }
                  </div>

                  {/* Anexos e Links */}
                  {((summary.attachments && summary.attachments.length > 0) || 
                    (summary.links && summary.links.length > 0)) && (
                    <div className="flex flex-wrap gap-4 mb-4 pb-4 border-b">
                      {summary.attachments && summary.attachments.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap">
                          <Paperclip className="h-4 w-4 text-gray-400" />
                          {summary.attachments.map((attachment, index) => (
                            <button
                              key={index}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-xs font-medium hover:bg-gray-200 transition-colors"
                            >
                              <FileText className="h-3 w-3" />
                              {attachment}
                            </button>
                          ))}
                        </div>
                      )}
                      {summary.links && summary.links.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap">
                          <ExternalLink className="h-4 w-4 text-gray-400" />
                          {summary.links.map((link, index) => (
                            <a
                              key={index}
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium hover:bg-blue-100 transition-colors"
                            >
                              Link {index + 1}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      Criado em {new Date(summary.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                    {summary.views !== undefined && (
                      <span className="text-gray-500">
                        {summary.views} visualizações
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Formulário de Editar Resumo */}
      {editingSummary && (
        <Card className="rounded-xl shadow-md border-2 border-blue-200 fixed inset-4 z-50 overflow-auto">
          <CardContent className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Edit2 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Editar Resumo</h2>
                  <p className="text-sm text-gray-500">Atualize as informações abaixo</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setEditingSummary(null)}
                className="rounded-xl"
              >
                Cancelar
              </Button>
            </div>

            <form className="space-y-4" onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              onEditSummary(editingSummary.id, {
                title: formData.get('title') as string,
                content: formData.get('content') as string,
                discipline: formData.get('discipline') as string,
              });
              setEditingSummary(null);
            }}>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Título</Label>
                  <Input 
                    name="title"
                    defaultValue={editingSummary.title}
                    placeholder="Ex: Revisão - Funções do 2º Grau" 
                    className="rounded-xl mt-1"
                    required
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Disciplina</Label>
                  <Input 
                    name="discipline"
                    defaultValue={editingSummary.discipline}
                    placeholder="Ex: Matemática" 
                    className="rounded-xl mt-1"
                    required
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Conteúdo</Label>
                <Textarea 
                  name="content"
                  defaultValue={editingSummary.content}
                  placeholder="Digite o conteúdo do resumo, conceitos principais, exemplos..." 
                  className="min-h-[180px] rounded-xl mt-1"
                  required
                />
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
                  onClick={() => setEditingSummary(null)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog open={!!deletingSummaryId} onOpenChange={(open) => !open && setDeletingSummaryId(null)}>
        <DialogContent className="rounded-xl max-w-md bg-white">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <DialogTitle className="text-xl text-gray-900">Excluir Resumo?</DialogTitle>
            </div>
            <DialogDescription className="text-base text-gray-600 pt-2">
              Tem certeza que deseja excluir este resumo? Esta ação não pode ser desfeita e o conteúdo será perdido permanentemente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={() => setDeletingSummaryId(null)}
              className="rounded-xl"
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                if (deletingSummaryId) {
                  onDeleteSummary(deletingSummaryId);
                  setDeletingSummaryId(null);
                }
              }}
              className="rounded-xl bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Visualização de Resumo com Feedback */}
      <Dialog open={!!viewingSummary} onOpenChange={(open) => !open && setViewingSummary(null)}>
        <DialogContent className="rounded-xl max-w-4xl bg-white max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader className="border-b pb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-12 w-12 rounded-lg bg-violet-100 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-violet-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <DialogTitle className="text-2xl text-gray-900">{viewingSummary?.title}</DialogTitle>
                    {viewingSummary && (
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusConfig(viewingSummary.status).color}`}>
                        {(() => {
                          const StatusIcon = getStatusConfig(viewingSummary.status).icon;
                          return <StatusIcon className="h-3 w-3" />;
                        })()}
                        {getStatusConfig(viewingSummary.status).label}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{viewingSummary?.discipline}</p>
                </div>
              </div>
            </div>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto max-h-[calc(85vh-250px)] space-y-6 py-4">
            {/* Informações Básicas */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>Autor: {viewingSummary?.author}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Criado em: {viewingSummary?.date}</span>
              </div>
            </div>

            {/* Conteúdo Completo */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FileText className="h-5 w-5 text-violet-600" />
                Conteúdo do Resumo
              </h3>
              <div className="prose prose-sm max-w-none bg-gray-50 rounded-lg p-4 text-gray-700 whitespace-pre-wrap">
                {viewingSummary?.content}
              </div>
            </div>

            {/* Anexos */}
            {viewingSummary?.attachments && viewingSummary.attachments.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Paperclip className="h-5 w-5 text-violet-600" />
                  Arquivos Anexos ({viewingSummary.attachments.length})
                </h3>
                <div className="space-y-2">
                  {viewingSummary.attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-blue-100 flex items-center justify-center">
                          <Paperclip className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{file}</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-lg"
                        onClick={() => handleDownloadAttachment(file)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            {viewingSummary?.links && viewingSummary.links.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Link2 className="h-5 w-5 text-violet-600" />
                  Links de Referência ({viewingSummary.links.length})
                </h3>
                <div className="space-y-2">
                  {viewingSummary.links.map((link, index) => (
                    <a
                      key={index}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors text-blue-600 hover:text-blue-700"
                    >
                      <ExternalLink className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm break-all">{link}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="border-t pt-4">
            <Button
              variant="outline"
              onClick={() => setViewingSummary(null)}
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