import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { X, Plus, Users } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onClose: () => void;
  discipline: any | null;
  professoresGlobais: any[];
  todasDisciplinas?: any[]; // For when discipline is null
  onUpdate: () => void;
};

export function ManageTeachersDialog({ open, onClose, discipline, professoresGlobais, todasDisciplinas, onUpdate }: Props) {
  const [selectedProf, setSelectedProf] = useState("");
  const [selectedDiscId, setSelectedDiscId] = useState("");
  const [loading, setLoading] = useState(false);

  // If a specific discipline is passed, use it. Otherwise, find the selected one from the global list.
  const currentDiscipline = discipline || (todasDisciplinas?.find(d => String(d.id) === selectedDiscId));

  const handleAdd = async () => {
    if (!selectedProf || !currentDiscipline) return;
    try {
      setLoading(true);
      await api.post(`/admin/disciplinas/${currentDiscipline.id}/professores`, {
        id_professor: selectedProf,
      });
      toast.success("Professor adicionado com sucesso!");
      setSelectedProf("");
      onUpdate();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao adicionar professor");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (idProf: string) => {
    if (!currentDiscipline) return;
    if (!confirm("Tem certeza que deseja remover este professor da disciplina?")) return;
    try {
      setLoading(true);
      await api.delete(`/admin/disciplinas/${currentDiscipline.id}/professores/${idProf}`);
      toast.success("Professor removido com sucesso!");
      onUpdate();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao remover professor");
    } finally {
      setLoading(false);
    }
  };

  const currentTeacherIds = new Set(currentDiscipline?.teachers?.map((t: any) => String(t.id)) || []);
  const availableTeachers = professoresGlobais.filter(p => !currentTeacherIds.has(String(p.id_professor)));

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[500px] bg-white text-slate-900 border-slate-200">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-violet-600" />
            Gerenciar Professores
          </DialogTitle>
          <DialogDescription>
            Atribua ou remova professores de uma disciplina.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Select Discipline if not provided */}
          {!discipline && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Selecione a Disciplina</label>
              <select
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-50"
                value={selectedDiscId}
                onChange={(e) => setSelectedDiscId(e.target.value)}
                disabled={loading}
              >
                <option value="">Selecione uma disciplina...</option>
                {todasDisciplinas?.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.code})
                  </option>
                ))}
              </select>
            </div>
          )}

          {currentDiscipline && (
            <>
              {/* List of current teachers */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-700">Professores Vinculados</h4>
                {currentDiscipline.teachers.length === 0 ? (
                  <p className="text-sm text-slate-500 italic">Nenhum professor vinculado.</p>
                ) : (
                  <ul className="space-y-2">
                    {currentDiscipline.teachers.map((t: any) => (
                      <li key={t.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <div>
                          <p className="text-sm font-medium text-slate-900">{t.name}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                          onClick={() => handleRemove(t.id)}
                          disabled={loading}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Add new teacher */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h4 className="text-sm font-semibold text-slate-700">Adicionar Professor</h4>
                <div className="flex gap-2">
                  <select
                    className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-50"
                    value={selectedProf}
                    onChange={(e) => setSelectedProf(e.target.value)}
                    disabled={loading || availableTeachers.length === 0}
                  >
                    <option value="">
                      {availableTeachers.length === 0 ? "Nenhum professor disponível" : "Selecione um professor..."}
                    </option>
                    {availableTeachers.map((p) => (
                      <option key={p.id_professor} value={p.id_professor}>
                        {p.nome} ({p.email})
                      </option>
                    ))}
                  </select>
                  <Button
                    className="rounded-lg bg-violet-600 hover:bg-violet-700 text-white"
                    disabled={!selectedProf || loading}
                    onClick={handleAdd}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" className="rounded-lg" onClick={onClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ManageTeachersDialog;
