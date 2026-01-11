import { Card, CardContent } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politica Cookies",
  description: "Politica de utilizare a cookies pe website-ul SCIPI",
};

export default function CookiesPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6">Politica Cookies</h1>
      <p className="text-sm text-muted-foreground mb-8">Ultima actualizare: Ianuarie 2026</p>

      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">1. Ce sunt Cookies?</h2>
            <p className="text-muted-foreground leading-relaxed">
              Cookies sunt fișiere text mici stocate pe dispozitivul dumneavoastră atunci când vizitați un website. 
              Acestea ajută website-ul să funcționeze corect și să vă ofere o experiență personalizată.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">2. Tipuri de Cookies Utilizate</h2>
            
            <h3 className="text-lg font-semibold mb-2 mt-4">Cookies Esențiale</h3>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Aceste cookies sunt necesare pentru funcționarea de bază a website-ului și nu pot fi dezactivate:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
              <li>Cookies de sesiune pentru autentificare</li>
              <li>Cookies pentru preferințe de navigare</li>
            </ul>

            <h3 className="text-lg font-semibold mb-2 mt-4">Cookies de Performanță</h3>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Aceste cookies ne ajută să înțelegem cum utilizați website-ul:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Analiza traficului și comportamentului utilizatorilor</li>
              <li>Îmbunătățirea experienței utilizatorilor</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">3. Scopul Utilizării Cookies</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Utilizăm cookies pentru:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Asigurarea funcționării corecte a website-ului</li>
              <li>Îmbunătățirea experienței de navigare</li>
              <li>Analiza utilizării website-ului</li>
              <li>Personalizarea conținutului</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">4. Gestionarea Cookies</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Puteți controla și/sau șterge cookies după preferințe. Puteți șterge toate cookies deja prezente 
              pe computer și puteți configura majoritatea browserelor să le blocheze. Totuși, dacă faceți acest lucru, 
              este posibil să fie necesar să ajustați manual unele preferințe de fiecare dată când vizitați un site.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Pentru mai multe informații despre gestionarea cookies în browserul dumneavoastră, consultați 
              secțiunea de ajutor a browserului sau vizitați{" "}
              <a href="https://www.aboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                www.aboutcookies.org
              </a>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">5. Modificări ale Politicii</h2>
            <p className="text-muted-foreground leading-relaxed">
              Ne rezervăm dreptul de a actualiza această politică de cookies. Orice modificări vor fi publicate 
              pe această pagină cu data actualizării.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">6. Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              Pentru întrebări despre utilizarea cookies, ne puteți contacta la:{" "}
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
