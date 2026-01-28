"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, FileText, File, ExternalLink, Download } from "lucide-react";
import { useLanguage, getLocalizedContent } from "@/lib/language-context";

interface ResourceFile {
  id: string;
  fileName: string;
  fileUrl: string;
}

interface Resource {
  id: string;
  title: string;
  titleEn?: string | null;
  slug?: string | null;
  description: string;
  descriptionEn?: string | null;
  url?: string | null;
  type: string;
  files?: ResourceFile[];
}

interface ResourcesPageClientProps {
  resources: Resource[];
}

export function ResourcesPageClient({ resources }: ResourcesPageClientProps) {
  const { language, t } = useLanguage();

  const guides = resources.filter((r) => r.type === "guide");
  const articles = resources.filter((r) => r.type === "article");
  const documents = resources.filter((r) => r.type === "document");

  const getIcon = (type: string) => {
    switch (type) {
      case "guide":
        return BookOpen;
      case "article":
        return FileText;
      case "document":
        return File;
      default:
        return File;
    }
  };

  const getTypeLabel = (type: string) => {
    if (language === "en") {
      switch (type) {
        case "guide":
          return "Guide";
        case "article":
          return "Article";
        case "document":
          return "Document";
        default:
          return type;
      }
    }
    switch (type) {
      case "guide":
        return "Ghid";
      case "article":
        return "Articol";
      case "document":
        return "Document";
      default:
        return type;
    }
  };

  const ResourceCard = ({ resource }: { resource: Resource }) => {
    const Icon = getIcon(resource.type);
    const title = getLocalizedContent(resource, "title", language);
    const description = getLocalizedContent(resource, "description", language);
    
    return (
      <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
        <CardHeader className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Icon className="size-4 text-muted-foreground" />
            <Badge variant="outline">{getTypeLabel(resource.type)}</Badge>
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription className="line-clamp-3">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            {resource.url && (
              <Button asChild className="w-full">
                <a href={resource.url} target="_blank" rel="noopener noreferrer">
                  {t("resources.accessLink")}
                  <ExternalLink className="ml-2 size-4" />
                </a>
              </Button>
            )}
            {resource.files && resource.files.length > 0 && (
              <>
                {resource.files.length === 1 ? (
                  <Button asChild variant={resource.url ? "outline" : "default"} className="w-full">
                    <a href={`/resources/${resource.slug || resource.id}/download`} target="_blank" rel="noopener noreferrer">
                      {language === "en" ? "Download File" : "Descarcă Fișier"}
                      <Download className="ml-2 size-4" />
                    </a>
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">
                      {language === "en" ? "Download files:" : "Descarcă fișiere:"}
                    </p>
                    {resource.files.map((file, index) => (
                      <Button 
                        key={file.id} 
                        asChild 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start"
                      >
                        <a href={`/resources/${resource.slug || resource.id}/download?file=${index}`} target="_blank" rel="noopener noreferrer">
                          <Download className="mr-2 size-3" />
                          <span className="truncate">{file.fileName}</span>
                        </a>
                      </Button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const EmptyState = ({ message }: { message: string }) => (
    <Card className="bg-muted/50">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <BookOpen className="size-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground text-center">{message}</p>
      </CardContent>
    </Card>
  );

  const noResourcesMessage = language === "en" 
    ? "No resources available at the moment." 
    : "Nu există resurse disponibile momentan.";

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:px-6 md:py-16">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl mb-4">
          {t("resources.pageTitle")}
        </h1>
        <p className="text-lg text-muted-foreground max-w-[700px]">
          {t("resources.intro")}
        </p>
      </div>

      <Tabs defaultValue="all" className="space-y-8">
        <TabsList>
          <TabsTrigger value="all">{t("resources.all")} ({resources.length})</TabsTrigger>
          <TabsTrigger value="guides">{t("resources.guides")} ({guides.length})</TabsTrigger>
          <TabsTrigger value="articles">{t("resources.articles")} ({articles.length})</TabsTrigger>
          <TabsTrigger value="documents">{t("resources.documents")} ({documents.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {resources.length === 0 ? (
            <EmptyState message={noResourcesMessage} />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {resources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="guides" className="space-y-6">
          {guides.length === 0 ? (
            <EmptyState message={language === "en" ? "No guides available at the moment." : "Nu există ghiduri disponibile momentan."} />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {guides.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="articles" className="space-y-6">
          {articles.length === 0 ? (
            <EmptyState message={language === "en" ? "No articles available at the moment." : "Nu există articole disponibile momentan."} />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          {documents.length === 0 ? (
            <EmptyState message={language === "en" ? "No documents available at the moment." : "Nu există documente disponibile momentan."} />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {documents.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
