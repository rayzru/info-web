"use client";

import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

import Mention from "@tiptap/extension-mention";
import { ReactRenderer } from "@tiptap/react";
import tippy, { type Instance } from "tippy.js";

import type { MentionAttrs } from "~/lib/editor";
import { cn } from "~/lib/utils";

// ============================================================================
// Mention Extension with Suggestions
// ============================================================================

export interface MentionSuggestion {
  id: string;
  label: string;
  type: "user" | "role" | "team";
  image?: string;
}

export interface CreateMentionOptions {
  onSearch: (query: string) => Promise<MentionSuggestion[]>;
}

export function createMention({ onSearch }: CreateMentionOptions) {
  return Mention.configure({
    HTMLAttributes: {
      class: "mention",
    },
    renderText({ node }) {
      return `@${node.attrs.label ?? node.attrs.id}`;
    },
    suggestion: {
      char: "@",
      allowSpaces: false,

      items: async ({ query }) => {
        if (!query) return [];
        return onSearch(query);
      },

      render: () => {
        let component: ReactRenderer<MentionListRef> | null = null;
        let popup: Instance[] | null = null;

        return {
          onStart: (props) => {
            component = new ReactRenderer(MentionList, {
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
// Mention Suggestion List Component
// ============================================================================

interface MentionListProps {
  items: MentionSuggestion[];
  command: (item: MentionAttrs) => void;
}

interface MentionListRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

const MentionList = forwardRef<MentionListRef, MentionListProps>(function MentionList(
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
        Ничего не найдено
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
          {item.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.image} alt="" className="h-6 w-6 rounded-full" />
          ) : (
            <div className="bg-muted flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium">
              {item.label.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="flex-1 truncate">{item.label}</span>
          <span
            className={cn(
              "text-xs",
              index === selectedIndex ? "text-primary-foreground/70" : "text-muted-foreground"
            )}
          >
            {getTypeLabel(item.type)}
          </span>
        </button>
      ))}
    </div>
  );
});

function getTypeLabel(type: string): string {
  switch (type) {
    case "user":
      return "Пользователь";
    case "role":
      return "Роль";
    case "team":
      return "Команда";
    default:
      return type;
  }
}
