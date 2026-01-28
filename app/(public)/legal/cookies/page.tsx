import type { Metadata } from "next";
import { CookiesPageClient } from "./CookiesPageClient";

export const metadata: Metadata = {
  title: "Politica Cookies | Cookie Policy",
  description: "Politica de utilizare a cookies pe website-ul SCIPI | Cookie policy for the SCIPI website",
};

export default function CookiesPage() {
  return <CookiesPageClient />;
}
