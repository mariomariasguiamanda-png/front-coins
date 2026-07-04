import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useUsuarioLogado() {
  const [nome, setNome] = useState<string | null>(null);
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth?.user) return;

      // 1️⃣ Buscar ID do usuario (id_usuario) pela tabela alunos
      const { data: aluno } = await supabase
        .from("alunos")
        .select("id_usuario, foto_url")
        .eq("auth_user_id", auth.user.id)
        .maybeSingle();

      if (!aluno) return;

      if (aluno.foto_url) setFotoUrl(aluno.foto_url);

      // 2️⃣ Buscar nome na tabela usuarios
      const { data: usuario } = await supabase
        .from("usuarios")
        .select("nome")
        .eq("id_usuario", aluno.id_usuario)
        .maybeSingle();

      if (usuario?.nome) setNome(usuario.nome);
    }

    loadUser();
  }, []);

  return { nome, fotoUrl };
}
