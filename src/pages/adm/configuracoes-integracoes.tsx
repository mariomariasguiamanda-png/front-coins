import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Save, ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { getSystemSettings, updateSystemSettings, diffSystemSettings, type SystemSettings } from "@/services/api/system-settings";
import { createNotification } from "@/services/api/notifications";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function ConfigIntegracoesPage() {
  const { show } = useToast();
  const [data, setData] = useState<SystemSettings | null>(null);
  const [draft, setDraft] = useState<SystemSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [openConfigFor, setOpenConfigFor] = useState<string | null>(null);

  useEffect(() => { getSystemSettings().then((s) => { setData(s); setDraft(s); }); }, []);
  const changesPending = useMemo(() => JSON.stringify(data) !== JSON.stringify(draft), [data, draft]);
  const mask = (v?: string) => (v ? `••••${v.slice(-4)}` : "-");

  return (
    <AdminLayout>
      <div className="space-y-6">
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">Integrações</h1>
            <p className="text-muted-foreground">Serviços externos e APIs</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/adm/configuracoes" className="hidden md:block">
              <Button variant="outline" className="rounded-xl"><ArrowLeft className="mr-2 h-4 w-4"/>Voltar ao Hub</Button>
            </Link>
            <Button className="rounded-xl" disabled={!changesPending || !draft} isLoading={saving} onClick={async () => {
              if (!data || !draft) return;
              const diffs = diffSystemSettings(data, draft);
              if (!diffs.length) return;
              try {
                setSaving(true);
                const saved = await updateSystemSettings(draft);
                setData(saved); setDraft(saved);
                show({ variant: "success", title: "Configurações salvas" });
              } finally { setSaving(false); }
            }}><Save className="mr-2 h-4 w-4"/>Salvar alterações</Button>
          </div>
        </header>

        {!draft ? (
          <Card className="rounded-xl"><CardContent className="p-6 text-sm text-muted-foreground">Carregando…</CardContent></Card>
        ) : (
          <Card className="rounded-xl"><CardContent className="p-6 space-y-4">
            {draft.integrations.map((it) => (
              <div key={it.id} className="rounded-lg border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold">{it.nome}</h3>
                    <p className="text-sm text-muted-foreground">Última sincronização: {it.ultimaSincronizacao || "-"}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="rounded-xl"
                      onClick={() => setOpenConfigFor(it.id)}
                    >
                      Configurar
                    </Button>
                    <Button className={`rounded-xl ${it.status === "ativo" ? "bg-red-600 hover:bg-red-700" : "bg-violet-600 hover:bg-violet-700"}`} onClick={async () => {
                      const nextStatus = it.status === "ativo" ? "inativo" : "ativo";
                      setDraft({ ...draft, integrations: draft.integrations.map(ix => ix.id === it.id ? { ...ix, status: nextStatus, ultimaSincronizacao: nextStatus === "ativo" ? new Date().toISOString() : ix.ultimaSincronizacao } : ix) });
                      await createNotification({ message: `Integração ${nextStatus === "ativo" ? "ativada" : "desativada"}: ${it.nome}`, actionType: "integration_toggled", recipients: ["Administrador", "Coordenador"] });
                      show({ variant: "success", title: `Integração ${nextStatus === "ativo" ? "ativada" : "desativada"}` });
                    }}>
                      {it.status === "ativo" ? "Desativar" : "Ativar"}
                    </Button>
                  </div>
                </div>
                <div className="mt-4 grid gap-2 md:grid-cols-2 text-sm text-muted-foreground">
                  {it.tipo === "google_classroom" && (
                    <>
                      <div>Client ID: {mask(it.configuracao.clientId)}</div>
                      <div>Client Secret: {mask(it.configuracao.clientSecret)}</div>
                    </>
                  )}
                  {it.tipo === "moodle" && (
                    <>
                      <div>URL do Moodle: {it.configuracao.url || "-"}</div>
                      <div>Token de Acesso: {mask(it.configuracao.token)}</div>
                    </>
                  )}
                  {it.tipo === "api" && (
                    <>
                      <div>Base URL: {it.configuracao.baseUrl || "-"}</div>
                      <div>API Key: {mask(it.configuracao.apiKey)}</div>
                    </>
                  )}
                  <div className="md:col-span-2 text-xs">Use “Configurar” para editar credenciais.</div>
                </div>
              </div>
            ))}
          </CardContent></Card>
        )}

        {/* Dialog de configuração da integração */}
        <Dialog open={!!openConfigFor} onOpenChange={(o) => !o && setOpenConfigFor(null)}>
          <DialogContent className="rounded-xl">
            {(() => {
              const sel = draft?.integrations.find((ix) => ix.id === openConfigFor);
              if (!sel || !draft) return null;
              return (
                <>
                  <DialogHeader>
                    <DialogTitle>Configurar: {sel.nome}</DialogTitle>
                    <DialogDescription>
                      Edite as credenciais e URLs desta integração. As alterações só serão aplicadas após clicar em "Salvar alterações" na página.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="mt-2 grid gap-3 md:grid-cols-2">
                    {sel.tipo === "google_classroom" && (
                      <>
                        <div className="md:col-span-1">
                          <label className="text-sm font-medium">Client ID</label>
                          <Input
                            type="password"
                            className="rounded-lg"
                            value={sel.configuracao.clientId || ""}
                            onChange={(e) =>
                              setDraft({
                                ...draft,
                                integrations: draft.integrations.map((ix) =>
                                  ix.id === sel.id
                                    ? { ...ix, configuracao: { ...ix.configuracao, clientId: e.target.value } }
                                    : ix
                                ),
                              })
                            }
                          />
                        </div>
                        <div className="md:col-span-1">
                          <label className="text-sm font-medium">Client Secret</label>
                          <Input
                            type="password"
                            className="rounded-lg"
                            value={sel.configuracao.clientSecret || ""}
                            onChange={(e) =>
                              setDraft({
                                ...draft,
                                integrations: draft.integrations.map((ix) =>
                                  ix.id === sel.id
                                    ? { ...ix, configuracao: { ...ix.configuracao, clientSecret: e.target.value } }
                                    : ix
                                ),
                              })
                            }
                          />
                        </div>
                      </>
                    )}

                    {sel.tipo === "moodle" && (
                      <>
                        <div className="md:col-span-1">
                          <label className="text-sm font-medium">URL do Moodle</label>
                          <Input
                            className="rounded-lg"
                            value={sel.configuracao.url || ""}
                            onChange={(e) =>
                              setDraft({
                                ...draft,
                                integrations: draft.integrations.map((ix) =>
                                  ix.id === sel.id
                                    ? { ...ix, configuracao: { ...ix.configuracao, url: e.target.value } }
                                    : ix
                                ),
                              })
                            }
                          />
                        </div>
                        <div className="md:col-span-1">
                          <label className="text-sm font-medium">Token de Acesso</label>
                          <Input
                            type="password"
                            className="rounded-lg"
                            value={sel.configuracao.token || ""}
                            onChange={(e) =>
                              setDraft({
                                ...draft,
                                integrations: draft.integrations.map((ix) =>
                                  ix.id === sel.id
                                    ? { ...ix, configuracao: { ...ix.configuracao, token: e.target.value } }
                                    : ix
                                ),
                              })
                            }
                          />
                        </div>
                      </>
                    )}

                    {sel.tipo === "api" && (
                      <>
                        <div className="md:col-span-1">
                          <label className="text-sm font-medium">Base URL</label>
                          <Input
                            className="rounded-lg"
                            value={sel.configuracao.baseUrl || ""}
                            onChange={(e) =>
                              setDraft({
                                ...draft,
                                integrations: draft.integrations.map((ix) =>
                                  ix.id === sel.id
                                    ? { ...ix, configuracao: { ...ix.configuracao, baseUrl: e.target.value } }
                                    : ix
                                ),
                              })
                            }
                          />
                        </div>
                        <div className="md:col-span-1">
                          <label className="text-sm font-medium">API Key</label>
                          <Input
                            type="password"
                            className="rounded-lg"
                            value={sel.configuracao.apiKey || ""}
                            onChange={(e) =>
                              setDraft({
                                ...draft,
                                integrations: draft.integrations.map((ix) =>
                                  ix.id === sel.id
                                    ? { ...ix, configuracao: { ...ix.configuracao, apiKey: e.target.value } }
                                    : ix
                                ),
                              })
                            }
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <DialogFooter className="mt-4">
                    <Button
                      className="rounded-xl"
                      onClick={() => {
                        setOpenConfigFor(null);
                        show({ variant: "success", title: "Configuração atualizada (rascunho)" });
                      }}
                    >
                      Fechar
                    </Button>
                  </DialogFooter>
                </>
              );
            })()}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
