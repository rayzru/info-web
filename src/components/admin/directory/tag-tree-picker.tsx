"use client";

import * as React from "react";

import { ChevronRight, ChevronsUpDown, Search, X } from "lucide-react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { ScrollArea } from "~/components/ui/scroll-area";
import { cn } from "~/lib/utils";

export type TagTreeNode = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  scope?: string | null;
  parentId?: string | null;
  entryCount?: number;
  contactCount?: number;
  children?: TagTreeNode[];
};

type TagTreePickerProps = {
  tags: TagTreeNode[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  className?: string;
  disabled?: boolean;
  maxDisplay?: number;
  showCounts?: boolean;
  mode?: "single" | "multiple";
};

const SCOPE_LABELS: Record<string, string> = {
  core: "ЖК",
  commerce: "Арендаторы",
  city: "Город",
  promoted: "Реклама",
};

const SCOPE_COLORS: Record<string, string> = {
  core: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  commerce: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  city: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  promoted: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export function TagTreePicker({
  tags,
  selected,
  onChange,
  placeholder = "Выберите категории...",
  searchPlaceholder = "Поиск категорий...",
  emptyText = "Категории не найдены",
  className,
  disabled = false,
  maxDisplay = 3,
  showCounts = false,
  mode = "multiple",
}: TagTreePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");
  const [expandedIds, setExpandedIds] = React.useState<Set<string>>(new Set());

  // Build tree structure from flat list
  const tagTree = React.useMemo(() => {
    const tagMap = new Map<string, TagTreeNode>();
    const roots: TagTreeNode[] = [];

    // First pass: create all nodes
    for (const tag of tags) {
      tagMap.set(tag.id, { ...tag, children: [] });
    }

    // Second pass: build tree
    for (const tag of tags) {
      const node = tagMap.get(tag.id)!;
      if (tag.parentId && tagMap.has(tag.parentId)) {
        const parent = tagMap.get(tag.parentId)!;
        parent.children = parent.children ?? [];
        parent.children.push(node);
      } else {
        roots.push(node);
      }
    }

    return roots;
  }, [tags]);

  // Group roots by scope
  const groupedRoots = React.useMemo(() => {
    const groups = new Map<string, TagTreeNode[]>();

    for (const root of tagTree) {
      const scope = root.scope ?? "other";
      const existing = groups.get(scope) ?? [];
      groups.set(scope, [...existing, root]);
    }

    return groups;
  }, [tagTree]);

  // Flatten tree for search
  const allTags = React.useMemo(() => {
    const flatten = (nodes: TagTreeNode[]): TagTreeNode[] => {
      const result: TagTreeNode[] = [];
      for (const node of nodes) {
        result.push(node);
        if (node.children && node.children.length > 0) {
          result.push(...flatten(node.children));
        }
      }
      return result;
    };
    return flatten(tagTree);
  }, [tagTree]);

  // Selected tags for display
  const selectedTags = React.useMemo(
    () => allTags.filter((tag) => selected.includes(tag.id)),
    [allTags, selected]
  );

  // Search filter
  const filteredTags = React.useMemo(() => {
    if (!searchValue.trim()) return null;

    const query = searchValue.toLowerCase();
    return allTags.filter(
      (tag) =>
        tag.name.toLowerCase().includes(query) ||
        tag.slug.toLowerCase().includes(query) ||
        tag.description?.toLowerCase().includes(query)
    );
  }, [allTags, searchValue]);

  const toggleTag = (tagId: string) => {
    if (mode === "single") {
      onChange([tagId]);
      setOpen(false);
    } else {
      if (selected.includes(tagId)) {
        onChange(selected.filter((id) => id !== tagId));
      } else {
        onChange([...selected, tagId]);
      }
    }
  };

  const toggleExpanded = (tagId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(tagId)) {
      newExpanded.delete(tagId);
    } else {
      newExpanded.add(tagId);
    }
    setExpandedIds(newExpanded);
  };

  const handleRemove = (tagId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selected.filter((id) => id !== tagId));
  };

  // Expand parents of selected tags on mount
  React.useEffect(() => {
    const parentsToExpand = new Set<string>();

    for (const tagId of selected) {
      const tag = allTags.find((t) => t.id === tagId);
      if (tag?.parentId) {
        // Find all ancestors
        let currentId: string | null | undefined = tag.parentId;
        while (currentId) {
          parentsToExpand.add(currentId);
          const parent = allTags.find((t) => t.id === currentId);
          currentId = parent?.parentId;
        }
      }
    }

    if (parentsToExpand.size > 0) {
      setExpandedIds((prev) => new Set([...prev, ...parentsToExpand]));
    }
  }, [selected, allTags]);

  const renderTagNode = (node: TagTreeNode, depth = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedIds.has(node.id);
    const isSelected = selected.includes(node.id);

    return (
      <div key={node.id}>
        <div
          className={cn(
            "flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 transition-colors",
            "hover:bg-muted",
            isSelected && "bg-primary/10"
          )}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => toggleTag(node.id)}
        >
          {hasChildren ? (
            <button
              type="button"
              className="hover:bg-muted-foreground/20 rounded p-0.5"
              onClick={(e) => toggleExpanded(node.id, e)}
            >
              <ChevronRight
                className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-90")}
              />
            </button>
          ) : (
            <div className="w-5" />
          )}

          <Checkbox
            checked={isSelected}
            onCheckedChange={() => toggleTag(node.id)}
            onClick={(e) => e.stopPropagation()}
          />

          <span className="flex-1 truncate text-sm">{node.name}</span>

          {showCounts && (node.entryCount !== undefined || node.contactCount !== undefined) && (
            <span className="text-muted-foreground text-xs">{node.entryCount ?? 0}</span>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div>{node.children!.map((child) => renderTagNode(child, depth + 1))}</div>
        )}
      </div>
    );
  };

  const renderSearchResult = (tag: TagTreeNode) => {
    const isSelected = selected.includes(tag.id);

    // Find parent chain for breadcrumb
    const breadcrumb: string[] = [];
    let currentId = tag.parentId;
    while (currentId) {
      const parent = allTags.find((t) => t.id === currentId);
      if (parent) {
        breadcrumb.unshift(parent.name);
        currentId = parent.parentId;
      } else {
        break;
      }
    }

    return (
      <div
        key={tag.id}
        className={cn(
          "flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 transition-colors",
          "hover:bg-muted",
          isSelected && "bg-primary/10"
        )}
        onClick={() => toggleTag(tag.id)}
      >
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => toggleTag(tag.id)}
          onClick={(e) => e.stopPropagation()}
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-medium">{tag.name}</span>
            {tag.scope && (
              <span className={cn("rounded px-1.5 py-0.5 text-[10px]", SCOPE_COLORS[tag.scope])}>
                {SCOPE_LABELS[tag.scope]}
              </span>
            )}
          </div>
          {breadcrumb.length > 0 && (
            <span className="text-muted-foreground truncate text-xs">{breadcrumb.join(" → ")}</span>
          )}
        </div>

        {showCounts && tag.entryCount !== undefined && (
          <span className="text-muted-foreground shrink-0 text-xs">{tag.entryCount}</span>
        )}
      </div>
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "h-auto min-h-9 w-full justify-between font-normal",
            !selected.length && "text-muted-foreground",
            className
          )}
        >
          <div className="flex flex-1 flex-wrap gap-1">
            {selectedTags.length === 0 ? (
              <span>{placeholder}</span>
            ) : (
              <>
                {selectedTags.slice(0, maxDisplay).map((tag) => (
                  <Badge key={tag.id} variant="secondary" className="h-5 py-0 pr-1 text-xs">
                    {tag.name}
                    <button
                      type="button"
                      className="hover:bg-secondary-foreground/20 ml-1 rounded-full outline-none"
                      onClick={(e) => handleRemove(tag.id, e)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {selectedTags.length > maxDisplay && (
                  <Badge variant="secondary" className="h-5 py-0 text-xs">
                    +{selectedTags.length - maxDisplay}
                  </Badge>
                )}
              </>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[360px] p-0" align="start">
        <div className="border-b p-2">
          <div className="relative">
            <Search className="text-muted-foreground absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="h-9 pl-8"
            />
          </div>
        </div>

        <ScrollArea className="h-[300px]">
          <div className="p-2">
            {filteredTags ? (
              // Search results (flat list)
              filteredTags.length > 0 ? (
                <div className="space-y-1">
                  {filteredTags.map((tag) => renderSearchResult(tag))}
                </div>
              ) : (
                <div className="text-muted-foreground py-6 text-center text-sm">{emptyText}</div>
              )
            ) : (
              // Tree view grouped by scope
              Array.from(groupedRoots.entries()).map(([scope, roots]) => (
                <div key={scope} className="mb-4">
                  <div className="mb-1 flex items-center gap-2 px-2 py-1.5">
                    <span
                      className={cn(
                        "rounded px-1.5 py-0.5 text-xs font-medium",
                        SCOPE_COLORS[scope] ?? "bg-gray-100 text-gray-700"
                      )}
                    >
                      {SCOPE_LABELS[scope] ?? scope}
                    </span>
                  </div>
                  {roots.map((root) => renderTagNode(root, 0))}
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {selected.length > 0 && (
          <div className="flex items-center justify-between border-t p-2">
            <span className="text-muted-foreground text-xs">Выбрано: {selected.length}</span>
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => onChange([])}>
              Очистить
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
