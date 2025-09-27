import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function Atividades() {
  return (
    <Card className="rounded-2xl">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold mb-2">📚 Atividades</h2>
            <p className="text-secondary-700">
              Visualize e envie atividades para ganhar moedas e acompanhar seu
              progresso.
            </p>
          </div>
          <Button size="sm">Nova atividade</Button>
        </div>
      </CardContent>
    </Card>
  );
}
