import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { disciplinas, resumos as mockResumos } from "@/lib/mock/aluno";

export default function Resumos() {
  const resumos = mockResumos;
  const getDisciplina = (id: string) => disciplinas.find((d) => d.id === id);
  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-xl font-bold mb-1">📝 Resumos</h2>
        <p className="text-sm text-white/80">Organize seus resumos por disciplina.</p>
      </div>
      {resumos.length === 0 ? (
        <Card className="rounded-xl bg-white/5 border border-white/15">
          <CardContent className="p-6 text-sm text-white/80">
            Nenhum resumo disponível.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resumos.map((r) => {
            const d = getDisciplina(r.disciplinaId);
            return (
              <Card key={r.id} className="rounded-xl bg-white/5 border border-white/15">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-xs font-semibold" style={{ color: d?.cor }}>{d?.nome}</span>
                      <h3 className="mt-1 font-semibold">{r.titulo}</h3>
                      {r.atividadeVinculada && (
                        <p className="text-xs text-white/80">Vinculado: {r.atividadeVinculada}</p>
                      )}
                    </div>
                    <Button size="sm" className="bg-white text-purple-700 hover:bg-secondary-100">Ler</Button>
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
