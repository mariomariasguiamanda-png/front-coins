import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import {
  MessageCircle,
  Search,
  ChevronLeft,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getTickets, addTicketResponse, updateTicket, type Ticket, type TicketStatus } from "@/services/api/support";
import { useToast } from "@/components/ui/Toast";

const mockTickets: Ticket[] = [];

export default function SuporteChamadosPage() {
  const { show } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [tipoFilter, setTipoFilter] = useState<string>("todos");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [ticketDialogOpen, setTicketDialogOpen] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [newReply, setNewReply] = useState("");
  const [sending, setSending] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortBy, setSortBy] = useState<"data-desc" | "data-asc" | "status" | "solicitante">("data-desc");
  const [editStatus, setEditStatus] = useState<TicketStatus | "">("");
  const [editResponsavel, setEditResponsavel] = useState("");
  const [savingDetails, setSavingDetails] = useState(false);

  useEffect(() => { getTickets().then(setTickets); }, []);

  const filteredTickets = tickets.filter((t) => {
    const s = searchTerm.toLowerCase();
    const matchesSearch = t.solicitante.toLowerCase().includes(s) || t.descricao.toLowerCase().includes(s);
    const matchesStatus = statusFilter === "todos" || t.status === statusFilter;
    const matchesTipo = tipoFilter === "todos" || t.tipo === tipoFilter;
    return matchesSearch && matchesStatus && matchesTipo;
  });
  const sortedTickets = [...filteredTickets].sort((a, b) => {
    if (sortBy === "status") return a.status.localeCompare(b.status);
    if (sortBy === "solicitante") return a.solicitante.localeCompare(b.solicitante);
    // dataAbertura sort
    const da = new Date(a.dataAbertura).getTime();
    const db = new Date(b.dataAbertura).getTime();
    return sortBy === "data-asc" ? da - db : db - da;
  });
  const totalPages = Math.max(1, Math.ceil(sortedTickets.length / pageSize));
  const start = (page - 1) * pageSize;
  const pageItems = sortedTickets.slice(start, start + pageSize);
  // reset page if out of range after filters change
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  const stats = useMemo(() => {
    const abertos = tickets.filter((t) => t.status === "aberto").length;
    const emAndamento = tickets.filter((t) => t.status === "em_andamento").length;
    const resolvidos = tickets.filter((t) => t.status === "resolvido").length;
    return { abertos, emAndamento, resolvidos, total: tickets.length };
  }, [tickets]);

  return (
    <AdminLayout>
      <div className="space-y-6 pb-8">
        {/* Header */}
        <header className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Gerenciar Chamados</h1>
                <p className="text-gray-600 mt-1">Atendimento e resolução de solicitações</p>
              </div>
            </div>
            <Link href="/adm/suporte" className="no-underline">
              <Button variant="outline" className="rounded-lg inline-flex items-center gap-2">
                <ChevronLeft className="h-4 w-4" />
                Voltar ao hub
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="rounded-xl border-l-4 border-l-amber-500 bg-gradient-to-br from-amber-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Abertos</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.abertos}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Em Andamento</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.emAndamento}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Resolvidos</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.resolvidos}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </header>

        {/* Filters */}
        <Card className="rounded-xl shadow-sm">
          <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-xl"></div>
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex max-w-[320px] items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar chamados..." className="rounded-lg" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px] rounded-lg"><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os status</SelectItem>
                    <SelectItem value="aberto">Aberto</SelectItem>
                    <SelectItem value="em_andamento">Em andamento</SelectItem>
                    <SelectItem value="resolvido">Resolvido</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={tipoFilter} onValueChange={setTipoFilter}>
                  <SelectTrigger className="w-[180px] rounded-lg"><SelectValue placeholder="Tipo" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os tipos</SelectItem>
                    <SelectItem value="tecnico">Técnico</SelectItem>
                    <SelectItem value="pedagogico">Pedagógico</SelectItem>
                    <SelectItem value="administrativo">Administrativo</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={(v) => { setSortBy(v as any); setPage(1); }}>
                  <SelectTrigger className="w-[200px] rounded-lg"><SelectValue placeholder="Ordenar" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="data-desc">Mais recentes</SelectItem>
                    <SelectItem value="data-asc">Mais antigos</SelectItem>
                    <SelectItem value="status">Status (A-Z)</SelectItem>
                    <SelectItem value="solicitante">Solicitante (A-Z)</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setPage(1); }}>
                  <SelectTrigger className="w-[140px] rounded-lg"><SelectValue placeholder="Itens por página" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 por página</SelectItem>
                    <SelectItem value="10">10 por página</SelectItem>
                    <SelectItem value="20">20 por página</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          {pageItems.map((ticket) => (
            <Card key={ticket.id} className="rounded-xl">
              <CardContent className="p-6">
                <div className="-m-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer" role="button" tabIndex={0} onClick={() => { setSelectedTicket(ticket); setTicketDialogOpen(true); }} onKeyDown={(e) => { if (e.key === 'Enter') { setSelectedTicket(ticket); setTicketDialogOpen(true); } }}>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{ticket.solicitante}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${ticket.status === "aberto" ? "bg-yellow-100 text-yellow-700" : ticket.status === "em_andamento" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>{ticket.status.replace("_", " ")}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{ticket.descricao}</p>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <p>Aberto em: {new Date(ticket.dataAbertura).toLocaleDateString("pt-BR")}</p>
                    <p>Prazo: {new Date(ticket.prazoEstimado).toLocaleDateString("pt-BR")}</p>
                    {ticket.responsavel && <p>Responsável: {ticket.responsavel}</p>}
                  </div>
                </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>Página {page} de {totalPages}</div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-lg" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Anterior</Button>
            <Button variant="outline" size="sm" className="rounded-lg" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Próxima</Button>
          </div>
        </div>

        <Dialog open={ticketDialogOpen} onOpenChange={(o) => { setTicketDialogOpen(o); if (!o) { setNewReply(""); setSending(false); setSavingDetails(false); } }}>
          <DialogContent className="max-w-2xl bg-white">
            <DialogHeader>
              <DialogTitle>Detalhes do Chamado</DialogTitle>
              <DialogDescription>Visualize e gerencie os detalhes do chamado selecionado</DialogDescription>
            </DialogHeader>
            {selectedTicket && (
              <div className="space-y-6">
                {/* Informações do Chamado */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Solicitante</p>
                    <p className="font-semibold text-gray-900">{selectedTicket.solicitante}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Status</p>
                    <Select 
                      value={editStatus || selectedTicket.status} 
                      onValueChange={async (v) => {
                        setEditStatus(v as TicketStatus);
                        if (!selectedTicket) return;
                        try {
                          const next: Ticket = {
                            ...selectedTicket,
                            status: v as TicketStatus,
                          };
                          const updated = await updateTicket(next);
                          setTickets(tickets.map((t) => (t.id === updated.id ? updated : t)));
                          setSelectedTicket(updated);
                          show({ variant: "success", title: "Status atualizado" });
                        } catch (error) {
                          console.error(error);
                        }
                      }}
                    >
                      <SelectTrigger className="rounded-lg bg-white border-gray-300">
                        <SelectValue placeholder="Selecionar status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aberto">Aberto</SelectItem>
                        <SelectItem value="em_andamento">Em andamento</SelectItem>
                        <SelectItem value="resolvido">Resolvido</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500 mb-1">Responsável</p>
                    <Input 
                      placeholder="Atribuir atendente" 
                      className="rounded-lg bg-white border-gray-300" 
                      value={editResponsavel} 
                      onChange={(e) => setEditResponsavel(e.target.value)} 
                      onBlur={async () => {
                        if (!selectedTicket || editResponsavel === selectedTicket.responsavel) return;
                        try {
                          const next: Ticket = {
                            ...selectedTicket,
                            responsavel: editResponsavel.trim() || null,
                          };
                          const updated = await updateTicket(next);
                          setTickets(tickets.map((t) => (t.id === updated.id ? updated : t)));
                          setSelectedTicket(updated);
                          show({ variant: "success", title: "Responsável atualizado" });
                        } catch (error) {
                          console.error(error);
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Descrição */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Descrição do Problema</p>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-900">{selectedTicket.descricao}</p>
                  </div>
                </div>
                
                {/* Seção de Resposta */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Responder ao Chamado</p>
                  <textarea 
                    className="w-full rounded-lg border border-gray-300 p-3 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    rows={4} 
                    placeholder="Digite sua resposta..." 
                    value={newReply} 
                    onChange={(e) => setNewReply(e.target.value)} 
                  />
                </div>

                {/* Footer com Ações */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    {(editStatus || selectedTicket.status) === "resolvido" && (
                      <Button
                        variant="outline"
                        className="rounded-lg"
                        disabled={savingDetails}
                        onClick={async () => {
                          if (!selectedTicket) return;
                          try {
                            setSavingDetails(true);
                            const next: Ticket = { ...selectedTicket, status: "aberto" };
                            const updated = await updateTicket(next);
                            setTickets(tickets.map((t) => (t.id === updated.id ? updated : t)));
                            setSelectedTicket(updated);
                            setEditStatus("aberto");
                            show({ variant: "success", title: "Chamado reaberto" });
                          } finally {
                            setSavingDetails(false);
                          }
                        }}
                      >
                        Reabrir Chamado
                      </Button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="rounded-lg"
                      onClick={() => setTicketDialogOpen(false)}
                    >
                      Fechar
                    </Button>
                    <Button
                      className="rounded-lg"
                      isLoading={sending}
                      disabled={!newReply.trim() || sending}
                      onClick={async () => {
                        if (!selectedTicket) return;
                        try {
                          setSending(true);
                          const updated = await addTicketResponse(selectedTicket.id, { 
                            autorId: "sup_session", 
                            autorNome: "Agente Suporte", 
                            mensagem: newReply.trim() 
                          });
                          setTickets(tickets.map((t) => (t.id === updated.id ? updated : t)));
                          setSelectedTicket(updated);
                          setNewReply("");
                          show({ variant: "success", title: "Resposta enviada com sucesso" });
                          // Fechar o dialog após enviar
                          setTicketDialogOpen(false);
                        } catch (error) {
                          console.error("Erro ao enviar resposta:", error);
                          show({ variant: "error", title: "Erro ao enviar resposta" });
                        } finally {
                          setSending(false);
                        }
                      }}
                    >
                      Enviar Resposta
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
