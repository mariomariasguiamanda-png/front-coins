import { api } from "@/lib/api";

export type AdminNotification = {
  id: string;
  message: string;
  actionType: string;
  read: boolean;
  createdAt: string; // ISO date
};

// Notificações reais do usuário logado (tabela notificacoes). As notificações
// são criadas pelo próprio backend nos fluxos (ajuste de moedas, cancelamento
// de compra, resposta de chamado etc.) - o front só lista e marca como lida.
export async function listNotifications(): Promise<AdminNotification[]> {
  const rows = await api.get("/notificacoes");
  return (rows ?? []).map((r: any) => ({
    id: String(r.id_notificacao),
    message: r.titulo ? `${r.titulo}: ${r.mensagem ?? ""}` : (r.mensagem ?? ""),
    actionType: r.categoria ?? "sistema",
    read: !!r.lida,
    createdAt: r.criado_em,
  }));
}

export async function markAsRead(id: string): Promise<void> {
  await api.patch(`/notificacoes/${id}/lida`, {});
}

export async function markAllAsRead(): Promise<void> {
  await api.patch("/notificacoes/lidas-todas", {});
}
