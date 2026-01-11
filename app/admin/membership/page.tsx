"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle, Eye, Trash2, Loader2 } from "lucide-react";

type MembershipApplication = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  professionalGrade: string;
  otherProfessionalGrade?: string;
  medicalSpecialty: string;
  academicDegree?: string;
  institutionalAffiliation: string;
  membershipType: string;
  researchInterests: string;
  status: string;
  createdAt: string;
  reviewNotes?: string;
};

const professionalGradeLabels: Record<string, string> = {
  medic_rezident: "Medic rezident",
  medic_specialist: "Medic specialist",
  medic_primar: "Medic primar",
  student_medicina: "Student medicină",
  asistent_medical: "Asistent medical",
  alta: "Altă categorie",
};

const membershipTypeLabels: Record<string, string> = {
  membru_activ: "Membru activ",
  medic_asociat: "Medic asociat",
};

export default function MembershipApplicationsPage() {
  const [applications, setApplications] = useState<MembershipApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<MembershipApplication | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch("/api/membership");
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    setIsProcessing(true);
    try {
      const response = await fetch("/api/membership", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, reviewNotes }),
      });

      if (response.ok) {
        await fetchApplications();
        setSelectedApp(null);
        setReviewNotes("");
      }
    } catch (error) {
      console.error("Error updating application:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Sigur doriți să ștergeți această cerere?")) return;

    try {
      const response = await fetch(`/api/membership?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchApplications();
      }
    } catch (error) {
      console.error("Error deleting application:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">În așteptare</Badge>;
      case "approved":
        return <Badge className="bg-green-500">Aprobat</Badge>;
      case "rejected":
        return <Badge variant="destructive">Respins</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <AdminHeader title="Cereri de Membru" />

      <div className="flex-1 overflow-auto p-6">
        <Card>
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="size-8 animate-spin text-muted-foreground" />
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nu există cereri de membru
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nume</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Tip Membru</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Acțiuni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">
                        {app.firstName} {app.lastName}
                      </TableCell>
                      <TableCell>{app.email}</TableCell>
                      <TableCell>
                        {membershipTypeLabels[app.membershipType]}
                      </TableCell>
                      <TableCell>{getStatusBadge(app.status)}</TableCell>
                      <TableCell>
                        {new Date(app.createdAt).toLocaleDateString("ro-RO")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedApp(app)}
                          >
                            <Eye className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(app.id)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* View/Review Dialog */}
      <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Cerere de Membru - {selectedApp?.firstName} {selectedApp?.lastName}
            </DialogTitle>
            <DialogDescription>
              Revizuiește cererea și aprobă sau respinge aplicația
            </DialogDescription>
          </DialogHeader>

          {selectedApp && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-muted-foreground">Prenume</Label>
                  <p className="font-medium">{selectedApp.firstName}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Nume</Label>
                  <p className="font-medium">{selectedApp.lastName}</p>
                </div>
                <div className="md:col-span-2">
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="font-medium">{selectedApp.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Grad Profesional</Label>
                  <p className="font-medium">
                    {professionalGradeLabels[selectedApp.professionalGrade]}
                    {selectedApp.otherProfessionalGrade && ` - ${selectedApp.otherProfessionalGrade}`}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Specialitate</Label>
                  <p className="font-medium">{selectedApp.medicalSpecialty}</p>
                </div>
                {selectedApp.academicDegree && (
                  <div>
                    <Label className="text-muted-foreground">Grad Didactic</Label>
                    <p className="font-medium">{selectedApp.academicDegree}</p>
                  </div>
                )}
                <div className="md:col-span-2">
                  <Label className="text-muted-foreground">Afiliere Instituțională</Label>
                  <p className="font-medium">{selectedApp.institutionalAffiliation}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Tip Membru</Label>
                  <p className="font-medium">
                    {membershipTypeLabels[selectedApp.membershipType]}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedApp.status)}</div>
                </div>
                <div className="md:col-span-2">
                  <Label className="text-muted-foreground">Interese de Cercetare</Label>
                  <p className="mt-1 text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedApp.researchInterests}
                  </p>
                </div>
              </div>

              {selectedApp.status === "pending" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="reviewNotes">Note de Revizuire (opțional)</Label>
                    <Textarea
                      id="reviewNotes"
                      rows={3}
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      placeholder="Adaugă note despre decizie..."
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => handleStatusUpdate(selectedApp.id, "approved")}
                      disabled={isProcessing}
                    >
                      <CheckCircle2 className="mr-2 size-4" />
                      Aprobă
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => handleStatusUpdate(selectedApp.id, "rejected")}
                      disabled={isProcessing}
                    >
                      <XCircle className="mr-2 size-4" />
                      Respinge
                    </Button>
                  </div>
                </>
              )}

              {selectedApp.reviewNotes && (
                <div className="p-4 bg-muted rounded-lg">
                  <Label className="text-muted-foreground">Note de Revizuire</Label>
                  <p className="mt-1 text-sm">{selectedApp.reviewNotes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
