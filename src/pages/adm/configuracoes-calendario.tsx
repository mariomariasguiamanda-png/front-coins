import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { AdmBackButton } from "@/components/adm/AdmBackButton";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { PlusCircle, Save, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const [eventEditId, setEventEditId] = useState<string | null>(null);

  useEffect(() => {
    getSystemSettings().then((s) => {
      setData(s);
      setDraft(s);
      setSelectedPeriodId(s.periods[0]?.id ?? null);
    });
  }, []);
  const selectedPeriod = useMemo(() => draft?.periods.find(p => p.id === selectedPeriodId) || null, [draft, selectedPeriodId]);
  const changesPending = useMemo(() => JSON.stringify(data) !== JSON.stringify(draft), [data, draft]);
  const totalEventos = useMemo(() => (draft ? draft.periods.reduce((acc, p) => acc + p.eventos.length, 0) : 0), [draft]);

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
    show({ variant: "success", title: "Evento atualizado" });
  };

  const removePeriod = (periodId: string) => {
    if (!draft) return;
    if (!confirm("Excluir este período e todos os eventos vinculados?")) return;
    const remaining = draft.periods.filter((p) => p.id !== periodId);
    setDraft({ ...draft, periods: remaining });
    if (selectedPeriodId === periodId) setSelectedPeriodId(remaining[0]?.id ?? null);
    show({ variant: "success", title: "Período removido" });
  };

  const formatDateBR = (value: string) => {
    try {
      return new Date(value).toLocaleDateString("pt-BR");
    } catch {
      return value;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 pb-8">
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">Calendário</h1>
            <p className="text-muted-foreground">Períodos letivos e eventos</p>
          </div>
          <div className="flex items-center gap-2">
            <AdmBackButton href="/adm/configuracoes" className="hidden md:block" />
            <Button className="rounded-lg" disabled={!changesPending || !draft} isLoading={saving} onClick={async () => {
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
          <Card className="rounded-xl">
            <CardContent className="p-6 space-y-6">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Períodos</p>
                  <p className="text-2xl font-semibold text-slate-900">{draft.periods.length}</p>
                </div>
                <div className="rounded-lg border bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Eventos</p>
                  <p className="text-2xl font-semibold text-slate-900">{totalEventos}</p>
                </div>
                <div className="rounded-lg border bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Status</p>
                  <p className="text-sm font-medium text-slate-900">{changesPending ? "Alterações pendentes" : "Sem alterações"}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-lg font-semibold">Períodos Letivos</h3>
                <Button
                  className="rounded-xl"
                  onClick={() => {
                    const novo: AcademicPeriod = {
                      id: `p_${Date.now()}`,
                      nome: "Novo período",
                      tipo: "semestre",
                      dataInicio: new Date().toISOString().slice(0, 10),
                      dataFim: new Date().toISOString().slice(0, 10),
                      eventos: [],
                    } as AcademicPeriod;
                    const next = { ...draft, periods: [...draft.periods, novo] };
                    setDraft(next);
                    setSelectedPeriodId(novo.id);
                  }}
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Novo Período
                </Button>
              </div>

              <div className="space-y-4">
                {draft.periods.length === 0 && (
                  <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                    Nenhum período cadastrado. Clique em "Novo Período" para começar.
                  </div>
                )}

                {draft.periods.map((p) => {
                  const isOpen = selectedPeriodId === p.id;
                  const invalidRange = p.dataFim < p.dataInicio;

                  return (
                    <div key={p.id} className="rounded-xl border bg-white p-4">
                      <div className="grid gap-3 lg:grid-cols-[1.5fr_1fr_auto] lg:items-end">
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-500">Nome do período</label>
                          <Input
                            className="rounded-lg"
                            value={p.nome}
                            onChange={(e) =>
                              setDraft({
                                ...draft,
                                periods: draft.periods.map((px) => (px.id === p.id ? { ...px, nome: e.target.value } : px)),
                              })
                            }
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-500">Tipo</label>
                          <Select
                            value={p.tipo as any}
                            onValueChange={(v) =>
                              setDraft({
                                ...draft,
                                periods: draft.periods.map((px) => (px.id === p.id ? { ...px, tipo: v as any } : px)),
                              })
                            }
                          >
                            <SelectTrigger className="bg-white text-slate-900 border border-slate-300 rounded-lg">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent side="bottom">
                              <SelectItem value="semestre">Semestre</SelectItem>
                              <SelectItem value="trimestre">Trimestre</SelectItem>
                              <SelectItem value="bimestre">Bimestre</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant={isOpen ? "default" : "outline"}
                            className="rounded-lg"
                            onClick={() => setSelectedPeriodId(isOpen ? null : p.id)}
                          >
                            {isOpen ? "Fechar eventos" : "Gerenciar eventos"}
                          </Button>
                          <Button variant="outline" className="rounded-lg text-red-600" onClick={() => removePeriod(p.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-500">Data de início</label>
                          <Input
                            type="date"
                            className="rounded-lg"
                            value={p.dataInicio}
                            onChange={(e) =>
                              setDraft({
                                ...draft,
                                periods: draft.periods.map((px) => (px.id === p.id ? { ...px, dataInicio: e.target.value } : px)),
                              })
                            }
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-500">Data de fim</label>
                          <Input
                            type="date"
                            className="rounded-lg"
                            value={p.dataFim}
                            onChange={(e) =>
                              setDraft({
                                ...draft,
                                periods: draft.periods.map((px) => (px.id === p.id ? { ...px, dataFim: e.target.value } : px)),
                              })
                            }
                          />
                        </div>
                      </div>

                      {invalidRange && (
                        <p className="mt-2 text-xs text-red-600">A data final precisa ser igual ou posterior a data inicial.</p>
                      )}

                      <div className="mt-2 text-xs text-muted-foreground">
                        {p.eventos.length} evento(s) neste período
                      </div>

                      {isOpen && (
                        <div className="mt-4 rounded-lg border bg-slate-50 p-3">
                          <div className="mb-3 flex items-center justify-between">
                            <h4 className="font-medium">Eventos do período</h4>
                            <Button
                              variant="outline"
                              className="rounded-lg"
                              onClick={() => {
                                setSelectedPeriodId(p.id);
                                setEventDraft({ tipo: "prova", notificar: true });
                                setEventEditId(null);
                                setEventDialogOpen(true);
                              }}
                            >
                              <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Evento
                            </Button>
                          </div>

                          <div className="space-y-2">
                            {p.eventos.map((ev) => (
                              <div key={ev.id} className="rounded-md border bg-white p-3">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <p className="font-medium text-slate-900">{ev.titulo}</p>
                                      <span className="rounded-full bg-violet-50 px-2 py-0.5 text-xs text-violet-700">{ev.tipo}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {formatDateBR(ev.dataInicio)} ate {formatDateBR(ev.dataFim)}
                                    </p>
                                  </div>

                                  <div className="flex flex-wrap items-center gap-2">
                                    <Button
                                      variant="outline"
                                      className="h-8 rounded-lg px-3 text-xs"
                                      onClick={() => {
                                        setSelectedPeriodId(p.id);
                                        setEventDraft({ ...ev });
                                        setEventEditId(ev.id);
                                        setEventDialogOpen(true);
                                      }}
                                    >
                                      Editar
                                    </Button>
                                    <Button
                                      variant="outline"
                                      className="h-8 rounded-lg px-3 text-xs"
                                      onClick={() => {
                                        setSelectedPeriodId(p.id);
                                        const { id, ...rest } = ev;
                                        setEventDraft({ ...rest });
                                        setEventEditId(null);
                                        setEventDialogOpen(true);
                                      }}
                                    >
                                      Duplicar
                                    </Button>
                                    <Button
                                      variant="outline"
                                      className="h-8 rounded-lg px-3 text-xs text-red-600"
                                      onClick={() => {
                                        if (!confirm("Excluir este evento?")) return;
                                        const next = {
                                          ...draft,
                                          periods: draft.periods.map((px) =>
                                            px.id === p.id ? { ...px, eventos: px.eventos.filter((e) => e.id !== ev.id) } : px
                                          ),
                                        } as SystemSettings;
                                        setDraft(next);
                                        show({ variant: "success", title: "Evento excluido" });
                                      }}
                                    >
                                      Excluir
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}

                            {p.eventos.length === 0 && (
                              <div className="text-sm text-muted-foreground">Sem eventos cadastrados para este período.</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        <Dialog open={eventDialogOpen} onOpenChange={setEventDialogOpen}>
          <DialogContent className="sm:max-w-[520px] admin-form-light bg-white text-slate-900 border-slate-200">
            <DialogHeader>
              <DialogTitle>{eventEditId ? "Editar evento" : "Novo evento academico"}</DialogTitle>
              <DialogDescription>
                {eventEditId ? "Atualize os dados do evento selecionado" : "Preencha os dados para cadastrar o evento no período"}
              </DialogDescription>
            </DialogHeader>
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
                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => {
                    setEventDialogOpen(false);
                    setEventEditId(null);
                  }}
                >
                  Cancelar
                </Button>
                <Button className="rounded-xl" onClick={eventEditId ? updateEventInSelectedPeriod : addEventToSelectedPeriod}>
                  {eventEditId ? "Salvar alterações" : "Adicionar"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
