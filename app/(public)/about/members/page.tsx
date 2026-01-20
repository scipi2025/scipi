import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCheck, Users, Award, FileText, Sparkles, Heart } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Membri",
  description:
    "Societatea pentru Cercetare și Inovare în Patologii Infecțioase este o comunitate profesională dedicată tuturor celor implicați în practica clinică, educație și cercetare în domeniul bolilor infecțioase.",
};

export default function MembersPage() {
  const memberCategories = [
    {
      icon: UserCheck,
      title: "Membri activi titulari",
      description:
        "Pot fi profesioniști din domeniul medical cu experiență academică, clinică sau de cercetare în bolile infecțioase ori domenii conexe, implicați direct în activitățile și direcțiile strategice ale societății.",
      color: "primary",
    },
    {
      icon: Users,
      title: "Membri asociați",
      description:
        "Pot fi profesioniști din domeniul medical sau persoane cu interes pentru activitatea societății, cu acces la programele, evenimentele și inițiativele societății.",
      color: "blue",
    },
    {
      icon: Award,
      title: "Membri de onoare",
      description:
        "Titlu onorific oferit de Consiliul Director unor personalități științifice sau academice cu contribuții remarcabile în domeniul bolilor infecțioase, care oferă prestigiu și sprijin moral societății.",
      color: "amber",
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
      <Card className="border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-transparent">
        <CardContent className="pt-6 pb-6">
          <div className="flex gap-4">
            <div className="hidden sm:flex size-12 items-center justify-center rounded-xl bg-primary/10 shrink-0">
              <Users className="size-6 text-primary" />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-primary">Comunitatea SCIPI</h3>
              <p className="text-base leading-relaxed text-muted-foreground">
                <strong className="text-foreground">Societatea pentru Cercetare și Inovare în Patologii Infecțioase</strong> este o comunitate profesională dedicată tuturor celor implicați în practica clinică, educație și cercetare în domeniul bolilor infecțioase și a specialităților conexe.
              </p>
              <p className="text-base leading-relaxed text-muted-foreground">
                În conformitate cu statutul societății, există trei categorii de membri — <strong className="text-foreground">membri activi titulari</strong>, <strong className="text-foreground">membri asociați</strong> și <strong className="text-foreground">membri de onoare</strong> — fiecare având drepturi și responsabilități adaptate nivelului de implicare.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Participation Info */}
      <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-transparent">
        <CardContent className="pt-6 pb-6">
          <div className="flex gap-4">
            <div className="hidden sm:flex size-12 items-center justify-center rounded-xl bg-blue-500/10 shrink-0">
              <Heart className="size-6 text-blue-500" />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-blue-600">Participare deschisă</h3>
              <p className="text-base leading-relaxed text-muted-foreground">
                Participarea la evenimentele, proiectele de cercetare și alte activități organizate de SCIPI <strong className="text-foreground">nu este limitată la membrii societății</strong>. Acestea sunt deschise tuturor profesioniștilor interesați.
              </p>
              <p className="text-base leading-relaxed text-muted-foreground">
                Pentru a fi la curent cu oportunitățile de implicare, recomandăm consultarea periodică a secțiunii{" "}
                <Link href="/" className="text-blue-600 font-semibold hover:underline inline-flex items-center gap-1">
                  Noutăți
                  <Sparkles className="size-4" />
                </Link>
                , unde sunt publicate informații actualizate despre proiecte de cercetare, evenimente științifice și modalități de implicare sau participare.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Member Categories */}
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Categorii de membri</h2>
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
          <h2 className="text-3xl font-bold tracking-tight mb-2">Procesul de înscriere</h2>
          <div className="h-1 w-16 bg-primary rounded-full" />
        </div>

        <Card className="border-l-4 border-l-primary">
          <CardContent className="pt-6">
            <p className="text-lg leading-relaxed mb-4 text-justify">
              Procesul de înscriere în Societatea pentru Cercetare și Inovare în Patologii Infecțioase presupune transmiterea unei cereri de aderare ca membru activ titular sau membru asociat, care este analizată și validată de către Consiliul Director al societății.
            </p>
            <p className="text-lg leading-relaxed mb-4 text-justify">
              După validarea cererii, calitatea de membru este confirmată prin achitarea taxei anuale de membru, stabilită la <strong>500 lei</strong> pentru membrii activi și <strong>200 lei</strong> pentru membrii asociați.
            </p>
            <p className="text-lg leading-relaxed text-justify">
              Pentru a aplica, te invităm să completezi formularul online de înscriere. Răspunsul privind cererea de înscriere va fi transmis prin e-mail în termen de maximum 7 zile de la depunerea acesteia.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Application Form Button */}
      <div className="flex justify-center">
        <Button size="lg" asChild>
          <Link href="/about/members/apply">
            <FileText className="mr-2 size-4" />
            Completează formularul de înscriere
          </Link>
        </Button>
      </div>
    </div>
  );
}
