import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Bell, RefreshCw, CheckCircle, AlertCircle, Calendar, Eye } from "lucide-react";
import { listNotifications, markAllAsRead, markAsRead, type AdminNotification } from "@/services/api/notifications";

export default function SegurancaNotificacoesPage() {
  const [notifs, setNotifs] = useState<AdminNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const unreadCount = notifs.filter((n) => !n.read).length;

  useEffect(() => {
    listNotifications().then(setNotifs);
  }, []);

  // Stats calculation
  const statsNotifs = useMemo(() => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const semana = new Date(hoje);
    semana.setDate(hoje.getDate() - 7);

    return {
      total: notifs.length,
      naoLidas: unreadCount,
      hoje: notifs.filter(n => new Date(n.createdAt) >= hoje).length,
      semana: notifs.filter(n => new Date(n.createdAt) >= semana).length,
    };
  }, [notifs, unreadCount]);

  return (
    <AdminLayout>
      <div className="space-y-6 pb-8">
        {/* Header */}
        <header className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <Bell className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notificações</h1>
              <p className="text-gray-600 mt-1">Alertas e notificações do sistema de segurança</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="rounded-xl border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{statsNotifs.total}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Bell className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-l-4 border-l-amber-500 bg-gradient-to-br from-amber-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Não Lidas</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{statsNotifs.naoLidas}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Hoje</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{statsNotifs.hoje}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Esta Semana</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{statsNotifs.semana}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 items-center">
            <Link href="/adm/seguranca">
              <Button variant="outline" className="rounded-lg">Voltar</Button>
            </Link>
            <Button
              onClick={async () => {
                await markAllAsRead();
                const fresh = await listNotifications();
                setNotifs(fresh);
              }}
              className="rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 inline-flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Marcar Todas como Lidas
            </Button>
            <Button
              variant="outline"
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
              className="rounded-lg inline-flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Atualizar
            </Button>
          </div>
        </header>

        {/* Table Card */}
        <Card className="rounded-xl shadow-sm">
          <div className="h-2 bg-gradient-to-r from-amber-500 to-amber-600 rounded-t-xl"></div>
          <CardContent className="p-0">
            <div className="rounded-xl border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Notificação</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Data/Hora</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {notifs.map((n) => (
                    <tr key={n.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-sm text-gray-900">{n.message}</td>
                      <td className="py-3 px-4 text-sm whitespace-nowrap text-gray-700">{new Date(n.createdAt).toLocaleString("pt-BR")}</td>
                      <td className="py-3 px-4 text-sm">
                        {n.read ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                            <Eye className="h-3 w-3" />
                            Lida
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                            <AlertCircle className="h-3 w-3" />
                            Não lida
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {!n.read && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-lg hover:bg-amber-50 hover:border-amber-300"
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
                      <td colSpan={4} className="py-8 px-4 text-center">
                        <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-600">Nenhuma notificação no momento.</p>
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
