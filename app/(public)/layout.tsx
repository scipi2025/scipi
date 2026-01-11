import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PublicSidebar } from "@/components/public/public-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full overflow-x-hidden">
        <PublicSidebar />
        <SidebarInset className="flex flex-col flex-1 min-w-0">
          <Header />
          <main className="flex-1 overflow-x-hidden">{children}</main>
          <Footer />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
