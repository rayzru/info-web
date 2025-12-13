"use client";

import { useEffect } from "react";
import { EditorContent, useEditor, type JSONContent } from "@tiptap/react";

import { cn } from "~/lib/utils";
import { getExtensions, type EditorMode, type RichEditorProps } from "~/lib/editor";
import { Toolbar } from "./toolbar";

import "./editor.css";

export function RichEditor({
  mode = "minimal",
  content,
  placeholder,
  onChange,
  onBlur,
  editable = true,
  autoFocus = false,
  className,
  minHeight = "120px",
  maxHeight,
}: RichEditorProps) {
  const extensions = getExtensions(mode, placeholder);

  const editor = useEditor({
    extensions,
    content,
    editable,
    autofocus: autoFocus,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getJSON());
    },
    onBlur: ({ editor }) => {
      onBlur?.(editor.getJSON());
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm dark:prose-invert max-w-none",
          "focus:outline-none",
          "px-4 py-3"
        ),
        style: `min-height: ${minHeight}; ${maxHeight ? `max-height: ${maxHeight}; overflow-y: auto;` : ""}`,
      },
    },
    // Ensure SSR compatibility
    immediatelyRender: false,
  });

  // Update content when prop changes
  useEffect(() => {
    if (editor && content && !editor.isDestroyed) {
      const currentContent = editor.getJSON();
      // Only update if content is different
      if (JSON.stringify(currentContent) !== JSON.stringify(content)) {
        editor.commands.setContent(content);
      }
    }
  }, [editor, content]);

  // Update editable state
  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      editor.setEditable(editable);
    }
  }, [editor, editable]);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border bg-background",
        !editable && "opacity-60",
        className
      )}
    >
      {editable && <Toolbar editor={editor} mode={mode} />}
      <EditorContent editor={editor} />
    </div>
  );
}

// ============================================================================
// Preset Components
// ============================================================================

interface PresetEditorProps extends Omit<RichEditorProps, "mode"> {}

/**
 * Minimal editor for comments, quick messages
 * Only bold, italic, underline, links
 */
export function MinimalEditor(props: PresetEditorProps) {
  return <RichEditor {...props} mode="minimal" />;
}

/**
 * Standard editor for news, articles
 * + headings, lists, images, blockquotes
 */
export function StandardEditor(props: PresetEditorProps) {
  return <RichEditor {...props} mode="standard" />;
}

/**
 * Full editor for help center, wiki
 * + embeds, mentions, reference cards
 */
export function FullEditor(props: PresetEditorProps) {
  return <RichEditor {...props} mode="full" />;
}

// ============================================================================
// Hook for external control
// ============================================================================

export { useEditor } from "@tiptap/react";
export type { JSONContent };
