import { AdminLayout } from "@/components/adm/AdminLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Settings } from "lucide-react";

export default function ComprasConfiguracoesPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-bold">Configurações de Compras</h1>
          <p className="text-muted-foreground">Regras e limites</p>
        </header>

        <Card className="rounded-xl">
          <CardContent className="p-6 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-violet-500" />
              Em breve: limites por aluno, políticas de cancelamento, e permissões.
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
