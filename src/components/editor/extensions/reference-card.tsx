"use client";

import { mergeAttributes, Node } from "@tiptap/core";
import { type NodeViewProps, NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { Building2, FileText, HelpCircle, Home, User } from "lucide-react";

import type { ReferenceCardAttrs } from "~/lib/editor";
import { cn } from "~/lib/utils";

// ============================================================================
// Reference Card Extension
// ============================================================================

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    referenceCard: {
      setReferenceCard: (attrs: ReferenceCardAttrs) => ReturnType;
    };
  }
}

export const ReferenceCard = Node.create({
  name: "referenceCard",

  group: "block",

  atom: true, // Can't edit inside

  draggable: true,

  addAttributes() {
    return {
      id: {
        default: null,
      },
      type: {
        default: "article",
      },
      title: {
        default: "",
      },
      description: {
        default: null,
      },
      image: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="reference-card"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-type": "reference-card" })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ReferenceCardComponent);
  },

  addCommands() {
    return {
      setReferenceCard:
        (attrs: ReferenceCardAttrs) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs,
          });
        },
    };
  },
});

// ============================================================================
// React Component for Node View
// ============================================================================

function ReferenceCardComponent({ node, selected, deleteNode }: NodeViewProps) {
  const attrs = node.attrs as ReferenceCardAttrs;
  const { type, title, description } = attrs;

  const Icon = getTypeIcon(type);

  return (
    <NodeViewWrapper className="my-2">
      <div
        className={cn(
          "bg-muted/50 group relative flex items-center gap-3 rounded-lg border p-3 transition-all",
          selected && "ring-primary ring-2 ring-offset-2",
          "hover:border-primary hover:bg-muted"
        )}
        contentEditable={false}
      >
        <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
          <Icon className="text-primary h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{title || "Без названия"}</p>
          {description && <p className="text-muted-foreground truncate text-sm">{description}</p>}
          <p className="text-muted-foreground/60 mt-0.5 text-xs">{getTypeLabel(type)}</p>
        </div>

        {/* Delete button */}
        <button
          type="button"
          onClick={deleteNode}
          className="bg-destructive text-destructive-foreground absolute -right-2 -top-2 hidden h-5 w-5 items-center justify-center rounded-full text-xs group-hover:flex"
        >
          ×
        </button>
      </div>
    </NodeViewWrapper>
  );
}

function getTypeIcon(type: string) {
  switch (type) {
    case "article":
      return FileText;
    case "faq":
      return HelpCircle;
    case "contact":
      return User;
    case "building":
      return Building2;
    case "property":
      return Home;
    default:
      return FileText;
  }
}

function getTypeLabel(type: string): string {
  switch (type) {
    case "article":
      return "Статья";
    case "faq":
      return "Вопрос-ответ";
    case "contact":
      return "Контакт";
    case "building":
      return "Здание";
    case "property":
      return "Помещение";
    default:
      return type;
  }
}
