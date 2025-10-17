import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { PlusCircle, Save, ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverItem } from "@/components/ui/Popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSystemSettings, updateSystemSettings, diffSystemSettings, type SystemSettings, type AcademicEvent, type AcademicPeriod } from "@/services/api/system-settings";
import { createLog } from "@/services/api/logs";
import { createNotification, composeMessages } from "@/services/api/notifications";

export default function ConfigCalendarioPage() {
  const { show } = useToast();
  const [data, setData] = useState<SystemSettings | null>(null);
  const [draft, setDraft] = useState<SystemSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [eventDraft, setEventDraft] = useState<Partial<AcademicEvent>>({ tipo: "prova", notificar: true });
  const [selectedPeriodId, setSelectedPeriodId] = useState<string | null>(null);
  const [eventDialogTab, setEventDialogTab] = useState<"adicionar" | "editar">("adicionar");
  const [eventEditId, setEventEditId] = useState<string | null>(null);

  useEffect(() => { getSystemSettings().then((s) => { setData(s); setDraft(s); }); }, []);
  const selectedPeriod = useMemo(() => draft?.periods.find(p => p.id === selectedPeriodId) || null, [draft, selectedPeriodId]);
  const changesPending = useMemo(() => JSON.stringify(data) !== JSON.stringify(draft), [data, draft]);

  const addEventToSelectedPeriod = async () => {
    if (!draft || !selectedPeriod) return;
    const newEvent: AcademicEvent = {
      id: `e_${Date.now()}`,
      titulo: eventDraft.titulo || "Novo Evento",
      tipo: (eventDraft.tipo as any) || "outro",
      dataInicio: eventDraft.dataInicio || new Date().toISOString().slice(0,10),
      dataFim: eventDraft.dataFim || eventDraft.dataInicio || new Date().toISOString().slice(0,10),
      descricao: eventDraft.descricao || "",
      notificar: Boolean(eventDraft.notificar),
    };
    const next: SystemSettings = {
      ...draft,
      periods: draft.periods.map((p) => p.id === selectedPeriod.id ? { ...p, eventos: [...p.eventos, newEvent] } : p),
    } as SystemSettings;
    setDraft(next);
    setEventDialogOpen(false);
    setEventDraft({ tipo: "prova", notificar: true });
    setEventEditId(null);
    setEventDialogTab("adicionar");
    if (newEvent.notificar) {
      await createNotification(
        composeMessages.academicEventCreated({
          adminNome: "Administrador (sessão)",
          titulo: newEvent.titulo,
          periodo: selectedPeriod.nome,
          dataInicio: newEvent.dataInicio,
          dataFim: newEvent.dataFim,
        }) as any
      );
      show({ variant: "success", title: "Evento adicionado", description: "Notificações automáticas disparadas." });
    }
  };

  const updateEventInSelectedPeriod = async () => {
    if (!draft || !selectedPeriod || !eventEditId) return;
    const next: SystemSettings = {
      ...draft,
      periods: draft.periods.map((p) =>
        p.id === selectedPeriod.id
          ? {
              ...p,
              eventos: p.eventos.map((ev) =>
                ev.id === eventEditId
                  ? {
                      ...ev,
                      titulo: eventDraft.titulo || ev.titulo,
                      tipo: (eventDraft.tipo as any) || ev.tipo,
                      dataInicio: eventDraft.dataInicio || ev.dataInicio,
                      dataFim: eventDraft.dataFim || ev.dataFim,
                      descricao: eventDraft.descricao ?? ev.descricao,
                      notificar: Boolean(eventDraft.notificar),
                    }
                  : ev
              ),
            }
          : p
      ),
    } as SystemSettings;
    setDraft(next);
    setEventDialogOpen(false);
    setEventEditId(null);
    setEventDialogTab("adicionar");
    show({ variant: "success", title: "Evento atualizado" });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">Calendário</h1>
            <p className="text-muted-foreground">Períodos letivos e eventos</p>
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
                await createLog({ usuarioNome: "Administrador (sessão)", usuarioPerfil: "Administrador", acao: `Atualizou calendário: ${diffs.join(", ")}` });
                await createNotification({ message: `Calendário atualizado.`, actionType: "permissions_changed", recipients: ["Administrador", "Coordenador"] });
                show({ variant: "success", title: "Configurações salvas" });
              } finally { setSaving(false); }
            }}><Save className="mr-2 h-4 w-4"/>Salvar alterações</Button>
          </div>
        </header>

        {!draft ? (
          <Card className="rounded-xl"><CardContent className="p-6 text-sm text-muted-foreground">Carregando…</CardContent></Card>
        ) : (
          <Card className="rounded-xl"><CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Períodos Letivos</h3>
              <Button className="rounded-xl" onClick={() => {
                const novo: AcademicPeriod = { id: `p_${Date.now()}`, nome: `Novo período`, tipo: "semestre", dataInicio: new Date().toISOString().slice(0,10), dataFim: new Date().toISOString().slice(0,10), eventos: [], } as AcademicPeriod;
                setDraft({ ...draft, periods: [...draft.periods, novo] });
              }}>
                <PlusCircle className="mr-2 h-4 w-4" /> Novo Período
              </Button>
            </div>

            <div className="space-y-3">
              {draft.periods.map((p) => (
                <div key={p.id} className="rounded-lg border p-4 hover:bg-gray-50">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="grid gap-2 md:grid-cols-2 md:items-center">
                      <Input className="rounded-lg" value={p.nome} onChange={(e) => setDraft({ ...draft, periods: draft.periods.map(px => px.id === p.id ? { ...px, nome: e.target.value } : px) })} />
                      <div className="flex items-center gap-2">
                        <Select
                          value={p.tipo as any}
                          onValueChange={(v) => setDraft({
                            ...draft,
                            periods: draft.periods.map(px => px.id === p.id ? { ...px, tipo: v as any } : px)
                          })}
                        >
                          <SelectTrigger className="min-w-[140px] bg-white text-slate-900 border border-slate-300">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent side="bottom">
                            <SelectItem value="semestre">Semestre</SelectItem>
                            <SelectItem value="trimestre">Trimestre</SelectItem>
                            <SelectItem value="bimestre">Bimestre</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input type="date" className="rounded-lg" value={p.dataInicio} onChange={(e) => setDraft({ ...draft, periods: draft.periods.map(px => px.id === p.id ? { ...px, dataInicio: e.target.value } : px) })} />
                        <Input type="date" className="rounded-lg" value={p.dataFim} onChange={(e) => setDraft({ ...draft, periods: draft.periods.map(px => px.id === p.id ? { ...px, dataFim: e.target.value } : px) })} />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" className="rounded-xl" onClick={() => setSelectedPeriodId(p.id)}>
                        Gerenciar eventos
                      </Button>
                    </div>
                  </div>

                  {selectedPeriodId === p.id && (
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Eventos</h4>
                        <Button
                          variant="ghost"
                          className="rounded-xl"
                          onClick={() => {
                            setEventDraft({ tipo: "prova", notificar: true });
                            setEventEditId(null);
                            setEventDialogTab("adicionar");
                            setEventDialogOpen(true);
                          }}
                        >
                          <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Evento
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {p.eventos.map(ev => (
                          <div key={ev.id} className="flex items-center justify-between rounded-md bg-gray-50 p-2 text-sm">
                            <div className="flex items-center gap-3">
                              <span className="font-medium">{ev.titulo}</span>
                              <span className="rounded-full bg-violet-50 px-2 py-0.5 text-xs text-violet-700">{ev.tipo}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <span>
                                {new Date(ev.dataInicio).toLocaleDateString("pt-BR")} - {new Date(ev.dataFim).toLocaleDateString("pt-BR")}
                              </span>
                              <Popover
                                trigger={<Button variant="outline" className="h-7 px-3 rounded-lg text-xs">Mais ações ▾</Button>}
                              >
                                <PopoverItem
                                  onClick={() => {
                                    setSelectedPeriodId(p.id);
                                    setEventDraft({ ...ev });
                                    setEventEditId(ev.id);
                                    setEventDialogTab("editar");
                                    setEventDialogOpen(true);
                                  }}
                                >
                                  Editar
                                </PopoverItem>
                                <PopoverItem
                                  onClick={() => {
                                    setSelectedPeriodId(p.id);
                                    const { id, ...rest } = ev;
                                    setEventDraft({ ...rest });
                                    setEventEditId(null);
                                    setEventDialogTab("adicionar");
                                    setEventDialogOpen(true);
                                  }}
                                >
                                  Duplicar
                                </PopoverItem>
                                <PopoverItem
                                  className="text-red-600"
                                  onClick={() => {
                                    if (!confirm("Excluir este evento?")) return;
                                    if (!draft) return;
                                    const next = {
                                      ...draft,
                                      periods: draft.periods.map(px =>
                                        px.id === p.id
                                          ? { ...px, eventos: px.eventos.filter(e => e.id !== ev.id) }
                                          : px
                                      ),
                                    } as SystemSettings;
                                    setDraft(next);
                                    show({ variant: "success", title: "Evento excluído" });
                                  }}
                                >
                                  Excluir
                                </PopoverItem>
                              </Popover>
                            </div>
                          </div>
                        ))}
                        {p.eventos.length === 0 && (
                          <div className="text-sm text-muted-foreground">Sem eventos cadastrados.</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent></Card>
        )}

        <Dialog open={eventDialogOpen} onOpenChange={setEventDialogOpen}>
          <DialogContent className="sm:max-w-[520px] admin-form-light">
            <DialogHeader>
              <DialogTitle>Novo Evento Acadêmico</DialogTitle>
              <DialogDescription>Insira as informações do evento</DialogDescription>
            </DialogHeader>
            <Tabs value={eventDialogTab} onValueChange={(v) => setEventDialogTab(v as any)} className="mb-2">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="adicionar">Adicionar</TabsTrigger>
                <TabsTrigger value="editar" disabled={!eventEditId}>Editar</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Título</label>
                <Input className="rounded-lg" value={eventDraft.titulo || ""} onChange={(e) => setEventDraft({ ...eventDraft, titulo: e.target.value })} />
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="sm:col-span-1">
                  <label className="text-sm font-medium">Tipo</label>
                  <Select
                    value={(eventDraft.tipo as any) || "prova"}
                    onValueChange={(v) => setEventDraft({ ...eventDraft, tipo: v as any })}
                  >
                    <SelectTrigger
                      className="mt-1 bg-white text-slate-900 border border-slate-300"
                      aria-label="Tipo de evento"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent side="bottom">
                      <SelectItem value="prova">Prova</SelectItem>
                      <SelectItem value="conselho">Conselho</SelectItem>
                      <SelectItem value="ferias">Férias</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Início</label>
                  <Input type="date" className="rounded-lg" value={eventDraft.dataInicio || ""} onChange={(e) => setEventDraft({ ...eventDraft, dataInicio: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium">Fim</label>
                  <Input type="date" className="rounded-lg" value={eventDraft.dataFim || ""} onChange={(e) => setEventDraft({ ...eventDraft, dataFim: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Descrição</label>
                <textarea
                  className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 px-3 py-2 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  rows={3}
                  value={eventDraft.descricao || ""}
                  onChange={(e) => setEventDraft({ ...eventDraft, descricao: e.target.value })}
                  style={{ backgroundColor: "#ffffff", color: "#0f172a" }}
                />
              </div>
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" checked={Boolean(eventDraft.notificar)} onChange={(e) => setEventDraft({ ...eventDraft, notificar: e.target.checked })} />
                <span>Notificar alunos e professores</span>
              </label>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" className="rounded-xl" onClick={() => setEventDialogOpen(false)}>Cancelar</Button>
                {eventDialogTab === "editar" ? (
                  <Button className="rounded-xl" onClick={updateEventInSelectedPeriod}>Salvar alterações</Button>
                ) : (
                  <Button className="rounded-xl" onClick={addEventToSelectedPeriod}>Adicionar</Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
