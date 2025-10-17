import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { HelpCircle, PlusCircle, ArrowLeft, Trash2, Edit2, Filter } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { getFaqCategories, createFaqCategory, updateFaqCategory, deleteFaqCategory, addFaqItem, updateFaqItem, deleteFaqItem, type FaqCategory, type FaqItem } from "@/services/api/support";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SuporteFaqsPage() {
  const { show } = useToast();
  const [cats, setCats] = useState<FaqCategory[] | null>(null);
  const [loading, setLoading] = useState(false);

  // Pagination & sorting state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortBy, setSortBy] = useState<"nome-asc" | "nome-desc" | "qtd-asc" | "qtd-desc">("nome-asc");

  // Dialog states
  const [openCreateCat, setOpenCreateCat] = useState(false);
  const [openEditCat, setOpenEditCat] = useState<null | FaqCategory>(null);
  const [openDeleteCat, setOpenDeleteCat] = useState<null | FaqCategory>(null);
  const [openAddFaq, setOpenAddFaq] = useState<null | FaqCategory>(null);
  const [openEditFaq, setOpenEditFaq] = useState<null | { category: FaqCategory; item: FaqItem }>(null);
  const [openDeleteFaq, setOpenDeleteFaq] = useState<null | { category: FaqCategory; item: FaqItem }>(null);

  // Form states
  const [catName, setCatName] = useState("");
  const [faqPergunta, setFaqPergunta] = useState("");
  const [faqResposta, setFaqResposta] = useState("");

  useEffect(() => {
    getFaqCategories().then(setCats);
  }, []);

  // Reset page if out of range when data length or page size changes
  useEffect(() => {
    if (!cats) return;
    const totalPages = Math.max(1, Math.ceil(cats.length / pageSize));
    if (page > totalPages) setPage(1);
  }, [cats, pageSize]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-violet-500" />
            <div className="space-y-1">
              <h1 className="text-2xl font-bold">FAQs</h1>
              <p className="text-muted-foreground">Base de conhecimento</p>
            </div>
          </div>
          <Link href="/adm/suporte" className="hidden md:block"><Button variant="outline" className="rounded-xl"><ArrowLeft className="mr-2 h-4 w-4"/>Voltar ao Hub</Button></Link>
        </header>
        <div className="grid gap-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <Button
              className="rounded-lg"
              variant="outline"
              onClick={() => { setCatName(""); setOpenCreateCat(true); }}
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Nova Categoria
            </Button>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                <SelectTrigger className="w-[220px] rounded-lg">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nome-asc">Nome (A-Z)</SelectItem>
                  <SelectItem value="nome-desc">Nome (Z-A)</SelectItem>
                  <SelectItem value="qtd-asc">Qtd. Perguntas (Asc)</SelectItem>
                  <SelectItem value="qtd-desc">Qtd. Perguntas (Desc)</SelectItem>
                </SelectContent>
              </Select>
              <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setPage(1); }}>
                <SelectTrigger className="w-[140px] rounded-lg">
                  <SelectValue placeholder="Itens por página" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 por página</SelectItem>
                  <SelectItem value="10">10 por página</SelectItem>
                  <SelectItem value="20">20 por página</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Listagem */}
          {!cats ? (
            <Card className="rounded-xl"><CardContent className="p-6 text-sm text-muted-foreground">Carregando…</CardContent></Card>
          ) : cats.length === 0 ? (
            <Card className="rounded-xl"><CardContent className="p-6 text-sm text-muted-foreground">Nenhuma categoria adicionada ainda.</CardContent></Card>
          ) : (
            (() => {
              const sorted = [...cats].sort((a, b) => {
                const qa = a.perguntas.length; const qb = b.perguntas.length;
                if (sortBy === "nome-asc") return a.nome.localeCompare(b.nome);
                if (sortBy === "nome-desc") return b.nome.localeCompare(a.nome);
                if (sortBy === "qtd-asc") return qa - qb;
                return qb - qa;
              });
              const start = (page - 1) * pageSize;
              const pageItems = sorted.slice(start, start + pageSize);
              const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
              return (
                <>
                  {pageItems.map((category) => (
            <Card key={category.id} className="rounded-xl">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{category.nome}</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="rounded-lg" onClick={() => { setOpenEditCat(category); setCatName(category.nome); }} title="Renomear">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-lg text-red-600 hover:text-red-700" onClick={() => setOpenDeleteCat(category)} title="Excluir">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {category.perguntas.map((faq) => (
                      <div key={faq.id} className="space-y-2">
                        <h4 className="font-medium">{faq.pergunta}</h4>
                        <p className="text-sm text-muted-foreground">{faq.resposta}</p>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="rounded-lg" onClick={() => { setOpenEditFaq({ category, item: faq }); setFaqPergunta(faq.pergunta); setFaqResposta(faq.resposta); }}>
                            <Edit2 className="mr-2 h-4 w-4" /> Editar
                          </Button>
                          <Button variant="outline" size="sm" className="rounded-lg text-red-600 hover:text-red-700" onClick={() => setOpenDeleteFaq({ category, item: faq })}>
                            <Trash2 className="mr-2 h-4 w-4" /> Excluir
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button
                      className="w-full rounded-lg border border-dashed border-gray-200 p-4 hover:border-violet-600 hover:bg-violet-50"
                      variant="ghost"
                      onClick={() => { setOpenAddFaq(category); setFaqPergunta(""); setFaqResposta(""); }}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Nova Pergunta
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
                  ))}
                  {/* Pagination Controls */}
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
        <Dialog open={openCreateCat} onOpenChange={setOpenCreateCat}>
          <DialogContent className="rounded-xl">
            <DialogHeader>
              <DialogTitle>Nova Categoria</DialogTitle>
              <DialogDescription>Crie uma categoria para organizar suas FAQs.</DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome</label>
              <Input className="rounded-lg" value={catName} onChange={(e) => setCatName(e.target.value)} />
            </div>
            <DialogFooter>
              <Button variant="outline" className="rounded-lg" onClick={() => setOpenCreateCat(false)}>Cancelar</Button>
              <Button className="rounded-lg" isLoading={loading} disabled={!catName.trim()} onClick={async () => {
                try { setLoading(true); const created = await createFaqCategory(catName.trim()); setCats([...(cats || []), created]); show({ variant: "success", title: "Categoria criada" }); setOpenCreateCat(false); setCatName(""); } finally { setLoading(false); }
              }}>Criar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={!!openEditCat} onOpenChange={(o) => !o && setOpenEditCat(null)}>
          <DialogContent className="rounded-xl">
            <DialogHeader>
              <DialogTitle>Renomear Categoria</DialogTitle>
              <DialogDescription>Atualize o nome da categoria selecionada.</DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome</label>
              <Input className="rounded-lg" value={catName} onChange={(e) => setCatName(e.target.value)} />
            </div>
            <DialogFooter>
              <Button variant="outline" className="rounded-lg" onClick={() => setOpenEditCat(null)}>Cancelar</Button>
              <Button className="rounded-lg" isLoading={loading} disabled={!catName.trim()} onClick={async () => {
                if (!openEditCat) return; try { setLoading(true); const updated = await updateFaqCategory(openEditCat.id, catName.trim()); setCats(cats!.map((c) => (c.id === openEditCat.id ? updated : c))); show({ variant: "success", title: "Categoria atualizada" }); setOpenEditCat(null); } finally { setLoading(false); }
              }}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={!!openDeleteCat} onOpenChange={(o) => !o && setOpenDeleteCat(null)}>
          <DialogContent className="rounded-xl">
            <DialogHeader>
              <DialogTitle>Excluir Categoria</DialogTitle>
              <DialogDescription>Esta ação removerá a categoria e todas as perguntas associadas.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" className="rounded-lg" onClick={() => setOpenDeleteCat(null)}>Cancelar</Button>
              <Button className="rounded-lg bg-red-600 hover:bg-red-700" isLoading={loading} onClick={async () => {
                if (!openDeleteCat) return; try { setLoading(true); await deleteFaqCategory(openDeleteCat.id); setCats(cats!.filter((c) => c.id !== openDeleteCat.id)); show({ variant: "success", title: "Categoria excluída" }); setOpenDeleteCat(null); } finally { setLoading(false); }
              }}>Excluir</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={!!openAddFaq} onOpenChange={(o) => !o && setOpenAddFaq(null)}>
          <DialogContent className="rounded-xl">
            <DialogHeader>
              <DialogTitle>Adicionar Pergunta</DialogTitle>
              <DialogDescription>Inclua uma nova pergunta e resposta.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Pergunta</label>
                <Input className="rounded-lg" value={faqPergunta} onChange={(e) => setFaqPergunta(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium">Resposta</label>
                <Textarea className="rounded-lg" rows={4} value={faqResposta} onChange={(e) => setFaqResposta(e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" className="rounded-lg" onClick={() => setOpenAddFaq(null)}>Cancelar</Button>
              <Button className="rounded-lg" isLoading={loading} disabled={!faqPergunta.trim() || !faqResposta.trim()} onClick={async () => {
                if (!openAddFaq) return; try { setLoading(true); const item = await addFaqItem(openAddFaq.id, faqPergunta.trim(), faqResposta.trim()); setCats(cats!.map((c) => (c.id === openAddFaq.id ? { ...c, perguntas: [...c.perguntas, item] } : c))); show({ variant: "success", title: "Pergunta adicionada" }); setOpenAddFaq(null); setFaqPergunta(""); setFaqResposta(""); } finally { setLoading(false); }
              }}>Adicionar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={!!openEditFaq} onOpenChange={(o) => !o && setOpenEditFaq(null)}>
          <DialogContent className="rounded-xl">
            <DialogHeader>
              <DialogTitle>Editar Pergunta</DialogTitle>
              <DialogDescription>Atualize a pergunta e a resposta.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Pergunta</label>
                <Input className="rounded-lg" value={faqPergunta} onChange={(e) => setFaqPergunta(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium">Resposta</label>
                <Textarea className="rounded-lg" rows={4} value={faqResposta} onChange={(e) => setFaqResposta(e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" className="rounded-lg" onClick={() => setOpenEditFaq(null)}>Cancelar</Button>
              <Button className="rounded-lg" isLoading={loading} disabled={!faqPergunta.trim() || !faqResposta.trim()} onClick={async () => {
                if (!openEditFaq) return; const { category, item } = openEditFaq; try { setLoading(true); const updated = await updateFaqItem(category.id, item.id, { pergunta: faqPergunta.trim(), resposta: faqResposta.trim() }); setCats(cats!.map((c) => c.id === category.id ? { ...c, perguntas: c.perguntas.map((p) => p.id === item.id ? updated : p) } : c)); show({ variant: "success", title: "Pergunta atualizada" }); setOpenEditFaq(null); } finally { setLoading(false); }
              }}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={!!openDeleteFaq} onOpenChange={(o) => !o && setOpenDeleteFaq(null)}>
          <DialogContent className="rounded-xl">
            <DialogHeader>
              <DialogTitle>Excluir Pergunta</DialogTitle>
              <DialogDescription>Confirme a exclusão da pergunta selecionada.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" className="rounded-lg" onClick={() => setOpenDeleteFaq(null)}>Cancelar</Button>
              <Button className="rounded-lg bg-red-600 hover:bg-red-700" isLoading={loading} onClick={async () => {
                if (!openDeleteFaq) return; const { category, item } = openDeleteFaq; try { setLoading(true); await deleteFaqItem(category.id, item.id); setCats(cats!.map((c) => c.id === category.id ? { ...c, perguntas: c.perguntas.filter((p) => p.id !== item.id) } : c)); show({ variant: "success", title: "Pergunta excluída" }); setOpenDeleteFaq(null); } finally { setLoading(false); }
              }}>Excluir</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
