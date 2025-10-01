import { Card, CardContent } from "@/components/ui/Card";
import { calendarioRevisao } from "@/lib/mock/aluno";

export default function Frequencia() {
  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-xl font-bold mb-1">📅 Calendário</h2>
        <p className="text-sm text-white/80">Revisão espaçada de Ebbinghaus</p>
      </div>
      <Card className="rounded-xl bg-white/5 border border-white/15">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {calendarioRevisao.map((c, i) => (
              <div key={i} className="rounded-lg bg-white/5 border border-white/10 p-3">
                <div className="text-sm font-semibold">{c.titulo}</div>
                <div className="mt-1 text-xs text-white/70">Base {new Date(c.dataBase).toLocaleDateString("pt-BR")}</div>
                <div className="mt-2 flex flex-wrap gap-1 text-[10px]">
                  {c.repeticoes.map((r) => (
                    <span key={r} className="px-2 py-0.5 rounded bg-white/10">{r}d</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
