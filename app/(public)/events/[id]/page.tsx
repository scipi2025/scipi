import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await prisma.event.findUnique({
    where: { id },
  });

  if (!event) {
    return {
      title: "Eveniment Negăsit",
    };
  }

  return {
    title: event.title,
    description: event.shortDescription || "Detalii despre evenimentul SCIPI",
  };
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

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await prisma.event.findUnique({
    where: { id },
  });

  if (!event) {
    notFound();
  }

  return (
    <div className="container px-4 md:px-6 py-8 md:py-12 space-y-8">
      {/* Back Button */}
      <Button variant="ghost" asChild>
        <Link href="/events">
          <ArrowLeft className="mr-2 size-4" />
          Înapoi la Evenimente
        </Link>
      </Button>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <Badge className={getEventTypeBadgeColor(event.type)}>
            {getEventTypeLabel(event.type)}
          </Badge>
          {event.eventDate && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="size-4 mr-2" />
              {new Date(event.eventDate).toLocaleDateString("ro-RO", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          )}
        </div>

        <h1 className="text-4xl font-bold tracking-tight">{event.title}</h1>
        <div className="h-1 w-20 bg-primary rounded-full" />
      </div>

      {/* Image */}
      {event.imageUrl && (
        <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden">
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Short Description */}
      {event.shortDescription && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-lg leading-relaxed">{event.shortDescription}</p>
          </CardContent>
        </Card>
      )}

      {/* Detailed Description */}
      {event.detailedDescription && (
        <Card>
          <CardContent className="pt-6">
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: event.detailedDescription }}
            />
          </CardContent>
        </Card>
      )}

      {/* Call to Action */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold">Interesat de acest eveniment?</h3>
            <p className="text-muted-foreground">
              Pentru mai multe informații sau pentru a te înscrie, te rugăm să ne contactezi.
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
