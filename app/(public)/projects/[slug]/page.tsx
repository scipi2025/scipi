import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import Link from "next/link";

// Force dynamic rendering to avoid database calls during build
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({
    where: { slug },
  });

  if (!project) {
    return {
      title: "Proiect Negăsit",
    };
  }

  return {
    title: project.title,
    description: project.shortDescription || "Detalii despre proiectul de cercetare SCIPI",
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({
    where: { slug },
  });

  if (!project) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-8">
      {/* Back Button */}
      <Button variant="ghost" asChild>
        <Link href="/projects">
          <ArrowLeft className="mr-2 size-4" />
          Înapoi la Proiecte
        </Link>
      </Button>

      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">{project.title}</h1>
        <div className="h-1 w-20 bg-primary rounded-full" />
      </div>

      {/* Short Description */}
      {project.shortDescription && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-lg leading-relaxed">{project.shortDescription}</p>
          </CardContent>
        </Card>
      )}

      {/* Detailed Description */}
      {project.detailedDescription && (
        <Card>
          <CardContent className="pt-6">
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: project.detailedDescription }}
            />
          </CardContent>
        </Card>
      )}

      {/* Contact CTA */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold">Interesat de acest proiect?</h3>
            <p className="text-muted-foreground">
              Pentru mai multe informații sau pentru a participa la acest proiect, contactați-ne.
            </p>
            <Button asChild size="lg">
              <Link href="/contact">
                Contactează SCIPI
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
