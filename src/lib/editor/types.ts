import type { JSONContent } from "@tiptap/react";

// ============================================================================
// Editor Modes
// ============================================================================

/**
 * Editor mode determines available features
 * - minimal: Bold, italic, links only (comments, quick messages)
 * - standard: + headings, lists, images (news, articles)
 * - full: + embeds, mentions, reference cards, tables (help center, wiki)
 */
export type EditorMode = "minimal" | "standard" | "full";

// ============================================================================
// AST Node Types
// ============================================================================

// Base mark types
export type MarkType =
  | "bold"
  | "italic"
  | "underline"
  | "strike"
  | "code"
  | "link"
  | "highlight"
  | "textStyle";

// Base node types
export type NodeType =
  // Document
  | "doc"
  // Block nodes
  | "paragraph"
  | "heading"
  | "bulletList"
  | "orderedList"
  | "listItem"
  | "blockquote"
  | "codeBlock"
  | "horizontalRule"
  | "hardBreak"
  // Inline nodes
  | "text"
  | "image"
  // Custom nodes
  | "mention"
  | "referenceCard"
  | "youtube"
  | "embed";

// ============================================================================
// Custom Node Attributes
// ============================================================================

export interface MentionAttrs {
  id: string;
  label: string;
  type: "user" | "role" | "team";
}

export interface ReferenceCardAttrs {
  id: string;
  type: "article" | "faq" | "contact" | "property" | "building";
  title: string;
  description?: string;
  image?: string;
}

export interface ImageAttrs {
  src: string;
  alt?: string;
  title?: string;
  width?: number;
  height?: number;
}

export interface LinkAttrs {
  href: string;
  target?: string;
  rel?: string;
  class?: string;
}

export interface YoutubeAttrs {
  src: string;
  width?: number;
  height?: number;
  start?: number;
}

export interface HeadingAttrs {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  textAlign?: "left" | "center" | "right" | "justify";
}

export interface TextStyleAttrs {
  color?: string;
}

export interface HighlightAttrs {
  color?: string;
}

// ============================================================================
// Rich Content Document
// ============================================================================

/**
 * Type-safe wrapper for TipTap JSON content
 */
export interface RichContentDocument {
  type: "doc";
  content?: RichContentNode[];
}

export interface RichContentNode {
  type: NodeType;
  attrs?: Record<string, unknown>;
  content?: RichContentNode[];
  marks?: RichContentMark[];
  text?: string;
}

export interface RichContentMark {
  type: MarkType;
  attrs?: Record<string, unknown>;
}

// ============================================================================
// Editor Props
// ============================================================================

export interface RichEditorProps {
  /** Editor mode - determines available features */
  mode?: EditorMode;
  /** Initial content as TipTap JSON */
  content?: JSONContent;
  /** Placeholder text */
  placeholder?: string;
  /** Called on content change */
  onChange?: (content: JSONContent) => void;
  /** Called on blur */
  onBlur?: (content: JSONContent) => void;
  /** Whether editor is editable */
  editable?: boolean;
  /** Auto focus on mount */
  autoFocus?: boolean;
  /** Additional class name */
  className?: string;
  /** Minimum height */
  minHeight?: string;
  /** Maximum height (enables scroll) */
  maxHeight?: string;
}

export interface RichRendererProps {
  /** Content to render as TipTap JSON */
  content: JSONContent;
  /** Additional class name */
  className?: string;
}

// ============================================================================
// Extension Configuration
// ============================================================================

export interface ExtensionConfig {
  mode: EditorMode;
  mentions?: {
    enabled: boolean;
    onSearch?: (query: string) => Promise<MentionAttrs[]>;
  };
  references?: {
    enabled: boolean;
    onSearch?: (query: string, type?: string) => Promise<ReferenceCardAttrs[]>;
  };
  images?: {
    enabled: boolean;
    onUpload?: (file: File) => Promise<string>;
  };
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Check if content is empty
 */
export function isEmptyContent(content: JSONContent | null | undefined): boolean {
  if (!content) return true;
  if (!content.content || content.content.length === 0) return true;

  // Check if only empty paragraphs
  return content.content.every(
    (node) =>
      node.type === "paragraph" &&
      (!node.content || node.content.length === 0)
  );
}

/**
 * Extract plain text from content (for search indexing)
 */
export function extractPlainText(content: JSONContent): string {
  const parts: string[] = [];

  function traverse(node: JSONContent) {
    if (node.text) {
      parts.push(node.text);
    }
    if (node.content) {
      for (const child of node.content) {
        traverse(child);
      }
    }
  }

  traverse(content);
  return parts.join(" ").trim();
}

/**
 * Extract mentions from content
 */
export function extractMentions(content: JSONContent): MentionAttrs[] {
  const mentions: MentionAttrs[] = [];

  function traverse(node: JSONContent) {
    if (node.type === "mention" && node.attrs) {
      mentions.push(node.attrs as MentionAttrs);
    }
    if (node.content) {
      for (const child of node.content) {
        traverse(child);
      }
    }
  }

  traverse(content);
  return mentions;
}

/**
 * Extract reference cards from content
 */
export function extractReferences(content: JSONContent): ReferenceCardAttrs[] {
  const references: ReferenceCardAttrs[] = [];

  function traverse(node: JSONContent) {
    if (node.type === "referenceCard" && node.attrs) {
      references.push(node.attrs as ReferenceCardAttrs);
    }
    if (node.content) {
      for (const child of node.content) {
        traverse(child);
      }
    }
  }

  traverse(content);
  return references;
}

/**
 * Create empty document
 */
export function createEmptyDocument(): RichContentDocument {
  return {
    type: "doc",
    content: [
      {
        type: "paragraph",
      },
    ],
  };
}
