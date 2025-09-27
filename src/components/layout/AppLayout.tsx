import { ReactNode } from "react";
import Link from "next/link";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh">
      <header className="p-4 border-b bg-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/homepage" className="font-semibold">
            Coins for Study
          </Link>
          <nav className="space-x-4 text-sm">
            <Link href="/homepage">Home</Link>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/perfil">Perfil</Link>
            <Link href="/ajuda">Ajuda</Link>
          </nav>
        </div>
      </header>
      <main className="p-6 max-w-7xl mx-auto">{children}</main>
    </div>
  );
}
