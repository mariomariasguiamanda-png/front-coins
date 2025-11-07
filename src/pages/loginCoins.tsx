import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { Roboto } from "next/font/google";
import GoogleG from "@/components/icons/GoogleG";
import { Eye, EyeOff } from "@/components/ui/Icons";
import { FormEvent, useState } from "react";
import { HiOutlineMail, HiOutlineLockClosed } from "react-icons/hi";

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
        const text = await response.text();
        console.error(`Erro ${response.status}:`, text);
        throw new Error(
          `Erro ${response.status}: ${
            text.includes("<!DOCTYPE") ? "Servidor indisponível" : text
          }`
        );
      }

      const data = await response.json();
      console.log("✅ Login realizado:", data);

      localStorage.setItem("token", data.token);
      router.push("/aluno");
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

      <div
        className={`${roboto.className} min-h-dvh text-black grid md:grid-cols-12 bg-gradient-to-r from-white via-white to-[#f3e8ff]`}
      >
        <div className="relative hidden md:block md:col-span-8 overflow-hidden">
          <Image
            src="/imagem_login.jpeg"
            alt="A plataforma recompensa o aprendizado"
            fill
            priority
            unoptimized={false}
            quality={100}
            sizes="(min-width: 768px) 66vw, 0vw"
            className="object-cover object-[100%] scale-[1.08]"
          />
          <div className="absolute inset-y-0 right-0 w-[240px] bg-gradient-to-r from-white/0 via-white/100 to-[#f9fafb] pointer-events-none" />
        </div>

        <div className="md:col-span-4 flex items-center justify-start pl-6 p-6">
          <div className="w-full max-w-[380px] bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-lg">
            <h1 className="text-2xl font-bold text-black text-center mb-6">
              Faça seu login
            </h1>

            <form className="space-y-5" onSubmit={onSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-800 mb-1"
                ></label>
                <div className="relative">
                  <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-[48px] w-full rounded-full border border-gray-300 bg-white pl-11 pr-3 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/20"
                    placeholder="Email"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-800 mb-1"
                ></label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-[48px] w-full rounded-full border border-gray-300 bg-white pl-11 pr-11 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/20"
                    placeholder="Senha"
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
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Esqueci minha senha
                  </a>
                </div>
              </div>

              {error && (
                <div className="text-red-400 text-sm text-center">{error}</div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="h-[48px] w-full rounded-full bg-gradient-to-l from-[#5B21B6] to-[#7C3AED] hover:opacity-90 text-white font-bold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                    Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </button>
            </form>

            <div className="flex items-center gap-3 my-6">
              <div className="h-px bg-gray-200 flex-1" />
              <div className="h-px bg-gray-200 flex-1" />
            </div>

            <div className="bg-white/70 rounded-2xl p-4 text-center text-sm border border-gray-200">
              <span className="mr-1">🚀 Não tem uma conta?</span>
              <a
                href="/cadastro"
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Inscreva-se
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}