"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function VisitTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedRef = useRef<string>("");
  const search = searchParams.toString();

  useEffect(() => {
    if (!pathname) return;

    const query = search ? `?${search}` : "";
    const pageKey = `${pathname}${query}`;

    if (lastTrackedRef.current === pageKey) {
      return;
    }

    lastTrackedRef.current = pageKey;

    const payload = {
      pathname,
      query,
      referrer: typeof document !== "undefined" ? document.referrer : "",
      pageTitle: typeof document !== "undefined" ? document.title : "",
      language: typeof navigator !== "undefined" ? navigator.language : "",
      timezone:
        typeof Intl !== "undefined"
          ? Intl.DateTimeFormat().resolvedOptions().timeZone
          : "",
      platform: typeof navigator !== "undefined" ? navigator.platform : "",
      doNotTrack:
        typeof navigator !== "undefined" ? navigator.doNotTrack === "1" : false,
      screenWidth: typeof window !== "undefined" ? window.screen.width : null,
      screenHeight: typeof window !== "undefined" ? window.screen.height : null,
      viewportWidth: typeof window !== "undefined" ? window.innerWidth : null,
      viewportHeight: typeof window !== "undefined" ? window.innerHeight : null,
    };

    fetch("/api/analytics/visit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      keepalive: true,
      body: JSON.stringify(payload),
    }).catch(() => {
      // Silent failure: tracking should never block UX.
    });
  }, [pathname, search]);

  return null;
}
