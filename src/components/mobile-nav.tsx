"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  User,
  CreditCard,
  History,
  Users,
  CircleUserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

export function MobileNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const userLinks = [
    { href: "/dashboard/user", label: "Dashboard", icon: User },
    { href: "/dashboard/user/recharge", label: "Recharge", icon: CreditCard },
    { href: "/dashboard/user/history", label: "History", icon: History },
    { href: "/dashboard/settings/profile", label: "Profile", icon: CircleUserRound },
  ];

  const adminLinks = [
    { href: "/dashboard", label: "Admin", icon: LayoutDashboard },
    { href: "/dashboard/settings/recharge-history", label: "History", icon: History },
    { href: "/dashboard/settings/manage-user", label: "Users", icon: Users },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  const links = user?.role === "admin" ? adminLinks : userLinks;

  return (
    <div className="fixed bottom-0 left-0 z-40 w-full border-t bg-background/95 backdrop-blur-sm md:hidden">
      <nav className="grid h-16 grid-cols-4">
        {links.map((link) => {
          const isActive =
            link.href === "/dashboard/settings"
              ? pathname.startsWith(link.href)
              : pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 p-2 text-muted-foreground transition-colors hover:text-primary",
                isActive && "text-primary"
              )}
            >
              <link.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
