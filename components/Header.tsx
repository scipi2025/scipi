"use client";

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";

export function Header() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  
  return (
    <>
      {/* Fixed header bar - full width on mobile, positioned right of sidebar on desktop */}
      <header 
        className={`fixed top-0 right-0 z-40 h-14 bg-white/95 backdrop-blur-sm border-b shadow-sm flex items-center px-4 transition-all duration-200 left-0 ${
          isCollapsed ? 'md:left-12' : 'md:left-64'
        }`}
      >
        <SidebarTrigger className="h-9 w-9 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md rounded-md transition-all" />
        
        {/* Spacer to push logo to right */}
        <div className="flex-1" />
        
        {/* Logo on right */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo_no_bg.png"
            alt="SCIPI Logo"
            width={120}
            height={40}
            className="object-contain"
          />
        </Link>
      </header>
      
      {/* Spacer to prevent content from going under the fixed header */}
      <div className="h-14" />
    </>
  );
}
