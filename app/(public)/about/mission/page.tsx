import { Card, CardContent } from "@/components/ui/card";
import { Target, Users, BookOpen, Globe, Microscope, Stethoscope, GraduationCap, FlaskConical, UserCheck, Sparkles } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Misiune și obiective",
  description:
    "Societatea pentru Cercetare și Inovare în Patologii Infecțioase este o organizație profesională non-profit dedicată progresului științific în domeniul bolilor infecțioase.",
};

export default function MissionPage() {
  const objectives = [
    {
      icon: Microscope,
      text: "Susținerea și promovarea cercetării științifice în domeniul bolilor infecțioase și a specialităților conexe",
    },
    {
      icon: Globe,
      text: "Dezvoltarea parteneriatelor și colaborărilor naționale și internaționale în cercetarea clinică și fundamentală a bolilor infecțioase",
    },
    {
      icon: Target,
      text: "Facilitarea accesului la resurse și infrastructură de cercetare clinică și fundamentală în domeniul patologiilor infecțioase",
    },
    {
      icon: BookOpen,
      text: "Susținerea diseminării rezultatelor științifice prin publicarea de articole de specialitate și organizarea de evenimente medicale",
    },
    {
      icon: Users,
      text: "Promovarea colaborării interdisciplinare pentru abordarea integrată a bolilor infecțioase",
    },
  ];

  const targetAudience = [
    {
      icon: Stethoscope,
      text: "Medici rezidenți",
    },
    {
      icon: Stethoscope,
      text: "Medici specialiști",
    },
    {
      icon: Stethoscope,
      text: "Medici primari",
    },
    {
      icon: GraduationCap,
      text: "Cadre didactice",
    },
    {
      icon: FlaskConical,
      text: "Cercetători în domeniul medical",
    },
    {
      icon: GraduationCap,
      text: "Studenți doctoranzi",
    },
    {
      icon: GraduationCap,
      text: "Studenți la medicină",
    },
    {
      icon: UserCheck,
      text: "Asistenți medicali",
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
      <Card className="border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-transparent">
        <CardContent className="pt-6 pb-6">
          <div className="flex gap-4">
            <div className="hidden sm:flex size-12 items-center justify-center rounded-xl bg-primary/10 shrink-0">
              <Sparkles className="size-6 text-primary" />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-primary">Despre SCIPI</h3>
              <p className="text-base leading-relaxed text-muted-foreground">
                <strong className="text-foreground">Societatea pentru Cercetare și Inovare în Patologii Infecțioase</strong>{" "}
                este o organizație profesională non-profit dedicată progresului
                științific în domeniul bolilor infecțioase. Activitatea Societății
                vizează sprijinirea cercetării medicale, facilitarea colaborării
                interdisciplinare și promovarea celor mai bune practici clinice,
                cu scopul de a îmbunătăți înțelegerea, diagnosticarea și
                tratamentul patologiilor infecțioase.
              </p>
              <p className="text-base leading-relaxed text-muted-foreground">
                <strong className="text-foreground">Scopul principal</strong> constă în promovarea, susținerea și dezvoltarea
                cercetării științifice în domeniul bolilor infecțioase și în
                domeniile conexe, prin crearea unui cadru care facilitează
                cooperarea între profesioniști din mediul medical, academic și
                tehnologic.
              </p>
            </div>
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
          <h2 className="text-3xl font-bold tracking-tight mb-2">Cui ne adresăm?</h2>
          <div className="h-1 w-16 bg-primary rounded-full" />
        </div>

        <p className="text-lg leading-relaxed text-muted-foreground">
          SCIPI se adresează profesioniști din domeniul medical interesați de patologiile infecțioase și cercetarea clinică și fundamentală în domeniul acestora.
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
