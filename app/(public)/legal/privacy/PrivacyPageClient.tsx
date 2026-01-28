"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/lib/language-context";

const content = {
  ro: {
    title: "Politica de Confidențialitate",
    lastUpdate: "Ultima actualizare: Ianuarie 2026",
    sections: [
      {
        title: "1. Introducere",
        content: `Societatea pentru Cercetare și Inovare în Patologii Infecțioase (denumită în continuare SCIPI), persoană juridică fără scop patrimonial, respectă confidențialitatea datelor cu caracter personal ale membrilor, colaboratorilor, participanților la evenimente și vizitatorilor site-ului.

SCIPI prelucrează datele cu caracter personal în conformitate cu Regulamentul (UE) 2016/679 privind protecția datelor (GDPR), cu legislația națională aplicabilă și cu prezenta Politică de Confidențialitate.

Această politică explică ce date colectăm, de ce le colectăm, cum le folosim, cui le putem divulga și ce drepturi aveți.`
      },
      {
        title: "2. Operatorul de date",
        content: "Datele cu caracter personal sunt colectate de Asociația Societatea pentru Cercetare și Inovare în Patologii Infecțioase în scopuri bine determinate, explicite și legitime."
      },
      {
        title: "3. Categorii de date cu caracter personal prelucrate",
        content: "În funcție de interacțiunea dumneavoastră cu SCIPI, putem prelucra următoarele categorii de date:",
        list: [
          "date de identificare: nume și prenume",
          "date de contact: adresă de email, număr de telefon",
          "date profesionale: profesie, specializare, instituție de afiliere, titlu profesional/academic",
          "date privind calitatea de membru: statutul de membru, data înscrierii, participarea la activități și evenimente SCIPI",
          "date tehnice și de utilizare a site-ului: adresă IP, tip de dispozitiv și browser, pagini accesate, durata vizitei, cookie-uri și tehnologii similare"
        ],
        extraContent: "SCIPI nu prelucrează în mod intenționat date sensibile, cu excepția situațiilor în care acestea sunt furnizate voluntar și sunt strict necesare unui scop legitim, cu respectarea garanțiilor legale."
      },
      {
        title: "4. Scopurile și temeiurile legale ale prelucrării",
        content: "Datele cu caracter personal sunt prelucrate în următoarele scopuri:",
        list: [
          "gestionarea și administrarea calității de membru SCIPI",
          "organizarea și desfășurarea evenimentelor științifice, educaționale sau administrative",
          "comunicarea informațiilor privind activitățile, proiectele și inițiativele SCIPI",
          "răspunsul la solicitări, întrebări sau mesaje transmise de dumneavoastră",
          "îmbunătățirea funcționalității și securității site-ului",
          "îndeplinirea obligațiilor legale și statutare",
          "apărarea drepturilor și intereselor legitime ale SCIPI în eventuale proceduri administrative sau judiciare"
        ],
        extraContent: `Prelucrarea se bazează pe unul sau mai multe dintre următoarele temeiuri legale:
• consimțământul persoanei vizate
• obligații legale
• interesul legitim al SCIPI, cu respectarea drepturilor și libertăților fundamentale`
      },
      {
        title: "5. Destinatarii datelor",
        content: `Datele dumneavoastră pot fi divulgate, strict în limita necesității, către autorități publice, în măsura în care există o obligație legală și parteneri instituționali implicați în organizarea evenimentelor, doar dacă este necesar.

SCIPI nu vinde, nu închiriază și nu transferă datele personale către terți în scopuri comerciale.`
      },
      {
        title: "6. Durata stocării",
        content: "Datele cu caracter personal sunt păstrate:",
        list: [
          "pe durata existenței relației cu SCIPI (ex. calitatea de membru)",
          "pe perioada necesară îndeplinirii scopurilor pentru care au fost colectate",
          "conform termenelor impuse de legislația aplicabilă"
        ]
      },
      {
        title: "7. Securitatea datelor",
        content: `SCIPI implementează măsuri tehnice și organizatorice adecvate pentru a proteja datele dumneavoastră împotriva accesului neautorizat, pierderii, distrugerii sau modificării accidentale.

SCIPI nu poate fi trasă la răspundere pentru vulnerabilități care nu îi sunt imputabile.`
      },
      {
        title: "8. Drepturile persoanelor vizate",
        content: "În conformitate cu GDPR, beneficiați de următoarele drepturi:",
        list: [
          "dreptul de acces la date",
          "dreptul la rectificarea datelor inexacte",
          "dreptul la ștergerea datelor (\"dreptul de a fi uitat\"), în limitele legii",
          "dreptul la restricționarea prelucrării",
          "dreptul la portabilitatea datelor",
          "dreptul de opoziție",
          "dreptul de a vă retrage consimțământul în orice moment",
          "dreptul de a depune o plângere la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal"
        ]
      },
      {
        title: "9. Corelarea cu alți termeni legali",
        content: "SCIPI își rezervă dreptul de a modifica prezenta Politică de Confidențialitate. Versiunea actualizată va fi publicată pe site, cu indicarea datei ultimei modificări."
      },
      {
        title: "10. Contact",
        content: "Pentru exercitarea drepturilor sau pentru orice întrebări legate de protecția datelor, ne puteți contacta la",
        email: "secretariat.scipi@gmail.com"
      }
    ]
  },
  en: {
    title: "Privacy Policy",
    lastUpdate: "Last updated: January 2026",
    sections: [
      {
        title: "1. Introduction",
        content: `The Society for Research and Innovation in Infectious Diseases (SRIID), a non-profit legal entity, respects the confidentiality of the personal data of its members, collaborators, event participants, and website visitors.

SRIID processes personal data in accordance with Regulation (EU) 2016/679 on the protection of personal data (General Data Protection Regulation – GDPR), applicable national legislation, and this Privacy Policy.

This policy explains what data we collect, why we collect it, how we use it, to whom it may be disclosed, and what rights you have.`
      },
      {
        title: "2. Data controller",
        content: "Personal data are collected by the Society for Research and Innovation in Infectious Diseases for specific, explicit, and legitimate purposes."
      },
      {
        title: "3. Categories of personal data processed",
        content: "Depending on your interaction with SRIID, we may process the following categories of personal data:",
        list: [
          "Identification data: first and last name",
          "Contact data: email address, phone number",
          "Professional data: profession, specialty, institutional affiliation, professional/academic title",
          "Membership-related data: membership status, date of enrollment, participation in SRIID activities and events",
          "Technical and website usage data: IP address, device and browser type, pages accessed, duration of visit, cookies, and similar technologies"
        ],
        extraContent: "SRIID does not intentionally process special categories of personal data, except where such data are voluntarily provided and strictly necessary for a legitimate purpose, in compliance with applicable legal safeguards."
      },
      {
        title: "4. Purposes and legal grounds for processing",
        content: "Personal data are processed for the following purposes:",
        list: [
          "management and administration of SRIID membership",
          "organization and conduct of scientific, educational, or administrative events",
          "communication of information regarding SRIID activities, projects, and initiatives",
          "responding to requests, inquiries, or messages submitted by you",
          "improving website functionality and security",
          "compliance with legal and statutory obligations",
          "protection of SRIID's legitimate rights and interests in potential administrative or judicial proceedings"
        ],
        extraContent: `Processing is based on one or more of the following legal grounds:
• the data subject's consent
• compliance with a legal obligation
• SRIID's legitimate interest, provided that fundamental rights and freedoms are respected`
      },
      {
        title: "5. Data recipients",
        content: `Your personal data may be disclosed, strictly to the extent necessary, to public authorities where there is a legal obligation to do so, and to institutional partners involved in event organization, only where required.

SRIID does not sell, rent, or transfer personal data to third parties for commercial purposes.`
      },
      {
        title: "6. Data retention period",
        content: "Personal data are stored:",
        list: [
          "for the duration of the relationship with SRIID (e.g., membership)",
          "for the period necessary to fulfill the purposes for which the data were collected",
          "in accordance with retention periods required by applicable legislation"
        ]
      },
      {
        title: "7. Data security",
        content: `SRIID implements appropriate technical and organizational measures to protect personal data against unauthorized access, loss, destruction, or accidental alteration.

SRIID cannot be held liable for vulnerabilities that are not attributable to the organization.`
      },
      {
        title: "8. Data subject rights",
        content: "In accordance with GDPR, you have the following rights:",
        list: [
          "the right of access to your data",
          "the right to rectification of inaccurate data",
          "the right to erasure (\"the right to be forgotten\"), within legal limits",
          "the right to restriction of processing",
          "the right to data portability",
          "the right to object to processing",
          "the right to withdraw consent at any time",
          "the right to lodge a complaint with the National Supervisory Authority for Personal Data Processing"
        ]
      },
      {
        title: "9. Relation to other legal terms",
        content: "SRIID reserves the right to amend this Privacy policy. The updated version will be published on the website, indicating the date of the latest revision."
      },
      {
        title: "10. Contact",
        content: "To exercise your rights or for any questions regarding personal data protection, you may contact us at",
        email: "secretariat.scipi@gmail.com"
      }
    ]
  }
};

export function PrivacyPageClient() {
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
