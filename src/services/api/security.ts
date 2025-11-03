export type SecuritySettings = {
  twoFactorAdmin: boolean;
  lockoutEnabled: boolean;
  lockoutAttempts?: number;
  lockoutThreshold?: number;
  lockoutWindowMin?: number;
  lockoutDuration?: number;
  sessionTimeout?: number;
  passwordMinLength?: number;
  passwordRequireSpecial?: boolean;
  encryptSensitiveData?: boolean;
  backupEnabled?: boolean;
  backupFrequency?: string;
  auditLog?: boolean;
};

let state: SecuritySettings = {
  twoFactorAdmin: false,
  lockoutEnabled: true,
  lockoutAttempts: 5,
  lockoutThreshold: 5,
  lockoutWindowMin: 15,
  lockoutDuration: 30,
  sessionTimeout: 60,
  passwordMinLength: 8,
  passwordRequireSpecial: true,
  encryptSensitiveData: true,
  backupEnabled: true,
  backupFrequency: "diario",
  auditLog: true,
};

export async function getSecuritySettings(): Promise<SecuritySettings> {
  return JSON.parse(JSON.stringify(state));
}

export async function updateSecuritySettings(next: SecuritySettings): Promise<SecuritySettings> {
  state = JSON.parse(JSON.stringify(next));
  return getSecuritySettings();
}

export function diffSecuritySettings(a: SecuritySettings, b: SecuritySettings): string[] {
  const diffs: string[] = [];
  if (a.twoFactorAdmin !== b.twoFactorAdmin) diffs.push("2FA admin");
  if (a.lockoutEnabled !== b.lockoutEnabled) diffs.push("bloqueio automático");
  if (a.lockoutAttempts !== b.lockoutAttempts) diffs.push("tentativas de bloqueio");
  if (a.lockoutThreshold !== b.lockoutThreshold) diffs.push("limite de tentativas");
  if (a.lockoutDuration !== b.lockoutDuration) diffs.push("duração do bloqueio");
  if (a.sessionTimeout !== b.sessionTimeout) diffs.push("timeout de sessão");
  if (a.passwordMinLength !== b.passwordMinLength) diffs.push("tamanho mínimo de senha");
  if (a.passwordRequireSpecial !== b.passwordRequireSpecial) diffs.push("exigir caracteres especiais");
  if (a.auditLog !== b.auditLog) diffs.push("log de auditoria");
  return diffs;
}
