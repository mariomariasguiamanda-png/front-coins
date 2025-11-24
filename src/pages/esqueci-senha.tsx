import Head from "next/head";
import Image from "next/image";
import { Roboto } from "next/font/google";
import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"] });

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email) {
      setErrorMsg("Informe um e-mail válido.");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/atualizar-senha`,
      });

      if (error) {
        console.error("Erro ao enviar link:", error);
        setErrorMsg(
          error.message ||
            "Erro ao enviar link de recuperação. Tente novamente em instantes."
        );
        return;
      }

      setSuccessMsg(
        "Se o e-mail estiver cadastrado, você receberá um link para redefinir a senha."
      );
      setEmail("");
    } catch (err) {
      console.error("Erro inesperado:", err);
      setErrorMsg("Erro inesperado ao enviar o link de recuperação.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Esqueci minha senha | Coins for Study</title>
      </Head>

      <div
        className={`${roboto.className} h-screen w-screen overflow-hidden text-black grid md:grid-cols-[minmax(0,1fr)_440px] bg-[#F5E3FF]`}
      >
        {/* Left side image (desktop only) */}
        <div className="relative hidden md:block h-screen">
          <Image
            src="/imagem_senha.png"
            alt="Recupere o acesso e continue estudando"
            fill
            priority
            sizes="(min-width: 768px) calc(100vw - 440px), 100vw"
            className="object-contain md:object-cover md:object-[25%_center] p-4 md:p-0"
          />
        </div>

        {/* Right side form */}
        <div className="h-screen overflow-y-auto flex items-start justify-center p-6">
          <div className="w-full max-w-[360px] py-6">
            {/* Title */}
            <h1 className="text-2xl font-bold text-black text-center mb-6">
              Recuperar acesso
            </h1>

            {/* Card principal */}
            <div className="bg-[#A767CF] border border-transparent rounded-2xl p-8">
              <form className="space-y-5" onSubmit={onSubmit}>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-800 mb-1"
                  >
                    E-mail institucional (ex: nome@escola.edu)
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-[46px] w-full rounded-md border border-gray-300 bg-white px-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="nome@escola.edu"
                    required
                  />
                </div>

                {errorMsg && (
                  <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                    {errorMsg}
                  </div>
                )}

                {successMsg && (
                  <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
                    {successMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="h-[46px] w-full rounded-md bg-[#F5E3FF] hover:bg-[#6A1A78] text-black font-bold transition disabled:opacity-50 flex items-center justify-center"
                >
                  {isLoading ? (
                    <span className="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full"></span>
                  ) : (
                    "Enviar link de recuperação"
                  )}
                </button>
              </form>
            </div>

            {/* CTA */}
            <div className="mt-6 bg-[#A767CF] border border-transparent rounded-2xl p-4 text-center text-sm">
              <a
                href="/login"
                className="text-purple-700 hover:text-purple-800 font-medium"
              >
                Voltar ao login
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
