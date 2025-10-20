import { AdminLayout } from "@/components/adm/AdminLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { FileDown } from "lucide-react";

export default function ComprasRelatoriosPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-bold">Relatórios de Compras</h1>
          <p className="text-muted-foreground">Exportações e métricas</p>
        </header>

        <Card className="rounded-xl">
          <CardContent className="p-6 text-muted-foreground">
            <div className="flex items-center gap-2">
              <FileDown className="h-5 w-5 text-violet-500" />
              Em breve: filtros de período, exportação CSV/PDF e dashboards.
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
