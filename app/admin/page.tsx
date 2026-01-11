import { getCurrentAdmin } from "@/lib/auth-server";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FolderKanban, Calendar, BookOpen, Mail, UserPlus } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";

async function getDashboardStats() {
  const [
    partnersCount,
    projectsCount,
    eventsCount,
    resourcesCount,
    contactSubmissionsCount,
    membershipApplicationsCount,
  ] = await Promise.all([
    prisma.partner.count(),
    prisma.project.count(),
    prisma.event.count(),
    prisma.resource.count(),
    prisma.contactSubmission.count({ where: { isRead: false } }),
    prisma.membershipApplication.count({ where: { status: 'pending' } }),
  ]);

  return {
    partnersCount,
    projectsCount,
    eventsCount,
    resourcesCount,
    contactSubmissionsCount,
    membershipApplicationsCount,
  };
}

export default async function AdminDashboardPage() {
  const admin = await getCurrentAdmin();
  const stats = await getDashboardStats();

  const statsCards = [
    {
      title: "Cereri Membri",
      value: stats.membershipApplicationsCount,
      description: "Cereri de membru în așteptare",
      icon: UserPlus,
      href: "/admin/membership",
      highlight: stats.membershipApplicationsCount > 0,
    },
    {
      title: "Parteneri",
      value: stats.partnersCount,
      description: "Total parteneri înregistrați",
      icon: Users,
      href: "/admin/partners",
    },
    {
      title: "Proiecte",
      value: stats.projectsCount,
      description: "Total proiecte active și finalizate",
      icon: FolderKanban,
      href: "/admin/projects",
    },
    {
      title: "Evenimente",
      value: stats.eventsCount,
      description: "Evenimente viitoare și trecute",
      icon: Calendar,
      href: "/admin/events",
    },
    {
      title: "Resurse",
      value: stats.resourcesCount,
      description: "Ghiduri și articole disponibile",
      icon: BookOpen,
      href: "/admin/resources",
    },
    {
      title: "Mesaje Necitite",
      value: stats.contactSubmissionsCount,
      description: "Mesaje de contact necitite",
      icon: Mail,
      href: "/admin/contact-submissions",
    },
  ];

  return (
    <>
      <AdminHeader title="Dashboard" />

      <div className="flex-1 overflow-auto p-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">
            Bine ai revenit, {admin.name}!
          </h2>
          <p className="text-muted-foreground mt-2">
            Aici este o prezentare generală a activității din platforma SCIPI.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {statsCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Acțiuni Rapide</CardTitle>
              <CardDescription>
                Acțiuni frecvente pentru gestionarea conținutului
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <a
                  href="/admin/partners"
                  className="flex items-center gap-3 rounded-lg border p-4 hover:bg-accent transition-colors"
                >
                  <Users className="size-5 text-primary" />
                  <div>
                    <div className="font-medium">Gestionează Parteneri</div>
                    <div className="text-xs text-muted-foreground">
                      Adaugă sau editează parteneri
                    </div>
                  </div>
                </a>
                <a
                  href="/admin/projects"
                  className="flex items-center gap-3 rounded-lg border p-4 hover:bg-accent transition-colors"
                >
                  <FolderKanban className="size-5 text-primary" />
                  <div>
                    <div className="font-medium">Gestionează Proiecte</div>
                    <div className="text-xs text-muted-foreground">
                      Adaugă sau editează proiecte
                    </div>
                  </div>
                </a>
                <a
                  href="/admin/events"
                  className="flex items-center gap-3 rounded-lg border p-4 hover:bg-accent transition-colors"
                >
                  <Calendar className="size-5 text-primary" />
                  <div>
                    <div className="font-medium">Gestionează Evenimente</div>
                    <div className="text-xs text-muted-foreground">
                      Adaugă sau editează evenimente
                    </div>
                  </div>
                </a>
                <a
                  href="/admin/resources"
                  className="flex items-center gap-3 rounded-lg border p-4 hover:bg-accent transition-colors"
                >
                  <BookOpen className="size-5 text-primary" />
                  <div>
                    <div className="font-medium">Gestionează Resurse</div>
                    <div className="text-xs text-muted-foreground">
                      Adaugă sau editează resurse
                    </div>
                  </div>
                </a>
                <a
                  href="/admin/contact-submissions"
                  className="flex items-center gap-3 rounded-lg border p-4 hover:bg-accent transition-colors"
                >
                  <Mail className="size-5 text-primary" />
                  <div>
                    <div className="font-medium">Vezi Mesaje</div>
                    <div className="text-xs text-muted-foreground">
                      Verifică mesajele de contact
                    </div>
                  </div>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

