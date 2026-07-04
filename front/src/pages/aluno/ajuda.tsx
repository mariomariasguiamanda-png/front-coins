"use client";

import { getAlunoLayout } from "@/components/layout/AlunoLayout";
import Ajuda from "@/modules/aluno/Ajuda";
import type { NextPageWithLayout } from "@/pages/_app";

const AjudaPage: NextPageWithLayout = () => <Ajuda />;
AjudaPage.getLayout = getAlunoLayout;

export default AjudaPage;
