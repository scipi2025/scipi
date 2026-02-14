import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import {
  detectSource,
  getClientIp,
  getLocationFromHeaders,
  normalizePath,
  parseUserAgent,
} from "@/lib/visit-tracking";

const TRACKING_COOKIE = "visitor-id";

interface VisitPayload {
  pathname?: string;
  query?: string;
  referrer?: string;
  pageTitle?: string;
  language?: string;
  timezone?: string;
  platform?: string;
  doNotTrack?: boolean;
  screenWidth?: number;
  screenHeight?: number;
  viewportWidth?: number;
  viewportHeight?: number;
}

function clampText(value: string | undefined, maxLength: number): string | null {
  if (!value) return null;
  return value.slice(0, maxLength);
}

function getHostFromUrl(value: string | null): string | null {
  if (!value) return null;
  try {
    return new URL(value).hostname;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as VisitPayload;
    const rawPath = body.pathname ?? "/";
    const path = normalizePath(rawPath);
    const query = clampText(body.query, 1500);
    const fullPath = query ? `${path}${query}` : path;

    if (path.startsWith("/api/") || path.startsWith("/_next/")) {
      return NextResponse.json({ success: true });
    }

    const visitorIdFromCookie = request.cookies.get(TRACKING_COOKIE)?.value;
    const visitorId = visitorIdFromCookie || crypto.randomUUID();
    const isNewVisitor = !visitorIdFromCookie;

    const authToken = request.cookies.get("auth-token")?.value;
    const authPayload = authToken ? verifyToken(authToken) : null;
    const isAuthenticated = Boolean(authPayload?.adminId);

    const userAgent = request.headers.get("user-agent");
    const referer = body.referrer ?? request.headers.get("referer");
    const refererHost = getHostFromUrl(referer);
    const ipAddress = getClientIp(request);
    const source = detectSource(referer);
    const { browser, operatingSystem, deviceType } = parseUserAgent(userAgent);
    const location = getLocationFromHeaders(request);
    const host = request.headers.get("host");

    const queryParams = new URLSearchParams(query?.startsWith("?") ? query.slice(1) : query ?? "");
    const utmSource = queryParams.get("utm_source");
    const utmMedium = queryParams.get("utm_medium");
    const utmCampaign = queryParams.get("utm_campaign");
    const utmTerm = queryParams.get("utm_term");
    const utmContent = queryParams.get("utm_content");

    await prisma.websiteVisit.create({
      data: {
        adminId: authPayload?.adminId ?? null,
        visitorId,
        isAuthenticated,
        isNewVisitor,
        path,
        query,
        fullPath,
        host: clampText(host ?? undefined, 255),
        ipAddress,
        userAgent: clampText(userAgent ?? undefined, 1024),
        browser,
        operatingSystem,
        deviceType,
        country: location.country,
        region: location.region,
        city: location.city,
        referer: clampText(referer ?? undefined, 1024),
        refererHost: clampText(refererHost ?? undefined, 255),
        source,
        screenWidth: typeof body.screenWidth === "number" ? body.screenWidth : null,
        screenHeight: typeof body.screenHeight === "number" ? body.screenHeight : null,
        viewportWidth: typeof body.viewportWidth === "number" ? body.viewportWidth : null,
        viewportHeight: typeof body.viewportHeight === "number" ? body.viewportHeight : null,
        language: clampText(body.language, 64),
        timezone: clampText(body.timezone, 128),
        platform: clampText(body.platform, 64),
        pageTitle: clampText(body.pageTitle, 300),
        doNotTrack: typeof body.doNotTrack === "boolean" ? body.doNotTrack : null,
        utmSource: clampText(utmSource ?? undefined, 255),
        utmMedium: clampText(utmMedium ?? undefined, 255),
        utmCampaign: clampText(utmCampaign ?? undefined, 255),
        utmTerm: clampText(utmTerm ?? undefined, 255),
        utmContent: clampText(utmContent ?? undefined, 255),
      },
    });

    const response = NextResponse.json({ success: true });

    if (!visitorIdFromCookie) {
      response.cookies.set(TRACKING_COOKIE, visitorId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365,
        path: "/",
      });
    }

    return response;
  } catch (error) {
    console.error("Visit tracking error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
