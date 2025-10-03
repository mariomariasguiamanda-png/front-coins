import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { aluno } from "@/lib/mock/aluno";
import { useState } from "react";

export default function Perfil() {
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ nome: aluno.nome, email: "ana.souza@escola.edu", celular: "(11) 99999-9999" });
  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold">👤 Perfil</h2>
          <p className="text-sm text-white/80">Gerencie seus dados pessoais.</p>
        </div>
        <Button size="sm" onClick={() => setEdit((v) => !v)} className="bg-white text-purple-700 hover:bg-secondary-100">{edit ? "Cancelar" : "Editar"}</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="rounded-xl bg-white/5 border border-white/15">
          <CardContent className="p-4 space-y-3">
            <h3 className="font-semibold">Dados institucionais</h3>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div>
                <div className="text-white/70">Nome</div>
                <div className="font-medium">{aluno.nome}</div>
              </div>
              <div>
                <div className="text-white/70">Matrícula</div>
                <div className="font-medium">{aluno.matricula}</div>
              </div>
              <div>
                <div className="text-white/70">Saldo de moedas</div>
                <div className="font-medium">{aluno.saldoTotal}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl bg-white/5 border border-white/15">
          <CardContent className="p-4 space-y-3">
            <h3 className="font-semibold">Dados pessoais</h3>
            <div className="space-y-3 text-sm">
              <label className="block">
                <span className="text-white/80">Nome</span>
                <input disabled={!edit} value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} className="mt-1 w-full rounded bg-white/10 border border-white/20 px-2 py-1" />
              </label>
              <label className="block">
                <span className="text-white/80">E-mail</span>
                <input disabled={!edit} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1 w-full rounded bg-white/10 border border-white/20 px-2 py-1" />
              </label>
              <label className="block">
                <span className="text-white/80">Celular</span>
                <input disabled={!edit} value={form.celular} onChange={(e) => setForm({ ...form, celular: e.target.value })} className="mt-1 w-full rounded bg-white/10 border border-white/20 px-2 py-1" />
              </label>
              <div className="flex gap-2 justify-end">
                <Button disabled={!edit} className="bg-purple-600 hover:bg-purple-700">Salvar alterações</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
