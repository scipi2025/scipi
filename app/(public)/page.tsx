import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PartnerCarousel } from "@/components/PartnerCarousel";
import { prisma } from "@/lib/db";  
import type { Metadata } from "next";
import { ImageCarousel } from "@/components/ImageCarousel";
import { ActivitySection } from "@/components/ActivitySection";
import { NewsSection } from "@/components/NewsSection";

// Force dynamic rendering to avoid database calls during build
export const dynamic = 'force-dynamic';

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
  const { partners, carouselImages, news } = await getHomePageData();

  return (
    <div className="flex flex-col ">
      {/* Hero Section */}
      <section className="relative bg-linear-to-b from-primary/10 to-background py-20 md:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center text-center space-y-6">
            {/* <Badge variant="outline" className="px-4 py-1 bg-background/80 text-primary font-semibold backdrop-blur-sm">
              Societatea pentru Cercetare și Inovare în Patologii Infecțioase
            </Badge>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              SCIPI
            </h1> */}
            <Image
              src="/logo_no_bg.png"
              alt="SCIPI Logo"
              width={450}
              height={100}
              className="mb-10 -mt-10 w-[300px] md:w-[400px] logo-animate cursor-pointer"
            />
            <p className="max-w-[900px] text-lg text-muted-foreground md:text-xl leading-relaxed">
              Dezvoltare, inovare, cercetare, boli infecțioase
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button
                size="lg"
                asChild
                className="md:text-base text-sm md:h-11 h-10"
              >
                <Link href="/about/mission">
                  Despre noi
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Preview with Image */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <Badge>Despre noi</Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Misiunea noastră
              </h2>
              <p className="text-muted-foreground md:text-lg leading-relaxed">
                Societatea pentru Cercetare și Inovare în Patologii Infecțioase
                este o organizație profesională non-profit dedicată progresului
                științific în domeniul bolilor infecțioase. Activitatea
                Societății vizează sprijinirea cercetării medicale, facilitarea
                colaborării interdisciplinare și promovarea celor mai bune
                practici clinice.
              </p>
              <Button asChild>
                <Link href="/about/mission">
                  Citește mai mult
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
            <div className="relative h-[300px] sm:h-[400px] md:h-[500px] w-full rounded-lg overflow-hidden shadow-xl">
              <ImageCarousel images={carouselImages} />
            </div>
          </div>
        </div>
      </section>

      {/* News Section - Show only if there are news items */}
      {news.length > 0 && <NewsSection news={news} />}

      {/* Activity Section - Interactive cards for Events, Projects, Resources */}
      <ActivitySection />

      {/* Partners Carousel - show only if more than 2 partners */}
      {/* {partners.length > 4 && <PartnerCarousel partners={partners} />} */}

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className=" px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-6 rounded-lg bg-primary/10 p-8 md:p-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Ești interesat de evenimentele SCIPI?
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-lg leading-relaxed">
              Dacă vrei să organizezi un eveniment în parteneriat cu SCIPI sau
              ai întrebări legate de un eveniment, te rugăm să ne contactezi.
            </p>
           
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg" asChild>
                <Link href="/events">Vezi evenimentele</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Contactează-ne</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
