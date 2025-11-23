export type AdminNotification = {
  id: string;
  message: string;
  actionType:
    | "coins_adjusted"
    | "purchase_canceled"
    | "academic_event_created"
    | "user_role_changed"
    | "user_status_changed"
    | "discipline_archived"
    | string;
  read: boolean;
  createdAt: string; // ISO date
  recipients?: string[];
  context?: Record<string, unknown>;
};

const store: AdminNotification[] = [
  {
    id: "n1",
    message: "Sistema de notificações inicializado.",
    actionType: "system_init",
    read: false,
    createdAt: new Date().toISOString(),
  },
];

export async function listNotifications(): Promise<AdminNotification[]> {
  // Return newest first
  return [...store].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function markAsRead(id: string): Promise<void> {
  const item = store.find((n) => n.id === id);
  if (item) item.read = true;
}

export async function markAllAsRead(): Promise<void> {
  store.forEach((n) => (n.read = true));
}

export async function createNotification(input: {
  message: string;
  actionType: AdminNotification["actionType"];
  recipients?: string[];
  context?: Record<string, unknown>;
}): Promise<AdminNotification> {
  const notif: AdminNotification = {
    id: `n_${Math.random().toString(36).slice(2, 9)}`,
    message: input.message,
    actionType: input.actionType,
    read: false,
    createdAt: new Date().toISOString(),
    recipients: input.recipients,
    context: input.context,
  };
  store.unshift(notif);
  return notif;
}

// Message composers used by several admin pages
export const composeMessages = {
  coinsAdjusted(params: {
    adminNome?: string;
    alunoId?: string;
    disciplinaId?: string;
    quantidade: number;
    justificativa?: string;
  }) {
    const { quantidade, justificativa } = params;
    const message = `Ajuste de moedas: ${quantidade}${justificativa ? ` (${justificativa})` : ""}`;
    return { message, actionType: "coins_adjusted" as const };
  },
  purchaseCanceled(params: { motivo?: string; transacaoId?: string }) {
    const { motivo, transacaoId } = params;
    const message = `Compra ${transacaoId ? `#${transacaoId} ` : ""}cancelada${
      motivo ? `: ${motivo}` : ""
    }`;
    return { message, actionType: "purchase_canceled" as const };
  },
  academicEventCreated(params: Record<string, unknown>) {
    const title = (params?.["titulo"] as string) || "Evento acadêmico";
    return { message: `${title} adicionado ao calendário`, actionType: "academic_event_created" as const };
  },
  userRoleChanged(params: { usuario?: string; de?: string; para?: string }) {
    const { usuario, de, para } = params;
    return {
      message: `Perfil alterado${usuario ? ` de ${usuario}` : ""}${de || para ? `: ${de ?? ""} -> ${para ?? ""}` : ""}`,
      actionType: "user_role_changed" as const,
    };
  },
  userStatusChanged(params: { usuario?: string; de?: string; para?: string }) {
    const { usuario, de, para } = params;
    return {
      message: `Status alterado${usuario ? ` de ${usuario}` : ""}${de || para ? `: ${de ?? ""} -> ${para ?? ""}` : ""}`,
      actionType: "user_status_changed" as const,
    };
  },
  disciplineArchived(params: { nome?: string }) {
    const { nome } = params;
    return { message: `Disciplina arquivada${nome ? `: ${nome}` : ""}`, actionType: "discipline_archived" as const };
  },
};