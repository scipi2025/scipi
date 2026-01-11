import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container px-4 py-12 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo & Description */}
          <div className="space-y-4 lg:col-span-1">
            <Image
              src="/logo_no_bg.png"
              alt="SCIPI Logo"
              width={200}
              height={80}
              className="h-16 w-auto"
            />
            <p className="text-sm text-muted-foreground">
              Societatea pentru Cercetare și Inovare în Patologii Infecțioase
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Navigare</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about/mission"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Misiune
                </Link>
              </li>
              <li>
                <Link
                  href="/about/members"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Membri
                </Link>
              </li>
              <li>
                <Link
                  href="/about/partners"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Parteneri
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Proiecte
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Evenimente
                </Link>
              </li>
              <li>
                <Link
                  href="/resources"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Resurse
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/legal/privacy"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Politica de Confidențialitate
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/terms"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Termeni și Condiții
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/cookies"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Politica Cookies
                </Link>
              </li>
              <li>
                <a
                  href="https://anpc.ro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  ANPC
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Mail className="size-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                <a
                  href="mailto:secretariat.scipi@gmail.com"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  secretariat.scipi@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="size-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">
                  București, România
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} SCIPI - Societatea pentru Cercetare și Inovare în Patologii Infecțioase. Toate drepturile rezervate.
          </p>
        </div>
      </div>
    </footer>
  );
}
