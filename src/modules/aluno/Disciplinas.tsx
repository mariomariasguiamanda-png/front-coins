import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { disciplinas } from "@/lib/mock/aluno";
import { useRouter } from "next/router";

export default function Disciplinas() {
  const router = useRouter();
  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-xl font-bold mb-1">📚 Disciplinas</h2>
        <p className="text-sm text-white/80">Acompanhe seu progresso por disciplina.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {disciplinas.map((d) => (
          <Card key={d.id} className="rounded-xl bg-white/5 border border-white/15">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-semibold" style={{ color: d.cor }}>{d.nome}</div>
                <div className="text-xs text-white/70">{d.moedas} moedas</div>
              </div>
              <div>
                <div className="h-2 w-full rounded bg-white/10 overflow-hidden">
                  <div className="h-full bg-amber-400" style={{ width: `${d.progresso}%` }} />
                </div>
                <div className="mt-1 text-xs text-white/70">Progresso {d.progresso}%</div>
              </div>
              <div className="flex justify-end">
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700" onClick={() => router.push(`/disciplina/${d.id}`)}>Entrar</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
