"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export function UserChip() {
  const [nome, setNome] = useState<string>("");

  useEffect(() => {
    async function loadNome() {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) return;

      const { data, error } = await supabase
        .from("usuarios")
        .select("nome")
        .eq("auth_user_id", user.id)
        .single();

      if (!error && data?.nome) {
        setNome(data.nome);
      }
    }

    loadNome();
  }, []);

  const initials = nome
    ? nome
        .split(" ")
        .filter(Boolean)
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "AL";

  return (
    <Link
      href="/aluno/perfil"
      className="flex items-center gap-2 rounded-lg bg-white/10 hover:bg-white/20 px-2 py-1 transition"
    >
      <div className="h-7 w-7 rounded-full bg-gradient-to-br from-purple-400 to-purple-700 grid place-items-center text-xs font-bold text-[#fff]">
        {initials}
      </div>
      <span className="text-sm hidden sm:block max-w-[140px] truncate">
        {nome || "Aluno"}
      </span>
    </Link>
  );
}
