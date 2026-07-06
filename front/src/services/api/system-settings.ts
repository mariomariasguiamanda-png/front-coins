import { api } from "@/lib/api";

export type AcademicEvent = {
  id: string;
  titulo: string;
  tipo: "prova" | "conselho" | "ferias" | "outro";
  dataInicio: string; // YYYY-MM-DD
  dataFim: string; // YYYY-MM-DD
  descricao?: string;
  notificar?: boolean;
};

export type AcademicPeriod = {
  id: string;
  nome: string;
  tipo: "semestre" | "trimestre" | "bimestre";
  dataInicio: string;
  dataFim: string;
  eventos: AcademicEvent[];
};

export type SystemSettings = {
  branding: {
    logoUrl: string;
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
  };
  periods: AcademicPeriod[];
  integrations?: Array<{
    id: string;
    nome: string;
    tipo: string;
    status: string;
    ultimaSincronizacao?: string;
    configuracao: Record<string, string | undefined>;
  }>;
  permissions?: Array<{
    perfil: string;
    modulos?: Record<string, boolean>;
    recursos?: Record<string, { visualizar: boolean; criar: boolean; editar: boolean; excluir: boolean }>;
  }>;
};

// Documento persistido no banco (tabela system_settings) via API do admin.
export async function getSystemSettings(): Promise<SystemSettings> {
  return api.get("/admin/configuracoes");
}

export async function updateSystemSettings(next: SystemSettings): Promise<SystemSettings> {
  return api.put("/admin/configuracoes", next);
}

// Notifica todos os alunos ativos (usado pelo calendário acadêmico ao
// publicar um evento com "notificar" ligado).
export async function broadcastParaAlunos(titulo: string, mensagem: string) {
  return api.post("/admin/configuracoes/broadcast", { titulo, mensagem });
}

export function diffSystemSettings(a: SystemSettings, b: SystemSettings): string[] {
  const diffs: string[] = [];
  if (a.branding.logoUrl !== b.branding.logoUrl) diffs.push("logo");
  if (a.branding.primaryColor !== b.branding.primaryColor) diffs.push("cor primária");
  if (a.branding.secondaryColor !== b.branding.secondaryColor) diffs.push("cor secundária");
  if (a.branding.fontFamily !== b.branding.fontFamily) diffs.push("fonte");
  if (JSON.stringify(a.periods) !== JSON.stringify(b.periods)) diffs.push("períodos/eventos");
  if (JSON.stringify(a.integrations) !== JSON.stringify(b.integrations)) diffs.push("integrações");
  if (JSON.stringify(a.permissions) !== JSON.stringify(b.permissions)) diffs.push("permissões");
  return diffs;
}
