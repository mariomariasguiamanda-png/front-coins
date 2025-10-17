// In-memory Security Settings service (replace with real backend later)
export type BackupFrequency = "diario" | "semanal" | "mensal";

export interface SecuritySettings {
  twoFactorAdmin: boolean;
  lockoutEnabled: boolean;
  lockoutThreshold: number; // number of failed attempts
  lockoutWindowMin: number; // rolling window minutes to count fails
  encryptSensitiveData: boolean;
  backupEnabled: boolean;
  backupFrequency: BackupFrequency;
}

let settings: SecuritySettings = {
  twoFactorAdmin: false,
  lockoutEnabled: true,
  lockoutThreshold: 5,
  lockoutWindowMin: 15,
  encryptSensitiveData: true,
  backupEnabled: true,
  backupFrequency: "semanal",
};

export async function getSecuritySettings(): Promise<SecuritySettings> {
  return JSON.parse(JSON.stringify(settings));
}

export async function updateSecuritySettings(update: Partial<SecuritySettings>): Promise<SecuritySettings> {
  settings = { ...settings, ...update };
  return getSecuritySettings();
}

export function diffSecuritySettings(prev: SecuritySettings, next: SecuritySettings): string[] {
  const diffs: string[] = [];
  if (prev.twoFactorAdmin !== next.twoFactorAdmin) diffs.push(`2FA admins: ${prev.twoFactorAdmin ? "on" : "off"} -> ${next.twoFactorAdmin ? "on" : "off"}`);
  if (prev.lockoutEnabled !== next.lockoutEnabled) diffs.push(`Bloqueio: ${prev.lockoutEnabled ? "on" : "off"} -> ${next.lockoutEnabled ? "on" : "off"}`);
  if (prev.lockoutThreshold !== next.lockoutThreshold) diffs.push(`Tentativas: ${prev.lockoutThreshold} -> ${next.lockoutThreshold}`);
  if (prev.lockoutWindowMin !== next.lockoutWindowMin) diffs.push(`Janela(min): ${prev.lockoutWindowMin} -> ${next.lockoutWindowMin}`);
  if (prev.encryptSensitiveData !== next.encryptSensitiveData) diffs.push(`Criptografia: ${prev.encryptSensitiveData ? "on" : "off"} -> ${next.encryptSensitiveData ? "on" : "off"}`);
  if (prev.backupEnabled !== next.backupEnabled) diffs.push(`Backup: ${prev.backupEnabled ? "on" : "off"} -> ${next.backupEnabled ? "on" : "off"}`);
  if (prev.backupFrequency !== next.backupFrequency) diffs.push(`Frequência backup: ${prev.backupFrequency} -> ${next.backupFrequency}`);
  return diffs;
}

export const composeSecurityMessages = {
  securitySettingsChanged(params: { adminNome: string; diffs: string[] }) {
    const when = new Date().toLocaleString("pt-BR");
    return {
      message: `Alerta: Configurações de segurança atualizadas por ${params.adminNome} (${when}). Alterações: ${params.diffs.join(", ")}.`,
      actionType: "permissions_changed" as const, // reuse a generic type for now
    };
  },
};
