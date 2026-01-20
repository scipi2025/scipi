import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SCIPI - Societatea pentru Cercetare și Inovare în Patologii Infecțioase",
    template: "%s | SCIPI",
  },
  description:
    "Societatea pentru Cercetare și Inovare în Patologii Infecțioase (SCIPI) - Promovăm cercetarea, inovarea și excelența în domeniul patologiilor infecțioase prin educație continuă și colaborare.",
  keywords: [
    "SCIPI",
    "patologii infecțioase",
    "cercetare medicală",
    "inovare",
    "educație medicală",
    "România",
    "societate medicală",
    "boli infecțioase",
    "conferințe medicale",
  ],
  authors: [{ name: "SCIPI" }],
  creator: "SCIPI",
  publisher: "SCIPI",
  icons: {
    icon: "/fav.png",
    shortcut: "/fav.png",
    apple: "/fav.png",
  },
  openGraph: {
    type: "website",
    locale: "ro_RO",
    url: "https://scipi.ro",
    title: "SCIPI - Societatea pentru Cercetare și Inovare în Patologii Infecțioase",
    description:
      "Promovăm cercetarea, inovarea și excelența în domeniul patologiilor infecțioase prin educație continuă și colaborare.",
    siteName: "SCIPI",
  },
  twitter: {
    card: "summary_large_image",
    title: "SCIPI - Societatea pentru Cercetare și Inovare în Patologii Infecțioase",
    description:
      "Promovăm cercetarea, inovarea și excelența în domeniul patologiilor infecțioase prin educație continuă și colaborare.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
