"use client";

import { useEffect, useState } from "react";

interface Partner {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl: string | null;
}

interface PartnerCarouselProps {
  partners: Partner[];
}

export function PartnerCarousel({ partners }: PartnerCarouselProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || partners.length === 0) {
    return null;
  }

  // Duplicate partners for seamless loop
  const duplicatedPartners = [...partners, ...partners];

  return (
    <div className="w-full overflow-hidden bg-muted/30 py-8">
      <div className="container px-4 md:px-6">
        <h3 className="text-center text-lg font-semibold mb-6">Partenerii Noștri</h3>
        <div className="relative">
          <div className="flex gap-8 animate-scroll">
            {duplicatedPartners.map((partner, index) => (
              <div
                key={`${partner.id}-${index}`}
                className="flex-shrink-0 w-32 h-20 flex items-center justify-center"
              >
                {partner.websiteUrl ? (
                  <a
                    href={partner.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full h-full"
                  >
                    <img
                      src={partner.logoUrl}
                      alt={partner.name}
                      className="w-full h-full object-contain grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  </a>
                ) : (
                  <img
                    src={partner.logoUrl}
                    alt={partner.name}
                    className="w-full h-full object-contain grayscale opacity-70"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

