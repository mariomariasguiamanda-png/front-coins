import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Shield, Lock, Key, Database, HardDrive, Settings } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { getSecuritySettings, updateSecuritySettings, diffSecuritySettings, type SecuritySettings } from "@/services/api/security";
import { createNotification } from "@/services/api/notifications";
import { createLog as apiCreateLog } from "@/services/api/logs";
import { toast } from "sonner";

export default function SegurancaConfiguracoesPage() {
  const [sec, setSec] = useState<SecuritySettings | null>(null);
  const [draft, setDraft] = useState<SecuritySettings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSecuritySettings().then((s) => { setSec(s); setDraft(s); });
  }, []);

  // Stats calculation
  const statsConfig = useMemo(() => {
    if (!draft) return { ativos: 0, total: 4, percentual: 0 };
    const ativos = [
      draft.twoFactorAdmin,
      draft.lockoutEnabled,
      draft.encryptSensitiveData,
      draft.backupEnabled,
    ].filter(Boolean).length;
    return {
      ativos,
      total: 4,
      percentual: Math.round((ativos / 4) * 100),
    };
  }, [draft]);

  // Check if there are changes
  const hasChanges = useMemo(() => {
    if (!sec || !draft) return false;
    const changed = JSON.stringify(sec) !== JSON.stringify(draft);
    console.log('Has changes:', changed);
    console.log('Original:', sec);
    console.log('Draft:', draft);
    return changed;
  }, [sec, draft]);

  return (
    <AdminLayout>
      <div className="space-y-6 pb-8">
        {/* Header */}
        <header className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Configurações de Segurança</h1>
              <p className="text-gray-600 mt-1">Políticas e proteções avançadas do sistema</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="rounded-xl border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Proteções Ativas</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{statsConfig.ativos}/{statsConfig.total}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Autenticação 2FA</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{draft?.twoFactorAdmin ? "ON" : "OFF"}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Key className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-l-4 border-l-amber-500 bg-gradient-to-br from-amber-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Criptografia</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{draft?.encryptSensitiveData ? "ON" : "OFF"}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Lock className="h-5 w-5 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Nível Segurança</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{statsConfig.percentual}%</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Database className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Button */}
          <div className="flex gap-3 items-center">
            <Link href="/adm/seguranca">
              <Button variant="outline" className="rounded-lg">Voltar</Button>
            </Link>
          </div>
        </header>

        {/* Settings Card */}
        <Card className="rounded-xl shadow-sm">
          <div className="h-2 bg-gradient-to-r from-green-500 to-green-600 rounded-t-xl"></div>
          <CardContent className="p-6 space-y-6">
            {!draft ? (
              <div className="text-sm text-gray-600">Carregando configurações…</div>
            ) : (
              <div className="space-y-6">
                {/* 2FA Card */}
                <Card className="bg-gradient-to-br from-blue-50 to-white border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-3 flex-1">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <Key className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-gray-900 mb-1">Autenticação em Duas Etapas (2FA)</h3>
                          <p className="text-xs text-gray-600">Requer segundo fator de autenticação para administradores</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch checked={draft.twoFactorAdmin} onCheckedChange={(v) => setDraft({ ...draft, twoFactorAdmin: Boolean(v) })} />
                        <span className="text-sm font-medium text-gray-700">{draft.twoFactorAdmin ? "Ligado" : "Desligado"}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Lockout Card */}
                <Card className="bg-gradient-to-br from-amber-50 to-white border-l-4 border-l-amber-500">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex gap-3 flex-1">
                          <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                            <Lock className="h-5 w-5 text-amber-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-sm font-semibold text-gray-900 mb-1">Bloqueio Automático</h3>
                            <p className="text-xs text-gray-600">Bloqueia conta após tentativas falhas de login</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch checked={draft.lockoutEnabled} onCheckedChange={(v) => setDraft({ ...draft, lockoutEnabled: Boolean(v) })} />
                          <span className="text-sm font-medium text-gray-700">{draft.lockoutEnabled ? "Ligado" : "Desligado"}</span>
                        </div>
                      </div>
                      {draft.lockoutEnabled && (
                        <div className="flex items-center gap-2 pl-13 flex-wrap">
                          <span className="text-xs text-gray-600">Bloquear após</span>
                          <input
                            type="number"
                            min={1}
                            style={{ backgroundColor: '#ffffff', color: '#111827' }}
                            className="w-16 rounded-lg border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            value={draft.lockoutThreshold}
                            onChange={(e) => setDraft({ ...draft, lockoutThreshold: Math.max(1, Number(e.target.value || 1)) })}
                          />
                          <span className="text-xs text-gray-600">tentativas em</span>
                          <input
                            type="number"
                            min={1}
                            style={{ backgroundColor: '#ffffff', color: '#111827' }}
                            className="w-16 rounded-lg border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            value={draft.lockoutWindowMin}
                            onChange={(e) => setDraft({ ...draft, lockoutWindowMin: Math.max(1, Number(e.target.value || 1)) })}
                          />
                          <span className="text-xs text-gray-600">minutos</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Encryption Card */}
                <Card className="bg-gradient-to-br from-purple-50 to-white border-l-4 border-l-purple-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-3 flex-1">
                        <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <Database className="h-5 w-5 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-gray-900 mb-1">Criptografia de Dados Sensíveis</h3>
                          <p className="text-xs text-gray-600">Protege dados confidenciais com criptografia avançada</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch checked={draft.encryptSensitiveData} onCheckedChange={(v) => setDraft({ ...draft, encryptSensitiveData: Boolean(v) })} />
                        <span className="text-sm font-medium text-gray-700">{draft.encryptSensitiveData ? "Ligado" : "Desligado"}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Backup Card */}
                <Card className="bg-gradient-to-br from-green-50 to-white border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex gap-3 flex-1">
                          <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                            <HardDrive className="h-5 w-5 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-sm font-semibold text-gray-900 mb-1">Backup Periódico</h3>
                            <p className="text-xs text-gray-600">Cópias de segurança automáticas dos dados</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch checked={draft.backupEnabled} onCheckedChange={(v) => setDraft({ ...draft, backupEnabled: Boolean(v) })} />
                          <span className="text-sm font-medium text-gray-700">{draft.backupEnabled ? "Ligado" : "Desligado"}</span>
                        </div>
                      </div>
                      {draft.backupEnabled && (
                        <div className="flex items-center gap-2 pl-13">
                          <span className="text-xs text-gray-600">Frequência:</span>
                          <select
                            style={{ backgroundColor: '#ffffff', color: '#111827' }}
                            className="rounded-lg border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            value={draft.backupFrequency}
                            onChange={(e) => setDraft({ ...draft, backupFrequency: (e.target.value as any) })}
                          >
                            <option value="diario">Diário</option>
                            <option value="semanal">Semanal</option>
                            <option value="mensal">Mensal</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                className="rounded-lg"
                disabled={!hasChanges || saving}
                onClick={() => {
                  if (sec) {
                    setDraft({ ...sec });
                    toast.info('Alterações desfeitas');
                  }
                }}
              >
                Desfazer Alterações
              </Button>
              <Button
                className="rounded-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 inline-flex items-center gap-2"
                disabled={!hasChanges || saving}
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
                    
                    toast.success('Configurações de segurança salvas com sucesso!');
                  } catch (error) {
                    console.error('Erro ao salvar:', error);
                    toast.error('Erro ao salvar configurações de segurança');
                  } finally {
                    setSaving(false);
                  }
                }}
              >
                <Settings className="h-4 w-4" />
                Salvar Configurações
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
