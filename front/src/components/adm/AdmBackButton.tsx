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
  label = "Voltar ao hub",
  className,
}: AdmBackButtonProps) {
  return (
    <Link href={href} className={className}>
      <Button variant="outline" className="rounded-lg inline-flex items-center gap-2">
        <ArrowLeft className="h-4 w-4" />
        {label}
      </Button>
    </Link>
  );
}
