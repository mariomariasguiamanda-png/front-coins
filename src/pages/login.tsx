import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { Roboto } from "next/font/google";
import GoogleG from "@/components/icons/GoogleG";
import { Eye, EyeOff } from "@/components/ui/Icons";
import { FormEvent, useState } from "react";

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"] });

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha: password }),
      });

      if (!response.ok) {
        const text = await response.text(); // pode ser HTML de erro
        console.error(`Erro ${response.status}:`, text);
        throw new Error(
          `Erro ${response.status}: ${
            text.includes("<!DOCTYPE") ? "Servidor indisponível" : text
          }`
        );
      }

      const data = await response.json();
      console.log("✅ Login realizado:", data);

      // Salvar o token
      localStorage.setItem("token", data.token);

      // Redirecionar para a página inicial do usuário logado
      router.push("/homepage-aluno");
    } catch (err: any) {
      setError(err.message || "Não foi possível fazer login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login | Coins for Study</title>
      </Head>

      {/* Root container */}
      <div
        className={`${roboto.className} min-h-dvh text-black grid md:grid-cols-12 bg-white`}
      >
        {/* Left side image (desktop only) */}
        <div className="relative hidden md:block md:col-span-8">
          <Image
            src="/imagem_coins.png"
            alt="A plataforma recompensa o aprendizado"
            fill
            priority
            sizes="(min-width: 768px) 66vw, 0vw"
            className="object-cover object-left"
          />
        </div>

        {/* Right side form */}
        <div className="md:col-span-4 flex items-center justify-center p-6">
          <div className="w-full max-w-[380px]">
            {/* Title */}
            <h1 className="text-2xl font-bold text-black text-center mb-6">
              Acesse sua conta
            </h1>

            {/* Card/panel */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <form className="space-y-5" onSubmit={onSubmit}>
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-800 mb-1"
                  >
                    E-mail
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-[46px] w-full rounded-md border border-gray-300 bg-white px-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black/20"
                    placeholder="seu@email.com"
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-800 mb-1"
                  >
                    Senha
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-[46px] w-full rounded-md border border-gray-300 bg-white pl-3 pr-11 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black/20"
                      placeholder="********"
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
                  <div className="text-right mt-1">
                    <a
                      href="/esqueci-senha"
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Esqueci minha senha
                    </a>
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
                  className="h-[46px] w-full rounded-md bg-[#06B6D4] hover:bg-[#0891B2] text-black font-bold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full"></span>
                      Entrando...
                    </>
                  ) : (
                    "Entrar"
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div className="h-px bg-gray-200 flex-1" />
                {/* <span className="text-xs text-white/70">Ou se preferir</span> */}
                <div className="h-px bg-gray-200 flex-1" />
              </div>

              {/* Google button */}
              {/* <a
                href="#"
                className="h-[46px] w-full rounded-md bg-transparent border border-white/20 text-white hover:bg-white/10 flex items-center justify-center transition"
                onClick={(e) => {
                  e.preventDefault();
                  console.log("OAuth Google: TODO");
                }}
                aria-label="Entrar com Google"
              >
                <GoogleG className="h-4 w-4 mr-3" />
                <span className="text-sm font-medium">Entre com Google</span>
              </a> */}
            </div>

            {/* CTA */}
            <div className="mt-6 bg-white border border-gray-200 rounded-2xl p-4 text-center text-sm">
              <span className="mr-1">🚀 Não tem uma conta?</span>
              <a
                href="/cadastro"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Se inscreva gratuitamente
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
