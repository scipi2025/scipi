import { prisma } from "@/lib/db";
import { EventDetailPageClient } from "./EventDetailPageClient";
import { notFound } from "next/navigation";

// Force dynamic rendering to avoid database calls during build
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
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
      title: "Eveniment Negăsit | Event Not Found",
    };
  }

  return {
    title: `${event.title} | ${event.titleEn || event.title}`,
    description: event.shortDescription || "Detalii despre evenimentul SCIPI",
  };
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
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

  return <EventDetailPageClient event={event} />;
}
