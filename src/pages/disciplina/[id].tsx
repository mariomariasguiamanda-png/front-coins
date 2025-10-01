"use client";

import { useRouter } from "next/router";
import { disciplinas, atividades, resumos, videoaulas } from "@/lib/mock/aluno";
import { Card, CardContent } from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DisciplinaPage() {
  const { query } = useRouter();
  const id = String(query.id || "");
  const disc = disciplinas.find((d) => d.id === id);
  const acts = atividades.filter((a) => a.disciplinaId === id);
  const sums = resumos.filter((r) => r.disciplinaId === id);
  const vids = videoaulas.filter((v) => v.disciplinaId === id);

  if (!disc) {
    return (
      <div className="min-h-dvh grid place-items-center bg-gradient-to-br from-[#C084FC] via-[#7C3AED] to-[#0B0614] text-white p-6">
        <Card className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 max-w-xl w-full">
          <CardContent className="p-6 text-center">Disciplina não encontrada.</CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-gradient-to-br from-[#C084FC] via-[#7C3AED] to-[#0B0614] text-white p-6">
      <div className="max-w-5xl mx-auto space-y-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: disc.cor }}>{disc.nome}</h1>
          <p className="text-sm text-white/80">Moedas: {disc.moedas} • Progresso: {disc.progresso}%</p>
        </div>

        <Card className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
          <CardContent className="p-4">
            <Tabs defaultValue="atividades">
              <TabsList className="bg-white/10">
                <TabsTrigger value="atividades">Atividades</TabsTrigger>
                <TabsTrigger value="resumos">Resumos</TabsTrigger>
                <TabsTrigger value="videos">Videoaulas</TabsTrigger>
              </TabsList>
              <TabsContent value="atividades">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  {acts.length === 0 ? (
                    <p className="text-sm text-white/80">Sem atividades.</p>
                  ) : (
                    acts.map((a) => (
                      <div key={a.id} className="rounded-xl bg-white/5 border border-white/15 p-3">
                        <div className="text-xs text-white/70">Prazo {new Date(a.prazo).toLocaleDateString("pt-BR")}</div>
                        <div className="font-semibold">{a.titulo}</div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
              <TabsContent value="resumos">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  {sums.length === 0 ? (
                    <p className="text-sm text-white/80">Sem resumos.</p>
                  ) : (
                    sums.map((r) => (
                      <div key={r.id} className="rounded-xl bg-white/5 border border-white/15 p-3">
                        <div className="font-semibold">{r.titulo}</div>
                        <div className="text-xs text-white/80">{r.atividadeVinculada || ""}</div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
              <TabsContent value="videos">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  {vids.length === 0 ? (
                    <p className="text-sm text-white/80">Sem videoaulas.</p>
                  ) : (
                    vids.map((v) => (
                      <div key={v.id} className="rounded-xl bg-white/5 border border-white/15 overflow-hidden">
                        <div className="aspect-video">
                          <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${v.youtubeId}`} title={v.titulo} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
                        </div>
                        <div className="p-3">
                          <div className="font-semibold">{v.titulo}</div>
                          <div className="text-xs text-white/80">{v.descricao}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
