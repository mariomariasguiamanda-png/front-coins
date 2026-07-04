import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { disciplinas, videoaulas as mockVideos } from "@/lib/mock/aluno";

export default function Videoaulas() {
  const videos = mockVideos;
  const getDisciplina = (id: string) => disciplinas.find((d) => d.id === id);
  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold mb-1">🎥 Videoaulas</h2>
          <p className="text-sm text-white/80">Assista aulas e acompanhe seu progresso.</p>
        </div>
        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">Explorar</Button>
      </div>
      {videos.length === 0 ? (
        <Card className="rounded-xl bg-white/5 border border-white/15">
          <CardContent className="p-6 text-sm text-white/80">Nenhuma videoaula encontrada.</CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {videos.map((v) => {
            const d = getDisciplina(v.disciplinaId);
            return (
              <Card key={v.id} className="rounded-xl bg-white/5 border border-white/15 overflow-hidden">
                <div className="aspect-video bg-black/40">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${v.youtubeId}`}
                    title={v.titulo}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-xs font-semibold" style={{ color: d?.cor }}>{d?.nome}</span>
                      <h3 className="mt-1 font-semibold">{v.titulo}</h3>
                      <p className="text-xs text-white/80">{v.descricao}</p>
                    </div>
                    <Button size="sm" className="bg-white text-purple-700 hover:bg-secondary-100">Continuar</Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
