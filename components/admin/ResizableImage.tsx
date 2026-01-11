"use client";

/* eslint-disable @next/next/no-img-element */
import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewProps } from "@tiptap/react";
import { useState, useRef } from "react";

function ResizableImageComponent({ node, updateAttributes, selected }: NodeViewProps) {
  const src = node.attrs.src as string;
  const alt = node.attrs.alt as string | undefined;
  const attrWidth = node.attrs.width as number | undefined;
  const alignment = (node.attrs.alignment as string) || 'left';
  
  const [displayWidth, setDisplayWidth] = useState<number | null>(
    attrWidth && typeof attrWidth === 'number' ? attrWidth : null
  );
  const imageRef = useRef<HTMLImageElement>(null);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  const alignmentClasses = {
    left: 'mr-auto',
    center: 'mx-auto',
    right: 'ml-auto',
  };

  const handleMouseDown = (e: React.MouseEvent, direction: 'left' | 'right') => {
    e.preventDefault();
    e.stopPropagation();
    
    startXRef.current = e.clientX;
    
    if (imageRef.current) {
      startWidthRef.current = displayWidth || imageRef.current.offsetWidth;
    }

    let latestWidth = startWidthRef.current;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const diff = direction === 'right' 
        ? moveEvent.clientX - startXRef.current
        : startXRef.current - moveEvent.clientX;
      
      const newWidth = Math.max(50, startWidthRef.current + diff);
      latestWidth = newWidth;
      setDisplayWidth(newWidth);
    };

    const handleMouseUp = () => {
      // Save to node attributes on mouse up using the latest width
      updateAttributes({ width: latestWidth });
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const currentWidth = displayWidth || attrWidth;

  return (
    <NodeViewWrapper className="block relative" data-drag-handle>
      <div 
        className={`relative inline-block group ${selected ? 'ring-2 ring-primary ring-offset-2' : ''} ${alignmentClasses[alignment as keyof typeof alignmentClasses]}`}
        style={{ width: currentWidth ? `${currentWidth}px` : 'auto', display: 'block' }}
      >
        <img
          ref={imageRef}
          src={src}
          alt={alt || ''}
          className="max-w-full h-auto rounded-lg block"
          style={{ width: currentWidth ? `${currentWidth}px` : 'auto' }}
          onLoad={() => {
            if (!displayWidth && !attrWidth && imageRef.current) {
              const naturalWidth = imageRef.current.naturalWidth;
              const initialWidth = naturalWidth > 600 ? 600 : naturalWidth;
              setDisplayWidth(initialWidth);
              updateAttributes({ width: initialWidth });
            }
          }}
        />
        
        {/* Resize handles - show when selected */}
        {selected && (
          <>
            {/* Left handle */}
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-8 bg-primary rounded cursor-ew-resize opacity-80 hover:opacity-100 z-10"
              onMouseDown={(e) => handleMouseDown(e, 'left')}
            />
            {/* Right handle */}
            <div
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-8 bg-primary rounded cursor-ew-resize opacity-80 hover:opacity-100 z-10"
              onMouseDown={(e) => handleMouseDown(e, 'right')}
            />
            
            {/* Size indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              {currentWidth ? `${Math.round(currentWidth)}px` : 'auto'}
            </div>
            
            {/* Alignment buttons */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex gap-1 bg-white shadow-lg rounded-lg p-1 border">
              <button
                type="button"
                onClick={() => updateAttributes({ alignment: 'left' })}
                className={`p-1.5 rounded hover:bg-gray-100 ${alignment === 'left' ? 'bg-primary/20 text-primary' : ''}`}
                title="Aliniere stânga"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h16" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => updateAttributes({ alignment: 'center' })}
                className={`p-1.5 rounded hover:bg-gray-100 ${alignment === 'center' ? 'bg-primary/20 text-primary' : ''}`}
                title="Centrare"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 12h10M4 18h16" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => updateAttributes({ alignment: 'right' })}
                className={`p-1.5 rounded hover:bg-gray-100 ${alignment === 'right' ? 'bg-primary/20 text-primary' : ''}`}
                title="Aliniere dreapta"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M10 12h10M4 18h16" />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>
    </NodeViewWrapper>
  );
}

// Custom Image Extension with Resize
export const ResizableImage = Node.create({
  name: 'resizableImage',
  
  group: 'block',
  
  atom: true,
  
  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      width: {
        default: null,
        parseHTML: (element) => {
          // Try to get width from attribute first
          const widthAttr = element.getAttribute('width');
          if (widthAttr) {
            return parseInt(widthAttr, 10);
          }
          // Try to get width from style
          const style = element.getAttribute('style');
          if (style) {
            const match = style.match(/width:\s*(\d+)px/);
            if (match) {
              return parseInt(match[1], 10);
            }
          }
          return null;
        },
        renderHTML: (attributes) => {
          if (!attributes.width) {
            return {};
          }
          return {
            width: attributes.width,
          };
        },
      },
      height: {
        default: null,
      },
      alignment: {
        default: 'left',
        parseHTML: (element) => {
          // Try to get alignment from data attribute
          const dataAlign = element.getAttribute('data-alignment');
          if (dataAlign) {
            return dataAlign;
          }
          // Try to get from style
          const style = element.getAttribute('style') || '';
          if (style.includes('margin-left: auto') && style.includes('margin-right: auto')) {
            return 'center';
          }
          if (style.includes('margin-left: auto')) {
            return 'right';
          }
          return 'left';
        },
        renderHTML: (attributes) => {
          const alignment = attributes.alignment || 'left';
          let marginStyle = '';
          if (alignment === 'center') {
            marginStyle = 'margin-left: auto; margin-right: auto;';
          } else if (alignment === 'right') {
            marginStyle = 'margin-left: auto;';
          }
          return {
            'data-alignment': alignment,
            style: marginStyle,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'img[src]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    // Combine width and alignment styles
    const styles: string[] = [];
    if (HTMLAttributes.width) {
      styles.push(`width: ${HTMLAttributes.width}px`);
    }
    if (HTMLAttributes.style) {
      styles.push(HTMLAttributes.style);
    }
    
    const attrs = { ...HTMLAttributes };
    if (styles.length > 0) {
      attrs.style = styles.join('; ');
    }
    attrs.class = 'max-w-full h-auto rounded-lg block';
    
    return ['img', mergeAttributes(attrs)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageComponent);
  },

  addCommands() {
    return {
      setResizableImage: (options: { src: string; alt?: string; title?: string }) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        });
      },
    };
  },
});

// Type extension for the editor
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    resizableImage: {
      setResizableImage: (options: { src: string; alt?: string; title?: string }) => ReturnType;
    };
  }
}
