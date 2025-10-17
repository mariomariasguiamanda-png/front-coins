import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { FileText, RefreshCw } from "lucide-react";
import { listNotifications, markAllAsRead, markAsRead, type AdminNotification } from "@/services/api/notifications";

export default function SegurancaNotificacoesPage() {
  const [notifs, setNotifs] = useState<AdminNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const unreadCount = notifs.filter((n) => !n.read).length;

  useEffect(() => {
    listNotifications().then(setNotifs);
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-violet-500" />
            <h1 className="text-2xl font-bold">Notificações</h1>
            {unreadCount > 0 && (
              <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                {unreadCount} não lidas
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Link href="/adm/seguranca" className="hidden md:block">
              <Button variant="outline" className="rounded-xl">Voltar ao Hub</Button>
            </Link>
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={async () => {
                await markAllAsRead();
                const fresh = await listNotifications();
                setNotifs(fresh);
              }}
            >
              Marcar todas como lidas
            </Button>
            <Button
              variant="outline"
              className="rounded-lg border-blue-200 text-blue-600 hover:text-blue-700 hover:bg-blue-50 hover:border-blue-300"
              onClick={async () => {
                setLoading(true);
                try {
                  const fresh = await listNotifications();
                  setNotifs(fresh);
                } finally {
                  setLoading(false);
                }
              }}
              isLoading={loading}
              disabled={loading}
              title="Atualizar notificações"
            >
              Atualizar
            </Button>
          </div>
        </header>

        <Card className="rounded-xl">
          <CardContent className="p-6">
            <div className="rounded-lg border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="py-3 px-4 text-left text-sm font-medium">Notificação</th>
                    <th className="py-3 px-4 text-left text-sm font-medium">Data/Hora</th>
                    <th className="py-3 px-4 text-left text-sm font-medium">Status</th>
                    <th className="py-3 px-4 text-left text-sm font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {notifs.map((n) => (
                    <tr key={n.id} className="border-b">
                      <td className="py-3 px-4 text-sm">{n.message}</td>
                      <td className="py-3 px-4 text-sm whitespace-nowrap">{new Date(n.createdAt).toLocaleString("pt-BR")}</td>
                      <td className="py-3 px-4 text-sm">
                        {n.read ? (
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">Lida</span>
                        ) : (
                          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">Não lida</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {!n.read && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-lg"
                            onClick={async () => {
                              await markAsRead(n.id);
                              const fresh = await listNotifications();
                              setNotifs(fresh);
                            }}
                          >
                            Marcar como lida
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {notifs.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-6 px-4 text-center text-sm text-muted-foreground">
                        Nenhuma notificação no momento.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
