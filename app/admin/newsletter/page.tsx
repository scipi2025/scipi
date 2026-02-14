"use client";

import { useState, useEffect } from "react";
import { Send, Trash2, Mail, UserX, UserCheck } from "lucide-react";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Subscriber {
  id: string;
  email: string;
  active: boolean;
  createdAt: string;
}

export default function NewsletterSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const response = await fetch("/api/newsletter");
      if (response.ok) {
        const data = await response.json();
        setSubscribers(data);
      }
    } catch (error) {
      console.error("Error fetching subscribers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      const response = await fetch(`/api/newsletter?id=${deletingId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        await fetchSubscribers();
        setDeleteDialogOpen(false);
        setDeletingId(null);
      }
    } catch (error) {
      console.error("Error deleting subscriber:", error);
    }
  };

  const openDeleteDialog = (id: string) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const filteredSubscribers = subscribers.filter((sub) => {
    if (activeTab === "all") return true;
    if (activeTab === "active") return sub.active;
    if (activeTab === "inactive") return !sub.active;
    return true;
  });

  const activeCount = subscribers.filter((s) => s.active).length;
  const inactiveCount = subscribers.filter((s) => !s.active).length;

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm");
    } catch {
      return dateString;
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Abonați Newsletter</h1>
      </header>

      <div className="flex-1 overflow-auto p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Abonați Newsletter
              </h2>
              <p className="text-muted-foreground">
                Vizualizează și gestionează abonații la newsletter
              </p>
            </div>
            <Badge variant="secondary" className="text-base px-3 py-1">
              {subscribers.length} total
            </Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">
              Toți ({subscribers.length})
            </TabsTrigger>
            <TabsTrigger value="active">
              Activi ({activeCount})
            </TabsTrigger>
            <TabsTrigger value="inactive">
              Inactivi ({inactiveCount})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Se încarcă...</p>
          </div>
        ) : filteredSubscribers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Send className="size-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">Nu există abonați</p>
            <p className="text-sm text-muted-foreground">
              Abonații la newsletter vor apărea aici după ce se înscriu de pe
              pagina principală
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data abonării</TableHead>
                  <TableHead className="text-right">Acțiuni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscribers.map((subscriber) => (
                  <TableRow key={subscriber.id}>
                    <TableCell>
                      {subscriber.active ? (
                        <UserCheck className="size-4 text-green-600" />
                      ) : (
                        <UserX className="size-4 text-muted-foreground" />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      <a
                        href={`mailto:${subscriber.email}`}
                        className="text-primary hover:underline"
                      >
                        {subscriber.email}
                      </a>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={subscriber.active ? "default" : "secondary"}
                      >
                        {subscriber.active ? "Activ" : "Inactiv"}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(subscriber.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            window.location.href = `mailto:${subscriber.email}`;
                          }}
                          title="Trimite email"
                        >
                          <Mail className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(subscriber.id)}
                          title="Șterge abonatul"
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

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmare Ștergere</DialogTitle>
            <DialogDescription>
              Ești sigur că vrei să ștergi acest abonat? Această acțiune nu poate
              fi anulată.
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
    </div>
  );
}
