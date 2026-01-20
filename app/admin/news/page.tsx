"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Pencil, Trash2, GripVertical, Eye, EyeOff, ExternalLink, Calendar, FolderKanban, BookOpen, Newspaper } from "lucide-react";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

interface Event {
  id: string;
  title: string;
}

interface Project {
  id: string;
  title: string;
}

interface Resource {
  id: string;
  title: string;
}

interface NewsItem {
  id: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  linkType: string;
  linkUrl: string | null;
  eventId: string | null;
  projectId: string | null;
  resourceId: string | null;
  displayOrder: number;
  isActive: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  event?: { id: string; title: string } | null;
  project?: { id: string; title: string } | null;
  resource?: { id: string; title: string } | null;
}

export default function AdminNewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [deletingNewsId, setDeletingNewsId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    linkType: "internal",
    linkUrl: "",
    eventId: "",
    projectId: "",
    resourceId: "",
    isActive: true,
  });

  const fetchNews = useCallback(async () => {
    try {
      const response = await fetch("/api/news");
      if (response.ok) {
        const data = await response.json();
        setNews(data);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRelatedData = useCallback(async () => {
    try {
      const [eventsRes, projectsRes, resourcesRes] = await Promise.all([
        fetch("/api/events"),
        fetch("/api/projects"),
        fetch("/api/resources"),
      ]);
      
      if (eventsRes.ok) setEvents(await eventsRes.json());
      if (projectsRes.ok) setProjects(await projectsRes.json());
      if (resourcesRes.ok) setResources(await resourcesRes.json());
    } catch (error) {
      console.error("Error fetching related data:", error);
    }
  }, []);

  useEffect(() => {
    fetchNews();
    fetchRelatedData();
  }, [fetchNews, fetchRelatedData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = "/api/news";
      const method = editingNews ? "PUT" : "POST";
      
      const body = {
        ...formData,
        id: editingNews?.id,
        displayOrder: editingNews?.displayOrder ?? news.length,
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        await fetchNews();
        setDialogOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error("Error saving news:", error);
    }
  };

  const handleDelete = async () => {
    if (!deletingNewsId) return;
    try {
      const response = await fetch(`/api/news?id=${deletingNewsId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        await fetchNews();
        setDeleteDialogOpen(false);
        setDeletingNewsId(null);
      }
    } catch (error) {
      console.error("Error deleting news:", error);
    }
  };

  const handleToggleActive = async (newsItem: NewsItem) => {
    try {
      const response = await fetch("/api/news", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: newsItem.id,
          isActive: !newsItem.isActive,
        }),
      });
      if (response.ok) {
        await fetchNews();
      }
    } catch (error) {
      console.error("Error toggling news visibility:", error);
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    const newNews = [...news];
    const temp = newNews[index];
    newNews[index] = newNews[index - 1];
    newNews[index - 1] = temp;
    
    // Update display orders
    const items = newNews.map((item, idx) => ({
      id: item.id,
      displayOrder: idx,
    }));

    try {
      await fetch("/api/news", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      await fetchNews();
    } catch (error) {
      console.error("Error reordering news:", error);
    }
  };

  const handleMoveDown = async (index: number) => {
    if (index === news.length - 1) return;
    const newNews = [...news];
    const temp = newNews[index];
    newNews[index] = newNews[index + 1];
    newNews[index + 1] = temp;
    
    // Update display orders
    const items = newNews.map((item, idx) => ({
      id: item.id,
      displayOrder: idx,
    }));

    try {
      await fetch("/api/news", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      await fetchNews();
    } catch (error) {
      console.error("Error reordering news:", error);
    }
  };

  const openEditDialog = (newsItem: NewsItem) => {
    setEditingNews(newsItem);
    setFormData({
      title: newsItem.title,
      excerpt: newsItem.excerpt || "",
      content: newsItem.content || "",
      linkType: newsItem.linkType,
      linkUrl: newsItem.linkUrl || "",
      eventId: newsItem.eventId || "",
      projectId: newsItem.projectId || "",
      resourceId: newsItem.resourceId || "",
      isActive: newsItem.isActive,
    });
    setDialogOpen(true);
  };

  const openDeleteDialog = (id: string) => {
    setDeletingNewsId(id);
    setDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setEditingNews(null);
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      linkType: "internal",
      linkUrl: "",
      eventId: "",
      projectId: "",
      resourceId: "",
      isActive: true,
    });
  };

  const getLinkTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      internal: "Pagină proprie",
      event: "Eveniment",
      project: "Proiect",
      resource: "Resursă",
      external: "Link extern",
    };
    return types[type] || type;
  };

  const getLinkTypeIcon = (type: string) => {
    switch (type) {
      case "event":
        return <Calendar className="size-4" />;
      case "project":
        return <FolderKanban className="size-4" />;
      case "resource":
        return <BookOpen className="size-4" />;
      case "external":
        return <ExternalLink className="size-4" />;
      default:
        return <Newspaper className="size-4" />;
    }
  };

  const getLinkedItemTitle = (newsItem: NewsItem) => {
    switch (newsItem.linkType) {
      case "event":
        return newsItem.event?.title || "Eveniment șters";
      case "project":
        return newsItem.project?.title || "Proiect șters";
      case "resource":
        return newsItem.resource?.title || "Resursă ștersă";
      case "external":
        return newsItem.linkUrl || "-";
      case "internal":
        return "/noutati/" + newsItem.id;
      default:
        return "-";
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Noutăți</h1>
              <p className="text-muted-foreground">
                Gestionează anunțurile și noutățile afișate pe pagina principală
              </p>
            </div>
            <Button
              onClick={() => {
                resetForm();
                setDialogOpen(true);
              }}
            >
              <Plus className="mr-2 size-4" />
              Adaugă Noutate
            </Button>
          </div>

          {loading ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">Se încarcă...</p>
              </CardContent>
            </Card>
          ) : news.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  Nu există noutăți. Adaugă prima noutate!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Ordine</TableHead>
                    <TableHead>Titlu</TableHead>
                    <TableHead>Tip Link</TableHead>
                    <TableHead>Destinație</TableHead>
                    <TableHead className="w-[100px]">Vizibil</TableHead>
                    <TableHead className="text-right">Acțiuni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {news.map((newsItem, index) => (
                    <TableRow key={newsItem.id} className={!newsItem.isActive ? "opacity-50" : ""}>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2"
                            onClick={() => handleMoveUp(index)}
                            disabled={index === 0}
                          >
                            ↑
                          </Button>
                          <div className="flex items-center justify-center">
                            <GripVertical className="size-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground ml-1">{index + 1}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2"
                            onClick={() => handleMoveDown(index)}
                            disabled={index === news.length - 1}
                          >
                            ↓
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{newsItem.title}</div>
                        {newsItem.excerpt && (
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {newsItem.excerpt}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="gap-1">
                          {getLinkTypeIcon(newsItem.linkType)}
                          {getLinkTypeLabel(newsItem.linkType)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground truncate max-w-[200px] block">
                          {getLinkedItemTitle(newsItem)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleActive(newsItem)}
                          className={newsItem.isActive ? "text-green-600" : "text-muted-foreground"}
                        >
                          {newsItem.isActive ? (
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
                            onClick={() => openEditDialog(newsItem)}
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteDialog(newsItem.id)}
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingNews ? "Editează Noutate" : "Adaugă Noutate"}
            </DialogTitle>
            <DialogDescription>
              Creează o noutate care poate duce către o pagină proprie sau către un eveniment, proiect sau resursă existentă.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Titlu *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Ex: Anunț important pentru membri"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="excerpt">Rezumat (opțional)</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData({ ...formData, excerpt: e.target.value })
                  }
                  rows={2}
                  placeholder="Scurtă descriere care va apărea în lista de noutăți..."
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="linkType">Tip Link *</Label>
                <Select
                  value={formData.linkType}
                  onValueChange={(value) =>
                    setFormData({ 
                      ...formData, 
                      linkType: value,
                      eventId: "",
                      projectId: "",
                      resourceId: "",
                      linkUrl: "",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="internal">Pagină proprie (cu conținut)</SelectItem>
                    <SelectItem value="event">Link către Eveniment</SelectItem>
                    <SelectItem value="project">Link către Proiect</SelectItem>
                    <SelectItem value="resource">Link către Resursă</SelectItem>
                    <SelectItem value="external">Link extern</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Conditional fields based on linkType */}
              {formData.linkType === "event" && (
                <div className="grid gap-2">
                  <Label>Selectează Eveniment *</Label>
                  <Select
                    value={formData.eventId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, eventId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Alege un eveniment..." />
                    </SelectTrigger>
                    <SelectContent>
                      {events.map((event) => (
                        <SelectItem key={event.id} value={event.id}>
                          {event.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {formData.linkType === "project" && (
                <div className="grid gap-2">
                  <Label>Selectează Proiect *</Label>
                  <Select
                    value={formData.projectId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, projectId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Alege un proiect..." />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {formData.linkType === "resource" && (
                <div className="grid gap-2">
                  <Label>Selectează Resursă *</Label>
                  <Select
                    value={formData.resourceId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, resourceId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Alege o resursă..." />
                    </SelectTrigger>
                    <SelectContent>
                      {resources.map((resource) => (
                        <SelectItem key={resource.id} value={resource.id}>
                          {resource.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {formData.linkType === "external" && (
                <div className="grid gap-2">
                  <Label htmlFor="linkUrl">URL Extern *</Label>
                  <Input
                    id="linkUrl"
                    type="url"
                    value={formData.linkUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, linkUrl: e.target.value })
                    }
                    placeholder="https://example.com/..."
                  />
                </div>
              )}

              {formData.linkType === "internal" && (
                <div className="grid gap-2">
                  <Label>Conținut Pagină</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Această noutate va avea propria pagină. Scrie conținutul complet aici.
                  </p>
                  <RichTextEditor
                    content={formData.content}
                    onChange={(html) =>
                      setFormData({ ...formData, content: html })
                    }
                    placeholder="Scrie conținutul complet al noutății..."
                  />
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked as boolean })
                  }
                />
                <Label htmlFor="isActive" className="text-sm font-normal">
                  Vizibil pe site (activ)
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
                {editingNews ? "Salvează Modificările" : "Adaugă Noutate"}
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
              Sigur doriți să ștergeți această noutate? Această acțiune nu poate fi anulată.
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
