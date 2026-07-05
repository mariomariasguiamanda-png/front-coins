"use client";

import { getAlunoLayout } from "@/components/aluno/AlunoLayout";
import MinhasNotas from "@/components/aluno/MinhasNotas";
import type { NextPageWithLayout } from "@/pages/_app";

const MinhasNotasPage: NextPageWithLayout = () => <MinhasNotas />;
MinhasNotasPage.getLayout = getAlunoLayout;

export default MinhasNotasPage;
