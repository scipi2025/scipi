import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactează SCIPI pentru întrebări, sugestii sau colaborări. Suntem aici să te ajutăm și să răspundem la toate întrebările tale.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

