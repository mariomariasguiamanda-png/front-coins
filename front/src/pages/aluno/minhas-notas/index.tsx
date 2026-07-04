"use client";

import { getAlunoLayout } from "@/components/layout/AlunoLayout";
import MinhasNotas from "@/modules/aluno/MinhasNotas";
import type { NextPageWithLayout } from "@/pages/_app";

const MinhasNotasPage: NextPageWithLayout = () => <MinhasNotas />;
MinhasNotasPage.getLayout = getAlunoLayout;

export default MinhasNotasPage;
