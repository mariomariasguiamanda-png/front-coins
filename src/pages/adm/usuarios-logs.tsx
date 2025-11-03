import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ArrowLeft, Download, Search } from "lucide-react";
import { AdminLog, exportLogsCsv, listLogs, createLog } from "@/services/api/logs";

export default function UsuariosLogsPage() {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [q, setQ] = useState("");
  const [perfil, setPerfil] = useState<"all" | AdminLog["usuarioPerfil"]>("all");

  useEffect(() => {
    let mounted = true;
    (async () => {
      const data = await listLogs();
      if (mounted) setLogs(data);
      // exemplo: registrar visita
      await createLog({ usuarioNome: "Administrador (sessão)", usuarioPerfil: "Administrador", acao: "Acessou Logs de Usuários" });
      const again = await listLogs();
      if (mounted) setLogs(again);
    })();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return logs.filter((l) => {
      const matchesText = !s || l.acao.toLowerCase().includes(s) || l.usuarioNome.toLowerCase().includes(s);
      const matchesPerfil = perfil === "all" || l.usuarioPerfil === perfil;
      return matchesText && matchesPerfil;
    });
  }, [logs, q, perfil]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">Logs e Auditoria</h1>
            <p className="text-muted-foreground">Consulte e exporte eventos administrativos</p>
          </div>
          <div className="flex gap-2">
            <Link href="/adm/usuarios">
              <Button variant="outline" className="rounded-lg"><ArrowLeft className="h-4 w-4" /> Voltar ao hub</Button>
            </Link>
            <Button variant="outline" className="rounded-lg" onClick={() => exportLogsCsv(filtered)}>
              <Download className="h-4 w-4" /> Exportar CSV
            </Button>
          </div>
        </header>

        <Card className="rounded-xl">
          <CardContent className="p-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2 max-w-[360px]">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input className="input-field rounded-lg" placeholder="Buscar por usuário, ação ou IP..." value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <select
                value={perfil}
                onChange={(e) => setPerfil(e.target.value as any)}
                className="min-w-[180px] h-9 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                style={{
                  backgroundColor: '#ffffff !important',
                  color: '#111827 !important',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em',
                  paddingRight: '2.5rem'
                }}
              >
                <option value="all" style={{ backgroundColor: '#ffffff', color: '#111827' }}>Todos os perfis</option>
                <option value="Administrador" style={{ backgroundColor: '#ffffff', color: '#111827' }}>Administrador</option>
                <option value="Professor" style={{ backgroundColor: '#ffffff', color: '#111827' }}>Professor</option>
                <option value="Aluno" style={{ backgroundColor: '#ffffff', color: '#111827' }}>Aluno</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-3">
          {filtered.map((l) => (
            <Card key={l.id} className="rounded-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">{new Date(l.dataHora).toLocaleString("pt-BR")}</div>
                    <div className="mt-1 font-medium">{l.acao}</div>
                    <div className="text-xs text-muted-foreground">{l.usuarioNome} • {l.usuarioPerfil}{l.ip ? ` • ${l.ip}` : ""}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && <p className="text-sm text-muted-foreground">Nenhum registro encontrado.</p>}
        </div>
      </div>
    </AdminLayout>
  );
}
