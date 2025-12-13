"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { JSONContent } from "@tiptap/react";
import { ArrowLeft, Loader2, Save } from "lucide-react";

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
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { StandardEditor } from "~/components/editor/rich-editor";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";
import type { NewsStatus, NewsType } from "~/server/db/schema";

const INITIAL_CONTENT: JSONContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [],
    },
  ],
};

export default function NewNewsPage() {
  const router = useRouter();
  const { toast } = useToast();

  // Form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [content, setContent] = useState<JSONContent>(INITIAL_CONTENT);
  const [type, setType] = useState<NewsType>("announcement");
  const [status, setStatus] = useState<NewsStatus>("draft");
  const [publishAt, setPublishAt] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);

  // Mutation
  const createMutation = api.news.create.useMutation({
    onSuccess: (data) => {
      toast({ title: "Новость создана" });
      router.push(`/admin/news/${data?.id}`);
    },
    onError: (error) => {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast({ title: "Введите заголовок", variant: "destructive" });
      return;
    }

    createMutation.mutate({
      title: title.trim(),
      slug: slug.trim() || undefined,
      excerpt: excerpt.trim() || undefined,
      coverImage: coverImage.trim() || undefined,
      content,
      type,
      status,
      publishAt: publishAt ? new Date(publishAt) : undefined,
      isPinned,
      isHighlighted,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/news">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold">Создать новость</h1>
          <p className="text-muted-foreground mt-1">
            Заполните информацию о новости
          </p>
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
                    placeholder="Автоматически из заголовка и даты"
                  />
                  <p className="text-xs text-muted-foreground">
                    Оставьте пустым для автогенерации
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

                <div className="space-y-2">
                  <Label htmlFor="coverImage">Обложка (URL)</Label>
                  <Input
                    id="coverImage"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Содержание</CardTitle>
              </CardHeader>
              <CardContent>
                <StandardEditor
                  content={content}
                  onChange={setContent}
                  placeholder="Введите текст новости..."
                  minHeight="300px"
                />
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
              </CardContent>
            </Card>

            <Button
              type="submit"
              className="w-full"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Создать
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
