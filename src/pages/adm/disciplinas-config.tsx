import { useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { ArrowLeft, Save } from "lucide-react";

export default function DisciplinasConfigPage() {
  const [defaultMaxPoints, setDefaultMaxPoints] = useState(50);
  const [defaultPointPrice, setDefaultPointPrice] = useState(20);
  const [allowNegative, setAllowNegative] = useState(false);

  const handleSave = () => {
    // aqui integrar com API futuramente
    console.log({ defaultMaxPoints, defaultPointPrice, allowNegative });
    alert("Configurações salvas.");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">Configurações de Disciplinas</h1>
            <p className="text-muted-foreground">Defina regras padrão e preferências</p>
          </div>
          <div className="flex gap-2">
            <Link href="/adm/disciplinas">
              <Button variant="outline" className="rounded-lg">
                <ArrowLeft className="h-4 w-4" /> Voltar ao hub
              </Button>
            </Link>
            <Button className="rounded-lg bg-violet-600 hover:bg-violet-700" onClick={handleSave}>
              <Save className="h-4 w-4" /> Salvar
            </Button>
          </div>
        </header>

        <Card className="rounded-xl">
          <CardContent className="p-6 space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Máximo de pontos padrão</Label>
                <Input type="number" className="input-field rounded-lg" value={defaultMaxPoints} onChange={(e) => setDefaultMaxPoints(Number(e.target.value))} />
                <p className="text-xs text-muted-foreground">Valor sugerido ao criar novas disciplinas.</p>
              </div>
              <div className="space-y-2">
                <Label>Preço por ponto (moedas)</Label>
                <Input type="number" className="input-field rounded-lg" value={defaultPointPrice} onChange={(e) => setDefaultPointPrice(Number(e.target.value))} />
                <p className="text-xs text-muted-foreground">Conversão padrão de pontos para moedas.</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input id="allow-negative" type="checkbox" checked={allowNegative} onChange={(e) => setAllowNegative(e.target.checked)} className="h-4 w-4" />
              <Label htmlFor="allow-negative">Permitir saldo de pontos negativo</Label>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
