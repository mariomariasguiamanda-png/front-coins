import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";

interface HistoryEntry {
  id: string;
  date: string;
  user: {
    id: string;
    name: string;
  };
  changes: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
}

interface DisciplineHistory {
  id: string;
  name: string;
  history: HistoryEntry[];
}

interface Props {
  open: boolean;
  onClose: () => void;
  discipline?: DisciplineHistory;
}

export function ViewDisciplineHistoryDialog({ open, onClose, discipline }: Props) {
  if (!discipline) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            Histórico de Alterações - {discipline.name || 'Disciplina'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex flex-col gap-4">
            {discipline.history?.length > 0 ? (
              discipline.history.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 rounded-lg bg-violet-50/50 border border-violet-100"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm text-gray-600">
                        {entry?.date ? new Date(entry.date).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }) : '-'}
                      </p>
                      <p className="text-sm font-medium">
                        Alterado por: {entry?.user?.name || 'Usuário'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {Array.isArray(entry?.changes) && entry.changes.length > 0 ? (
                      entry.changes.map((change, index) => (
                        <div key={index} className="text-sm">
                          <p className="font-medium">{change?.field || 'Campo'}</p>
                          <div className="grid grid-cols-2 gap-4 mt-1">
                            <div>
                              <p className="text-xs text-gray-500">Valor anterior:</p>
                              <p className="text-red-600">{change?.oldValue || '-'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Novo valor:</p>
                              <p className="text-green-600">{change?.newValue || '-'}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-500">
                        Nenhuma alteração detalhada disponível
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                Nenhuma alteração registrada
              </div>
            )}
          </div>

          <div className="flex justify-end mt-4">
            <Button
              type="button"
              variant="outline"
              className="rounded-lg border-violet-200 text-violet-700 hover:bg-violet-50 hover:border-violet-300"
              onClick={onClose}
            >
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}