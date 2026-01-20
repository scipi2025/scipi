import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { ro } from "date-fns/locale";

// Force dynamic rendering to avoid database calls during build
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const newsItem = await prisma.news.findUnique({
    where: { id },
  });

  if (!newsItem) {
    return {
      title: "Noutate Negăsită",
    };
  }

  return {
    title: newsItem.title,
    description: newsItem.excerpt || "Noutăți de la SCIPI",
  };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const newsItem = await prisma.news.findUnique({
    where: { id },
    include: {
      event: true,
      project: true,
      resource: true,
    },
  });

  if (!newsItem) {
    notFound();
  }

  // If this is not an internal news item, redirect to the appropriate page
  if (newsItem.linkType === "event" && newsItem.eventId) {
    redirect(`/events/${newsItem.eventId}`);
  }
  if (newsItem.linkType === "project" && newsItem.projectId) {
    redirect(`/projects/${newsItem.projectId}`);
  }
  if (newsItem.linkType === "resource" && newsItem.resourceId) {
    redirect(`/resources/${newsItem.resourceId}`);
  }
  if (newsItem.linkType === "external" && newsItem.linkUrl) {
    redirect(newsItem.linkUrl);
  }

  // For internal news items, show the content
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-8">
      {/* Back Button */}
      <Button variant="ghost" asChild>
        <Link href="/">
          <ArrowLeft className="mr-2 size-4" />
          Înapoi la Acasă
        </Link>
      </Button>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <Badge>Noutate</Badge>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="size-4 mr-2" />
            {format(new Date(newsItem.publishedAt), "d MMMM yyyy", { locale: ro })}
          </div>
        </div>

        <h1 className="text-4xl font-bold tracking-tight">{newsItem.title}</h1>
        <div className="h-1 w-20 bg-primary rounded-full" />
      </div>

      {/* Excerpt */}
      {newsItem.excerpt && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-lg leading-relaxed text-muted-foreground italic">
              {newsItem.excerpt}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Content */}
      {newsItem.content && (
        <Card>
          <CardContent className="pt-6">
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: newsItem.content }}
            />
          </CardContent>
        </Card>
      )}

      {/* If no content, show a message */}
      {!newsItem.content && !newsItem.excerpt && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Nu există conținut disponibil pentru această noutate.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Call to Action */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold">Ai întrebări?</h3>
            <p className="text-muted-foreground">
              Pentru mai multe informații, te rugăm să ne contactezi.
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
