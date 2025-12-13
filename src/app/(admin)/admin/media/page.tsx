"use client";

import { useState, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  FolderOpen,
  Image as ImageIcon,
  Loader2,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useToast } from "~/hooks/use-toast";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import type { Media } from "~/server/db/schema";

export default function AdminMediaPage() {
  const { toast } = useToast();
  const utils = api.useUtils();

  // State
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [mediaToDelete, setMediaToDelete] = useState<Media | null>(null);

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
    limit: 24,
    search: debouncedSearch || undefined,
    type: "image",
  });

  // Delete mutation
  const deleteMutation = api.media.delete.useMutation({
    onSuccess: () => {
      toast({ title: "Файл удалён" });
      setDeleteDialogOpen(false);
      setMediaToDelete(null);
      if (selectedMedia?.id === mediaToDelete?.id) {
        setSelectedMedia(null);
      }
      utils.media.list.invalidate();
    },
    onError: (error) => {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    },
  });

  // Upload handler
  const handleUpload = async (files: FileList | File[]) => {
    setIsUploading(true);

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("addWatermark", "false"); // No watermark for admin uploads

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

  // Copy URL
  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({ title: "URL скопирован" });
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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Медиабиблиотека</h1>
          <p className="text-muted-foreground mt-1">
            Управление загруженными изображениями
          </p>
        </div>
        <div className="flex items-center gap-2">
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
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Main content */}
        <div className="lg:col-span-3 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={() => {
                  setSearch("");
                  setDebouncedSearch("");
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Drop zone & Grid */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "relative min-h-[400px] rounded-lg border-2 border-dashed transition-colors",
              isDragging
                ? "border-primary bg-primary/5"
                : "border-transparent"
            )}
          >
            {isDragging && (
              <div className="absolute inset-0 flex items-center justify-center bg-primary/10 rounded-lg z-10">
                <div className="text-center">
                  <Upload className="h-12 w-12 mx-auto text-primary mb-2" />
                  <p className="text-lg font-medium">Отпустите для загрузки</p>
                </div>
              </div>
            )}

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : !data?.items.length ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <FolderOpen className="h-12 w-12 mb-4 opacity-50" />
                <p>Нет изображений</p>
                <p className="text-sm mt-1">
                  Перетащите файлы сюда или нажмите &quot;Загрузить&quot;
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {data.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedMedia(item)}
                    className={cn(
                      "group relative aspect-square rounded-lg overflow-hidden border-2 transition-all",
                      "hover:ring-2 hover:ring-primary/50",
                      "focus:outline-none focus:ring-2 focus:ring-primary",
                      selectedMedia?.id === item.id
                        ? "border-primary ring-2 ring-primary"
                        : "border-transparent"
                    )}
                  >
                    <img
                      src={item.url}
                      alt={item.alt ?? item.originalFilename}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-1 text-white text-xs truncate">
                        {item.originalFilename}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Показано {data.items.length} из {data.total}
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
                <span className="text-sm px-2">
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

        {/* Sidebar - Selected media info */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Информация
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedMedia ? (
                <div className="space-y-4">
                  {/* Preview */}
                  <div className="rounded-lg overflow-hidden border bg-muted">
                    <img
                      src={selectedMedia.url}
                      alt={selectedMedia.alt ?? selectedMedia.originalFilename}
                      className="w-full h-40 object-contain"
                    />
                  </div>

                  {/* Info */}
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Имя файла:</span>
                      <p className="font-medium truncate" title={selectedMedia.originalFilename}>
                        {selectedMedia.originalFilename}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Размер:</span>
                      <p className="font-medium">
                        {selectedMedia.width}×{selectedMedia.height} • {formatFileSize(selectedMedia.size)}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Тип:</span>
                      <p className="font-medium">{selectedMedia.mimeType}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Загружено:</span>
                      <p className="font-medium">{formatDate(selectedMedia.createdAt)}</p>
                    </div>
                  </div>

                  {/* URL */}
                  <div className="space-y-2">
                    <span className="text-sm text-muted-foreground">URL:</span>
                    <div className="flex gap-1">
                      <Input
                        value={selectedMedia.url}
                        readOnly
                        className="text-xs h-8"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                        onClick={() => copyToClipboard(selectedMedia.url)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t">
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        setMediaToDelete(selectedMedia);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Удалить
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Выберите изображение для просмотра информации
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить файл?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить &quot;{mediaToDelete?.originalFilename}&quot;?
              Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => mediaToDelete && deleteMutation.mutate({ id: mediaToDelete.id })}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
