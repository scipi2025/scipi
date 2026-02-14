import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth-server";
import { prisma } from "@/lib/db";
import { AdminHeader } from "@/components/admin/admin-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const dynamic = "force-dynamic";

function formatDate(date: Date) {
  return new Date(date).toLocaleString("ro-RO", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function getTrafficData() {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [
    totalVisits,
    visitsLast24h,
    authenticatedVisits,
    anonymousVisits,
    uniqueVisitorsRows,
    topPages,
    topSources,
    topBrowsers,
    topDevices,
    latestVisits,
  ] = await Promise.all([
    prisma.websiteVisit.count(),
    prisma.websiteVisit.count({
      where: {
        visitedAt: {
          gte: twentyFourHoursAgo,
        },
      },
    }),
    prisma.websiteVisit.count({
      where: {
        isAuthenticated: true,
      },
    }),
    prisma.websiteVisit.count({
      where: {
        isAuthenticated: false,
      },
    }),
    prisma.websiteVisit.findMany({
      distinct: ["visitorId"],
      select: { visitorId: true },
    }),
    prisma.websiteVisit.groupBy({
      by: ["path"],
      _count: { _all: true },
      orderBy: {
        _count: {
          path: "desc",
        },
      },
      take: 8,
    }),
    prisma.websiteVisit.groupBy({
      by: ["source"],
      _count: { _all: true },
      orderBy: {
        _count: {
          source: "desc",
        },
      },
      take: 6,
    }),
    prisma.websiteVisit.groupBy({
      by: ["browser"],
      _count: { _all: true },
      orderBy: {
        _count: {
          browser: "desc",
        },
      },
      take: 6,
    }),
    prisma.websiteVisit.groupBy({
      by: ["deviceType"],
      _count: { _all: true },
      orderBy: {
        _count: {
          deviceType: "desc",
        },
      },
      take: 6,
    }),
    prisma.websiteVisit.findMany({
      orderBy: { visitedAt: "desc" },
      take: 200,
      include: {
        admin: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),
  ]);

  return {
    totalVisits,
    visitsLast24h,
    authenticatedVisits,
    anonymousVisits,
    uniqueVisitors: uniqueVisitorsRows.length,
    topPages,
    topSources,
    topBrowsers,
    topDevices,
    latestVisits,
  };
}

export default async function AdminTrafficPage() {
  const admin = await getCurrentAdmin().catch(() => null);

  if (!admin) {
    redirect("/admin/login");
  }

  const data = await getTrafficData();

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <AdminHeader title="Trafic Website" />

      <div className="flex-1 overflow-auto p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Monitorizare acces website</h2>
          <p className="text-muted-foreground">
            Vezi cine, când, de unde și de pe ce dispozitiv a accesat site-ul, plus paginile vizitate.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Vizite totale</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.totalVisits}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Vizitatori unici</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.uniqueVisitors}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Ultimele 24h</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.visitsLast24h}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Autentificate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.authenticatedVisits}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Anonime</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.anonymousVisits}</div>
            </CardContent>
          </Card>
          <Card className="md:col-span-2 lg:col-span-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Top surse trafic</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {data.topSources.length === 0 ? (
                <span className="text-sm text-muted-foreground">Nu există date încă.</span>
              ) : (
                data.topSources.map((source) => (
                  <Badge key={source.source ?? "unknown"} variant="secondary">
                    {(source.source ?? "unknown").toUpperCase()} - {source._count._all}
                  </Badge>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Top pagini vizitate</CardTitle>
            <CardDescription>Primele pagini după numărul de accesări</CardDescription>
          </CardHeader>
          <CardContent>
            {data.topPages.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nu există date de trafic.</p>
            ) : (
              <div className="space-y-2">
                {data.topPages.map((page) => (
                  <div
                    key={page.path}
                    className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                  >
                    <span className="font-mono">{page.path}</span>
                    <Badge>{page._count._all}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Top browsere</CardTitle>
              <CardDescription>Distribuție după browser</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {data.topBrowsers.length === 0 ? (
                <span className="text-sm text-muted-foreground">Nu există date încă.</span>
              ) : (
                data.topBrowsers.map((item) => (
                  <Badge key={item.browser ?? "unknown"} variant="secondary">
                    {item.browser ?? "Unknown"} - {item._count._all}
                  </Badge>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top dispozitive</CardTitle>
              <CardDescription>Desktop, mobile, tablet, bot</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {data.topDevices.length === 0 ? (
                <span className="text-sm text-muted-foreground">Nu există date încă.</span>
              ) : (
                data.topDevices.map((item) => (
                  <Badge key={item.deviceType ?? "unknown"} variant="secondary">
                    {item.deviceType ?? "Unknown"} - {item._count._all}
                  </Badge>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Ultimele 200 vizite</CardTitle>
            <CardDescription>Detalii complete despre accesări</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Când</TableHead>
                    <TableHead>Cine</TableHead>
                    <TableHead>Pagină</TableHead>
                    <TableHead>IP</TableHead>
                    <TableHead>Dispozitiv</TableHead>
                    <TableHead>Browser/OS</TableHead>
                    <TableHead>Locație</TableHead>
                    <TableHead>Sursă</TableHead>
                    <TableHead>Detalii extra</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.latestVisits.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center text-muted-foreground">
                        Nu există date de trafic încă.
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.latestVisits.map((visit) => (
                      <TableRow key={visit.id}>
                        <TableCell className="whitespace-nowrap">{formatDate(visit.visitedAt)}</TableCell>
                        <TableCell>
                          {visit.admin ? (
                            <div>
                              <div className="font-medium">{visit.admin.name}</div>
                              <div className="text-xs text-muted-foreground">{visit.admin.email}</div>
                            </div>
                          ) : (
                            <div>
                              <div className="font-medium">Vizitator anonim</div>
                              <div className="text-xs text-muted-foreground">{visit.visitorId}</div>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="max-w-70 truncate font-mono">{visit.fullPath}</div>
                        </TableCell>
                        <TableCell>{visit.ipAddress ?? "-"}</TableCell>
                        <TableCell>{visit.deviceType ?? "-"}</TableCell>
                        <TableCell>
                          {(visit.browser ?? "Unknown")} / {(visit.operatingSystem ?? "Unknown")}
                        </TableCell>
                        <TableCell>
                          {[visit.city, visit.region, visit.country].filter(Boolean).join(", ") || "-"}
                        </TableCell>
                        <TableCell>
                          <div className="text-xs uppercase">{visit.source ?? "-"}</div>
                          {visit.referer ? (
                            <div className="text-xs text-muted-foreground max-w-60 truncate">
                              {visit.referer}
                            </div>
                          ) : null}
                        </TableCell>
                        <TableCell>
                          <div className="text-xs text-muted-foreground">
                            {visit.timezone ?? "-"} | {visit.language ?? "-"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            vp: {visit.viewportWidth ?? "-"}x{visit.viewportHeight ?? "-"}
                          </div>
                          {(visit.utmSource || visit.utmMedium || visit.utmCampaign) && (
                            <div className="text-xs text-muted-foreground max-w-60 truncate">
                              UTM: {[visit.utmSource, visit.utmMedium, visit.utmCampaign]
                                .filter(Boolean)
                                .join(" / ")}
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
