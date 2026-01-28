import { prisma } from "@/lib/db";
import type { Metadata } from "next";
import { NewsListPageClient } from "./NewsListPageClient";

// Force dynamic rendering to avoid database calls during build
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Noutăți | News",
  description: "Ultimele noutăți și anunțuri de la SCIPI - Societatea pentru Cercetare și Inovare în Patologii Infecțioase | Latest news and announcements from SRIID",
};

async function getAllNews() {
  const news = await prisma.news.findMany({
    where: { isActive: true },
    orderBy: { publishedAt: "desc" },
    select: {
      id: true,
      title: true,
      titleEn: true,
      excerpt: true,
      excerptEn: true,
      linkType: true,
      linkUrl: true,
      publishedAt: true,
      event: { select: { id: true, slug: true, title: true } },
      project: { select: { id: true, slug: true, title: true } },
      resource: { select: { id: true, slug: true, title: true } },
    },
  });

  return news.map(item => ({
    ...item,
    publishedAt: item.publishedAt.toISOString(),
  }));
}

export default async function NewsListPage() {
  const news = await getAllNews();
  return <NewsListPageClient news={news} />;
}
