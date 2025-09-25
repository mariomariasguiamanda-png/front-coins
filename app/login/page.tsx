"use client";

import { useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Por favor, preencha todos os campos");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Simular login - substitua pela sua lógica de autenticação
      console.log("Login:", { email, password, role });

      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirecionar após login bem-sucedido
      router.push("/dashboard");
    } catch (err) {
      setError("Erro ao fazer login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = () => {
    router.push("/cadastro");
  };

  const onEmailChange = (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const onPasswordChange = (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
  const onRoleChange = (e: ChangeEvent<HTMLSelectElement>) => setRole(e.target.value);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Imagem de fundo cobrindo toda a tela, alinhada à esquerda */}
      <Image
        src="/imagem_coins.png"
        alt="Coins for Study"
        fill
        sizes="100vw"
        priority
        className="object-cover object-left"
      />

      {/* Leve overlay para contraste do card sobre a imagem */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Container do card ancorado à esquerda */}
      <div className="absolute inset-0 flex items-center justify-start">
        <div className="w-full max-w-sm mx-4 sm:mx-8 md:ml-16">
          <div className="rounded-2xl bg-white/90 backdrop-blur text-zinc-900 shadow-2xl">
            {/* Header compacto */}
            <div className="flex flex-col items-center pt-5 pb-1 gap-1">
              <Image
                src="/logo-coins.png"
                alt="Coins for Study"
                width={200}
                height={200}
                priority
                className="block rounded-2xl drop-shadow-md w-16 h-16 sm:w-20 sm:h-20 lg:w-28 lg:h-28 xl:w-40 xl:h-40"
              />
              <h2 className="text-xl font-semibold leading-tight">Acesse sua conta</h2>
            </div>

            {/* Conteúdo compacto */}
            <div className="px-6 pb-5">
              {/* Social */}
              <div className="grid grid-cols-2 gap-2.5 mb-4">
                <button
                  type="button"
                  className="h-10 rounded-xl border border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50 flex items-center justify-center"
                  onClick={() => alert("TODO: OAuth GitHub")}
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 mr-2" aria-hidden="true">
                    <path fill="currentColor" d="M12 .5A11.5 11.5 0 0 0 .5 12.6c0 5.3 3.4 9.7 8.2 11.2.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.6-1.5-1.4-1.9-1.4-1.9-1.2-.8.1-.8.1-.8 1.3.1 2 .9 2 .9 1.2 2 2.9 1.4 3.6 1.1.1-.9.5-1.4.8-1.7-2.7-.3-5.6-1.4-5.6-6.1 0-1.4.5-2.5 1.3-3.4-.1-.3-.6-1.7.1-3.5 0 0 1.1-.4 3.5 1.3a11.9 11.9 0 0 1 6.4 0c2.4-1.7 3.5-1.3 3.5-1.3.7 1.8.2 3.2.1 3.5.8.9 1.3 2 1.3 3.4 0 4.7-2.9 5.8-5.7 6.1.5.4.9 1.1.9 2.3v3.3c0 .3.2.7.8.6 4.8-1.5 8.2-5.9 8.2-11.2A11.5 11.5 0 0 0 12 .5z"/>
                  </svg>
                  GitHub
                </button>
                <button
                  type="button"
                  className="h-10 rounded-xl border border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50 flex items-center justify-center"
                  onClick={() => alert("TODO: OAuth Google")}
                >
                  <svg viewBox="0 0 48 48" className="h-4 w-4 mr-2" aria-hidden="true">
                    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 31.9 29.2 35 24 35c-6.6 0-12-5.4-12-12S17.4 11 24 11c3 0 5.7 1.1 7.7 3l5.7-5.7C34 4.7 29.3 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.2-.1-2.3-.4-3.5z"/>
                    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.7 18.9 13 24 13c3 0 5.7 1.1 7.7 3l5.7-5.7C34 4.7 29.3 3 24 3 15.1 3 7.6 8.1 4.3 15.4l2 2.3z"/>
                    <path fill="#4CAF50" d="M24 45c5.1 0 9.8-1.9 13.3-5.1l-6.1-5c-2 1.5-4.6 2.4-7.2 2.4-5.1 0-9.4-3.3-10.9-7.8l-6.7 5.2C9.7 40.4 16.3 45 24 45z"/>
                    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.3 3.8-4.8 7-9.3 7-5.1 0-9.4-3.3-10.9-7.8l-6.7 5.2C9.7 40.4 16.3 45 24 45c9.9 0 18-8.1 18-18 0-1.2-.1-2.3-.4-3.5z"/>
                  </svg>
                  Google
                </button>
              </div>

              {/* Form compacto */}
              <div className="space-y-3">
                <div>
                  <label className="text-zinc-800 text-sm">E-mail</label>
                  <input
                    type="email"
                    placeholder="nome@escola.edu"
                    value={email}
                    onChange={onEmailChange}
                    className="h-10 w-full rounded-xl bg-white text-zinc-900 border border-zinc-300 px-3 placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600"
                  />
                </div>

                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <label className="text-zinc-800 text-sm">Senha</label>
                    <button
                      type="button"
                      className="text-xs text-violet-700 hover:text-violet-800"
                      onClick={() => router.push("/esqueci-senha")}
                    >
                      Esqueci minha senha
                    </button>
                  </div>
                  <input
                    type="password"
                    placeholder="********"
                    value={password}
                    onChange={onPasswordChange}
                    className="h-10 w-full rounded-xl bg-white text-zinc-900 border border-zinc-300 px-3 placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600"
                  />
                </div>

                <div>
                  <label className="text-zinc-800 text-sm">Perfil</label>
                  <select
                    value={role}
                    onChange={onRoleChange}
                    className="mt-1 h-10 w-full rounded-xl border border-zinc-300 bg-white px-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-violet-600"
                  >
                    <option value="student">Aluno</option>
                    <option value="teacher">Professor</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <button
                  type="button"
                  className="h-11 w-full rounded-xl bg-violet-700 hover:bg-violet-600 text-white"
                  onClick={handleLogin}
                  disabled={loading}
                >
                  {loading ? "Entrando…" : "Entrar"}
                </button>

                <div className="mt-4 h-px bg-zinc-200" />

                <button
                  type="button"
                  className="h-10 w-full rounded-xl border border-violet-700 text-violet-700 hover:bg-violet-50"
                  onClick={handleCreateAccount}
                >
                  Criar conta
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

