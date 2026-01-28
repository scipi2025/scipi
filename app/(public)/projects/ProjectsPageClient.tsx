"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Beaker, Users } from "lucide-react";
import Link from "next/link";
import { useLanguage, getLocalizedContent } from "@/lib/language-context";

interface Project {
  id: string;
  title: string;
  titleEn?: string | null;
  slug?: string | null;
  shortDescription: string;
  shortDescriptionEn?: string | null;
  status?: string | null;
  [key: string]: unknown;
}

interface ProjectsPageClientProps {
  projects: Project[];
}

export function ProjectsPageClient({ projects }: ProjectsPageClientProps) {
  const { language, t } = useLanguage();

  const getStatusLabel = (status: string | null) => {
    if (status === "ongoing") {
      return language === "en" ? "Ongoing" : "În curs";
    }
    return language === "en" ? "Completed" : "Finalizat";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-12">
      {/* Header Section */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">{t("projects.title")}</h1>
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
              <h3 className="text-xl font-semibold text-primary">{t("projects.pageTitle")}</h3>
              <p className="text-base leading-relaxed text-muted-foreground">
                <strong className="text-foreground font-bold">
                  {language === "en" 
                    ? "The Society for Research and Innovation in Infectious Diseases" 
                    : "Societatea pentru Cercetare și Inovare în Patologii Infecțioase"}
                </strong>{" "}
                {t("projects.intro")} {t("projects.intro2")}
              </p>
              <p className="text-base leading-relaxed text-muted-foreground">
                {t("projects.intro3")}
              </p>
              <p className="text-base leading-relaxed text-muted-foreground">
                {t("projects.intro4")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects List */}
      {projects.length > 0 ? (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
              <Beaker className="size-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">{t("projects.ourProjects")}</h2>
              <div className="h-1 w-16 bg-primary rounded-full mt-1" />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => {
              const title = getLocalizedContent(project, "title", language);
              const shortDescription = getLocalizedContent(project, "shortDescription", language);
              
              return (
                <Card key={project.id} className="hover:shadow-lg transition-all group relative">
                  {project.status && (
                    <div className="absolute top-4 right-4">
                      <Badge className={project.status === "ongoing" ? "bg-blue-500 hover:bg-blue-600" : "bg-green-600 hover:bg-green-700"}>
                        {getStatusLabel(project.status)}
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="pr-24">
                    <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                      {title}
                    </CardTitle>
                    {shortDescription && (
                      <CardDescription className="line-clamp-3 mt-2">
                        {shortDescription}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full" variant="outline">
                      <Link href={`/projects/${project.slug || project.id}`}>
                        {language === "en" ? "Project details" : "Detalii proiect"}
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
                  ? "No projects available at the moment." 
                  : "Nu există proiecte disponibile momentan."}
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
            <h3 className="text-xl font-bold">{t("projects.interested")}</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("projects.interestedText")}
            </p>
            <Button asChild size="lg">
              <Link href="/contact">
                {t("projects.contactUs")}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
