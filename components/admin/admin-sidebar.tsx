"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Calendar,
  BookOpen,
  Mail,
  LogOut,
  Home,
  UserPlus,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";

interface AdminSidebarProps {
  admin: {
    id: string;
    email: string;
    name: string;
  };
}

const navigationItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Cereri Membri",
    href: "/admin/membership",
    icon: UserPlus,
  },
  {
    title: "Parteneri",
    href: "/admin/partners",
    icon: Users,
  },
  {
    title: "Proiecte",
    href: "/admin/projects",
    icon: FolderKanban,
  },
  {
    title: "Evenimente",
    href: "/admin/events",
    icon: Calendar,
  },
  {
    title: "Resurse",
    href: "/admin/resources",
    icon: BookOpen,
  },
  {
    title: "Mesaje Contact",
    href: "/admin/contact-submissions",
    icon: Mail,
  },
];

export function AdminSidebar({ admin }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <Sidebar collapsible="icon" className="bg-sidebar">
      <SidebarHeader className="bg-sidebar">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <Link href="/admin">
                <div className="flex aspect-square size-10 items-center justify-center rounded-lg overflow-hidden bg-white p-1">
                  <Image
                    src="/logo_no_bg.png"
                    alt="SCIPI Logo"
                    width={48}
                    height={48}
                    className="object-contain scale-125"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <Image
                    src="/logo_no_bg.png"
                    alt="SCIPI Logo"
                    width={140}
                    height={50}
                    className="h-10 w-auto object-contain"
                  />
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="bg-sidebar">
        <SidebarGroup>
          <SidebarGroupLabel className="bg-sidebar">Navigare</SidebarGroupLabel>
          <SidebarMenu>
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={item.title}
                    className="text-base h-10"
                  >
                    <Link href={item.href}>
                      <item.icon className="size-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-sidebar">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="h-10 text-base bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Link href="/">
                <Home className="size-5" />
                <span>Pagina Publică</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="h-10 text-base text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <LogOut className="size-5" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

