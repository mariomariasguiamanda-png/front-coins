import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function Perfil() {
  return (
    <Card className="rounded-2xl">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold mb-2">👤 Perfil</h2>
            <p className="text-secondary-700">
              Gerencie seus dados pessoais, preferências e privacidade.
            </p>
          </div>
          <Button size="sm">Editar</Button>
        </div>
      </CardContent>
    </Card>
  );
}
