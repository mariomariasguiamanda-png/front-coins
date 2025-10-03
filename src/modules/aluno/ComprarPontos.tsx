import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { disciplinas, precosPontosPorDisciplina, aluno, moedaBRL } from "@/lib/mock/aluno";
import { useState } from "react";

export default function ComprarPontos() {
  const [selecionada, setSelecionada] = useState<string | null>(null);
  const [qtd, setQtd] = useState(10);
  const preco = precosPontosPorDisciplina.find((p) => p.disciplinaId === selecionada);
  const total = preco ? preco.precoPorPonto * qtd : 0;
  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold mb-1">🪙 Comprar Pontos</h2>
          <p className="text-sm text-white/80">Saldo atual: {aluno.saldoTotal} moedas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="rounded-xl bg-white/5 border border-white/15">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">Disciplinas</h3>
            <div className="space-y-2">
              {precosPontosPorDisciplina.map((p) => {
                const d = disciplinas.find((x) => x.id === p.disciplinaId)!;
                const active = selecionada === d.id;
                return (
                  <button key={d.id} onClick={() => setSelecionada(d.id)} className={`w-full text-left rounded-lg px-3 py-2 border ${active ? "border-white/60 bg-white/10" : "border-white/10 hover:bg-white/5"}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold" style={{ color: d.cor }}>{d.nome}</div>
                        <div className="text-xs text-white/80">Preço por ponto: {moedaBRL(p.precoPorPonto)}</div>
                      </div>
                      <div className="text-xs text-white/70">Disponível: {p.disponivel}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl bg-white/5 border border-white/15">
          <CardContent className="p-4 space-y-3">
            <h3 className="font-semibold">Comprar pontos</h3>
            {selecionada ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <label className="text-sm w-28">Quantidade</label>
                  <input type="number" min={1} value={qtd} onChange={(e) => setQtd(Math.max(1, Number(e.target.value)))} className="w-32 rounded bg-white/10 border border-white/20 px-2 py-1" />
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span>Total</span>
                  <strong>{moedaBRL(total)}</strong>
                </div>
                <div className="flex gap-2">
                  <Button className="bg-amber-400 text-purple-900 hover:bg-amber-300">Confirmar compra</Button>
                  <Button variant="outline" onClick={() => setSelecionada(null)}>Cancelar</Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-white/80">Selecione uma disciplina para continuar.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
