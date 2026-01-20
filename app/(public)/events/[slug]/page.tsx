import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowLeft, FileText, Download } from "lucide-react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// Force dynamic rendering to avoid database calls during build
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Try to find by slug first, then by id (for legacy entries without slug)
  const event = await prisma.event.findFirst({
    where: {
      OR: [
        { slug: slug },
        { id: slug }
      ]
    },
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

// Helper function to get background color class
const getSectionBackgroundClass = (backgroundColor: string | null) => {
  const backgrounds: Record<string, string> = {
    white: "bg-white",
    muted: "bg-muted",
    primary: "bg-primary/5 border-primary/20",
    yellow: "bg-yellow-50 border-yellow-200",
    green: "bg-green-50 border-green-200",
    blue: "bg-blue-50 border-blue-200",
    purple: "bg-purple-50 border-purple-200",
    orange: "bg-orange-50 border-orange-200",
  };
  return backgrounds[backgroundColor || "white"] || "bg-white";
};

// Helper function to format file size
const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Try to find by slug first, then by id (for legacy entries without slug)
  const event = await prisma.event.findFirst({
    where: {
      OR: [
        { slug: slug },
        { id: slug }
      ]
    },
    include: {
      sections: {
        orderBy: { displayOrder: 'asc' },
        include: { files: true },
      },
    },
  });

  if (!event) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-8">
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

      {/* Event Sections */}
      {event.sections && event.sections.length > 0 && (
        <>
          {/* Single section - render as body without card */}
          {event.sections.length === 1 ? (
            <div className="space-y-6">
              {/* Optional title */}
              {event.sections[0].title && (
                <div>
                  <h2 className="text-2xl font-semibold">{event.sections[0].title}</h2>
                  <div className="h-1 w-16 bg-primary rounded-full mt-2" />
                </div>
              )}
              
              {/* Content */}
              {event.sections[0].content && (
                <div
                  className="prose prose-lg max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:leading-relaxed prose-ul:list-disc prose-ol:list-decimal prose-li:my-1"
                  dangerouslySetInnerHTML={{ __html: event.sections[0].content }}
                />
              )}

              {/* Files */}
              {event.sections[0].files && event.sections[0].files.length > 0 && (
                <div className={event.sections[0].content ? "pt-4 border-t" : ""}>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-3">
                    Documente atașate
                  </h4>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {event.sections[0].files.map((file) => (
                      <a
                        key={file.id}
                        href={file.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg border bg-background hover:bg-muted transition-colors group"
                      >
                        <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FileText className="size-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                            {file.fileName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(file.fileSize)}
                          </p>
                        </div>
                        <Download className="size-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Multiple sections - render in cards */
            <div className="space-y-6">
              {event.sections.map((section) => (
                <Card 
                  key={section.id} 
                  className={getSectionBackgroundClass(section.backgroundColor)}
                >
                  {section.title && (
                    <CardHeader className="pb-2">
                      <CardTitle className="text-2xl font-semibold">
                        {section.title}
                      </CardTitle>
                      <div className="h-1 w-16 bg-primary rounded-full mt-2" />
                    </CardHeader>
                  )}
                  <CardContent className={section.title ? "pt-4" : "pt-6"}>
                    {/* Section Content */}
                    {section.content && (
                      <div
                        className="prose prose-lg max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:leading-relaxed prose-ul:list-disc prose-ol:list-decimal prose-li:my-1"
                        dangerouslySetInnerHTML={{ __html: section.content }}
                      />
                    )}

                    {/* Section Files */}
                    {section.files && section.files.length > 0 && (
                      <div className={section.content ? "mt-6 pt-4 border-t" : ""}>
                        <h4 className="text-sm font-semibold text-muted-foreground mb-3">
                          Documente atașate
                        </h4>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {section.files.map((file) => (
                            <a
                              key={file.id}
                              href={file.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 p-3 rounded-lg border bg-background hover:bg-muted transition-colors group"
                            >
                              <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <FileText className="size-5 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                                  {file.fileName}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {formatFileSize(file.fileSize)}
                                </p>
                              </div>
                              <Download className="size-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
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
