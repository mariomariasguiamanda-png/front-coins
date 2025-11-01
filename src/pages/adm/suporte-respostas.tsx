import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import Link from "next/link";
import { FileText, ArrowLeft, PlusCircle, Edit2, Trash2, Filter } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { getStandardResponses, createStandardResponse, updateStandardResponse, deleteStandardResponse, type StandardResponse } from "@/services/api/support";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SuporteRespostasPage() {
  const { show } = useToast();
  const [items, setItems] = useState<StandardResponse[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortBy, setSortBy] = useState<"titulo-asc" | "titulo-desc" | "cat-asc" | "cat-desc">("titulo-asc");

  // Dialogs
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState<null | StandardResponse>(null);
  const [openDelete, setOpenDelete] = useState<null | StandardResponse>(null);
  // Forms
  const [titulo, setTitulo] = useState("");
  const [texto, setTexto] = useState("");
  const [categoria, setCategoria] = useState("Geral");
  useEffect(() => { getStandardResponses().then(setItems); }, []);
  useEffect(() => {
    if (!items) return;
    const total = Math.max(1, Math.ceil(items.length / pageSize));
    if (page > total) setPage(1);
  }, [items, pageSize]);
  return (
    <AdminLayout>
      <div className="space-y-6">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-violet-500" />
            <div className="space-y-1">
              <h1 className="text-2xl font-bold">Respostas Padrão</h1>
              <p className="text-muted-foreground">Modelos prontos para agilizar atendimentos</p>
            </div>
          </div>
          <Link href="/adm/suporte" className="hidden md:block"><Button variant="outline" className="rounded-xl"><ArrowLeft className="mr-2 h-4 w-4"/>Voltar ao Hub</Button></Link>
        </header>

        <div className="grid gap-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <Button variant="outline" className="rounded-lg" onClick={() => { setTitulo(""); setTexto(""); setCategoria("Geral"); setOpenCreate(true); }}>
              <PlusCircle className="mr-2 h-4 w-4" /> Nova Resposta
            </Button>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                <SelectTrigger className="w-[220px] rounded-lg"><SelectValue placeholder="Ordenar por" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="titulo-asc">Título (A-Z)</SelectItem>
                  <SelectItem value="titulo-desc">Título (Z-A)</SelectItem>
                  <SelectItem value="cat-asc">Categoria (A-Z)</SelectItem>
                  <SelectItem value="cat-desc">Categoria (Z-A)</SelectItem>
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

          {!items ? (
            <Card className="rounded-xl"><CardContent className="p-6 text-sm text-muted-foreground">Carregando…</CardContent></Card>
          ) : items.length === 0 ? (
            <Card className="rounded-xl"><CardContent className="p-6 text-sm text-muted-foreground">Nenhuma resposta padrão ainda.</CardContent></Card>
          ) : (
            (() => {
              const sorted = [...items].sort((a, b) => {
                if (sortBy.startsWith("titulo")) return sortBy.endsWith("asc") ? a.titulo.localeCompare(b.titulo) : b.titulo.localeCompare(a.titulo);
                return sortBy.endsWith("asc") ? a.categoria.localeCompare(b.categoria) : b.categoria.localeCompare(a.categoria);
              });
              const start = (page - 1) * pageSize;
              const pageItems = sorted.slice(start, start + pageSize);
              const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
              if (page > totalPages) setPage(1);
              return (
                <>
                  {pageItems.map((resp) => (
                    <Card key={resp.id} className="rounded-xl">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold">{resp.titulo}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{resp.texto}</p>
                            <p className="text-xs text-muted-foreground mt-1">Categoria: {resp.categoria}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="rounded-lg" onClick={() => { setOpenEdit(resp); setTitulo(resp.titulo); setTexto(resp.texto); setCategoria(resp.categoria); }}>
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="rounded-lg text-red-600 hover:text-red-700" onClick={() => setOpenDelete(resp)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div>Página {page} de {totalPages}</div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="rounded-lg" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Anterior</Button>
                      <Button variant="outline" size="sm" className="rounded-lg" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Próxima</Button>
                    </div>
                  </div>
                </>
              );
            })()
          )}
        </div>

        {/* Dialogs */}
        <Dialog open={openCreate} onOpenChange={setOpenCreate}>
          <DialogContent className="rounded-xl">
            <DialogHeader>
              <DialogTitle>Nova Resposta Padrão</DialogTitle>
              <DialogDescription>Crie um modelo de resposta reutilizável.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Título" className="rounded-lg" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
              <Textarea rows={4} placeholder="Texto" className="rounded-lg" value={texto} onChange={(e) => setTexto(e.target.value)} />
              <Input placeholder="Categoria" className="rounded-lg" value={categoria} onChange={(e) => setCategoria(e.target.value)} />
            </div>
            <DialogFooter>
              <Button variant="outline" className="rounded-lg" onClick={() => setOpenCreate(false)}>Cancelar</Button>
              <Button className="rounded-lg" isLoading={loading} disabled={!titulo.trim() || !texto.trim() || !categoria.trim()} onClick={async () => {
                try { setLoading(true); const created = await createStandardResponse({ titulo: titulo.trim(), texto: texto.trim(), categoria: categoria.trim() }); setItems([...(items || []), created]); show({ variant: "success", title: "Resposta criada" }); setOpenCreate(false); setTitulo(""); setTexto(""); setCategoria("Geral"); } finally { setLoading(false); }
              }}>Criar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={!!openEdit} onOpenChange={(o) => !o && setOpenEdit(null)}>
          <DialogContent className="rounded-xl">
            <DialogHeader>
              <DialogTitle>Editar Resposta Padrão</DialogTitle>
              <DialogDescription>Atualize o conteúdo do modelo.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Título" className="rounded-lg" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
              <Textarea rows={4} placeholder="Texto" className="rounded-lg" value={texto} onChange={(e) => setTexto(e.target.value)} />
              <Input placeholder="Categoria" className="rounded-lg" value={categoria} onChange={(e) => setCategoria(e.target.value)} />
            </div>
            <DialogFooter>
              <Button variant="outline" className="rounded-lg" onClick={() => setOpenEdit(null)}>Cancelar</Button>
              <Button className="rounded-lg" isLoading={loading} disabled={!titulo.trim() || !texto.trim() || !categoria.trim()} onClick={async () => {
                if (!openEdit) return; try { setLoading(true); const updated = await updateStandardResponse(openEdit.id, { titulo: titulo.trim(), texto: texto.trim(), categoria: categoria.trim() }); setItems(items!.map((i) => (i.id === openEdit.id ? updated : i))); show({ variant: "success", title: "Resposta atualizada" }); setOpenEdit(null); } finally { setLoading(false); }
              }}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={!!openDelete} onOpenChange={(o) => !o && setOpenDelete(null)}>
          <DialogContent className="rounded-xl">
            <DialogHeader>
              <DialogTitle>Excluir Resposta</DialogTitle>
              <DialogDescription>Esta ação removerá a resposta padrão.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" className="rounded-lg" onClick={() => setOpenDelete(null)}>Cancelar</Button>
              <Button className="rounded-lg bg-red-600 hover:bg-red-700" isLoading={loading} onClick={async () => {
                if (!openDelete) return; try { setLoading(true); await deleteStandardResponse(openDelete.id); setItems(items!.filter((i) => i.id !== openDelete.id)); show({ variant: "success", title: "Resposta excluída" }); setOpenDelete(null); } finally { setLoading(false); }
              }}>Excluir</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
