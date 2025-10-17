import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Shield } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { getSecuritySettings, updateSecuritySettings, diffSecuritySettings, type SecuritySettings } from "@/services/api/security";
import { createNotification } from "@/services/api/notifications";
import { createLog as apiCreateLog } from "@/services/api/logs";

export default function SegurancaConfiguracoesPage() {
  const [sec, setSec] = useState<SecuritySettings | null>(null);
  const [draft, setDraft] = useState<SecuritySettings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSecuritySettings().then((s) => { setSec(s); setDraft(s); });
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-violet-500" />
            <h1 className="text-2xl font-bold">Configurações de Segurança</h1>
          </div>
          <Link href="/adm/seguranca" className="hidden md:block">
            <Button variant="outline" className="rounded-xl">Voltar ao Hub</Button>
          </Link>
        </header>

        <Card className="rounded-xl">
          <CardContent className="p-6 space-y-4">
            {!draft ? (
              <div className="text-sm text-muted-foreground">Carregando…</div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Autenticação em duas etapas (2FA) para administradores</label>
                  <div className="flex items-center gap-3">
                    <Switch checked={draft.twoFactorAdmin} onCheckedChange={(v) => setDraft({ ...draft, twoFactorAdmin: Boolean(v) })} />
                    <span className="text-sm text-muted-foreground">{draft.twoFactorAdmin ? "Ligado" : "Desligado"}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Bloqueio automático após tentativas falhas</label>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Switch checked={draft.lockoutEnabled} onCheckedChange={(v) => setDraft({ ...draft, lockoutEnabled: Boolean(v) })} />
                    <span className="text-sm text-muted-foreground">{draft.lockoutEnabled ? "Ligado" : "Desligado"}</span>
                    <input
                      type="number"
                      min={1}
                      className="w-24 rounded-lg border border-slate-300 bg-white text-slate-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      value={draft.lockoutThreshold}
                      onChange={(e) => setDraft({ ...draft, lockoutThreshold: Math.max(1, Number(e.target.value || 1)) })}
                    />
                    <span className="text-sm text-muted-foreground">tentativas em</span>
                    <input
                      type="number"
                      min={1}
                      className="w-20 rounded-lg border border-slate-300 bg-white text-slate-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      value={draft.lockoutWindowMin}
                      onChange={(e) => setDraft({ ...draft, lockoutWindowMin: Math.max(1, Number(e.target.value || 1)) })}
                    />
                    <span className="text-sm text-muted-foreground">min</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Criptografia de dados sensíveis</label>
                  <div className="flex items-center gap-3">
                    <Switch checked={draft.encryptSensitiveData} onCheckedChange={(v) => setDraft({ ...draft, encryptSensitiveData: Boolean(v) })} />
                    <span className="text-sm text-muted-foreground">{draft.encryptSensitiveData ? "Ligado" : "Desligado"}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Backup periódico</label>
                  <div className="flex items-center gap-3">
                    <Switch checked={draft.backupEnabled} onCheckedChange={(v) => setDraft({ ...draft, backupEnabled: Boolean(v) })} />
                    <span className="text-sm text-muted-foreground">{draft.backupEnabled ? "Ligado" : "Desligado"}</span>
                    <select
                      className="rounded-lg border border-slate-300 bg-white text-slate-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      value={draft.backupFrequency}
                      onChange={(e) => setDraft({ ...draft, backupFrequency: (e.target.value as any) })}
                    >
                      <option value="diario">Diário</option>
                      <option value="semanal">Semanal</option>
                      <option value="mensal">Mensal</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                className="rounded-lg"
                disabled={!sec || !draft || JSON.stringify(sec) === JSON.stringify(draft)}
                onClick={() => sec && setDraft(sec)}
              >
                Desfazer
              </Button>
              <Button
                className="rounded-lg"
                disabled={!sec || !draft || JSON.stringify(sec) === JSON.stringify(draft)}
                isLoading={saving}
                onClick={async () => {
                  if (!sec || !draft) return;
                  const before = sec;
                  const after = draft;
                  const changes = diffSecuritySettings(before, after);
                  if (!changes.length) return;
                  try {
                    setSaving(true);
                    const saved = await updateSecuritySettings(after);
                    setSec(saved);
                    setDraft(saved);
                    await apiCreateLog({
                      usuarioNome: "Administrador (sessão)",
                      usuarioPerfil: "Administrador",
                      acao: `Atualizou configurações de segurança: ${changes.join(", ")}`,
                    });
                    await createNotification({
                      message: `Alerta: Configurações de segurança atualizadas. Alterações: ${changes.join(", ")}.`,
                      actionType: "permissions_changed",
                      recipients: ["Administrador", "Coordenador"],
                    });
                  } finally {
                    setSaving(false);
                  }
                }}
              >
                Salvar configurações
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
