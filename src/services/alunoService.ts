import { supabase } from "@/lib/supabaseClient";

export type AtividadeData = {
  id: string;
  titulo: string;
  disciplina: string;
  disciplinaId: string;
  prazo: string;
  moedas: number;
  status: "pendente" | "enviado" | "corrigido";
  tipo?: "discursiva" | "multipla_escolha";
  descricao?: string;
};

export const alunoService = {
  async getAtividades(alunoId: number): Promise<AtividadeData[]> {
    try {
      const { data, error } = await supabase
        .from("alunos_atividades")
        .select(`
          id_atividade,
          status,
          data_conclusao,
          atividades (
            id_atividade,
            titulo,
            descricao,
            recompensa_moedas,
            nivel_dificuldade,
            tempo_estimado,
            id_disciplina,
            disciplinas (
              id_disciplina,
              nome,
              codigo
            )
          )
        `)
        .eq("id_aluno", alunoId);

      if (error) {
        console.error("Erro ao buscar atividades:", error);
        throw error;
      }

      if (!data) return [];

      return data.map((item: any) => {
        const atv = item.atividades;
        const disc = atv?.disciplinas;
        
        // Mapeamento do status do banco para o status do front
        let status: "pendente" | "enviado" | "corrigido" = "pendente";
        if (item.status === "concluida") status = "corrigido";
        else if (item.status === "entregue") status = "enviado";
        else status = "pendente";

        // Simulando prazo (já que não temos no banco ainda)
        const prazo = new Date();
        prazo.setDate(prazo.getDate() + 7); // +7 dias

        return {
          id: item.id_atividade?.toString() || "",
          titulo: atv?.titulo || "Sem título",
          disciplina: disc?.nome || "Geral",
          disciplinaId: disc?.codigo || disc?.id_disciplina?.toString() || "geral",
          prazo: prazo.toISOString(), // Mockado por enquanto
          moedas: atv?.recompensa_moedas || 0,
          status: status,
          tipo: "discursiva", // Mockado
          descricao: atv?.descricao
        };
      });
    } catch (error) {
      console.error("Erro no serviço de atividades:", error);
      return [];
    }
  },

  async getResumos(alunoId: number) {
    // TODO: Implementar quando tiver tabela de resumos
    return [];
  },

  async getVideoaulas(alunoId: number) {
    // TODO: Implementar quando tiver tabela de videoaulas
    return [];
  }
};
