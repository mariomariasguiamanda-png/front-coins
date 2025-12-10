"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { BarChart3, Award, TrendingUp, Calendar } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { getAlunoFromSession } from "@/lib/getAlunoFromSession";

type NotaFinalDisciplina = {
  id_disciplina: number;
  nome_disciplina: string;
  codigo_disciplina: string | null;
  nota_final: number | null;
  status_final: string | null;
  atualizado_em: string | null;
};

type Stats = {
  mediaGeral: number | null;
  aprovadas: number;
  recuperacao: number;
  totalDisciplinasComNota: number;
};

export default function MinhasNotas() {
  const [stats, setStats] = useState<Stats>({
    mediaGeral: null,
    aprovadas: 0,
    recuperacao: 0,
    totalDisciplinasComNota: 0,
  });

  const [notasFinais, setNotasFinais] = useState<NotaFinalDisciplina[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErro(null);

        // 1) pega id do aluno logado
        const { idAluno } = await getAlunoFromSession();

        // 2) consulta a view vw_notas_finais_aluno
        const { data, error } = await supabase
          .from("vw_notas_finais_aluno")
          .select(
            `
            id_disciplina,
            nome_disciplina,
            codigo_disciplina,
            nota_final,
            status_final,
            atualizado_em
          `
          )
          .eq("id_aluno", idAluno);

        if (error) {
          console.error(error);
          throw new Error("Erro ao carregar notas finais.");
        }

        const rows = (data ?? []) as any[];

        const convertidos: NotaFinalDisciplina[] = rows.map((row) => ({
          id_disciplina: row.id_disciplina,
          nome_disciplina: row.nome_disciplina,
          codigo_disciplina: row.codigo_disciplina,
          nota_final:
            row.nota_final !== null && row.nota_final !== undefined
              ? Number(row.nota_final)
              : null,
          status_final: row.status_final,
          atualizado_em: row.atualizado_em,
        }));

        // 3) calcula estatísticas em cima das notas finais
        let soma = 0;
        let qtd = 0;
        let aprov = 0;
        let rec = 0;

        for (const n of convertidos) {
          if (n.nota_final !== null && !isNaN(n.nota_final)) {
            soma += n.nota_final;
            qtd += 1;

            if (n.status_final === "aprovado") aprov += 1;
            else if (n.status_final === "recuperacao") rec += 1;
            else {
              // se não tiver status_final, podemos inferir pela nota
              if (n.nota_final >= 6) aprov += 1;
              else rec += 1;
            }
          }
        }

        setNotasFinais(convertidos);
        setStats({
          mediaGeral: qtd > 0 ? soma / qtd : null,
          aprovadas: aprov,
          recuperacao: rec,
          totalDisciplinasComNota: qtd,
        });
      } catch (err: any) {
        console.error(err);
        setErro(err.message || "Erro ao carregar suas notas.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const getNotaColor = (nota: number | null) => {
    if (nota === null) return "text-gray-500";
    if (nota >= 8) return "text-green-600";
    if (nota >= 7) return "text-blue-600";
    if (nota >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusBadgeClasses = (status: string | null) => {
    if (status === "aprovado") return "bg-green-100 text-green-700";
    if (status === "recuperacao") return "bg-yellow-100 text-yellow-700";
    if (status === "reprovado") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  // ---------------- RENDER ----------------

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-violet-700">Minhas Notas</h1>
        <p className="text-gray-500 mt-2">Carregando...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-violet-700">Minhas Notas</h1>
        <p className="mt-4 text-red-600">{erro}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Título */}
      <div>
        <h1 className="text-3xl font-bold text-violet-700">Minhas Notas</h1>
        <p className="text-gray-600 mt-2">
          Acompanhe sua nota final em cada disciplina.
        </p>
      </div>

      {/* Cards Estatísticos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white rounded-xl shadow-md">
          <CardContent className="p-6 flex justify-between">
            <div>
              <p className="text-sm text-gray-600">Média Geral</p>
              <p className="text-2xl font-bold text-violet-700">
                {stats.mediaGeral !== null ? stats.mediaGeral.toFixed(1) : "-"}
              </p>
            </div>
            <div className="p-3 bg-violet-500 text-white rounded-xl">
              <BarChart3 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-xl shadow-md">
          <CardContent className="p-6 flex justify-between">
            <div>
              <p className="text-sm text-gray-600">Aprovadas</p>
              <p className="text-2xl font-bold text-violet-700">
                {stats.aprovadas}
              </p>
            </div>
            <div className="p-3 bg-green-500 text-white rounded-xl">
              <Award className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-xl shadow-md">
          <CardContent className="p-6 flex justify-between">
            <div>
              <p className="text-sm text-gray-600">Recuperação</p>
              <p className="text-2xl font-bold text-violet-700">
                {stats.recuperacao}
              </p>
            </div>
            <div className="p-3 bg-yellow-500 text-white rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-xl shadow-md">
          <CardContent className="p-6 flex justify-between">
            <div>
              <p className="text-sm text-gray-600">Disciplinas com Nota</p>
              <p className="text-2xl font-bold text-violet-700">
                {stats.totalDisciplinasComNota}
              </p>
            </div>
            <div className="p-3 bg-blue-500 text-white rounded-xl">
              <Calendar className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Notas Finais */}
      <Card className="bg-white rounded-xl shadow-md mt-6">
        <CardContent className="p-0">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold">Notas Finais por Disciplina</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4">Disciplina</th>
                  <th className="text-left py-3 px-4">Código</th>
                  <th className="text-center py-3 px-4">Nota Final</th>
                  <th className="text-center py-3 px-4">Status</th>
                  <th className="text-center py-3 px-4">Atualizado em</th>
                </tr>
              </thead>
              <tbody>
                {notasFinais.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-gray-500">
                      Nenhuma disciplina cadastrada ou nota final registrada.
                    </td>
                  </tr>
                ) : (
                  notasFinais.map((item) => (
                    <tr
                      key={item.id_disciplina}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">{item.nome_disciplina}</td>
                      <td className="py-3 px-4">
                        {item.codigo_disciplina ?? "-"}
                      </td>
                      <td
                        className={`py-3 px-4 text-center font-bold ${getNotaColor(
                          item.nota_final
                        )}`}
                      >
                        {item.nota_final !== null
                          ? item.nota_final.toFixed(1)
                          : "-"}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClasses(
                            item.status_final
                          )}`}
                        >
                          {item.status_final
                            ? item.status_final === "aprovado"
                              ? "Aprovado"
                              : item.status_final === "recuperacao"
                                ? "Recuperação"
                                : "Reprovado"
                            : "-"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center text-gray-500">
                        {item.atualizado_em
                          ? new Date(item.atualizado_em).toLocaleDateString(
                              "pt-BR"
                            )
                          : "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
