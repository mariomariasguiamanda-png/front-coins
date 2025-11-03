import { useEffect, useState, useMemo } from "react";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import Link from "next/link";
import {
  FileText,
  ChevronLeft,
  PlusCircle,
  Edit2,
  Trash2,
  Filter,
  Layers,
  MessageSquare,
  Tag,
  TrendingUp,
} from "lucide-react";
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
  }, [items, pageSize, page]);

  const stats = useMemo(() => {
    if (!items) return { total: 0, categorias: 0, maisUsados: 0 };
    const catSet = new Set(items.map((i) => i.categoria));
    const maisUsados = items.filter((i) => i.tags?.includes("popular")).length;
    return { total: items.length, categorias: catSet.size, maisUsados };
  }, [items]);
  return (
    <AdminLayout>
      <div className="space-y-6 pb-8">
        {/* Header */}
        <header className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Respostas Padrão</h1>
                <p className="text-gray-600 mt-1">Templates para agilizar atendimentos</p>
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
            <Card className="rounded-xl border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Templates</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Layers className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Categorias</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.categorias}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Tag className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-l-4 border-l-amber-500 bg-gradient-to-br from-amber-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Mais Usados</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.maisUsados}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Disponíveis</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </header>

        {/* Controls */}
        <Card className="rounded-xl shadow-sm">
          <div className="h-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-t-xl"></div>
          <CardContent className="p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <Button
                className="rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 inline-flex items-center gap-2"
                onClick={() => { setTitulo(""); setTexto(""); setCategoria("Geral"); setOpenCreate(true); }}
              >
                <PlusCircle className="h-4 w-4" /> Nova Resposta
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
          </CardContent>
        </Card>

        <div className="grid gap-6">{!items ? (
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
