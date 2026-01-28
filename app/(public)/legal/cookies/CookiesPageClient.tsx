"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/lib/language-context";

const content = {
  ro: {
    title: "Politica de Cookie-uri",
    lastUpdate: "Ultima actualizare: Ianuarie 2026",
    sections: [
      {
        title: "1. Introducere",
        content: "Prezenta Politică de cookie-uri explică modul în care Societatea pentru Cercetare și Inovare în Patologii Infecțioase (SCIPI) utilizează cookie-uri și tehnologii similare pe website-ul său. Această politică trebuie citită împreună cu Politica de confidențialitate și Termenii și condițiile."
      },
      {
        title: "2. Ce sunt cookie-urile?",
        content: "Cookie-urile sunt fișiere de mici dimensiuni, stocate pe dispozitivul utilizatorului, care permit recunoașterea acestuia și îmbunătățirea experienței de navigare."
      },
      {
        title: "3. Tipuri de cookie-uri utilizate",
        content: "",
        subsections: [
          {
            subtitle: "Cookie-uri strict necesare",
            description: "Acestea sunt esențiale pentru funcționarea corectă a website-ului și nu necesită consimțământ:",
            items: [
              "cookie-uri de sesiune",
              "cookie-uri de securitate",
              "cookie-uri pentru reținerea preferințelor tehnice"
            ]
          },
          {
            subtitle: "Cookie-uri de analiză și performanță",
            description: "Aceste cookie-uri sunt utilizate pentru a colecta informații statistice anonime privind utilizarea website-ului:",
            items: [
              "număr de vizitatori",
              "pagini accesate",
              "durata sesiunilor"
            ],
            extra: "Datele sunt utilizate exclusiv în scop intern, pentru optimizarea conținutului și funcționalității."
          }
        ]
      },
      {
        title: "4. Gestionarea cookie-urilor",
        content: "Utilizatorii pot controla sau șterge cookie-urile din setările browserului. Dezactivarea anumitor cookie-uri poate afecta funcționalitatea website-ului.",
        extraContent: "Pentru mai multe informații despre gestionarea cookies în browserul dumneavoastră, consultați secțiunea de ajutor a browserului sau vizitați",
        link: {
          url: "https://www.aboutcookies.org",
          text: "www.aboutcookies.org"
        }
      },
      {
        title: "5. Modificări ale politicii",
        content: "SCIPI poate modifica prezenta politică pentru a reflecta schimbările tehnice sau legislative. Orice modificări vor fi publicate pe această pagină cu data actualizării."
      },
      {
        title: "6. Contact",
        content: "Pentru întrebări legate de cookie-uri ne puteți contacta la",
        email: "secretariat.scipi@gmail.com"
      }
    ]
  },
  en: {
    title: "Cookie Policy",
    lastUpdate: "Last updated: January 2026",
    sections: [
      {
        title: "1. Introduction",
        content: "This Cookie Policy explains how the Society for Research and Innovation in Infectious Diseases (SRIID) uses cookies and similar technologies on its website. This policy should be read together with the Privacy policy and the Terms and conditions."
      },
      {
        title: "2. What are cookies?",
        content: "Cookies are small files stored on the user's device that allow recognition of the device and help improve the browsing experience."
      },
      {
        title: "3. Types of cookies used",
        content: "",
        subsections: [
          {
            subtitle: "Strictly necessary cookies",
            description: "These cookies are essential for the proper functioning of the website and do not require user consent:",
            items: [
              "session cookies",
              "security cookies",
              "cookies used to retain technical preferences"
            ]
          },
          {
            subtitle: "Analytics and performance cookies",
            description: "These cookies are used to collect anonymous statistical information regarding website usage, such as:",
            items: [
              "number of visitors",
              "pages accessed",
              "session duration"
            ],
            extra: "The data are used exclusively for internal purposes, to optimize website content and functionality."
          }
        ]
      },
      {
        title: "4. Cookie management",
        content: "Users may control or delete cookies through their browser settings. Disabling certain cookies may affect website functionality.",
        extraContent: "For more information on managing cookies in your browser, please consult your browser's help section or visit",
        link: {
          url: "https://www.aboutcookies.org",
          text: "www.aboutcookies.org"
        }
      },
      {
        title: "5. Policy updates",
        content: "SRIID may update this policy to reflect technical or legislative changes. Any updates will be published on this page along with the date of revision."
      },
      {
        title: "6. Contact",
        content: "For questions regarding cookies, please contact us at",
        email: "secretariat.scipi@gmail.com"
      }
    ]
  }
};

interface Section {
  title: string;
  content: string;
  list?: string[];
  extraContent?: string;
  email?: string;
  link?: { url: string; text: string };
  subsections?: {
    subtitle: string;
    description: string;
    items: string[];
    extra?: string;
  }[];
}

export function CookiesPageClient() {
  const { language } = useLanguage();
  const t = content[language];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">{t.title}</h1>
      <p className="text-sm text-muted-foreground mb-8">{t.lastUpdate}</p>

      <div className="space-y-6">
        {t.sections.map((section: Section, index: number) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
              
              {section.content && (
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
              )}

              {section.subsections && section.subsections.map((sub, subIndex) => (
                <div key={subIndex} className={subIndex > 0 ? "mt-6" : ""}>
                  <h3 className="text-lg font-semibold mb-2">{sub.subtitle}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    {sub.description}
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    {sub.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                  {sub.extra && (
                    <p className="text-muted-foreground leading-relaxed mt-3">
                      {sub.extra}
                    </p>
                  )}
                </div>
              ))}

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
                  {section.link && (
                    <>
                      {" "}
                      <a 
                        href={section.link.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-primary hover:underline"
                      >
                        {section.link.text}
                      </a>
                    </>
                  )}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
