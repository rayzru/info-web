"use client";

import { Node, mergeAttributes } from "@tiptap/core";
import {
  ReactNodeViewRenderer,
  NodeViewWrapper,
  type NodeViewProps,
} from "@tiptap/react";
import { FileText, HelpCircle, User, Building2, Home } from "lucide-react";

import { cn } from "~/lib/utils";
import type { ReferenceCardAttrs } from "~/lib/editor";

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
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "reference-card" }),
    ];
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
          "group relative flex items-center gap-3 rounded-lg border bg-muted/50 p-3 transition-all",
          selected && "ring-2 ring-primary ring-offset-2",
          "hover:border-primary hover:bg-muted"
        )}
        contentEditable={false}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-medium truncate">{title || "Без названия"}</p>
          {description && (
            <p className="text-sm text-muted-foreground truncate">
              {description}
            </p>
          )}
          <p className="text-xs text-muted-foreground/60 mt-0.5">
            {getTypeLabel(type)}
          </p>
        </div>

        {/* Delete button */}
        <button
          type="button"
          onClick={deleteNode}
          className="absolute -right-2 -top-2 hidden h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs group-hover:flex"
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
