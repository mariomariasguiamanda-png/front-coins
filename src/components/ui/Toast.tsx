import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { X } from "lucide-react";

export type ToastVariant = "default" | "success" | "error" | "warning";
export type ToastItem = {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number; // ms
};

type ToastContextValue = {
  show: (t: Omit<ToastItem, "id">) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <Toaster />");
  return ctx;
}

export function Toaster({ children }: { children?: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const show = useCallback((t: Omit<ToastItem, "id">) => {
    const id = Math.random().toString(36).slice(2);
    const item: ToastItem = { id, duration: 3000, variant: "default", ...t };
    setItems((prev) => [...prev, item]);
    if (item.duration && item.duration > 0) {
      setTimeout(() => {
        setItems((prev) => prev.filter((i) => i.id !== id));
      }, item.duration);
    }
  }, []);

  const value = useMemo<ToastContextValue>(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex w-80 max-w-[90vw] flex-col gap-2">
        {items.map((t) => (
          <div
            key={t.id}
            className={[
              "rounded-xl shadow-lg border px-4 py-3 bg-white",
              t.variant === "success" && "border-green-200",
              t.variant === "error" && "border-red-200",
              t.variant === "warning" && "border-yellow-200",
              t.variant === "default" && "border-slate-200",
            ].filter(Boolean).join(" ")}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                {t.title && <div className="font-semibold text-sm truncate">{t.title}</div>}
                {t.description && <div className="text-sm text-slate-600 break-words">{t.description}</div>}
              </div>
              <button
                onClick={() => setItems((prev) => prev.filter((i) => i.id !== t.id))}
                className="p-1 rounded-md hover:bg-slate-100"
                aria-label="Fechar aviso"
              >
                <X className="h-4 w-4 text-slate-500" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
