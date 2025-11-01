import { useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Settings, ArrowLeft } from "lucide-react";

export default function ComprasConfiguracoesPage() {
  const [limitePontosPorCompra, setLimitePontosPorCompra] = useState<number>(5);
  const [limiteMoedasPorDia, setLimiteMoedasPorDia] = useState<number>(200);
  const [permiteCancelamentoSemJustificativa, setPermiteCancelamentoSemJustificativa] = useState<boolean>(false);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">Configurações de Compras</h1>
            <p className="text-muted-foreground">Regras e limites</p>
          </div>
          <Link href="/adm/compras" className="hidden md:block">
            <Button variant="outline" className="rounded-xl">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Hub
            </Button>
          </Link>
        </header>

        <Card className="rounded-xl">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Settings className="h-5 w-5 text-violet-500" />
              Ajuste as regras abaixo (mock). Persistência real será integrada ao backend.
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="mb-1 block">Limite de pontos por compra</Label>
                <Input type="number" min={1} value={limitePontosPorCompra} onChange={(e) => setLimitePontosPorCompra(Number(e.target.value))} />
              </div>
              <div>
                <Label className="mb-1 block">Limite de moedas por dia</Label>
                <Input type="number" min={0} value={limiteMoedasPorDia} onChange={(e) => setLimiteMoedasPorDia(Number(e.target.value))} />
              </div>
              <div className="sm:col-span-2">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input type="checkbox" className="accent-violet-600" checked={permiteCancelamentoSemJustificativa} onChange={(e) => setPermiteCancelamentoSemJustificativa(e.target.checked)} />
                  Permitir cancelamento sem justificativa (não recomendado)
                </label>
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="rounded-lg">Salvar</Button>
              <Button className="rounded-lg" variant="outline" onClick={() => {
                setLimitePontosPorCompra(5);
                setLimiteMoedasPorDia(200);
                setPermiteCancelamentoSemJustificativa(false);
              }}>Redefinir</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
