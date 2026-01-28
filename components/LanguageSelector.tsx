"use client";

import { useLanguage, Language } from "@/lib/language-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const languages: { code: Language; name: string; flag: string }[] = [
  { code: "ro", name: "Română", flag: "🇷🇴" },
  { code: "en", name: "English", flag: "🇬🇧" },
];

interface LanguageSelectorProps {
  variant?: "desktop" | "mobile";
  className?: string;
}

export function LanguageSelector({ variant = "desktop", className }: LanguageSelectorProps) {
  const { language, setLanguage } = useLanguage();

  const currentLang = languages.find((l) => l.code === language) || languages[0];

  if (variant === "mobile") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        {languages.map((lang) => (
          <Button
            key={lang.code}
            variant={language === lang.code ? "default" : "outline"}
            size="sm"
            onClick={() => setLanguage(lang.code)}
            className="flex items-center gap-2"
          >
            <span className="text-lg">{lang.flag}</span>
            <span>{lang.code.toUpperCase()}</span>
          </Button>
        ))}
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "flex items-center gap-1.5 px-2 py-1 h-8 text-muted-foreground hover:text-foreground",
            className
          )}
        >
          <span className="text-lg leading-none">{currentLang.flag}</span>
          <span className="text-xs font-medium">{currentLang.code.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[120px]">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={cn(
              "flex items-center gap-2 cursor-pointer",
              language === lang.code && "bg-primary/10 text-primary"
            )}
          >
            <span className="text-lg">{lang.flag}</span>
            <span className="text-sm">{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
