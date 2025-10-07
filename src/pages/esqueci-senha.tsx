import Head from "next/head";
import Image from "next/image";
import { Roboto } from "next/font/google";
import { FormEvent, useState } from "react";

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"] });

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:3001/api/senha/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
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
      alert("Se o e-mail existir, enviaremos o link!");
    } catch (err) {
      console.error("Erro:", err);
      alert("Erro ao enviar link de recuperação");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Esqueci minha senha | Coins for Study</title>
      </Head>

      {/* Root container (mesmo design do cadastro) */}
      <div
        className={`${roboto.className} h-screen w-screen overflow-hidden text-black grid md:grid-cols-[minmax(0,1fr)_440px] bg-white`}
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
            <h1 className="text-2xl font-bold text-black text-center mb-6">
              Recuperar acesso
            </h1>

            {/* Card/painel - glassmorphism */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <form className="space-y-5" onSubmit={onSubmit}>
                {/* E-mail institucional */}
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
                    className="h-[46px] w-full rounded-md border border-gray-300 bg-white px-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black/20"
                    placeholder="nome@escola.edu"
                    required
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="h-[46px] w-full rounded-md bg-[#FACC15] hover:bg-[#FBBF24] text-black font-bold transition disabled:opacity-50 flex items-center justify-center"
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
            <div className="mt-6 bg-white border border-gray-200 rounded-2xl p-4 text-center text-sm">
              <a
                href="/login"
                className="text-blue-600 hover:text-blue-700 font-medium"
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
