"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, ExternalLink, Download, Upload, X, FileText } from "lucide-react";
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
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ResourceFile {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
}

interface Resource {
  id: string;
  title: string;
  description: string;
  url: string | null;
  type: string;
  isActive: boolean;
  files: ResourceFile[];
  createdAt: string;
  updatedAt: string;
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [deletingResourceId, setDeletingResourceId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    url: "",
    type: "guide",
    isActive: true,
  });
  
  const [uploadedFiles, setUploadedFiles] = useState<Array<{
    fileName: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
  }>>([]);
  const [filesToDelete, setFilesToDelete] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await fetch("/api/resources");
      if (response.ok) {
        const data = await response.json();
        setResources(data);
      }
    } catch (error) {
      console.error("Error fetching resources:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', 'resource');

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          return {
            fileName: data.originalName,
            fileUrl: data.url,
            fileSize: data.size,
            mimeType: data.mimeType,
          };
        }
        return null;
      });

      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter((r) => r !== null) as typeof uploadedFiles;
      
      setUploadedFiles(prev => [...prev, ...successfulUploads]);
      
      // Clear URL if files are uploaded
      if (successfulUploads.length > 0) {
        setFormData(prev => ({ ...prev, url: "" }));
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Eroare la încărcarea fișierelor');
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const handleRemoveUploadedFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingFile = (fileId: string) => {
    setFilesToDelete(prev => [...prev, fileId]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const existingFiles = editingResource?.files.filter(f => !filesToDelete.includes(f.id)) || [];
    const totalFiles = uploadedFiles.length + existingFiles.length;
    
    if (!formData.url && totalFiles === 0) {
      alert('Trebuie să furnizezi fie un URL, fie să încarci cel puțin un fișier');
      return;
    }

    try {
      const url = "/api/resources";
      const method = editingResource ? "PUT" : "POST";
      const body = editingResource
        ? { 
            ...formData, 
            id: editingResource.id,
            files: uploadedFiles,
            filesToDelete,
          }
        : { 
            ...formData,
            files: uploadedFiles,
          };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        await fetchResources();
        setDialogOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error("Error saving resource:", error);
    }
  };

  const openEditDialog = (resource: Resource) => {
    setEditingResource(resource);
    setFormData({
      title: resource.title,
      description: resource.description,
      url: resource.url || "",
      type: resource.type,
      isActive: resource.isActive,
    });
    setUploadedFiles([]);
    setFilesToDelete([]);
    setDialogOpen(true);
  };

  const openDeleteDialog = (resourceId: string) => {
    setDeletingResourceId(resourceId);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingResourceId) return;
    try {
      const response = await fetch(`/api/resources?id=${deletingResourceId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        await fetchResources();
        setDeleteDialogOpen(false);
        setDeletingResourceId(null);
      }
    } catch (error) {
      console.error("Error deleting resource:", error);
    }
  };

  const resetForm = () => {
    setEditingResource(null);
    setFormData({
      title: "",
      description: "",
      url: "",
      type: "guide",
      isActive: true,
    });
    setUploadedFiles([]);
    setFilesToDelete([]);
  };

  const filteredResources = resources.filter((resource) => {
    if (activeTab === "all") return true;
    return resource.type === activeTab;
  });

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "guide":
        return "Ghid";
      case "article":
        return "Articol";
      case "document":
        return "Document";
      default:
        return type;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Gestionare Resurse</h1>
      </header>

      <div className="flex-1 overflow-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Resurse</h2>
            <p className="text-muted-foreground">
              Gestionează ghidurile, articolele și documentele
            </p>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setDialogOpen(true);
            }}
          >
            <Plus className="mr-2 size-4" />
            Adaugă Resursă
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">Toate</TabsTrigger>
            <TabsTrigger value="guide">Ghiduri</TabsTrigger>
            <TabsTrigger value="article">Articole</TabsTrigger>
            <TabsTrigger value="document">Documente</TabsTrigger>
          </TabsList>
        </Tabs>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Se încarcă...</p>
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground mb-4">Nu există resurse înregistrate</p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 size-4" />
              Adaugă prima resursă
            </Button>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titlu</TableHead>
                  <TableHead>Tip</TableHead>
                  <TableHead>Link/Fișiere</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Acțiuni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResources.map((resource) => (
                  <TableRow key={resource.id}>
                    <TableCell className="font-medium max-w-md">
                      <div className="truncate">{resource.title}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {resource.description.substring(0, 100)}...
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{getTypeLabel(resource.type)}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {resource.url && (
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-primary hover:underline text-sm"
                          >
                            <ExternalLink className="mr-1 size-3" />
                            Link extern
                          </a>
                        )}
                        {resource.files && resource.files.length > 0 && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <FileText className="size-3" />
                            {resource.files.length} fișier{resource.files.length !== 1 ? 'e' : ''}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={resource.isActive ? "default" : "secondary"}>
                        {resource.isActive ? "Activ" : "Inactiv"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(resource)}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(resource.id)}
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingResource ? "Editează Resursă" : "Adaugă Resursă"}
            </DialogTitle>
            <DialogDescription>
              Completează informațiile resursei
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Titlu</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Descriere</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="url">URL Extern (opțional dacă încarci fișiere)</Label>
                <Input
                  id="url"
                  type="url"
                  value={formData.url}
                  onChange={(e) =>
                    setFormData({ ...formData, url: e.target.value })
                  }
                  placeholder="https://example.com/resource"
                  disabled={uploadedFiles.length > 0}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="files">SAU Încarcă Fișiere (opțional dacă ai URL)</Label>
                
                {/* Existing files (for edit mode) */}
                {editingResource && editingResource.files.length > 0 && (
                  <div className="space-y-2 mb-2">
                    <p className="text-sm text-muted-foreground">Fișiere existente:</p>
                    {editingResource.files
                      .filter(f => !filesToDelete.includes(f.id))
                      .map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-2 border rounded-md bg-muted/50">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <FileText className="size-4 text-muted-foreground flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm truncate">{file.fileName}</p>
                              <p className="text-xs text-muted-foreground">{formatFileSize(file.fileSize)}</p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              asChild
                            >
                              <a href={file.fileUrl} download>
                                <Download className="size-4" />
                              </a>
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveExistingFile(file.id)}
                            >
                              <X className="size-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}

                {/* Newly uploaded files */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2 mb-2">
                    {editingResource && <p className="text-sm text-muted-foreground">Fișiere noi:</p>}
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded-md bg-primary/5">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <Upload className="size-4 text-primary flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm truncate">{file.fileName}</p>
                            <p className="text-xs text-muted-foreground">{formatFileSize(file.fileSize)}</p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveUploadedFile(index)}
                        >
                          <X className="size-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* File input */}
                <div className="flex flex-col gap-2">
                  <Input
                    id="files"
                    type="file"
                    onChange={handleFileSelect}
                    disabled={!!formData.url || uploading}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,image/*"
                    multiple
                  />
                  {uploading && (
                    <span className="text-sm text-muted-foreground">Se încarcă...</span>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Poți selecta mai multe fișiere. Tipuri acceptate: PDF, Word, Excel, PowerPoint, text, ZIP, imagini (max 10MB per fișier)
                  </p>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Tip</Label>
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
                    <SelectItem value="guide">Ghid</SelectItem>
                    <SelectItem value="article">Articol</SelectItem>
                    <SelectItem value="document">Document</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="size-4"
                />
                <Label htmlFor="isActive">Activ</Label>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Anulează
              </Button>
              <Button type="submit">
                {editingResource ? "Salvează" : "Adaugă"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmare Ștergere</DialogTitle>
            <DialogDescription>
              Ești sigur că vrei să ștergi această resursă? Această acțiune nu poate fi
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
