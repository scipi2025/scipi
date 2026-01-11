import { Card, CardContent } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termeni și Condiții",
  description: "Termeni și condiții de utilizare a website-ului SCIPI",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6">Termeni și Condiții</h1>
      <p className="text-sm text-muted-foreground mb-8">Ultima actualizare: Ianuarie 2026</p>

      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptarea Termenilor</h2>
            <p className="text-muted-foreground leading-relaxed">
              Prin accesarea și utilizarea acestui website, acceptați să fiți legat de acești termeni și condiții. 
              Dacă nu sunteți de acord cu oricare dintre acești termeni, vă rugăm să nu utilizați acest website.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">2. Utilizarea Website-ului</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Vă angajați să utilizați acest website doar în scopuri legale și într-un mod care nu încalcă drepturile 
              altor utilizatori. Este interzis:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Să transmiteți conținut ilegal, amenințător, abuziv sau defăimător</li>
              <li>Să încercați să obțineți acces neautorizat la sistemele noastre</li>
              <li>Să interferați cu funcționarea normală a website-ului</li>
              <li>Să copiați sau să distribuiți conținut fără autorizație</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">3. Proprietate Intelectuală</h2>
            <p className="text-muted-foreground leading-relaxed">
              Tot conținutul prezent pe acest website, inclusiv texte, imagini, logo-uri și materiale multimedia, 
              este proprietatea SCIPI sau a partenerilor săi și este protejat de legile drepturilor de autor. 
              Reproducerea, distribuirea sau modificarea conținutului fără permisiune scrisă este interzisă.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">4. Link-uri către Site-uri Terțe</h2>
            <p className="text-muted-foreground leading-relaxed">
              Website-ul nostru poate conține link-uri către site-uri terțe. SCIPI nu este responsabil pentru 
              conținutul sau practicile de confidențialitate ale acestor site-uri externe.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">5. Limitarea Răspunderii</h2>
            <p className="text-muted-foreground leading-relaxed">
              SCIPI nu poate fi tras la răspundere pentru daune directe, indirecte, accidentale sau consecvente 
              rezultate din utilizarea sau imposibilitatea de utilizare a acestui website.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">6. Modificări ale Termenilor</h2>
            <p className="text-muted-foreground leading-relaxed">
              SCIPI își rezervă dreptul de a modifica acești termeni și condiții în orice moment. 
              Modificările intră în vigoare imediat după publicarea pe website.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">7. Legea Aplicabilă</h2>
            <p className="text-muted-foreground leading-relaxed">
              Acești termeni și condiții sunt guvernați de legile României. Orice dispută va fi soluționată 
              de instanțele competente din România.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">8. Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              Pentru întrebări despre acești termeni și condiții, ne puteți contacta la:{" "}
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
