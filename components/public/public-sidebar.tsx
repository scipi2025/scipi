"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Home,
  Users,
  FolderKanban,
  Calendar,
  BookOpen,
  Mail,
  Target,
  UserPlus,
  Handshake,
  ChevronRight,
  SquareMenu,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const navigationItems = [
  {
    title: "Acasă",
    href: "/",
    icon: Home,
  },
  {
    title: "Despre",
    icon: SquareMenu,
    items: [
      {
        title: "Misiune",
        href: "/about/mission",
        icon: Target,
      },
      {
        title: "Membri",
        href: "/about/members",
        icon: UserPlus,
      },
      {
        title: "Parteneri",
        href: "/about/partners",
        icon: Handshake,
      },
    ],
  },
  {
    title: "Proiecte",
    href: "/projects",
    icon: FolderKanban,
  },
  {
    title: "Evenimente",
    href: "/events",
    icon: Calendar,
  },
  {
    title: "Resurse",
    href: "/resources",
    icon: BookOpen,
  },
  {
    title: "Contact",
    href: "/contact",
    icon: Mail,
  },
];

export function PublicSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { setOpenMobile, isMobile, setOpen } = useSidebar();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Close sidebar when navigating
  const closeSidebar = () => {
    if (isMobile) {
      setOpenMobile(false);
    } else {
      setOpen(false);
    }
  };

  useEffect(() => {
    // Check if user is logged in as admin
    const checkAdminSession = async () => {
      try {
        const response = await fetch("/api/auth/session");
        if (response.ok) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminSession();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      setIsAdmin(false);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <Sidebar collapsible="icon" className="border-r bg-sidebar">
      {/* <SidebarHeader className="bg-sidebar p-0 m-0">
        <Link href="/">
          <Image
            src="/logo_no_bg.png"
            alt="SCIPI Logo"
            width={200}
            height={30}
            className="object-contain scale-125 -mt-4 -mb-6"
          />
        </Link>
      </SidebarHeader> */}

      <SidebarContent className="bg-sidebar ">
        <SidebarGroup>
          {/* <SidebarGroupLabel className="bg-sidebar md:text-sm text-xs">Navigare</SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                if (item.items) {
                  // Group with subitems - collapsible
                  return (
                    <SidebarMenuItem key={item.title}>
                      <Collapsible
                        defaultOpen={false}
                        className="group/collapsible"
                      >
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            tooltip={item.title}
                            className="md:h-11 h-9 md:text-base text-sm"
                          >
                            <item.icon className="md:size-6 size-5" />
                            <span>{item.title}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 md:size-4 size-3" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items.map((subitem) => {
                              const isActive = pathname === subitem.href;
                              return (
                                <SidebarMenuSubItem key={subitem.href}>
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={isActive}
                                    className="md:h-10 h-8 md:text-base text-sm"
                                  >
                                    <Link href={subitem.href} onClick={closeSidebar}>
                                      <span>{subitem.title}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              );
                            })}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </Collapsible>
                    </SidebarMenuItem>
                  );
                } else {
                  // Single item
                  const isActive = pathname === item.href;
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                        className="md:h-10 h-9 md:text-base text-sm"
                      >
                        <Link href={item.href} onClick={closeSidebar}>
                          <item.icon className="md:size-5 size-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }
              })}

              {/* Show Admin button in menu if logged in */}
              {!isLoading && isAdmin && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    tooltip="Admin"
                    className="md:h-10 h-9 md:text-base text-sm bg-red-500 hover:bg-red-600 text-white"
                  >
                    <Link href="/admin" onClick={closeSidebar}>
                      <ShieldCheck className="md:size-5 size-4" />
                      <span>Admin</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-sidebar">
        <SidebarMenu>
          {!isLoading && isAdmin ? (
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleLogout}
                className="md:h-10 h-9 md:text-base text-sm text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <LogOut className="md:size-5 size-4" />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ) : null}
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
