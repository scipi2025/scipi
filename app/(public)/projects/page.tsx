import { prisma } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Beaker } from "lucide-react";
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
    orderBy: { createdAt: "desc" },
  });

  return projects;
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="container px-4 md:px-6 py-8 md:py-12 space-y-12">
      {/* Header Section */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Proiecte</h1>
        <div className="h-1 w-20 bg-primary rounded-full" />
      </div>

      {/* Introduction */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <p className="text-lg leading-relaxed">
            <strong>Societatea pentru Cercetare și Inovare în Patologii Infecțioase</strong> desfășoară o serie de proiecte de cercetare clinică și fundamentală, dezvoltate în colaborare cu parteneri instituționali naționali și internaționali. Aceste proiecte urmăresc generarea de date relevante, îmbunătățirea practicii clinice și promovarea inovației în domeniul bolilor infecțioase.
          </p>
          <p className="text-lg leading-relaxed">
            Coordonarea proiectelor este realizată de membrii Societății, însă participarea este deschisă și pentru toți cei interesați. Studenții la medicină, medicii tineri și doctoranzii interesați de activitatea de cercetare în domeniul bolilor infecțioase sunt încurajați să se alăture inițiativelor în derulare sau viitoare.
          </p>
          <p className="text-lg leading-relaxed">
            Participarea în cadrul proiectelor oferă acces la activități științifice structurate, resurse de cercetare, și oportunități de colaborare multidisciplinară, naționale și internaționale.
          </p>
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
              <h2 className="text-2xl font-bold tracking-tight">Proiectele Noastre</h2>
              <div className="h-1 w-16 bg-primary rounded-full mt-1" />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-all group">
                <CardHeader>
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
                    <Link href={`/projects/${project.id}`}>
                      Detalii Proiect
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
            <h3 className="text-xl font-bold">Interesatde participare?</h3>
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
