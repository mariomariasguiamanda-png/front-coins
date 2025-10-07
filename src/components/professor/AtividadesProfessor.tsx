import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Calendar, Upload } from "lucide-react";

interface Activity {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  coins: number;
  status: "pendente" | "entregue" | "corrigida";
}

interface AtividadesProfessorProps {
  activities: Activity[];
  onCreateActivity: (activity: Omit<Activity, "id">) => void;
  onEditActivity: (id: string, activity: Partial<Activity>) => void;
  onDeleteActivity: (id: string) => void;
}

export function AtividadesProfessor({
  activities = [],
  onCreateActivity,
  onEditActivity,
  onDeleteActivity,
}: AtividadesProfessorProps) {
  return (
    <div className="space-y-6">
      <Card className="rounded-xl">
        <CardContent className="p-6">
          <div className="mb-6 flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-violet-600" />
            <h2 className="text-lg font-semibold">Nova Atividade</h2>
          </div>

          <form className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Título</Label>
                <Input placeholder="Ex: Lista de Exercícios 1" className="rounded-xl" />
              </div>
              <div>
                <Label>Data de entrega</Label>
                <Input type="date" className="rounded-xl" />
              </div>
            </div>

            <div>
              <Label>Descrição</Label>
              <Textarea placeholder="Instruções, objetivos..." className="rounded-xl" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Moedas</Label>
                <Input type="number" defaultValue={10} className="rounded-xl" />
              </div>
              <div>
                <Label>Anexos</Label>
                <Button variant="outline" className="w-full rounded-xl">
                  <Upload className="mr-2 h-4 w-4" /> Selecionar arquivos
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="rounded-xl">Publicar</Button>
              <Button variant="outline" className="rounded-xl">
                <Calendar className="mr-2 h-4 w-4" /> Agendar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {activities.map((activity) => (
          <Card key={activity.id} className="rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{activity.title}</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="rounded-xl">
                    Editar
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-xl text-red-600 hover:bg-red-50">
                    Excluir
                  </Button>
                </div>
              </div>

              <p className="mt-2 text-sm text-muted-foreground">{activity.description}</p>

              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Data de entrega:</span>{" "}
                  <span className="font-medium">{activity.dueDate}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Moedas:</span>{" "}
                  <span className="font-medium">{activity.coins}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>{" "}
                  <span className={`font-medium ${
                    activity.status === "pendente" ? "text-yellow-600" :
                    activity.status === "entregue" ? "text-blue-600" :
                    "text-green-600"
                  }`}>
                    {activity.status}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}