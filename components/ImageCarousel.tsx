"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface CarouselImage {
  id: string;
  imageUrl: string;
  alt: string;
  displayOrder: number;
}

// Default images used as fallback when no images in database
const defaultImages: CarouselImage[] = [
  {
    id: "default-1",
    imageUrl: "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=2080",
    alt: "Laboratory test tubes",
    displayOrder: 0,
  },
  {
    id: "default-2",
    imageUrl: "https://images.unsplash.com/photo-1579165466741-7f35e4755660?q=80&w=2070",
    alt: "Medical research equipment",
    displayOrder: 1,
  },
  {
    id: "default-3",
    imageUrl: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=2069",
    alt: "Laboratory samples",
    displayOrder: 2,
  },
  {
    id: "default-4",
    imageUrl: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?q=80&w=2070",
    alt: "Virus research",
    displayOrder: 3,
  },
];

interface ImageCarouselProps {
  images?: CarouselImage[];
}

export function ImageCarousel({ images }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Use provided images or fallback to defaults
  const carouselImages = images && images.length > 0 ? images : defaultImages;

  useEffect(() => {
    if (carouselImages.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [carouselImages.length]);

  if (carouselImages.length === 0) {
    return <div className="relative w-full h-full bg-muted" />;
  }

  return (
    <div className="relative w-full h-full bg-muted">
      {carouselImages.map((image, index) => (
        <Image
          key={image.id}
          src={image.imageUrl}
          alt={image.alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className={cn(
            "object-cover transition-opacity duration-700",
            index === currentIndex ? "opacity-100" : "opacity-0"
          )}
          priority={index === 0}
        />
      ))}
      
      {/* Dots indicator */}
      {carouselImages.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                index === currentIndex
                  ? "bg-white w-4"
                  : "bg-white/50 hover:bg-white/75"
              )}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
