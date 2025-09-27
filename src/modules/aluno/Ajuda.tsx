import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function Ajuda() {
  return (
    <Card className="rounded-2xl">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold mb-2">🙋‍♀️ Ajuda</h2>
            <p className="text-secondary-700">
              Precisa de suporte? Encontre respostas rápidas e canais de
              contato.
            </p>
          </div>
          <Button size="sm">Falar com suporte</Button>
        </div>
      </CardContent>
    </Card>
  );
}
