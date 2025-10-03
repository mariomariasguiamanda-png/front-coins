import { Card, CardContent } from "@/components/ui/Card";
import { disciplinas, notas as mockNotas } from "@/lib/mock/aluno";

export default function MinhasNotas() {
  const getDisciplina = (id: string) => disciplinas.find((d) => d.id === id);
  const mediaGlobal = () => {
    const todas = mockNotas.flatMap((n) => n.avaliacoes.map((a) => a.nota));
    if (todas.length === 0) return 0;
    return Number((todas.reduce((s, n) => s + n, 0) / todas.length).toFixed(2));
  };
  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-xl font-bold mb-1">🧮 Minhas Notas</h2>
        <p className="text-sm text-white/80">Média global: {mediaGlobal()}</p>
      </div>
      {mockNotas.length === 0 ? (
        <Card className="rounded-xl bg-white/5 border border-white/15">
          <CardContent className="p-6 text-sm text-white/80">Sem notas no momento.</CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {mockNotas.map((n) => {
            const d = getDisciplina(n.disciplinaId);
            const media = Number((n.avaliacoes.reduce((s, a) => s + a.nota, 0) / n.avaliacoes.length).toFixed(2));
            return (
              <Card key={n.disciplinaId} className="rounded-xl bg-white/5 border border-white/15">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold" style={{ color: d?.cor }}>{d?.nome}</div>
                    <div className={`text-sm px-2 py-0.5 rounded ${media < 6 ? "bg-red-500/20 text-red-200" : "bg-emerald-500/20 text-emerald-200"}`}>Média {media}</div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="text-left text-white/70">
                        <tr>
                          <th className="py-2 pr-3">Avaliação</th>
                          <th className="py-2 pr-3">Nota</th>
                          <th className="py-2 pr-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {n.avaliacoes.map((a, idx) => (
                          <tr key={idx} className="border-t border-white/10">
                            <td className="py-2 pr-3">{a.nome}</td>
                            <td className={`py-2 pr-3 ${a.nota < 6 ? "text-red-300 font-medium" : ""}`}>{a.nota} / {a.max}</td>
                            <td className="py-2 pr-3">{a.status === "revisao" ? <span className="px-2 py-0.5 rounded bg-purple-500/30 text-purple-200">Revisão</span> : <span className="text-white/70">OK</span>}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
