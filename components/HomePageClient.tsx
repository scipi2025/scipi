"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageCarousel } from "@/components/ImageCarousel";
import { ActivitySection } from "@/components/ActivitySection";
import { useLanguage, getLocalizedContent } from "@/lib/language-context";

// Types
interface CarouselImage {
  id: string;
  imageUrl: string;
  alt: string;
  altEn?: string | null;
}

interface NewsItem {
  id: string;
  title: string;
  titleEn?: string | null;
  excerpt: string | null;
  excerptEn?: string | null;
  linkType: string;
  linkUrl: string | null;
  event?: { id: string; slug: string | null; title: string } | null;
  project?: { id: string; slug: string | null; title: string } | null;
  resource?: { id: string; slug: string | null; title: string } | null;
}

interface HomePageClientProps {
  carouselImages: CarouselImage[];
  news: NewsItem[];
}

function getNewsLink(newsItem: NewsItem): string {
  switch (newsItem.linkType) {
    case "event":
      return newsItem.event
        ? `/events/${newsItem.event.slug || newsItem.event.id}`
        : "#";
    case "project":
      return newsItem.project
        ? `/projects/${newsItem.project.slug || newsItem.project.id}`
        : "#";
    case "resource":
      return `/resources`;
    case "external":
      return newsItem.linkUrl || "#";
    case "internal":
    default:
      return `/noutati/${newsItem.id}`;
  }
}

function NewsItemCompact({ newsItem }: { newsItem: NewsItem }) {
  const { language } = useLanguage();
  const link = getNewsLink(newsItem);
  const isExternal = newsItem.linkType === "external";

  const title = getLocalizedContent(newsItem, "title", language);

  const content = (
    <div className="group flex items-center gap-4 py-5 px-5 rounded-xl bg-card border-2 border-border/60 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer">
      {/* Decorative dot with glow */}
      <div className="shrink-0">
        <div className="w-3 h-3 rounded-full bg-gradient-to-br from-primary to-primary/60 group-hover:scale-125 transition-transform duration-300 shadow-md shadow-primary/40" />
      </div>

      {/* Title */}
      <h3 className="font-semibold text-base md:text-lg group-hover:text-primary transition-colors duration-300 line-clamp-2 flex-1">
        {title}
      </h3>

      {/* Arrow */}
      <ArrowRight className="shrink-0 size-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
    </div>
  );

  if (isExternal) {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return <Link href={link}>{content}</Link>;
}

export function HomePageClient({ carouselImages, news }: HomePageClientProps) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-linear-to-b from-primary/10 to-background py-8 md:py-12 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center text-center space-y-4">
            <Image
              src="/logo_no_bg.png"
              alt="SCIPI Logo"
              width={450}
              height={100}
              className="w-[300px] md:w-[400px] logo-animate cursor-pointer"
            />
            <p className="max-w-[900px] text-lg text-muted-foreground md:text-xl leading-relaxed">
              {t("home.hero.slogan")}
            </p>
          </div>
        </div>
      </section>

      {/* Carousel + News Section - Side by Side */}
      <section className="py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Image Carousel with gradient border */}
            <div className="relative p-1 rounded-xl bg-gradient-to-br from-primary/40 via-primary/20 to-primary/40">
              <div className="relative h-[300px] sm:h-[350px] md:h-[400px] w-full rounded-lg overflow-hidden">
                <ImageCarousel images={carouselImages} />
              </div>
            </div>

            {/* News Section - Friendly vertical list */}
            {news.length > 0 && (
              <div className="flex flex-col h-full bg-gradient-to-br from-muted/30 to-muted/10 rounded-2xl p-6 border border-border/30">
                {/* Title with cute icon */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/10 shadow-sm">
                    <Sparkles className="size-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                      {t("home.news.title")}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {t("home.news.subtitle")}
                    </p>
                  </div>
                </div>

                {/* News items - with more spacing */}
                <div className="flex flex-col gap-4 flex-1">
                  {news.slice(0, 4).map((newsItem) => (
                    <NewsItemCompact key={newsItem.id} newsItem={newsItem} />
                  ))}
                </div>

                {/* View all button - more friendly */}
                <div className="mt-8">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full rounded-xl h-12 text-base hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                  >
                    <Link href="/noutati">
                      {t("home.news.readAll")}
                      <ArrowRight className="ml-2 size-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mission Section - Full Width with animation */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-primary/5 via-primary/15 to-primary/5 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center text-center space-y-8">
            {/* Header with icon - inline on small, stacked on large */}
            <div className="flex items-center gap-4 md:flex-col md:gap-0">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/10 shadow-sm md:mb-6">
                <Target className="size-6 md:size-7 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tighter sm:text-4xl lg:text-5xl">
                {t("home.mission.title")}
              </h2>
            </div>
            <p className="text-muted-foreground md:text-lg lg:text-xl leading-relaxed max-w-4xl">
              {t("home.mission.text")}
            </p>
            <Button asChild size="lg" className="mt-2">
              <Link href="/about/mission">
                {t("home.mission.readMore")}
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Activity Section - Interactive cards for Events, Projects, Resources */}
      <ActivitySection />

      {/* CTA Section */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4 rounded-lg bg-primary/10 p-6 md:p-10">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              {t("home.cta.title")}
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-lg leading-relaxed">
              {t("home.cta.text")}
            </p>

            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg" asChild className="animate-cta-attention">
                <Link href="/about/members/apply">{t("home.cta.apply")}</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">{t("home.cta.contact")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
