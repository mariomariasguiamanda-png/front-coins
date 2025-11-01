import type { AppProps } from "next/app";
import Head from "next/head";
import "@/styles/globals.css";
import { AuthProvider } from "@/services/auth/AuthContext";
import { Roboto } from "next/font/google";
import Router from "next/router";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/Toast";

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

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Coins for Study</title>
      </Head>
      <Toaster>
        <div className={roboto.className}>
          <Component {...pageProps} />
        </div>
      </Toaster>
    </AuthProvider>
  );
}
