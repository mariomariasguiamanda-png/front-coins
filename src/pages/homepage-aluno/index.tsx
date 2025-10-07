"use client";

import AlunoLayout from "@/components/layout/AlunoLayout";
import Dashboard from "@/modules/aluno/Dashboard";
import {
  aluno,
  atividades as mockAtividades,
  moedasPorMes,
  rankingTurma,
} from "@/lib/mock/aluno";

export default function AlunoHomePage() {
  const saldoTotal = aluno.saldoTotal;

  return (
    <AlunoLayout>
      <Dashboard
        aluno={{
          nome: aluno.nome,
          matricula: aluno.matricula,
          saldoTotal: saldoTotal,
        }}
        moedasPorMes={moedasPorMes}
        rankingTurma={rankingTurma}
        proximoPrazo={new Date(
          mockAtividades[0]?.prazo || Date.now()
        ).toLocaleDateString("pt-BR")}
      />
    </AlunoLayout>
  );
}
