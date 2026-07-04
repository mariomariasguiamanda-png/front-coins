"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  disciplinas,
  precosPontosPorDisciplina,
  moedaBRL,
} from "@/lib/mock/aluno";
import { supabase } from "@/lib/supabaseClient";

export default function ComprarPontos() {
  const [selecionada, setSelecionada] = useState<string | null>(null);
  const [qtd, setQtd] = useState(10);

  // 🔹 Saldo total de moedas (somando moedas_conquistadas da vw_disciplinas_moedas_aluno)
  const [saldoTotal, setSaldoTotal] = useState<number | null>(null);
  const [carregandoSaldo, setCarregandoSaldo] = useState(true);
  const [erroSaldo, setErroSaldo] = useState<string | null>(null);

  const preco = precosPontosPorDisciplina.find(
    (p) => p.disciplinaId === selecionada
  );
  const total = preco ? preco.precoPorPonto * qtd : 0;
  const maximoPorCompra = 10; // fallback, já que o mock não possui esta propriedade

  useEffect(() => {
    const carregarSaldoTotal = async () => {
      const { data, error } = await supabase
        .from("vw_disciplinas_moedas_aluno")
        .select("moedas_conquistadas");

      if (error) {
        console.error("Erro ao buscar saldo total de moedas:", error);
        setErroSaldo("Não foi possível carregar o saldo total de moedas.");
        setCarregandoSaldo(false);
        return;
      }

      const rows = (data ?? []) as { moedas_conquistadas: number | null }[];

      // soma todas as moedas_conquistadas de todas as disciplinas
      const soma = rows.reduce(
        (acc, row) => acc + (row.moedas_conquistadas ?? 0),
        0
      );

      setSaldoTotal(soma);
      setCarregandoSaldo(false);
    };

    carregarSaldoTotal();
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold mb-1">🪙 Comprar Pontos</h2>
          {erroSaldo ? (
            <p className="text-sm text-red-300">{erroSaldo}</p>
          ) : (
            <p className="text-sm text-white/80">
              Saldo total:{" "}
              {carregandoSaldo ? "carregando..." : `${saldoTotal ?? 0} moedas`}{" "}
              🪙
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr,1.2fr] gap-4">
        {/* Coluna 1: Cards de disciplinas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {disciplinas.map((disciplina) => (
            <div
              key={disciplina.id}
              className={`cursor-pointer transition-all ${
                selecionada === disciplina.id
                  ? "ring-2 ring-purple-400 shadow-lg"
                  : "hover:shadow-md"
              }`}
              onClick={() => setSelecionada(disciplina.id)}
            >
              <Card className="h-full">
                <CardContent className="p-4 flex flex-col h-full">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {disciplina.nome}
                      </h3>
                      <p className="text-xs text-gray-500">
                        Seu saldo nesta disciplina: {disciplina.moedas} moedas
                      </p>
                    </div>
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${disciplina.cor}20` }}
                    >
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: disciplina.cor }}
                      />
                    </div>
                  </div>

                  <Button className="mt-auto w-full font-semibold bg-purple-600 hover:bg-purple-500 text-white">
                    Comprar Pontos
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Coluna 2: Resumo da compra */}
        <Card className="bg-gradient-to-br from-purple-900/60 to-purple-700/60 border border-purple-500/40 text-white">
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold text-lg">Resumo da Compra</h3>

            {selecionada ? (
              <div className="space-y-4">
                {preco && (
                  <>
                    <p className="text-sm text-purple-100">
                      Disciplina selecionada:{" "}
                      <span className="font-semibold">
                        {disciplinas.find((d) => d.id === selecionada)?.nome}
                      </span>
                    </p>

                    <div className="flex items-center gap-3">
                      <span className="text-sm">Quantidade de pontos:</span>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 rounded-full border-purple-400/60 text-purple-100 hover:bg-purple-500/20"
                          onClick={() =>
                            setQtd((prev) => Math.max(1, prev - 1))
                          }
                        >
                          -
                        </Button>
                        <span className="w-10 text-center font-semibold">
                          {qtd}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 rounded-full border-purple-400/60 text-purple-100 hover:bg-purple-500/20"
                          onClick={() =>
                            setQtd((prev) =>
                              Math.min(maximoPorCompra, prev + 1)
                            )
                          }
                        >
                          +
                        </Button>
                      </div>
                    </div>

                    <p className="text-xs text-purple-200">
                      Máximo: {maximoPorCompra} pontos por compra
                    </p>

                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Pontos:</span>
                        <span>{qtd}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Preço unitário:</span>
                        <span>{preco.precoPorPonto} moedas</span>
                      </div>
                      <div className="flex justify-between text-base font-semibold border-t border-purple-400/40 pt-2">
                        <span>Total:</span>
                        <span className="text-amber-300">{total} moedas</span>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex gap-2">
                  <Button className="bg-amber-400 text-purple-900 hover:bg-amber-300">
                    Confirmar compra
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelecionada(null)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-white/80">
                Selecione uma disciplina para continuar.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
