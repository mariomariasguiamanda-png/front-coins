import { ProfessorLayout } from "@/components/professor/ProfessorLayout";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return <ProfessorLayout>{children}</ProfessorLayout>;
}