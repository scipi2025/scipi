"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, Beaker } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage, getLocalizedContent } from "@/lib/language-context";

interface Event {
  id: string;
  title: string;
  titleEn?: string | null;
  slug?: string | null;
  type?: string | null;
  shortDescription?: string | null;
  shortDescriptionEn?: string | null;
  imageUrl?: string | null;
  eventDate?: string | null;
  dateText?: string | null;
  dateTextEn?: string | null;
  location?: string | null;
  locationEn?: string | null;
}

interface EventsPageClientProps {
  events: Event[];
}

export function EventsPageClient({ events }: EventsPageClientProps) {
  const { language, t } = useLanguage();

  const getEventTypeLabel = (type: string | null | undefined) => {
    const typesRo: Record<string, string> = {
      conference: "Conferință",
      meeting: "Întâlnire",
      workshop: "Workshop",
      seminar: "Seminar",
      other: "Altele",
    };
    const typesEn: Record<string, string> = {
      conference: "Conference",
      meeting: "Meeting",
      workshop: "Workshop",
      seminar: "Seminar",
      other: "Other",
    };
    const types = language === "en" ? typesEn : typesRo;
    return types[type || "other"] || (language === "en" ? "Other" : "Altele");
  };

  const getEventTypeBadgeColor = (type: string | null | undefined) => {
    const colors: Record<string, string> = {
      conference: "bg-blue-500",
      meeting: "bg-green-500",
      workshop: "bg-purple-500",
      seminar: "bg-orange-500",
      other: "bg-gray-500",
    };
    return colors[type || "other"] || "bg-gray-500";
  };

  const formatDate = (date: string | null | undefined) => {
    if (!date) return null;
    const locale = language === "en" ? "en-US" : "ro-RO";
    return new Date(date).toLocaleDateString(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-12">
      {/* Header Section */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">{t("events.title")}</h1>
        <div className="h-1 w-20 bg-primary rounded-full" />
      </div>

      {/* Introduction */}
      <Card className="border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-transparent">
        <CardContent className="pt-6 pb-6">
          <div className="flex gap-4">
            <div className="hidden sm:flex size-12 items-center justify-center rounded-xl bg-primary/10 shrink-0">
              <Calendar className="size-6 text-primary" />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-primary">{t("events.pageTitle")}</h3>
              <p className="text-base leading-relaxed text-muted-foreground">
                <strong className="text-foreground ">
                  {language === "en" 
                    ? "The Society for Research and Innovation in Infectious Diseases" 
                    : "Societatea pentru Cercetare și Inovare în Patologii Infecțioase"}
                </strong>{" "}
                {t("events.intro")}
              </p>
              <p className="text-base leading-relaxed text-muted-foreground">
                {t("events.intro2")}
              </p>
              <p className="text-base leading-relaxed text-muted-foreground">
                {t("events.intro3")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events List */}
      {events.length > 0 ? (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
              <Beaker className="size-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">{t("events.ourEvents")}</h2>
              <div className="h-1 w-16 bg-primary rounded-full mt-1" />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => {
              const eventRecord = event as unknown as Record<string, unknown>;
              const title = getLocalizedContent(eventRecord, "title", language);
              const shortDescription = getLocalizedContent(eventRecord, "shortDescription", language);
              const dateText = getLocalizedContent(eventRecord, "dateText", language);
              
              return (
                <Card key={event.id} className="hover:shadow-lg transition-all group overflow-hidden border-2">
                  {event.imageUrl && (
                    <div className="relative w-full h-48 overflow-hidden">
                      <Image
                        src={event.imageUrl}
                        alt={title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <Badge className={`${getEventTypeBadgeColor(event.type)} text-sm font-medium px-3 py-1`}>
                        {getEventTypeLabel(event.type)}
                      </Badge>
                      {(dateText || event.eventDate) && (
                        <div className="flex items-center text-sm font-medium text-foreground bg-muted px-2 py-1 rounded">
                          <Calendar className="size-4 mr-1.5" />
                          {dateText || formatDate(event.eventDate)}
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-xl line-clamp-2 group-hover:text-primary transition-colors">
                      {title}
                    </CardTitle>
                    {shortDescription && (
                      <CardDescription className="line-clamp-3 mt-2 text-base">
                        {shortDescription}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full" variant="outline">
                      <Link href={`/events/${event.slug || event.id}`}>
                        {t("events.details")}
                        <ArrowRight className="ml-2 size-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12 text-muted-foreground">
              <Beaker className="size-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">
                {language === "en" 
                  ? "No events available at the moment." 
                  : "Nu există evenimente disponibile momentan."}
              </p>
              <p className="text-sm mt-2">
                {language === "en" 
                  ? "Check back soon for updates." 
                  : "Reveniți în curând pentru actualizări."}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Call to Action */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold">{t("events.interested")}</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("events.interestedText")}
            </p>
            <Button asChild size="lg">
              <Link href="/contact">
                {t("events.contactUs")}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
