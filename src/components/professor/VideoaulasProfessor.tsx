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
  PlayCircle, 
  Upload, 
  Youtube,
  Plus,
  Edit2,
  Trash2,
  Video,
  Eye,
  Clock,
  Search,
  Filter,
  TrendingUp,
  Users,
  ThumbsUp,
  ExternalLink,
  AlertTriangle,
  Save,
  Play,
  BarChart3,
  CheckCircle2,
  X
} from "lucide-react";
import { useState, useRef } from "react";

interface VideoLesson {
  id: string;
  title: string;
  description: string;
  youtubeUrl?: string;
  videoFile?: string;
  thumbnail?: string;
  discipline: string;
  createdAt: string;
  views: number;
  duration?: string;
  likes?: number;
  status?: "published" | "draft" | "scheduled";
  studentsWatched?: StudentView[];
}

interface StudentView {
  id: string;
  name: string;
  avatar?: string;
  watchedAt: string;
  completed: boolean;
  progress: number;
  timeWatched: string;
}

interface VideoaulasProfessorProps {
  lessons: VideoLesson[];
  onCreateLesson: (lesson: Omit<VideoLesson, "id" | "createdAt" | "views">) => void;
  onEditLesson: (id: string, lesson: Partial<VideoLesson>) => void;
  onDeleteLesson: (id: string) => void;
}

export function VideoaulasProfessor({
  lessons = [],
  onCreateLesson,
  onEditLesson,
  onDeleteLesson,
}: VideoaulasProfessorProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState<VideoLesson | null>(null);
  const [deletingLessonId, setDeletingLessonId] = useState<string | null>(null);
  const [viewingStats, setViewingStats] = useState<VideoLesson | null>(null);
  const [previewingLesson, setPreviewingLesson] = useState<VideoLesson | null>(null);
  const [filterDiscipline, setFilterDiscipline] = useState<string>("todas");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState<File | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Filtrar videoaulas
  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.discipline.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterDiscipline === "todas" || lesson.discipline === filterDiscipline;
    return matchesSearch && matchesFilter;
  });

  // Estatísticas
  const stats = {
    total: lessons.length,
    totalViews: lessons.reduce((acc, lesson) => acc + lesson.views, 0),
    avgViews: lessons.length > 0 ? Math.round(lessons.reduce((acc, lesson) => acc + lesson.views, 0) / lessons.length) : 0,
    totalLikes: lessons.reduce((acc, lesson) => acc + (lesson.likes || 0), 0),
  };

  // Disciplinas únicas
  const disciplines = ["todas", ...Array.from(new Set(lessons.map(l => l.discipline)))];

  const getStatusConfig = (status?: string) => {
    switch(status) {
      case "published":
        return { color: "text-green-700 bg-green-100 border-green-200", label: "Publicado" };
      case "draft":
        return { color: "text-gray-700 bg-gray-100 border-gray-200", label: "Rascunho" };
      case "scheduled":
        return { color: "text-blue-700 bg-blue-100 border-blue-200", label: "Agendado" };
      default:
        return { color: "text-green-700 bg-green-100 border-green-200", label: "Publicado" };
    }
  };

  const extractYouTubeVideoId = (url: string): string | null => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleVideoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedVideo(file);
    }
  };

  const handleThumbnailSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedThumbnail(file);
    }
  };

  const triggerVideoInput = () => {
    const videoInput = document.getElementById('video-input') as HTMLInputElement;
    videoInput?.click();
  };

  const triggerThumbnailInput = () => {
    const thumbnailInput = document.getElementById('thumbnail-input') as HTMLInputElement;
    thumbnailInput?.click();
  };

  const handleSaveDraft = () => {
    if (formRef.current) {
      const formData = new FormData(formRef.current);
      const title = formData.get('title') as string;
      
      // Só salva se pelo menos o título estiver preenchido
      if (title.trim()) {
        onCreateLesson({
          title,
          description: formData.get('description') as string || '',
          discipline: formData.get('discipline') as string || '',
          youtubeUrl: formData.get('youtubeUrl') as string || undefined,
          videoFile: selectedVideo?.name,
          thumbnail: selectedThumbnail?.name,
          status: 'draft',
        });
        setSelectedVideo(null);
        setSelectedThumbnail(null);
        setShowCreateForm(false);
      } else {
        alert('Por favor, preencha pelo menos o título para salvar como rascunho.');
      }
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Videoaulas</h1>
          <p className="text-gray-600 mt-1">Gerencie as videoaulas das suas disciplinas</p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="rounded-xl bg-violet-600 hover:bg-violet-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Videoaula
        </Button>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="rounded-xl shadow-sm border-l-4 border-l-violet-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Vídeos</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-violet-100 flex items-center justify-center">
                <Video className="h-5 w-5 text-violet-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Visualizações</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalViews}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Eye className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Média de Views</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.avgViews}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-l-4 border-l-pink-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Curtidas</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalLikes}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-pink-100 flex items-center justify-center">
                <ThumbsUp className="h-5 w-5 text-pink-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Formulário de Criar Videoaula */}
      {showCreateForm && (
        <Card className="rounded-xl shadow-md border-2 border-violet-200">
          <CardContent className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-violet-100 flex items-center justify-center">
                  <Plus className="h-5 w-5 text-violet-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Nova Videoaula</h2>
                  <p className="text-sm text-gray-500">Adicione um novo vídeo educativo</p>
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

            <form ref={formRef} className="space-y-4" onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              onCreateLesson({
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                discipline: formData.get('discipline') as string,
                youtubeUrl: formData.get('youtubeUrl') as string || undefined,
                videoFile: selectedVideo?.name,
                thumbnail: selectedThumbnail?.name,
                status: 'published',
              });
              setSelectedVideo(null);
              setSelectedThumbnail(null);
              setShowCreateForm(false);
            }}>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Título</Label>
                  <Input 
                    name="title"
                    placeholder="Ex: Introdução à Trigonometria" 
                    className="rounded-xl mt-1"
                    required
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Disciplina</Label>
                  <Input 
                    name="discipline"
                    placeholder="Ex: Matemática" 
                    className="rounded-xl mt-1"
                    required
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Descrição</Label>
                <Textarea 
                  name="description"
                  placeholder="Descreva o conteúdo e objetivos da videoaula..." 
                  className="min-h-[120px] rounded-xl mt-1"
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Link do YouTube</Label>
                  <div className="flex gap-2 mt-1">
                    <Input 
                      name="youtubeUrl"
                      placeholder="https://youtube.com/watch?v=..." 
                      className="rounded-xl" 
                    />
                    <Button 
                      type="button"
                      variant="outline" 
                      size="sm" 
                      className="rounded-xl"
                    >
                      <Youtube className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Cole o link de um vídeo do YouTube</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Ou faça upload</Label>
                  <div className="space-y-2">
                    <input
                      id="video-input"
                      type="file"
                      accept="video/mp4,video/avi,video/mov,video/mkv"
                      onChange={handleVideoSelect}
                      className="hidden"
                    />
                    <Button 
                      type="button"
                      variant="outline" 
                      onClick={triggerVideoInput}
                      className="w-full rounded-xl mt-1"
                    >
                      <Upload className="h-4 w-4 mr-2" /> 
                      Selecionar vídeo local
                    </Button>
                    {selectedVideo && (
                      <div className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded-lg">
                        <span className="text-gray-700">{selectedVideo.name}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedVideo(null)}
                          className="h-6 w-6 p-0 text-red-500 hover:bg-red-50"
                        >
                          ×
                        </Button>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Formatos: MP4, AVI, MOV (max 500MB)</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Thumbnail (opcional)</Label>
                <div className="space-y-2">
                  <input
                    id="thumbnail-input"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleThumbnailSelect}
                    className="hidden"
                  />
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={triggerThumbnailInput}
                    className="w-full rounded-xl mt-1"
                  >
                    <Upload className="h-4 w-4 mr-2" /> 
                    Selecionar imagem de capa
                  </Button>
                  {selectedThumbnail && (
                    <div className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded-lg">
                      <span className="text-gray-700">{selectedThumbnail.name}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedThumbnail(null)}
                        className="h-6 w-6 p-0 text-red-500 hover:bg-red-50"
                      >
                        ×
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button type="submit" className="rounded-xl bg-violet-600 hover:bg-violet-700">
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Publicar Videoaula
                </Button>
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={handleSaveDraft}
                  className="rounded-xl"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Salvar como Rascunho
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
                placeholder="Buscar por título, descrição ou disciplina..."
                className="rounded-xl pl-10 h-12 text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Filtros em Pills */}
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
                  {discipline !== "todas" && ` (${lessons.filter(l => l.discipline === discipline).length})`}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid de Videoaulas */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredLessons.length === 0 ? (
          <div className="col-span-full">
            <Card className="rounded-xl shadow-sm">
              <CardContent className="p-12 text-center">
                <Video className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma videoaula encontrada</h3>
                <p className="text-gray-600">
                  {searchTerm || filterDiscipline !== "todas" 
                    ? "Tente ajustar os filtros de busca"
                    : "Comece criando sua primeira videoaula"
                  }
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredLessons.map((lesson) => {
            const statusConfig = getStatusConfig(lesson.status);

            return (
              <Card key={lesson.id} className="rounded-xl shadow-sm hover:shadow-lg transition-shadow group">
                {/* Thumbnail */}
                <div className="relative aspect-video w-full overflow-hidden rounded-t-xl bg-gradient-to-br from-violet-100 to-blue-100">
                  {lesson.thumbnail ? (
                    <img
                      src={lesson.thumbnail}
                      alt={lesson.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <Video className="h-16 w-16 text-violet-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <PlayCircle className="h-16 w-16 text-white" />
                  </div>
                  {lesson.duration && (
                    <div className="absolute bottom-2 right-2 px-2 py-1 rounded-lg bg-black/70 text-white text-xs font-semibold">
                      {lesson.duration}
                    </div>
                  )}
                  {lesson.status && (
                    <div className={`absolute top-2 left-2 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusConfig.color}`}>
                      {statusConfig.label}
                    </div>
                  )}
                </div>

                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-base line-clamp-2 group-hover:text-violet-600 transition-colors">
                        {lesson.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{lesson.discipline}</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 leading-relaxed line-clamp-2 mb-4">
                    {lesson.description}
                  </p>

                  {/* Métricas */}
                  <div className="flex items-center gap-4 mb-4 pb-4 border-b text-sm text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Eye className="h-4 w-4" />
                      <span>{lesson.views}</span>
                    </div>
                    {lesson.likes !== undefined && (
                      <div className="flex items-center gap-1.5">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{lesson.likes}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 ml-auto">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(lesson.createdAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-xl flex-1"
                        onClick={() => setPreviewingLesson(lesson)}
                      >
                        <Play className="h-4 w-4 mr-1.5" />
                        Preview
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-xl flex-1"
                        onClick={() => setViewingStats(lesson)}
                      >
                        <BarChart3 className="h-4 w-4 mr-1.5" />
                        Stats
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      {lesson.youtubeUrl && (
                        <a 
                          href={lesson.youtubeUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex-1"
                        >
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="rounded-xl w-full"
                          >
                            <Youtube className="h-4 w-4 mr-1.5 text-red-600" />
                            YouTube
                          </Button>
                        </a>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-xl"
                        onClick={() => setEditingLesson(lesson)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl text-red-600 hover:bg-red-50 hover:border-red-300"
                        onClick={() => setDeletingLessonId(lesson.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Formulário de Editar Videoaula */}
      {editingLesson && (
        <Card className="rounded-xl shadow-md border-2 border-blue-200 fixed inset-4 z-50 overflow-auto bg-white">
          <CardContent className="p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Edit2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Editar Videoaula</h2>
                <p className="text-sm text-gray-500">Atualize as informações abaixo</p>
              </div>
            </div>

            <form className="space-y-4" onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              onEditLesson(editingLesson.id, {
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                discipline: formData.get('discipline') as string,
                youtubeUrl: formData.get('youtubeUrl') as string,
                duration: formData.get('duration') as string,
              });
              setEditingLesson(null);
            }}>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Título da Aula</Label>
                  <Input
                    name="title"
                    defaultValue={editingLesson.title}
                    placeholder="Ex: Introdução à Trigonometria"
                    className="rounded-xl mt-1"
                    required
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Disciplina</Label>
                  <Input
                    name="discipline"
                    defaultValue={editingLesson.discipline}
                    placeholder="Ex: Matemática"
                    className="rounded-xl mt-1"
                    required
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Descrição</Label>
                <Textarea
                  name="description"
                  defaultValue={editingLesson.description}
                  placeholder="Descreva o conteúdo da aula, objetivos, tópicos abordados..."
                  className="rounded-xl mt-1"
                  rows={3}
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Link do YouTube</Label>
                  <Input
                    name="youtubeUrl"
                    defaultValue={editingLesson.youtubeUrl}
                    placeholder="https://youtube.com/watch?v=..."
                    className="rounded-xl mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Duração</Label>
                  <Input
                    name="duration"
                    defaultValue={editingLesson.duration}
                    placeholder="Ex: 18:24"
                    className="rounded-xl mt-1"
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
                  onClick={() => setEditingLesson(null)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog open={!!deletingLessonId} onOpenChange={(open) => !open && setDeletingLessonId(null)}>
        <DialogContent className="rounded-xl max-w-md bg-white">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <DialogTitle className="text-xl text-gray-900">Excluir Videoaula?</DialogTitle>
            </div>
            <DialogDescription className="text-base text-gray-600 pt-2">
              Tem certeza que deseja excluir esta videoaula? Esta ação não pode ser desfeita e o conteúdo será perdido permanentemente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={() => setDeletingLessonId(null)}
              className="rounded-xl"
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                if (deletingLessonId) {
                  onDeleteLesson(deletingLessonId);
                  setDeletingLessonId(null);
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

      {/* Dialog de Estatísticas */}
      <Dialog open={!!viewingStats} onOpenChange={(open) => !open && setViewingStats(null)}>
        <DialogContent className="rounded-xl max-w-3xl bg-white max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader className="border-b pb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-12 w-12 rounded-lg bg-violet-100 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-violet-600" />
                </div>
                <div className="flex-1">
                  <DialogTitle className="text-2xl text-gray-900">{viewingStats?.title}</DialogTitle>
                  <p className="text-sm text-gray-600 mt-1">{viewingStats?.discipline}</p>
                </div>
              </div>
            </div>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto max-h-[calc(85vh-180px)] space-y-6 py-4">
            {/* Estatísticas Gerais */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="rounded-xl shadow-sm border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total de Views</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{viewingStats?.views || 0}</p>
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Eye className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-xl shadow-sm border-l-4 border-l-green-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Alunos que Assistiram</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {viewingStats?.studentsWatched?.length || 0}
                      </p>
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <Users className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-xl shadow-sm border-l-4 border-l-violet-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Taxa de Conclusão</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {viewingStats?.studentsWatched 
                          ? Math.round((viewingStats.studentsWatched.filter(s => s.completed).length / viewingStats.studentsWatched.length) * 100)
                          : 0}%
                      </p>
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-violet-100 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-violet-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Lista de Alunos */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Users className="h-5 w-5 text-violet-600" />
                Alunos que Assistiram ({viewingStats?.studentsWatched?.length || 0})
              </h3>
              
              {viewingStats?.studentsWatched && viewingStats.studentsWatched.length > 0 ? (
                <div className="space-y-3">
                  {viewingStats.studentsWatched.map((student) => (
                    <Card key={student.id} className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-violet-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900">{student.name}</h4>
                              {student.completed && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                                  <CheckCircle2 className="h-3 w-3" />
                                  Concluído
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>Assistiu {student.timeWatched}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                <span>Progresso: {student.progress}%</span>
                              </div>
                            </div>
                            {/* Barra de progresso */}
                            <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-violet-500 to-blue-500 rounded-full transition-all"
                                style={{ width: `${student.progress}%` }}
                              />
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(student.watchedAt).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="rounded-xl shadow-sm">
                  <CardContent className="p-8 text-center">
                    <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600">Nenhum aluno assistiu esta videoaula ainda</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          <DialogFooter className="border-t pt-4">
            <Button
              variant="outline"
              onClick={() => setViewingStats(null)}
              className="rounded-xl"
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Preview do Vídeo */}
      <Dialog open={!!previewingLesson} onOpenChange={(open) => !open && setPreviewingLesson(null)}>
        <DialogContent className="rounded-xl max-w-5xl bg-white max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="border-b pb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-12 w-12 rounded-lg bg-violet-100 flex items-center justify-center">
                  <Play className="h-6 w-6 text-violet-600" />
                </div>
                <div className="flex-1">
                  <DialogTitle className="text-2xl text-gray-900">{previewingLesson?.title}</DialogTitle>
                  <p className="text-sm text-gray-600 mt-1">{previewingLesson?.discipline}</p>
                </div>
              </div>
            </div>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto space-y-4 py-4">
            {/* Player de Vídeo */}
            {previewingLesson?.youtubeUrl && (
              <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${extractYouTubeVideoId(previewingLesson.youtubeUrl)}`}
                  title={previewingLesson.title}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            {!previewingLesson?.youtubeUrl && (
              <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gradient-to-br from-violet-100 to-blue-100 flex items-center justify-center">
                <div className="text-center">
                  <Video className="h-16 w-16 text-violet-300 mx-auto mb-4" />
                  <p className="text-gray-600">Vídeo não disponível para preview</p>
                </div>
              </div>
            )}

            {/* Informações do Vídeo */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Descrição</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {previewingLesson?.description}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Visualizações</p>
                  <p className="text-lg font-semibold text-gray-900">{previewingLesson?.views}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Curtidas</p>
                  <p className="text-lg font-semibold text-gray-900">{previewingLesson?.likes || 0}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Duração</p>
                  <p className="text-lg font-semibold text-gray-900">{previewingLesson?.duration || "N/A"}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Publicado em</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {previewingLesson?.createdAt ? new Date(previewingLesson.createdAt).toLocaleDateString('pt-BR') : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="border-t pt-4 flex gap-2">
            {previewingLesson?.youtubeUrl && (
              <a 
                href={previewingLesson.youtubeUrl} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button className="rounded-xl bg-red-600 hover:bg-red-700">
                  <Youtube className="h-4 w-4 mr-2" />
                  Abrir no YouTube
                </Button>
              </a>
            )}
            <Button
              variant="outline"
              onClick={() => setPreviewingLesson(null)}
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