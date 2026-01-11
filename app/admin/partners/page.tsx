"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { AdminHeader } from "@/components/admin/admin-header";

interface Partner {
  id: string;
  name: string;
  description: string | null;
  logoUrl: string;
  type: string;
  websiteUrl: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [deletingPartnerId, setDeletingPartnerId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logoUrl: "",
    type: "institutional",
    websiteUrl: "",
    displayOrder: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const response = await fetch("/api/partners");
      if (response.ok) {
        const data = await response.json();
        setPartners(data);
      }
    } catch (error) {
      console.error("Error fetching partners:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingPartner ? "/api/partners" : "/api/partners";
      const method = editingPartner ? "PUT" : "POST";
      const body = editingPartner
        ? { ...formData, id: editingPartner.id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        await fetchPartners();
        setDialogOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error("Error saving partner:", error);
    }
  };

  const handleDelete = async () => {
    if (!deletingPartnerId) return;
    try {
      const response = await fetch(`/api/partners?id=${deletingPartnerId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        await fetchPartners();
        setDeleteDialogOpen(false);
        setDeletingPartnerId(null);
      }
    } catch (error) {
      console.error("Error deleting partner:", error);
    }
  };

  const openEditDialog = (partner: Partner) => {
    setEditingPartner(partner);
    setFormData({
      name: partner.name,
      description: partner.description || "",
      logoUrl: partner.logoUrl,
      type: partner.type,
      websiteUrl: partner.websiteUrl || "",
      displayOrder: partner.displayOrder,
      isActive: partner.isActive,
    });
    setDialogOpen(true);
  };

  const openDeleteDialog = (partnerId: string) => {
    setDeletingPartnerId(partnerId);
    setDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setEditingPartner(null);
    setFormData({
      name: "",
      description: "",
      logoUrl: "",
      type: "institutional",
      websiteUrl: "",
      displayOrder: 0,
      isActive: true,
    });
  };

  const filteredPartners = partners.filter((partner) => {
    if (activeTab === "all") return true;
    return partner.type === activeTab;
  });

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "institutional":
        return "Instituțional";
      case "international":
        return "Internațional";
      case "sponsor":
        return "Sponsor";
      default:
        return type;
    }
  };

  return (
    <>
      <AdminHeader 
        title="Gestionare Parteneri" 
        breadcrumbs={[{ label: "Parteneri" }]} 
      />

      <div className="flex-1 overflow-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Parteneri</h2>
            <p className="text-muted-foreground">
              Gestionează partenerii instituționali, internaționali și sponsorii
            </p>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setDialogOpen(true);
            }}
          >
            <Plus className="mr-2 size-4" />
            Adaugă Partener
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">Toți</TabsTrigger>
            <TabsTrigger value="institutional">Instituționali</TabsTrigger>
            <TabsTrigger value="international">Internaționali</TabsTrigger>
            <TabsTrigger value="sponsor">Sponsori</TabsTrigger>
          </TabsList>
        </Tabs>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Se încarcă...</p>
          </div>
        ) : filteredPartners.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground mb-4">Nu există parteneri înregistrați</p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 size-4" />
              Adaugă primul partener
            </Button>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Logo</TableHead>
                  <TableHead>Nume</TableHead>
                  <TableHead>Tip</TableHead>
                  <TableHead>Website</TableHead>
                  <TableHead>Ordine</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Acțiuni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPartners.map((partner) => (
                  <TableRow key={partner.id}>
                    <TableCell>
                      <img
                        src={partner.logoUrl}
                        alt={partner.name}
                        className="h-10 w-10 rounded object-contain"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{partner.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{getTypeLabel(partner.type)}</Badge>
                    </TableCell>
                    <TableCell>
                      {partner.websiteUrl ? (
                        <a
                          href={partner.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-primary hover:underline"
                        >
                          <ExternalLink className="mr-1 size-3" />
                          Link
                        </a>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>{partner.displayOrder}</TableCell>
                    <TableCell>
                      <Badge variant={partner.isActive ? "default" : "secondary"}>
                        {partner.isActive ? "Activ" : "Inactiv"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(partner)}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(partner.id)}
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
              {editingPartner ? "Editează Partener" : "Adaugă Partener"}
            </DialogTitle>
            <DialogDescription>
              Completează informațiile partenerului
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nume</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Descriere (opțional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Scurtă descriere a partenerului..."
                  rows={3}
                />
              </div>
              <ImageUpload
                currentImageUrl={formData.logoUrl}
                onImageUploaded={(url) => setFormData({ ...formData, logoUrl: url })}
                label="Logo Partener"
                type="partner"
                required
              />
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
                    <SelectItem value="institutional">Instituțional</SelectItem>
                    <SelectItem value="international">Internațional</SelectItem>
                    <SelectItem value="sponsor">Sponsor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="websiteUrl">Website (opțional)</Label>
                <Input
                  id="websiteUrl"
                  value={formData.websiteUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, websiteUrl: e.target.value })
                  }
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
                {editingPartner ? "Salvează" : "Adaugă"}
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
              Ești sigur că vrei să ștergi acest partener? Această acțiune nu poate fi
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
