import Head from "next/head";
import Image from "next/image";
import { Roboto } from "next/font/google";
import GoogleG from "@/components/icons/GoogleG";
import { Eye, EyeOff } from "@/components/ui/Icons";
import { FormEvent, useState } from "react";

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"] });

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log({ email, password });
  };

  return (
    <>
      <Head>
        <title>Login | Coins for Study</title>
      </Head>

      {/* Root container */}
      <div
        className={`${roboto.className} min-h-dvh text-white grid md:grid-cols-12 bg-gradient-to-br from-[#C084FC] via-[#7C3AED] to-[#1E1E1E]`}
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
            <h1 className="text-2xl font-bold text-white text-center mb-6">
              Acesse sua conta
            </h1>

            {/* Card/panel */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
              <form className="space-y-5" onSubmit={onSubmit}>
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-white/90 mb-1"
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
                    className="h-[46px] w-full rounded-md border border-white/20 bg-transparent px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                    placeholder="seu@email.com"
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-white/90 mb-1"
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
                      className="h-[46px] w-full rounded-md border border-white/20 bg-transparent pl-3 pr-11 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                      placeholder="********"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={
                        showPassword ? "Ocultar senha" : "Mostrar senha"
                      }
                      className="absolute inset-y-0 right-0 px-3 flex items-center text-white/70 hover:text-white focus:outline-none"
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
                      className="text-sm text-[#F97316] hover:text-[#EA580C] font-medium"
                    >
                      Esqueci minha senha
                    </a>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="h-[46px] w-full rounded-md bg-[#06B6D4] hover:bg-[#0891B2] text-black font-bold transition"
                >
                  Entrar
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div className="h-px bg-white/20 flex-1" />
                <span className="text-xs text-white/70">Ou se preferir</span>
                <div className="h-px bg-white/20 flex-1" />
              </div>

              {/* Google button */}
              <a
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
              </a>
            </div>

            {/* CTA */}
            <div className="mt-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center text-sm">
              <span className="mr-1">🚀 Não tem uma conta?</span>
              <a
                href="/cadastro"
                className="text-[#F97316] hover:text-[#EA580C] font-medium"
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
