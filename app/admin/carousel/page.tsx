"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, GripVertical, Image as ImageIcon } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { AdminHeader } from "@/components/admin/admin-header";

interface CarouselImage {
  id: string;
  imageUrl: string;
  alt: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const defaultImages = [
  {
    imageUrl: "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=2080",
    alt: "Laboratory test tubes",
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1579165466741-7f35e4755660?q=80&w=2070",
    alt: "Medical research equipment",
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=2069",
    alt: "Laboratory samples",
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?q=80&w=2070",
    alt: "Virus research",
  },
];

export default function CarouselPage() {
  const [images, setImages] = useState<CarouselImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<CarouselImage | null>(null);
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    imageUrl: "",
    alt: "",
    displayOrder: 0,
    isActive: true,
  });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch("/api/carousel");
      if (response.ok) {
        const data = await response.json();
        setImages(data);
      }
    } catch (error) {
      console.error("Error fetching carousel images:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);
    try {
      const url = "/api/carousel";
      const method = editingImage ? "PUT" : "POST";
      const body = editingImage
        ? { ...formData, id: editingImage.id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        await fetchImages();
        setDialogOpen(false);
        resetForm();
      } else {
        const data = await response.json();
        setFormError(data.error || "Eroare la salvare");
      }
    } catch (error) {
      console.error("Error saving carousel image:", error);
      setFormError("Eroare la salvare");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingImageId) return;
    try {
      const response = await fetch(`/api/carousel?id=${deletingImageId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        await fetchImages();
        setDeleteDialogOpen(false);
        setDeletingImageId(null);
      }
    } catch (error) {
      console.error("Error deleting carousel image:", error);
    }
  };

  const openEditDialog = (image: CarouselImage) => {
    setEditingImage(image);
    setFormData({
      imageUrl: image.imageUrl,
      alt: image.alt,
      displayOrder: image.displayOrder,
      isActive: image.isActive,
    });
    setDialogOpen(true);
  };

  const openDeleteDialog = (imageId: string) => {
    setDeletingImageId(imageId);
    setDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setEditingImage(null);
    setFormData({
      imageUrl: "",
      alt: "",
      displayOrder: 0,
      isActive: true,
    });
    setFormError("");
  };

  const addDefaultImages = async () => {
    setSaving(true);
    try {
      for (let i = 0; i < defaultImages.length; i++) {
        await fetch("/api/carousel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...defaultImages[i],
            displayOrder: i,
            isActive: true,
          }),
        });
      }
      await fetchImages();
    } catch (error) {
      console.error("Error adding default images:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <AdminHeader 
        title="Gestionare Carousel" 
        breadcrumbs={[{ label: "Carousel Imagini" }]} 
      />

      <div className="flex-1 overflow-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Imagini Carousel</h2>
            <p className="text-muted-foreground">
              Gestionează imaginile din carousel-ul de pe pagina principală
            </p>
          </div>
          <div className="flex gap-2">
            {images.length === 0 && (
              <Button
                variant="outline"
                onClick={addDefaultImages}
                disabled={saving}
              >
                <ImageIcon className="mr-2 size-4" />
                Adaugă Imagini Default
              </Button>
            )}
            <Button
              onClick={() => {
                resetForm();
                setFormData(prev => ({
                  ...prev,
                  displayOrder: images.length,
                }));
                setDialogOpen(true);
              }}
            >
              <Plus className="mr-2 size-4" />
              Adaugă Imagine
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Se încarcă...</p>
          </div>
        ) : images.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ImageIcon className="size-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">Nu există imagini în carousel</p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={addDefaultImages} disabled={saving}>
                <ImageIcon className="mr-2 size-4" />
                Adaugă Imagini Default
              </Button>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="mr-2 size-4" />
                Adaugă Imagine Nouă
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead className="w-32">Previzualizare</TableHead>
                  <TableHead>Text Alternativ</TableHead>
                  <TableHead className="w-24">Ordine</TableHead>
                  <TableHead className="w-24">Status</TableHead>
                  <TableHead className="text-right w-32">Acțiuni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {images
                  .sort((a, b) => a.displayOrder - b.displayOrder)
                  .map((image) => (
                  <TableRow key={image.id}>
                    <TableCell>
                      <GripVertical className="size-4 text-muted-foreground cursor-grab" />
                    </TableCell>
                    <TableCell>
                      <div className="relative h-16 w-24 rounded overflow-hidden bg-muted">
                        <img
                          src={image.imageUrl}
                          alt={image.alt}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{image.alt}</TableCell>
                    <TableCell>{image.displayOrder}</TableCell>
                    <TableCell>
                      <Badge variant={image.isActive ? "default" : "secondary"}>
                        {image.isActive ? "Activ" : "Inactiv"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(image)}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(image.id)}
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingImage ? "Editează Imagine" : "Adaugă Imagine"}
            </DialogTitle>
            <DialogDescription>
              {editingImage 
                ? "Modifică detaliile imaginii din carousel" 
                : "Adaugă o imagine nouă în carousel"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <ImageUpload
                currentImageUrl={formData.imageUrl}
                onImageUploaded={(url) => setFormData({ ...formData, imageUrl: url })}
                label="Imagine Carousel"
                type="carousel"
              />
              <div className="grid gap-2">
                <Label htmlFor="imageUrl">URL Imagine (sau încarcă mai sus)</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
                  placeholder="https://images.unsplash.com/..."
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="alt">Text Alternativ (pentru accesibilitate)</Label>
                <Input
                  id="alt"
                  value={formData.alt}
                  onChange={(e) =>
                    setFormData({ ...formData, alt: e.target.value })
                  }
                  placeholder="Descriere scurtă a imaginii"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="displayOrder">Ordine Afișare</Label>
                <Input
                  id="displayOrder"
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      displayOrder: parseInt(e.target.value) || 0,
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Imaginile sunt afișate în ordine crescătoare (0, 1, 2...)
                </p>
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
                <Label htmlFor="isActive">Activ (vizibil pe site)</Label>
              </div>
            </div>
            {formError && (
              <p className="text-sm text-destructive mb-4">{formError}</p>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={saving}
              >
                Anulează
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Se salvează..." : (editingImage ? "Salvează" : "Adaugă")}
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
              Ești sigur că vrei să ștergi această imagine? Această acțiune nu poate fi
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
    </div>
  );
}
