import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export function useUsuarioLogado() {
  const [nome, setNome] = useState<string | null>(null);
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await api.get("/auth/me");
        if (data.nome) setNome(data.nome);
        if (data.foto_url) setFotoUrl(data.foto_url);
      } catch (err) {
        console.error("Erro ao carregar usuario:", err);
      }
    }

    loadUser();
  }, []);

  return { nome, fotoUrl };
}
