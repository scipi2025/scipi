import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCheck, Users, Award, FileText, Mail } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Membri",
  description:
    "Societatea include trei categorii de membri: membri activi titulari, membri asociați și membri de onoare, fiecare având roluri și drepturi specifice în funcție de nivelul de implicare.",
};

export default function MembersPage() {
  const memberCategories = [
    {
      icon: UserCheck,
      title: "Membri Activi Titulari",
      fee: "500 lei/an",
      description:
        "Pot fi profesioniști din domeniul medical cu experiență academică, clinică sau de cercetare în bolile infecțioase ori domenii conexe, implicați direct, cu rol decizional, în activitățile și direcțiile strategice ale Societății.",
      featured: true,
    },
    {
      icon: Users,
      title: "Membri Asociați",
      fee: "200 lei/an",
      description:
        "Pot profesioniști din domeniul medical sau persoane cu interes pentru activitatea Societății, fără rol decizional, dar cu acces la programele, evenimentele și inițiativele Societății.",
    },
    {
      icon: Award,
      title: "Membri de Onoare",
      fee: "Titlu onorific",
      description:
        "Titlu onorific oferit de Consiliul Director unor personalități științifice sau academice cu contribuții remarcabile în domeniul bolilor infecțioase, care oferă prestigiu și sprijin moral Societății.",
      honorary: true,
    },
  ];

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Membri</h1>
        <div className="h-1 w-20 bg-primary rounded-full" />
      </div>

      {/* Introduction */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-lg leading-relaxed">
            Societatea include trei categorii de membri: <strong>membri activi titulari</strong>, <strong>membri asociați</strong> și <strong>membri de onoare</strong>, fiecare având roluri și drepturi specifice în funcție de nivelul de implicare.
          </p>
        </CardContent>
      </Card>

      {/* Member Categories */}
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Categorii de Membri</h2>
          <div className="h-1 w-16 bg-primary rounded-full" />
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {memberCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Card
                key={index}
                className={`group hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col ${
                  category.featured ? "border-2 border-primary" : "border-2"
                } ${category.honorary ? "border-2 border-amber-500" : ""}`}
              >
                {/* Header Badge - Always present to maintain alignment */}
                <div className="h-12 flex -mt-7 items-center justify-center">
                  {category.featured && (
                    <div className="w-full bg-primary text-primary-foreground text-center py-3 text-sm font-semibold tracking-wide">
                      ROL DECIZIONAL
                    </div>
                  )}
                  {category.honorary && (
                    <div className="w-full bg-amber-500 text-white text-center py-3 text-sm font-semibold tracking-wide">
                      TITLU ONORIFIC
                    </div>
                  )}
                  {!category.featured && !category.honorary && (
                    <div className="w-full py-3"></div>
                  )}
                </div>

                <CardContent className="pt-8 pb-8 px-6 flex-1">
                  <div className="flex flex-col items-center text-center space-y-6">
                    {/* Icon */}
                    <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Icon className="size-8 text-primary" />
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-xl font-bold leading-tight">
                      {category.title}
                    </h3>
                    
                    {/* Fee */}
                    <div className="w-full py-3 px-4 bg-primary/5 rounded-lg">
                      <span className="text-3xl font-bold text-primary">{category.fee}</span>
                    </div>
                    
                    {/* Description */}
                    <p className="text-sm leading-relaxed text-muted-foreground text-left">
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
          <h2 className="text-3xl font-bold tracking-tight mb-2">Procesul de Înscriere</h2>
          <div className="h-1 w-16 bg-primary rounded-full" />
        </div>

        <Card className="border-l-4 border-l-primary">
          <CardContent className="pt-6">
            <p className="text-lg leading-relaxed mb-6">
              Înscrierea în Societatea pentru Cercetare și Inovare în Patologii Infecțioase se face doar prin <strong>validarea cererii de aderare</strong> ca membru activ titular sau membru asociat de către <strong>Consiliul Director</strong> și <strong>plata anuală a taxei de membru</strong>, în valoare de <strong>500 lei</strong> pentru membrii activi și <strong>200 lei</strong> pentru membrii asociați.
            </p>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Completează formularul online de înscriere pentru a deveni membru SCIPI.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Application Form & Contact */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Online Application Form */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4">
              <h3 className="text-xl font-bold">Formular de Înscriere Online</h3>
              <p className="text-muted-foreground">
                Completează formularul online pentru a aplica pentru calitatea de membru SCIPI.
              </p>
              <Button size="lg" className="w-full" asChild>
                <Link href="/about/members/apply">
                  <FileText className="mr-2 size-4" />
                  Completează Formularul
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        
      </div>
    </div>
  );
}

