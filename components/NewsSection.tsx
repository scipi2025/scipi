import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface NewsItem {
  id: string;
  title: string;
  excerpt: string | null;
  linkType: string;
  linkUrl: string | null;
  eventId: string | null;
  projectId: string | null;
  resourceId: string | null;
  publishedAt: string | Date;
  event?: { id: string; slug: string; title: string } | null;
  project?: { id: string; slug: string; title: string } | null;
  resource?: { id: string; slug: string; title: string } | null;
}

interface NewsSectionProps {
  news: NewsItem[];
}

function getNewsLink(newsItem: NewsItem): string {
  switch (newsItem.linkType) {
    case "event":
      return newsItem.event?.slug ? `/events/${newsItem.event.slug}` : "#";
    case "project":
      return newsItem.project?.slug ? `/projects/${newsItem.project.slug}` : "#";
    case "resource":
      return newsItem.resource?.slug ? `/resources` : "#";
    case "external":
      return newsItem.linkUrl || "#";
    case "internal":
    default:
      return `/noutati/${newsItem.id}`;
  }
}

function isExternalLink(newsItem: NewsItem): boolean {
  return newsItem.linkType === "external";
}

export function NewsSection({ news }: NewsSectionProps) {
  if (news.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="px-4 md:px-6">
        <div className="mb-10">
          <Badge className="mb-4">Anunțuri</Badge>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
            Noutăți
          </h2>
          <p className="text-muted-foreground mt-2 max-w-[600px]">
            Ultimele anunțuri și informații de la SCIPI
          </p>
        </div>

        <div className="space-y-4 max-w-4xl">
          {news.map((newsItem) => {
            const link = getNewsLink(newsItem);
            const isExternal = isExternalLink(newsItem);
            
            const content = (
              <div className="group flex items-start gap-4 p-4 rounded-lg bg-card border hover:border-primary/50 hover:shadow-md transition-all cursor-pointer">
                {/* Bullet point */}
                <div className="shrink-0 mt-1.5">
                  <div className="w-2 h-2 rounded-full bg-primary group-hover:scale-125 transition-transform" />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    {newsItem.title}
                  </h3>
                  {newsItem.excerpt && (
                    <p className="text-muted-foreground mt-1 line-clamp-2">
                      {newsItem.excerpt}
                    </p>
                  )}
                </div>

                {/* Arrow */}
                <div className="shrink-0 mt-1">
                  <ArrowRight className="size-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            );

            if (isExternal) {
              return (
                <a
                  key={newsItem.id}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {content}
                </a>
              );
            }

            return (
              <Link key={newsItem.id} href={link}>
                {content}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
