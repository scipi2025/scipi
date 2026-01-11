import { getServerSession } from "@/lib/auth-server";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

// Force dynamic rendering for admin routes (uses cookies)
export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if user is authenticated
  const session = await getServerSession();
  
  // If not authenticated, render children without sidebar (for login page)
  if (!session) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <AdminSidebar admin={session.admin} />
      <SidebarInset className="flex flex-col h-screen overflow-hidden">
        <div className="flex flex-1 flex-col overflow-hidden">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

