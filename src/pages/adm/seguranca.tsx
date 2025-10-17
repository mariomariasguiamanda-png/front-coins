import Link from "next/link";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Shield, Users, FileText, Bell, Settings } from "lucide-react";

export default function SegurancaHubPage() {
	const items = [
		{
			href: "/adm/seguranca-usuarios",
			title: "Gestão de Usuários",
			desc: "Perfis, estados e acesso",
			icon: Users,
		},
		{
			href: "/adm/seguranca-logs",
			title: "Logs de Atividades",
			desc: "Histórico de ações administrativas",
			icon: FileText,
		},
		{
			href: "/adm/seguranca-notificacoes",
			title: "Notificações",
			desc: "Alertas de alterações críticas",
			icon: Bell,
		},
		{
			href: "/adm/seguranca-configuracoes",
			title: "Configurações",
			desc: "2FA, bloqueio, criptografia, backup",
			icon: Settings,
		},
	];
	return (
		<AdminLayout>
			<div className="space-y-6">
				<header className="flex items-center justify-between">
					<div className="space-y-1">
						<h1 className="text-2xl font-bold flex items-center gap-2"><Shield className="h-5 w-5 text-violet-500"/>Segurança</h1>
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