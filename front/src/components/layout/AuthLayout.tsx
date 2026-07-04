import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh grid place-items-center p-6 bg-secondary-50">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
