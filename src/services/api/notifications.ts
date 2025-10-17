// In-memory notifications service for critical admin actions
// Replace with real API calls when backend is available.

export type NotificationActionType =
  | "discipline_archived"
  | "discipline_deleted"
  | "coins_adjusted"
  | "purchase_canceled"
  | "permissions_changed"
  | "user_role_changed"
  | "user_status_changed"
  | "teacher_unlinked"
  | "academic_event_created"
  | "integration_toggled";

export interface AdminNotification {
  id: string;
  message: string;
  actionType: NotificationActionType;
  createdAt: string; // ISO
  read: boolean;
  recipients: Array<"Administrador" | "Coordenador">; // target audiences
  context?: Record<string, any>;
}

let store: AdminNotification[] = [];

function id() {
  return Math.random().toString(36).slice(2);
}

export async function listNotifications(): Promise<AdminNotification[]> {
  // Newest first
  return [...store].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

export async function createNotification(n: Omit<AdminNotification, "id" | "createdAt" | "read"> & {
  createdAt?: string;
}): Promise<AdminNotification> {
  const item: AdminNotification = {
    id: id(),
    read: false,
    createdAt: n.createdAt ?? new Date().toISOString(),
    ...n,
  };
  store.push(item);
  return item;
}

export async function markAsRead(idToMark: string) {
  store = store.map((n) => (n.id === idToMark ? { ...n, read: true } : n));
}

export async function markAllAsRead() {
  store = store.map((n) => ({ ...n, read: true }));
}

// Helper composers for common actions (optional usage)
export const composeMessages = {
  permissionsChanged(params: {
    perfil: string;
    adminNome: string;
    diffs: Array<{ name: string; enabled: boolean }>; // changed permissions
  }): { message: string; actionType: NotificationActionType } {
    const list = params.diffs
      .map((d) => `${d.name}: ${d.enabled ? "Ativada" : "Desativada"}`)
      .join(", ");
    const when = new Date().toLocaleString("pt-BR");
    return {
      message: `Alerta: Permissões do perfil ${params.perfil} foram alteradas por ${params.adminNome} (${when}). Alterações: ${list}.`,
      actionType: "permissions_changed",
    };
  },
  coinsAdjusted(params: {
    adminNome: string;
    alunoId?: string;
    disciplinaId?: string;
    quantidade: number;
    justificativa?: string;
  }): { message: string; actionType: NotificationActionType } {
    const when = new Date().toLocaleString("pt-BR");
    const extra = params.justificativa ? ` (justificativa: ${params.justificativa})` : "";
    return {
      message: `Alerta: Ajuste manual de moedas (${params.quantidade}) ${params.alunoId ? `para ${params.alunoId} ` : ""}${params.disciplinaId ? `em ${params.disciplinaId} ` : ""}por ${params.adminNome} (${when}).${extra}`,
      actionType: "coins_adjusted",
    };
  },
  userRoleChanged(params: { adminNome: string; userNome: string; de: string; para: string }) {
    const when = new Date().toLocaleString("pt-BR");
    return {
      message: `Alerta: Tipo do usuário ${params.userNome} foi alterado de ${params.de} para ${params.para} por ${params.adminNome} (${when}).`,
      actionType: "user_role_changed" as const,
    };
  },
  userStatusChanged(params: { adminNome: string; userNome: string; de: string; para: string }) {
    const when = new Date().toLocaleString("pt-BR");
    return {
      message: `Alerta: Status do usuário ${params.userNome} foi alterado de ${params.de} para ${params.para} por ${params.adminNome} (${when}).`,
      actionType: "user_status_changed" as const,
    };
  },
  disciplineArchived(params: { adminNome: string; disciplina: string }) {
    const when = new Date().toLocaleString("pt-BR");
    return {
      message: `Alerta: A disciplina ${params.disciplina} foi arquivada por ${params.adminNome} (${when}).`,
      actionType: "discipline_archived" as const,
    };
  },
  disciplineDeleted(params: { adminNome: string; disciplina: string }) {
    const when = new Date().toLocaleString("pt-BR");
    return {
      message: `Alerta: A disciplina ${params.disciplina} foi excluída por ${params.adminNome} (${when}).`,
      actionType: "discipline_deleted" as const,
    };
  },
  purchaseCanceled(params: { adminNome: string; alunoNome: string; valor: number }) {
    const when = new Date().toLocaleString("pt-BR");
    return {
      message: `Alerta: Compra de pontos de ${params.alunoNome} (R$ ${params.valor}) foi cancelada por ${params.adminNome} (${when}).`,
      actionType: "purchase_canceled" as const,
    };
  },
  teacherUnlinked(params: { adminNome: string; teacherNome: string; disciplina: string }) {
    const when = new Date().toLocaleString("pt-BR");
    return {
      message: `Alerta: O professor ${params.teacherNome} foi desvinculado da disciplina ${params.disciplina} por ${params.adminNome} (${when}).`,
      actionType: "teacher_unlinked" as const,
    };
  },
  academicEventCreated(params: { adminNome: string; titulo: string; periodo: string; dataInicio: string; dataFim: string }) {
    const when = new Date().toLocaleString("pt-BR");
    return {
      message: `Novo evento acadêmico: ${params.titulo} (${params.dataInicio} - ${params.dataFim}) adicionado ao período ${params.periodo} por ${params.adminNome} (${when}).`,
      actionType: "academic_event_created" as const,
    };
  },
  integrationToggled(params: { adminNome: string; nome: string; status: "ativo" | "inativo" }) {
    const when = new Date().toLocaleString("pt-BR");
    return {
      message: `Integração ${params.nome} foi ${params.status === "ativo" ? "ativada" : "desativada"} por ${params.adminNome} (${when}).`,
      actionType: "integration_toggled" as const,
    };
  },
};
