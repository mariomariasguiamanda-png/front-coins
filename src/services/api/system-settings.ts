// Minimal in-memory system settings service used by admin configuration pages.
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

let state: SystemSettings = {
  branding: {
    logoUrl: "/logo.svg",
    primaryColor: "#7C3AED",
    secondaryColor: "#06B6D4",
    fontFamily: "Inter",
  },
  periods: [
    {
      id: "p_2025_1",
      nome: "1º Semestre 2025",
      tipo: "semestre",
      dataInicio: new Date().toISOString().slice(0,10),
      dataFim: new Date().toISOString().slice(0,10),
      eventos: [],
    },
  ],
  integrations: [
    {
      id: "int_google",
      nome: "Google Classroom",
      tipo: "google_classroom",
      status: "inativo",
      ultimaSincronizacao: undefined,
      configuracao: {
        clientId: "",
        clientSecret: "",
      },
    },
    {
      id: "int_moodle",
      nome: "Moodle LMS",
      tipo: "moodle",
      status: "inativo",
      ultimaSincronizacao: undefined,
      configuracao: {
        url: "",
        token: "",
      },
    },
    {
      id: "int_api",
      nome: "API Personalizada",
      tipo: "api",
      status: "inativo",
      ultimaSincronizacao: undefined,
      configuracao: {
        baseUrl: "",
        apiKey: "",
      },
    },
  ],
  permissions: [
    {
      perfil: "Administrador",
      recursos: {
        usuarios: { visualizar: true, criar: true, editar: true, excluir: true },
        disciplinas: { visualizar: true, criar: true, editar: true, excluir: true },
        moedas: { visualizar: true, criar: true, editar: true, excluir: true },
        relatorios: { visualizar: true, criar: true, editar: false, excluir: false },
        compras: { visualizar: true, criar: false, editar: true, excluir: true },
        suporte: { visualizar: true, criar: true, editar: true, excluir: true },
        configuracoes: { visualizar: true, criar: true, editar: true, excluir: false },
        seguranca: { visualizar: true, criar: true, editar: true, excluir: true },
      },
    },
    {
      perfil: "Professor",
      recursos: {
        usuarios: { visualizar: true, criar: false, editar: false, excluir: false },
        disciplinas: { visualizar: true, criar: false, editar: false, excluir: false },
        moedas: { visualizar: true, criar: true, editar: false, excluir: false },
        relatorios: { visualizar: true, criar: false, editar: false, excluir: false },
        compras: { visualizar: false, criar: false, editar: false, excluir: false },
        suporte: { visualizar: true, criar: true, editar: false, excluir: false },
        configuracoes: { visualizar: false, criar: false, editar: false, excluir: false },
        seguranca: { visualizar: false, criar: false, editar: false, excluir: false },
      },
    },
    {
      perfil: "Aluno",
      recursos: {
        usuarios: { visualizar: false, criar: false, editar: false, excluir: false },
        disciplinas: { visualizar: true, criar: false, editar: false, excluir: false },
        moedas: { visualizar: true, criar: false, editar: false, excluir: false },
        relatorios: { visualizar: false, criar: false, editar: false, excluir: false },
        compras: { visualizar: true, criar: true, editar: false, excluir: false },
        suporte: { visualizar: true, criar: true, editar: false, excluir: false },
        configuracoes: { visualizar: false, criar: false, editar: false, excluir: false },
        seguranca: { visualizar: false, criar: false, editar: false, excluir: false },
      },
    },
  ],
};

export async function getSystemSettings(): Promise<SystemSettings> {
  return JSON.parse(JSON.stringify(state));
}

export async function updateSystemSettings(next: SystemSettings): Promise<SystemSettings> {
  state = JSON.parse(JSON.stringify(next));
  return getSystemSettings();
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
