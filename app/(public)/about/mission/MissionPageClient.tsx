"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Target, Users, BookOpen, Globe, Microscope, Stethoscope, GraduationCap, FlaskConical, UserCheck, Sparkles } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export function MissionPageClient() {
  const { t } = useLanguage();

  const objectives = [
    {
      icon: Microscope,
      text: t("mission.objective1"),
    },
    {
      icon: Globe,
      text: t("mission.objective2"),
    },
    {
      icon: Target,
      text: t("mission.objective3"),
    },
    {
      icon: BookOpen,
      text: t("mission.objective4"),
    },
    {
      icon: Users,
      text: t("mission.objective5"),
    },
  ];

  const targetAudience = [
    { icon: Stethoscope, text: t("mission.residentPhysicians") },
    { icon: Stethoscope, text: t("mission.specialistPhysicians") },
    { icon: Stethoscope, text: t("mission.seniorPhysicians") },
    { icon: GraduationCap, text: t("mission.academicStaff") },
    { icon: FlaskConical, text: t("mission.medicalResearchers") },
    { icon: GraduationCap, text: t("mission.phdStudents") },
    { icon: GraduationCap, text: t("mission.medicalStudents") },
    { icon: UserCheck, text: t("mission.nurses") },
  ];

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">{t("mission.title")}</h1>
        <div className="h-1 w-20 bg-primary rounded-full" />
      </div>

      {/* Mission Statement */}
      <Card className="border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-transparent">
        <CardContent className="pt-6 pb-6">
          <div className="flex gap-4">
            <div className="hidden sm:flex size-12 items-center justify-center rounded-xl bg-primary/10 shrink-0">
              <Sparkles className="size-6 text-primary" />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-primary">{t("mission.aboutScipi")}</h3>
              <p className="text-base leading-relaxed text-muted-foreground">
                {t("mission.aboutText1")}
              </p>
              <p className="text-base leading-relaxed text-muted-foreground">
                {t("mission.aboutText2")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Objectives Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">{t("mission.objectives")}</h2>
          <div className="h-1 w-16 bg-primary rounded-full" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {objectives.map((objective, index) => {
            const Icon = objective.icon;
            return (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50"
              >
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start gap-3">
                      <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors shrink-0">
                        <Icon className="size-6 text-primary" />
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {objective.text}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Target Audience Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">{t("mission.whoWeAddress")}</h2>
          <div className="h-1 w-16 bg-primary rounded-full" />
        </div>

        <p className="text-lg leading-relaxed text-muted-foreground">
          {t("mission.whoWeAddressText")}
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {targetAudience.map((audience, index) => {
            const Icon = audience.icon;
            return (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50"
              >
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center gap-4 text-center">
                    <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors shrink-0">
                      <Icon className="size-6 text-primary" />
                    </div>
                    <p className="text-sm font-medium leading-relaxed">
                      {audience.text}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
