import { Card, CardContent } from "@/components/ui/Card";

export default function Resumos() {
  return (
    <Card className="rounded-2xl">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-2">📝 Resumos</h2>
        <p className="text-secondary-700">
          Crie, organize e compartilhe resumos de estudos para reforçar o
          aprendizado.
        </p>
      </CardContent>
    </Card>
  );
}
