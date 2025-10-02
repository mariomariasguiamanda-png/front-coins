import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/textarea";
import { Coins } from "lucide-react";

interface ConfigMoedasProps {
  disciplinas: Array<{
    id: string;
    nome: string;
    precoMoedas: number;
    pontosDisponiveis: number;
  }>;
  onUpdateConfig: (disciplinaId: string, precoMoedas: number, pontosDisponiveis: number) => void;
}

export function ConfigMoedasProfessor({ disciplinas = [], onUpdateConfig }: ConfigMoedasProps) {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">Configuração de Moedas</h1>
        <p className="text-muted-foreground">
          Defina o preço em moedas e pontos disponíveis por disciplina
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {disciplinas.map((disciplina) => (
          <Card key={disciplina.id} className="rounded-xl">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center gap-3">
                <Coins className="h-5 w-5 text-violet-600" />
                <h3 className="font-semibold">{disciplina.nome}</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Preço (moedas → 1 ponto)</Label>
                  <Input
                    type="number"
                    defaultValue={disciplina.precoMoedas}
                    className="rounded-xl"
                  />
                </div>

                <div>
                  <Label>Pontos disponíveis</Label>
                  <Input
                    type="number"
                    defaultValue={disciplina.pontosDisponiveis}
                    className="rounded-xl"
                  />
                </div>

                <Button className="w-full rounded-xl">Salvar alterações</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-xl">
        <CardContent className="p-6">
          <h3 className="mb-4 font-semibold">Histórico de Alterações</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="font-medium">Matemática</p>
                <p className="text-sm text-muted-foreground">
                  Preço: 5 → 8 moedas | Pontos: 100 → 150
                </p>
              </div>
              <p className="text-sm text-muted-foreground">01/10/2023 14:30</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}