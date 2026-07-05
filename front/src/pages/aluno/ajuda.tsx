"use client";

import { getAlunoLayout } from "@/components/aluno/AlunoLayout";
import Ajuda from "@/components/aluno/Ajuda";
import type { NextPageWithLayout } from "@/pages/_app";

const AjudaPage: NextPageWithLayout = () => <Ajuda />;
AjudaPage.getLayout = getAlunoLayout;

export default AjudaPage;
