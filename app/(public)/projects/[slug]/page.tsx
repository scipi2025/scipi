import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { ProjectDetailPageClient } from "./ProjectDetailPageClient";

// Force dynamic rendering to avoid database calls during build
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Try to find by slug first, then by id (for legacy entries without slug)
  const project = await prisma.project.findFirst({
    where: {
      OR: [
        { slug: slug },
        { id: slug }
      ]
    },
  });

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: project.title,
    description: project.shortDescription || "Research project details from SCIPI",
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Try to find by slug first, then by id (for legacy entries without slug)
  const project = await prisma.project.findFirst({
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

  if (!project) {
    notFound();
  }

  return <ProjectDetailPageClient project={project} />;
}
