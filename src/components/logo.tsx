import Link from "next/link";
import { Command } from "lucide-react";

export function Logo() {
  return (
    <Link href="/dashboard" className="flex items-center gap-2">
      <Command className="h-6 w-6 text-primary" />
      <span className="font-headline text-lg font-semibold tracking-tight group-data-[collapsible=icon]:hidden">
        FlexiBoard
      </span>
    </Link>
  );
}
