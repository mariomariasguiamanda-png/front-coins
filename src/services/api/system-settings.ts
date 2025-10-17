// In-memory System Settings service for branding, academic calendar, integrations, and permissions

export type BrandingSettings = {
  logoUrl: string;
  primaryColor: string; // hex
  secondaryColor: string; // hex
  fontFamily: string; // e.g., 'Inter'
  customIcons?: Record<string, string>; // slug -> icon name
};

export type AcademicEventType = "prova" | "conselho" | "ferias" | "outro";
export type AcademicEvent = {
  id: string;
  titulo: string;
  tipo: AcademicEventType;
  dataInicio: string; // ISO date
  dataFim: string; // ISO date
  descricao?: string;
  notificar?: boolean;
};

export type AcademicPeriodType = "semestre" | "trimestre" | "bimestre";
export type AcademicPeriod = {
  id: string;
  nome: string;
  tipo: AcademicPeriodType;
  dataInicio: string; // ISO date
  dataFim: string; // ISO date
  eventos: AcademicEvent[];
};

export type IntegrationType = "google_classroom" | "moodle" | "api";
export type IntegrationConfig = {
  id: string;
  nome: string;
  tipo: IntegrationType;
  status: "ativo" | "inativo";
  ultimaSincronizacao?: string; // ISO
  configuracao: Record<string, string>;
};

export type PermissionMatrix = {
  perfil: "Administrador" | "Professor" | "Aluno" | "Coordenador";
  recursos: Record<
    string,
    {
      criar: boolean;
      editar: boolean;
      visualizar: boolean;
      excluir: boolean;
    }
  >;
};

export type SystemSettings = {
  branding: BrandingSettings;
  periods: AcademicPeriod[];
  integrations: IntegrationConfig[];
  permissions: PermissionMatrix[];
};
 
let settings: SystemSettings = {
  branding: {
    logoUrl: "/logo-coins.png",
    primaryColor: "#7C3AED",
    secondaryColor: "#F3F4F6",
    fontFamily: "Inter",
    customIcons: { matematica: "calculator", portugues: "book" },
  },
  periods: [
    {
      id: "p1",
      nome: "1º Semestre 2025",
      tipo: "semestre",
      dataInicio: "2025-02-01",
      dataFim: "2025-07-15",
      eventos: [
        {
          id: "e1",
          titulo: "Provas Finais",
          tipo: "prova",
          dataInicio: "2025-07-01",
          dataFim: "2025-07-05",
          descricao: "Período de avaliações finais do semestre",
          notificar: true,
        },
      ],
    },
  ],
  integrations: [
    { id: "gclass", nome: "Google Classroom", tipo: "google_classroom", status: "inativo", configuracao: { clientId: "", clientSecret: "" } },
    { id: "moodle", nome: "Moodle", tipo: "moodle", status: "inativo", configuracao: { url: "", token: "" } },
    { id: "customApi", nome: "API Institucional", tipo: "api", status: "inativo", configuracao: { baseUrl: "", apiKey: "" } },
  ],
  permissions: [
    {
      perfil: "Administrador",
      recursos: {
        atividades: { criar: true, editar: true, visualizar: true, excluir: true },
        moedas: { criar: true, editar: true, visualizar: true, excluir: true },
        disciplinas: { criar: true, editar: true, visualizar: true, excluir: true },
        relatorios: { criar: false, editar: false, visualizar: true, excluir: false },
      },
    },
    {
      perfil: "Professor",
      recursos: {
        atividades: { criar: true, editar: true, visualizar: true, excluir: false },
        moedas: { criar: true, editar: false, visualizar: true, excluir: false },
        disciplinas: { criar: false, editar: true, visualizar: true, excluir: false },
        relatorios: { criar: false, editar: false, visualizar: true, excluir: false },
      },
    },
    {
      perfil: "Aluno",
      recursos: {
        atividades: { criar: false, editar: false, visualizar: true, excluir: false },
        moedas: { criar: false, editar: false, visualizar: true, excluir: false },
        disciplinas: { criar: false, editar: false, visualizar: true, excluir: false },
        relatorios: { criar: false, editar: false, visualizar: true, excluir: false },
      },
    },
  ],
};

export async function getSystemSettings(): Promise<SystemSettings> {
  await new Promise((r) => setTimeout(r, 150));
  return JSON.parse(JSON.stringify(settings));
}

export async function updateSystemSettings(next: SystemSettings): Promise<SystemSettings> {
  await new Promise((r) => setTimeout(r, 200));
  settings = JSON.parse(JSON.stringify(next));
  return getSystemSettings();
}

export function diffSystemSettings(a: SystemSettings, b: SystemSettings): string[] {
  const msgs: string[] = [];
  if (a.branding.logoUrl !== b.branding.logoUrl) msgs.push("logo atualizada");
  if (a.branding.primaryColor !== b.branding.primaryColor) msgs.push(`cor primária: ${a.branding.primaryColor} -> ${b.branding.primaryColor}`);
  if (a.branding.secondaryColor !== b.branding.secondaryColor) msgs.push(`cor secundária: ${a.branding.secondaryColor} -> ${b.branding.secondaryColor}`);
  if (a.branding.fontFamily !== b.branding.fontFamily) msgs.push(`fonte: ${a.branding.fontFamily} -> ${b.branding.fontFamily}`);

  if (JSON.stringify(a.periods) !== JSON.stringify(b.periods)) msgs.push("calendário letivo alterado");
  if (JSON.stringify(a.integrations) !== JSON.stringify(b.integrations)) msgs.push("integrações atualizadas");
  if (JSON.stringify(a.permissions) !== JSON.stringify(b.permissions)) msgs.push("permissões atualizadas");
  return msgs;
}
