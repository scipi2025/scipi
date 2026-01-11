import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, FolderKanban, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PartnerCarousel } from "@/components/PartnerCarousel";
import { prisma } from "@/lib/db";
import { format } from "date-fns";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acasă",
  description:
    "Societatea pentru Cercetare și Inovare în Patologii Infecțioase susține cercetarea clinică și fundamentală, dezvoltă proiecte interdisciplinare și sprijină formarea profesională în domeniul bolilor infecțioase.",
};

async function getHomePageData() {
  const [events, projects, resources, partners] = await Promise.all([
    prisma.event.findMany({
      where: { isActive: true, eventDate: { gte: new Date() } },
      orderBy: { eventDate: "asc" },
      take: 3,
    }),
    prisma.project.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.resource.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.partner.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
    }),
  ]);

  return { events, projects, resources, partners };
}

export default async function HomePage() {
  const { events, projects, resources, partners } = await getHomePageData();

  return (
    <div className="flex flex-col ">
      {/* Hero Section */}
      <section className="relative bg-linear-to-b from-primary/10 to-background py-20 md:py-32 overflow-hidden">
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center text-center space-y-6">
            {/* <Badge variant="outline" className="px-4 py-1 bg-background/80 text-primary font-semibold backdrop-blur-sm">
              Societatea pentru Cercetare și Inovare în Patologii Infecțioase
            </Badge>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              SCIPI
            </h1> */}
            <Image
              src="/logo_no_bg.png"
              alt="SCIPI Logo"
              width={450}
              height={100}
              className="mb-10 -mt-10 w-[300px] md:w-[400px]"
            />
            <p className="max-w-[900px] text-lg text-muted-foreground md:text-xl leading-relaxed">
              Dezvoltare, promovare, inovare, cercetare în domeniul bolilor
              infecțioase
            </p>
            <p className="max-w-[800px] text-base text-muted-foreground md:text-lg">
              Societatea susține cercetarea clinică și fundamentală, dezvoltă
              proiecte interdisciplinare și sprijină formarea profesională în
              domeniul bolilor infecțioase.
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button
                size="lg"
                asChild
                className="md:text-base text-sm md:h-11 h-10"
              >
                <Link href="/about/mission">
                  <span className="hidden sm:inline">
                    Descoperă Misiunea Noastră
                  </span>
                  <span className="sm:hidden">Misiunea Noastră</span>
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="md:text-base text-sm md:h-11 h-10"
              >
                <Link href="/about/members">Devino Membru</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Preview with Image */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <Badge>Despre Noi</Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Misiunea Noastră
              </h2>
              <p className="text-muted-foreground md:text-lg leading-relaxed">
                Societatea pentru Cercetare și Inovare în Patologii Infecțioase
                este o organizație profesională non-profit dedicată progresului
                științific în domeniul bolilor infecțioase. Activitatea
                Societății vizează sprijinirea cercetării medicale, facilitarea
                colaborării interdisciplinare și promovarea celor mai bune
                practici clinice, cu scopul de a îmbunătăți înțelegerea,
                diagnosticarea și tratamentul infecțiilor.
              </p>
              <p className="text-muted-foreground md:text-lg leading-relaxed">
                Scopul principal constă în promovarea, susținerea și dezvoltarea
                cercetării științifice în domeniul bolilor infecțioase și în
                domeniile conexe, prin crearea unui cadru care facilitează
                cooperarea între profesioniști din mediul medical, academic și
                tehnologic.
              </p>
              <Button asChild>
                <Link href="/about/mission">
                  Citește Mai Mult
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
            <div className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=2070"
                alt="Medical Laboratory Research"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      {events.length > 0 && (
        <section className="py-16 md:py-24 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Evenimente
                </h2>
                <p className="text-muted-foreground mt-2 max-w-[800px]">
                  Te invităm să iei parte la evenimentele Societății pentru
                  Cercetare și Inovare în Patologii Infecțioase prin care ne
                  dorim să diseminăm informații științifice validate și
                  actualizate din domeniul bolilor infecțioase și al
                  specialităților conexe.
                </p>
              </div>
              <Button variant="outline" asChild className="hidden md:flex">
                <Link href="/events">
                  Vezi Toate
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <Card
                  key={event.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Calendar className="size-4" />
                      {event.eventDate && format(new Date(event.eventDate), "dd MMMM yyyy, HH:mm")}
                    </div>
                    <CardTitle>{event.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {event.shortDescription}
                    </CardDescription>
                  </CardHeader>
                 
                </Card>
              ))}
            </div>
            <div className="mt-6 text-center md:hidden">
              <Button variant="outline" asChild>
                <Link href="/events">
                  Vezi Toate Evenimentele
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Latest Projects */}
      {projects.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Proiecte
                </h2>
                <p className="text-muted-foreground mt-2 max-w-[900px] leading-relaxed">
                  Societatea pentru Cercetare și Inovare în Patologii
                  Infecțioase desfășoară o serie de proiecte de cercetare
                  clinică și fundamentală, dezvoltate în colaborare cu parteneri
                  instituționali naționali și internaționali. Aceste proiecte
                  urmăresc generarea de date relevante, îmbunătățirea practicii
                  clinice și promovarea inovației în domeniul bolilor
                  infecțioase.
                </p>
                <p className="text-muted-foreground mt-2 max-w-[900px]">
                  Coordonarea proiectelor este realizată de membrii Societății,
                  însă participarea este deschisă și pentru toți cei interesați.
                </p>
              </div>
              <Button variant="outline" asChild className="hidden md:flex">
                <Link href="/projects">
                  Vezi Toate
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <FolderKanban className="size-4 text-muted-foreground" />
                      <Badge
                        variant={
                          project.status === "ongoing" ? "default" : "secondary"
                        }
                      >
                        {project.status === "ongoing" ? "În Curs" : "Finalizat"}
                      </Badge>
                    </div>
                    <CardTitle>{project.title}</CardTitle>
                    <CardDescription className="line-clamp-3">
                      {project.shortDescription}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
            <div className="mt-6 text-center md:hidden">
              <Button variant="outline" asChild>
                <Link href="/projects">
                  Vezi Toate Proiectele
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Latest Resources */}
      {resources.length > 0 && (
        <section className="py-16 md:py-24 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Resurse
                </h2>
                <p className="text-muted-foreground mt-2 max-w-[800px]">
                  Ghiduri clinice, articole științifice și materiale
                  educaționale pentru dezvoltarea profesională în domeniul
                  bolilor infecțioase
                </p>
              </div>
              <Button variant="outline" asChild className="hidden md:flex">
                <Link href="/resources">
                  Vezi Toate
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {resources.map((resource) => (
                <Card
                  key={resource.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="size-4 text-muted-foreground" />
                      <Badge variant="outline">
                        {resource.type === "guide"
                          ? "Ghid"
                          : resource.type === "article"
                          ? "Articol"
                          : "Document"}
                      </Badge>
                    </div>
                    <CardTitle>{resource.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {resource.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="link" asChild className="p-0">
                      <a
                        href={resource.url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Accesează Resursa
                        <ArrowRight className="ml-2 size-4" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-6 text-center md:hidden">
              <Button variant="outline" asChild>
                <Link href="/resources">
                  Vezi Toate Resursele
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Partners Carousel - show only if more than 2 partners */}
      {partners.length > 2 && <PartnerCarousel partners={partners} />}

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-6 rounded-lg bg-primary/10 p-8 md:p-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Alătură-te Comunității SCIPI
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-lg leading-relaxed">
              Înscrierea în Societatea pentru Cercetare și Inovare în Patologii
              Infecțioase se face prin validarea cererii de aderare ca membru
              activ titular sau membru asociat de către Consiliul Director și
              plata anuală a taxei de membru, în valoare de 500 lei pentru
              membrii activi și 200 lei pentru membrii asociați.
            </p>
            <p className="text-muted-foreground">
              Descarcă și completează cererea de înscriere și trimite-o pe
              adresa de e-mail <strong>secretariat.scipi@gmail.com</strong>
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg" asChild>
                <Link href="/about/members">Devino Membru</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Contactează-ne</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
