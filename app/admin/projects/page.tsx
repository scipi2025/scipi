"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2, Calendar, ArrowUp, ArrowDown, Eye, EyeOff, Layers } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { AdminHeader } from "@/components/admin/admin-header";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { SectionEditor, Section } from "@/components/admin/SectionEditor";

interface SectionFile {
  id?: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
}

interface ProjectSectionData {
  id?: string;
  title?: string;
  titleEn?: string;
  content?: string;
  contentEn?: string;
  backgroundColor?: string;
  displayOrder: number;
  files?: SectionFile[];
}

interface Project {
  id: string;
  title: string;
  titleEn?: string | null;
  shortDescription: string;
  shortDescriptionEn?: string | null;
  detailedDescription?: string | null;
  detailedDescriptionEn?: string | null;
  imageUrl?: string | null;
  showImageOnDetail?: boolean;
  status?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  sections?: ProjectSectionData[];
}

const getPlainTextFromHtml = (html: string | null | undefined) => {
  if (!html) return "";

  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const hasMeaningfulHtmlContent = (html: string | null | undefined) => {
  if (!html) return false;

  const hasEmbeddedMedia = /<(img|video|iframe|embed|object|svg)\b/i.test(html);
  return hasEmbeddedMedia || getPlainTextFromHtml(html).length > 0;
};

const hasMeaningfulText = (value: string | null | undefined) => {
  return Boolean(value && value.trim().length > 0);
};

const sanitizeSections = (sections: Section[]) => {
  return sections
    .filter((section) => {
      const hasTitle = hasMeaningfulText(section.title) || hasMeaningfulText(section.titleEn);
      const hasContent =
        hasMeaningfulHtmlContent(section.content) || hasMeaningfulHtmlContent(section.contentEn);
      const hasFiles = Boolean(section.files && section.files.length > 0);

      return hasTitle || hasContent || hasFiles;
    })
    .map((section, index) => ({
      ...section,
      title: section.title?.trim() || "",
      titleEn: section.titleEn?.trim() || "",
      displayOrder: index,
    }));
};

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
    titleEn: "",
    shortDescription: "",
    shortDescriptionEn: "",
    detailedDescription: "",
    detailedDescriptionEn: "",
    imageUrl: "",
    showImageOnDetail: true,
    status: "ongoing",
    startDate: "",
    endDate: "",
    isActive: true,
    sections: [] as Section[],
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects?includeInactive=true&includeSections=true");
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
      const sanitizedSections = sanitizeSections(formData.sections);
      const url = "/api/projects";
      const method = editingProject ? "PUT" : "POST";
      const body = editingProject
        ? { ...formData, id: editingProject.id, sections: sanitizedSections }
        : { ...formData, sections: sanitizedSections };

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
      titleEn: project.titleEn || "",
      shortDescription: project.shortDescription || "",
      shortDescriptionEn: project.shortDescriptionEn || "",
      detailedDescription: project.detailedDescription || "",
      detailedDescriptionEn: project.detailedDescriptionEn || "",
      imageUrl: project.imageUrl || "",
      showImageOnDetail: project.showImageOnDetail ?? true,
      status: project.status || "ongoing",
      startDate: project.startDate ? project.startDate.split("T")[0] : "",
      endDate: project.endDate ? project.endDate.split("T")[0] : "",
      isActive: project.isActive,
      sections: project.sections || [],
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
      titleEn: "",
      shortDescription: "",
      shortDescriptionEn: "",
      detailedDescription: "",
      detailedDescriptionEn: "",
      imageUrl: "",
      showImageOnDetail: true,
      status: "ongoing",
      startDate: "",
      endDate: "",
      isActive: true,
      sections: [],
    });
  };

  const handleToggleActive = async (project: Project) => {
    try {
      const response = await fetch("/api/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: project.id,
          isActive: !project.isActive,
        }),
      });
      if (response.ok) {
        await fetchProjects();
      }
    } catch (error) {
      console.error("Error toggling project visibility:", error);
    }
  };

  const moveProject = async (projectId: string, direction: "up" | "down") => {
    const currentIndex = projects.findIndex((p) => p.id === projectId);
    if (currentIndex === -1) return;
    
    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= projects.length) return;

    const currentProject = projects[currentIndex];
    const swapProject = projects[newIndex];

    try {
      // Swap displayOrder values
      await Promise.all([
        fetch("/api/projects", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: currentProject.id, displayOrder: swapProject.displayOrder }),
        }),
        fetch("/api/projects", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: swapProject.id, displayOrder: currentProject.displayOrder }),
        }),
      ]);
      await fetchProjects();
    } catch (error) {
      console.error("Error reordering projects:", error);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
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
                  <TableHead className="w-16">Ordine</TableHead>
                  <TableHead>Titlu & Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[100px]">Vizibil</TableHead>
                  <TableHead>Creat</TableHead>
                  <TableHead className="text-right">Acțiuni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project, index) => (
                  <TableRow key={project.id} className={!project.isActive ? "opacity-50" : ""}>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveProject(project.id, "up")}
                          disabled={index === 0}
                          className="h-6 w-6 p-0"
                        >
                          <ArrowUp className="size-3" />
                        </Button>
                        <span className="text-xs text-center text-muted-foreground">{project.displayOrder}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveProject(project.id, "down")}
                          disabled={index === projects.length - 1}
                          className="h-6 w-6 p-0"
                        >
                          <ArrowDown className="size-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium max-w-md">
                      <div className="space-y-1">
                        <div className="truncate">{project.title}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {project.shortDescription ? project.shortDescription.substring(0, 100) + '...' : 'Fără descriere'}
                        </div>
                        <div className="flex items-center gap-2">
                          {project.status && (
                            <Badge className={project.status === "ongoing" ? "bg-blue-500" : "bg-green-600"}>
                              {project.status === "ongoing" ? "În Curs" : "Finalizat"}
                            </Badge>
                          )}
                          {project.sections && project.sections.length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              <Layers className="size-3 mr-1" />
                              {project.sections.length} secțiuni
                            </Badge>
                          )}
                        </div>
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
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleActive(project)}
                        className={project.isActive ? "text-green-600" : "text-muted-foreground"}
                        title={project.isActive ? "Vizibil pe site - click pentru a ascunde" : "Ascuns - click pentru a face vizibil"}
                      >
                        {project.isActive ? (
                          <Eye className="size-4" />
                        ) : (
                          <EyeOff className="size-4" />
                        )}
                      </Button>
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
              Completează informațiile proiectului. Folosește editorul pentru descrieri detaliate și secțiunile pentru conținut structurat.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 py-4">
              {/* Language Tabs for Title and Short Description */}
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
                    <Label htmlFor="shortDescription">Descriere Scurtă</Label>
                    <Textarea
                      id="shortDescription"
                      value={formData.shortDescription}
                      onChange={(e) =>
                        setFormData({ ...formData, shortDescription: e.target.value })
                      }
                      rows={3}
                      placeholder="Descriere scurtă opțională care poate apărea pe card-ul proiectului..."
                    />
                  </div>
                </TabsContent>

                <TabsContent value="en" className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="titleEn">Project Title (English)</Label>
                    <Input
                      id="titleEn"
                      value={formData.titleEn}
                      onChange={(e) =>
                        setFormData({ ...formData, titleEn: e.target.value })
                      }
                      placeholder="Ex: Antimicrobial Resistance Study..."
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="shortDescriptionEn">Short Description (English)</Label>
                    <Textarea
                      id="shortDescriptionEn"
                      value={formData.shortDescriptionEn}
                      onChange={(e) =>
                        setFormData({ ...formData, shortDescriptionEn: e.target.value })
                      }
                      rows={3}
                      placeholder="Short description that will appear on the project card (2-3 sentences)..."
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="grid gap-2">
                <Label htmlFor="imageUrl">Imagine Proiect</Label>
                <ImageUpload
                  currentImageUrl={formData.imageUrl}
                  onImageUploaded={(url) =>
                    setFormData({ ...formData, imageUrl: url })
                  }
                  type="project"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="showImageOnDetail"
                  checked={formData.showImageOnDetail}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, showImageOnDetail: checked === true })
                  }
                />
                <Label htmlFor="showImageOnDetail" className="text-sm font-normal">
                  Afișează imaginea și pe pagina proiectului
                </Label>
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
                <Label>Descriere Detaliată (opțional)</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Poți folosi acest editor pentru text introductiv, sau folosește secțiunile de mai jos pentru conținut structurat.
                </p>
                <Tabs defaultValue="content-ro" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="content-ro" className="flex items-center gap-2">
                      <span>🇷🇴</span> Conținut RO
                    </TabsTrigger>
                    <TabsTrigger value="content-en" className="flex items-center gap-2">
                      <span>🇬🇧</span> Content EN
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="content-ro">
                    <RichTextEditor
                      content={formData.detailedDescription}
                      onChange={(html) =>
                        setFormData({ ...formData, detailedDescription: html })
                      }
                      placeholder="Text introductiv (opțional)..."
                    />
                  </TabsContent>
                  <TabsContent value="content-en">
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

              {/* Project Sections */}
              <div className="pt-4 border-t">
                <SectionEditor
                  sections={formData.sections}
                  onChange={(sections) => setFormData({ ...formData, sections })}
                  label="Secțiuni Proiect"
                  description="Adaugă secțiuni separate pentru a organiza conținutul (Obiective, Metodologie, Echipă, etc.)"
                  idPrefix="project-section"
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
