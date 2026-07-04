import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useAlunoFoto() {
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFoto() {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth?.user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("alunos")
        .select("foto_url")
        .eq("auth_user_id", auth.user.id)
        .single();

      if (error) {
        console.error("Erro ao buscar foto do aluno:", error);
      } else if (data?.foto_url) {
        setFotoUrl(data.foto_url);
      }

      setLoading(false);
    }

    loadFoto();
  }, []);

  return { fotoUrl, loading };
}
