import { Card, CardContent } from "@/components/ui/card";
import { Target, Users, BookOpen, Globe, Microscope } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Misiune și Obiective",
  description:
    "Societatea pentru Cercetare și Inovare în Patologii Infecțioase este o organizație profesională non-profit dedicată progresului științific în domeniul bolilor infecțioase.",
};

export default function MissionPage() {
  const objectives = [
    {
      icon: Microscope,
      text: "Susținerea și promovarea cercetării științifice în domeniul bolilor infecțioase și specialitățile conexe",
    },
    {
      icon: Globe,
      text: "Dezvoltarea parteneriatelor și colaborărilor naționale și internaționale în cercetarea clinică și fundamentală a bolilor infecțioase",
    },
    {
      icon: Target,
      text: "Facilitarea acces la resurse și infrastructură de cercetare clinică și fundamentală în domeniul patologiilor infecțioase",
    },
    {
      icon: BookOpen,
      text: "Susținerea diseminarea rezultatelor științifice prin articole de specialitate și evenimente destinate schimbului științific",
    },
    {
      icon: Users,
      text: "Promovarea colaborării interdisciplinare pentru abordarea integrată a bolilor infecțioase",
    },
  ];

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Misiune</h1>
        <div className="h-1 w-20 bg-primary rounded-full" />
      </div>

      {/* Mission Statement */}
      <Card className="">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <p className="text-lg leading-relaxed text-justify">
              <strong>Societatea pentru Cercetare și Inovare în Patologii Infecțioase</strong>{" "}
              este o organizație profesională non-profit dedicată progresului
              științific în domeniul bolilor infecțioase. Activitatea Societății
              vizează sprijinirea cercetării medicale, facilitarea colaborării
              interdisciplinare și promovarea celor mai bune practici clinice,
              cu scopul de a îmbunătăți înțelegerea, diagnosticarea și
              tratamentul infecțiilor.
            </p>
            <p className="text-lg leading-relaxed text-justify">
              <strong>Scopul principal</strong> constă în promovarea, susținerea și dezvoltarea
              cercetării științifice în domeniul bolilor infecțioase și în
              domeniile conexe, prin crearea unui cadru care facilitează
              cooperarea între profesioniști din mediul medical, academic și
              tehnologic.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Objectives Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Obiective</h2>
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
                      <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors flex-shrink-0">
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
    </div>
  );
}
