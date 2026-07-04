"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AlunoLayout from "@/components/layout/AlunoLayout";
import { Card, CardContent } from "@/components/ui/Card";
import {
  Calculator,
  BookOpen,
  ScrollText,
  Atom,
  Palette,
  Zap,
  Globe2,
  Flame,
} from "lucide-react";
import { api } from "@/lib/api";

// Metadados visuais das disciplinas (cores/ícone/slug)
const DISCIPLINAS_META: Record<
  string,
  {
    slug: string;
    nome: string;
    icon: any;
    gradient: string;
    textColor: string;
    bgColor: string;
  }
> = {
  mat: {
    slug: "mat",
    nome: "Matemática",
    icon: Calculator,
    gradient: "from-blue-500 to-blue-600",
    textColor: "text-blue-600",
    bgColor: "bg-blue-500/10",
  },
  port: {
    slug: "port",
    nome: "Português",
    icon: BookOpen,
    gradient: "from-green-500 to-green-600",
    textColor: "text-green-600",
    bgColor: "bg-green-500/10",
  },
  bio: {
    slug: "bio",
    nome: "Biologia",
    icon: Atom,
    gradient: "from-emerald-500 to-emerald-600",
    textColor: "text-emerald-600",
    bgColor: "bg-emerald-500/10",
  },
  fis: {
    slug: "fis",
    nome: "Física",
    icon: Zap,
    gradient: "from-violet-500 to-violet-600",
    textColor: "text-violet-600",
    bgColor: "bg-violet-500/10",
  },
  art: {
    slug: "art",
    nome: "Artes",
    icon: Palette,
    gradient: "from-pink-500 to-pink-600",
    textColor: "text-pink-600",
    bgColor: "bg-pink-500/10",
  },
  hist: {
    slug: "hist",
    nome: "História",
    icon: ScrollText,
    gradient: "from-amber-500 to-amber-600",
    textColor: "text-amber-600",
    bgColor: "bg-amber-500/10",
  },
  geo: {
    slug: "geo",
    nome: "Geografia",
    icon: Globe2,
    gradient: "from-teal-500 to-teal-600",
    textColor: "text-teal-600",
    bgColor: "bg-teal-500/10",
  },
  qui: {
    slug: "qui",
    nome: "Química",
    icon: Flame,
    gradient: "from-orange-500 to-red-500",
    textColor: "text-orange-600",
    bgColor: "bg-orange-500/10",
  },
  // se criar mais (geo, qui etc), só adicionar aqui
};

type ConfigCompra = {
  id_disciplina: number;
  codigo: string;
  nome: string;
  pontos_por_compra_max: number;
  preco_moedas_por_ponto: number;
};

export default function ComprarPontosPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // 🔹 saldo total (já tá certo: só do aluno, via get_total_moedas_aluno)
  const [saldoTotal, setSaldoTotal] = useState<number>(0);
  const [carregandoSaldo, setCarregandoSaldo] = useState(true);
  const [erroSaldo, setErroSaldo] = useState<string | null>(null);

  // 🔹 configs de compra por disciplina (tabela config_compra_pontos)
  const [configs, setConfigs] = useState<ConfigCompra[]>([]);
  const [carregandoConfigs, setCarregandoConfigs] = useState(true);
  const [erroConfigs, setErroConfigs] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Carrega saldo total (soma dos saldos por disciplina)
  useEffect(() => {
    if (!mounted) return;

    const carregarSaldoTotal = async () => {
      try {
        const data = await api.get("/aluno/moedas/saldo");
        const valor = (data?.disciplinas ?? []).reduce(
          (acc: number, d: any) => acc + (d.saldo ?? 0),
          0
        );
        setSaldoTotal(valor);
      } catch (err) {
        console.error("Erro ao buscar saldo total:", err);
        setErroSaldo("Não foi possível carregar o saldo de moedas.");
      } finally {
        setCarregandoSaldo(false);
      }
    };

    carregarSaldoTotal();
  }, [mounted]);

  // Carrega configs de compra (preço/limite por disciplina matriculada)
  useEffect(() => {
    if (!mounted) return;

    const carregarConfigs = async () => {
      try {
        const data = await api.get("/aluno/moedas/config-precos");
        setConfigs((data?.disciplinas ?? []) as ConfigCompra[]);
      } catch (err) {
        console.error("Erro ao buscar configs de compra:", err);
        setErroConfigs(
          "Não foi possível carregar as disciplinas disponíveis para compra."
        );
      } finally {
        setCarregandoConfigs(false);
      }
    };

    carregarConfigs();
  }, [mounted]);

  const handleSelectDisciplina = (slug: string) => {
    router.push(`/aluno/comprar-pontos/${slug}`);
  };

  if (!mounted) return null;

  const saldoFormatado =
    saldoTotal !== null ? saldoTotal.toLocaleString("pt-BR") : "0";

  // Junta configs do banco com o meta visual (cores/ícone/slug)
  const disciplinasParaExibir = configs
    .map((conf) => {
      const codigo = conf.codigo.toLowerCase();
      const meta = DISCIPLINAS_META[codigo];
      if (!meta) return null; // disciplina sem meta visual ainda

      return {
        ...meta,
        idDisciplina: conf.id_disciplina,
        codigo,
        pontos: conf.pontos_por_compra_max,
        precoMoedas: conf.preco_moedas_por_ponto,
      };
    })
    .filter(Boolean) as Array<
    (typeof DISCIPLINAS_META)["mat"] & {
      idDisciplina: number;
      codigo: string;
      pontos: number;
      precoMoedas: number;
    }
  >;

  return (
    <AlunoLayout>
      <div className="page-enter space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            🪙 Comprar Pontos
          </h1>
          <p className="text-gray-600">
            Escolha uma disciplina para comprar pontos e melhorar sua nota
          </p>
          <div className="bg-violet-50 border border-violet-100 rounded-xl p-3 inline-block">
            <span className="text-violet-800 font-semibold">
              {erroSaldo ? (
                <>Não foi possível carregar o saldo 💰</>
              ) : carregandoSaldo ? (
                <>Carregando saldo...</>
              ) : (
                <>Saldo total: {saldoFormatado} moedas 💰</>
              )}
            </span>
          </div>
        </div>

        {/* Grid de disciplinas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {carregandoConfigs && (
            <p className="text-center text-gray-500 col-span-2">
              Carregando disciplinas disponíveis...
            </p>
          )}

          {erroConfigs && !carregandoConfigs && (
            <p className="text-center text-red-500 col-span-2">{erroConfigs}</p>
          )}

          {!carregandoConfigs &&
            !erroConfigs &&
            disciplinasParaExibir.length === 0 && (
              <p className="text-center text-gray-500 col-span-2">
                Nenhuma disciplina disponível para compra de pontos no momento.
              </p>
            )}

          {!carregandoConfigs &&
            disciplinasParaExibir.map((disciplina, index) => {
              const IconComponent = disciplina.icon;
              return (
                <div
                  key={disciplina.codigo}
                  className={`rounded-2xl shadow-sm border border-gray-200 hover-lift smooth-transition cursor-pointer card-bounce card-bounce-delay-${
                    index + 1
                  } bg-white`}
                  onClick={() => handleSelectDisciplina(disciplina.slug)}
                >
                  <Card className="h-full border-0 shadow-none">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {disciplina.nome}
                          </h3>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p>
                              Pontos disponíveis:{" "}
                              <span className="font-semibold">
                                {disciplina.pontos}
                              </span>
                            </p>
                            <p>
                              Preço:{" "}
                              <span className="font-semibold">
                                {disciplina.precoMoedas} moedas
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className={`${disciplina.bgColor} p-4 rounded-xl`}>
                          <IconComponent
                            className={`${disciplina.textColor} h-8 w-8`}
                          />
                        </div>
                      </div>

                      <div
                        className={`bg-gradient-to-r ${disciplina.gradient} text-white rounded-xl p-3 text-center`}
                      >
                        <span className="font-semibold">Comprar Pontos</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
        </div>
      </div>
    </AlunoLayout>
  );
}
