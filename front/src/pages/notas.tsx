"use client";

import MinhasNotas from "@/modules/aluno/MinhasNotas";

export default function NotasPage() {
  // Renderiza o módulo existente, mantendo o padrão visual e regras internas do componente
  return (
    <div className="min-h-dvh p-6">
      <div className="max-w-6xl mx-auto">
        {/* Wrapper com leve fundo para o módulo que usa texto branco sem alterar seu código */}
        <div className="rounded-2xl bg-gradient-to-br from-violet-700 to-violet-800 p-4">
          <MinhasNotas />
        </div>
      </div>
    </div>
  );
}
