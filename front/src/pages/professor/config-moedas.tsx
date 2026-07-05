import { useEffect, useState } from "react";
import { ConfigMoedasProfessor } from "@/components/professor/ConfigMoedasProfessor";
import { ProfessorLayout } from "@/components/professor/ProfessorLayout";
import { api } from "@/lib/api";

const PALETA_CORES = ["azul", "verde", "roxo", "laranja", "amarelo", "rosa"];

type DisciplinaConfig = {
  id: string;
  nome: string;
  precoMoedas: number;
  pontosDisponiveis: number;
  cor: string;
  totalAlunos: number;
  moedasCirculacao: number;
};

type HistoricoItem = {
  id: string;
  disciplina: string;
  alteracao: string;
  usuario: string;
  data: string;
};

export default function ConfigMoedasPage() {
  const [disciplinas, setDisciplinas] = useState<DisciplinaConfig[]>([]);
  const [historico, setHistorico] = useState<HistoricoItem[]>([]);
  const [loading, setLoading] = useState(true);

  const carregar = async () => {
    try {
      setLoading(true);
      const [configs, hist] = await Promise.all([
        api.get("/professor/moedas/config-precos"),
        api.get("/professor/moedas/historico-precos"),
      ]);

      setDisciplinas(
        (configs ?? []).map((d: any, index: number) => ({
          id: String(d.id_disciplina),
          nome: d.nome,
          precoMoedas: d.preco_moedas_por_ponto,
          pontosDisponiveis: d.pontos_por_compra_max,
          cor: PALETA_CORES[index % PALETA_CORES.length],
          totalAlunos: d.total_alunos,
          moedasCirculacao: d.moedas_circulacao,
        }))
      );

      setHistorico(
        (hist ?? []).map((h: any) => ({
          id: String(h.id),
          disciplina: h.disciplina,
          alteracao: h.alteracao,
          usuario: h.usuario,
          data: h.data,
        }))
      );
    } catch (err) {
      console.error("Erro ao carregar configuração de moedas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  const handleUpdateConfig = async (
    disciplinaId: string,
    precoMoedas: number,
    pontosDisponiveis: number
  ) => {
    try {
      await api.put("/professor/moedas/config-preco", {
        id_disciplina: disciplinaId,
        preco_moedas_por_ponto: precoMoedas,
        pontos_por_compra_max: pontosDisponiveis,
      });

      await carregar();
    } catch (err) {
      console.error("Erro ao salvar configuração:", err);
    }
  };

  return (
    <ProfessorLayout>
      <ConfigMoedasProfessor
        disciplinas={loading ? [] : disciplinas}
        onUpdateConfig={handleUpdateConfig}
        historico={historico}
      />
    </ProfessorLayout>
  );
}
