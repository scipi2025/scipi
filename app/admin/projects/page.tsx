"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2, Calendar } from "lucide-react";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminHeader } from "@/components/admin/admin-header";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { ImageUpload } from "@/components/admin/ImageUpload";

interface Project {
  id: string;
  title: string;
  shortDescription: string;
  detailedDescription?: string | null;
  status?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    detailedDescription: "",
    status: "ongoing",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = "/api/projects";
      const method = editingProject ? "PUT" : "POST";
      const body = editingProject
        ? { ...formData, id: editingProject.id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        await fetchProjects();
        setDialogOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  const handleDelete = async () => {
    if (!deletingProjectId) return;
    try {
      const response = await fetch(`/api/projects?id=${deletingProjectId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        await fetchProjects();
        setDeleteDialogOpen(false);
        setDeletingProjectId(null);
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const openEditDialog = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      shortDescription: project.shortDescription || "",
      detailedDescription: project.detailedDescription || "",
      status: project.status || "ongoing",
      startDate: project.startDate ? project.startDate.split("T")[0] : "",
      endDate: project.endDate ? project.endDate.split("T")[0] : "",
    });
    setDialogOpen(true);
  };

  const openDeleteDialog = (projectId: string) => {
    setDeletingProjectId(projectId);
    setDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setEditingProject(null);
    setFormData({
      title: "",
      shortDescription: "",
      detailedDescription: "",
      status: "ongoing",
      startDate: "",
      endDate: "",
    });
  };

  const filteredProjects = projects.filter((project) => {
    if (activeTab === "all") return true;
    return project.status === activeTab;
  });

  const formatDate = (date: string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("ro-RO");
  };

  return (
    <div className="">
      <AdminHeader title="Proiecte" />

      <div className="flex-1 overflow-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">Toate</TabsTrigger>
              <TabsTrigger value="ongoing">În Derulare</TabsTrigger>
              <TabsTrigger value="completed">Finalizate</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button
            onClick={() => {
              resetForm();
              setDialogOpen(true);
            }}
          >
            <Plus className="mr-2 size-4" />
            Adaugă Proiect
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titlu & Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Creat</TableHead>
                  <TableHead className="text-right">Acțiuni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium max-w-md">
                      <div className="space-y-1">
                        <div className="truncate">{project.title}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {project.shortDescription ? project.shortDescription.substring(0, 100) + '...' : 'Fără descriere'}
                        </div>
                        {project.status && (
                          <Badge className={project.status === "ongoing" ? "bg-blue-500" : "bg-green-600"}>
                            {project.status === "ongoing" ? "În Curs" : "Finalizat"}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm space-y-1">
                        {project.startDate && (
                          <div className="flex items-center text-muted-foreground">
                            <Calendar className="size-3 mr-1" />
                            Început: {new Date(project.startDate).toLocaleDateString("ro-RO")}
                          </div>
                        )}
                        {project.endDate && (
                          <div className="flex items-center text-muted-foreground">
                            <Calendar className="size-3 mr-1" />
                            Sfârșit: {new Date(project.endDate).toLocaleDateString("ro-RO")}
                          </div>
                        )}
                        {!project.startDate && !project.endDate && (
                          <span className="text-muted-foreground">Fără date</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(project.createdAt).toLocaleDateString("ro-RO")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(project)}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeleteDialog(project.id)}
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

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProject ? "Editează Proiect" : "Adaugă Proiect"}
            </DialogTitle>
            <DialogDescription>
              Completează informațiile proiectului. Folosește editorul pentru descrieri detaliate.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Titlu Proiect *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Ex: Studiu privind rezistența antimicrobiană..."
                  required
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
                  placeholder="Descriere scurtă care va apărea pe card-ul proiectului (2-3 propoziții)..."
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">Status Proiect</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ongoing">În Curs</SelectItem>
                    <SelectItem value="completed">Finalizat</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startDate">Data Început</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endDate">Data Sfârșit</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Conținut Complet al Proiectului</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Folosește editorul pentru a adăuga detalii complete: obiective, metodologie, rezultate așteptate, posibilități de colaborare, etc.
                </p>
                <RichTextEditor
                  content={formData.detailedDescription}
                  onChange={(html) =>
                    setFormData({ ...formData, detailedDescription: html })
                  }
                  placeholder="Scrie conținutul complet al proiectului..."
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
                {editingProject ? "Salvează Modificările" : "Adaugă Proiect"}
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
              Sigur doriți să ștergeți acest proiect? Această acțiune nu poate fi anulată.
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
