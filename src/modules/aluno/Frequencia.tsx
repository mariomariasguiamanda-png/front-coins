import { Card, CardContent } from "@/components/ui/Card";

export default function Frequencia() {
  return (
    <Card className="rounded-2xl">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-2">📅 Frequência</h2>
        <p className="text-secondary-700">
          Acompanhe sua presença e mantenha sua constância para ganhar moedas.
        </p>
      </CardContent>
    </Card>
  );
}
