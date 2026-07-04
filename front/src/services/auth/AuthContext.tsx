import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/router";
import { api } from "@/lib/api";

export interface AuthUser {
  id_usuario: number;
  nome: string;
  email: string;
  tipo_usuario: "aluno" | "professor" | "admin";
  foto_url: string | null;
  id_aluno?: number | null;
  id_professor?: number | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  signOut: () => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("coins_token") : null;

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const data = await api.get("/auth/me");
      setUser(data);
    } catch (err) {
      console.error("Erro ao carregar usuário logado:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const signOut = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("coins_token");
    }
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  }
  return ctx;
}
