"use client";

/* eslint-disable @next/next/no-img-element */
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Building2, Globe, HandshakeIcon, LucideIcon, Users } from "lucide-react";
import { useLanguage, getLocalizedContent } from "@/lib/language-context";

interface Partner {
  id: string;
  name: string;
  nameEn?: string | null;
  description?: string | null;
  descriptionEn?: string | null;
  logoUrl?: string | null;
  type: string;
  websiteUrl?: string | null;
}

interface PartnersPageClientProps {
  partners: Partner[];
}

export function PartnersPageClient({ partners }: PartnersPageClientProps) {
  const { language, t } = useLanguage();

  const institutional = partners.filter((p) => p.type === "institutional");
  const international = partners.filter((p) => p.type === "international");
  const sponsors = partners.filter((p) => p.type === "sponsor");

  const PartnerSection = ({
    title,
    icon: Icon,
    partnersList,
  }: {
    title: string;
    icon: LucideIcon;
    partnersList: Partner[];
  }) => {
    if (partnersList.length === 0) return null;

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
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {partnersList.map((partner) => {
            const name = getLocalizedContent(partner, "name", language);
            const description = getLocalizedContent(partner, "description", language);
            
            return (
              <Card key={partner.id} className="hover:shadow-lg transition-shadow group">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    {partner.logoUrl && (
                      <div className="h-16 w-full flex items-center justify-center">
                        <img
                          src={partner.logoUrl}
                          alt={name}
                          className="max-h-full max-w-[70%] object-contain group-hover:scale-105 transition-transform"
                        />
                      </div>
                    )}
                    
                    <h3 className="font-bold text-lg">{name}</h3>
                    
                    {description && (
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                        {description}
                      </p>
                    )}
                    
                    {partner.websiteUrl && (
                      <a
                        href={partner.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline transition-colors"
                      >
                        <ExternalLink className="size-4" />
                        {language === "en" ? "Visit Website" : "Vizitează Website"}
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">{t("partners.title")}</h1>
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
              <h3 className="text-xl font-semibold text-primary">{t("partners.collaborations")}</h3>
              <p className="text-base leading-relaxed text-muted-foreground">
                {t("partners.collaborationsText")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Partner Sections */}
      <PartnerSection
        title={t("partners.national")}
        icon={Building2}
        partnersList={institutional}
      />

      <PartnerSection
        title={t("partners.international")}
        icon={Globe}
        partnersList={international}
      />

      <PartnerSection
        title={t("partners.sponsors")}
        icon={HandshakeIcon}
        partnersList={sponsors}
      />

      {/* Contact Card */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-3">
            <h3 className="text-xl font-bold">{t("partners.becomePartner")}</h3>
            <p className="text-muted-foreground">
              {t("partners.becomePartnerText")}
            </p>
            <p className="text-muted-foreground">
              {t("partners.contactForPartnership")}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
