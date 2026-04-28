import { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { AdmBackButton } from "@/components/adm/AdmBackButton";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Save } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { getSystemSettings, updateSystemSettings, diffSystemSettings, type SystemSettings } from "@/services/api/system-settings";
import { createLog } from "@/services/api/logs";

export default function ConfigVisualPage() {
  const { show } = useToast();
  const [data, setData] = useState<SystemSettings | null>(null);
  const [draft, setDraft] = useState<SystemSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);

  useEffect(() => { getSystemSettings().then((s) => { setData(s); setDraft(s); }); }, []);
  const changesPending = useMemo(() => JSON.stringify(data) !== JSON.stringify(draft), [data, draft]);

  // Aplicar cores em tempo real
  useEffect(() => {
    if (draft) {
      document.documentElement.style.setProperty('--color-primary', draft.branding.primaryColor);
      document.documentElement.style.setProperty('--color-secondary', draft.branding.secondaryColor);
      document.documentElement.style.setProperty('--font-family', draft.branding.fontFamily);
    }
  }, [draft]);

  useEffect(() => {
    return () => {
      if (logoPreviewUrl) {
        URL.revokeObjectURL(logoPreviewUrl);
      }
    };
  }, [logoPreviewUrl]);

  return (
    <AdminLayout>
      <div className="space-y-6 pb-8">
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">Identidade Visual</h1>
            <p className="text-muted-foreground">Logo, cores e tipografia</p>
          </div>
          <div className="flex items-center gap-2">
            <AdmBackButton href="/adm/configuracoes" className="hidden md:block" />
            {changesPending && (
              <span className="text-xs text-amber-600 font-medium">✓ Alterações pendentes</span>
            )}
            <Button 
              className="rounded-lg" 
              disabled={!changesPending || !draft || saving} 
              isLoading={saving}
              onClick={async () => {
                if (!data || !draft) {
                  show({ variant: "error", title: "Dados não carregados" });
                  return;
                }
                
                try {
                  setSaving(true);
                  
                  const saved = await updateSystemSettings(draft);
                  
                  setData(saved); 
                  setDraft(saved);
                  
                  show({ variant: "success", title: "✓ Configurações salvas!" });
                  
                  const diffs = diffSystemSettings(data, draft);
                  if (diffs.length > 0) {
                    await createLog({ 
                      usuarioNome: "Administrador", 
                      usuarioPerfil: "Administrador", 
                      acao: `Identidade visual: ${diffs.join(", ")}` 
                    });
                  }
                } catch (error) {
                  console.error("Erro ao salvar:", error);
                  show({ variant: "error", title: "Erro ao salvar" });
                } finally { 
                  setSaving(false); 
                }
              }}
            >
              <Save className="mr-2 h-4 w-4"/>Salvar alterações
            </Button>
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
                  <Button variant="outline" className="rounded-lg">
                    <label className="cursor-pointer">
                      <Upload className="mr-2 inline h-4 w-4" /> Selecionar arquivo
                      <input type="file" accept="image/*" className="sr-only" onChange={(e) => {
                        const f = e.currentTarget.files?.[0]; if (!f) return;
                        if (!draft) return;

                        if (logoPreviewUrl) {
                          URL.revokeObjectURL(logoPreviewUrl);
                        }

                        const url = URL.createObjectURL(f);
                        setLogoPreviewUrl(url);
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

            {/* Pré-visualização */}
            <div className="space-y-3 border-t pt-6">
              <h3 className="text-lg font-semibold">Pré-visualização</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3 rounded-lg border p-4" style={{ fontFamily: draft.branding.fontFamily }}>
                  <p className="text-sm text-gray-600">Tipografia em uso:</p>
                  <p className="text-2xl font-bold">Título Principal</p>
                  <p className="text-base">Texto normal com a fonte selecionada</p>
                  <p className="text-sm text-gray-500">Texto secundário menor</p>
                </div>
                <div className="space-y-3 rounded-lg border p-4">
                  <p className="text-sm text-gray-600 mb-3">Cores aplicadas:</p>
                  <div className="flex gap-3">
                    <div className="flex-1 space-y-2">
                      <div 
                        className="h-20 rounded-lg border-2" 
                        style={{ backgroundColor: draft.branding.primaryColor }}
                      />
                      <p className="text-xs text-center font-medium">Primária</p>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div 
                        className="h-20 rounded-lg border-2" 
                        style={{ backgroundColor: draft.branding.secondaryColor }}
                      />
                      <p className="text-xs text-center font-medium">Secundária</p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button 
                      className="flex-1 rounded-lg" 
                      style={{ backgroundColor: draft.branding.primaryColor }}
                    >
                      Botão Primário
                    </Button>
                    <Button 
                      className="flex-1 rounded-lg" 
                      style={{ backgroundColor: draft.branding.secondaryColor }}
                    >
                      Botão Secundário
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent></Card>
        )}
      </div>
    </AdminLayout>
  );
}
