"use client";

import { useState, useEffect } from "react";
import { Mail, MailOpen, Trash2, Eye } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function ContactSubmissionsPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [deletingSubmissionId, setDeletingSubmissionId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch("/api/contact");
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data);
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string, isRead: boolean) => {
    try {
      const response = await fetch("/api/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isRead }),
      });

      if (response.ok) {
        await fetchSubmissions();
      }
    } catch (error) {
      console.error("Error updating submission:", error);
    }
  };

  const handleDelete = async () => {
    if (!deletingSubmissionId) return;
    try {
      const response = await fetch(`/api/contact?id=${deletingSubmissionId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        await fetchSubmissions();
        setDeleteDialogOpen(false);
        setDeletingSubmissionId(null);
      }
    } catch (error) {
      console.error("Error deleting submission:", error);
    }
  };

  const openViewDialog = async (submission: ContactSubmission) => {
    setSelectedSubmission(submission);
    setViewDialogOpen(true);
    
    // Mark as read if not already
    if (!submission.isRead) {
      await handleMarkAsRead(submission.id, true);
    }
  };

  const openDeleteDialog = (submissionId: string) => {
    setDeletingSubmissionId(submissionId);
    setDeleteDialogOpen(true);
  };

  const filteredSubmissions = submissions.filter((submission) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !submission.isRead;
    if (activeTab === "read") return submission.isRead;
    return true;
  });

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm");
    } catch {
      return dateString;
    }
  };

  const unreadCount = submissions.filter((s) => !s.isRead).length;

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Mesaje Contact</h1>
      </header>

      <div className="flex-1 overflow-auto p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Mesaje Contact</h2>
              <p className="text-muted-foreground">
                Vizualizează și gestionează mesajele primite prin formularul de contact
          </p>
            </div>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-base px-3 py-1">
                {unreadCount} necitite
              </Badge>
            )}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">
              Toate ({submissions.length})
            </TabsTrigger>
            <TabsTrigger value="unread">
              Necitite ({unreadCount})
            </TabsTrigger>
            <TabsTrigger value="read">
              Citite ({submissions.length - unreadCount})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Se încarcă...</p>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Mail className="size-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">Nu există mesaje</p>
            <p className="text-sm text-muted-foreground">
              Mesajele primite prin formularul de contact vor apărea aici
          </p>
        </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Nume</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Subiect</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Acțiuni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.map((submission) => (
                  <TableRow 
                    key={submission.id}
                    className={!submission.isRead ? "bg-accent/50" : ""}
                  >
                    <TableCell>
                      {submission.isRead ? (
                        <MailOpen className="size-4 text-muted-foreground" />
                      ) : (
                        <Mail className="size-4 text-primary" />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{submission.name}</TableCell>
                    <TableCell>{submission.email}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {submission.subject}
                    </TableCell>
                    <TableCell>{formatDate(submission.createdAt)}</TableCell>
                    <TableCell>
                      <Badge variant={submission.isRead ? "secondary" : "default"}>
                        {submission.isRead ? "Citit" : "Necitit"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openViewDialog(submission)}
                        >
                          <Eye className="size-4" />
                        </Button>
                        {submission.isRead && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleMarkAsRead(submission.id, false)}
                            title="Marchează ca necitit"
                          >
                            <Mail className="size-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(submission.id)}
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalii Mesaj</DialogTitle>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nume</p>
                  <p className="text-base">{selectedSubmission.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-base">
                    <a 
                      href={`mailto:${selectedSubmission.email}`}
                      className="text-primary hover:underline"
                    >
                      {selectedSubmission.email}
                    </a>
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Subiect</p>
                <p className="text-base">{selectedSubmission.subject}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Mesaj</p>
                <div className="mt-2 rounded-md border p-4 bg-muted/50">
                  <p className="text-base whitespace-pre-wrap">{selectedSubmission.message}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Data primirii</p>
                <p className="text-base">{formatDate(selectedSubmission.createdAt)}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewDialogOpen(false)}>Închide</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmare Ștergere</DialogTitle>
            <DialogDescription>
              Ești sigur că vrei să ștergi acest mesaj? Această acțiune nu poate fi
              anulată.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Anulează
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Șterge
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
