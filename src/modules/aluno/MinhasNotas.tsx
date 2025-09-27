import { Card, CardContent } from "@/components/ui/Card";

export default function MinhasNotas() {
  return (
    <Card className="rounded-2xl">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-2">🧮 Minhas Notas</h2>
        <p className="text-secondary-700">
          Acompanhe suas notas, evolução por disciplinas e moedas conquistadas
          por desempenho.
        </p>
      </CardContent>
    </Card>
  );
}
