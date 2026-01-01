"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import type { JSONContent } from "@tiptap/react";
import {
  ArrowLeft,
  ExternalLink,
  Loader2,
  Save,
  Send,
  Trash2,
  User,
} from "lucide-react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { StandardEditor } from "~/components/editor/rich-editor";
import { TelegramPreviewDialog } from "~/components/admin/telegram-preview-dialog";
import { ImageUploader } from "~/components/media";
import { TagSelector } from "~/components/tag-selector";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";
import type { NewsStatus, NewsType } from "~/server/db/schema";

export default function EditNewsPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();

  const id = params.id as string;

  // Form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [content, setContent] = useState<JSONContent | null>(null);
  const [type, setType] = useState<NewsType>("announcement");
  const [status, setStatus] = useState<NewsStatus>("draft");
  const [publishAt, setPublishAt] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [tagIds, setTagIds] = useState<string[]>([]);

  // Dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [telegramDialogOpen, setTelegramDialogOpen] = useState(false);

  // Query
  const { data: news, isLoading } = api.news.adminById.useQuery({ id });

  // Mutations
  const updateMutation = api.news.update.useMutation({
    onSuccess: () => {
      toast({ title: "Новость сохранена" });
    },
    onError: (error) => {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = api.news.delete.useMutation({
    onSuccess: () => {
      toast({ title: "Новость удалена" });
      router.push("/admin/news");
    },
    onError: (error) => {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    },
  });

  const publishMutation = api.news.publish.useMutation({
    onSuccess: () => {
      toast({ title: "Новость опубликована" });
      setStatus("published");
    },
    onError: (error) => {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    },
  });

  const telegramMutation = api.news.publishToTelegram.useMutation({
    onSuccess: () => {
      toast({ title: "Опубликовано в Telegram" });
      setTelegramDialogOpen(false);
    },
    onError: (error) => {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    },
  });

  // Initialize form with data
  useEffect(() => {
    if (news) {
      setTitle(news.title);
      setSlug(news.slug);
      setExcerpt(news.excerpt ?? "");
      setCoverImage(news.coverImage ?? "");
      setContent(news.content as JSONContent);
      setType(news.type);
      setStatus(news.status);
      setPublishAt(
        news.publishAt
          ? new Date(news.publishAt).toISOString().slice(0, 16)
          : ""
      );
      setIsPinned(news.isPinned);
      setIsHighlighted(news.isHighlighted);
      setIsAnonymous(news.isAnonymous);
      setTagIds(news.tags?.map((t) => t.id) ?? []);
    }
  }, [news]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast({ title: "Введите заголовок", variant: "destructive" });
      return;
    }

    if (!content) {
      toast({ title: "Введите содержание", variant: "destructive" });
      return;
    }

    // Validate status is one of allowed values
    const validStatuses = ["draft", "scheduled", "published", "archived"] as const;
    const validStatus = validStatuses.includes(status as typeof validStatuses[number])
      ? status
      : undefined;

    updateMutation.mutate({
      id,
      title: title.trim(),
      slug: slug.trim() || undefined,
      excerpt: excerpt.trim() || undefined,
      coverImage: coverImage.trim() || null,
      content,
      type,
      status: validStatus,
      publishAt: publishAt ? new Date(publishAt) : null,
      isPinned,
      isHighlighted,
      isAnonymous,
      tagIds,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!news) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Новость не найдена</h2>
        <Link href="/admin/news" className="text-primary hover:underline mt-2 inline-block">
          Вернуться к списку
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/news">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold">Редактирование</h1>
            <p className="text-muted-foreground mt-1 truncate max-w-md">
              {news.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {status === "published" && (
            <Link href={`/news/${slug}`} target="_blank">
              <Button variant="outline" size="sm">
                <ExternalLink className="mr-2 h-4 w-4" />
                На сайте
              </Button>
            </Link>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Удалить
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Основная информация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Заголовок *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Введите заголовок новости"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug (URL)</Label>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Краткое описание</Label>
                  <Textarea
                    id="excerpt"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Краткое описание для карточки новости"
                    rows={2}
                  />
                </div>

                <ImageUploader
                  label="Обложка"
                  value={coverImage || null}
                  onChange={(url) => setCoverImage(url ?? "")}
                  enableCrop
                  aspectRatio={16 / 9}
                  maxWidth={1200}
                  addWatermark={false}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Содержание</CardTitle>
              </CardHeader>
              <CardContent>
                {content && (
                  <StandardEditor
                    content={content}
                    onChange={setContent}
                    placeholder="Введите текст новости..."
                    minHeight="300px"
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Публикация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Статус</Label>
                  <Select value={status} onValueChange={(v) => setStatus(v as NewsStatus)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Черновик</SelectItem>
                      <SelectItem value="scheduled">Запланирована</SelectItem>
                      <SelectItem value="published">Опубликована</SelectItem>
                      <SelectItem value="archived">В архиве</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="publishAt">Дата публикации</Label>
                  <Input
                    id="publishAt"
                    type="datetime-local"
                    value={publishAt}
                    onChange={(e) => setPublishAt(e.target.value)}
                  />
                </div>

                {status === "draft" && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => publishMutation.mutate({ id })}
                    disabled={publishMutation.isPending}
                  >
                    {publishMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Опубликовать сейчас
                  </Button>
                )}

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setTelegramDialogOpen(true)}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Превью Telegram
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Классификация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Тип</Label>
                  <Select value={type} onValueChange={(v) => setType(v as NewsType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="announcement">Объявление</SelectItem>
                      <SelectItem value="event">Мероприятие</SelectItem>
                      <SelectItem value="maintenance">Тех. работы</SelectItem>
                      <SelectItem value="update">Обновление</SelectItem>
                      <SelectItem value="community">Сообщество</SelectItem>
                      <SelectItem value="urgent">Срочное</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Теги</Label>
                  <TagSelector
                    value={tagIds}
                    onChange={setTagIds}
                    placeholder="Выберите теги..."
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="isPinned">Закрепить</Label>
                  <Switch
                    id="isPinned"
                    checked={isPinned}
                    onCheckedChange={setIsPinned}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="isHighlighted">Выделить</Label>
                  <Switch
                    id="isHighlighted"
                    checked={isHighlighted}
                    onCheckedChange={setIsHighlighted}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="isAnonymous">Анонимно</Label>
                    <p className="text-muted-foreground text-xs">
                      От имени ресурса
                    </p>
                  </div>
                  <Switch
                    id="isAnonymous"
                    checked={isAnonymous}
                    onCheckedChange={setIsAnonymous}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Author Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Автор
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={news.author?.image ?? undefined} />
                    <AvatarFallback>
                      {news.author?.name?.slice(0, 2).toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {news.author?.name ?? "Неизвестен"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(news.createdAt).toLocaleDateString("ru-RU", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              type="submit"
              className="w-full"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Сохранить
            </Button>
          </div>
        </div>
      </form>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить новость?</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить &quot;{news.title}&quot;? Это действие
              нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteMutation.mutate({ id })}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Telegram Dialog with Preview */}
      <TelegramPreviewDialog
        open={telegramDialogOpen}
        onOpenChange={setTelegramDialogOpen}
        newsId={id}
        onSend={() => telegramMutation.mutate({ id })}
        isSending={telegramMutation.isPending}
      />
    </div>
  );
}
