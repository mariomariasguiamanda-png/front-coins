// src/services/supabaseUsers.ts
import { supabase } from "@/lib/supabaseClient";

export type CreateUserInput = {
  name: string;
  email: string;
  phone: string;
  type: "student" | "teacher" | "admin";
  status: "active" | "inactive";
  password: string;
};

export async function createSupabaseUserFromAdmin(input: CreateUserInput) {
  // 1) Cria o usuário na autenticação do Supabase
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        nome: input.name,
        telefone: input.phone,
        tipo_usuario: input.type, // "student" | "teacher" | "admin"
        status: input.status, // "active" | "inactive"
        origem_admin: true,   // marca que veio do painel admin
      },
    },
  });

  if (error) {
    console.error("Erro Supabase signUp:", error);
    throw new Error(error.message);
  }

  // Se quiser, aqui depois você pode inserir em uma tabela `usuarios` via supabase.from()
  // por enquanto vamos só criar no auth.

  return data;
}
