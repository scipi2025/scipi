import { prisma } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, Beaker } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

// Force dynamic rendering to avoid database calls during build
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Evenimente",
  description:
    "Descoperă evenimentele organizate de Societatea pentru Cercetare și Inovare în Patologii Infecțioase: conferințe, întâlniri, workshop-uri și seminarii.",
};

async function getEvents() {
  const events = await prisma.event.findMany({
    where: { isActive: true },
    orderBy: [
      { displayOrder: "asc" },
      { createdAt: "desc" },
    ],
  });

  return events;
}

const getEventTypeLabel = (type: string | null) => {
  const types: Record<string, string> = {
    conference: "Conferință",
    meeting: "Întâlnire",
    workshop: "Workshop",
    seminar: "Seminar",
    other: "Altele",
  };
  return types[type || "other"] || "Altele";
};

const getEventTypeBadgeColor = (type: string | null) => {
  const colors: Record<string, string> = {
    conference: "bg-blue-500",
    meeting: "bg-green-500",
    workshop: "bg-purple-500",
    seminar: "bg-orange-500",
    other: "bg-gray-500",
  };
  return colors[type || "other"] || "bg-gray-500";
};

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-12">
      {/* Header Section */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Evenimente</h1>
        <div className="h-1 w-20 bg-primary rounded-full" />
      </div>

      {/* Introduction */}
      <Card className="border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-transparent">
        <CardContent className="pt-6 pb-6">
          <div className="flex gap-4">
            <div className="hidden sm:flex size-12 items-center justify-center rounded-xl bg-primary/10 shrink-0">
              <Calendar className="size-6 text-primary" />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-primary">Evenimente științifice</h3>
              <p className="text-base leading-relaxed text-muted-foreground">
                <strong className="text-foreground">Societatea pentru Cercetare și Inovare în Patologii Infecțioase</strong> organizează și participă în calitate de partener la diverse evenimente științifice: congrese și conferințe naționale sau internaționale, simpozioane, workshop-uri sau seminarii.
              </p>
              <p className="text-base leading-relaxed text-muted-foreground">
                Aceste evenimente oferă oportunități de networking, schimb de experiență și diseminare a rezultatelor cercetării în domeniul bolilor infecțioase și a specialităților conexe.
              </p>
              <p className="text-base leading-relaxed text-muted-foreground">
                Află mai jos care sunt evenimentele noastre și cum poți participa la acestea.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events List */}
      {events.length > 0 ? (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
              <Beaker className="size-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Evenimentele Noastre</h2>
              <div className="h-1 w-16 bg-primary rounded-full mt-1" />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-all group overflow-hidden border-2">
                {event.imageUrl && (
                  <div className="relative w-full h-48 overflow-hidden">
                    <Image
                      src={event.imageUrl}
                      alt={event.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <Badge className={`${getEventTypeBadgeColor(event.type)} text-sm font-medium px-3 py-1`}>
                      {getEventTypeLabel(event.type)}
                    </Badge>
                    {(event.dateText || event.eventDate) && (
                      <div className="flex items-center text-sm font-medium text-foreground bg-muted px-2 py-1 rounded">
                        <Calendar className="size-4 mr-1.5" />
                        {event.dateText || (event.eventDate && new Date(event.eventDate).toLocaleDateString("ro-RO", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }))}
                      </div>
                    )}
                  </div>
                  <CardTitle className="text-xl line-clamp-2 group-hover:text-primary transition-colors">
                    {event.title}
                  </CardTitle>
                  {event.shortDescription && (
                    <CardDescription className="line-clamp-3 mt-2 text-base">
                      {event.shortDescription}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full" variant="outline">
                    <Link href={`/events/${event.slug || event.id}`}>
                      Detalii Eveniment
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
              <p className="text-lg">Nu există evenimente disponibile momentan.</p>
              <p className="text-sm mt-2">Reveniți în curând pentru actualizări.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Call to Action */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold">Ești interesat de evenimentele SCIPI?</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Dacă vrei să organizezi un eveniment în parteneriat cu SCIPI sau ai întrebări legate de un eveniment te rugăm să ne contactezi.
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
