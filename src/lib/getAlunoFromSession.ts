// src/lib/getAlunoFromSession.ts
import { supabase } from "@/lib/supabaseClient";

export async function getAlunoFromSession() {
  // 1) Usuário autenticado no Supabase
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error(authError);
    throw new Error("Usuário não autenticado.");
  }

  const authUserId = user.id;

  // 2) Buscar na tabela usuarios (ligação com auth.users)
  const { data: usuario, error: usuarioError } = await supabase
    .from("usuarios")
    .select("id_usuario")
    .eq("auth_user_id", authUserId)
    .maybeSingle();

  if (usuarioError || !usuario) {
    console.error(usuarioError);
    throw new Error("Usuário não encontrado na tabela usuarios.");
  }

  // 3) Buscar na tabela alunos
  const { data: aluno, error: alunoError } = await supabase
    .from("alunos")
    .select("id_aluno")
    .eq("id_usuario", usuario.id_usuario)
    .maybeSingle();

  if (alunoError || !aluno) {
    console.error(alunoError);
    throw new Error("Aluno não encontrado na tabela alunos.");
  }

  return {
    authUserId,
    idUsuario: usuario.id_usuario,
    idAluno: aluno.id_aluno,
  };
}
