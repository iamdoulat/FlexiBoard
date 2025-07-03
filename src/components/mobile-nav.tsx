"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

export function MobileNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const allLinks = [
    { href: "/dashboard/user", label: "User", icon: User },
    { href: "/dashboard", label: "Admin", icon: LayoutDashboard },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  const links = allLinks.filter(link => {
    if (link.label === 'Admin' || link.label === 'Settings') {
      return user?.role === 'admin';
    }
    return true;
  });

  return (
    <div className="fixed bottom-0 left-0 z-40 w-full border-t bg-background/95 backdrop-blur-sm md:hidden">
      <nav className="flex h-14 items-center justify-around">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 p-2 text-muted-foreground transition-colors hover:text-primary",
              pathname.startsWith(link.href) && "text-primary"
            )}
          >
            <link.icon className="h-5 w-5" />
            <span className="text-xs">{link.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
