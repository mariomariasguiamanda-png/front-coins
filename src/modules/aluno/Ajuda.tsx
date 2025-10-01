import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { professores } from "@/lib/mock/aluno";
import { BookOpen, HelpCircle, MessagesSquare } from "lucide-react";
import { useState } from "react";

export default function Ajuda() {
  const [prof, setProf] = useState("");
  const [msg, setMsg] = useState("");
  const [suporte, setSuporte] = useState("");
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pergunte ao professor */}
        <Card className="rounded-xl bg-white/5 border border-white/15">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2 font-semibold"><MessagesSquare className="h-4 w-4" /> Pergunte ao professor</div>
            <select value={prof} onChange={(e) => setProf(e.target.value)} className="w-full rounded bg-white/10 border border-white/20 px-2 py-1 text-sm">
              <option value="">Selecione um professor</option>
              {professores.map((p) => (
                <option key={p.id} value={p.id}>{p.nome}</option>
              ))}
            </select>
            <textarea value={msg} onChange={(e) => setMsg(e.target.value)} rows={4} placeholder="Escreva sua pergunta..." className="w-full rounded bg-white/10 border border-white/20 px-2 py-1 text-sm" />
            <Button className="bg-purple-600 hover:bg-purple-700">Enviar</Button>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card className="rounded-xl bg-white/5 border border-white/15 md:col-span-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 font-semibold mb-2"><HelpCircle className="h-4 w-4" /> FAQ</div>
            <div className="divide-y divide-white/10">
              {[
                { q: "Como ganhar moedas?", a: "Você ganha moedas ao entregar atividades, assistir videoaulas e manter frequência." },
                { q: "Como comprar pontos?", a: "Vá em 'Comprar Pontos', escolha a disciplina e confirme a compra." },
                { q: "Minhas notas aparecem quando?", a: "Assim que seu professor publicar as avaliações." },
              ].map((f, i) => (
                <details key={i} className="py-2">
                  <summary className="cursor-pointer text-sm font-medium">{f.q}</summary>
                  <p className="mt-1 text-sm text-white/80">{f.a}</p>
                </details>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Suporte técnico */}
      <Card className="rounded-xl bg-white/5 border border-white/15">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-2 font-semibold"><BookOpen className="h-4 w-4" /> Suporte técnico</div>
          <textarea value={suporte} onChange={(e) => setSuporte(e.target.value)} rows={4} placeholder="Descreva o problema..." className="w-full rounded bg-white/10 border border-white/20 px-2 py-1 text-sm" />
          <Button className="bg-white text-purple-700 hover:bg-secondary-100">Enviar ticket</Button>
        </CardContent>
      </Card>
    </div>
  );
}
