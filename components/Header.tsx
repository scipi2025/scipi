"use client";

import Image from "next/image";
import Link from "next/link";
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
  ChevronDown,
  SquareMenu,
  LogOut,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";
import { LanguageSelector } from "@/components/LanguageSelector";

// Navigation items with translation keys
const getNavigationItems = (t: (key: string) => string) => [
  {
    title: t("nav.home"),
    href: "/",
    icon: Home,
  },
  {
    title: t("nav.about"),
    icon: SquareMenu,
    items: [
      {
        title: t("nav.mission"),
        href: "/about/mission",
        icon: Target,
      },
      {
        title: t("nav.members"),
        href: "/about/members",
        icon: UserPlus,
      },
      {
        title: t("nav.partners"),
        href: "/about/partners",
        icon: Handshake,
      },
    ],
  },
  {
    title: t("nav.projects"),
    href: "/projects",
    icon: FolderKanban,
  },
  {
    title: t("nav.events"),
    href: "/events",
    icon: Calendar,
  },
  {
    title: t("nav.resources"),
    href: "/resources",
    icon: BookOpen,
  },
  {
    title: t("nav.contact"),
    href: "/contact",
    icon: Mail,
  },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navigationItems = getNavigationItems(t);

  useEffect(() => {
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

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Fixed header bar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/95 backdrop-blur-sm border-b shadow-sm">
        <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between">
          {/* Logo on left */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo_no_bg.png"
              alt="SCIPI Logo"
              width={120}
              height={40}
              className="object-contain logo-animate"
            />
          </Link>

          {/* Desktop Navigation - center */}
          <nav className="hidden md:flex items-center gap-1 pl-4">
            {navigationItems.map((item) => {
              if (item.items) {
                // Dropdown menu for items with subitems
                const isActive = item.items.some(
                  (subitem) => pathname === subitem.href
                );
                return (
                  <DropdownMenu key={item.title}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className={cn(
                          "flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors",
                          isActive
                            ? "text-primary bg-primary/10"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        )}
                      >
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                        <ChevronDown className="size-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="w-40">
                      {item.items.map((subitem) => (
                        <DropdownMenuItem key={subitem.href} asChild>
                          <Link
                            href={subitem.href}
                            className={cn(
                              "flex items-center gap-2 cursor-pointer",
                              pathname === subitem.href && "bg-primary/10 text-primary"
                            )}
                          >
                            <subitem.icon className="size-4" />
                            <span>{subitem.title}</span>
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              } else {
                // Single navigation item
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                  </Link>
                );
              }
            })}

            {/* Admin button if logged in */}
            {!isLoading && isAdmin && (
              <>
                <Link
                  href="/admin"
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md bg-red-500 hover:bg-red-600 text-white transition-colors"
                >
                  <ShieldCheck className="size-4" />
                  <span>{t("nav.admin")}</span>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="size-4" />
                  <span>{t("nav.logout")}</span>
                </Button>
              </>
            )}

            {/* Language Selector */}
            <div className="ml-2 border-l pl-2">
              <LanguageSelector variant="desktop" />
            </div>
          </nav>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="size-6" />
            ) : (
              <Menu className="size-6" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b shadow-lg">
            <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              {navigationItems.map((item) => {
                if (item.items) {
                  // Expandable section for mobile
                  const isActive = item.items.some(
                    (subitem) => pathname === subitem.href
                  );
                  return (
                    <div key={item.title} className="flex flex-col">
                      <div
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground"
                        )}
                      >
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </div>
                      <div className="ml-6 flex flex-col gap-1">
                        {item.items.map((subitem) => (
                          <Link
                            key={subitem.href}
                            href={subitem.href}
                            onClick={closeMobileMenu}
                            className={cn(
                              "flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors",
                              pathname === subitem.href
                                ? "text-primary bg-primary/10"
                                : "text-muted-foreground hover:text-foreground hover:bg-accent"
                            )}
                          >
                            <subitem.icon className="size-4" />
                            <span>{subitem.title}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                } else {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMobileMenu}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                        isActive
                          ? "text-primary bg-primary/10"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      )}
                    >
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  );
                }
              })}

              {/* Admin button if logged in - mobile */}
              {!isLoading && isAdmin && (
                <>
                  <Link
                    href="/admin"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md bg-red-500 hover:bg-red-600 text-white transition-colors"
                  >
                    <ShieldCheck className="size-4" />
                    <span>{t("nav.admin")}</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      closeMobileMenu();
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  >
                    <LogOut className="size-4" />
                    <span>{t("nav.logout")}</span>
                  </button>
                </>
              )}

              {/* Language Selector - Mobile */}
              <div className="mt-4 pt-4 border-t">
                <LanguageSelector variant="mobile" />
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Spacer to prevent content from going under the fixed header */}
      <div className="h-16" />
    </>
  );
}
