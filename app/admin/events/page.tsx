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
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Pencil, Trash2, Calendar, Layers, Eye, EyeOff } from "lucide-react";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { EventSectionEditor, EventSection } from "@/components/admin/EventSectionEditor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SectionFile {
  id?: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
}

interface EventSectionData {
  id?: string;
  title?: string;
  titleEn?: string;
  content?: string;
  contentEn?: string;
  backgroundColor?: string;
  displayOrder: number;
  files?: SectionFile[];
}

interface Event {
  id: string;
  title: string;
  titleEn?: string | null;
  type: string | null;
  shortDescription: string | null;
  shortDescriptionEn?: string | null;
  detailedDescription?: string | null;
  detailedDescriptionEn?: string | null;
  imageUrl?: string | null;
  eventDate?: string | null;
  dateText?: string | null;
  dateTextEn?: string | null;
  location?: string | null;
  locationEn?: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  sections?: EventSectionData[];
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
    titleEn: "",
    type: "conference",
    shortDescription: "",
    shortDescriptionEn: "",
    detailedDescription: "",
    detailedDescriptionEn: "",
    imageUrl: "",
    eventDate: "",
    dateText: "",
    dateTextEn: "",
    location: "",
    locationEn: "",
    displayOrder: 0,
    isActive: true,
    sections: [] as EventSection[],
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events?includeSections=true&includeInactive=true");
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
      titleEn: event.titleEn || "",
      type: event.type || "conference",
      shortDescription: event.shortDescription || "",
      shortDescriptionEn: event.shortDescriptionEn || "",
      detailedDescription: event.detailedDescription || "",
      detailedDescriptionEn: event.detailedDescriptionEn || "",
      imageUrl: event.imageUrl || "",
      eventDate: event.eventDate ? event.eventDate.split("T")[0] : "",
      dateText: event.dateText || "",
      dateTextEn: event.dateTextEn || "",
      location: event.location || "",
      locationEn: event.locationEn || "",
      displayOrder: event.displayOrder || 0,
      isActive: event.isActive,
      sections: event.sections || [],
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
      titleEn: "",
      type: "conference",
      shortDescription: "",
      shortDescriptionEn: "",
      detailedDescription: "",
      detailedDescriptionEn: "",
      imageUrl: "",
      eventDate: "",
      dateText: "",
      dateTextEn: "",
      location: "",
      locationEn: "",
      displayOrder: 0,
      isActive: true,
      sections: [],
    });
  };

  const handleToggleActive = async (event: Event) => {
    try {
      const response = await fetch("/api/events", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: event.id,
          isActive: !event.isActive,
        }),
      });
      if (response.ok) {
        await fetchEvents();
      }
    } catch (error) {
      console.error("Error toggling event visibility:", error);
    }
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
                  <TableHead className="w-12">Ord.</TableHead>
                  <TableHead>Titlu & Tip</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="w-[100px]">Vizibil</TableHead>
                  <TableHead className="text-right">Acțiuni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id} className={!event.isActive ? "opacity-50" : ""}>
                    <TableCell className="font-medium text-center">
                      {event.displayOrder}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{event.title}</div>
                        <div className="flex items-center gap-2">
                          <Badge className={getEventTypeBadgeColor(event.type)}>
                            {getEventTypeLabel(event.type)}
                          </Badge>
                          {event.sections && event.sections.length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              <Layers className="size-3 mr-1" />
                              {event.sections.length} secțiuni
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {event.dateText ? (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="size-4 mr-2" />
                          {event.dateText}
                        </div>
                      ) : event.eventDate ? (
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
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleActive(event)}
                        className={event.isActive ? "text-green-600" : "text-muted-foreground"}
                        title={event.isActive ? "Vizibil pe site - click pentru a ascunde" : "Ascuns - click pentru a face vizibil"}
                      >
                        {event.isActive ? (
                          <Eye className="size-4" />
                        ) : (
                          <EyeOff className="size-4" />
                        )}
                      </Button>
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
        <DialogContent className="max-h-[90vh] w-[1200px] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingEvent ? "Editează Eveniment" : "Adaugă Eveniment"}
            </DialogTitle>
            <DialogDescription>
              Completează informațiile evenimentului. Folosește editorul pentru detalii complete.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="">
            <div className="grid gap-6 py-4">
              {/* Language Tabs for Title */}
              <Tabs defaultValue="ro" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="ro" className="flex items-center gap-2">
                    <span>🇷🇴</span> Română
                  </TabsTrigger>
                  <TabsTrigger value="en" className="flex items-center gap-2">
                    <span>🇬🇧</span> English
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="ro" className="space-y-4">
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
                </TabsContent>

                <TabsContent value="en" className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="titleEn">Event Title (English)</Label>
                    <Input
                      id="titleEn"
                      value={formData.titleEn}
                      onChange={(e) =>
                        setFormData({ ...formData, titleEn: e.target.value })
                      }
                      placeholder="Ex: SCIPI National Conference 2025"
                    />
                  </div>
                </TabsContent>
              </Tabs>

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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="eventDate">Data Eveniment (exactă)</Label>
                  <Input
                    id="eventDate"
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) =>
                      setFormData({ ...formData, eventDate: e.target.value })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Folosește pentru o dată exactă
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="dateText">Interval/Text Dată (opțional)</Label>
                  <Input
                    id="dateText"
                    value={formData.dateText}
                    onChange={(e) =>
                      setFormData({ ...formData, dateText: e.target.value })
                    }
                    placeholder="Ex: Iunie - August 2025"
                  />
                  <p className="text-xs text-muted-foreground">
                    Folosește pentru intervale (are prioritate față de data exactă)
                  </p>
                </div>
              </div>

              {/* Location with Language options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="location">Locație RO (opțional)</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="Ex: București, România"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="locationEn">Location EN (optional)</Label>
                  <Input
                    id="locationEn"
                    value={formData.locationEn}
                    onChange={(e) =>
                      setFormData({ ...formData, locationEn: e.target.value })
                    }
                    placeholder="Ex: Bucharest, Romania"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="dateTextEn">Date Text EN (optional)</Label>
                  <Input
                    id="dateTextEn"
                    value={formData.dateTextEn}
                    onChange={(e) =>
                      setFormData({ ...formData, dateTextEn: e.target.value })
                    }
                    placeholder="Ex: June - August 2025"
                  />
                  <p className="text-xs text-muted-foreground">
                    English version of date range text
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="displayOrder">Ordine Afișare</Label>
                  <Input
                    id="displayOrder"
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) =>
                      setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })
                    }
                    min={0}
                  />
                  <p className="text-xs text-muted-foreground">
                    Număr mai mic = apare primul
                  </p>
                </div>
              </div>

              {/* Short Description with Language Tabs */}
              <Tabs defaultValue="desc-ro" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="desc-ro" className="flex items-center gap-2">
                    <span>🇷🇴</span> Descriere RO
                  </TabsTrigger>
                  <TabsTrigger value="desc-en" className="flex items-center gap-2">
                    <span>🇬🇧</span> Description EN
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="desc-ro">
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
                </TabsContent>

                <TabsContent value="desc-en">
                  <div className="grid gap-2">
                    <Label htmlFor="shortDescriptionEn">Short Description (English)</Label>
                    <Textarea
                      id="shortDescriptionEn"
                      value={formData.shortDescriptionEn}
                      onChange={(e) =>
                        setFormData({ ...formData, shortDescriptionEn: e.target.value })
                      }
                      rows={3}
                      placeholder="Short description that will appear on the event card (2-3 sentences)..."
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="grid gap-2">
                <Label>Detalii Complete ale Evenimentului (opțional)</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Poți folosi acest editor pentru text introductiv, sau folosește secțiunile de mai jos pentru conținut structurat.
                </p>
                <Tabs defaultValue="detail-ro" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="detail-ro" className="flex items-center gap-2">
                      <span>🇷🇴</span> Detalii RO
                    </TabsTrigger>
                    <TabsTrigger value="detail-en" className="flex items-center gap-2">
                      <span>🇬🇧</span> Details EN
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="detail-ro">
                    <RichTextEditor
                      content={formData.detailedDescription}
                      onChange={(html) =>
                        setFormData({ ...formData, detailedDescription: html })
                      }
                      placeholder="Text introductiv (opțional)..."
                    />
                  </TabsContent>
                  <TabsContent value="detail-en">
                    <RichTextEditor
                      content={formData.detailedDescriptionEn}
                      onChange={(html) =>
                        setFormData({ ...formData, detailedDescriptionEn: html })
                      }
                      placeholder="Introductory text (optional)..."
                    />
                  </TabsContent>
                </Tabs>
              </div>

              {/* Event Sections */}
              <div className="pt-4 border-t">
                <EventSectionEditor
                  sections={formData.sections}
                  onChange={(sections) => setFormData({ ...formData, sections })}
                />
              </div>

              <div className="flex items-center space-x-2 pt-4 border-t">
                <Checkbox
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked as boolean })
                  }
                />
                <Label htmlFor="isActive" className="text-sm font-normal">
                  Vizibil pe site (activ) - Debifează pentru a salva ca draft
                </Label>
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
