import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface AdmBackButtonProps {
  href: string;
  label?: string;
  className?: string;
}

export function AdmBackButton({
  href,
  className,
}: AdmBackButtonProps) {
  return (
    <Link href={href} className={className}>
      <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100 h-10 w-10 shrink-0" aria-label="Voltar">
        <ArrowLeft className="h-5 w-5 text-slate-600" />
      </Button>
    </Link>
  );
}
