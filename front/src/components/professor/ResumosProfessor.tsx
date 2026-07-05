import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
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
  BookOpen,
  FileText,
  LinkIcon,
  Upload,
  Plus,
  Edit2,
  Trash2,
  Search,
  Paperclip,
  ExternalLink,
  AlertTriangle,
  Save,
  Eye,
  Calendar,
  Download,
  Link2,
  X,
} from "lucide-react";
import { useState } from "react";

interface Summary {
  id: string;
  title: string;
  content: string;
  attachments: string[];
  links: string[];
  discipline: string;
  id_disciplina: string;
  createdAt: string;
  views: number;
}

interface DisciplinaOption {
  id: string;
  nome: string;
}

interface ResumosProfessorProps {
  summaries: Summary[];
  disciplinas: DisciplinaOption[];
  onCreateSummary: (dados: {
    titulo: string;
    conteudo: string;
    id_disciplina: string;
    links: string[];
  }) => Promise<void>;
  onEditSummary: (
    id: string,
    dados: { titulo: string; conteudo: string; links: string[] }
  ) => Promise<void>;
  onDeleteSummary: (id: string) => Promise<void>;
  onUploadAnexos: (id: string, files: File[]) => Promise<void>;
  onRemoveAnexo: (id: string, caminho: string) => Promise<void>;
  resolveUrl: (path: string) => string;
}

export function ResumosProfessor({
  summaries = [],
  disciplinas = [],
  onCreateSummary,
  onEditSummary,
  onDeleteSummary,
  onUploadAnexos,
  onRemoveAnexo,
  resolveUrl,
}: ResumosProfessorProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingSummary, setEditingSummary] = useState<Summary | null>(null);
  const [deletingSummaryId, setDeletingSummaryId] = useState<string | null>(null);
  const [viewingSummary, setViewingSummary] = useState<Summary | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [novosLinks, setNovosLinks] = useState<string[]>([]);
  const [linkInput, setLinkInput] = useState("");

  const filteredSummaries = summaries.filter(summary => {
    return (
      summary.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      summary.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      summary.discipline.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const stats = {
    total: summaries.length,
    disciplinas: new Set(summaries.map(s => s.discipline)).size,
    views: summaries.reduce((acc, s) => acc + s.views, 0),
  };

  const adicionarLink = () => {
    if (linkInput.trim()) {
      setNovosLinks([...novosLinks, linkInput.trim()]);
      setLinkInput("");
    }
  };

  const handleViewSummary = (summary: Summary) => {
    setViewingSummary(summary);
  };

  const handleUploadAnexos = async (id: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    await onUploadAnexos(id, Array.from(files));
    event.target.value = "";
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
      <div className="grid gap-4 md:grid-cols-3">
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

        <Card className="rounded-xl shadow-sm border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Disciplinas</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.disciplinas}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Visualizações</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.views}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Eye className="h-5 w-5 text-amber-600" />
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
                onClick={() => {
                  setShowCreateForm(false);
                  setNovosLinks([]);
                }}
                className="rounded-xl"
              >
                Cancelar
              </Button>
            </div>

            <form
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                await onCreateSummary({
                  titulo: formData.get('titulo') as string,
                  conteudo: formData.get('conteudo') as string,
                  id_disciplina: formData.get('id_disciplina') as string,
                  links: novosLinks,
                });
                setNovosLinks([]);
                setShowCreateForm(false);
              }}
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Título</Label>
                  <Input
                    name="titulo"
                    placeholder="Ex: Revisão - Funções do 2º Grau"
                    className="rounded-xl mt-1"
                    required
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Disciplina</Label>
                  <Select name="id_disciplina" required>
                    <SelectTrigger className="rounded-xl mt-1 bg-white">
                      <SelectValue placeholder="Selecione a disciplina" />
                    </SelectTrigger>
                    <SelectContent>
                      {disciplinas.map((d) => (
                        <SelectItem key={d.id} value={d.id}>{d.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Conteúdo</Label>
                <Textarea
                  name="conteudo"
                  placeholder="Digite o conteúdo do resumo, conceitos principais, exemplos..."
                  className="min-h-[180px] rounded-xl mt-1"
                  required
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Links de referência (opcional)</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    value={linkInput}
                    onChange={(e) => setLinkInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        adicionarLink();
                      }
                    }}
                    placeholder="https://exemplo.com"
                    className="rounded-xl"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-xl"
                    onClick={adicionarLink}
                  >
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                </div>
                {novosLinks.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {novosLinks.map((link, index) => (
                      <div key={index} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded-lg">
                        <span className="text-gray-700 truncate">{link}</span>
                        <button
                          type="button"
                          onClick={() => setNovosLinks(novosLinks.filter((_, i) => i !== index))}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-500">
                Anexos podem ser adicionados depois de criar o resumo, na tela de detalhes.
              </p>

              <div className="flex gap-2 pt-4 border-t">
                <Button type="submit" className="rounded-xl bg-violet-600 hover:bg-violet-700">
                  <Save className="h-4 w-4 mr-2" />
                  Publicar Resumo
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Busca */}
      <Card className="rounded-xl shadow-sm">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Buscar por título, conteúdo ou disciplina..."
              className="rounded-xl pl-10 h-12 text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
                {searchTerm ? "Tente ajustar a busca" : "Comece criando seu primeiro resumo"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredSummaries.map((summary) => (
            <Card key={summary.id} className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-10 w-10 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
                        <FileText className="h-5 w-5 text-violet-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{summary.title}</h3>
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
                    : summary.content}
                </div>

                {(summary.attachments.length > 0 || summary.links.length > 0) && (
                  <div className="flex flex-wrap gap-4 mb-4 pb-4 border-b">
                    {summary.attachments.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <Paperclip className="h-4 w-4 text-gray-400" />
                        <span className="text-xs text-gray-500">{summary.attachments.length} anexo(s)</span>
                      </div>
                    )}
                    {summary.links.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <ExternalLink className="h-4 w-4 text-gray-400" />
                        <span className="text-xs text-gray-500">{summary.links.length} link(s)</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    Criado em {new Date(summary.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                  <span className="text-gray-500">
                    {summary.views} visualizações
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Formulário de Editar Resumo */}
      {editingSummary && (
        <Card className="rounded-xl shadow-md border-2 border-blue-200 fixed inset-4 z-50 overflow-auto">
          <CardContent className="p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Edit2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Editar Resumo</h2>
                <p className="text-sm text-gray-500">Atualize as informações abaixo</p>
              </div>
            </div>

            <form
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                await onEditSummary(editingSummary.id, {
                  titulo: formData.get('titulo') as string,
                  conteudo: formData.get('conteudo') as string,
                  links: editingSummary.links,
                });
                setEditingSummary(null);
              }}
            >
              <div>
                <Label className="text-sm font-medium text-gray-700">Título</Label>
                <Input
                  name="titulo"
                  defaultValue={editingSummary.title}
                  className="rounded-xl mt-1"
                  required
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Conteúdo</Label>
                <Textarea
                  name="conteudo"
                  defaultValue={editingSummary.content}
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
              Tem certeza que deseja excluir este resumo? Ele deixará de aparecer para os alunos.
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
              onClick={async () => {
                if (deletingSummaryId) {
                  await onDeleteSummary(deletingSummaryId);
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

      {/* Dialog de Visualização de Resumo */}
      <Dialog open={!!viewingSummary} onOpenChange={(open) => !open && setViewingSummary(null)}>
        <DialogContent className="rounded-xl max-w-4xl bg-white max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader className="border-b pb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-12 w-12 rounded-lg bg-violet-100 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-violet-600" />
                </div>
                <div className="flex-1">
                  <DialogTitle className="text-2xl text-gray-900">{viewingSummary?.title}</DialogTitle>
                  <p className="text-sm text-gray-600 mt-1">{viewingSummary?.discipline}</p>
                </div>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto max-h-[calc(85vh-250px)] space-y-6 py-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>Criado em: {viewingSummary && new Date(viewingSummary.createdAt).toLocaleDateString('pt-BR')}</span>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FileText className="h-5 w-5 text-violet-600" />
                Conteúdo do Resumo
              </h3>
              <div className="prose prose-sm max-w-none bg-gray-50 rounded-lg p-4 text-gray-700 whitespace-pre-wrap">
                {viewingSummary?.content}
              </div>
            </div>

            {viewingSummary && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Paperclip className="h-5 w-5 text-violet-600" />
                  Arquivos Anexos ({viewingSummary.attachments.length})
                </h3>
                <div className="space-y-2">
                  {viewingSummary.attachments.map((caminho, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-8 w-8 rounded bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <Paperclip className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-900 truncate">{caminho.split('/').pop()}</span>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <a href={resolveUrl(caminho)} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm" className="rounded-lg">
                            <Download className="h-4 w-4" />
                          </Button>
                        </a>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-lg text-red-600 hover:bg-red-50"
                          onClick={() => onRemoveAnexo(viewingSummary.id, caminho)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <label className="mt-3 inline-block">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.zip"
                    className="hidden"
                    onChange={(e) => handleUploadAnexos(viewingSummary.id, e)}
                  />
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
                    <Upload className="h-4 w-4" />
                    Adicionar anexo
                  </span>
                </label>
              </div>
            )}

            {viewingSummary && viewingSummary.links.length > 0 && (
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
