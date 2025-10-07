import { ReactNode } from "react";
import { HeaderAdm } from "./HeaderAdm";
import { SidebarAdm } from "./SidebarAdm";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-violet-50">
      <HeaderAdm />
      
      <div className="flex pt-16">
        <aside className="fixed h-[calc(100vh-4rem)] w-64 border-r bg-white">
          <SidebarAdm />
        </aside>
        
        <main className="ml-64 flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}