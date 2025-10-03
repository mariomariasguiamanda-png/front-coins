import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { Roboto } from "next/font/google";
import { Eye, EyeOff } from "@/components/ui/Icons";
import { FormEvent, useState, useEffect } from "react";

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"] });

export default function RedefinirSenhaPage() {
  const router = useRouter();
  const [senha, setSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Pegar o token da URL
    if (router.query.token) {
      setToken(router.query.token as string);
    }
  }, [router.query.token]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (senha !== confirmSenha) {
      setError("As senhas não coincidem.");
      setIsLoading(false);
      return;
    }

    if (!token) {
      setError("Token inválido.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/api/senha/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, novaSenha: senha }),
      });

      if (!res.ok) {
        const text = await res.text(); // pode ser HTML de erro
        console.error(`Erro ${res.status}:`, text);
        throw new Error(
          `Erro ${res.status}: ${
            text.includes("<!DOCTYPE") ? "Servidor indisponível" : text
          }`
        );
      }

      const data = await res.json();
      console.log("Resposta:", data);
      alert("Senha redefinida com sucesso!");
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Não foi possível redefinir a senha.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Redefinir senha | Coins for Study</title>
      </Head>

      {/* Root container (mesmo design do cadastro) */}
      <div
        className={`${roboto.className} h-screen w-screen overflow-hidden text-black grid md:grid-cols-[minmax(0,1fr)_440px] bg-white`}
      >
        {/* Left side image (desktop only) */}
        <div className="relative hidden md:block h-screen">
          <Image
            src="/imagem_senha.png"
            alt="Redefina sua senha"
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
              Redefinir senha
            </h1>

            {/* Card/painel - glassmorphism */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <form className="space-y-5" onSubmit={onSubmit}>
                {/* Nova senha */}
                <div>
                  <label
                    htmlFor="senha"
                    className="block text-sm font-semibold text-gray-800 mb-1"
                  >
                    Nova senha
                  </label>
                  <div className="relative">
                    <input
                      id="senha"
                      name="senha"
                      type={showPassword ? "text" : "password"}
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      className="h-[46px] w-full rounded-md border border-gray-300 bg-white pl-3 pr-11 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black/20"
                      placeholder="********"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={
                        showPassword ? "Ocultar senha" : "Mostrar senha"
                      }
                      className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-600 hover:text-black focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirmar senha */}
                <div>
                  <label
                    htmlFor="confirmSenha"
                    className="block text-sm font-semibold text-gray-800 mb-1"
                  >
                    Confirmar nova senha
                  </label>
                  <div className="relative">
                    <input
                      id="confirmSenha"
                      name="confirmSenha"
                      type={showConfirm ? "text" : "password"}
                      value={confirmSenha}
                      onChange={(e) => setConfirmSenha(e.target.value)}
                      className="h-[46px] w-full rounded-md border border-gray-300 bg-white pl-3 pr-11 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black/20"
                      placeholder="********"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      aria-label={
                        showConfirm
                          ? "Ocultar confirmação de senha"
                          : "Mostrar confirmação de senha"
                      }
                      className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-600 hover:text-black focus:outline-none"
                    >
                      {showConfirm ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="text-red-400 text-sm text-center">
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="h-[46px] w-full rounded-md bg-[#06B6D4] hover:bg-[#0891B2] text-black font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Redefinindo..." : "Redefinir senha"}
                </button>
              </form>
            </div>

            {/* CTA */}
            <div className="mt-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center text-sm">
              <span className="mr-1">Lembrou da senha?</span>
              <a
                href="/login"
                className="text-[#F97316] hover:text-[#EA580C] font-medium"
              >
                Fazer login
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
