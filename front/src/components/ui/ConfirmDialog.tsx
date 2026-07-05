import { useState } from "react";
import { AlertTriangle, HelpCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "default";
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  variant = "danger",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

  const Icon = variant === "danger" ? AlertTriangle : HelpCircle;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && !loading && onCancel()}>
      <DialogContent className="sm:max-w-[440px] bg-white text-gray-900 border-gray-200">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gray-900">
            <span
              className={`h-9 w-9 rounded-full flex items-center justify-center ${
                variant === "danger" ? "bg-red-100" : "bg-violet-100"
              }`}
            >
              <Icon className={`h-5 w-5 ${variant === "danger" ? "text-red-600" : "text-violet-600"}`} />
            </span>
            {title}
          </DialogTitle>
        </DialogHeader>

        {description && <p className="text-sm text-gray-600">{description}</p>}

        <DialogFooter>
          <Button variant="outline" className="rounded-lg" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            className={`rounded-lg text-white ${
              variant === "danger" ? "bg-red-600 hover:bg-red-700" : "bg-violet-600 hover:bg-violet-700"
            }`}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "Aguarde..." : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
