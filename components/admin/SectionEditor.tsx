"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RichTextEditor } from "./RichTextEditor";
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  ChevronUp, 
  ChevronDown,
  FileText,
  X
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface SectionFile {
  id?: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
}

export interface Section {
  id?: string;
  title?: string;
  titleEn?: string;
  content?: string;
  contentEn?: string;
  backgroundColor?: string;
  displayOrder: number;
  files?: SectionFile[];
}

interface SectionEditorProps {
  sections: Section[];
  onChange: (sections: Section[]) => void;
  label?: string;
  description?: string;
  idPrefix?: string;
}

const backgroundOptions = [
  { value: "white", label: "Alb", preview: "bg-white" },
  { value: "muted", label: "Gri deschis", preview: "bg-muted" },
  { value: "primary", label: "Albastru (Primary)", preview: "bg-primary/10" },
  { value: "yellow", label: "Galben", preview: "bg-yellow-50" },
  { value: "green", label: "Verde", preview: "bg-green-50" },
  { value: "blue", label: "Albastru deschis", preview: "bg-blue-50" },
  { value: "purple", label: "Mov", preview: "bg-purple-50" },
  { value: "orange", label: "Portocaliu", preview: "bg-orange-50" },
];

export function SectionEditor({ 
  sections, 
  onChange, 
  label = "Secțiuni", 
  description = "Adaugă secțiuni separate pentru a organiza conținutul",
  idPrefix = "section"
}: SectionEditorProps) {
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]));
  const [uploadingSection, setUploadingSection] = useState<number | null>(null);

  const addSection = () => {
    const newSection: Section = {
      title: "",
      titleEn: "",
      content: "",
      contentEn: "",
      backgroundColor: "white",
      displayOrder: sections.length,
      files: [],
    };
    const newSections = [...sections, newSection];
    onChange(newSections);
    setExpandedSections(prev => new Set([...prev, newSections.length - 1]));
  };

  const removeSection = (index: number) => {
    const newSections = sections.filter((_, i) => i !== index);
    // Update displayOrder for remaining sections
    newSections.forEach((section, i) => {
      section.displayOrder = i;
    });
    onChange(newSections);
    setExpandedSections(prev => {
      const newSet = new Set<number>();
      prev.forEach(i => {
        if (i < index) newSet.add(i);
        else if (i > index) newSet.add(i - 1);
      });
      return newSet;
    });
  };

  const updateSection = (index: number, updates: Partial<Section>) => {
    const newSections = sections.map((section, i) => 
      i === index ? { ...section, ...updates } : section
    );
    onChange(newSections);
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === sections.length - 1)
    ) {
      return;
    }

    const newIndex = direction === "up" ? index - 1 : index + 1;
    const newSections = [...sections];
    [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]];
    
    // Update displayOrder
    newSections.forEach((section, i) => {
      section.displayOrder = i;
    });
    
    onChange(newSections);

    // Update expanded sections
    setExpandedSections(prev => {
      const newSet = new Set<number>();
      prev.forEach(i => {
        if (i === index) newSet.add(newIndex);
        else if (i === newIndex) newSet.add(index);
        else newSet.add(i);
      });
      return newSet;
    });
  };

  const toggleExpanded = (index: number) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleFileUpload = async (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploadingSection(index);

    try {
      const uploadedFiles: SectionFile[] = [];

      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", "document");

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }

        const data = await response.json();
        uploadedFiles.push({
          fileName: file.name,
          fileUrl: data.url,
          fileSize: file.size,
          mimeType: file.type,
        });
      }

      const section = sections[index];
      const currentFiles = section.files || [];
      updateSection(index, { files: [...currentFiles, ...uploadedFiles] });
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Eroare la încărcarea fișierelor");
    } finally {
      setUploadingSection(null);
      // Reset the input
      event.target.value = "";
    }
  };

  const removeFile = (sectionIndex: number, fileIndex: number) => {
    const section = sections[sectionIndex];
    const newFiles = (section.files || []).filter((_, i) => i !== fileIndex);
    updateSection(sectionIndex, { files: newFiles });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const getBackgroundPreview = (value: string) => {
    const option = backgroundOptions.find(o => o.value === value);
    return option?.preview || "bg-white";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-base font-semibold">{label}</Label>
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        </div>
        <Button type="button" onClick={addSection} variant="outline" size="sm">
          <Plus className="size-4 mr-2" />
          Adaugă Secțiune
        </Button>
      </div>

      {sections.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <p>Nu există secțiuni. Apasă butonul de mai sus pentru a adăuga una.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {sections.map((section, index) => {
            const isExpanded = expandedSections.has(index);
            
            return (
              <Card 
                key={section.id || index} 
                className={`border ${getBackgroundPreview(section.backgroundColor || "white")}`}
              >
                <CardHeader className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <GripVertical className="size-4 text-muted-foreground cursor-grab" />
                    
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => moveSection(index, "up")}
                        disabled={index === 0}
                        className="h-7 w-7 p-0"
                      >
                        <ChevronUp className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => moveSection(index, "down")}
                        disabled={index === sections.length - 1}
                        className="h-7 w-7 p-0"
                      >
                        <ChevronDown className="size-4" />
                      </Button>
                    </div>

                    <CardTitle 
                      className="flex-1 text-sm font-medium cursor-pointer"
                      onClick={() => toggleExpanded(index)}
                    >
                      {section.title || `Secțiune ${index + 1}`}
                    </CardTitle>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpanded(index)}
                      className="h-7 w-7 p-0"
                    >
                      {isExpanded ? (
                        <ChevronUp className="size-4" />
                      ) : (
                        <ChevronDown className="size-4" />
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSection(index)}
                      className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </CardHeader>

                {isExpanded && (
                  <CardContent className="pt-0 space-y-4">
                    {/* Section Title with Language Tabs */}
                    <Tabs defaultValue="title-ro" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 mb-2">
                        <TabsTrigger value="title-ro" className="flex items-center gap-2">
                          <span>🇷🇴</span> Titlu RO
                        </TabsTrigger>
                        <TabsTrigger value="title-en" className="flex items-center gap-2">
                          <span>🇬🇧</span> Title EN
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="title-ro">
                        <div className="grid gap-2">
                          <Label htmlFor={`${idPrefix}-title-${index}`}>Titlu Secțiune</Label>
                          <Input
                            id={`${idPrefix}-title-${index}`}
                            value={section.title || ""}
                            onChange={(e) => updateSection(index, { title: e.target.value })}
                            placeholder="Ex: Descriere, Obiective, Echipă..."
                          />
                          <p className="text-xs text-muted-foreground">
                            Titlul va fi afișat cu formatare consistentă pe site
                          </p>
                        </div>
                      </TabsContent>

                      <TabsContent value="title-en">
                        <div className="grid gap-2">
                          <Label htmlFor={`${idPrefix}-title-en-${index}`}>Section Title (English)</Label>
                          <Input
                            id={`${idPrefix}-title-en-${index}`}
                            value={section.titleEn || ""}
                            onChange={(e) => updateSection(index, { titleEn: e.target.value })}
                            placeholder="Ex: Description, Objectives, Team..."
                          />
                          <p className="text-xs text-muted-foreground">
                            English version of the section title
                          </p>
                        </div>
                      </TabsContent>
                    </Tabs>

                    {/* Background Color */}
                    <div className="grid gap-2">
                      <Label htmlFor={`${idPrefix}-bg-${index}`}>Culoare Fundal</Label>
                      <Select
                        value={section.backgroundColor || "white"}
                        onValueChange={(value) => updateSection(index, { backgroundColor: value })}
                      >
                        <SelectTrigger id={`${idPrefix}-bg-${index}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {backgroundOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center gap-2">
                                <div className={`w-4 h-4 rounded border ${option.preview}`} />
                                {option.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Content Editor with Language Tabs */}
                    <Tabs defaultValue="content-ro" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 mb-2">
                        <TabsTrigger value="content-ro" className="flex items-center gap-2">
                          <span>🇷🇴</span> Conținut RO
                        </TabsTrigger>
                        <TabsTrigger value="content-en" className="flex items-center gap-2">
                          <span>🇬🇧</span> Content EN
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="content-ro">
                        <div className="grid gap-2">
                          <Label>Conținut</Label>
                          <RichTextEditor
                            content={section.content || ""}
                            onChange={(html) => updateSection(index, { content: html })}
                            placeholder="Scrie conținutul secțiunii..."
                          />
                        </div>
                      </TabsContent>

                      <TabsContent value="content-en">
                        <div className="grid gap-2">
                          <Label>Content (English)</Label>
                          <RichTextEditor
                            content={section.contentEn || ""}
                            onChange={(html) => updateSection(index, { contentEn: html })}
                            placeholder="Write the section content in English..."
                          />
                        </div>
                      </TabsContent>
                    </Tabs>

                    {/* Files */}
                    <div className="grid gap-2">
                      <Label>Fișiere Atașate (PDF, documente)</Label>
                      
                      {/* File List */}
                      {section.files && section.files.length > 0 && (
                        <div className="space-y-2">
                          {section.files.map((file, fileIndex) => (
                            <div 
                              key={file.id || fileIndex}
                              className="flex items-center gap-2 p-2 rounded-md bg-muted/50 border"
                            >
                              <FileText className="size-4 text-muted-foreground shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{file.fileName}</p>
                                <p className="text-xs text-muted-foreground">
                                  {formatFileSize(file.fileSize)}
                                </p>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(index, fileIndex)}
                                className="h-7 w-7 p-0 text-destructive hover:text-destructive shrink-0"
                              >
                                <X className="size-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Upload Button */}
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          id={`${idPrefix}-files-${index}`}
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                          multiple
                          onChange={(e) => handleFileUpload(index, e)}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById(`${idPrefix}-files-${index}`)?.click()}
                          disabled={uploadingSection === index}
                        >
                          <FileText className="size-4 mr-2" />
                          {uploadingSection === index ? "Se încarcă..." : "Adaugă Fișier"}
                        </Button>
                        <span className="text-xs text-muted-foreground">
                          PDF, Word, Excel, PowerPoint
                        </span>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

