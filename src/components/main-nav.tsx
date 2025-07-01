"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  User,
  ChevronRight,
  CircleUserRound,
  CreditCard,
  History,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";

const userLinks = [
  { href: "/dashboard/user", label: "Dashboard", icon: User },
  { href: "/dashboard/user/recharge", label: "Recharge", icon: CreditCard },
  { href: "/dashboard/user/history", label: "History", icon: History },
  {
    href: "/dashboard/settings/profile",
    label: "Profile",
    icon: CircleUserRound,
  },
];

const adminLinks = [
  { href: "/dashboard", label: "Admin Dashboard", icon: LayoutDashboard },
];

const settingsLinks = {
  label: "Settings",
  icon: Settings,
  basePath: "/dashboard/settings",
  subLinks: [
    { href: "/dashboard/settings/operator", label: "Operator" },
    { href: "/dashboard/settings/notifications", label: "Notifications" },
  ],
};

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
          {settingsLinks.subLinks.length > 0 && (
            <Collapsible
              asChild
              defaultOpen={pathname.startsWith(settingsLinks.basePath)}
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    isActive={pathname.startsWith(settingsLinks.basePath)}
                    className="w-full justify-between"
                    tooltip={{ children: settingsLinks.label }}
                  >
                    <div className="flex items-center gap-2">
                      <settingsLinks.icon />
                      <span>{settingsLinks.label}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200 data-[state=open]:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub className="pl-4">
                    {settingsLinks.subLinks.map((subLink) => (
                      <SidebarMenuSubItem key={subLink.href}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={pathname === subLink.href}
                        >
                          <Link href={subLink.href}>{subLink.label}</Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          )}
        </SidebarMenu>
      </SidebarGroup>
    </>
  );
}
