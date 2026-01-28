import { prisma } from "@/lib/db";
import type { Metadata } from "next";
import { ResourcesPageClient } from "./ResourcesPageClient";

// Force dynamic rendering to avoid database calls during build
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Resurse | Resources",
  description:
    "Resurse educaționale SCIPI: ghiduri, articole și documente pentru dezvoltarea profesională în domeniul patologiilor infecțioase. | Educational resources from SRIID.",
};

async function getResources() {
  const resources = await prisma.resource.findMany({
    where: { isActive: true },
    include: {
      files: {
        select: {
          id: true,
          fileName: true,
          fileUrl: true,
        }
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return resources;
}

export default async function ResourcesPage() {
  const resources = await getResources();
  return <ResourcesPageClient resources={resources} />;
}
