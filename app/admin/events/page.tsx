"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Calendar } from "lucide-react";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { ImageUpload } from "@/components/admin/ImageUpload";

interface Event {
  id: string;
  title: string;
  type: string | null;
  shortDescription: string | null;
  detailedDescription?: string | null;
  imageUrl?: string | null;
  eventDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    type: "conference",
    shortDescription: "",
    detailedDescription: "",
    imageUrl: "",
    eventDate: "",
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events");
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = "/api/events";
      const method = editingEvent ? "PUT" : "POST";
      const body = editingEvent
        ? { ...formData, id: editingEvent.id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        await fetchEvents();
        setDialogOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  const handleDelete = async () => {
    if (!deletingEventId) return;
    try {
      const response = await fetch(`/api/events?id=${deletingEventId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        await fetchEvents();
        setDeleteDialogOpen(false);
        setDeletingEventId(null);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const openEditDialog = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      type: event.type || "conference",
      shortDescription: event.shortDescription || "",
      detailedDescription: event.detailedDescription || "",
      imageUrl: event.imageUrl || "",
      eventDate: event.eventDate ? event.eventDate.split("T")[0] : "",
    });
    setDialogOpen(true);
  };

  const openDeleteDialog = (id: string) => {
    setDeletingEventId(id);
    setDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setEditingEvent(null);
    setFormData({
      title: "",
      type: "conference",
      shortDescription: "",
      detailedDescription: "",
      imageUrl: "",
      eventDate: "",
    });
  };

  const getEventTypeLabel = (type: string | null) => {
    const types: Record<string, string> = {
      conference: "Conferință",
      meeting: "Întâlnire",
      workshop: "Workshop",
      seminar: "Seminar",
      other: "Altele",
    };
    return types[type || "other"] || "Altele";
  };

  const getEventTypeBadgeColor = (type: string | null) => {
    const colors: Record<string, string> = {
      conference: "bg-blue-500",
      meeting: "bg-green-500",
      workshop: "bg-purple-500",
      seminar: "bg-orange-500",
      other: "bg-gray-500",
    };
    return colors[type || "other"] || "bg-gray-500";
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Evenimente</h1>
              <p className="text-muted-foreground">
                Gestionează evenimentele SCIPI (conferințe, întâlniri, workshop-uri)
              </p>
            </div>
            <Button
              onClick={() => {
                resetForm();
                setDialogOpen(true);
              }}
            >
              <Plus className="mr-2 size-4" />
              Adaugă Eveniment
            </Button>
          </div>

        {loading ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">Se încarcă...</p>
            </CardContent>
          </Card>
        ) : events.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                Nu există evenimente. Adaugă primul eveniment!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titlu & Tip</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Creat</TableHead>
                  <TableHead className="text-right">Acțiuni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{event.title}</div>
                        <Badge className={getEventTypeBadgeColor(event.type)}>
                          {getEventTypeLabel(event.type)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {event.eventDate ? (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="size-4 mr-2" />
                          {new Date(event.eventDate).toLocaleDateString("ro-RO", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">Fără dată</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(event.createdAt).toLocaleDateString("ro-RO")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(event)}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeleteDialog(event.id)}
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
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingEvent ? "Editează Eveniment" : "Adaugă Eveniment"}
            </DialogTitle>
            <DialogDescription>
              Completează informațiile evenimentului. Folosește editorul pentru detalii complete.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Titlu Eveniment *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Ex: Conferința Națională SCIPI 2025"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="type">Tip Eveniment *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conference">Conferință</SelectItem>
                    <SelectItem value="meeting">Întâlnire</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="seminar">Seminar</SelectItem>
                    <SelectItem value="other">Altele</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="imageUrl">Imagine Eveniment</Label>
                <ImageUpload
                  currentImageUrl={formData.imageUrl}
                  onImageUploaded={(url) =>
                    setFormData({ ...formData, imageUrl: url })
                  }
                  type="event"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="eventDate">Data Eveniment</Label>
                <Input
                  id="eventDate"
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) =>
                    setFormData({ ...formData, eventDate: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="shortDescription">Descriere Scurtă *</Label>
                <Textarea
                  id="shortDescription"
                  value={formData.shortDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, shortDescription: e.target.value })
                  }
                  rows={3}
                  placeholder="Descriere scurtă care va apărea pe card-ul evenimentului (2-3 propoziții)..."
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>Detalii Complete ale Evenimentului</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Folosește editorul pentru a adăuga detalii complete: descriere, comitete organizare, program, locație, etc.
                </p>
                <RichTextEditor
                  content={formData.detailedDescription}
                  onChange={(html) =>
                    setFormData({ ...formData, detailedDescription: html })
                  }
                  placeholder="Scrie detaliile complete ale evenimentului..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Anulează
              </Button>
              <Button type="submit">
                {editingEvent ? "Salvează Modificările" : "Adaugă Eveniment"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmare Ștergere</DialogTitle>
            <DialogDescription>
              Sigur doriți să ștergeți acest eveniment? Această acțiune nu poate fi anulată.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Anulează
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Șterge
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
