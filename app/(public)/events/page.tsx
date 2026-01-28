import { prisma } from "@/lib/db";
import type { Metadata } from "next";
import { EventsPageClient } from "./EventsPageClient";

// Force dynamic rendering to avoid database calls during build
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Evenimente | Events",
  description:
    "Descoperă evenimentele organizate de Societatea pentru Cercetare și Inovare în Patologii Infecțioase: conferințe, întâlniri, workshop-uri și seminarii. | Discover events organized by SRIID.",
};

async function getEvents() {
  const events = await prisma.event.findMany({
    where: { isActive: true },
    orderBy: [
      { displayOrder: "asc" },
      { createdAt: "desc" },
    ],
    select: {
      id: true,
      title: true,
      titleEn: true,
      slug: true,
      type: true,
      shortDescription: true,
      shortDescriptionEn: true,
      imageUrl: true,
      eventDate: true,
      dateText: true,
      dateTextEn: true,
      location: true,
      locationEn: true,
    }
  });

  // Convert Date to string for client component
  return events.map(event => ({
    ...event,
    eventDate: event.eventDate?.toISOString() || null,
  }));
}

export default async function EventsPage() {
  const events = await getEvents();
  return <EventsPageClient events={events} />;
}
