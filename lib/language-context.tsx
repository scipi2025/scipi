"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useCallback,
  ReactNode,
  useSyncExternalStore,
} from "react";

export type Language = "ro" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

// Translations
const translations: Record<Language, Record<string, string>> = {
  ro: {
    // Navigation
    "nav.home": "Acasă",
    "nav.about": "Despre",
    "nav.aboutUs": "Despre noi",
    "nav.ourMission": "Misiunea noastră",
    "nav.mission": "Misiune",
    "nav.members": "Membri",
    "nav.partners": "Parteneri",
    "nav.projects": "Proiecte",
    "nav.events": "Evenimente",
    "nav.resources": "Resurse",
    "nav.contact": "Contact",
    "nav.admin": "Admin",
    "nav.logout": "Deconectare",
    "nav.news": "Noutăți",

    // Homepage
    "home.hero.subtitle":
      "Societatea pentru Cercetare și Inovare în Patologii Infecțioase",
    "home.hero.slogan":
      "Connecting research, clinical practice and innovation in infectious diseases",
    "home.hero.description":
      "Conectăm cercetarea, practica clinică și inovația în bolile infecțioase.",
    "home.activity.title": "Activitatea noastră",
    "home.activity.subtitle":
      "Explorează evenimentele, proiectele și resursele comunității SCIPI",
    "home.news.title": "Noutăți",
    "home.news.subtitle": "Ce mai e nou la SCIPI",
    "home.news.readAll": "Citește toate noutățile",
    "home.partners.title": "Parteneri",
    "home.partners.subtitle":
      "Colaborăm cu instituții și organizații de prestigiu",

    // Activity Section
    "activity.events": "Evenimente",
    "activity.events.desc":
      "Conferințe, workshop-uri și întâlniri profesionale",
    "activity.projects": "Proiecte",
    "activity.projects.desc": "Cercetare clinică și studii inovatoare",
    "activity.resources": "Resurse educaționale",
    "activity.resources.desc": "Ghiduri, articole și materiale de studiu",
    "activity.membership": "Membri",
    "activity.membership.desc":
      "Alătură-te comunității noastre de profesioniști din domeniul sănătății.",
    "activity.viewAll": "Vezi toate",
    "activity.learnMore": "Află mai multe",
    "activity.applyNow": "Aplică acum",
    "activity.noItems": "Nu există elemente de afișat momentan.",
    "activity.explore": "Explorează",

    // Mission Section (Homepage)
    "home.mission.title": "Misiunea noastră",
    "home.mission.text":
      "Societatea pentru Cercetare și Inovare în Patologii Infecțioase este o organizație profesională non-profit dedicată progresului științific în domeniul bolilor infecțioase. Activitatea Societății vizează sprijinirea cercetării medicale, facilitarea colaborării interdisciplinare și promovarea celor mai bune practici clinice.",
    "home.mission.readMore": "Citește mai mult",

    // CTA Section (Homepage)
    "home.cta.title": "Cum devii membru SCIPI?",
    "home.cta.text":
      "Fii parte din comunitatea SCIPI și contribuie activ la progresul științific în domeniul patologiilor infecțioase.",
    "home.cta.apply": "Completează formularul",
    "home.cta.contact": "Contactează-ne",

    // Footer
    "footer.description":
      "Societatea pentru Cercetare și Inovare în Patologii Infecțioase",
    "footer.quickLinks": "Navigare",
    "footer.legal": "Legal",
    "footer.privacy": "Politica de confidențialitate",
    "footer.terms": "Termeni și condiții",
    "footer.cookies": "Politica cookies",
    "footer.rights": "Toate drepturile rezervate.",

    // Contact Page
    "contact.title": "Contact",
    "contact.intro":
      "Ai întrebări sau sugestii? Ne-ar face plăcere să auzim de la tine. Completează formularul de mai jos și îți vom răspunde în cel mai scurt timp posibil.",
    "contact.sendMessage": "Trimite-ne un mesaj",
    "contact.formIntro":
      "Completează formularul și îți vom răspunde în cel mai scurt timp posibil.",
    "contact.fullName": "Nume complet",
    "contact.email": "E-mail",
    "contact.subject": "Subiect",
    "contact.message": "Mesaj",
    "contact.send": "Trimite mesaj",
    "contact.sending": "Se trimite...",
    "contact.success": "Mesaj trimis cu succes!",
    "contact.error": "Eroare la trimiterea mesajului.",

    // Common
    "common.readMore": "Citește mai mult",
    "common.viewDetails": "Vezi detalii",
    "common.loading": "Se încarcă...",
    "common.error": "A apărut o eroare",
    "common.noResults": "Nu s-au găsit rezultate",
    "common.back": "Înapoi",
    "common.search": "Căutare",
    "common.filter": "Filtrare",
    "common.all": "Toate",
    "common.active": "Activ",
    "common.inactive": "Inactiv",
    "common.date": "Dată",
    "common.location": "Locație",
    "common.download": "Descarcă",
    "common.share": "Distribuie",
    "common.accessLink": "Accesează link",

    // Events Page
    "events.title": "Evenimente",
    "events.pageTitle": "Evenimente științifice",
    "events.intro":
      "Societatea pentru Cercetare și Inovare în Patologii Infecțioase organizează și participă în calitate de partener la diverse evenimente științifice: congrese și conferințe naționale sau internaționale, simpozioane, workshop-uri sau seminarii.",
    "events.intro2":
      "Aceste evenimente oferă oportunități de networking, schimb de experiență și diseminare a rezultatelor cercetării în domeniul bolilor infecțioase și a specialităților conexe.",
    "events.intro3":
      "Află mai jos care sunt evenimentele noastre și cum poți participa la acestea.",
    "events.ourEvents": "Evenimentele noastre",
    "events.details": "Detalii eveniment",
    "events.interested": "Ești interesat de evenimentele SCIPI?",
    "events.interestedText":
      "Dacă vrei să organizezi un eveniment în parteneriat cu SCIPI sau ai întrebări legate de un eveniment te rugăm să ne contactezi.",
    "events.contactUs": "Contactează-ne",

    // Projects Page
    "projects.title": "Proiecte",
    "projects.pageTitle": "Cercetare și inovare",
    "projects.intro":
      "Societatea pentru Cercetare și Inovare în Patologii Infecțioase desfășoară proiecte de cercetare clinică și fundamentală, dezvoltate în colaborare cu parteneri instituționali naționali și internaționali.",
    "projects.intro2":
      "Aceste inițiative urmăresc generarea de date relevante pentru îmbunătățirea practicii clinice și promovarea inovației în domeniul bolilor infecțioase.",
    "projects.intro3":
      "Coordonarea proiectelor este asigurată de membrii societății, însă participarea este deschisă tuturor celor interesați. Sunt invitați să se alăture activităților de cercetare, în special, studenții la medicină, studenții doctoranzi și medicii tineri.",
    "projects.intro4":
      "Implicarea în proiectele SCIPI oferă acces la activități științifice structurate, resurse de cercetare și oportunități de colaborare multidisciplinară, la nivel național și internațional.",
    "projects.ourProjects": "Proiectele noastre",
    "projects.ongoing": "În curs",
    "projects.completed": "Finalizate",
    "projects.interested": "Interesat de participare?",
    "projects.interestedText":
      "Dacă sunteți interesat să participați la proiectele SCIPI sau doriți să propuneți un proiect de cercetare, vă rugăm să ne contactați.",
    "projects.contactUs": "Contactează-ne",

    // Resources Page
    "resources.title": "Resurse",
    "resources.pageTitle": "Resurse educaționale",
    "resources.intro":
      "Accesează ghiduri, articole și documente utile pentru dezvoltarea ta profesională. Toate resursele sunt selectate și recomandate de experți în domeniul patologiilor infecțioase.",
    "resources.all": "Toate",
    "resources.guides": "Ghiduri",
    "resources.articles": "Articole",
    "resources.documents": "Documente",
    "resources.accessLink": "Accesează link",

    // Mission Page
    "mission.title": "Misiune",
    "mission.aboutScipi": "Despre SCIPI",
    "mission.aboutText1":
      "Societatea pentru Cercetare și Inovare în Patologii Infecțioase este o organizație profesională non-profit dedicată progresului științific în domeniul bolilor infecțioase. Activitatea Societății vizează sprijinirea cercetării medicale, facilitarea colaborării interdisciplinare și promovarea celor mai bune practici clinice, cu scopul de a îmbunătăți înțelegerea, diagnosticarea și tratamentul patologiilor infecțioase.",
    "mission.aboutText2":
      "Scopul principal constă în promovarea, susținerea și dezvoltarea cercetării științifice în domeniul bolilor infecțioase și al specialităților conexe, prin crearea unui cadru care facilitează cooperarea între profesioniști din mediul medical, academic și tehnologic.",
    "mission.objectives": "Obiective",
    "mission.objective1":
      "Susținerea și promovarea cercetării științifice în domeniul bolilor infecțioase și a specialităților conexe",
    "mission.objective2":
      "Dezvoltarea parteneriatelor și colaborărilor naționale și internaționale în cercetarea clinică și fundamentală a bolilor infecțioase",
    "mission.objective3":
      "Facilitarea accesului la resurse și infrastructură de cercetare clinică și fundamentală în domeniul patologiilor infecțioase",
    "mission.objective4":
      "Susținerea diseminării rezultatelor științifice și facilitarea schimbului de cunoștințe medicale prin organizarea și promovarea de evenimente medicale",
    "mission.objective5":
      "Promovarea colaborării interdisciplinare pentru abordarea integrată a bolilor infecțioase",
    "mission.whoWeAddress": "Cui ne adresăm?",
    "mission.whoWeAddressText":
      "SCIPI se adresează profesioniștilor din domeniul medical interesați de patologiile infecțioase și cercetarea clinică și fundamentală în domeniul acestora.",
    "mission.residentPhysicians": "Medici rezidenți",
    "mission.specialistPhysicians": "Medici specialiști",
    "mission.seniorPhysicians": "Medici primari",
    "mission.academicStaff": "Cadre didactice",
    "mission.medicalResearchers": "Cercetători în domeniul medical",
    "mission.phdStudents": "Studenți doctoranzi",
    "mission.medicalStudents": "Studenți la medicină",
    "mission.nurses": "Asistenți medicali",

    // Members Page
    "members.title": "Membri",
    "members.community": "Comunitatea SCIPI",
    "members.communityText1":
      "Societatea pentru Cercetare și Inovare în Patologii Infecțioase este o comunitate profesională dedicată tuturor celor implicați în practica clinică, educație și cercetare în domeniul bolilor infecțioase și a specialităților conexe.",
    "members.communityText2":
      "În conformitate cu statutul societății, există trei categorii de membri - membri activi titulari, membri asociați și membri de onoare - fiecare având drepturi și responsabilități adaptate nivelului de implicare.",
    "members.openParticipation": "Participare deschisă",
    "members.openParticipationText1":
      "Participarea la evenimentele, proiectele și activitățile organizate de SCIPI nu este limitată la membrii societății. Acestea sunt deschise tuturor profesioniștilor interesați, indiferent de țara de origine.",
    "members.openParticipationText2":
      "Pentru a fi la curent cu oportunitățile de implicare, recomandăm consultarea periodică a secțiunii Noutăți, unde sunt publicate informații actualizate despre proiecte, evenimente științifice și modalități de implicare sau participare.",
    "members.categories": "Categorii de membri",
    "members.activeMembers": "Membri activi titulari",
    "members.activeMembersText":
      "Pot fi profesioniști din domeniul medical cu experiență academică, clinică sau de cercetare în bolile infecțioase ori domenii conexe, implicați direct în activitățile și direcțiile strategice ale societății.",
    "members.associateMembers": "Membri asociați",
    "members.associateMembersText":
      "Pot fi profesioniști din domeniul medical sau persoane cu interes pentru activitatea societății, cu acces la programele, evenimentele și inițiativele societății.",
    "members.honoraryMembers": "Membri de onoare",
    "members.honoraryMembersText":
      "Titlu onorific oferit de Consiliul Director unor personalități științifice sau academice cu contribuții remarcabile în domeniul bolilor infecțioase, care oferă prestigiu și sprijin moral societății.",
    "members.applicationProcess": "Procesul de înscriere",
    "members.applicationProcessText1":
      "Procesul de înscriere în Societatea pentru Cercetare și Inovare în Patologii Infecțioase presupune completarea unei cereri de aderare ca membru activ titular sau membru asociat, care este analizată și validată de către Consiliul Director al societății.",
    "members.applicationProcessText2":
      "Se pot înscrie în SCIPI profesioniști din domeniul medical din orice țară, nu doar din România.",
    "members.applicationProcessText3":
      "După validarea cererii, calitatea de membru este confirmată prin achitarea taxei anuale de membru, stabilită la 500 lei pentru membrii activi și 200 lei pentru membrii asociați.",
    "members.applicationProcessText4":
      "Pentru a aplica, te invităm să completezi formularul online de înscriere. Răspunsul privind cererea de înscriere va fi transmis prin e-mail în termen de maximum 7 zile de la depunerea acesteia.",
    "members.completeForm": "Completează formularul de înscriere",

    // Partners Page
    "partners.title": "Parteneri",
    "partners.collaborations": "Colaborări și parteneriate",
    "partners.collaborationsText":
      "Societatea pentru Cercetare și Inovare în Patologii Infecțioase își desfășoară activitatea în strânsă colaborare cu parteneri instituționali, organizații academice și societăți profesionale din România și din străinătate, în cadrul unor inițiative comune de cercetare, educație medicală și dezvoltare profesională.",
    "partners.national": "Parteneri naționali",
    "partners.international": "Parteneri internaționali",
    "partners.sponsors": "Sponsori",
    "partners.becomePartner": "Devino partener SCIPI",
    "partners.becomePartnerText":
      "Construim parteneriate pentru cercetare, educație medicală și inovare în domeniul bolilor infecțioase.",
    "partners.contactForPartnership":
      "Contactează-ne la secretariat.scipi@gmail.com pentru a explora oportunități de parteneriat.",

    // Membership Form
    "form.title": "Formular pentru dobândirea calității de membru SCIPI",
    "form.intro":
      "Completați formularul de mai jos pentru a aplica pentru calitatea de membru SCIPI. Toate câmpurile marcate cu * sunt obligatorii.",
    "form.personalInfo": "Date personale",
    "form.firstName": "Prenume",
    "form.lastName": "Nume",
    "form.email": "E-mail",
    "form.professionalInfo": "Date profesionale",
    "form.professionalGrade": "Grad profesional",
    "form.residentPhysician": "Medic rezident",
    "form.specialistPhysician": "Medic specialist",
    "form.seniorPhysician": "Medic primar",
    "form.medicalStudent": "Student medicină",
    "form.phdStudent": "Doctorand în medicină",
    "form.nurse": "Asistent medical",
    "form.otherCategory": "Altă categorie",
    "form.medicalSpecialty": "Specialitate medicală",
    "form.academicDegree": "Grad didactic",
    "form.institutionalAffiliation": "Afiliere instituțională",
    "form.country": "Țara",
    "form.membershipType": "Tip membru",
    "form.activeMember": "Membru activ",
    "form.associateMember": "Membru asociat",
    "form.whyJoin":
      "De ce doriți să fiți membru SCIPI? Descrieți activitatea de cercetare sau interesele de cercetare în domeniul patologiilor infecțioase.",
    "form.agreements": "Acorduri și declarații",
    "form.gdprConsent":
      "Sunt de acord cu prelucrarea datelor cu caracter personal furnizate prin acest formular de către Departamentul Membri al SCIPI, în scopul gestionării cererii de aderare și a evidenței membrilor, conform Politicii de confidențialitate și legislației aplicabile (GDPR).",
    "form.feeConsent":
      "Declar că am luat la cunoștință că, în cazul acceptării cererii mele de aderare, mă oblig să achit cotizația anuală conform cuantumului și termenelor stabilite de SCIPI.",
    "form.optional": "Opțional",
    "form.newsletterConsent":
      "Sunt de acord să primesc comunicări (newsletter, anunțuri, invitații la evenimente) din partea SCIPI, pe e-mail.",
    "form.submit": "Trimite cererea",
  },
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.about": "About us",
    "nav.aboutUs": "About us",
    "nav.ourMission": "Our mission",
    "nav.mission": "Mission",
    "nav.members": "Members",
    "nav.partners": "Partners",
    "nav.projects": "Projects",
    "nav.events": "Events",
    "nav.resources": "Resources",
    "nav.contact": "Contact",
    "nav.admin": "Admin",
    "nav.logout": "Logout",
    "nav.news": "News",

    // Homepage
    "home.hero.subtitle":
      "Society for Research and Innovation in Infectious Diseases",
    "home.hero.slogan":
      "Connecting research, clinical practice and innovation in infectious diseases",
    "home.hero.description":
      "Connecting research, clinical practice and innovation in infectious diseases.",
    "home.activity.title": "Our activity",
    "home.activity.subtitle":
      "Explore the events, projects, and resources of the SRIID community",
    "home.news.title": "News",
    "home.news.subtitle": "What's new at SRIID",
    "home.news.readAll": "Read all news",
    "home.partners.title": "Partners",
    "home.partners.subtitle":
      "We collaborate with prestigious institutions and organizations",

    // Activity Section
    "activity.events": "Events",
    "activity.events.desc": "Conferences, workshops, and professional meetings",
    "activity.projects": "Projects",
    "activity.projects.desc": "Clinical research and innovative studies",
    "activity.resources": "Educational resources",
    "activity.resources.desc": "Guidelines, articles, and other materials",
    "activity.membership": "Members",
    "activity.membership.desc":
      "Join our community of healthcare professionals.",
    "activity.viewAll": "View all",
    "activity.learnMore": "Learn more",
    "activity.applyNow": "Apply now",
    "activity.noItems": "No items to display at this time.",
    "activity.explore": "Explore",

    // Mission Section (Homepage)
    "home.mission.title": "Our Mission",
    "home.mission.text":
      "The Society for Research and Innovation in Infectious Diseases is a non-profit professional organization dedicated to advancing scientific progress in the field of infectious diseases. The Society's activities focus on supporting medical research, facilitating interdisciplinary collaboration, and promoting best clinical practices.",
    "home.mission.readMore": "Read more",

    // CTA Section (Homepage)
    "home.cta.title": "How to become a SRIID member?",
    "home.cta.text":
      "Join the SRIID community and contribute to advancing scientific excellence in infectious diseases.",
    "home.cta.apply": "Complete form",
    "home.cta.contact": "Contact us",

    // Footer
    "footer.description":
      "Society for Research and Innovation in Infectious Diseases",
    "footer.quickLinks": "Quick Links",
    "footer.legal": "Legal",
    "footer.privacy": "Privacy policy",
    "footer.terms": "Terms and conditions",
    "footer.cookies": "Cookie policy",
    "footer.rights": "All rights reserved.",

    // Contact Page
    "contact.title": "Contact",
    "contact.intro":
      "If you have any questions or suggestions, we would be pleased to hear from you. Please complete the form below and we will respond as soon as possible.",
    "contact.sendMessage": "Send us a message",
    "contact.formIntro":
      "Complete the form below and we will respond as soon as possible.",
    "contact.fullName": "Full name",
    "contact.email": "E-mail address",
    "contact.subject": "Subject",
    "contact.message": "Message",
    "contact.send": "Send message",
    "contact.sending": "Sending...",
    "contact.success": "Message sent successfully!",
    "contact.error": "Error sending message.",

    // Common
    "common.readMore": "Read more",
    "common.viewDetails": "View details",
    "common.loading": "Loading...",
    "common.error": "An error occurred",
    "common.noResults": "No results found",
    "common.back": "Back",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.all": "All",
    "common.active": "Active",
    "common.inactive": "Inactive",
    "common.date": "Date",
    "common.location": "Location",
    "common.download": "Download",
    "common.share": "Share",
    "common.accessLink": "Access link",

    // Events Page
    "events.title": "Events",
    "events.pageTitle": "Scientific events",
    "events.intro":
      "The Society for Research and Innovation in Infectious Diseases organizes and participates as a partner in a wide range of scientific events, including national and international congresses and conferences, symposia, workshops, and seminars.",
    "events.intro2":
      "These events provide opportunities for networking, experience sharing, and dissemination of research findings in the field of infectious diseases and related specialties.",
    "events.intro3":
      "Find below our events and discover how you can participate.",
    "events.ourEvents": "Our events",
    "events.details": "Event details",
    "events.interested": "Interested in SRIID Events?",
    "events.interestedText":
      "If you would like to organize an event in partnership with SRIID or have questions related to an event, please contact us.",
    "events.contactUs": "Contact us",

    // Projects Page
    "projects.title": "Projects",
    "projects.pageTitle": "Research and Innovation",
    "projects.intro":
      "The Society for Research and Innovation in Infectious Diseases conducts clinical and basic research projects developed in collaboration with national and international institutional partners.",
    "projects.intro2":
      "These initiatives aim to generate relevant data to improve clinical practice and to promote innovation in the field of infectious diseases.",
    "projects.intro3":
      "Project coordination is ensured by members of the Society; however, participation is open to all interested individuals. Medical students, PhD students, and early-career physicians are particularly encouraged to join research activities.",
    "projects.intro4":
      "Involvement in SRIID projects provides access to structured scientific activities, research resources, and opportunities for multidisciplinary collaboration at both national and international levels.",
    "projects.ourProjects": "Our projects",
    "projects.ongoing": "Ongoing",
    "projects.completed": "Finalized",
    "projects.interested": "Interested in participating?",
    "projects.interestedText":
      "If you are interested in participating in SRIID projects or would like to propose a research project, please contact us.",
    "projects.contactUs": "Contact us",

    // Resources Page
    "resources.title": "Resources",
    "resources.pageTitle": "Educational resources",
    "resources.intro":
      "Access guidelines, articles, and useful documents to support your professional development. All resources are curated and recommended by experts in the field of infectious diseases.",
    "resources.all": "All",
    "resources.guides": "Guidelines",
    "resources.articles": "Articles",
    "resources.documents": "Documents",
    "resources.accessLink": "Access link",

    // Mission Page
    "mission.title": "Mission",
    "mission.aboutScipi": "About SRIID (SCIPI)",
    "mission.aboutText1":
      "The Society for Research and Innovation in Infectious Diseases is a non-profit professional organization dedicated to advancing scientific progress in the field of infectious diseases. The Society's activities focus on supporting medical research, facilitating interdisciplinary collaboration, and promoting best clinical practices, with the aim of improving the understanding, diagnosis, and treatment of infectious diseases.",
    "mission.aboutText2":
      "The primary objective of the Society is to promote, support and develop scientific research in infectious diseases and related fields by creating a framework that facilitates cooperation among professionals from the medical, academic, and technological sectors.",
    "mission.objectives": "Objectives",
    "mission.objective1":
      "To support and promote scientific research in the field of infectious diseases and related specialties",
    "mission.objective2":
      "To develop national and international partnerships and collaborations in clinical and basic research on infectious diseases",
    "mission.objective3":
      "To facilitate access to research resources and infrastructure for both clinical and basic research in infectious diseases",
    "mission.objective4":
      "To support the dissemination of scientific results and facilitate the exchange of medical knowledge by organizing and promoting medical events",
    "mission.objective5":
      "To promote interdisciplinary collaboration for an integrated approach to infectious diseases",
    "mission.whoWeAddress": "Who we address?",
    "mission.whoWeAddressText":
      "SRIID is addressed to medical professionals interested in infectious diseases and clinical and fundamental research in this field.",
    "mission.residentPhysicians": "Resident physicians",
    "mission.specialistPhysicians": "Specialist physicians",
    "mission.seniorPhysicians": "Senior physicians",
    "mission.academicStaff": "Academic staff",
    "mission.medicalResearchers": "Medical researchers",
    "mission.phdStudents": "PhD students",
    "mission.medicalStudents": "Medical students",
    "mission.nurses": "Nurses",

    // Members Page
    "members.title": "Members",
    "members.community": "SRIID Community",
    "members.communityText1":
      "The Society for Research and Innovation in Infectious Diseases is a professional community dedicated to all individuals involved in clinical practice, education, and research in the field of infectious diseases and related specialties.",
    "members.communityText2":
      "In accordance with the Society's laws, there are three categories of members - active members, associate members, and honorary members - each with rights and responsibilities adapted to their level of involvement.",
    "members.openParticipation": "Open Participation",
    "members.openParticipationText1":
      "Participation in the events, projects, and activities organized by SRIID is not limited to Society members. These initiatives are open to all interested professionals, regardless of their country of origin.",
    "members.openParticipationText2":
      "To stay informed about opportunities for involvement, we recommend regularly consulting the News section, where up-to-date information on projects, scientific events, and participation opportunities is published.",
    "members.categories": "Membership categories",
    "members.activeMembers": "Active members",
    "members.activeMembersText":
      "Medical professionals with academic, clinical, or research experience in infectious diseases or related fields, who are directly involved in the Society's activities and strategic directions.",
    "members.associateMembers": "Associate members",
    "members.associateMembersText":
      "Medical professionals or individuals with an interest in the Society's activities, with access to the Society's programs, events, and projects.",
    "members.honoraryMembers": "Honorary members",
    "members.honoraryMembersText":
      "An honorary title awarded by the Board of Directors to distinguished scientific or academic personalities with outstanding contributions to the field of infectious diseases, who provide prestige and moral support to the Society.",
    "members.applicationProcess": "Membership application process",
    "members.applicationProcessText1":
      "The application process for joining the Society for Research and Innovation in Infectious Diseases involves completing an application form for active membership or associate membership, which is reviewed and validated by the Society's Board of Directors.",
    "members.applicationProcessText2":
      "Medical professionals from any country, not only from Romania, are eligible to apply for membership in SRIID.",
    "members.applicationProcessText3":
      "Following application approval, membership is confirmed upon payment of the annual membership fee, set at 100 euro for active members and 40 euro for associate members.",
    "members.applicationProcessText4":
      "To apply, please complete the online membership application form. A response regarding your application will be sent by email within a maximum of 7 days from submission.",
    "members.completeForm": "Complete form",

    // Partners Page
    "partners.title": "Partners",
    "partners.collaborations": "Collaborations and partnerships",
    "partners.collaborationsText":
      "Society for Research and Innovation in Infectious Diseases carries out its activities in close collaboration with institutional partners, academic organizations, and professional societies in Romania and worldwide, within joint initiatives focused on research, medical education, and professional development.",
    "partners.national": "National partners",
    "partners.international": "International partners",
    "partners.sponsors": "Sponsors",
    "partners.becomePartner": "Become a SRIID partner",
    "partners.becomePartnerText":
      "We build partnerships for research, medical education, and innovation in the field of infectious diseases.",
    "partners.contactForPartnership":
      "To explore partnership opportunities, please contact us at secretariat.scipi@gmail.com.",

    // Membership Form
    "form.title": "Membership application form - SRIID",
    "form.intro":
      "Please complete the form below to apply for SRIID membership. All fields marked with * are mandatory.",
    "form.personalInfo": "Personal information",
    "form.firstName": "First name",
    "form.lastName": "Last name",
    "form.email": "Email address",
    "form.professionalInfo": "Professional information",
    "form.professionalGrade": "Professional level",
    "form.residentPhysician": "Resident physician",
    "form.specialistPhysician": "Specialist physician",
    "form.seniorPhysician": "Senior physician",
    "form.medicalStudent": "Medical student",
    "form.phdStudent": "PhD student in Medicine",
    "form.nurse": "Nurse",
    "form.otherCategory": "Other",
    "form.medicalSpecialty": "Medical specialty",
    "form.academicDegree": "Academic title",
    "form.institutionalAffiliation": "Institutional affiliation",
    "form.country": "Country",
    "form.membershipType": "Membership Type",
    "form.activeMember": "Active member",
    "form.associateMember": "Associate member",
    "form.whyJoin":
      "Why do you wish to become a member of SRIID? Please describe your research activity or research interests in the field of infectious diseases.",
    "form.agreements": "Agreements and declarations",
    "form.gdprConsent":
      "I agree to the processing of my personal data provided through this form by the SRIID Membership Department for the purpose of managing my membership application and maintaining membership records, in accordance with the Privacy Policy and applicable legislation (GDPR).",
    "form.feeConsent":
      "I acknowledge that, if my membership application is approved, I am obliged to pay the annual membership fee in accordance with the amounts and deadlines established by SRIID.",
    "form.optional": "Optional",
    "form.newsletterConsent":
      "I agree to receive communications (newsletters, announcements, event invitations) from SRIID by email.",
    "form.submit": "Submit application",
  },
};

// Storage event listeners for cross-tab sync
const languageSubscribers = new Set<() => void>();

function subscribeToLanguage(callback: () => void) {
  languageSubscribers.add(callback);
  return () => {
    languageSubscribers.delete(callback);
  };
}

function getLanguageSnapshot(): Language {
  if (typeof window === "undefined") return "ro";
  const saved = localStorage.getItem("scipi-language");
  if (saved === "ro" || saved === "en") return saved;
  return "ro";
}

function getLanguageServerSnapshot(): Language {
  return "ro";
}

function notifyLanguageChange() {
  languageSubscribers.forEach((callback) => callback());
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const language = useSyncExternalStore(
    subscribeToLanguage,
    getLanguageSnapshot,
    getLanguageServerSnapshot
  );

  // Sync html lang attribute when language changes
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    localStorage.setItem("scipi-language", lang);
    notifyLanguageChange();
  }, []);

  const t = useCallback((key: string): string => {
    return translations[language][key] || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

// Helper function to get translated content from dynamic items
export function getLocalizedContent(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item: any,
  field: string,
  language: Language,
): string {
  const enField = `${field}En`;
  if (language === "en" && item[enField]) {
    return item[enField] as string;
  }
  return (item[field] as string) || "";
}
