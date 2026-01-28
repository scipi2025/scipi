"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/lib/language-context";

const content = {
  ro: {
    title: "Termeni și Condiții",
    lastUpdate: "Ultima actualizare: Ianuarie 2026",
    sections: [
      {
        title: "1. Dispoziții generale",
        content: "Prezentul document stabilește termenii și condițiile de utilizare a website-ului aparținând Societății pentru Cercetare și Inovare în Patologii Infecțioase (SCIPI). Accesarea, navigarea sau utilizarea website-ului implică acceptarea integrală și necondiționată a prezentelor prevederi, precum și a Politicii de confidențialitate și a Politicii de cookie-uri, documente care fac parte integrantă din cadrul juridic aplicabil."
      },
      {
        title: "2. Scopul website-ului",
        content: "Website-ul SCIPI are un caracter informativ, educațional și instituțional, fiind destinat:",
        list: [
          "prezentării activităților științifice, educaționale și de cercetare",
          "comunicării cu membrii, colaboratorii și publicul interesat",
          "promovării proiectelor, evenimentelor și inițiativelor SCIPI",
          "facilitării înscrierii la evenimente sau activități academice"
        ],
        extraContent: "Informațiile publicate nu constituie consultanță medicală, juridică sau profesională individualizată."
      },
      {
        title: "3. Condiții de utilizare",
        content: "Utilizatorii se obligă să utilizeze website-ul exclusiv în scopuri legale și legitime. Este strict interzis:",
        list: [
          "transmiterea de conținut ilegal, discriminatoriu, defăimător, amenințător sau contrar ordinii publice",
          "tentativa de acces neautorizat la sisteme, conturi sau baze de date",
          "introducerea de viruși, malware sau alte elemente care pot afecta securitatea platformei",
          "copierea, reproducerea sau redistribuirea conținutului fără acord scris",
          "utilizarea website-ului într-un mod care poate prejudicia imaginea, activitatea sau interesele SCIPI"
        ],
        extraContent: "SCIPI își rezervă dreptul de a restricționa accesul utilizatorilor care încalcă aceste prevederi."
      },
      {
        title: "4. Drepturi de proprietate intelectuală",
        content: "Întregul conținut al website-ului (texte, materiale științifice, imagini, logo-uri, elemente grafice, baze de date) este protejat de legislația privind drepturile de autor și aparține SCIPI sau partenerilor săi. Utilizarea conținutului este permisă exclusiv în scop personal, non-comercial, cu indicarea sursei, dacă nu se prevede altfel."
      },
      {
        title: "5. Răspundere și limitări",
        content: "SCIPI depune eforturi pentru a asigura corectitudinea și actualizarea informațiilor publicate, însă nu garantează absența erorilor sau caracterul exhaustiv al conținutului. SCIPI nu răspunde pentru:",
        list: [
          "eventuale erori, omisiuni sau interpretări eronate",
          "indisponibilitatea temporară a website-ului",
          "daune directe sau indirecte rezultate din utilizarea informațiilor",
          "vulnerabilități externe care nu țin de controlul său"
        ],
        extraContent: "Utilizarea website-ului se face pe propria răspundere a utilizatorului."
      },
      {
        title: "6. Link-uri către terți",
        content: "Website-ul poate conține link-uri către site-uri externe. SCIPI nu controlează și nu își asumă responsabilitatea pentru conținutul, politicile sau practicile acestora."
      },
      {
        title: "7. Modificări",
        content: "SCIPI își rezervă dreptul de a modifica prezentul document în orice moment. Versiunea actualizată va fi publicată pe website și produce efecte de la data publicării."
      },
      {
        title: "8. Legea aplicabilă și jurisdicția",
        content: "Prezentul document este guvernat de legislația română. Orice litigiu va fi soluționat de instanțele competente din România."
      },
      {
        title: "9. Contact",
        content: "Pentru orice întrebări sau sesizări ne puteți contacta la",
        email: "secretariat.scipi@gmail.com"
      }
    ]
  },
  en: {
    title: "Terms and Conditions",
    lastUpdate: "Last updated: January 2026",
    sections: [
      {
        title: "1. General provisions",
        content: "This document sets out the terms and conditions governing the use of the website belonging to the Society for Research and Innovation in Infectious Diseases (SRIID). Accessing, browsing, or using the website implies full and unconditional acceptance of these Terms and Conditions, as well as the Privacy Policy and the Cookie Policy, which form an integral part of the applicable legal framework."
      },
      {
        title: "2. Purpose of the website",
        content: "The SRIID website has an informational, educational, and institutional purpose and is intended for:",
        list: [
          "presenting scientific, educational, and research activities",
          "communicating with members, collaborators, and the interested public",
          "promoting SRIID projects, events, and initiatives",
          "facilitating registration for events or academic activities"
        ],
        extraContent: "The information published on this website does not constitute individualized medical, legal, or professional advice."
      },
      {
        title: "3. Terms of use",
        content: "Users undertake to use the website exclusively for lawful and legitimate purposes. The following are strictly prohibited:",
        list: [
          "transmitting illegal, discriminatory, defamatory, threatening, or public-order–infringing content",
          "attempting unauthorized access to systems, accounts, or databases",
          "introducing viruses, malware, or other elements that may compromise platform security",
          "copying, reproducing, or redistributing content without prior written consent",
          "using the website in any manner that may harm the image, activity, or interests of SRIID"
        ],
        extraContent: "SRIID reserves the right to restrict access for users who violate these provisions."
      },
      {
        title: "4. Intellectual property rights",
        content: "All website content (texts, scientific materials, images, logos, graphic elements, databases) is protected by copyright legislation and belongs to SRIID or its partners. Content may be used solely for personal, non-commercial purposes, with proper attribution of the source, unless otherwise specified."
      },
      {
        title: "5. Liability and limitations",
        content: "SRIID makes reasonable efforts to ensure that the information published on the website is accurate and up to date but does not guarantee the absence of errors or the completeness of the content. SRIID shall not be liable for:",
        list: [
          "errors, omissions, or misinterpretations of the information provided",
          "temporary unavailability of the website",
          "direct or indirect damages resulting from the use of website information",
          "external vulnerabilities beyond its control"
        ],
        extraContent: "Use of the website is at the user's own risk."
      },
      {
        title: "6. Third-party links",
        content: "The website may contain links to external websites. SRIID does not control and assumes no responsibility for the content, policies, or practices of such third-party sites."
      },
      {
        title: "7. Amendments",
        content: "SRIID reserves the right to amend these Terms and conditions at any time. The updated version will be published on the website and shall take effect upon publication."
      },
      {
        title: "8. Applicable law and jurisdiction",
        content: "These Terms and conditions are governed by Romanian law. Any disputes shall be settled by the competent courts of Romania."
      },
      {
        title: "9. Contact",
        content: "For any questions or concerns, please contact us at",
        email: "secretariat.scipi@gmail.com"
      }
    ]
  }
};

export function TermsPageClient() {
  const { language } = useLanguage();
  const t = content[language];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">{t.title}</h1>
      <p className="text-sm text-muted-foreground mb-8">{t.lastUpdate}</p>

      <div className="space-y-6">
        {t.sections.map((section, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {section.content}
                {section.email && (
                  <>
                    {" "}
                    <a href={`mailto:${section.email}`} className="text-primary hover:underline">
                      {section.email}
                    </a>
                  </>
                )}
              </p>
              {section.list && (
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-3">
                  {section.list.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
              {section.extraContent && (
                <p className="text-muted-foreground leading-relaxed mt-4 whitespace-pre-line">
                  {section.extraContent}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
