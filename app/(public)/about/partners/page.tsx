/* eslint-disable react-hooks/static-components */
/* eslint-disable @next/next/no-img-element */
import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Building2, Globe, HandshakeIcon, LucideIcon, Users } from "lucide-react";
import type { Metadata } from "next";
import { Partner } from "@prisma/client";

// Force dynamic rendering to avoid database calls during build
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Parteneri",
  description:
    "Activitățile Societății pentru Cercetare și Inovare în Patologii Infecțioase sunt realizate în permanentă colaborare cu partenerii instituționali și alte societăți profesionale din România și din străinătate.",
};

async function getPartners() {
  const partners = await prisma.partner.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
  });

  const institutional = partners.filter((p) => p.type === "institutional");
  const international = partners.filter((p) => p.type === "international");
  const sponsors = partners.filter((p) => p.type === "sponsor");

  return { institutional, international, sponsors };
}

export default async function PartnersPage() {
  const { institutional, international, sponsors } = await getPartners();

  const PartnerSection = ({
    title,
    icon: Icon,
    partners,
  }: {
    title: string;
    icon: LucideIcon;
    partners: Partner[];
  }) => {
    // Don't render section if no partners
    if (partners.length === 0) return null;
    console.log("partners", partners);

    const showCarousel = partners.length > 5;

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="size-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
            <div className="h-1 w-16 bg-primary rounded-full mt-1" />
          </div>
        </div>
        
        {/* Partner Details Grid - Always show cards with all info */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {partners.map((partner) => (
            <Card key={partner.id} className="hover:shadow-lg transition-shadow group">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  {/* Logo - smaller and centered */}
                  {partner.logoUrl && (
                    <div className="h-16 w-full flex items-center justify-center">
                      <img
                        src={partner.logoUrl}
                        alt={partner.name}
                        className="max-h-full max-w-[70%] object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>
                  )}
                  
                  {/* Name */}
                  <h3 className="font-bold text-lg">{partner.name}</h3>
                  
                  {/* Description */}
                  {partner.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                      {partner.description}
                    </p>
                  )}
                  
                  {/* Website Link */}
                  {partner.websiteUrl && (
                    <a
                      href={partner.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline transition-colors"
                    >
                      <ExternalLink className="size-4" />
                      Vizitează Website
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Parteneri</h1>
        <div className="h-1 w-20 bg-primary rounded-full" />
      </div>

      {/* Introduction */}
      <Card className="border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-transparent">
        <CardContent className="pt-6 pb-6">
          <div className="flex gap-4">
            <div className="hidden sm:flex size-12 items-center justify-center rounded-xl bg-primary/10 shrink-0">
              <Users className="size-6 text-primary" />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-primary">Colaborări și parteneriate</h3>
              <p className="text-base leading-relaxed text-muted-foreground">
                <strong className="text-foreground">Societatea pentru Cercetare și Inovare în Patologii Infecțioase</strong> își desfășoară activitatea în strânsă colaborare cu parteneri instituționali, organizații academice și societăți profesionale din România și din străinătate, în cadrul unor inițiative comune de cercetare, educație medicală și dezvoltare profesională.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Partner Sections */}
      <PartnerSection
        title="Parteneri naționali"
        icon={Building2}
        partners={institutional}
      />

      <PartnerSection
        title="Parteneri internaționali"
        icon={Globe}
        partners={international}
      />

      <PartnerSection
        title="Sponsori"
        icon={HandshakeIcon}
        partners={sponsors}
      />

      {/* Contact Card */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-3">
            <h3 className="text-xl font-bold">Devino partener SCIPI</h3>
            <p className="text-muted-foreground">
              Construim parteneriate pentru cercetare, educație medicală și inovare în domeniul bolilor infecțioase.
            </p>
            <p className="text-muted-foreground">
              Contactează-ne la{" "}
              <a
                href="mailto:secretariat.scipi@gmail.com"
                className="font-medium text-primary hover:underline"
              >
                secretariat.scipi@gmail.com
              </a>
              {" "}pentru a explora oportunități de parteneriat.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

