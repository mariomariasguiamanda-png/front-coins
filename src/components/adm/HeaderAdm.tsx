import { Bell, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/Button";

export function HeaderAdm() {
  return (
    <header className="fixed top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="flex h-16 items-center px-4 md:px-6">
        <Link href="/adm/dashboard" className="mr-6">
          <Image
            src="/logo-coins.png"
            alt="Coins for Study"
            width={120}
            height={40}
            className="dark:brightness-200"
          />
        </Link>

        <div className="ml-auto flex items-center gap-4">
          {/* Notifications */}
          <Button variant="outline" size="sm" className="relative w-10 h-10 p-0">
            <Bell className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              5
            </span>
          </Button>

          {/* Profile Menu */}
          <Button variant="outline" size="sm" className="w-10 h-10 p-0">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}