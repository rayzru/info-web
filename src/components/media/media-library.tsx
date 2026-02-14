"use client";

import { useCallback, useState } from "react";

import {
  Check,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Loader2,
  Search,
  Tag,
  X,
} from "lucide-react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";
import { cn } from "~/lib/utils";
import type { Media } from "~/server/db/schema";
import { api } from "~/trpc/react";

// ============================================================================
// Types
// ============================================================================

export interface MediaLibraryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (media: Media) => void;
  multiple?: boolean;
  selectedIds?: string[];
}

// ============================================================================
// MediaLibrary Component
// ============================================================================

export function MediaLibrary({
  open,
  onOpenChange,
  onSelect,
  multiple = false,
  selectedIds = [],
}: MediaLibraryProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selected, setSelected] = useState<string[]>(selectedIds);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  // Fetch tags
  const { data: tagsData } = api.media.listTags.useQuery(undefined, {
    enabled: open,
  });

  // Debounce search
  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    // Simple debounce
    const timeout = setTimeout(() => {
      setDebouncedSearch(value);
      setPage(1);
    }, 300);
    return () => clearTimeout(timeout);
  }, []);

  // Fetch media
  const { data, isLoading } = api.media.list.useQuery(
    {
      page,
      limit: 24,
      search: debouncedSearch || undefined,
      tagIds: selectedTagIds.length > 0 ? selectedTagIds : undefined,
      type: "image",
    },
    { enabled: open }
  );

  const toggleTag = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
    setPage(1);
  };

  const handleSelect = (media: Media) => {
    if (multiple) {
      setSelected((prev) =>
        prev.includes(media.id) ? prev.filter((id) => id !== media.id) : [...prev, media.id]
      );
    } else {
      onSelect(media);
      onOpenChange(false);
    }
  };

  const handleConfirm = () => {
    if (multiple && selected.length > 0 && data) {
      const selectedMedia = data.items.find((m) => selected.includes(m.id));
      if (selectedMedia) {
        onSelect(selectedMedia);
      }
    }
    onOpenChange(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[80vh] max-w-4xl flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Медиабиблиотека
          </DialogTitle>
        </DialogHeader>

        {/* Search */}
        <div className="relative">
          <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Поиск по имени файла и тегам..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
          {search && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
              onClick={() => {
                setSearch("");
                setDebouncedSearch("");
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Tags filter */}
        {tagsData && tagsData.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <Tag className="text-muted-foreground h-4 w-4" />
            {tagsData.map((tag) => (
              <Badge
                key={tag.id}
                variant={selectedTagIds.includes(tag.id) ? "default" : "outline"}
                className="cursor-pointer"
                style={
                  selectedTagIds.includes(tag.id) && tag.color
                    ? { backgroundColor: tag.color, borderColor: tag.color }
                    : tag.color
                      ? { borderColor: tag.color, color: tag.color }
                      : undefined
                }
                onClick={() => toggleTag(tag.id)}
              >
                {tag.name}
              </Badge>
            ))}
            {selectedTagIds.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedTagIds([])}
                className="h-6 text-xs"
              >
                Сбросить
              </Button>
            )}
          </div>
        )}

        {/* Grid */}
        <ScrollArea className="flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
            </div>
          ) : !data?.items.length ? (
            <div className="text-muted-foreground flex flex-col items-center justify-center py-12">
              <ImageIcon className="mb-4 h-12 w-12 opacity-50" />
              <p>Нет изображений</p>
              {search && <p className="mt-1 text-sm">Попробуйте изменить поисковый запрос</p>}
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2 p-1 sm:grid-cols-6">
              {data.items.map((item) => {
                const isSelected = selected.includes(item.id);
                const itemTags = item.tags?.map((t) => t.tag) ?? [];
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    className={cn(
                      "group relative aspect-square overflow-hidden rounded-lg border-2 transition-all",
                      "hover:ring-primary/50 hover:ring-2",
                      "focus:ring-primary focus:outline-none focus:ring-2",
                      isSelected ? "border-primary ring-primary ring-2" : "border-transparent"
                    )}
                  >
                    {/* Image */}
                    <img
                      src={item.url}
                      alt={item.alt ?? item.originalFilename}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />

                    {/* Tags (always visible if present) */}
                    {itemTags.length > 0 && (
                      <div className="absolute left-2 top-2 flex flex-wrap gap-1">
                        {itemTags.slice(0, 2).map((tag) => (
                          <Badge
                            key={tag.id}
                            variant="secondary"
                            className="h-4 px-1 py-0 text-[10px]"
                            style={
                              tag.color ? { backgroundColor: tag.color, color: "#fff" } : undefined
                            }
                          >
                            {tag.name}
                          </Badge>
                        ))}
                        {itemTags.length > 2 && (
                          <Badge variant="secondary" className="h-4 px-1 py-0 text-[10px]">
                            +{itemTags.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Overlay on hover */}
                    <div
                      className={cn(
                        "absolute inset-0 bg-black/50 opacity-0 transition-opacity",
                        "group-hover:opacity-100",
                        isSelected && "opacity-100"
                      )}
                    >
                      {/* File info */}
                      <div className="absolute bottom-0 left-0 right-0 p-2 text-xs text-white">
                        <p className="truncate font-medium">{item.originalFilename}</p>
                        <p className="opacity-75">
                          {item.width}×{item.height} • {formatFileSize(item.size)}
                        </p>
                      </div>
                    </div>

                    {/* Selection indicator */}
                    {isSelected && (
                      <div className="bg-primary text-primary-foreground absolute right-2 top-2 rounded-full p-1">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </ScrollArea>

        {/* Footer with pagination */}
        <div className="flex items-center justify-between border-t pt-4">
          <div className="text-muted-foreground text-sm">
            {data ? (
              <>
                Показано {data.items.length} из {data.total}
              </>
            ) : (
              "Загрузка..."
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Pagination */}
            {data && data.totalPages > 1 && (
              <div className="mr-4 flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="px-2 text-sm">
                  {page} / {data.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                  disabled={page === data.totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Actions */}
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            {multiple && (
              <Button onClick={handleConfirm} disabled={selected.length === 0}>
                Выбрать ({selected.length})
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
