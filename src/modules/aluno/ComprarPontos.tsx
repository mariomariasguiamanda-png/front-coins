import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function ComprarPontos() {
  return (
    <Card className="rounded-2xl">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold mb-2">🪙 Comprar Pontos</h2>
            <p className="text-secondary-700">
              Adicione moedas à sua conta e desbloqueie benefícios e
              recompensas.
            </p>
          </div>
          <Button size="sm">Comprar</Button>
        </div>
      </CardContent>
    </Card>
  );
}
