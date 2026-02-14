"use client";

import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

import Mention from "@tiptap/extension-mention";
import { ReactRenderer } from "@tiptap/react";
import { Building2, Car, DoorOpen, Home } from "lucide-react";
import tippy, { type Instance } from "tippy.js";

import { cn } from "~/lib/utils";

// ============================================================================
// Structure Mention Extension
// ============================================================================

export interface StructureSuggestion {
  id: string;
  code: string;
  label: string;
  type: "building" | "entrance" | "apartment" | "parking";
}

export interface CreateStructureMentionOptions {
  onSearch: (query: string) => Promise<StructureSuggestion[]>;
}

export function createStructureMention({ onSearch }: CreateStructureMentionOptions) {
  return Mention.extend({
    name: "structureMention",
  }).configure({
    HTMLAttributes: {
      class: "structure-mention",
    },
    renderText({ node }) {
      return node.attrs.code ?? `#${node.attrs.id}`;
    },
    suggestion: {
      char: "#",
      allowSpaces: false,

      items: async ({ query }) => {
        if (!query) return [];
        return onSearch(query);
      },

      render: () => {
        let component: ReactRenderer<StructureListRef> | null = null;
        let popup: Instance[] | null = null;

        return {
          onStart: (props) => {
            component = new ReactRenderer(StructureList, {
              props,
              editor: props.editor,
            });

            if (!props.clientRect) return;

            popup = tippy("body", {
              getReferenceClientRect: props.clientRect as () => DOMRect,
              appendTo: () => document.body,
              content: component.element,
              showOnCreate: true,
              interactive: true,
              trigger: "manual",
              placement: "bottom-start",
            });
          },

          onUpdate: (props) => {
            component?.updateProps(props);

            if (!props.clientRect) return;

            popup?.[0]?.setProps({
              getReferenceClientRect: props.clientRect as () => DOMRect,
            });
          },

          onKeyDown: (props) => {
            if (props.event.key === "Escape") {
              popup?.[0]?.hide();
              return true;
            }

            return component?.ref?.onKeyDown(props) ?? false;
          },

          onExit: () => {
            popup?.[0]?.destroy();
            component?.destroy();
          },
        };
      },
    },
  });
}

// ============================================================================
// Structure Suggestion List Component
// ============================================================================

interface StructureListProps {
  items: StructureSuggestion[];
  command: (item: { id: string; label: string; type: string; code: string }) => void;
}

interface StructureListRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

const StructureList = forwardRef<StructureListRef, StructureListProps>(function StructureList(
  { items, command },
  ref
) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = items[index];
    if (item) {
      command({
        id: item.id,
        label: item.label,
        type: item.type,
        code: item.code,
      });
    }
  };

  const upHandler = () => {
    setSelectedIndex((prev) => (prev + items.length - 1) % items.length);
  };

  const downHandler = () => {
    setSelectedIndex((prev) => (prev + 1) % items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => {
    setSelectedIndex(0);
  }, [items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === "ArrowUp") {
        upHandler();
        return true;
      }

      if (event.key === "ArrowDown") {
        downHandler();
        return true;
      }

      if (event.key === "Enter") {
        enterHandler();
        return true;
      }

      return false;
    },
  }));

  if (items.length === 0) {
    return (
      <div className="bg-popover text-muted-foreground rounded-lg border p-2 text-sm shadow-md">
        Введите код: #b1 (строение), #b1e2 (подъезд), #b1kv123 (квартира), #b1p45 (парковка)
      </div>
    );
  }

  return (
    <div className="bg-popover overflow-hidden rounded-lg border shadow-md">
      {items.map((item, index) => (
        <button
          key={item.id}
          type="button"
          className={cn(
            "flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors",
            index === selectedIndex ? "bg-primary text-primary-foreground" : "hover:bg-muted"
          )}
          onClick={() => selectItem(index)}
        >
          <StructureIcon type={item.type} selected={index === selectedIndex} />
          <span className="flex-1 truncate">{item.label}</span>
          <code
            className={cn(
              "font-mono text-xs",
              index === selectedIndex ? "text-primary-foreground/70" : "text-muted-foreground"
            )}
          >
            {item.code}
          </code>
        </button>
      ))}
    </div>
  );
});

function StructureIcon({ type, selected }: { type: string; selected: boolean }) {
  const className = cn("h-4 w-4", selected ? "text-primary-foreground" : "text-muted-foreground");

  switch (type) {
    case "building":
      return <Building2 className={className} />;
    case "entrance":
      return <DoorOpen className={className} />;
    case "apartment":
      return <Home className={className} />;
    case "parking":
      return <Car className={className} />;
    default:
      return <Building2 className={className} />;
  }
}
