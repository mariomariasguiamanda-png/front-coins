import { supabase } from "@/lib/supabaseClient";

export type SupabaseAtividade = {
  id: string;
  titulo: string;
  descricao?: string;
  recompensa_moedas?: number;
  data_entrega: string; // ISO date
  id_disciplina?: string;
  status?: string;
  tipo?: "revision" | "study" | "exam";
};

export const getEvents = async (): Promise<SupabaseAtividade[] | null> => {
  try {
    const { data, error } = await supabase
      .from("atividades")
      .select("*")
      .eq("status", "pendente");

    if (error) throw error;
    return data as SupabaseAtividade[];
  } catch (error) {
    console.error("Erro ao buscar eventos:", error);
    return null;
  }
};

export const addEvent = async (newEvent: {
  id_aluno: string;
  id_disciplina: string;
  date: string; // ISO YYYY-MM-DD
  description?: string;
}) => {
  try {
    const { data, error } = await supabase.from("revisoes_programadas").insert([
      {
        id_aluno: newEvent.id_aluno,
        id_disciplina: newEvent.id_disciplina,
        data_revisao: newEvent.date,
        descricao: newEvent.description,
        status: "pendente",
      },
    ]);

    if (error) {
      console.error("Erro ao adicionar revisão programada:", error);
      return { error };
    }
    return { data };
  } catch (error) {
    console.error("Erro ao adicionar revisão programada:", error);
    return { error } as { error: unknown };
  }
};

export type RevisaoProgramada = {
  id_revisao_programada: string;
  id_aluno: string;
  id_disciplina: string;
  data_revisao: string; // ISO date
  descricao?: string;
  status?: string;
};

export const getRevisoesProgramadas = async (
  idAluno: string
): Promise<RevisaoProgramada[] | null> => {
  try {
    const { data, error } = await supabase
      .from("revisoes_programadas")
      .select(
        "id_revisao_programada, id_aluno, id_disciplina, data_revisao, descricao, status"
      )
      .eq("id_aluno", idAluno);

    if (error) throw error;
    return data as RevisaoProgramada[];
  } catch (error) {
    console.error("Erro ao carregar revisões programadas:", error);
    return null;
  }
};
