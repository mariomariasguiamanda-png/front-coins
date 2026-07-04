import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";

// Mesmo formato que o componente Notifications usa
export interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error" | "achievement";
  category:
    | "resumo"
    | "atividade"
    | "videoaula"
    | "nota"
    | "conquista"
    | "sistema"
    | "prazo"
    | "material";
  title: string;
  message: string;
  discipline?: string;
  time: string;
  read: boolean;
  icon?: React.ReactNode;
}

type NotificacaoRow = {
  id_notificacao: number;
  id_usuario: number;
  titulo: string | null;
  mensagem: string | null;
  tipo: string | null;
  categoria: string | null;
  disciplina: string | null;
  criado_em: string | null;
  lida: boolean | null;
};

const getTempoRelativo = (dataEnvio: string) => {
  const agora = new Date();
  const envio = new Date(dataEnvio);
  const diffMs = agora.getTime() - envio.getTime();

  const minutos = Math.floor(diffMs / 1000 / 60);
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);

  if (minutos < 1) return "Há poucos segundos";
  if (minutos < 60) return `Há ${minutos} minuto${minutos > 1 ? "s" : ""}`;
  if (horas < 24) return `Há ${horas} hora${horas > 1 ? "s" : ""}`;
  return `Há ${dias} dia${dias > 1 ? "s" : ""}`;
};

export function useAlunoNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // A API já resolve o usuário logado a partir do JWT
      const data: NotificacaoRow[] = await api.get("/aluno/notificacoes");

      const mapped: Notification[] = (data ?? []).map((row) => {
        const type = (row.tipo as Notification["type"]) ?? "info";
        const category =
          (row.categoria as Notification["category"]) ?? "sistema";

        return {
          id: String(row.id_notificacao),
          type,
          category,
          title: row.titulo || "Notificação",
          message: row.mensagem ?? "",
          discipline: row.disciplina || "Sistema",
          time: row.criado_em ? getTempoRelativo(row.criado_em) : "",
          read: !!row.lida,
        };
      });

      setNotifications(mapped);
      setUnreadCount(mapped.filter((n) => !n.read).length);
    } catch (err) {
      console.error("Erro ao carregar notificações:", err);
      setError("Não foi possível carregar as notificações.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const markAsRead = async (id: string) => {
    if (!id) return;
    try {
      await api.patch(`/aluno/notificacoes/${id}/lida`, {});

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (err) {
      console.error("Erro ao marcar como lida:", err);
      setError("Erro ao marcar notificação como lida.");
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch("/aluno/notificacoes/lidas-todas", {});

      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Erro ao marcar todas como lidas:", err);
      setError("Erro ao marcar todas como lidas.");
    }
  };

  // Sem endpoint de exclusão na API (não é usado hoje pela UI) - remove só
  // localmente, mantendo a assinatura pra não quebrar quem consome o hook.
  const removeNotification = async (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    removeNotification,
    reload: carregar,
  };
}
