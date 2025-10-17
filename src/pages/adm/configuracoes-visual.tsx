import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Save, ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { getSystemSettings, updateSystemSettings, diffSystemSettings, type SystemSettings } from "@/services/api/system-settings";
import { createLog } from "@/services/api/logs";
import { createNotification } from "@/services/api/notifications";

export default function ConfigVisualPage() {
  const { show } = useToast();
  const [data, setData] = useState<SystemSettings | null>(null);
  const [draft, setDraft] = useState<SystemSettings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { getSystemSettings().then((s) => { setData(s); setDraft(s); }); }, []);
  const changesPending = useMemo(() => JSON.stringify(data) !== JSON.stringify(draft), [data, draft]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">Identidade Visual</h1>
            <p className="text-muted-foreground">Logo, cores e tipografia</p>
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
                await createLog({ usuarioNome: "Administrador (sessão)", usuarioPerfil: "Administrador", acao: `Atualizou identidade visual: ${diffs.join(", ")}` });
                await createNotification({ message: `Identidade visual atualizada.`, actionType: "permissions_changed", recipients: ["Administrador", "Coordenador"] });
                show({ variant: "success", title: "Configurações salvas" });
              } finally { setSaving(false); }
            }}><Save className="mr-2 h-4 w-4"/>Salvar alterações</Button>
          </div>
        </header>

        {!draft ? (
          <Card className="rounded-xl"><CardContent className="p-6 text-sm text-muted-foreground">Carregando…</CardContent></Card>
        ) : (
          <Card className="rounded-xl"><CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Logo da Instituição</h3>
              <div className="flex items-center gap-4">
                <img src={draft.branding.logoUrl} alt="Logo" className="h-16 w-auto rounded-lg border bg-white p-2" />
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="rounded-xl">
                    <label className="cursor-pointer">
                      <Upload className="mr-2 inline h-4 w-4" /> Selecionar arquivo
                      <input type="file" accept="image/*" className="sr-only" onChange={async (e) => {
                        const f = e.currentTarget.files?.[0]; if (!f) return;
                        const url = URL.createObjectURL(f);
                        setDraft({ ...draft, branding: { ...draft.branding, logoUrl: url } });
                        show({ variant: "success", title: "Logo atualizada (pré-visualização)", description: "Salve para aplicar permanentemente." });
                      }} />
                    </label>
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Cor Primária</label>
                <div className="flex gap-2">
                  <Input type="color" className="h-10 w-20" value={draft.branding.primaryColor} onChange={(e) => setDraft({ ...draft, branding: { ...draft.branding, primaryColor: e.target.value } })} />
                  <Input value={draft.branding.primaryColor} onChange={(e) => setDraft({ ...draft, branding: { ...draft.branding, primaryColor: e.target.value } })} className="rounded-lg" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Cor Secundária</label>
                <div className="flex gap-2">
                  <Input type="color" className="h-10 w-20" value={draft.branding.secondaryColor} onChange={(e) => setDraft({ ...draft, branding: { ...draft.branding, secondaryColor: e.target.value } })} />
                  <Input value={draft.branding.secondaryColor} onChange={(e) => setDraft({ ...draft, branding: { ...draft.branding, secondaryColor: e.target.value } })} className="rounded-lg" />
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Fonte</label>
              <Select value={draft.branding.fontFamily} onValueChange={(v) => setDraft({ ...draft, branding: { ...draft.branding, fontFamily: v } })}>
                <SelectTrigger className="rounded-lg"><SelectValue placeholder="Selecione a fonte" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Inter">Inter</SelectItem>
                  <SelectItem value="Roboto">Roboto</SelectItem>
                  <SelectItem value="Open Sans">Open Sans</SelectItem>
                  <SelectItem value="Poppins">Poppins</SelectItem>
                  <SelectItem value="Montserrat">Montserrat</SelectItem>
                  <SelectItem value="Nunito">Nunito</SelectItem>
                  <SelectItem value="Lato">Lato</SelectItem>
                  <SelectItem value="Source Sans Pro">Source Sans Pro</SelectItem>
                  <SelectItem value="Merriweather">Merriweather</SelectItem>
                  <SelectItem value="Work Sans">Work Sans</SelectItem>
                  <SelectItem value="Alegreya">Alegreya</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent></Card>
        )}
      </div>
    </AdminLayout>
  );
}
