"use client";

import { useEffect, useState } from "react";

interface Partner {
  id: string;
  name: string;
  logoUrl: string | null;
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
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <h3 className="text-center text-lg font-semibold mb-6">Partenerii Noștri</h3>
        <div className="relative overflow-hidden">
          <div className="flex gap-8 animate-scroll w-max">
            {duplicatedPartners.map((partner, index) => (
              <div
                key={`${partner.id}-${index}`}
                className="shrink-0 w-32 h-20 flex items-center justify-center"
              >
                {partner.logoUrl ? (
                  partner.websiteUrl ? (
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
                  )
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted rounded text-xs text-muted-foreground">
                    {partner.name}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

