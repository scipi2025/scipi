import type { Metadata } from "next";
import { PrivacyPageClient } from "./PrivacyPageClient";

export const metadata: Metadata = {
  title: "Politica de Confidențialitate | Privacy Policy",
  description: "Politica de confidențialitate și protecția datelor personale conform GDPR | Privacy policy and personal data protection in accordance with GDPR",
};

export default function PrivacyPage() {
  return <PrivacyPageClient />;
}
