import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { Roboto } from "next/font/google";
import { Eye, EyeOff } from "@/components/ui/Icons";
import { FormEvent, useState } from "react";
import { HiOutlineMail, HiOutlineLockClosed } from "react-icons/hi";
import { supabase } from "@/lib/supabaseClient";

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"] });

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mapeia vários formatos possíveis de tipo_usuario
  const redirectByRole = (tipo: string | null | undefined) => {
  console.log("Redirecionando para o tipo:", tipo);
  switch (tipo) {
    case "admin":
      return "/adm/dashboard";
    case "professor":
      return "/professor/dashboard";
    case "aluno":
    default:
      return "/aluno/inicio";
  }
};


  const onSubmit = async (e: FormEvent) => {
  e.preventDefault();
  setError(null);
  setIsLoading(true);

  try {
    // 1) Login no Supabase com e-mail e senha
    const { data: signInData, error: signInErr } =
      await supabase.auth.signInWithPassword({ email, password });

    console.log("signInData:", signInData);

    if (signInErr) {
      console.error("Erro no signIn:", signInErr);
      throw new Error(signInErr.message);
    }

    const userId = signInData.user?.id;
    console.log("userId:", userId);

    if (!userId) throw new Error("Não foi possível identificar o usuário.");

    // 2) Consulta o tipo de usuário na tabela `usuarios` USANDO O EMAIL
    const { data: perfil, error: perfilErr } = await supabase
      .from("usuarios")
      .select("tipo_usuario")
      .eq("email", email) // 🔥 TROCA AQUI: antes era auth_user_id
      .maybeSingle();

    console.log("🟢 Resultado da consulta em usuarios:", { perfil, perfilErr });

    if (perfilErr) {
      console.warn("⚠️ Erro ao buscar perfil em usuarios:", perfilErr);
    }

    const tipo = perfil?.tipo_usuario ?? "aluno";
    const destino = redirectByRole(tipo);

    console.log("redirectByRole | tipo_usuario recebido:", tipo);
    console.log("Redirecionando para:", destino);

    router.push(destino);
  } catch (err: any) {
    console.error("Erro no login:", err);
    setError(err?.message || "Não foi possível fazer login.");
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
        className={`${roboto.className} min-h-screen w-full text-black grid md:grid-cols-12 bg-gradient-to-r from-white via-white to-[#f3e8ff]`}
      >
        <div className="relative hidden md:block md:col-span-8 overflow-hidden">
          <img
  src="/imagem_login.jpeg"
  alt="A plataforma recompensa o aprendizado"
  className="w-full h-full object-cover object-center"
/>
          <div className="absolute inset-y-0 right-0 w-[240px] bg-gradient-to-r from-white/0 via-white/100 to-[#f9fafb] pointer-events-none" />
        </div>

        <div className="md:col-span-4 flex items-center justify-center p-6">
          <div className="w-full max-w-[380px] bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-lg">
            <h1 className="text-2xl font-bold text-black text-center mb-6">
              Faça seu login
            </h1>

            <form className="space-y-5" onSubmit={onSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-800 mb-1"
                />
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
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-800 mb-1"
                />
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
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-600 hover:text-black focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
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
                <div className="text-red-500 text-sm text-center">{error}</div>
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
          </div>
        </div>
      </div>
    </>
  );

}
