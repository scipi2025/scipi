import type { NextRequest } from "next/server";

const IP_HEADERS = [
  "x-forwarded-for",
  "x-real-ip",
  "cf-connecting-ip",
  "x-client-ip",
  "x-vercel-forwarded-for",
] as const;

export function getClientIp(request: NextRequest): string | null {
  for (const headerName of IP_HEADERS) {
    const headerValue = request.headers.get(headerName);
    if (!headerValue) continue;

    const firstIp = headerValue.split(",")[0]?.trim();
    if (firstIp) {
      return firstIp;
    }
  }

  return null;
}

export function normalizePath(pathname: string): string {
  if (!pathname.startsWith("/")) {
    return `/${pathname}`;
  }

  return pathname;
}

export function detectSource(referer: string | null): string {
  if (!referer) return "direct";

  try {
    const host = new URL(referer).hostname.toLowerCase();

    if (host.includes("google.") || host.includes("bing.") || host.includes("yahoo.")) {
      return "search";
    }

    if (
      host.includes("facebook.") ||
      host.includes("instagram.") ||
      host.includes("linkedin.") ||
      host.includes("tiktok.") ||
      host.includes("x.com") ||
      host.includes("twitter.")
    ) {
      return "social";
    }

    return "referral";
  } catch {
    return "referral";
  }
}

export function parseUserAgent(userAgent: string | null) {
  if (!userAgent) {
    return {
      browser: "Unknown",
      operatingSystem: "Unknown",
      deviceType: "Unknown",
    };
  }

  const ua = userAgent.toLowerCase();
  let browser = "Unknown";
  let operatingSystem = "Unknown";
  let deviceType = "Desktop";

  if (ua.includes("edg/")) browser = "Edge";
  else if (ua.includes("opr/") || ua.includes("opera")) browser = "Opera";
  else if (ua.includes("chrome/")) browser = "Chrome";
  else if (ua.includes("safari/") && !ua.includes("chrome/")) browser = "Safari";
  else if (ua.includes("firefox/")) browser = "Firefox";

  if (ua.includes("windows")) operatingSystem = "Windows";
  else if (ua.includes("mac os")) operatingSystem = "macOS";
  else if (ua.includes("android")) operatingSystem = "Android";
  else if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ios")) operatingSystem = "iOS";
  else if (ua.includes("linux")) operatingSystem = "Linux";

  if (ua.includes("bot") || ua.includes("spider") || ua.includes("crawler")) {
    deviceType = "Bot";
  } else if (ua.includes("tablet") || ua.includes("ipad")) {
    deviceType = "Tablet";
  } else if (ua.includes("mobile") || ua.includes("iphone") || ua.includes("android")) {
    deviceType = "Mobile";
  }

  return {
    browser,
    operatingSystem,
    deviceType,
  };
}

export function getLocationFromHeaders(request: NextRequest) {
  const country = request.headers.get("x-vercel-ip-country") ?? request.headers.get("cf-ipcountry");
  const region = request.headers.get("x-vercel-ip-country-region") ?? request.headers.get("x-vercel-region");
  const city = request.headers.get("x-vercel-ip-city") ?? request.headers.get("cf-ipcity");

  return {
    country: country ?? null,
    region: region ?? null,
    city: city ?? null,
  };
}
