import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

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
  mensagem: string;
  tipo: string | null;
  categoria: string | null;
  disciplina: string | null;
  data_envio: string;
  status: string; // enum_notificacoes_status
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
  const [idUsuario, setIdUsuario] = useState<number | null>(null);

  const carregar = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 1) Usuário logado (auth.users)
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) {
        setError("Usuário não autenticado.");
        setLoading(false);
        return;
      }

      // 2) Buscar id_usuario em public.usuarios
      const { data: usuarioRow, error: usuarioError } = await supabase
        .from("usuarios")
        .select("id_usuario")
        .eq("auth_user_id", user.id)
        .single();

      if (usuarioError) throw usuarioError;

      const id_usuario = usuarioRow.id_usuario as number;
      setIdUsuario(id_usuario);

      // 3) Buscar notificações desse usuário
      const { data, error: notifError } = await supabase
        .from("notificacoes")
        .select(
          "id_notificacao, id_usuario, titulo, mensagem, tipo, categoria, disciplina, data_envio, status"
        )
        .eq("id_usuario", id_usuario)
        .order("data_envio", { ascending: false });

      if (notifError) throw notifError;

      const mapped: Notification[] =
        (data as NotificacaoRow[]).map((row) => {
          const read = row.status !== "nao_lida"; // tudo que NÃO for nao_lida conta como lida
          const type =
            (row.tipo as Notification["type"]) ??
            ("info" as Notification["type"]);
          const category =
            (row.categoria as Notification["category"]) ??
            ("sistema" as Notification["category"]);

          return {
            id: String(row.id_notificacao),
            type,
            category,
            title: row.titulo || "Notificação",
            message: row.mensagem,
            discipline: row.disciplina || "Sistema",
            time: getTempoRelativo(row.data_envio),
            read,
          };
        }) ?? [];

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
      const { error: updError } = await supabase
        .from("notificacoes")
        .update({ status: "lida" }) // se no enum o valor for outro, trocar aqui
        .eq("id_notificacao", Number(id));

      if (updError) throw updError;

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
    if (!idUsuario) return;
    try {
      const { error: updError } = await supabase
        .from("notificacoes")
        .update({ status: "lida" })
        .eq("id_usuario", idUsuario)
        .eq("status", "nao_lida");

      if (updError) throw updError;

      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Erro ao marcar todas como lidas:", err);
      setError("Erro ao marcar todas como lidas.");
    }
  };

  const removeNotification = async (id: string) => {
    try {
      const { error: delError } = await supabase
        .from("notificacoes")
        .delete()
        .eq("id_notificacao", Number(id));

      if (delError) throw delError;

      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Erro ao excluir notificação:", err);
      setError("Erro ao excluir notificação.");
    }
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
