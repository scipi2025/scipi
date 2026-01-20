import { Card, CardContent } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politica de Confidențialitate",
  description: "Politica de confidențialitate și protecția datelor personale conform GDPR",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Politica de Confidențialitate</h1>
      <p className="text-sm text-muted-foreground mb-8">Ultima actualizare: Ianuarie 2026</p>

      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">1. Introducere</h2>
            <p className="text-muted-foreground leading-relaxed">
              Societatea pentru Cercetare și Inovare în Patologii Infecțioase (SCIPI) respectă confidențialitatea 
              datelor dumneavoastră personale și se angajează să le protejeze în conformitate cu Regulamentul General 
              privind Protecția Datelor (GDPR - Regulamentul UE 2016/679).
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">2. Date Personale Colectate</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Colectăm următoarele categorii de date personale:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Date de identificare: nume, prenume</li>
              <li>Date de contact: adresă de email, număr de telefon</li>
              <li>Date profesionale: instituție de afiliare, specializare</li>
              <li>Date tehnice: adresă IP, cookies, date de navigare</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">3. Scopul Prelucrării</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Datele dumneavoastră personale sunt prelucrate pentru:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Gestionarea calității de membru SCIPI</li>
              <li>Comunicarea informațiilor despre evenimente și activități</li>
              <li>Răspunsul la solicitările dumneavoastră</li>
              <li>Îmbunătățirea serviciilor oferite</li>
              <li>Respectarea obligațiilor legale</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">4. Drepturile Dumneavoastră</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Conform GDPR, aveți următoarele drepturi:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Dreptul de acces la datele personale</li>
              <li>Dreptul de rectificare a datelor inexacte</li>
              <li>Dreptul la ștergerea datelor ("dreptul de a fi uitat")</li>
              <li>Dreptul la restricționarea prelucrării</li>
              <li>Dreptul la portabilitatea datelor</li>
              <li>Dreptul de a vă opune prelucrării</li>
              <li>Dreptul de a depune o plângere la ANSPDCP</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">5. Securitatea Datelor</h2>
            <p className="text-muted-foreground leading-relaxed">
              Implementăm măsuri tehnice și organizatorice adecvate pentru a proteja datele dumneavoastră împotriva 
              accesului neautorizat, pierderii, distrugerii sau modificării accidentale.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">6. Perioada de Stocare</h2>
            <p className="text-muted-foreground leading-relaxed">
              Datele personale sunt păstrate pe perioada necesară îndeplinirii scopurilor pentru care au fost colectate 
              sau conform cerințelor legale aplicabile.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">7. Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              Pentru exercitarea drepturilor sau pentru orice întrebări legate de prelucrarea datelor personale, 
              ne puteți contacta la:{" "}
              <a href="mailto:secretariat.scipi@gmail.com" className="text-primary hover:underline">
                secretariat.scipi@gmail.com
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
