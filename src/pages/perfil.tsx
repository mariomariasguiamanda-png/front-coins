import Head from "next/head";
import type { GetServerSideProps } from "next";
import AppLayout from "@/components/layout/AppLayout";
import { useAuth } from "@/services/auth/AuthContext";
import { withAuth } from "@/lib/withAuth";

export default function PerfilPage() {
  const { user, signOut } = useAuth(); // 👈 pega signOut em vez de logout

  return (
    <>
      <Head>
        <title>Perfil | Coins for Study</title>
      </Head>
      <AppLayout>
        <h1 className="text-2xl font-semibold">Perfil</h1>
        {user ? (
          <div className="mt-4 space-y-2">
            <div>
              <strong>Nome:</strong>{" "}
              {/* Supabase User não tem 'name', normalmente vem em user_metadata */}
              {user.user_metadata?.nome ?? "Sem nome cadastrado"}
            </div>
            <div>
              <strong>Email:</strong> {user.email}
            </div>
            <button
              className="mt-4 border px-3 py-2 rounded"
              onClick={signOut} // 👈 aqui também
            >
              Sair
            </button>
          </div>
        ) : (
          <p className="mt-2">Nenhum usuário logado.</p>
        )}
      </AppLayout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = withAuth(async () => ({
  props: {},
}));