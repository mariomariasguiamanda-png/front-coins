// Minimal toast hook used in admin pages. For now, it just uses alert/console.
export type ToastOptions = {
  variant?: "success" | "error" | "info";
  title?: string;
  description?: string;
};

export function useToast() {
  function show(opts: ToastOptions) {
    if (typeof window !== "undefined") {
      const title = opts.title || (opts.variant ? opts.variant.toUpperCase() : "Mensagem");
      const desc = opts.description ? `\n${opts.description}` : "";
      try {
        // Prefer non-blocking
        console.log(`[toast:${opts.variant || "info"}]`, title, desc);
      } catch {}
      // Optional blocking alert for visibility
      // alert(`${title}${desc}`);
    }
  }
  return { show };
}
