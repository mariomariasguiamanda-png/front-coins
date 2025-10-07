import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/textarea";
import { PlayCircle, Upload, Youtube } from "lucide-react";

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
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">Videoaulas</h1>
        <p className="text-muted-foreground">
          Gerencie as videoaulas das suas disciplinas
        </p>
      </header>

      {/* Criar nova videoaula */}
      <Card className="rounded-xl">
        <CardContent className="p-6">
          <div className="mb-6 flex items-center gap-3">
            <PlayCircle className="h-5 w-5 text-violet-600" />
            <h2 className="text-lg font-semibold">Nova Videoaula</h2>
          </div>

          <form className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Título</Label>
                <Input placeholder="Ex: Introdução à Trigonometria" className="rounded-xl" />
              </div>
              <div>
                <Label>Disciplina</Label>
                <Input placeholder="Ex: Matemática" className="rounded-xl" />
              </div>
            </div>

            <div>
              <Label>Descrição</Label>
              <Textarea 
                placeholder="Descreva o conteúdo da videoaula..." 
                className="rounded-xl" 
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Link do YouTube</Label>
                <div className="flex gap-2">
                  <Input placeholder="Cole o link aqui..." className="rounded-xl" />
                  <Button variant="outline" size="sm" className="rounded-xl">
                    <Youtube className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <Label>Ou faça upload do vídeo</Label>
                <Button variant="outline" className="w-full rounded-xl">
                  <Upload className="mr-2 h-4 w-4" /> Selecionar vídeo
                </Button>
              </div>
            </div>

            <div>
              <Label>Thumbnail</Label>
              <Button variant="outline" className="mt-2 w-full rounded-xl">
                <Upload className="mr-2 h-4 w-4" /> Selecionar imagem de capa
              </Button>
            </div>

            <Button className="rounded-xl">Publicar Videoaula</Button>
          </form>
        </CardContent>
      </Card>

      {/* Lista de videoaulas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {lessons.map((lesson) => (
          <Card key={lesson.id} className="rounded-xl">
            <div className="relative aspect-video w-full overflow-hidden rounded-t-xl bg-muted">
              <img
                src={lesson.thumbnail || "/video-placeholder.png"}
                alt={lesson.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <PlayCircle className="h-12 w-12 text-white opacity-75" />
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold">{lesson.title}</h3>
                  <p className="text-sm text-muted-foreground">{lesson.discipline}</p>
                </div>
                <Button variant="outline" size="sm" className="shrink-0 rounded-xl">
                  Editar
                </Button>
              </div>

              <p className="mt-2 text-sm text-muted-foreground">
                {lesson.description.substring(0, 100)}...
              </p>

              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {new Date(lesson.createdAt).toLocaleDateString()}
                </span>
                <span className="text-muted-foreground">
                  {lesson.views} visualizações
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}