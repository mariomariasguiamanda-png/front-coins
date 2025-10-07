import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { atividades as mockAtividades, disciplinas } from "@/lib/mock/aluno";
import { CalendarDays, CircleDot, Clock, Coins } from "lucide-react";

export default function Atividades() {
  const atividades = mockAtividades;
  const getDisciplina = (id: string) => disciplinas.find((d) => d.id === id);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold mb-1">📚 Atividades</h2>
          <p className="text-white/80 text-sm">
            Visualize e envie atividades para ganhar moedas e acompanhar seu
            progresso.
          </p>
        </div>
        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">Nova atividade</Button>
      </div>

      {/* Lista de atividades */}
      {atividades.length === 0 ? (
        <Card className="rounded-xl bg-white/5 border border-white/15">
          <CardContent className="p-6 text-sm text-white/80">
            Nenhuma atividade disponível no momento.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {atividades.map((a) => {
            const d = getDisciplina(a.disciplinaId);
            const prazo = new Date(a.prazo).toLocaleDateString("pt-BR");
            const statusColor = a.status === "pendente" ? "bg-amber-400" : a.status === "enviado" ? "bg-blue-400" : "bg-emerald-400";
            return (
              <Card key={a.id} className="rounded-xl bg-white/5 border border-white/15">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold" style={{ color: d?.cor }}>{d?.nome}</span>
                        <span className={`inline-flex items-center gap-1 text-[11px] rounded px-1.5 py-0.5 bg-white/10`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${statusColor}`} /> {a.status}
                        </span>
                      </div>
                      <h3 className="mt-1 font-semibold">{a.titulo}</h3>
                      <div className="mt-2 flex items-center gap-3 text-xs text-white/80">
                        <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" /> {prazo}</span>
                        <span className="inline-flex items-center gap-1"><Coins className="h-3.5 w-3.5" /> {a.moedas} moedas</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-white/10 hover:bg-white/20">Abrir</Button>
                      <Button size="sm" variant="outline">Enviar</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Caixa de revisão espaçada */}
      <Card className="rounded-xl bg-white/5 border border-white/15">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Revisão espaçada</h3>
            <span className="text-xs text-white/80">1d • 3d • 7d • 15d</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[1, 3, 7, 15].map((d) => (
              <div key={d} className="rounded-lg bg-white/5 border border-white/10 p-3 flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/80">Revisar em</p>
                  <p className="text-sm font-semibold">{d} dia{d > 1 ? "s" : ""}</p>
                </div>
                <CircleDot className="h-4 w-4" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
