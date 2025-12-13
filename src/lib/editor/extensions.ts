import { Extension, type Extensions } from "@tiptap/core";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import Youtube from "@tiptap/extension-youtube";
import StarterKit from "@tiptap/starter-kit";

import type { EditorMode, ExtensionConfig } from "./types";

// ============================================================================
// Extension Sets by Mode
// ============================================================================

/**
 * Get minimal extensions for simple text formatting
 * Bold, italic, underline, links only
 */
function getMinimalExtensions(placeholder?: string): Extensions {
  return [
    StarterKit.configure({
      // Disable block-level nodes
      heading: false,
      bulletList: false,
      orderedList: false,
      listItem: false,
      blockquote: false,
      codeBlock: false,
      horizontalRule: false,
      // Keep inline formatting
      bold: {},
      italic: {},
      strike: {},
      code: {},
    }),
    Underline,
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: "text-primary underline underline-offset-2",
      },
    }),
    Placeholder.configure({
      placeholder: placeholder ?? "Введите текст...",
    }),
  ];
}

/**
 * Get standard extensions for articles/news
 * + headings, lists, images, blockquotes
 */
function getStandardExtensions(placeholder?: string): Extensions {
  return [
    StarterKit.configure({
      heading: {
        levels: [2, 3, 4],
      },
      bulletList: {},
      orderedList: {},
      listItem: {},
      blockquote: {},
      codeBlock: {},
      horizontalRule: {},
      bold: {},
      italic: {},
      strike: {},
      code: {},
    }),
    Underline,
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: "text-primary underline underline-offset-2",
      },
    }),
    Image.configure({
      inline: false,
      allowBase64: false,
      HTMLAttributes: {
        class: "rounded-lg max-w-full",
      },
    }),
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
    Highlight.configure({
      multicolor: true,
    }),
    TextStyle,
    Placeholder.configure({
      placeholder: placeholder ?? "Начните писать...",
    }),
  ];
}

/**
 * Get full extensions for help center/wiki
 * + embeds, mentions, reference cards, tables
 */
function getFullExtensions(
  placeholder?: string,
  _config?: ExtensionConfig
): Extensions {
  return [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3, 4],
      },
      bulletList: {},
      orderedList: {},
      listItem: {},
      blockquote: {},
      codeBlock: {},
      horizontalRule: {},
      bold: {},
      italic: {},
      strike: {},
      code: {},
    }),
    Underline,
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: "text-primary underline underline-offset-2",
      },
    }),
    Image.configure({
      inline: false,
      allowBase64: false,
      HTMLAttributes: {
        class: "rounded-lg max-w-full",
      },
    }),
    Youtube.configure({
      width: 640,
      height: 360,
      HTMLAttributes: {
        class: "rounded-lg overflow-hidden",
      },
    }),
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
    Highlight.configure({
      multicolor: true,
    }),
    TextStyle,
    Placeholder.configure({
      placeholder: placeholder ?? "Начните создавать контент...",
    }),
    // Custom extensions will be added here:
    // Mention, ReferenceCard
  ];
}

// ============================================================================
// Extension Factory
// ============================================================================

/**
 * Get extensions based on editor mode
 */
export function getExtensions(
  mode: EditorMode,
  placeholder?: string,
  config?: ExtensionConfig
): Extensions {
  switch (mode) {
    case "minimal":
      return getMinimalExtensions(placeholder);
    case "standard":
      return getStandardExtensions(placeholder);
    case "full":
      return getFullExtensions(placeholder, config);
    default:
      return getMinimalExtensions(placeholder);
  }
}

// ============================================================================
// Keyboard Shortcuts Extension
// ============================================================================

export const KeyboardShortcuts = Extension.create({
  name: "keyboardShortcuts",

  addKeyboardShortcuts() {
    return {
      // Mod = Cmd on Mac, Ctrl on Windows
      "Mod-Enter": () => {
        // Submit handler - can be customized
        return true;
      },
    };
  },
});

// ============================================================================
// Feature Availability by Mode
// ============================================================================

export const FEATURES_BY_MODE: Record<EditorMode, string[]> = {
  minimal: ["bold", "italic", "underline", "strike", "link"],
  standard: [
    "bold",
    "italic",
    "underline",
    "strike",
    "link",
    "heading",
    "bulletList",
    "orderedList",
    "blockquote",
    "codeBlock",
    "image",
    "textAlign",
    "highlight",
  ],
  full: [
    "bold",
    "italic",
    "underline",
    "strike",
    "link",
    "heading",
    "bulletList",
    "orderedList",
    "blockquote",
    "codeBlock",
    "image",
    "youtube",
    "textAlign",
    "highlight",
    "mention",
    "referenceCard",
  ],
};

/**
 * Check if a feature is available in the given mode
 */
export function isFeatureAvailable(
  feature: string,
  mode: EditorMode
): boolean {
  return FEATURES_BY_MODE[mode].includes(feature);
}
