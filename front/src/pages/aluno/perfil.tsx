"use client";

import { getAlunoLayout } from "@/components/layout/AlunoLayout";
import Perfil from "@/modules/aluno/Perfil";
import type { NextPageWithLayout } from "@/pages/_app";

const PerfilPage: NextPageWithLayout = () => <Perfil />;
PerfilPage.getLayout = getAlunoLayout;

export default PerfilPage;
