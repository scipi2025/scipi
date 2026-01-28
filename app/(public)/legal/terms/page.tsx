import type { Metadata } from "next";
import { TermsPageClient } from "./TermsPageClient";

export const metadata: Metadata = {
  title: "Termeni și Condiții | Terms and Conditions",
  description: "Termeni și condiții de utilizare a website-ului SCIPI | Terms and conditions for using the SCIPI website",
};

export default function TermsPage() {
  return <TermsPageClient />;
}
