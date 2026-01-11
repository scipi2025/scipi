import { prisma } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, FileText, File, ExternalLink, Download } from "lucide-react";
import type { Metadata } from "next";

// Force dynamic rendering to avoid database calls during build
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Resurse",
  description:
    "Resurse educaționale SCIPI: ghiduri, articole și documente pentru dezvoltarea profesională în domeniul patologiilor infecțioase. Materiale selectate de experți.",
};

async function getResources() {
  const resources = await prisma.resource.findMany({
    where: { isActive: true },
    include: {
      files: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const guides = resources.filter((r) => r.type === "guide");
  const articles = resources.filter((r) => r.type === "article");
  const documents = resources.filter((r) => r.type === "document");

  return { guides, articles, documents, all: resources };
}

export default async function ResourcesPage() {
  const { guides, articles, documents, all } = await getResources();

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

  const ResourceCard = ({ resource }: { resource: any }) => {
    const Icon = getIcon(resource.type);
    return (
      <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
        <CardHeader className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Icon className="size-4 text-muted-foreground" />
            <Badge variant="outline">{getTypeLabel(resource.type)}</Badge>
          </div>
          <CardTitle className="text-xl">{resource.title}</CardTitle>
          <CardDescription className="line-clamp-3">
            {resource.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            {resource.url && (
              <Button asChild className="w-full">
                <a href={resource.url} target="_blank" rel="noopener noreferrer">
                  Accesează Link
                  <ExternalLink className="ml-2 size-4" />
                </a>
              </Button>
            )}
            {resource.files && resource.files.length > 0 && (
              <>
                {resource.files.length === 1 ? (
                  <Button asChild variant={resource.url ? "outline" : "default"} className="w-full">
                    <a href={resource.files[0].fileUrl} download={resource.files[0].fileName}>
                      Descarcă Fișier
                      <Download className="ml-2 size-4" />
                    </a>
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Descarcă fișiere:</p>
                    {resource.files.map((file: any) => (
                      <Button 
                        key={file.id} 
                        asChild 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start"
                      >
                        <a href={file.fileUrl} download={file.fileName}>
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

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl mb-4">
          Resurse Educaționale
        </h1>
        <p className="text-lg text-muted-foreground max-w-[700px]">
          Accesează ghiduri, articole și documente utile pentru dezvoltarea ta
          profesională. Toate resursele sunt selectate și recomandate de experți în
          domeniul patologiilor infecțioase.
        </p>
      </div>

      <Tabs defaultValue="all" className="space-y-8">
        <TabsList>
          <TabsTrigger value="all">Toate ({all.length})</TabsTrigger>
          <TabsTrigger value="guides">Ghiduri ({guides.length})</TabsTrigger>
          <TabsTrigger value="articles">Articole ({articles.length})</TabsTrigger>
          <TabsTrigger value="documents">Documente ({documents.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {all.length === 0 ? (
            <EmptyState message="Nu există resurse disponibile momentan." />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {all.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="guides" className="space-y-6">
          {guides.length === 0 ? (
            <EmptyState message="Nu există ghiduri disponibile momentan." />
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
            <EmptyState message="Nu există articole disponibile momentan." />
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
            <EmptyState message="Nu există documente disponibile momentan." />
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

