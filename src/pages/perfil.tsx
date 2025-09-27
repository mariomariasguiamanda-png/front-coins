import Head from "next/head";
import type { GetServerSideProps } from "next";
import AppLayout from "@/components/layout/AppLayout";
import { useAuth } from "@/services/auth/AuthContext";
import { withAuth } from "@/lib/withAuth";

export default function PerfilPage() {
  const { user, logout } = useAuth();

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
              <strong>Nome:</strong> {user.name}
            </div>
            <div>
              <strong>Email:</strong> {user.email}
            </div>
            <button className="mt-4 border px-3 py-2 rounded" onClick={logout}>
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
