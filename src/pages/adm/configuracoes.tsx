import Link from "next/link";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Paintbrush, Calendar as CalendarIcon, Link as LinkIcon, Shield } from "lucide-react";

export default function ConfiguracoesHubPage() {
  const items = [
    {
      href: "/adm/configuracoes-visual",
      title: "Identidade Visual",
      desc: "Logo, cores e tipografia",
      icon: Paintbrush,
    },
    {
      href: "/adm/configuracoes-calendario",
      title: "Calendário",
      desc: "Períodos letivos e eventos",
      icon: CalendarIcon,
    },
    {
      href: "/adm/configuracoes-integracoes",
      title: "Integrações",
      desc: "Serviços externos e APIs",
      icon: LinkIcon,
    },
    {
      href: "/adm/configuracoes-permissoes",
      title: "Permissões",
      desc: "Perfis e recursos",
      icon: Shield,
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">Selecione abaixo a área que deseja gerenciar</p>
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