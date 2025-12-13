"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Edit,
  ExternalLink,
  Loader2,
  Megaphone,
  MoreHorizontal,
  Plus,
  Search,
  Send,
  Sparkles,
  Trash2,
  Users,
  Wrench,
} from "lucide-react";

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";
import type { NewsStatus, NewsType } from "~/server/db/schema";

// ============================================================================
// Constants
// ============================================================================

const NEWS_TYPE_CONFIG: Record<
  NewsType,
  { label: string; icon: typeof Megaphone; color: string }
> = {
  announcement: {
    label: "Объявление",
    icon: Megaphone,
    color: "bg-blue-500/10 text-blue-600",
  },
  event: {
    label: "Мероприятие",
    icon: Calendar,
    color: "bg-purple-500/10 text-purple-600",
  },
  maintenance: {
    label: "Тех. работы",
    icon: Wrench,
    color: "bg-orange-500/10 text-orange-600",
  },
  update: {
    label: "Обновление",
    icon: Sparkles,
    color: "bg-green-500/10 text-green-600",
  },
  community: {
    label: "Сообщество",
    icon: Users,
    color: "bg-cyan-500/10 text-cyan-600",
  },
  urgent: {
    label: "Срочное",
    icon: AlertTriangle,
    color: "bg-red-500/10 text-red-600",
  },
};

const NEWS_STATUS_CONFIG: Record<
  NewsStatus,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  draft: { label: "Черновик", variant: "secondary" },
  scheduled: { label: "Запланирована", variant: "outline" },
  published: { label: "Опубликована", variant: "default" },
  archived: { label: "В архиве", variant: "destructive" },
};

// ============================================================================
// Page Component
// ============================================================================

export default function AdminNewsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  // URL params
  const pageParam = searchParams.get("page");
  const page = pageParam ? parseInt(pageParam, 10) : 1;
  const statusFilter = searchParams.get("status") ?? "all";
  const typeFilter = searchParams.get("type") ?? "all";
  const searchQuery = searchParams.get("q") ?? "";

  // Local state
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState<{ id: string; title: string } | null>(null);
  const [telegramDialogOpen, setTelegramDialogOpen] = useState(false);
  const [newsToPublish, setNewsToPublish] = useState<{ id: string; title: string } | null>(null);

  // Queries
  const { data: stats } = api.news.stats.useQuery();
  const { data, isLoading, refetch } = api.news.adminList.useQuery({
    page,
    limit: 20,
    status: statusFilter !== "all" ? (statusFilter as NewsStatus) : undefined,
    type: typeFilter !== "all" ? (typeFilter as NewsType) : undefined,
    search: searchQuery || undefined,
  });

  // Mutations
  const deleteMutation = api.news.delete.useMutation({
    onSuccess: () => {
      toast({ title: "Новость удалена" });
      setDeleteDialogOpen(false);
      setNewsToDelete(null);
      refetch();
    },
    onError: (error) => {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    },
  });

  const publishMutation = api.news.publish.useMutation({
    onSuccess: () => {
      toast({ title: "Новость опубликована" });
      refetch();
    },
    onError: (error) => {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    },
  });

  const telegramMutation = api.news.publishToTelegram.useMutation({
    onSuccess: () => {
      toast({ title: "Опубликовано в Telegram" });
      setTelegramDialogOpen(false);
      setNewsToPublish(null);
    },
    onError: (error) => {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    },
  });

  // URL helpers
  const setPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newPage === 1) {
      params.delete("page");
    } else {
      params.set("page", newPage.toString());
    }
    router.push(`/admin/news?${params.toString()}`);
  };

  const setStatusFilter = (status: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (status === "all") {
      params.delete("status");
    } else {
      params.set("status", status);
    }
    params.delete("page");
    router.push(`/admin/news?${params.toString()}`);
  };

  const setTypeFilter = (type: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (type === "all") {
      params.delete("type");
    } else {
      params.set("type", type);
    }
    params.delete("page");
    router.push(`/admin/news?${params.toString()}`);
  };

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (localSearch) {
      params.set("q", localSearch);
    } else {
      params.delete("q");
    }
    params.delete("page");
    router.push(`/admin/news?${params.toString()}`);
  };

  const clearSearch = () => {
    setLocalSearch("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    router.push(`/admin/news?${params.toString()}`);
  };

  const openDeleteDialog = (news: { id: string; title: string }) => {
    setNewsToDelete(news);
    setDeleteDialogOpen(true);
  };

  const openTelegramDialog = (news: { id: string; title: string }) => {
    setNewsToPublish(news);
    setTelegramDialogOpen(true);
  };

  const confirmDelete = () => {
    if (newsToDelete) {
      deleteMutation.mutate({ id: newsToDelete.id });
    }
  };

  const confirmTelegram = () => {
    if (newsToPublish) {
      telegramMutation.mutate({ id: newsToPublish.id });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Новости</h1>
          <p className="text-muted-foreground mt-1">
            Управление новостями и объявлениями
          </p>
        </div>
        <Link href="/admin/news/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Создать новость
          </Button>
        </Link>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
          <Card
            className={`cursor-pointer transition-all hover:shadow-md ${
              statusFilter === "all" ? "ring-2 ring-primary ring-offset-2" : ""
            }`}
            onClick={() => setStatusFilter("all")}
          >
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-sm text-muted-foreground">Всего</p>
            </CardContent>
          </Card>
          <Card
            className={`cursor-pointer transition-all hover:shadow-md ${
              statusFilter === "draft" ? "ring-2 ring-yellow-500 ring-offset-2" : ""
            }`}
            onClick={() => setStatusFilter("draft")}
          >
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-yellow-600">{stats.draft}</div>
              <p className="text-sm text-muted-foreground">Черновики</p>
            </CardContent>
          </Card>
          <Card
            className={`cursor-pointer transition-all hover:shadow-md ${
              statusFilter === "scheduled" ? "ring-2 ring-blue-500 ring-offset-2" : ""
            }`}
            onClick={() => setStatusFilter("scheduled")}
          >
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-blue-600">{stats.scheduled}</div>
              <p className="text-sm text-muted-foreground">Запланировано</p>
            </CardContent>
          </Card>
          <Card
            className={`cursor-pointer transition-all hover:shadow-md ${
              statusFilter === "published" ? "ring-2 ring-green-500 ring-offset-2" : ""
            }`}
            onClick={() => setStatusFilter("published")}
          >
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-green-600">{stats.published}</div>
              <p className="text-sm text-muted-foreground">Опубликовано</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск по заголовку..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Статус" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все статусы</SelectItem>
            <SelectItem value="draft">Черновики</SelectItem>
            <SelectItem value="scheduled">Запланированные</SelectItem>
            <SelectItem value="published">Опубликованные</SelectItem>
            <SelectItem value="archived">В архиве</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Тип" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все типы</SelectItem>
            <SelectItem value="announcement">Объявления</SelectItem>
            <SelectItem value="event">Мероприятия</SelectItem>
            <SelectItem value="maintenance">Тех. работы</SelectItem>
            <SelectItem value="update">Обновления</SelectItem>
            <SelectItem value="community">Сообщество</SelectItem>
            <SelectItem value="urgent">Срочные</SelectItem>
          </SelectContent>
        </Select>
        {searchQuery && (
          <Button variant="ghost" size="sm" onClick={clearSearch}>
            Сбросить поиск
          </Button>
        )}
      </div>

      {/* News List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : data?.items && data.items.length > 0 ? (
        <div className="space-y-3">
          {data.items.map((item) => {
            const typeConfig = NEWS_TYPE_CONFIG[item.type];
            const statusConfig = NEWS_STATUS_CONFIG[item.status];
            const Icon = typeConfig.icon;

            return (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Cover Image */}
                    {item.coverImage ? (
                      <div className="relative h-20 w-32 flex-shrink-0 overflow-hidden rounded-md">
                        <Image
                          src={item.coverImage}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-20 w-32 flex-shrink-0 items-center justify-center rounded-md bg-muted">
                        <Icon className="h-8 w-8 text-muted-foreground/30" />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link
                          href={`/admin/news/${item.id}`}
                          className="font-medium hover:underline"
                        >
                          {item.title}
                        </Link>
                        <Badge variant={statusConfig.variant}>
                          {statusConfig.label}
                        </Badge>
                        <Badge variant="outline" className={typeConfig.color}>
                          <Icon className="mr-1 h-3 w-3" />
                          {typeConfig.label}
                        </Badge>
                      </div>

                      {item.excerpt && (
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                          {item.excerpt}
                        </p>
                      )}

                      <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                        <span>/{item.slug}</span>
                        <span>·</span>
                        <span>
                          {new Date(item.createdAt).toLocaleDateString("ru-RU")}
                        </span>
                        {item.publishAt && (
                          <>
                            <span>·</span>
                            <span>
                              Публикация:{" "}
                              {new Date(item.publishAt).toLocaleDateString("ru-RU")}
                            </span>
                          </>
                        )}
                        {item.author && (
                          <>
                            <span>·</span>
                            <span>{item.author.name}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/news/${item.id}`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Редактировать
                          </Link>
                        </DropdownMenuItem>
                        {item.status === "published" && (
                          <DropdownMenuItem asChild>
                            <Link href={`/news/${item.slug}`} target="_blank">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Открыть на сайте
                            </Link>
                          </DropdownMenuItem>
                        )}
                        {item.status === "draft" && (
                          <DropdownMenuItem
                            onClick={() => publishMutation.mutate({ id: item.id })}
                          >
                            <Megaphone className="mr-2 h-4 w-4" />
                            Опубликовать
                          </DropdownMenuItem>
                        )}
                        {item.status === "published" && (
                          <DropdownMenuItem
                            onClick={() => openTelegramDialog({ id: item.id, title: item.title })}
                          >
                            <Send className="mr-2 h-4 w-4" />
                            В Telegram
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => openDeleteDialog({ id: item.id, title: item.title })}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Удалить
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button
                variant="outline"
                size="icon"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                {page} из {data.totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                disabled={page === data.totalPages}
                onClick={() => setPage(page + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            {searchQuery ? "Ничего не найдено" : "Новостей пока нет"}
          </CardContent>
        </Card>
      )}

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить новость?</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить &quot;{newsToDelete?.title}&quot;? Это действие
              нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Telegram Dialog */}
      <Dialog open={telegramDialogOpen} onOpenChange={setTelegramDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Опубликовать в Telegram?</DialogTitle>
            <DialogDescription>
              Новость &quot;{newsToPublish?.title}&quot; будет опубликована в Telegram канал.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTelegramDialogOpen(false)}>
              Отмена
            </Button>
            <Button
              onClick={confirmTelegram}
              disabled={telegramMutation.isPending}
            >
              {telegramMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Send className="mr-2 h-4 w-4" />
              Опубликовать
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
