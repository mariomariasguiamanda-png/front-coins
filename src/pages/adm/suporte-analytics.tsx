import { AdminLayout } from "@/components/adm/AdminLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { MessageCircle, Clock, CheckCircle2, AlertCircle, BarChart2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function SuporteAnalyticsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-violet-500" />
            <div className="space-y-1">
              <h1 className="text-2xl font-bold">Analytics</h1>
              <p className="text-muted-foreground">Métricas e indicadores do suporte</p>
            </div>
          </div>
          <Link href="/adm/suporte" className="hidden md:block">
            <Button variant="outline" className="rounded-xl">Voltar ao Hub</Button>
          </Link>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <Card className="rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total de Chamados</p>
                  <h3 className="text-2xl font-bold text-violet-600">48</h3>
                </div>
                <MessageCircle className="h-8 w-8 text-violet-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tempo Médio Resposta</p>
                  <h3 className="text-2xl font-bold text-violet-600">2.5h</h3>
                </div>
                <Clock className="h-8 w-8 text-violet-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Taxa Resolução</p>
                  <h3 className="text-2xl font-bold text-violet-600">92%</h3>
                </div>
                <CheckCircle2 className="h-8 w-8 text-violet-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pendentes {`>`} Prazo</p>
                  <h3 className="text-2xl font-bold text-red-600">3</h3>
                </div>
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
