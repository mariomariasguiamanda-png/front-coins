// src/pages/api/admin/users.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

// ⚠️ SERVICE ROLE KEY — nunca expor no frontend
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, phone, type, status, password } = req.body;

  if (!name || !email || !password || !type) {
    return res.status(400).json({ error: "Dados obrigatórios faltando" });
  }

  try {
    // 1) Criar usuário no Supabase Auth
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        nome: name,
        telefone: phone,
        tipo_usuario: convertTipoUsuario(type),
        status,
        origem_admin: true,
      },
    });

    if (error || !data.user) {
      console.error("Erro Supabase createUser (detalhado):", error);
      return res.status(400).json({
        error: error?.message ?? "Erro ao criar usuário no Supabase Auth",
      });
    }

    const authUser = data.user;

    // 2) Inserir o usuário na tabela `usuarios`
    const { error: insertError } = await supabaseAdmin.from("usuarios").insert({
      nome: name,
      email: email,
      telefone: phone,
      tipo_usuario: convertTipoUsuario(type),
      senha: "autenticado_pelo_supabase", // 🔥 não salvamos senha real
      auth_user_id: authUser.id,
    });

    if (insertError) {
      console.error("Erro insert usuarios:", insertError);
      return res.status(400).json({
        error: insertError.message ?? "Erro ao salvar em usuarios",
      });
    }

    return res.status(201).json({ user: authUser });
  } catch (e: any) {
    console.error("Erro inesperado:", e);
    return res
      .status(500)
      .json({ error: "Erro interno ao criar usuário, tente novamente" });
  }
}

// 🔄 Converter o tipo do front → enum do banco
function convertTipoUsuario(type: string) {
  switch (type) {
    case "student":
      return "aluno";
    case "teacher":
      return "professor";
    case "admin":
      return "admin";
    default:
      return "aluno";
  }
}
