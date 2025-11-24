import Head from "next/head";
import Image from "next/image";
import { Roboto } from "next/font/google";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"] });

export default function AtualizarSenhaPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [hasValidSession, setHasValidSession] = useState<boolean | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Verifica se existe uma sessão válida (token do link de recuperação)
  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        setHasValidSession(false);
      } else {
        setHasValidSession(true);
      }

      setSessionChecked(true);
    };

    checkSession();
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setErrorMsg(null);
    setSuccessMsg(null);

    if (!password || !confirmPassword) {
      setErrorMsg("Preencha todos os campos.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("As senhas não conferem.");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        console.error("Erro ao atualizar senha:", error);
        setErrorMsg(error.message || "Erro ao atualizar a senha.");
        return;
      }

      setSuccessMsg("Senha atualizada com sucesso! Você já pode fazer login.");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      console.error("Erro inesperado:", err);
      setErrorMsg("Erro inesperado ao atualizar a senha.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Atualizar senha | Coins for Study</title>
      </Head>

      <div
        className={`${roboto.className} h-screen w-screen overflow-hidden text-black grid md:grid-cols-[minmax(0,1fr)_440px] bg-[#F5E3FF]`}
      >
        {/* Lado esquerdo com imagem (desktop) */}
        <div className="relative hidden md:block h-screen">
          <Image
            src="/imagem_senha.png"
            alt="Atualize sua senha e continue estudando"
            fill
            priority
            sizes="(min-width: 768px) calc(100vw - 440px), 100vw"
            className="object-contain md:object-cover md:object-[25%_center] p-4 md:p-0"
          />
        </div>

        {/* Lado direito: formulário */}
        <div className="h-screen flex items-center justify-center bg-transparent">
          <div className="max-w-md w-full bg-[#A767CF] border border-transparent rounded-3xl p-8 shadow-xl m-4">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                Definir nova senha
              </h1>
              <p className="mt-2 text-sm text-gray-700">
                Digite e confirme a sua nova senha para acessar o Coins for
                Study.
              </p>
            </div>

            {/* Estado de verificação do link */}
            {!sessionChecked ? (
              <div className="text-sm text-gray-700 bg-white/80 border border-gray-200 rounded-xl px-4 py-3">
                Carregando informações do link, aguarde...
              </div>
            ) : hasValidSession === false ? (
              <div className="space-y-3 bg-white/80 border border-red-200 rounded-xl px-4 py-3">
                <p className="text-sm text-red-600 font-medium">
                  Este link é inválido ou expirou.
                </p>
                <p className="text-sm text-gray-700">
                  Gere um novo link na página{" "}
                  <a
                    href="/esqueci-senha"
                    className="text-purple-700 hover:text-purple-800 font-semibold"
                  >
                    “Esqueci minha senha”.
                  </a>
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-800 mb-1"
                  >
                    Nova senha
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                    placeholder="Digite a nova senha"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-800 mb-1"
                  >
                    Confirmar nova senha
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                    placeholder="Repita a nova senha"
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
                  className="w-full py-2.5 rounded-xl bg-[#F5E3FF] hover:bg-[#6A1A78] text-black font-semibold text-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Salvando..." : "Salvar nova senha"}
                </button>

                <div className="mt-4 text-center">
                  <a
                    href="/login"
                    className="text-xs text-purple-700 hover:text-purple-800 font-medium"
                  >
                    Voltar para o login
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
