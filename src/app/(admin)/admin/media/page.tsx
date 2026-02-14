"use client";

import { useCallback, useState } from "react";

import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  FileText,
  FolderOpen,
  Grid3x3,
  List,
  Loader2,
  Search,
  SortAsc,
  SortDesc,
  Upload,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { AdminPageHeader } from "~/components/admin/admin-page-header";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Toggle } from "~/components/ui/toggle";
import { useToast } from "~/hooks/use-toast";
import { cn } from "~/lib/utils";
import type { Media } from "~/server/db/schema";
import { api } from "~/trpc/react";

type ViewMode = "grid" | "list";
type SortBy = "date" | "name";
type SortOrder = "asc" | "desc";

export default function AdminMediaPage() {
  const router = useRouter();
  const { toast } = useToast();
  const utils = api.useUtils();

  // State
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortBy>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  // Upload state
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Debounce search
  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    const timeout = setTimeout(() => {
      setDebouncedSearch(value);
      setPage(1);
    }, 300);
    return () => clearTimeout(timeout);
  }, []);

  // Fetch media
  const { data, isLoading } = api.media.list.useQuery({
    page,
    limit: viewMode === "grid" ? 24 : 20,
    search: debouncedSearch || undefined,
    type: "image",
  });

  // Sort items client-side
  const sortedItems = data?.items
    ? [...data.items].sort((a, b) => {
        if (sortBy === "date") {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        } else {
          const nameA = a.originalFilename.toLowerCase();
          const nameB = b.originalFilename.toLowerCase();
          if (sortOrder === "asc") {
            return nameA.localeCompare(nameB);
          } else {
            return nameB.localeCompare(nameA);
          }
        }
      })
    : [];

  // Upload handler
  const handleUpload = async (files: FileList | File[]) => {
    setIsUploading(true);

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("addWatermark", "false");
        formData.append("uploadType", "media");

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Upload failed");
        }
      }

      toast({ title: "Файлы загружены" });
      utils.media.list.invalidate();
    } catch (error) {
      toast({
        title: "Ошибка загрузки",
        description: error instanceof Error ? error.message : "Неизвестная ошибка",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files);
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Медиабиблиотека" description="Управление загруженными изображениями">
        <Input
          type="file"
          id="upload-input"
          className="hidden"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          onChange={(e) => {
            if (e.target.files?.length) {
              handleUpload(e.target.files);
            }
            e.target.value = "";
          }}
        />
        <Button
          onClick={() => document.getElementById("upload-input")?.click()}
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Upload className="mr-2 h-4 w-4" />
          )}
          Загрузить
        </Button>
      </AdminPageHeader>

      <div className="space-y-4">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 sm:flex-row">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Поиск по имени файла..."
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

          {/* Sort */}
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortBy)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    По дате
                  </div>
                </SelectItem>
                <SelectItem value="name">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    По имени
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              {sortOrder === "asc" ? (
                <SortAsc className="h-4 w-4" />
              ) : (
                <SortDesc className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* View toggle */}
          <div className="flex gap-1 rounded-md border p-1">
            <Toggle
              pressed={viewMode === "grid"}
              onPressedChange={() => setViewMode("grid")}
              size="sm"
            >
              <Grid3x3 className="h-4 w-4" />
            </Toggle>
            <Toggle
              pressed={viewMode === "list"}
              onPressedChange={() => setViewMode("list")}
              size="sm"
            >
              <List className="h-4 w-4" />
            </Toggle>
          </div>
        </div>

        {/* Drop zone & Content */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "min-h-100 relative rounded-lg border-2 border-dashed transition-colors",
            isDragging ? "border-primary bg-primary/5" : "border-transparent"
          )}
        >
          {isDragging && (
            <div className="bg-primary/10 absolute inset-0 z-10 flex items-center justify-center rounded-lg">
              <div className="text-center">
                <Upload className="text-primary mx-auto mb-2 h-12 w-12" />
                <p className="text-lg font-medium">Отпустите для загрузки</p>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
            </div>
          ) : !sortedItems.length ? (
            <div className="text-muted-foreground flex flex-col items-center justify-center py-12">
              <FolderOpen className="mb-4 h-12 w-12 opacity-50" />
              <p>Нет изображений</p>
              <p className="mt-1 text-sm">
                Перетащите файлы сюда или нажмите &quot;Загрузить&quot;
              </p>
            </div>
          ) : viewMode === "grid" ? (
            // Grid view
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {sortedItems.map((item) => (
                <Card
                  key={item.id}
                  className="hover:ring-primary group cursor-pointer overflow-hidden transition-all hover:ring-2"
                  onClick={() => router.push(`/admin/media/${item.id}`)}
                >
                  <div className="bg-muted relative aspect-square">
                    <img
                      src={item.url}
                      alt={item.alt ?? item.originalFilename}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <CardContent className="p-2">
                    <p className="truncate text-xs font-medium" title={item.originalFilename}>
                      {item.originalFilename}
                    </p>
                    <p className="text-muted-foreground text-xs">{formatFileSize(item.size)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            // List view
            <div className="space-y-2">
              {sortedItems.map((item) => (
                <Card
                  key={item.id}
                  className="hover:bg-accent group cursor-pointer transition-colors"
                  onClick={() => router.push(`/admin/media/${item.id}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {/* Thumbnail */}
                      <div className="bg-muted h-16 w-16 shrink-0 overflow-hidden rounded-md">
                        <img
                          src={item.url}
                          alt={item.alt ?? item.originalFilename}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium" title={item.originalFilename}>
                          {item.originalFilename}
                        </p>
                        <div className="text-muted-foreground mt-1 flex flex-wrap gap-3 text-sm">
                          <span>
                            {item.width}×{item.height}
                          </span>
                          <span>{formatFileSize(item.size)}</span>
                          <span className="hidden sm:inline">{formatDateTime(item.createdAt)}</span>
                        </div>
                      </div>

                      {/* Date (mobile) */}
                      <div className="text-muted-foreground text-sm sm:hidden">
                        {formatDate(item.createdAt)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">
              Показано {sortedItems.length} из {data.total}
            </span>
            <div className="flex items-center gap-1">
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
          </div>
        )}
      </div>
    </div>
  );
}
