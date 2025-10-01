import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { Roboto } from "next/font/google";
import GoogleG from "@/components/icons/GoogleG";
import { Eye, EyeOff } from "@/components/ui/Icons";
import { FormEvent, useState } from "react";
import { useAuth } from "@/services/auth/AuthContext";

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"] });

export default function CadastroPage() {
  const { register: registerUser, isLoading } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<"student" | "teacher" | "admin">("student");
  const [institution, setInstitution] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cadastros`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: name,
          email,
          senha: password,
          perfil: role,
          instituicao: institution,
          telefone: phone,
        }),
      });

      if (!res.ok) {
        const text = await res.text(); // pode ser HTML de erro
        console.error(`Erro ${res.status}:`, text);
        setError(`Erro ${res.status}: ${text.includes('<!DOCTYPE') ? 'Servidor indisponível' : text}`);
        return;
      }

      const data = await res.json();
      console.log("✅ Cadastro criado:", data);

      // Mostrar feedback de sucesso incluindo informação sobre email
      alert(
        "Cadastro realizado com sucesso! 🎉 Verifique seu e-mail para mais informações."
      );
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Não foi possível criar a conta.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Cadastro | Coins for Study</title>
      </Head>

      {/* Root container (mesmo design do login) */}
      <div
        className={`${roboto.className} h-screen w-screen overflow-hidden text-white grid md:grid-cols-[minmax(0,1fr)_440px] bg-gradient-to-br from-[#C084FC] via-[#7C3AED] to-[#1E1E1E]`}
      >
        {/* Left side image (desktop only) */}
        <div className="relative hidden md:block h-screen">
          <Image
            src="/imagem_cadastro.png"
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
              Crie sua conta
            </h1>

            {/* Card/painel - glassmorphism */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
              <form className="space-y-5" onSubmit={onSubmit}>
                {/* Nome completo */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-white/90 mb-1"
                  >
                    Nome completo
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-[46px] w-full rounded-md border border-white/20 bg-transparent px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                    placeholder="Seu nome completo"
                    required
                  />
                </div>

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

                {/* Perfil */}
                <div>
                  <label
                    htmlFor="role"
                    className="block text-sm font-semibold text-white/90 mb-1"
                  >
                    Perfil
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={role}
                    onChange={(e) =>
                      setRole(e.target.value as "student" | "teacher" | "admin")
                    }
                    className="h-[46px] w-full rounded-md border border-white/20 bg-transparent px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                  >
                    <option className="bg-[#1E1E1E] text-white" value="student">
                      Aluno
                    </option>
                    <option className="bg-[#1E1E1E] text-white" value="teacher">
                      Professor
                    </option>
                    <option className="bg-[#1E1E1E] text-white" value="admin">
                      Administrador
                    </option>
                  </select>
                </div>

                {/* Senha */}
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
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-[46px] w-full rounded-md border border-white/20 bg-transparent pl-3 pr-11 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                      placeholder="********"
                      required
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
                </div>

                {/* Confirmar senha */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-semibold text-white/90 mb-1"
                  >
                    Confirmar senha
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-[46px] w-full rounded-md border border-white/20 bg-transparent pl-3 pr-11 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
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
                      className="absolute inset-y-0 right-0 px-3 flex items-center text-white/70 hover:text-white focus:outline-none"
                    >
                      {showConfirm ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Instituição / Escola (opcional) */}
                <div>
                  <label
                    htmlFor="institution"
                    className="block text-sm font-semibold text-white/90 mb-1"
                  >
                    Instituição / Escola (opcional)
                  </label>
                  <input
                    id="institution"
                    name="institution"
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    className="h-[46px] w-full rounded-md border border-white/20 bg-transparent px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                    placeholder="Ex.: Escola Estadual XYZ"
                  />
                </div>

                {/* Telefone (opcional) */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-semibold text-white/90 mb-1"
                  >
                    Telefone (opcional)
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-[46px] w-full rounded-md border border-white/20 bg-transparent px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                    placeholder="(11) 99999-9999"
                  />
                </div>

                {error && (
                  <div className="text-red-400 text-sm text-center">
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-[46px] w-full rounded-md bg-[#06B6D4] hover:bg-[#0891B2] text-black font-bold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full"></span>
                      Criando conta...
                    </>
                  ) : (
                    "Criar conta"
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div className="h-px bg-white/20 flex-1" />
                <span className="text-xs text-white/70">Ou</span>
                <div className="h-px bg-white/20 flex-1" />
              </div>

              {/* Google button */}
              <a
                href="#"
                className="h-[46px] w-full rounded-md bg-transparent border border-white/20 text-white hover:bg-white/10 flex items-center justify-center transition"
                onClick={(e) => {
                  e.preventDefault();
                  console.log("OAuth Google (cadastro): TODO");
                }}
                aria-label="Cadastrar com Google"
              >
                <GoogleG className="h-4 w-4 mr-3" />
                <span className="text-sm font-medium">
                  Cadastrar com Google
                </span>
              </a>
            </div>

            {/* CTA */}
            <div className="mt-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center text-sm">
              <span className="mr-1">Já tem uma conta?</span>
              <a
                href="/login"
                className="text-[#F97316] hover:text-[#EA580C] font-medium"
              >
                Entrar
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
