import Head from "next/head";
import Image from "next/image";
import { Roboto } from "next/font/google";
import { FormEvent, useState } from "react";

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"] });

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Solicitar recuperação de senha para:", email);
  };

  return (
    <>
      <Head>
        <title>Esqueci minha senha | Coins for Study</title>
      </Head>

      {/* Root container (mesmo design do cadastro) */}
      <div
        className={`${roboto.className} h-screen w-screen overflow-hidden text-white grid md:grid-cols-[minmax(0,1fr)_440px] bg-gradient-to-br from-[#C084FC] via-[#7C3AED] to-[#1E1E1E]`}
      >
        {/* Left side image (desktop only) */}
        <div className="relative hidden md:block h-screen">
          <Image
            src="/imagem_senha.png"
            alt="Crie sua conta e comece a ganhar moedas"
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
            <h1 className="text-2xl font-bold text-white text-center mb-6">
              Recuperar acesso
            </h1>

            {/* Card/painel - glassmorphism */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
              <form className="space-y-5" onSubmit={onSubmit}>
                {/* E-mail institucional */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-white/90 mb-1"
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
                    className="h-[46px] w-full rounded-md border border-white/20 bg-transparent px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                    placeholder="nome@escola.edu"
                    required
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="h-[46px] w-full rounded-md bg-[#FACC15] hover:bg-[#FBBF24] text-black font-bold transition"
                >
                  Enviar link de recuperação
                </button>
              </form>
            </div>

            {/* CTA */}
            <div className="mt-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center text-sm">
              <a
                href="/login"
                className="text-[#F97316] hover:text-[#EA580C] font-medium"
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
