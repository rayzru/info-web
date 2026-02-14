"use client";

import { use, useEffect, useState } from "react";

import { ArrowLeft, Copy, Loader2, Plus, Save, Tag as TagIcon, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";

import { AdminPageHeader } from "~/components/admin/admin-page-header";
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
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { useToast } from "~/hooks/use-toast";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function MediaEditPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const utils = api.useUtils();

  const [alt, setAlt] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tagDialogOpen, setTagDialogOpen] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("#3b82f6");

  // Fetch media
  const { data: media, isLoading } = api.media.byId.useQuery({ id: resolvedParams.id });

  // Update form when media loads
  useEffect(() => {
    if (media) {
      setAlt(media.alt ?? "");
      setTitle(media.title ?? "");
      setDescription(media.description ?? "");
    }
  }, [media]);

  // Update mutation
  const updateMutation = api.media.update.useMutation({
    onSuccess: () => {
      toast({ title: "Изменения сохранены" });
      utils.media.byId.invalidate({ id: resolvedParams.id });
      utils.media.list.invalidate();
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteMutation = api.media.delete.useMutation({
    onSuccess: () => {
      toast({ title: "Файл удалён" });
      router.push("/admin/media");
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    updateMutation.mutate({
      id: resolvedParams.id,
      alt: alt || undefined,
      title: title || undefined,
      description: description || undefined,
    });
  };

  const handleDelete = () => {
    deleteMutation.mutate({ id: resolvedParams.id });
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({ title: "URL скопирован" });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-100 flex items-center justify-center">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!media) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">Медиафайл не найден</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push("/admin/media")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Назад к медиабиблиотеке
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Редактирование медиафайла" description={media.originalFilename}>
        <Button variant="outline" onClick={() => router.push("/admin/media")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Назад
        </Button>
      </AdminPageHeader>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Preview */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="space-y-4 pt-6">
              {/* Image preview */}
              <div className="bg-muted aspect-square overflow-hidden rounded-lg border">
                <img
                  src={media.url}
                  alt={media.alt ?? media.originalFilename}
                  className="h-full w-full object-contain"
                />
              </div>

              {/* Metadata */}
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-muted-foreground mb-1 block">Размеры:</span>
                  <p className="font-medium">
                    {media.width}×{media.height} px
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground mb-1 block">Размер файла:</span>
                  <p className="font-medium">{formatFileSize(media.size)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground mb-1 block">Тип:</span>
                  <p className="font-medium">{media.mimeType}</p>
                </div>
                <div>
                  <span className="text-muted-foreground mb-1 block">Загружено:</span>
                  <p className="font-medium">{formatDate(media.createdAt)}</p>
                </div>
              </div>

              {/* URL */}
              <div className="space-y-2 border-t pt-3">
                <Label className="text-muted-foreground">Публичный URL</Label>
                <div className="flex gap-2">
                  <Input value={media.url} readOnly className="font-mono text-xs" />
                  <Button variant="outline" size="icon" onClick={() => copyToClipboard(media.url)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Edit form */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="space-y-6 pt-6">
              {/* Alt text */}
              <div className="space-y-2">
                <Label htmlFor="alt">
                  Alt-текст
                  <span className="text-muted-foreground ml-2 font-normal">(для доступности)</span>
                </Label>
                <Input
                  id="alt"
                  value={alt}
                  onChange={(e) => setAlt(e.target.value)}
                  placeholder="Описание изображения для скринридеров"
                  maxLength={255}
                />
                <p className="text-muted-foreground text-xs">{alt.length} / 255 символов</p>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">
                  Заголовок
                  <span className="text-muted-foreground ml-2 font-normal">(опционально)</span>
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Заголовок изображения"
                  maxLength={255}
                />
                <p className="text-muted-foreground text-xs">{title.length} / 255 символов</p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">
                  Описание
                  <span className="text-muted-foreground ml-2 font-normal">(опционально)</span>
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Подробное описание изображения"
                  rows={4}
                />
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row">
                <Button
                  onClick={handleSave}
                  disabled={updateMutation.isPending}
                  className="flex-1 sm:flex-none"
                >
                  {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Save className="mr-2 h-4 w-4" />
                  Сохранить
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setDeleteDialogOpen(true)}
                  className="flex-1 sm:ml-auto sm:flex-none"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Удалить файл
                </Button>
              </div>
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
              Вы уверены, что хотите удалить &quot;{media.originalFilename}&quot;? Файл будет удалён
              из S3 хранилища. Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
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
