import { prisma } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Beaker, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

// Force dynamic rendering to avoid database calls during build
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Proiecte",
  description:
    "Societatea pentru Cercetare și Inovare în Patologii Infecțioase desfășoară o serie de proiecte de cercetare clinică și fundamentală, dezvoltate în colaborare cu parteneri instituționali naționali și internaționali.",
};

async function getProjects() {
  const projects = await prisma.project.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
  });

  return projects;
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-12">
      {/* Header Section */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Proiecte</h1>
        <div className="h-1 w-20 bg-primary rounded-full" />
      </div>

      {/* Introduction */}
      <Card className="border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-transparent">
        <CardContent className="pt-6 pb-6">
          <div className="flex gap-4">
            <div className="hidden sm:flex size-12 items-center justify-center rounded-xl bg-primary/10 shrink-0">
              <Users className="size-6 text-primary" />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-primary">Cercetare și inovație</h3>
              <p className="text-base leading-relaxed text-muted-foreground">
                <strong className="text-foreground">Societatea pentru Cercetare și Inovare în Patologii Infecțioase</strong> desfășoară proiecte de cercetare clinică și fundamentală, dezvoltate în colaborare cu parteneri instituționali naționali și internaționali. Aceste inițiative urmăresc generarea de date relevante pentru îmbunătățirea practicii clinice și promovarea inovației în domeniul bolilor infecțioase.
              </p>
              <p className="text-base leading-relaxed text-muted-foreground">
                Coordonarea proiectelor este asigurată de membrii societății, însă participarea este deschisă tuturor celor interesați. Sunt invitați să se alăture activităților de cercetare, în special, studenții la medicină, studenții doctoranzi și medicii tineri.
              </p>
              <p className="text-base leading-relaxed text-muted-foreground">
                Implicarea în proiectele SCIPI oferă acces la activități științifice structurate, resurse de cercetare și oportunități de colaborare multidisciplinară, la nivel național și internațional.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects List */}
      {projects.length > 0 ? (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
              <Beaker className="size-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Proiectele noastre</h2>
              <div className="h-1 w-16 bg-primary rounded-full mt-1" />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-all group relative">
                {project.status && (
                  <div className="absolute top-4 right-4">
                    <Badge className={project.status === "ongoing" ? "bg-blue-500 hover:bg-blue-600" : "bg-green-600 hover:bg-green-700"}>
                      {project.status === "ongoing" ? "În curs" : "Finalizat"}
                    </Badge>
                  </div>
                )}
                <CardHeader className="pr-24">
                  <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </CardTitle>
                  {project.shortDescription && (
                    <CardDescription className="line-clamp-3 mt-2">
                      {project.shortDescription}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full" variant="outline">
                    <Link href={`/projects/${project.slug}`}>
                      Detalii proiect
                      <ArrowRight className="ml-2 size-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12 text-muted-foreground">
              <Beaker className="size-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Nu există proiecte disponibile momentan.</p>
              <p className="text-sm mt-2">Reveniți în curând pentru actualizări.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Call to Action */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold">Interesat de participare?</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Dacă sunteți interesat să participați la proiectele SCIPI sau doriți să propuneți un proiect de cercetare, vă rugăm să ne contactați.
            </p>
            <Button asChild size="lg">
              <Link href="/contact">
                Contactează-ne
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
