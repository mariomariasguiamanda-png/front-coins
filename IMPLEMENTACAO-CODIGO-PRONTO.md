# IMPLEMENTAÇÃO PRÁTICA: Trechos de Código Prontos para Migração

**Objetivo:** Fornecer código pronto para copiar/colar para substituir mocks

---

## 📋 ÍNDICE RÁPIDO

1. [Serviços Base](#serviços-base)
2. [Hooks Custom](#hooks-custom)
3. [Componentes Refatorados](#componentes-refatorados)
4. [Queries Supabase](#queries-supabase)
5. [Tratamento de Erros](#tratamento-de-erros)

---

## Serviços Base

### 1. notificacaoService.ts

```typescript
// src/services/notificacaoService.ts

import { supabase } from "@/lib/supabaseClient";

export interface Notificacao {
  id: string;
  id_usuario: string;
  titulo: string;
  mensagem: string;
  tipo:
    | "atividade"
    | "nota"
    | "revisao"
    | "sistema"
    | "moedas"
    | "alerta"
    | "backup";
  data_hora: string;
  lida: boolean;
  disciplina?: string;
  icone?: string;
  cor?: string;
}

export async function getNotificacoes(
  usuarioId: string,
  limit: number = 20,
  onlyUnread: boolean = false
): Promise<Notificacao[]> {
  try {
    let query = supabase
      .from("notificacoes")
      .select("*")
      .eq("id_usuario", usuarioId)
      .order("data_hora", { ascending: false });

    if (onlyUnread) {
      query = query.eq("lida", false);
    }

    query = query.limit(limit);

    const { data, error } = await query;

    if (error) {
      console.error("Erro ao buscar notificações:", error);
      throw error;
    }

    return data || [];
  } catch (e: any) {
    console.error("Falha ao carregar notificações:", e.message);
    return [];
  }
}

export async function marcarComoLida(notificacaoId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("notificacoes")
      .update({ lida: true })
      .eq("id", notificacaoId);

    if (error) throw error;
    return true;
  } catch (e: any) {
    console.error("Erro ao marcar notificação como lida:", e);
    return false;
  }
}

export async function marcarTudasComoLidas(
  usuarioId: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("notificacoes")
      .update({ lida: true })
      .eq("id_usuario", usuarioId)
      .eq("lida", false);

    if (error) throw error;
    return true;
  } catch (e: any) {
    console.error("Erro ao marcar todas como lidas:", e);
    return false;
  }
}

export async function criarNotificacao(
  notificacao: Omit<Notificacao, "id">
): Promise<Notificacao | null> {
  try {
    const { data, error } = await supabase
      .from("notificacoes")
      .insert([notificacao])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (e: any) {
    console.error("Erro ao criar notificação:", e);
    return null;
  }
}
```

---

### 2. atividadeService.ts (Estender existente)

```typescript
// src/services/atividadeService.ts - ADICIONAR ao arquivo existente

import { supabase } from "@/lib/supabaseClient";

export interface AtividadeCompleta {
  id_atividade: number;
  titulo: string;
  descricao: string;
  recompensa_moedas: number;
  nivel_dificuldade: string;
  tempo_estimado: number;
  id_disciplina: number;
  prazo: string;
  disciplina: string;
  status: "pendente" | "enviado" | "corrigido";
  data_conclusao?: string;
}

export async function getAtividadesPorDisciplina(
  alunoId: number,
  disciplinaId: number
): Promise<AtividadeCompleta[]> {
  try {
    const { data, error } = await supabase
      .from("alunos_atividades")
      .select(
        `
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
          prazo,
          disciplinas (
            id_disciplina,
            nome
          )
        )
      `
      )
      .eq("id_aluno", alunoId)
      .eq("atividades.id_disciplina", disciplinaId);

    if (error) throw error;

    return (data || []).map((item: any) => {
      const atv = item.atividades;
      const disc = atv?.disciplinas;
      return {
        id_atividade: atv?.id_atividade,
        titulo: atv?.titulo,
        descricao: atv?.descricao,
        recompensa_moedas: atv?.recompensa_moedas,
        nivel_dificuldade: atv?.nivel_dificuldade,
        tempo_estimado: atv?.tempo_estimado,
        id_disciplina: atv?.id_disciplina,
        prazo: atv?.prazo,
        disciplina: disc?.nome || "Disciplina",
        status: item.status,
        data_conclusao: item.data_conclusao,
      };
    });
  } catch (e: any) {
    console.error("Erro ao buscar atividades por disciplina:", e);
    throw e;
  }
}

export async function marcarAtividadeConcluida(
  alunoId: number,
  atividadeId: number
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("alunos_atividades")
      .update({ status: "corrigido", data_conclusao: new Date().toISOString() })
      .eq("id_aluno", alunoId)
      .eq("id_atividade", atividadeId);

    if (error) throw error;
    return true;
  } catch (e: any) {
    console.error("Erro ao marcar atividade como concluída:", e);
    return false;
  }
}

export async function getAtividadesProximas(alunoId: number, dias: number = 7) {
  try {
    const hoje = new Date();
    const dataLimite = new Date(hoje.getTime() + dias * 24 * 60 * 60 * 1000);

    const { data, error } = await supabase
      .from("alunos_atividades")
      .select(
        `
        id_atividade,
        status,
        atividades (
          id_atividade,
          titulo,
          prazo,
          recompensa_moedas,
          disciplinas (nome)
        )
      `
      )
      .eq("id_aluno", alunoId)
      .eq("status", "pendente")
      .gte("atividades.prazo", hoje.toISOString())
      .lte("atividades.prazo", dataLimite.toISOString())
      .order("atividades.prazo", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (e: any) {
    console.error("Erro ao buscar atividades próximas:", e);
    return [];
  }
}
```

---

### 3. graficoService.ts (Novo)

```typescript
// src/services/graficoService.ts

import { supabase } from "@/lib/supabaseClient";

export interface RankingItem {
  posicao: number;
  nome: string;
  id_aluno: number;
  moedas: number;
  eh_usuario_logado?: boolean;
}

export interface MoedaPorMes {
  mes: string;
  valor: number;
}

export async function getRankingTurma(
  turmaId: number,
  limit: number = 20
): Promise<RankingItem[]> {
  try {
    // Opção 1: Se existir VIEW vw_ranking_turma
    const { data, error } = await supabase
      .from("vw_ranking_turma")
      .select("*")
      .eq("id_turma", turmaId)
      .limit(limit);

    if (error) throw error;
    return data || [];

    // Opção 2: Se não existir VIEW, fazer query manual
    /*
    const { data, error } = await supabase
      .rpc('calcular_ranking_turma', { p_turma_id: turmaId, p_limit: limit });

    if (error) throw error;
    return data || [];
    */
  } catch (e: any) {
    console.error("Erro ao buscar ranking da turma:", e);
    return [];
  }
}

export async function getMoedasPorMes(
  alunoId: number,
  ano: number = new Date().getFullYear()
): Promise<MoedaPorMes[]> {
  try {
    // Opção 1: Se existir VIEW
    const { data, error } = await supabase
      .from("vw_moedas_por_mes_aluno")
      .select("*")
      .eq("id_aluno", alunoId)
      .order("mes", { ascending: true });

    if (error) throw error;

    // Garantir 12 meses
    const meses = [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ];
    const resultado = meses.map((mes, idx) => {
      const encontrado = data?.find((d: any) => {
        const mesData = new Date(d.mes);
        return mesData.getMonth() === idx;
      });
      return {
        mes,
        valor: encontrado?.valor || 0,
      };
    });

    return resultado;

    // Opção 2: Query manual sem VIEW
    /*
    const inicioAno = new Date(ano, 0, 1).toISOString();
    const fimAno = new Date(ano, 11, 31).toISOString();

    const { data, error } = await supabase
      .from('moedas_conquistadas')
      .select('data_conquista, moedas_conquistadas')
      .eq('id_aluno', alunoId)
      .gte('data_conquista', inicioAno)
      .lte('data_conquista', fimAno);

    if (error) throw error;

    // Agrupar por mês
    const resultado: MoedaPorMes[] = Array(12).fill(null).map((_, idx) => ({
      mes: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'][idx],
      valor: (data || [])
        .filter((d: any) => new Date(d.data_conquista).getMonth() === idx)
        .reduce((acc: number, d: any) => acc + (d.moedas_conquistadas || 0), 0),
    }));

    return resultado;
    */
  } catch (e: any) {
    console.error("Erro ao buscar moedas por mês:", e);
    return Array(12)
      .fill(null)
      .map((_, idx) => ({
        mes: [
          "Jan",
          "Fev",
          "Mar",
          "Abr",
          "Mai",
          "Jun",
          "Jul",
          "Ago",
          "Set",
          "Out",
          "Nov",
          "Dez",
        ][idx],
        valor: 0,
      }));
  }
}

export async function getMediaGeralPorDisciplina(alunoId: number) {
  try {
    const { data, error } = await supabase
      .from("alunos_avaliacoes")
      .select("disciplinas(nome), nota")
      .eq("id_aluno", alunoId);

    if (error) throw error;

    // Agrupar e calcular média
    const resultado: Record<string, number> = {};
    (data || []).forEach((item: any) => {
      const disciplina = item.disciplinas?.nome || "N/A";
      if (!resultado[disciplina]) resultado[disciplina] = [];
      resultado[disciplina].push(item.nota);
    });

    const medias: Record<string, number> = {};
    Object.entries(resultado).forEach(([disc, notas]: any) => {
      medias[disc] =
        notas.reduce((a: number, b: number) => a + b, 0) / notas.length;
    });

    return medias;
  } catch (e: any) {
    console.error("Erro ao buscar média por disciplina:", e);
    return {};
  }
}
```

---

### 4. usuarioService.ts (Novo)

```typescript
// src/services/usuarioService.ts

import { supabase } from "@/lib/supabaseClient";

export interface UsuarioInfo {
  id_usuario: string;
  nome: string;
  email: string;
  tipo: "aluno" | "professor" | "administrador";
  status: "ativo" | "inativo" | "pendente";
  data_criacao: string;
  ultimo_acesso?: string;
  avatar_url?: string;
}

export interface UsuarioListagem extends UsuarioInfo {
  // Dados adicionais conforme o tipo
  turma?: string;
  moedas?: number;
  disciplinas?: string[];
}

export async function getUsuarioLogado(): Promise<UsuarioInfo | null> {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("Erro ao obter usuário autenticado:", authError);
      return null;
    }

    const { data: usuario, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("email", user.email)
      .single();

    if (error) {
      console.error("Erro ao buscar usuário na tabela:", error);
      return null;
    }

    return usuario as UsuarioInfo;
  } catch (e: any) {
    console.error("Falha ao obter usuário:", e);
    return null;
  }
}

export async function getUsuarios(filtros?: {
  tipo?: string;
  status?: string;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<UsuarioListagem[]> {
  try {
    let query = supabase.from("usuarios").select(`
      id_usuario,
      nome,
      email,
      tipo,
      status,
      data_criacao,
      ultimo_acesso,
      avatar_url,
      alunos(id_turma),
      professores(disciplinas)
    `);

    if (filtros?.tipo && filtros.tipo !== "todos") {
      query = query.eq("tipo", filtros.tipo);
    }

    if (filtros?.status && filtros.status !== "todos") {
      query = query.eq("status", filtros.status);
    }

    if (filtros?.search) {
      query = query.or(
        `nome.ilike.%${filtros.search}%,email.ilike.%${filtros.search}%`
      );
    }

    if (filtros?.limit) {
      query = query.limit(filtros.limit);
    }

    if (filtros?.offset) {
      query = query.range(
        filtros.offset,
        filtros.offset + (filtros.limit || 10) - 1
      );
    }

    const { data, error } = await query;

    if (error) throw error;

    return (data || []).map((u: any) => ({
      id_usuario: u.id_usuario,
      nome: u.nome,
      email: u.email,
      tipo: u.tipo,
      status: u.status,
      data_criacao: u.data_criacao,
      ultimo_acesso: u.ultimo_acesso,
      avatar_url: u.avatar_url,
      turma: u.alunos?.[0]?.id_turma,
      moedas: u.alunos?.[0]?.moedas,
      disciplinas: u.professores?.[0]?.disciplinas,
    }));
  } catch (e: any) {
    console.error("Erro ao listar usuários:", e);
    return [];
  }
}

export async function criarUsuario(
  usuarioData: Omit<UsuarioInfo, "id_usuario" | "data_criacao">
) {
  try {
    const { data, error } = await supabase
      .from("usuarios")
      .insert([usuarioData])
      .select()
      .single();

    if (error) throw error;
    return data as UsuarioInfo;
  } catch (e: any) {
    console.error("Erro ao criar usuário:", e);
    return null;
  }
}

export async function atualizarUsuario(
  usuarioId: string,
  atualizacoes: Partial<UsuarioInfo>
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("usuarios")
      .update(atualizacoes)
      .eq("id_usuario", usuarioId);

    if (error) throw error;
    return true;
  } catch (e: any) {
    console.error("Erro ao atualizar usuário:", e);
    return false;
  }
}

export async function deletarUsuario(usuarioId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("usuarios")
      .delete()
      .eq("id_usuario", usuarioId);

    if (error) throw error;
    return true;
  } catch (e: any) {
    console.error("Erro ao deletar usuário:", e);
    return false;
  }
}
```

---

### 5. compraService.ts (Novo)

```typescript
// src/services/compraService.ts

import { supabase } from "@/lib/supabaseClient";

export interface Transacao {
  id: string;
  id_aluno: number;
  nome_aluno: string;
  turma_aluno: string;
  id_disciplina: number;
  nome_disciplina: string;
  nome_professor: string;
  pontos_comprados: number;
  moedas_gastas: number;
  saldo_antes: number;
  saldo_depois: number;
  data: string;
  status: "concluida" | "cancelada";
  motivo_cancelamento?: string;
}

export async function getTransacoes(filtros?: {
  status?: string;
  disciplina?: string;
  aluno?: string;
  dataInicio?: string;
  dataFim?: string;
  limit?: number;
  offset?: number;
}): Promise<Transacao[]> {
  try {
    let query = supabase.from("compras").select(`
      id,
      id_aluno,
      alunos(usuarios(nome), id_turma),
      id_disciplina,
      disciplinas(nome),
      id_professor,
      professores(usuarios(nome)),
      pontos_comprados,
      moedas_gastas,
      saldo_antes,
      saldo_depois,
      data,
      status,
      motivo_cancelamento
    `);

    if (filtros?.status) {
      query = query.eq("status", filtros.status);
    }

    if (filtros?.disciplina) {
      query = query.eq("disciplinas.nome", filtros.disciplina);
    }

    if (filtros?.aluno) {
      query = query.ilike("alunos.usuarios.nome", `%${filtros.aluno}%`);
    }

    if (filtros?.dataInicio && filtros?.dataFim) {
      query = query
        .gte("data", filtros.dataInicio)
        .lte("data", filtros.dataFim);
    }

    query = query.order("data", { ascending: false });

    if (filtros?.limit) {
      query = query.limit(filtros.limit);
    }

    if (filtros?.offset) {
      query = query.range(
        filtros.offset,
        filtros.offset + (filtros.limit || 10) - 1
      );
    }

    const { data, error } = await query;

    if (error) throw error;

    return (data || []).map((t: any) => ({
      id: t.id,
      id_aluno: t.id_aluno,
      nome_aluno: t.alunos?.usuarios?.nome,
      turma_aluno: t.alunos?.id_turma,
      id_disciplina: t.id_disciplina,
      nome_disciplina: t.disciplinas?.nome,
      nome_professor: t.professores?.usuarios?.nome,
      pontos_comprados: t.pontos_comprados,
      moedas_gastas: t.moedas_gastas,
      saldo_antes: t.saldo_antes,
      saldo_depois: t.saldo_depois,
      data: t.data,
      status: t.status,
      motivo_cancelamento: t.motivo_cancelamento,
    }));
  } catch (e: any) {
    console.error("Erro ao buscar transações:", e);
    return [];
  }
}

export async function cancelarTransacao(
  transacaoId: string,
  motivo: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("compras")
      .update({ status: "cancelada", motivo_cancelamento: motivo })
      .eq("id", transacaoId);

    if (error) throw error;
    return true;
  } catch (e: any) {
    console.error("Erro ao cancelar transação:", e);
    return false;
  }
}

export async function getEstatisticasCompras() {
  try {
    const { data, error } = await supabase.rpc("calcular_estatisticas_compras");

    if (error) throw error;
    return data;
  } catch (e: any) {
    console.error("Erro ao buscar estatísticas:", e);
    return null;
  }
}
```

---

## Hooks Custom

### 1. useNotificacoes.ts

```typescript
// src/hooks/useNotificacoes.ts

import { useState, useEffect, useCallback } from "react";
import {
  Notificacao,
  getNotificacoes,
  marcarComoLida,
} from "@/services/notificacaoService";

export interface UseNotificacoesReturn {
  notificacoes: Notificacao[];
  naoLidas: number;
  loading: boolean;
  erro: string | null;
  recarregar: () => Promise<void>;
  marcarComoLida: (id: string) => Promise<void>;
  marcarTudasComoLidas: () => Promise<void>;
}

export function useNotificacoes(
  usuarioId: string | null
): UseNotificacoesReturn {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregarNotificacoes = useCallback(async () => {
    if (!usuarioId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setErro(null);

      const data = await getNotificacoes(usuarioId, 50);
      setNotificacoes(data);
    } catch (e: any) {
      console.error("Erro ao carregar notificações:", e);
      setErro("Falha ao carregar notificações");
      setNotificacoes([]);
    } finally {
      setLoading(false);
    }
  }, [usuarioId]);

  useEffect(() => {
    carregarNotificacoes();

    // Polling a cada 30 segundos
    const interval = setInterval(carregarNotificacoes, 30000);
    return () => clearInterval(interval);
  }, [carregarNotificacoes]);

  const marcarLida = async (id: string) => {
    try {
      await marcarComoLida(id);
      setNotificacoes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, lida: true } : n))
      );
    } catch (e) {
      console.error("Erro ao marcar como lida:", e);
    }
  };

  const marcarTudasLidas = async () => {
    try {
      // API para marcar todas
      setNotificacoes((prev) => prev.map((n) => ({ ...n, lida: true })));
      await carregarNotificacoes();
    } catch (e) {
      console.error("Erro ao marcar todas como lidas:", e);
    }
  };

  const naoLidas = notificacoes.filter((n) => !n.lida).length;

  return {
    notificacoes,
    naoLidas,
    loading,
    erro,
    recarregar: carregarNotificacoes,
    marcarComoLida: marcarLida,
    marcarTudasComoLidas: marcarTudasLidas,
  };
}
```

---

### 2. useAtividades.ts

```typescript
// src/hooks/useAtividades.ts

import { useState, useEffect, useCallback } from "react";
import { AtividadeCompleta, getAtividades } from "@/services/alunoService";
import { alunoService } from "@/services/alunoService";

export interface UseAtividadesReturn {
  atividades: AtividadeCompleta[];
  loading: boolean;
  erro: string | null;
  recarregar: () => Promise<void>;
  filtrarPorDisciplina: (disciplinaId: number) => AtividadeCompleta[];
  filtrarPendentes: () => AtividadeCompleta[];
  filtrarConcluidas: () => AtividadeCompleta[];
}

export function useAtividades(alunoId: number): UseAtividadesReturn {
  const [atividades, setAtividades] = useState<AtividadeCompleta[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregarAtividades = useCallback(async () => {
    try {
      setLoading(true);
      setErro(null);

      const data = await alunoService.getAtividades(alunoId);
      setAtividades(data);
    } catch (e: any) {
      console.error("Erro ao carregar atividades:", e);
      setErro("Falha ao carregar atividades");
      setAtividades([]);
    } finally {
      setLoading(false);
    }
  }, [alunoId]);

  useEffect(() => {
    carregarAtividades();
  }, [carregarAtividades]);

  const filtrarPorDisciplina = (disciplinaId: number) => {
    return atividades.filter((a) => a.id_disciplina === disciplinaId);
  };

  const filtrarPendentes = () => {
    return atividades.filter((a) => a.status === "pendente");
  };

  const filtrarConcluidas = () => {
    return atividades.filter((a) => a.status === "corrigido");
  };

  return {
    atividades,
    loading,
    erro,
    recarregar: carregarAtividades,
    filtrarPorDisciplina,
    filtrarPendentes,
    filtrarConcluidas,
  };
}
```

---

## Componentes Refatorados

### 1. AlunoHeader.tsx (Refatorado)

```typescript
// src/components/layout/AlunoHeader.tsx (SUBSTITUIÇÃO COMPLETA)

"use client";

import React, { useEffect, useState } from "react";
import { Bell, LogOut, Menu } from "lucide-react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";
import { getNotificacoes } from "@/services/notificacaoService";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";

interface Notificacao {
  id: string;
  titulo: string;
  mensagem: string;
  data_hora: string;
  lida: boolean;
}

export default function AlunoHeader() {
  const router = useRouter();
  const [usuarioId, setUsuarioId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notificacao[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [usuarioNome, setUsuarioNome] = useState("Aluno");

  // Carregar usuário logado
  useEffect(() => {
    async function carregarUsuario() {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) throw authError;

        const { data: usuario } = await supabase
          .from("usuarios")
          .select("id_usuario, nome")
          .eq("email", user.email)
          .single();

        if (usuario) {
          setUsuarioId(usuario.id_usuario);
          setUsuarioNome(usuario.nome);
        }
      } catch (e) {
        console.error("Erro ao carregar usuário:", e);
      }
    }

    carregarUsuario();
  }, []);

  // Carregar notificações
  useEffect(() => {
    if (!usuarioId) return;

    async function carregarNotificacoes() {
      try {
        setLoadingNotifications(true);
        const data = await getNotificacoes(usuarioId, 10);
        setNotifications(data);
      } catch (e) {
        console.error("Erro ao carregar notificações:", e);
        setNotifications([]);
      } finally {
        setLoadingNotifications(false);
      }
    }

    carregarNotificacoes();

    // Polling a cada 30 segundos
    const interval = setInterval(carregarNotificacoes, 30000);
    return () => clearInterval(interval);
  }, [usuarioId]);

  const naoLidas = notifications.filter((n) => !n.lida).length;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Menu className="h-6 w-6 text-gray-700" />
          <h1 className="text-xl font-bold text-gray-900">Coins</h1>
        </div>

        {/* Direita */}
        <div className="flex items-center gap-4">
          {/* Notificações */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell className="h-6 w-6" />
              {naoLidas > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {naoLidas > 9 ? "9+" : naoLidas}
                </span>
              )}
            </button>

            {/* Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Notificações</h3>
                </div>

                {loadingNotifications ? (
                  <div className="p-4">
                    <LoadingState message="Carregando..." />
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-4">
                    <EmptyState title="Sem notificações" />
                  </div>
                ) : (
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                          !notif.lida ? "bg-blue-50" : ""
                        }`}
                      >
                        <h4 className="font-medium text-gray-900 text-sm">
                          {notif.titulo}
                        </h4>
                        <p className="text-gray-600 text-xs mt-1">
                          {notif.mensagem}
                        </p>
                        <span className="text-gray-400 text-xs">
                          {new Date(notif.data_hora).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Perfil e Logout */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">{usuarioNome}</span>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Sair"
            >
              <LogOut className="h-5 w-5 text-red-500" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
```

---

### 2. GraficoMoedas.tsx (Refatorado)

```typescript
// src/modules/aluno/GraficoMoedas.tsx (SUBSTITUIÇÃO PARCIAL - Seção de Ranking)

"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Trophy, TrendingUp } from "lucide-react";
import { getRankingTurma, getMoedasPorMes } from "@/services/graficoService";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface RankingItem {
  posicao: number;
  nome: string;
  moedas: number;
}

interface MoedaPorMes {
  mes: string;
  valor: number;
}

export default function GraficoMoedas() {
  const [ranking, setRanking] = useState<RankingItem[]>([]);
  const [moedasMes, setMoedasMes] = useState<MoedaPorMes[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [turmaId, setTurmaId] = useState<number | null>(null);
  const [alunoId, setAlunoId] = useState<number | null>(null);

  // Obter turmaId e alunoId do usuário logado
  useEffect(() => {
    async function obterDadosUsuario() {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) throw authError;

        const { data: usuario } = await supabase
          .from("usuarios")
          .select("id_usuario")
          .eq("email", user.email)
          .single();

        const { data: aluno } = await supabase
          .from("alunos")
          .select("id_aluno, id_turma")
          .eq("id_usuario", usuario?.id_usuario)
          .single();

        if (aluno) {
          setTurmaId(aluno.id_turma);
          setAlunoId(aluno.id_aluno);
        }
      } catch (e) {
        console.error("Erro ao obter dados do usuário:", e);
      }
    }

    obterDadosUsuario();
  }, []);

  // Carregar ranking e moedas
  useEffect(() => {
    if (!turmaId || !alunoId) return;

    async function carregarDados() {
      try {
        setLoading(true);
        setErro(null);

        const [rankingData, moedasData] = await Promise.all([
          getRankingTurma(turmaId),
          getMoedasPorMes(alunoId),
        ]);

        setRanking(rankingData);
        setMoedasMes(moedasData);
      } catch (e: any) {
        console.error("Erro ao carregar dados:", e);
        setErro("Falha ao carregar gráficos");
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, [turmaId, alunoId]);

  if (loading) {
    return <LoadingState message="Carregando gráficos..." />;
  }

  if (erro) {
    return (
      <div className="text-center text-red-500 py-8">
        {erro}
        <button
          onClick={() => window.location.reload()}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Recarregar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Ranking */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <h3 className="text-lg font-semibold">Ranking da Turma</h3>
          </div>

          {ranking.length === 0 ? (
            <EmptyState title="Sem dados de ranking" />
          ) : (
            <div className="space-y-2">
              {ranking.slice(0, 10).map((item) => (
                <div key={item.posicao} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-500 w-8">
                      {item.posicao}º
                    </span>
                    <span className="font-medium">{item.nome}</span>
                  </div>
                  <span className="text-yellow-600 font-semibold">{item.moedas} moedas</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gráfico Moedas por Mês */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <h3 className="text-lg font-semibold">Moedas por Mês</h3>
          </div>

          {moedasMes.length === 0 || moedasMes.every((m) => m.valor === 0) ? (
            <EmptyState title="Sem dados de moedas" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={moedasMes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="valor" fill="#f59e0b" name="Moedas" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
```

---

### 3. Usuarios.tsx (Admin - Refatorado)

```typescript
// src/modules/administrador/Usuarios.tsx (SUBSTITUIÇÃO COMPLETA)

"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Users, Filter } from "lucide-react";
import { getUsuarios, UsuarioListagem } from "@/services/usuarioService";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<UsuarioListagem[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [search, setSearch] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(0);

  const itensPorPagina = 10;

  const carregarUsuarios = async () => {
    try {
      setLoading(true);
      setErro(null);

      const data = await getUsuarios({
        tipo: filtroTipo === "todos" ? undefined : filtroTipo,
        status: filtroStatus === "todos" ? undefined : filtroStatus,
        search: search || undefined,
        limit: itensPorPagina,
        offset: paginaAtual * itensPorPagina,
      });

      setUsuarios(data);
    } catch (e: any) {
      console.error("Erro ao carregar usuários:", e);
      setErro("Falha ao carregar usuários");
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPaginaAtual(0); // Reset página ao filtrar
  }, [filtroTipo, filtroStatus, search]);

  useEffect(() => {
    carregarUsuarios();
  }, [filtroTipo, filtroStatus, search, paginaAtual]);

  const tipos = ["todos", "aluno", "professor", "administrador"];
  const status = ["todos", "ativo", "inativo", "pendente"];

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "aluno":
        return "👤";
      case "professor":
        return "👨‍🏫";
      case "administrador":
        return "⚙️";
      default:
        return "❓";
    }
  };

  if (loading && usuarios.length === 0) {
    return <LoadingState message="Carregando usuários..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Gerenciar Usuários</h1>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar
              </label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Nome ou email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo
              </label>
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                {tipos.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                {status.map((st) => (
                  <option key={st} value={st}>
                    {st.charAt(0).toUpperCase() + st.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={carregarUsuarios}
                variant="outline"
                className="w-full"
              >
                <Filter className="h-4 w-4 mr-2" />
                Aplicar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      {erro ? (
        <div className="text-center text-red-500 py-8">
          {erro}
          <button
            onClick={carregarUsuarios}
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Recarregar
          </button>
        </div>
      ) : usuarios.length === 0 ? (
        <EmptyState title="Nenhum usuário encontrado" />
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4 font-semibold">Nome</th>
                    <th className="text-left py-2 px-4 font-semibold">Email</th>
                    <th className="text-left py-2 px-4 font-semibold">Tipo</th>
                    <th className="text-left py-2 px-4 font-semibold">Status</th>
                    <th className="text-left py-2 px-4 font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((usuario) => (
                    <tr key={usuario.id_usuario} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span>{getTipoIcon(usuario.tipo)}</span>
                          {usuario.nome}
                        </div>
                      </td>
                      <td className="py-3 px-4">{usuario.email}</td>
                      <td className="py-3 px-4">
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                          {usuario.tipo}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${
                            usuario.status === "ativo"
                              ? "bg-green-100 text-green-700"
                              : usuario.status === "inativo"
                              ? "bg-gray-100 text-gray-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {usuario.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginação */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <span className="text-sm text-gray-600">
                Página {paginaAtual + 1}
              </span>
              <div className="flex gap-2">
                <Button
                  onClick={() => setPaginaAtual(Math.max(0, paginaAtual - 1))}
                  disabled={paginaAtual === 0}
                  variant="outline"
                  size="sm"
                >
                  Anterior
                </Button>
                <Button
                  onClick={() => setPaginaAtual(paginaAtual + 1)}
                  disabled={usuarios.length < itensPorPagina}
                  variant="outline"
                  size="sm"
                >
                  Próxima
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
```

---

## Queries Supabase

### SQL para Criar Views Necessárias

```sql
-- View: Ranking da turma
CREATE OR REPLACE VIEW vw_ranking_turma AS
SELECT
  ROW_NUMBER() OVER (PARTITION BY a.id_turma ORDER BY COALESCE(sum(mc.moedas_conquistadas), 0) DESC) as posicao,
  a.id_turma,
  a.id_aluno,
  u.nome,
  COALESCE(sum(mc.moedas_conquistadas), 0) as moedas
FROM alunos a
JOIN usuarios u ON a.id_usuario = u.id_usuario
LEFT JOIN moedas_conquistadas mc ON a.id_aluno = mc.id_aluno
GROUP BY a.id_aluno, a.id_turma, u.nome, u.id_usuario
ORDER BY a.id_turma, moedas DESC;

-- View: Moedas por mês do aluno
CREATE OR REPLACE VIEW vw_moedas_por_mes_aluno AS
SELECT
  a.id_aluno,
  DATE_TRUNC('month', mc.data_conquista)::date as mes,
  COALESCE(sum(mc.moedas_conquistadas), 0) as valor
FROM alunos a
LEFT JOIN moedas_conquistadas mc ON a.id_aluno = mc.id_aluno
GROUP BY a.id_aluno, DATE_TRUNC('month', mc.data_conquista)
ORDER BY a.id_aluno, mes;

-- View: Disciplinas com moedas (já existe)
-- CREATE OR REPLACE VIEW vw_disciplinas_moedas_aluno AS ...
```

---

## Tratamento de Erros

### ErrorBoundary.tsx

```typescript
// src/components/ui/ErrorBoundary.tsx

import React, { ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error) => ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback?.(this.state.error!) || (
          <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900">Algo deu errado</h3>
                <p className="text-red-700 text-sm mt-1">
                  {this.state.error?.message || 'Erro desconhecido'}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Recarregar página
                </button>
              </div>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
```

---

### LoadingState.tsx

```typescript
// src/components/ui/LoadingState.tsx

import React from 'react';
import { Loader } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Carregando...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Loader className="h-8 w-8 text-blue-600 animate-spin" />
      <p className="mt-3 text-gray-600">{message}</p>
    </div>
  );
}
```

---

### EmptyState.tsx

```typescript
// src/components/ui/EmptyState.tsx

import React, { ReactNode } from 'react';
import { Database } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
}

export function EmptyState({
  title = 'Nenhum dado',
  description = 'Tente ajustar seus filtros ou criar novo item',
  icon = <Database className="h-12 w-12 text-gray-300" />,
}: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </div>
  );
}
```

---

## Checklist Final

- [ ] Todos os serviços criados
- [ ] Todos os hooks criados
- [ ] Componentes refatorados
- [ ] Views criadas no Supabase
- [ ] ErrorBoundary implementado
- [ ] LoadingState em uso
- [ ] EmptyState em uso
- [ ] Testes passando
- [ ] Nenhuma importação de mock\* no projeto
- [ ] Deploy realizado

---

**Versão:** 1.0  
**Última Atualização:** 9 de Dezembro de 2025
