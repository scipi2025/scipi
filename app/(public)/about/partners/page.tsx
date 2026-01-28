import { prisma } from "@/lib/db";
import type { Metadata } from "next";
import { PartnersPageClient } from "./PartnersPageClient";

// Force dynamic rendering to avoid database calls during build
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Parteneri | Partners",
  description:
    "Activitățile Societății pentru Cercetare și Inovare în Patologii Infecțioase sunt realizate în permanentă colaborare cu partenerii instituționali și alte societăți profesionale din România și din străinătate. | SRIID activities are carried out in collaboration with institutional partners.",
};

async function getPartners() {
  const partners = await prisma.partner.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
    select: {
      id: true,
      name: true,
      nameEn: true,
      description: true,
      descriptionEn: true,
      logoUrl: true,
      type: true,
      websiteUrl: true,
    }
  });

  return partners;
}

export default async function PartnersPage() {
  const partners = await getPartners();
  return <PartnersPageClient partners={partners} />;
}
