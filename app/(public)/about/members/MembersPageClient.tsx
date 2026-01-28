"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCheck, Users, Award, FileText, Sparkles, Heart } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";

export function MembersPageClient() {
  const { t } = useLanguage();

  const memberCategories = [
    {
      icon: UserCheck,
      title: t("members.activeMembers"),
      description: t("members.activeMembersText"),
      color: "primary",
    },
    {
      icon: Users,
      title: t("members.associateMembers"),
      description: t("members.associateMembersText"),
      color: "blue",
    },
    {
      icon: Award,
      title: t("members.honoraryMembers"),
      description: t("members.honoraryMembersText"),
      color: "amber",
    },
  ];

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">{t("members.title")}</h1>
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
              <h3 className="text-xl font-semibold text-primary">{t("members.community")}</h3>
              <p className="text-base leading-relaxed text-muted-foreground">
                {t("members.communityText1")}
              </p>
              <p className="text-base leading-relaxed text-muted-foreground">
                {t("members.communityText2")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Participation Info */}
      <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-950/20">
        <CardContent className="pt-6 pb-6">
          <div className="flex gap-4">
            <div className="hidden sm:flex size-12 items-center justify-center rounded-xl bg-blue-500/10 shrink-0">
              <Heart className="size-6 text-blue-500" />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-blue-600">{t("members.openParticipation")}</h3>
              <p className="text-base leading-relaxed text-muted-foreground">
                {t("members.openParticipationText1")}
              </p>
              <p className="text-base leading-relaxed text-muted-foreground">
                {t("members.openParticipationText2")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Member Categories */}
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">{t("members.categories")}</h2>
          <div className="h-1 w-16 bg-primary rounded-full" />
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {memberCategories.map((category, index) => {
            const Icon = category.icon;
            const borderColorClass = 
              category.color === "primary" ? "border-primary" :
              category.color === "blue" ? "border-blue-500" :
              "border-amber-500";
            const bgColorClass = 
              category.color === "primary" ? "bg-primary/10 group-hover:bg-primary/20" :
              category.color === "blue" ? "bg-blue-500/10 group-hover:bg-blue-500/20" :
              "bg-amber-500/10 group-hover:bg-amber-500/20";
            const iconColorClass = 
              category.color === "primary" ? "text-primary" :
              category.color === "blue" ? "text-blue-500" :
              "text-amber-500";

            return (
              <Card
                key={index}
                className={`group hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col border-2 ${borderColorClass}`}
              >
                <CardContent className="pt-8 pb-8 px-6 flex-1">
                  <div className="flex flex-col items-center text-center space-y-6">
                    {/* Icon */}
                    <div className={`flex size-16 items-center justify-center rounded-2xl ${bgColorClass} transition-colors`}>
                      <Icon className={`size-8 ${iconColorClass}`} />
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-xl font-bold leading-tight">
                      {category.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-sm leading-relaxed text-muted-foreground text-center">
                      {category.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Enrollment Process */}
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">{t("members.applicationProcess")}</h2>
          <div className="h-1 w-16 bg-primary rounded-full" />
        </div>

        <Card className="border-l-4 border-l-primary">
          <CardContent className="pt-6">
            <p className="text-lg leading-relaxed mb-4 text-justify">
              {t("members.applicationProcessText1")}
            </p>
            <p className="text-lg leading-relaxed mb-4 text-justify">
              {t("members.applicationProcessText2")}
            </p>
            <p className="text-lg leading-relaxed mb-4 text-justify">
              {t("members.applicationProcessText3")}
            </p>
            <p className="text-lg leading-relaxed text-justify">
              {t("members.applicationProcessText4")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Application Form Button */}
      <div className="flex justify-center">
        <Button size="lg" asChild>
          <Link href="/about/members/apply">
            <FileText className="mr-2 size-4" />
            {t("members.completeForm")}
          </Link>
        </Button>
      </div>
    </div>
  );
}
