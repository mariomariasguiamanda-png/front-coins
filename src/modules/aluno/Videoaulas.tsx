import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function Videoaulas() {
  return (
    <Card className="rounded-2xl">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold mb-2">🎥 Videoaulas</h2>
            <p className="text-secondary-700">
              Assista aulas, marque concluídas e ganhe moedas por dedicação.
            </p>
          </div>
          <Button size="sm">Explorar</Button>
        </div>
      </CardContent>
    </Card>
  );
}
