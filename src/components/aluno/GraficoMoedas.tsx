import React, { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { supabase } from "@/lib/supabaseClient"; // ajusta o caminho se precisar

interface GraficoMoedasProps {
  className?: string;
}

type DadoBarra = {
  label: string;   // nome da disciplina
  moedas: number;
};

export default function GraficoMoedas({ className }: GraficoMoedasProps) {
  const [dados, setDados] = useState<DadoBarra[]>([]);
  const [totalAcumulado, setTotalAcumulado] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1) Usuário autenticado
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          throw new Error("Não foi possível obter o usuário autenticado.");
        }

        // 2) id_usuario em usuarios
        const { data: usuario, error: usuarioError } = await supabase
          .from("usuarios")
          .select("id_usuario")
          .eq("auth_user_id", user.id)
          .maybeSingle();

        if (usuarioError || !usuario) {
          throw new Error("Usuário não encontrado na tabela usuarios.");
        }

        const idUsuario = usuario.id_usuario as number;

        // 3) id_aluno em alunos
        const { data: aluno, error: alunoError } = await supabase
          .from("alunos")
          .select("id_aluno")
          .eq("id_usuario", idUsuario)
          .maybeSingle();

        if (alunoError || !aluno) {
          throw new Error("Aluno não encontrado na tabela alunos.");
        }

        const idAluno = aluno.id_aluno as number;

        // 4) Buscar dados na MESMA VIEW do card: vw_disciplinas_moedas_aluno
        const { data: linhas, error: viewError } = await supabase
          .from("vw_disciplinas_moedas_aluno")
          .select("nome_disciplina, moedas_conquistadas")
          .eq("id_aluno", idAluno);

        if (viewError) throw viewError;

        const dadosFormatados: DadoBarra[] =
          linhas?.map((row: any) => ({
            label: row.nome_disciplina ?? "Disciplina",
            moedas: Number(row.moedas_conquistadas ?? 0),
          })) ?? [];

        setDados(dadosFormatados);

        const total = dadosFormatados.reduce(
          (acc, item) => acc + item.moedas,
          0
        );
        setTotalAcumulado(total);
      } catch (err: any) {
        console.error(err);
        setError(err.message ?? "Erro ao carregar gráfico de moedas.");
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  const maxMoedas =
    dados.length > 0 ? Math.max(...dados.map((d) => d.moedas)) : 1;

  return (
    <Card
      className={`border border-gray-200 rounded-2xl shadow-sm graph-container ${
        className ?? ""
      }`}
    >
      <CardContent className="p-6">
        {/* Título */}
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="h-5 w-5 text-violet-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Evolução de Moedas
          </h3>
        </div>

        {error && (
          <p className="text-sm text-red-600 mb-4">{error}</p>
        )}

        {loading ? (
          // Skeleton
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 min-w-[280px] animate-pulse"
              >
                <div className="w-24 h-4 bg-gray-200 rounded" />
                <div className="flex-1">
                  <div className="bg-gray-200 rounded-full h-3" />
                </div>
                <div className="w-10 h-4 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ) : dados.length === 0 ? (
          <p className="text-sm text-gray-500">
            Você ainda não possui moedas registradas.
          </p>
        ) : (
          <div className="space-y-4 overflow-x-auto">
            {dados.map((item, index) => (
              <div key={index} className="flex items-center gap-4 min-w-[280px]">
                {/* Nome da disciplina */}
                <div className="w-24 text-sm font-medium text-gray-700">
                  {item.label}
                </div>

                {/* Barra */}
                <div className="flex-1">
                  <div className="bg-gray-200 rounded-full h-3">
                    <div
                      className={`bg-gradient-to-r from-violet-400 via-violet-500 to-violet-600 h-3 rounded-full bar-animated bar-delay-${index} shadow-inner`}
                      style={{ width: `${(item.moedas / maxMoedas) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Valor */}
                <div className="flex items-center gap-1 text-sm font-bold text-violet-600 min-w-[60px] justify-end coins-value coins-delay-${index}">
                  <span>{item.moedas}</span>
                  <span>🪙</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Total acumulado */}
        <div className="mt-6 bg-violet-50 border border-violet-100 rounded-xl p-4 total-animated">
          <div className="text-center">
            <span className="font-bold text-violet-800">Total acumulado: </span>
            <span className="text-violet-800">
              {totalAcumulado} moedas 🏆
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
