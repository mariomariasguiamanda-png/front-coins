import Head from "next/head";
import type { GetServerSideProps } from "next";
import AppLayout from "@/components/layout/AppLayout";
import { withAuth } from "@/lib/withAuth";

export default function AjudaPage() {
  return (
    <>
      <Head>
        <title>Ajuda | Coins for Study</title>
      </Head>
      <AppLayout>
        <h1 className="text-2xl font-semibold">Ajuda</h1>
        <p className="mt-2 text-secondary-700">FAQs e suporte ao usuário.</p>
      </AppLayout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = withAuth(async () => ({
  props: {},
}));
