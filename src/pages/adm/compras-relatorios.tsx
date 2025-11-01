import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, BookOpen, Calendar } from "lucide-react";
import { mockTransacoes } from "@/lib/mock/compras";

export default function ComprasRelatoriosPage() {
  const router = useRouter();
  const [disciplina, setDisciplina] = useState<string>("todas");
  const [periodoDe, setPeriodoDe] = useState<string>("");
  const [periodoAte, setPeriodoAte] = useState<string>("");

  useEffect(() => {
    const q = router.query?.disciplina;
    if (typeof q === "string") setDisciplina(q);
  }, [router.query?.disciplina]);

  const disciplinas = useMemo(() => Array.from(new Set(mockTransacoes.map(t => t.disciplinaNome))), []);

  const data = useMemo(() => {
    return mockTransacoes.filter(t => {
      const okDisc = disciplina === "todas" || t.disciplinaNome === disciplina;
      const ts = new Date(t.data).getTime();
      const de = periodoDe ? new Date(periodoDe).getTime() : -Infinity;
      const ate = periodoAte ? new Date(periodoAte).getTime() + 24*60*60*1000 - 1 : Infinity;
      return okDisc && ts >= de && ts <= ate;
    });
  }, [disciplina, periodoDe, periodoAte]);

  const kpis = useMemo(() => {
    const totalPontos = data.reduce((s, t) => s + t.pontosComprados, 0);
    const totalMoedas = data.reduce((s, t) => s + t.moedasGastas, 0);
    return { totalPontos, totalMoedas, transacoes: data.length };
  }, [data]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-violet-500" />
            <h1 className="text-2xl font-bold">Histórico por Disciplina</h1>
          </div>
          <Link href="/adm/compras" className="hidden md:block">
            <Button variant="outline" className="rounded-xl">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Hub
            </Button>
          </Link>
        </header>

        <Card className="rounded-xl">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap gap-2">
                <Select value={disciplina} onValueChange={setDisciplina}>
                  <SelectTrigger className="w-[220px] rounded-lg">
                    <SelectValue placeholder="Disciplina" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas as disciplinas</SelectItem>
                    {disciplinas.map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <Input type="date" value={periodoDe} onChange={(e) => setPeriodoDe(e.target.value)} className="rounded-lg" />
                  <span className="text-sm text-muted-foreground">a</span>
                  <Input type="date" value={periodoAte} onChange={(e) => setPeriodoAte(e.target.value)} className="rounded-lg" />
                </div>
              </div>
              <Button className="rounded-lg" variant="outline" onClick={() => { setDisciplina("todas"); setPeriodoDe(""); setPeriodoAte(""); }}>Limpar</Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="rounded-xl"><CardContent className="p-6"><p className="text-sm text-muted-foreground">Transações</p><p className="text-2xl font-bold">{kpis.transacoes}</p></CardContent></Card>
          <Card className="rounded-xl"><CardContent className="p-6"><p className="text-sm text-muted-foreground">Pontos Comprados</p><p className="text-2xl font-bold text-emerald-600">+{kpis.totalPontos}</p></CardContent></Card>
          <Card className="rounded-xl"><CardContent className="p-6"><p className="text-sm text-muted-foreground">Moedas Gastas</p><p className="text-2xl font-bold text-amber-600">-{kpis.totalMoedas}</p></CardContent></Card>
        </div>

        <Card className="rounded-xl">
          <CardContent className="p-6">
            <div className="rounded-lg border overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="py-3 px-4 text-left">Data</th>
                    <th className="py-3 px-4 text-left">Aluno</th>
                    <th className="py-3 px-4 text-left">Disciplina</th>
                    <th className="py-3 px-4 text-left">Pontos</th>
                    <th className="py-3 px-4 text-left">Moedas</th>
                    <th className="py-3 px-4 text-left">Saldo Antes/Depois</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((t) => (
                    <tr key={t.id} className="border-b">
                      <td className="py-3 px-4">{new Date(t.data).toLocaleString("pt-BR")}</td>
                      <td className="py-3 px-4">{t.alunoNome} <span className="text-muted-foreground">({t.alunoTurma})</span></td>
                      <td className="py-3 px-4">{t.disciplinaNome} <span className="text-muted-foreground">- Prof. {t.professorNome}</span></td>
                      <td className="py-3 px-4 text-emerald-600 font-medium">+{t.pontosComprados}</td>
                      <td className="py-3 px-4 text-amber-600 font-medium">-{t.moedasGastas}</td>
                      <td className="py-3 px-4">{t.saldoAntes} → {t.saldoDepois}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
