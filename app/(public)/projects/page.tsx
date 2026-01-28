import { prisma } from "@/lib/db";
import type { Metadata } from "next";
import { ProjectsPageClient } from "./ProjectsPageClient";

// Force dynamic rendering to avoid database calls during build
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Proiecte | Projects",
  description:
    "Societatea pentru Cercetare și Inovare în Patologii Infecțioase desfășoară o serie de proiecte de cercetare clinică și fundamentală. | SRIID conducts clinical and basic research projects.",
};

async function getProjects() {
  const projects = await prisma.project.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
    select: {
      id: true,
      title: true,
      titleEn: true,
      slug: true,
      shortDescription: true,
      shortDescriptionEn: true,
      status: true,
    }
  });

  return projects;
}

export default async function ProjectsPage() {
  const projects = await getProjects();
  return <ProjectsPageClient projects={projects} />;
}
