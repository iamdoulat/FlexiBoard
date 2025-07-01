"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Settings, User } from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator,
} from "@/components/ui/sidebar";

const userLinks = [{ href: "/dashboard/user", label: "Dashboard", icon: User }];

const adminLinks = [
  { href: "/dashboard", label: "Admin Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>User Panel</SidebarGroupLabel>
        <SidebarMenu>
          {userLinks.map((link) => (
            <SidebarMenuItem key={link.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === link.href}
                tooltip={{ children: link.label }}
              >
                <Link href={link.href}>
                  <link.icon />
                  <span>{link.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
      <SidebarSeparator />
      <SidebarGroup>
        <SidebarGroupLabel>Admin Panel</SidebarGroupLabel>
        <SidebarMenu>
          {adminLinks.map((link) => (
            <SidebarMenuItem key={link.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === link.href}
                tooltip={{ children: link.label }}
              >
                <Link href={link.href}>
                  <link.icon />
                  <span>{link.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </>
  );
}
