"use client";

import { useEffect, useState } from "react";

import type { JSONContent } from "@tiptap/react";
import { ArrowLeft, ExternalLink, Loader2, Save, Send, Sparkles, Trash2, User } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { TelegramPreviewDialog } from "~/components/admin/telegram-preview-dialog";
import { StandardEditor } from "~/components/editor/rich-editor";
import { ImageUploader } from "~/components/media";
import { TagSelector } from "~/components/tag-selector";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";
import { useToast } from "~/hooks/use-toast";
import { NEWS_TYPE_LABELS, NEWS_TYPES } from "~/lib/constants/news-types";
import type { NewsStatus, NewsType } from "~/server/db/schema";
import { api } from "~/trpc/react";

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

  const generateSlugMutation = api.news.generateSlug.useMutation({
    onSuccess: (data) => {
      setSlug(data.slug);
      toast({ title: "Slug сгенерирован", description: data.slug });
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
      setContent(news.content);
      setType(news.type);
      setStatus(news.status);
      setPublishAt(news.publishAt ? new Date(news.publishAt).toISOString().slice(0, 16) : "");
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
    const validStatus = validStatuses.includes(status) ? status : undefined;

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
      <div className="py-12 text-center">
        <h2 className="text-xl font-semibold">Новость не найдена</h2>
        <Link href="/admin/news" className="text-primary mt-2 inline-block hover:underline">
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
            <p className="text-muted-foreground mt-1 max-w-md truncate">{news.title}</p>
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
          <Button variant="outline" size="sm" onClick={() => setDeleteDialogOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Удалить
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
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
                  <div className="flex gap-2">
                    <Input
                      id="slug"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="Автоматически из заголовка"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        generateSlugMutation.mutate({ title: title || "", excludeId: id })
                      }
                      disabled={generateSlugMutation.isPending}
                      title="Сгенерировать slug из заголовка"
                    >
                      {generateSlugMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Нажмите ✨ для автогенерации из заголовка (транслитерация в [a-z0-9-])
                  </p>
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
                    {publishMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
                      {Object.values(NEWS_TYPES).map((newsType) => (
                        <SelectItem key={newsType} value={newsType}>
                          {NEWS_TYPE_LABELS[newsType]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Теги</Label>
                  <TagSelector value={tagIds} onChange={setTagIds} placeholder="Выберите теги..." />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="isPinned">Закрепить</Label>
                  <Switch id="isPinned" checked={isPinned} onCheckedChange={setIsPinned} />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="isHighlighted">Выделить</Label>
                  <Switch
                    id="isHighlighted"
                    checked={isHighlighted}
                    onCheckedChange={setIsHighlighted}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Author Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <User className="h-4 w-4" />
                  Автор
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={news.author?.image ?? undefined} />
                    <AvatarFallback>
                      {news.author?.name?.slice(0, 2).toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {news.author?.name ?? "Неизвестен"}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {new Date(news.createdAt).toLocaleDateString("ru-RU", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t pt-2">
                  <div>
                    <Label htmlFor="isAnonymous" className="cursor-pointer">
                      Анонимно
                    </Label>
                    <p className="text-muted-foreground text-xs">От имени ресурса</p>
                  </div>
                  <Switch id="isAnonymous" checked={isAnonymous} onCheckedChange={setIsAnonymous} />
                </div>
              </CardContent>
            </Card>

            <Button type="submit" className="w-full" disabled={updateMutation.isPending}>
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
              Вы уверены, что хотите удалить &quot;{news.title}&quot;? Это действие нельзя отменить.
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
