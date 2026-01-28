import { prisma } from "@/lib/db";
import type { Metadata } from "next";
import { HomePageClient } from "@/components/HomePageClient";

// Force dynamic rendering to avoid database calls during build
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Acasă",
  description:
    "Societatea pentru Cercetare și Inovare în Patologii Infecțioase susține cercetarea clinică și fundamentală, dezvoltă proiecte interdisciplinare și sprijină formarea profesională în domeniul bolilor infecțioase.",
};

async function getHomePageData() {
  const [partners, carouselImages, news] = await Promise.all([
    prisma.partner.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
    }),
    prisma.carouselImage.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
    }),
    prisma.news.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
      take: 5,
      include: {
        event: { select: { id: true, slug: true, title: true } },
        project: { select: { id: true, slug: true, title: true } },
        resource: { select: { id: true, slug: true, title: true } },
      },
    }),
  ]);

  return { partners, carouselImages, news };
}

export default async function HomePage() {
  const { carouselImages, news } = await getHomePageData();

  return <HomePageClient carouselImages={carouselImages} news={news} />;
}
