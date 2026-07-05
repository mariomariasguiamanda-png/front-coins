import { useAuth } from "@/contexts/AuthContext";

// Reaproveita o /auth/me já buscado pelo AuthProvider (uma vez por sessão) em
// vez de disparar uma segunda chamada idêntica só para o header.
export function useUsuarioLogado() {
  const { user } = useAuth();
  return { nome: user?.nome ?? null, fotoUrl: user?.foto_url ?? null };
}
