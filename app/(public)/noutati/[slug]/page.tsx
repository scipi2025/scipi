"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ro, enUS } from "date-fns/locale";
import { useLanguage, getLocalizedContent } from "@/lib/language-context";

interface NewsItem {
  id: string;
  title: string;
  titleEn: string | null;
  slug: string | null;
  excerpt: string | null;
  excerptEn: string | null;
  content: string | null;
  contentEn: string | null;
  linkType: string;
  linkUrl: string | null;
  publishedAt: string;
  event?: { id: string; slug: string | null; title: string } | null;
  project?: { id: string; slug: string | null; title: string } | null;
  resource?: { id: string; slug: string | null; title: string } | null;
}

export default function NewsDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { language, t } = useLanguage();
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`/api/news?slug=${encodeURIComponent(slug)}`);
        if (response.ok) {
          const data = await response.json();
          setNewsItem(data);
          
          // Handle redirects for non-internal news
          if (data.linkType === "event" && data.event?.slug) {
            window.location.href = `/events/${data.event.slug}`;
            return;
          }
          if (data.linkType === "project" && data.project?.slug) {
            window.location.href = `/projects/${data.project.slug}`;
            return;
          }
          if (data.linkType === "resource" && data.resource?.slug) {
            window.location.href = `/resources/${data.resource.slug}`;
            return;
          }
          if (data.linkType === "external" && data.linkUrl) {
            window.location.href = data.linkUrl;
            return;
          }
        } else if (response.status === 404) {
          setNotFound(true);
        }
      } catch (error) {
        console.error("Error fetching news:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchNews();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  if (notFound || !newsItem) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-8">
        <Button variant="ghost" asChild>
          <Link href="/noutati">
            <ArrowLeft className="mr-2 size-4" />
            {language === "ro" ? "Înapoi la Noutăți" : "Back to News"}
          </Link>
        </Button>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              {language === "ro" 
                ? "Noutatea nu a fost găsită." 
                : "News item not found."}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const title = getLocalizedContent(newsItem, "title", language);
  const excerpt = getLocalizedContent(newsItem, "excerpt", language);
  const content = getLocalizedContent(newsItem, "content", language);
  const dateLocale = language === "ro" ? ro : enUS;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-8">
      {/* Back Button */}
      <Button variant="ghost" asChild>
        <Link href="/noutati">
          <ArrowLeft className="mr-2 size-4" />
          {language === "ro" ? "Înapoi la Noutăți" : "Back to News"}
        </Link>
      </Button>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <Badge>{language === "ro" ? "Noutate" : "News"}</Badge>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="size-4 mr-2" />
            {format(new Date(newsItem.publishedAt), "d MMMM yyyy", { locale: dateLocale })}
          </div>
        </div>

        <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
        <div className="h-1 w-20 bg-primary rounded-full" />
      </div>

      {/* Excerpt */}
      {excerpt && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-lg leading-relaxed text-muted-foreground italic">
              {excerpt}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Content */}
      {content && (
        <Card>
          <CardContent className="pt-6">
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </CardContent>
        </Card>
      )}

      {/* If no content, show a message */}
      {!content && !excerpt && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              {language === "ro" 
                ? "Nu există conținut disponibil pentru această noutate."
                : "No content available for this news item."}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Call to Action */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold">
              {language === "ro" ? "Ai întrebări?" : "Have questions?"}
            </h3>
            <p className="text-muted-foreground">
              {language === "ro" 
                ? "Pentru mai multe informații, te rugăm să ne contactezi."
                : "For more information, please contact us."}
            </p>
            <Button asChild size="lg">
              <Link href="/contact">
                {t("nav.contact")}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
