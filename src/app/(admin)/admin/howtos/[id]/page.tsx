"use client";

import { useEffect, useState } from "react";

import type { JSONContent } from "@tiptap/react";
import { ArrowLeft, Eye, Loader2, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { AdminPageHeader } from "~/components/admin/admin-page-header";
import { StandardEditor } from "~/components/editor/rich-editor";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
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
import { Textarea } from "~/components/ui/textarea";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

const STATUS_OPTIONS = [
  { value: "draft", label: "Черновик" },
  { value: "published", label: "Опубликовано" },
  { value: "archived", label: "В архиве" },
];

export default function EditHowtoPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();

  const id = params.id as string;
  const isNew = id === "new";

  // Form state
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState<JSONContent | null>(null);
  const [status, setStatus] = useState<"draft" | "published" | "archived">("draft");
  const [buildingId, setBuildingId] = useState<string | null>(null);
  const [icon, setIcon] = useState("");
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [order, setOrder] = useState(0);

  // Dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Query - only if editing existing
  const { data: article, isLoading } = api.knowledge.admin.get.useQuery(
    { id },
    { enabled: !isNew }
  );

  // Get buildings for selector
  const { data: buildings } = api.admin.buildings.list.useQuery();

  // Get tags for selector
  const { data: tags } = api.directory.getTags.useQuery({ includeAll: true });

  // Mutations
  const createMutation = api.knowledge.admin.create.useMutation({
    onSuccess: (result) => {
      toast({ title: "Статья создана" });
      router.push(`/admin/howtos/${result.id}`);
    },
    onError: (error) => {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = api.knowledge.admin.update.useMutation({
    onSuccess: () => {
      toast({ title: "Статья сохранена" });
    },
    onError: (error) => {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = api.knowledge.admin.delete.useMutation({
    onSuccess: () => {
      toast({ title: "Статья удалена" });
      router.push("/admin/howtos");
    },
    onError: (error) => {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    },
  });

  // Initialize form with data
  useEffect(() => {
    if (article) {
      setTitle(article.title);
      setExcerpt(article.excerpt ?? "");
      setContent(article.content ? JSON.parse(article.content) : null);
      setStatus(article.status);
      setBuildingId(article.buildingId);
      setIcon(article.icon ?? "");
      setTagIds(article.tags?.map((t) => t.id) ?? []);
      setOrder(article.order ?? 0);
    }
  }, [article]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast({ title: "Введите заголовок", variant: "destructive" });
      return;
    }

    const data = {
      title: title.trim(),
      excerpt: excerpt.trim() || undefined,
      content: content ? JSON.stringify(content) : undefined,
      status,
      buildingId: buildingId || undefined,
      icon: icon.trim() || undefined,
      tagIds,
      order,
    };

    if (isNew) {
      createMutation.mutate(data);
    } else {
      updateMutation.mutate({ id, ...data });
    }
  };

  const handleDelete = () => {
    deleteMutation.mutate({ id });
  };

  const handlePublish = () => {
    if (isNew) return;
    updateMutation.mutate({ id, status: "published" });
    setStatus("published");
  };

  const toggleTag = (tagId: string) => {
    setTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  if (!isNew && isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isNew && !article) {
    return (
      <div className="text-muted-foreground flex flex-col items-center justify-center py-12">
        <p>Статья не найдена</p>
        <Link href="/admin/howtos" className="mt-4">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад к списку
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={isNew ? "Новая статья" : "Редактирование статьи"}
        breadcrumbLabel={isNew ? "Новая статья" : article?.title}
      >
        <div className="flex items-center gap-2">
          {!isNew && status === "published" && (
            <Link href={`/howtos/${article?.slug}`} target="_blank">
              <Button variant="outline">
                <Eye className="mr-2 h-4 w-4" />
                Просмотр
              </Button>
            </Link>
          )}
          {!isNew && status === "draft" && (
            <Button variant="outline" onClick={handlePublish} disabled={updateMutation.isPending}>
              {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Опубликовать
            </Button>
          )}
          <Button
            onClick={handleSubmit}
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {(createMutation.isPending || updateMutation.isPending) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            <Save className="mr-2 h-4 w-4" />
            Сохранить
          </Button>
        </div>
      </AdminPageHeader>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main content */}
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Основное</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Заголовок *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Как подключить домофон"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Краткое описание</Label>
                  <Textarea
                    id="excerpt"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Пошаговая инструкция по подключению домофона к мобильному приложению"
                    rows={3}
                  />
                  <p className="text-muted-foreground text-xs">
                    Будет показано в списке и результатах поиска
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Содержание</CardTitle>
              </CardHeader>
              <CardContent>
                <StandardEditor
                  content={content ?? undefined}
                  onChange={setContent}
                  placeholder="Начните писать статью..."
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
                  <Label htmlFor="status">Статус</Label>
                  <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="order">Порядок сортировки</Label>
                  <Input
                    id="order"
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                  />
                  <p className="text-muted-foreground text-xs">Меньшее число = выше в списке</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Привязка</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="building">Строение</Label>
                  <Select
                    value={buildingId ?? "all"}
                    onValueChange={(v) => setBuildingId(v === "all" ? null : v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Все строения" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все строения</SelectItem>
                      {buildings?.map(
                        (b: { id: string; number: number | null; title: string | null }) => (
                          <SelectItem key={b.id} value={b.id}>
                            {b.title ?? `Строение ${b.number}`}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  <p className="text-muted-foreground text-xs">
                    Ограничить показ только для определённого строения
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="icon">Иконка (Lucide)</Label>
                  <Input
                    id="icon"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    placeholder="file-text"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Теги</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex max-h-[300px] flex-wrap gap-2 overflow-y-auto">
                  {tags?.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                        tagIds.includes(tag.id)
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
                <p className="text-muted-foreground mt-2 text-xs">
                  Выберите теги для связи со справочником
                </p>
              </CardContent>
            </Card>

            {!isNew && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-destructive">Опасная зона</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setDeleteDialogOpen(true)}
                    className="w-full"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Удалить статью
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </form>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить статью?</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить &quot;{title}&quot;? Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
