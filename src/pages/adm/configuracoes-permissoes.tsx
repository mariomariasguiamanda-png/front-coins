import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Switch } from "@/components/ui/switch";
import { Save, ArrowLeft, Search } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { Input } from "@/components/ui/Input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSystemSettings, updateSystemSettings, diffSystemSettings, type SystemSettings } from "@/services/api/system-settings";

export default function ConfigPermissoesPage() {
  const { show } = useToast();
  const [data, setData] = useState<SystemSettings | null>(null);
  const [draft, setDraft] = useState<SystemSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState("0");
  const [query, setQuery] = useState("");


  useEffect(() => { getSystemSettings().then((s) => { setData(s); setDraft(s); }); }, []);
  const changesPending = useMemo(() => JSON.stringify(data) !== JSON.stringify(draft), [data, draft]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">Permissões</h1>
            <p className="text-muted-foreground">Perfis e recursos</p>
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
          <Card className="rounded-xl">
            <CardContent className="p-6 space-y-5">
              {/* Aviso de regras */}
              <div className="rounded-md border border-violet-200 bg-violet-50 p-3 text-xs text-violet-900">
                Regras: "Visualizar" é pré-requisito para as demais ações. Ao desligar "Visualizar", "Criar", "Editar" e "Excluir" serão desativadas para o recurso.
              </div>
              {/* Tabs por perfil */}
              <Tabs value={tab} onValueChange={setTab}>
                <TabsList>
                  {(draft.permissions || []).map((pm, idx) => (
                    <TabsTrigger key={pm.perfil + idx} value={String(idx)} className="capitalize">
                      {pm.perfil}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {(draft.permissions || []).map((pm, idx) => {
                  const recursosEntries = Object.entries(pm.recursos || {});
                  const filtered = query
                    ? recursosEntries.filter(([name]) => name.toLowerCase().includes(query.toLowerCase()))
                    : recursosEntries;

                  const updateOne = (recurso: string, key: "criar"|"editar"|"visualizar"|"excluir", value: boolean) => {
                    setDraft({
                      ...draft,
                      permissions: (draft.permissions || []).map((px, i) =>
                        i === idx
                          ? {
                              ...px,
                              recursos: {
                                ...(px.recursos || {}),
                                [recurso]: (() => {
                                  const current = (px.recursos || {})[recurso] || { visualizar: false, criar: false, editar: false, excluir: false };
                                  // Regra: criar/editar/excluir exigem visualizar
                                  if (key !== "visualizar" && value === true && !current.visualizar) {
                                    return { ...current, visualizar: true, [key]: value };
                                  }
                                  // Se visualizar for desmarcado, zera os demais
                                  if (key === "visualizar" && value === false) {
                                    return { visualizar: false, criar: false, editar: false, excluir: false };
                                  }
                                  return { ...current, [key]: value };
                                })(),
                              },
                            }
                          : px
                      ),
                    });
                  };

                  return (
                    <TabsContent key={pm.perfil + idx} value={String(idx)} className="mt-4 space-y-4">
                      {/* Filtro e ações */}
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="relative w-full md:max-w-xs">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Filtrar recursos..."
                            className="pl-9 rounded-lg"
                            value={tab === String(idx) ? query : query}
                            onChange={(e) => setQuery(e.target.value)}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Perfil: <span className="font-medium">{pm.perfil}</span> — {filtered.length} recurso(s)
                        </div>
                      </div>

                      {/* Tabela de permissões */}
                      <div className="overflow-x-auto rounded-lg border">
                        <table className="w-full border-collapse text-sm">
                          <thead className="bg-muted/60">
                            <tr>
                              <th className="px-4 py-3 text-left font-medium">Recurso</th>
                              {(["visualizar","criar","editar","excluir"] as const).map((col) => (
                                <th key={col} className="px-4 py-3 text-left font-medium" title={
                                  col === "visualizar"
                                    ? "Permite ver o recurso; necessário para outras ações"
                                    : col === "criar"
                                    ? "Permite criar novos registros do recurso"
                                    : col === "editar"
                                    ? "Permite alterar registros existentes"
                                    : "Permite excluir registros"
                                }>
                                  <span className="capitalize">{col}</span>
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {filtered.map(([recurso, perms], rIdx) => (
                              <tr key={recurso} className={rIdx % 2 === 0 ? "bg-white" : "bg-muted/20"}>
                                <td className="px-4 py-3 font-medium capitalize">{recurso}</td>
                                <td className="px-4 py-3">
                                  <Switch checked={perms.visualizar} onCheckedChange={(v) => updateOne(recurso, "visualizar", Boolean(v))} />
                                </td>
                                <td className="px-4 py-3">
                                  <Switch disabled={!perms.visualizar} checked={perms.criar} onCheckedChange={(v) => updateOne(recurso, "criar", Boolean(v))} />
                                </td>
                                <td className="px-4 py-3">
                                  <Switch disabled={!perms.visualizar} checked={perms.editar} onCheckedChange={(v) => updateOne(recurso, "editar", Boolean(v))} />
                                </td>
                                <td className="px-4 py-3">
                                  <Switch disabled={!perms.visualizar} checked={perms.excluir} onCheckedChange={(v) => updateOne(recurso, "excluir", Boolean(v))} />
                                </td>
                              </tr>
                            ))}
                            {filtered.length === 0 && (
                              <tr>
                                <td className="px-4 py-6 text-center text-muted-foreground" colSpan={5}>Nenhum recurso encontrado para o filtro.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </TabsContent>
                  );
                })}
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
