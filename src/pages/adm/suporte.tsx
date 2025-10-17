import Link from "next/link";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { MessageCircle, HelpCircle, FileText, BarChart2, LifeBuoy } from "lucide-react";

export default function SuporteHubPage() {
  const items = [
    {
      href: "/adm/suporte-chamados",
      title: "Chamados",
      desc: "Gerenciamento de solicitações",
      icon: MessageCircle,
    },
    {
      href: "/adm/suporte-faqs",
      title: "FAQs",
      desc: "Base de conhecimento",
      icon: HelpCircle,
    },
    {
      href: "/adm/suporte-respostas",
      title: "Respostas Padrão",
      desc: "Modelos de resposta rápida",
      icon: FileText,
    },
    {
      href: "/adm/suporte-analytics",
      title: "Analytics",
      desc: "Métricas e indicadores",
      icon: BarChart2,
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold flex items-center gap-2"><LifeBuoy className="h-5 w-5 text-violet-500"/>Suporte</h1>
            <p className="text-muted-foreground">Selecione abaixo a área que deseja gerenciar</p>
          </div>
        </header>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <Link key={it.href} href={it.href} className="block">
              <Card className="rounded-xl hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <it.icon className="h-5 w-5 text-violet-500" />
                      <h3 className="text-lg font-semibold">{it.title}</h3>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{it.desc}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}