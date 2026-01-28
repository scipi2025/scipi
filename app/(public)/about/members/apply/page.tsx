"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Send, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";

export default function MembershipApplicationPage() {
  const { t, language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    country: "",
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

  // Lista completă de țări
  const countries = [
    { code: "AF", nameRo: "Afganistan", nameEn: "Afghanistan" },
    { code: "AL", nameRo: "Albania", nameEn: "Albania" },
    { code: "DZ", nameRo: "Algeria", nameEn: "Algeria" },
    { code: "AD", nameRo: "Andorra", nameEn: "Andorra" },
    { code: "AO", nameRo: "Angola", nameEn: "Angola" },
    { code: "AG", nameRo: "Antigua și Barbuda", nameEn: "Antigua and Barbuda" },
    { code: "AR", nameRo: "Argentina", nameEn: "Argentina" },
    { code: "AM", nameRo: "Armenia", nameEn: "Armenia" },
    { code: "AU", nameRo: "Australia", nameEn: "Australia" },
    { code: "AT", nameRo: "Austria", nameEn: "Austria" },
    { code: "AZ", nameRo: "Azerbaidjan", nameEn: "Azerbaijan" },
    { code: "BS", nameRo: "Bahamas", nameEn: "Bahamas" },
    { code: "BH", nameRo: "Bahrain", nameEn: "Bahrain" },
    { code: "BD", nameRo: "Bangladesh", nameEn: "Bangladesh" },
    { code: "BB", nameRo: "Barbados", nameEn: "Barbados" },
    { code: "BY", nameRo: "Belarus", nameEn: "Belarus" },
    { code: "BE", nameRo: "Belgia", nameEn: "Belgium" },
    { code: "BZ", nameRo: "Belize", nameEn: "Belize" },
    { code: "BJ", nameRo: "Benin", nameEn: "Benin" },
    { code: "BT", nameRo: "Bhutan", nameEn: "Bhutan" },
    { code: "BO", nameRo: "Bolivia", nameEn: "Bolivia" },
    { code: "BA", nameRo: "Bosnia și Herțegovina", nameEn: "Bosnia and Herzegovina" },
    { code: "BW", nameRo: "Botswana", nameEn: "Botswana" },
    { code: "BR", nameRo: "Brazilia", nameEn: "Brazil" },
    { code: "BN", nameRo: "Brunei", nameEn: "Brunei" },
    { code: "BG", nameRo: "Bulgaria", nameEn: "Bulgaria" },
    { code: "BF", nameRo: "Burkina Faso", nameEn: "Burkina Faso" },
    { code: "BI", nameRo: "Burundi", nameEn: "Burundi" },
    { code: "KH", nameRo: "Cambodgia", nameEn: "Cambodia" },
    { code: "CM", nameRo: "Camerun", nameEn: "Cameroon" },
    { code: "CA", nameRo: "Canada", nameEn: "Canada" },
    { code: "CV", nameRo: "Capul Verde", nameEn: "Cape Verde" },
    { code: "CF", nameRo: "Republica Centrafricană", nameEn: "Central African Republic" },
    { code: "TD", nameRo: "Ciad", nameEn: "Chad" },
    { code: "CL", nameRo: "Chile", nameEn: "Chile" },
    { code: "CN", nameRo: "China", nameEn: "China" },
    { code: "CO", nameRo: "Columbia", nameEn: "Colombia" },
    { code: "KM", nameRo: "Comore", nameEn: "Comoros" },
    { code: "CG", nameRo: "Congo", nameEn: "Congo" },
    { code: "CD", nameRo: "Republica Democrată Congo", nameEn: "Democratic Republic of the Congo" },
    { code: "CR", nameRo: "Costa Rica", nameEn: "Costa Rica" },
    { code: "HR", nameRo: "Croația", nameEn: "Croatia" },
    { code: "CU", nameRo: "Cuba", nameEn: "Cuba" },
    { code: "CY", nameRo: "Cipru", nameEn: "Cyprus" },
    { code: "CZ", nameRo: "Cehia", nameEn: "Czech Republic" },
    { code: "DK", nameRo: "Danemarca", nameEn: "Denmark" },
    { code: "DJ", nameRo: "Djibouti", nameEn: "Djibouti" },
    { code: "DM", nameRo: "Dominica", nameEn: "Dominica" },
    { code: "DO", nameRo: "Republica Dominicană", nameEn: "Dominican Republic" },
    { code: "EC", nameRo: "Ecuador", nameEn: "Ecuador" },
    { code: "EG", nameRo: "Egipt", nameEn: "Egypt" },
    { code: "SV", nameRo: "El Salvador", nameEn: "El Salvador" },
    { code: "GQ", nameRo: "Guineea Ecuatorială", nameEn: "Equatorial Guinea" },
    { code: "ER", nameRo: "Eritreea", nameEn: "Eritrea" },
    { code: "EE", nameRo: "Estonia", nameEn: "Estonia" },
    { code: "SZ", nameRo: "Eswatini", nameEn: "Eswatini" },
    { code: "ET", nameRo: "Etiopia", nameEn: "Ethiopia" },
    { code: "FJ", nameRo: "Fiji", nameEn: "Fiji" },
    { code: "FI", nameRo: "Finlanda", nameEn: "Finland" },
    { code: "FR", nameRo: "Franța", nameEn: "France" },
    { code: "GA", nameRo: "Gabon", nameEn: "Gabon" },
    { code: "GM", nameRo: "Gambia", nameEn: "Gambia" },
    { code: "GE", nameRo: "Georgia", nameEn: "Georgia" },
    { code: "DE", nameRo: "Germania", nameEn: "Germany" },
    { code: "GH", nameRo: "Ghana", nameEn: "Ghana" },
    { code: "GR", nameRo: "Grecia", nameEn: "Greece" },
    { code: "GD", nameRo: "Grenada", nameEn: "Grenada" },
    { code: "GT", nameRo: "Guatemala", nameEn: "Guatemala" },
    { code: "GN", nameRo: "Guineea", nameEn: "Guinea" },
    { code: "GW", nameRo: "Guineea-Bissau", nameEn: "Guinea-Bissau" },
    { code: "GY", nameRo: "Guyana", nameEn: "Guyana" },
    { code: "HT", nameRo: "Haiti", nameEn: "Haiti" },
    { code: "HN", nameRo: "Honduras", nameEn: "Honduras" },
    { code: "HU", nameRo: "Ungaria", nameEn: "Hungary" },
    { code: "IS", nameRo: "Islanda", nameEn: "Iceland" },
    { code: "IN", nameRo: "India", nameEn: "India" },
    { code: "ID", nameRo: "Indonezia", nameEn: "Indonesia" },
    { code: "IR", nameRo: "Iran", nameEn: "Iran" },
    { code: "IQ", nameRo: "Irak", nameEn: "Iraq" },
    { code: "IE", nameRo: "Irlanda", nameEn: "Ireland" },
    { code: "IL", nameRo: "Israel", nameEn: "Israel" },
    { code: "IT", nameRo: "Italia", nameEn: "Italy" },
    { code: "CI", nameRo: "Coasta de Fildeș", nameEn: "Ivory Coast" },
    { code: "JM", nameRo: "Jamaica", nameEn: "Jamaica" },
    { code: "JP", nameRo: "Japonia", nameEn: "Japan" },
    { code: "JO", nameRo: "Iordania", nameEn: "Jordan" },
    { code: "KZ", nameRo: "Kazahstan", nameEn: "Kazakhstan" },
    { code: "KE", nameRo: "Kenya", nameEn: "Kenya" },
    { code: "KI", nameRo: "Kiribati", nameEn: "Kiribati" },
    { code: "KP", nameRo: "Coreea de Nord", nameEn: "North Korea" },
    { code: "KR", nameRo: "Coreea de Sud", nameEn: "South Korea" },
    { code: "KW", nameRo: "Kuweit", nameEn: "Kuwait" },
    { code: "KG", nameRo: "Kârgâzstan", nameEn: "Kyrgyzstan" },
    { code: "LA", nameRo: "Laos", nameEn: "Laos" },
    { code: "LV", nameRo: "Letonia", nameEn: "Latvia" },
    { code: "LB", nameRo: "Liban", nameEn: "Lebanon" },
    { code: "LS", nameRo: "Lesotho", nameEn: "Lesotho" },
    { code: "LR", nameRo: "Liberia", nameEn: "Liberia" },
    { code: "LY", nameRo: "Libia", nameEn: "Libya" },
    { code: "LI", nameRo: "Liechtenstein", nameEn: "Liechtenstein" },
    { code: "LT", nameRo: "Lituania", nameEn: "Lithuania" },
    { code: "LU", nameRo: "Luxemburg", nameEn: "Luxembourg" },
    { code: "MG", nameRo: "Madagascar", nameEn: "Madagascar" },
    { code: "MW", nameRo: "Malawi", nameEn: "Malawi" },
    { code: "MY", nameRo: "Malaezia", nameEn: "Malaysia" },
    { code: "MV", nameRo: "Maldive", nameEn: "Maldives" },
    { code: "ML", nameRo: "Mali", nameEn: "Mali" },
    { code: "MT", nameRo: "Malta", nameEn: "Malta" },
    { code: "MH", nameRo: "Insulele Marshall", nameEn: "Marshall Islands" },
    { code: "MR", nameRo: "Mauritania", nameEn: "Mauritania" },
    { code: "MU", nameRo: "Mauritius", nameEn: "Mauritius" },
    { code: "MX", nameRo: "Mexic", nameEn: "Mexico" },
    { code: "FM", nameRo: "Micronezia", nameEn: "Micronesia" },
    { code: "MD", nameRo: "Moldova", nameEn: "Moldova" },
    { code: "MC", nameRo: "Monaco", nameEn: "Monaco" },
    { code: "MN", nameRo: "Mongolia", nameEn: "Mongolia" },
    { code: "ME", nameRo: "Muntenegru", nameEn: "Montenegro" },
    { code: "MA", nameRo: "Maroc", nameEn: "Morocco" },
    { code: "MZ", nameRo: "Mozambic", nameEn: "Mozambique" },
    { code: "MM", nameRo: "Myanmar", nameEn: "Myanmar" },
    { code: "NA", nameRo: "Namibia", nameEn: "Namibia" },
    { code: "NR", nameRo: "Nauru", nameEn: "Nauru" },
    { code: "NP", nameRo: "Nepal", nameEn: "Nepal" },
    { code: "NL", nameRo: "Olanda", nameEn: "Netherlands" },
    { code: "NZ", nameRo: "Noua Zeelandă", nameEn: "New Zealand" },
    { code: "NI", nameRo: "Nicaragua", nameEn: "Nicaragua" },
    { code: "NE", nameRo: "Niger", nameEn: "Niger" },
    { code: "NG", nameRo: "Nigeria", nameEn: "Nigeria" },
    { code: "MK", nameRo: "Macedonia de Nord", nameEn: "North Macedonia" },
    { code: "NO", nameRo: "Norvegia", nameEn: "Norway" },
    { code: "OM", nameRo: "Oman", nameEn: "Oman" },
    { code: "PK", nameRo: "Pakistan", nameEn: "Pakistan" },
    { code: "PW", nameRo: "Palau", nameEn: "Palau" },
    { code: "PS", nameRo: "Palestina", nameEn: "Palestine" },
    { code: "PA", nameRo: "Panama", nameEn: "Panama" },
    { code: "PG", nameRo: "Papua Noua Guinee", nameEn: "Papua New Guinea" },
    { code: "PY", nameRo: "Paraguay", nameEn: "Paraguay" },
    { code: "PE", nameRo: "Peru", nameEn: "Peru" },
    { code: "PH", nameRo: "Filipine", nameEn: "Philippines" },
    { code: "PL", nameRo: "Polonia", nameEn: "Poland" },
    { code: "PT", nameRo: "Portugalia", nameEn: "Portugal" },
    { code: "QA", nameRo: "Qatar", nameEn: "Qatar" },
    { code: "RO", nameRo: "România", nameEn: "Romania" },
    { code: "RU", nameRo: "Rusia", nameEn: "Russia" },
    { code: "RW", nameRo: "Rwanda", nameEn: "Rwanda" },
    { code: "KN", nameRo: "Saint Kitts și Nevis", nameEn: "Saint Kitts and Nevis" },
    { code: "LC", nameRo: "Saint Lucia", nameEn: "Saint Lucia" },
    { code: "VC", nameRo: "Saint Vincent și Grenadine", nameEn: "Saint Vincent and the Grenadines" },
    { code: "WS", nameRo: "Samoa", nameEn: "Samoa" },
    { code: "SM", nameRo: "San Marino", nameEn: "San Marino" },
    { code: "ST", nameRo: "São Tomé și Príncipe", nameEn: "São Tomé and Príncipe" },
    { code: "SA", nameRo: "Arabia Saudită", nameEn: "Saudi Arabia" },
    { code: "SN", nameRo: "Senegal", nameEn: "Senegal" },
    { code: "RS", nameRo: "Serbia", nameEn: "Serbia" },
    { code: "SC", nameRo: "Seychelles", nameEn: "Seychelles" },
    { code: "SL", nameRo: "Sierra Leone", nameEn: "Sierra Leone" },
    { code: "SG", nameRo: "Singapore", nameEn: "Singapore" },
    { code: "SK", nameRo: "Slovacia", nameEn: "Slovakia" },
    { code: "SI", nameRo: "Slovenia", nameEn: "Slovenia" },
    { code: "SB", nameRo: "Insulele Solomon", nameEn: "Solomon Islands" },
    { code: "SO", nameRo: "Somalia", nameEn: "Somalia" },
    { code: "ZA", nameRo: "Africa de Sud", nameEn: "South Africa" },
    { code: "SS", nameRo: "Sudanul de Sud", nameEn: "South Sudan" },
    { code: "ES", nameRo: "Spania", nameEn: "Spain" },
    { code: "LK", nameRo: "Sri Lanka", nameEn: "Sri Lanka" },
    { code: "SD", nameRo: "Sudan", nameEn: "Sudan" },
    { code: "SR", nameRo: "Surinam", nameEn: "Suriname" },
    { code: "SE", nameRo: "Suedia", nameEn: "Sweden" },
    { code: "CH", nameRo: "Elveția", nameEn: "Switzerland" },
    { code: "SY", nameRo: "Siria", nameEn: "Syria" },
    { code: "TW", nameRo: "Taiwan", nameEn: "Taiwan" },
    { code: "TJ", nameRo: "Tadjikistan", nameEn: "Tajikistan" },
    { code: "TZ", nameRo: "Tanzania", nameEn: "Tanzania" },
    { code: "TH", nameRo: "Thailanda", nameEn: "Thailand" },
    { code: "TL", nameRo: "Timorul de Est", nameEn: "Timor-Leste" },
    { code: "TG", nameRo: "Togo", nameEn: "Togo" },
    { code: "TO", nameRo: "Tonga", nameEn: "Tonga" },
    { code: "TT", nameRo: "Trinidad și Tobago", nameEn: "Trinidad and Tobago" },
    { code: "TN", nameRo: "Tunisia", nameEn: "Tunisia" },
    { code: "TR", nameRo: "Turcia", nameEn: "Turkey" },
    { code: "TM", nameRo: "Turkmenistan", nameEn: "Turkmenistan" },
    { code: "TV", nameRo: "Tuvalu", nameEn: "Tuvalu" },
    { code: "UG", nameRo: "Uganda", nameEn: "Uganda" },
    { code: "UA", nameRo: "Ucraina", nameEn: "Ukraine" },
    { code: "AE", nameRo: "Emiratele Arabe Unite", nameEn: "United Arab Emirates" },
    { code: "GB", nameRo: "Regatul Unit", nameEn: "United Kingdom" },
    { code: "US", nameRo: "Statele Unite ale Americii", nameEn: "United States" },
    { code: "UY", nameRo: "Uruguay", nameEn: "Uruguay" },
    { code: "UZ", nameRo: "Uzbekistan", nameEn: "Uzbekistan" },
    { code: "VU", nameRo: "Vanuatu", nameEn: "Vanuatu" },
    { code: "VA", nameRo: "Vatican", nameEn: "Vatican City" },
    { code: "VE", nameRo: "Venezuela", nameEn: "Venezuela" },
    { code: "VN", nameRo: "Vietnam", nameEn: "Vietnam" },
    { code: "YE", nameRo: "Yemen", nameEn: "Yemen" },
    { code: "ZM", nameRo: "Zambia", nameEn: "Zambia" },
    { code: "ZW", nameRo: "Zimbabwe", nameEn: "Zimbabwe" },
  ];

  const professionalGrades = [
    { value: "medic_rezident", label: t("form.residentPhysician") },
    { value: "medic_specialist", label: t("form.specialistPhysician") },
    { value: "medic_primar", label: t("form.seniorPhysician") },
    { value: "student_medicina", label: t("form.medicalStudent") },
    { value: "doctorand", label: t("form.phdStudent") },
    { value: "asistent_medical", label: t("form.nurse") },
    { value: "alta", label: t("form.otherCategory") },
  ];

  const membershipTypes = [
    { value: "membru_activ", label: t("form.activeMember") },
    { value: "membru_asociat", label: t("form.associateMember") },
  ];

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
        throw new Error(data.error || (language === "en" ? "Error submitting application" : "Eroare la trimiterea cererii"));
      }

      setIsSuccess(true);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : (language === "en" ? "An error occurred. Please try again." : "A apărut o eroare. Vă rugăm să încercați din nou.");
      setError(errorMessage);
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
            {language === "en" ? "Back to Members" : "Înapoi la Membri"}
          </Link>
        </Button>

        <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <CheckCircle2 className="size-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold">
                {language === "en" ? "Application Submitted Successfully!" : "Cerere Trimisă cu Succes!"}
              </h2>
              <p className="text-muted-foreground">
                {language === "en" 
                  ? "Thank you for your interest in SRIID. Your application has been registered." 
                  : "Vă mulțumim pentru interesul manifestat față de SCIPI. Cererea dumneavoastră a fost înregistrată."}
              </p>

              <Button asChild className="mt-4">
                <Link href="/about/members">
                  {language === "en" ? "Back to Members Page" : "Înapoi la Pagina Membri"}
                </Link>
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
          {language === "en" ? "Back to Members" : "Înapoi la Membri"}
        </Link>
      </Button>

      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          {t("form.title")}
        </h1>
        <div className="h-1 w-20 bg-primary rounded-full" />
      </div>

      <Card>
        <CardHeader>
          <CardDescription>
            {t("form.intro")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{t("form.personalInfo")}</h3>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{t("form.firstName")} *</Label>
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
                  <Label htmlFor="lastName">{t("form.lastName")} *</Label>
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
                <Label htmlFor="email">{t("form.email")} *</Label>
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

              <div className="space-y-2">
                <Label htmlFor="country">{t("form.country")} *</Label>
                <select
                  id="country"
                  required
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">
                    {language === "en" ? "Select a country" : "Selectează țara"}
                  </option>
                  {countries
                    .sort((a, b) => {
                      const nameA = language === "en" ? a.nameEn : a.nameRo;
                      const nameB = language === "en" ? b.nameEn : b.nameRo;
                      return nameA.localeCompare(nameB);
                    })
                    .map((country) => (
                      <option key={country.code} value={country.code}>
                        {language === "en" ? country.nameEn : country.nameRo}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{t("form.professionalInfo")}</h3>

              <div className="space-y-2">
                <Label htmlFor="professionalGrade">{t("form.professionalGrade")} *</Label>
                <div className="space-y-2">
                  {professionalGrades.map((option) => (
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
                    {language === "en" ? "Specify category" : "Specificați categoria"} *
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
                  {t("form.medicalSpecialty")} *
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
                <Label htmlFor="academicDegree">{t("form.academicDegree")}</Label>
                <Input
                  id="academicDegree"
                  placeholder={language === "en" ? "E.g.: Assistant Professor, Associate Professor, Professor" : "Ex: Asistent universitar, Conferențiar, Profesor"}
                  value={formData.academicDegree}
                  onChange={(e) =>
                    setFormData({ ...formData, academicDegree: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="institutionalAffiliation">
                  {t("form.institutionalAffiliation")} *
                </Label>
                <Input
                  id="institutionalAffiliation"
                  required
                  placeholder={language === "en" ? "E.g.: Clinical Hospital of Infectious Diseases" : "Ex: Spitalul Clinic de Boli Infecțioase Cluj-Napoca"}
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
              <h3 className="text-lg font-semibold">{t("form.membershipType")}</h3>
              <div className="space-y-2">
                {membershipTypes.map((option) => (
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
                {t("form.whyJoin")} *
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
                placeholder={language === "en" ? "Briefly describe your motivation and research interests..." : "Descrieți pe scurt motivația dumneavoastră și interesele de cercetare..."}
              />
            </div>

            {/* Consents */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                {t("form.agreements")}
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
                  {t("form.gdprConsent")} *
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
                  {t("form.feeConsent")} *
                </Label>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">{t("form.optional")}</h4>
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
                    {t("form.newsletterConsent")}
                  </Label>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>{language === "en" ? "Submitting..." : "Trimitere..."}</>
              ) : (
                <>
                  <Send className="mr-2 size-4" />
                  {t("form.submit")}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
