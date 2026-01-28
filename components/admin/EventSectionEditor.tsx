"use client";

// Re-export the generic SectionEditor with event-specific defaults
import { SectionEditor, Section, SectionFile } from "./SectionEditor";

export type EventSection = Section;
export type { SectionFile };

interface EventSectionEditorProps {
  sections: EventSection[];
  onChange: (sections: EventSection[]) => void;
}

export function EventSectionEditor({ sections, onChange }: EventSectionEditorProps) {
  return (
    <SectionEditor
      sections={sections}
      onChange={onChange}
      label="Secțiuni Eveniment"
      description="Adaugă secțiuni separate pentru a organiza conținutul (Course description, Programme, etc.)"
      idPrefix="event-section"
    />
  );
}
