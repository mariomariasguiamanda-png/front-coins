import type { AppProps } from "next/app";
import Head from "next/head";
import "@/styles/globals.css";
import { AuthProvider } from "@/services/auth/AuthContext";
import { Roboto } from "next/font/google";

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"] });

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Coins for Study</title>
      </Head>
      <div className={roboto.className}>
        <Component {...pageProps} />
      </div>
    </AuthProvider>
  );
}
