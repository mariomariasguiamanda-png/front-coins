import { useState, useEffect } from 'react';
import { useAuth } from '@/services/auth/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { alunoService, AtividadeData } from '@/services/alunoService';

export function useAlunoAtividades() {
  const { user } = useAuth();
  const [atividades, setAtividades] = useState<AtividadeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;

      try {
        setLoading(true);
        
        // 1. Buscar o ID do aluno baseado no user.id (UUID)
        const { data: aluno, error: alunoError } = await supabase
          .from('alunos')
          .select('id_aluno')
          .eq('user_id', user.id)
          .single();

        if (alunoError) throw alunoError;
        if (!aluno) throw new Error('Aluno não encontrado');

        // 2. Buscar atividades usando o serviço
        const data = await alunoService.getAtividades(aluno.id_aluno);
        setAtividades(data);
      } catch (err: any) {
        console.error('Erro ao carregar atividades:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

  return { atividades, loading, error };
}
