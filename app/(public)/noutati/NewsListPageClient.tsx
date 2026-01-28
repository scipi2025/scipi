"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ro, enUS } from "date-fns/locale";
import { useLanguage, getLocalizedContent } from "@/lib/language-context";

interface NewsItem {
  id: string;
  title: string;
  titleEn?: string | null;
  slug?: string | null;
  excerpt?: string | null;
  excerptEn?: string | null;
  linkType: string;
  linkUrl?: string | null;
  publishedAt: string;
  event?: { id: string; slug?: string | null; title: string } | null;
  project?: { id: string; slug?: string | null; title: string } | null;
  resource?: { id: string; slug?: string | null; title: string } | null;
}

interface NewsListPageClientProps {
  news: NewsItem[];
}

export function NewsListPageClient({ news }: NewsListPageClientProps) {
  const { language, t } = useLanguage();
  const dateLocale = language === "en" ? enUS : ro;

  function getNewsLink(newsItem: NewsItem): string {
    switch (newsItem.linkType) {
      case "event":
        return newsItem.event ? `/events/${newsItem.event.slug || newsItem.event.id}` : "#";
      case "project":
        return newsItem.project ? `/projects/${newsItem.project.slug || newsItem.project.id}` : "#";
      case "resource":
        return `/resources`;
      case "external":
        return newsItem.linkUrl || "#";
      case "internal":
      default:
        return `/noutati/${newsItem.slug || newsItem.id}`;
    }
  }

  function getLinkTypeLabel(linkType: string): string {
    if (language === "en") {
      switch (linkType) {
        case "event": return "Event";
        case "project": return "Project";
        case "resource": return "Resource";
        case "external": return "External link";
        default: return "News";
      }
    }
    switch (linkType) {
      case "event": return "Eveniment";
      case "project": return "Proiect";
      case "resource": return "Resursă";
      case "external": return "Link extern";
      default: return "Noutate";
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-8">
      {/* Back Button */}
      <Button variant="ghost" asChild>
        <Link href="/">
          <ArrowLeft className="mr-2 size-4" />
          {language === "en" ? "Back to Home" : "Înapoi la Acasă"}
        </Link>
      </Button>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-2xl">📢</span>
          </div>
          <div>
            <Badge className="mb-2">{language === "en" ? "Announcements" : "Anunțuri"}</Badge>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{t("nav.news")}</h1>
          </div>
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl">
          {language === "en" 
            ? "Latest announcements, information and updates from SRIID" 
            : "Ultimele anunțuri, informații și actualizări de la SCIPI"}
        </p>
        <div className="h-1 w-20 bg-primary rounded-full" />
      </div>

      {/* News List */}
      {news.length > 0 ? (
        <div className="grid gap-4">
          {news.map((newsItem) => {
            const link = getNewsLink(newsItem);
            const isExternal = newsItem.linkType === "external";
            const title = getLocalizedContent(newsItem, "title", language);
            const excerpt = getLocalizedContent(newsItem, "excerpt", language);
            
            const cardContent = (
              <Card className="group hover:border-primary/50 hover:shadow-md transition-all cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Bullet */}
                    <div className="shrink-0 mt-2">
                      <div className="w-3 h-3 rounded-full bg-primary group-hover:scale-125 transition-transform" />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {getLinkTypeLabel(newsItem.linkType)}
                        </Badge>
                        <span className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="size-3 mr-1" />
                          {format(new Date(newsItem.publishedAt), "d MMMM yyyy", { locale: dateLocale })}
                        </span>
                      </div>
                      
                      <h2 className="text-lg md:text-xl font-semibold group-hover:text-primary transition-colors">
                        {title}
                      </h2>
                      
                      {excerpt && (
                        <p className="text-muted-foreground line-clamp-2">
                          {excerpt}
                        </p>
                      )}
                    </div>

                    {/* Arrow */}
                    <div className="shrink-0 mt-2">
                      <ArrowRight className="size-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );

            if (isExternal) {
              return (
                <a key={newsItem.id} href={link} target="_blank" rel="noopener noreferrer">
                  {cardContent}
                </a>
              );
            }

            return (
              <Link key={newsItem.id} href={link}>
                {cardContent}
              </Link>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <div className="text-4xl">📭</div>
              <h3 className="text-xl font-semibold">
                {language === "en" ? "No news at the moment" : "Nu există noutăți momentan"}
              </h3>
              <p className="text-muted-foreground">
                {language === "en" 
                  ? "Check back later for the latest updates from SRIID." 
                  : "Revino mai târziu pentru ultimele actualizări de la SCIPI."}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Back to home CTA */}
      <div className="pt-8 text-center">
        <Button asChild variant="outline" size="lg">
          <Link href="/">
            <ArrowLeft className="mr-2 size-4" />
            {language === "en" ? "Back to home page" : "Înapoi la pagina principală"}
          </Link>
        </Button>
      </div>
    </div>
  );
}
