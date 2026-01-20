"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Send, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function MembershipApplicationPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    professionalGrade: "",
    otherProfessionalGrade: "",
    medicalSpecialty: "",
    academicDegree: "",
    institutionalAffiliation: "",
    membershipType: "",
    researchInterests: "",
    gdprConsent: false,
    feeConsent: false,
    newsletterConsent: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/membership", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Eroare la trimiterea cererii");
      }

      setIsSuccess(true);
    } catch (err: any) {
      setError(
        err.message || "A apărut o eroare. Vă rugăm să încercați din nou."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" asChild>
          <Link href="/about/members">
            <ArrowLeft className="mr-2 size-4" />
            Înapoi la Membri
          </Link>
        </Button>

        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="flex size-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="size-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold">Cerere Trimisă cu Succes!</h2>
              <p className="text-muted-foreground">
                Vă mulțumim pentru interesul manifestat față de SCIPI. Cererea
                dumneavoastră a fost înregistrată.
              </p>

              <Button asChild className="mt-4">
                <Link href="/about/members">Înapoi la Pagina Membri</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" asChild>
        <Link href="/about/members">
          <ArrowLeft className="mr-2 size-4" />
          Înapoi la Membri
        </Link>
      </Button>

      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Formular pentru dobândirea calității de membru SCIPI
        </h1>
        <div className="h-1 w-20 bg-primary rounded-full" />
      </div>

      <Card>
        <CardHeader>
          <CardDescription>
            Completați formularul de mai jos pentru a aplica pentru calitatea de
            membru SCIPI. Toate câmpurile marcate cu * sunt obligatorii.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Date Personale</h3>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prenume *</Label>
                  <Input
                    id="firstName"
                    required
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Nume *</Label>
                  <Input
                    id="lastName"
                    required
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Date Profesionale</h3>

              <div className="space-y-2">
                <Label htmlFor="professionalGrade">Grad profesional *</Label>
                <div className="space-y-2">
                  {[
                    { value: "medic_rezident", label: "Medic rezident" },
                    { value: "medic_specialist", label: "Medic specialist" },
                    { value: "medic_primar", label: "Medic primar" },
                    { value: "student_medicina", label: "Student medicină" },
                    { value: "asistent_medical", label: "Asistent medical" },
                    { value: "alta", label: "Altă categorie" },
                  ].map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="radio"
                        id={option.value}
                        name="professionalGrade"
                        value={option.value}
                        required
                        checked={formData.professionalGrade === option.value}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            professionalGrade: e.target.value,
                          })
                        }
                        className="size-4"
                      />
                      <Label
                        htmlFor={option.value}
                        className="font-normal cursor-pointer"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {formData.professionalGrade === "alta" && (
                <div className="space-y-2">
                  <Label htmlFor="otherProfessionalGrade">
                    Specificați categoria *
                  </Label>
                  <Input
                    id="otherProfessionalGrade"
                    required
                    value={formData.otherProfessionalGrade}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        otherProfessionalGrade: e.target.value,
                      })
                    }
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="medicalSpecialty">
                  Specialitate medicală *
                </Label>
                <Input
                  id="medicalSpecialty"
                  required
                  value={formData.medicalSpecialty}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      medicalSpecialty: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="academicDegree">Grad didactic</Label>
                <Input
                  id="academicDegree"
                  placeholder="Ex: Asistent universitar, Conferențiar, Profesor"
                  value={formData.academicDegree}
                  onChange={(e) =>
                    setFormData({ ...formData, academicDegree: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="institutionalAffiliation">
                  Afiliere instituțională *
                </Label>
                <Input
                  id="institutionalAffiliation"
                  required
                  placeholder="Ex: Spitalul Clinic de Boli Infecțioase Cluj-Napoca"
                  value={formData.institutionalAffiliation}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      institutionalAffiliation: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            {/* Membership Type */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Tip Membru</h3>
              <div className="space-y-2">
                {[
                  { value: "membru_activ", label: "Membru activ" },
                  { value: "medic_asociat", label: "Medic asociat" },
                ].map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="radio"
                      id={option.value}
                      name="membershipType"
                      value={option.value}
                      required
                      checked={formData.membershipType === option.value}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          membershipType: e.target.value,
                        })
                      }
                      className="size-4"
                    />
                    <Label
                      htmlFor={option.value}
                      className="font-normal cursor-pointer"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Research Interests */}
            <div className="space-y-2">
              <Label htmlFor="researchInterests">
                De ce doriți să fiți membru SCIPI? Descrieți activitatea de
                cercetare sau interesele de cercetare în domeniul patologiilor
                infecțioase. *
              </Label>
              <Textarea
                id="researchInterests"
                required
                rows={6}
                value={formData.researchInterests}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    researchInterests: e.target.value,
                  })
                }
                placeholder="Descrieți pe scurt motivația dumneavoastră și interesele de cercetare..."
              />
            </div>

            {/* Consents */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Acorduri și declarații (obligatoriu)
              </h3>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="gdprConsent"
                  required
                  checked={formData.gdprConsent}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      gdprConsent: checked as boolean,
                    })
                  }
                />
                <Label
                  htmlFor="gdprConsent"
                  className="font-normal leading-relaxed cursor-pointer"
                >
                  Sunt de acord cu prelucrarea datelor cu caracter personal
                  furnizate prin acest formular de către Departamentul Membri al
                  SCIPI, în scopul gestionării cererii de aderare și a evidenței
                  membrilor, conform Politicii de confidențialitate și
                  legislației aplicabile (GDPR). *
                </Label>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="feeConsent"
                  required
                  checked={formData.feeConsent}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, feeConsent: checked as boolean })
                  }
                />
                <Label
                  htmlFor="feeConsent"
                  className="font-normal leading-relaxed cursor-pointer"
                >
                  Declar că am luat la cunoștință că, în cazul acceptării
                  cererii mele de aderare, mă oblig să achit cotizația anuală
                  conform cuantumului și termenelor stabilite de SCIPI. *
                </Label>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Opțional</h4>
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="newsletterConsent"
                    checked={formData.newsletterConsent}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        newsletterConsent: checked as boolean,
                      })
                    }
                  />
                  <Label
                    htmlFor="newsletterConsent"
                    className="font-normal leading-relaxed cursor-pointer"
                  >
                    Sunt de acord să primesc comunicări (newsletter, anunțuri,
                    invitații la evenimente) din partea SCIPI, pe e-mail.
                  </Label>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>Trimitere...</>
              ) : (
                <>
                  <Send className="mr-2 size-4" />
                  Trimite Cererea
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
