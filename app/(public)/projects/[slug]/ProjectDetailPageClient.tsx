"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowLeft, FileText, Download } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useLanguage } from "@/lib/language-context";
import type { Project, ProjectSection, ProjectSectionFile } from "@prisma/client";

interface ProjectWithSections extends Project {
  sections: (ProjectSection & { files: ProjectSectionFile[] })[];
}

const getStatusLabel = (status: string | null, language: "ro" | "en") => {
  const statuses: Record<string, Record<string, string>> = {
    ro: {
      ongoing: "În Curs",
      completed: "Finalizat",
    },
    en: {
      ongoing: "Ongoing",
      completed: "Completed",
    },
  };
  return statuses[language][status || "ongoing"] || statuses[language]["ongoing"];
};

const getStatusBadgeColor = (status: string | null) => {
  const colors: Record<string, string> = {
    ongoing: "bg-blue-500",
    completed: "bg-green-600",
  };
  return colors[status || "ongoing"] || "bg-blue-500";
};

const getSectionBackgroundClass = (backgroundColor: string | null) => {
  const backgrounds: Record<string, string> = {
    white: "bg-white",
    muted: "bg-muted",
    primary: "bg-primary/5 border-primary/20",
    yellow: "bg-yellow-50 border-yellow-200",
    green: "bg-green-50 border-green-200",
    blue: "bg-blue-50 border-blue-200",
    purple: "bg-purple-50 border-purple-200",
    orange: "bg-orange-50 border-orange-200",
  };
  return backgrounds[backgroundColor || "white"] || "bg-white";
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

const getPlainTextFromHtml = (html: string | null | undefined) => {
  if (!html) return "";

  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const hasMeaningfulHtmlContent = (html: string | null | undefined) => {
  if (!html) return false;

  const hasEmbeddedMedia = /<(img|video|iframe|embed|object|svg)\b/i.test(html);
  return hasEmbeddedMedia || getPlainTextFromHtml(html).length > 0;
};

const hasMeaningfulText = (value: string | null | undefined) => {
  return Boolean(value && value.trim().length > 0);
};

interface ProjectDetailPageClientProps {
  project: ProjectWithSections;
}

export function ProjectDetailPageClient({ project }: ProjectDetailPageClientProps) {
  const { language } = useLanguage();
  const [imageAspectRatio, setImageAspectRatio] = useState(16 / 9);
  const showImageOnDetail =
    (project as Project & { showImageOnDetail?: boolean }).showImageOnDetail ?? true;

  // Get localized content
  const title = language === "en" && project.titleEn ? project.titleEn : project.title;
  const getLocalizedSectionContent = (section: ProjectSection & { files: ProjectSectionFile[] }) => {
    return {
      title: language === "en" && section.titleEn ? section.titleEn : section.title,
      content: language === "en" && section.contentEn ? section.contentEn : section.content,
    };
  };

  const visibleSections = (project.sections || [])
    .map((section) => {
      const localized = getLocalizedSectionContent(section);
      const hasTitle = hasMeaningfulText(localized.title);
      const hasContent = hasMeaningfulHtmlContent(localized.content);
      const hasFiles = Boolean(section.files && section.files.length > 0);

      return {
        ...section,
        localizedTitle: localized.title,
        localizedContent: localized.content,
        hasTitle,
        hasContent,
        hasFiles,
        isVisible: hasTitle || hasContent || hasFiles,
      };
    })
    .filter((section) => section.isVisible);

  const formatDate = (date: Date) => {
    if (language === "en") {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
    }
    return date.toLocaleDateString("ro-RO", {
      year: "numeric",
      month: "long",
    });
  };

  const labels = {
    backToProjects: language === "en" ? "Back to Projects" : "Înapoi la Proiecte",
    attachedDocuments: language === "en" ? "Attached documents" : "Documente atașate",
    interestedInProject: language === "en" ? "Interested in this project?" : "Interesat de acest proiect?",
    projectInfo: language === "en" 
      ? "For more information or to participate in this project, please contact us."
      : "Pentru mai multe informații sau pentru a participa la acest proiect, contactați-ne.",
    contactSCIPI: language === "en" ? "Contact SRIID" : "Contactează SCIPI",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 pt-4 md:pt-6 pb-8 md:pb-10 space-y-7">
      {/* Back Button */}
      <Button variant="ghost" asChild>
        <Link href="/projects">
          <ArrowLeft className="mr-2 size-4" />
          {labels.backToProjects}
        </Link>
      </Button>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          {project.status && (
            <Badge className={getStatusBadgeColor(project.status)}>
              {getStatusLabel(project.status, language)}
            </Badge>
          )}
          {project.startDate && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="size-4 mr-2" />
              {formatDate(project.startDate)}
              {project.endDate && (
                <>
                  {" - "}
                  {formatDate(project.endDate)}
                </>
              )}
            </div>
          )}
        </div>

        <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
        <div className="h-1 w-20 bg-primary rounded-full" />
      </div>

      {/* Image */}
      {project.imageUrl && showImageOnDetail && (
        <div className="w-full">
          <Image
            src={project.imageUrl}
            alt={title}
            width={Math.max(1, Math.round(imageAspectRatio * 1000))}
            height={1000}
            sizes="100vw"
            className="w-full h-auto rounded-lg"
            onLoad={(e) => {
              const { naturalWidth, naturalHeight } = e.currentTarget;
              if (naturalWidth > 0 && naturalHeight > 0) {
                setImageAspectRatio(naturalWidth / naturalHeight);
              }
            }}
          />
        </div>
      )}

      {/* Project Sections */}
      {visibleSections.length > 0 && (
        <>
          {/* Single section - render as body without card */}
          {visibleSections.length === 1 ? (
            <Card className={getSectionBackgroundClass(visibleSections[0].backgroundColor)}>
              {visibleSections[0].hasTitle && (
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl font-semibold">
                    {visibleSections[0].localizedTitle}
                  </CardTitle>
                  <div className="h-1 w-16 bg-primary rounded-full mt-2" />
                </CardHeader>
              )}
              <CardContent className={visibleSections[0].hasTitle ? "pt-4" : "pt-6"}>
                {/* Content */}
                {visibleSections[0].hasContent && (
                  <div
                    className="prose prose-lg max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:leading-relaxed prose-ul:list-disc prose-ol:list-decimal prose-li:my-1"
                    dangerouslySetInnerHTML={{ __html: visibleSections[0].localizedContent || "" }}
                  />
                )}

                {/* Files */}
                {visibleSections[0].hasFiles && (
                  <div className={visibleSections[0].hasContent ? "mt-6 pt-4 border-t" : ""}>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-3">
                      {labels.attachedDocuments}
                    </h4>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {visibleSections[0].files.map((file) => (
                        <a
                          key={file.id}
                          href={file.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 rounded-lg border bg-background hover:bg-muted transition-colors group"
                        >
                          <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <FileText className="size-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                              {file.fileName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(file.fileSize)}
                            </p>
                          </div>
                          <Download className="size-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            /* Multiple sections - render in cards */
            <div className="space-y-6">
              {visibleSections.map((section) => (
                <Card 
                  key={section.id} 
                  className={getSectionBackgroundClass(section.backgroundColor)}
                >
                  {section.hasTitle && (
                    <CardHeader className="pb-2">
                      <CardTitle className="text-2xl font-semibold">
                        {section.localizedTitle}
                      </CardTitle>
                      <div className="h-1 w-16 bg-primary rounded-full mt-2" />
                    </CardHeader>
                  )}
                  <CardContent className={section.hasTitle ? "pt-4" : "pt-6"}>
                    {/* Section Content */}
                    {section.hasContent && (
                      <div
                        className="prose prose-lg max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:leading-relaxed prose-ul:list-disc prose-ol:list-decimal prose-li:my-1"
                        dangerouslySetInnerHTML={{ __html: section.localizedContent || "" }}
                      />
                    )}

                    {/* Section Files */}
                    {section.hasFiles && (
                      <div className={section.hasContent ? "mt-6 pt-4 border-t" : ""}>
                        <h4 className="text-sm font-semibold text-muted-foreground mb-3">
                          {labels.attachedDocuments}
                        </h4>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {section.files.map((file) => (
                            <a
                              key={file.id}
                              href={file.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 p-3 rounded-lg border bg-background hover:bg-muted transition-colors group"
                            >
                              <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <FileText className="size-5 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                                  {file.fileName}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {formatFileSize(file.fileSize)}
                                </p>
                              </div>
                              <Download className="size-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Contact CTA */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold">{labels.interestedInProject}</h3>
            <p className="text-muted-foreground">
              {labels.projectInfo}
            </p>
            <Button asChild size="lg">
              <Link href="/contact">
                {labels.contactSCIPI}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
