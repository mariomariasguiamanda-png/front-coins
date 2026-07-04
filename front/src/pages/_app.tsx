import type { AppProps } from "next/app";
import type { NextPage } from "next";
import type { ReactElement, ReactNode } from "react";
import Head from "next/head";
import "@/styles/globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/services/auth/AuthContext";
import { Roboto } from "next/font/google";
import Router from "next/router";
import { useEffect } from "react";
import { Toaster } from "sonner";

// Layout persistente (https://nextjs.org/docs/pages/building-your-application/routing/pages-and-layouts#with-typescript):
// páginas que exportam getLayout mantêm o MESMO componente de layout montado
// entre navegações (sidebar/header não remontam, não re-buscam dados a cada
// clique) - só o conteúdo da página troca.
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"] });

// 🔧 DEV: Instrumentação de roteamento para diagnosticar lentidão
if (process.env.NODE_ENV !== "production") {
  Router.events.on("routeChangeStart", (url) => {
    console.time("route-change");
    console.log("[Router] routeChangeStart:", url);
  });

  Router.events.on("routeChangeComplete", (url) => {
    console.timeEnd("route-change");
    console.log("[Router] routeChangeComplete:", url);
  });

  Router.events.on("routeChangeError", (err, url) => {
    console.log("[Router] routeChangeError:", url, err);
  });

  Router.events.on("beforeHistoryChange", (url) => {
    console.log("[Router] beforeHistoryChange:", url);
  });
}

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <ThemeProvider>
      <AuthProvider>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Coins for Study</title>
        </Head>
        <div className={roboto.className}>
          {getLayout(<Component {...pageProps} />)}
          <Toaster position="top-right" richColors closeButton />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}
