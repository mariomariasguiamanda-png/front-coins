import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export type Notificacao = {
  id_notificacao: number;
  id_usuario: number;
  mensagem: string;
  data_envio: string;
  status: string; // 'nao_lida' | 'lida' (enum do banco)
  titulo: string | null;
  tipo: string | null; // 'atividade' | 'prazo' | 'conquista' | 'lembrete' | etc
};

export type NotificacaoUI = Notificacao & {
  tempo: string;
  lida: boolean;
};

const getTempoRelativo = (dataEnvio: string) => {
  const agora = new Date();
  const envio = new Date(dataEnvio);
  const diffMs = agora.getTime() - envio.getTime();

  const minutos = Math.floor(diffMs / 1000 / 60);
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);

  if (minutos < 1) return "agora mesmo";
  if (minutos < 60) return `Há ${minutos} min`;
  if (horas < 24) return `Há ${horas} hora${horas > 1 ? "s" : ""}`;
  return `Há ${dias} dia${dias > 1 ? "s" : ""}`;
};

export function useAlunoNotificacoes() {
  const [notificacoes, setNotificacoes] = useState<NotificacaoUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [idUsuario, setIdUsuario] = useState<number | null>(null);

  const carregarNotificacoes = useCallback(async () => {
    try {
      setLoading(true);
      setErro(null);

      // 1) Usuário autenticado (auth.users)
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) {
        setErro("Usuário não autenticado.");
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
          "id_notificacao, id_usuario, mensagem, data_envio, status, titulo, tipo"
        )
        .eq("id_usuario", id_usuario)
        .order("data_envio", { ascending: false });

      if (notifError) throw notifError;

      const mapped =
        (data as Notificacao[]).map((n) => ({
          ...n,
          tempo: getTempoRelativo(n.data_envio),
          lida: n.status === "lida",
        })) ?? [];

      setNotificacoes(mapped);
    } catch (err) {
      console.error("Erro ao carregar notificações:", err);
      setErro("Não foi possível carregar as notificações.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarNotificacoes();
  }, [carregarNotificacoes]);

  // marcar UMA como lida
  const marcarComoLida = async (id_notificacao: number) => {
    try {
      const { error } = await supabase
        .from("notificacoes")
        .update({ status: "lida" }) // certifique-se de que o enum tem o valor 'lida'
        .eq("id_notificacao", id_notificacao);

      if (error) throw error;

      setNotificacoes((prev) =>
        prev.map((n) =>
          n.id_notificacao === id_notificacao
            ? { ...n, lida: true, status: "lida" }
            : n
        )
      );
    } catch (err) {
      console.error("Erro ao marcar notificação como lida:", err);
      setErro("Erro ao marcar notificação como lida.");
    }
  };

  // marcar TODAS como lidas
  const marcarTodasComoLidas = async () => {
    if (!idUsuario) return;
    try {
      const { error } = await supabase
        .from("notificacoes")
        .update({ status: "lida" })
        .eq("id_usuario", idUsuario)
        .eq("status", "nao_lida");

      if (error) throw error;

      setNotificacoes((prev) =>
        prev.map((n) => ({ ...n, lida: true, status: "lida" }))
      );
    } catch (err) {
      console.error("Erro ao marcar todas como lidas:", err);
      setErro("Erro ao marcar notificações como lidas.");
    }
  };

  const naoLidas = notificacoes.filter((n) => !n.lida).length;

  return {
    notificacoes,
    naoLidas,
    loading,
    erro,
    marcarComoLida,
    marcarTodasComoLidas,
    recarregar: carregarNotificacoes,
  };
}
