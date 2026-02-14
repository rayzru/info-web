"use client";

import { useState } from "react";

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
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { AdminPageHeader } from "~/components/admin/admin-page-header";
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
import { useMobile } from "~/hooks/use-mobile";
import { useToast } from "~/hooks/use-toast";
import type { NewsStatus, NewsType } from "~/server/db/schema";
import { api } from "~/trpc/react";

// ============================================================================
// Constants
// ============================================================================

const NEWS_TYPE_CONFIG: Record<NewsType, { label: string; icon: typeof Megaphone; color: string }> =
  {
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
  const isMobile = useMobile();

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
      <AdminPageHeader title="Новости" description="Управление новостями и объявлениями">
        <Link href="/admin/news/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Создать новость
          </Button>
        </Link>
      </AdminPageHeader>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative max-w-md flex-1">
          <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
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
        isMobile ? (
          /* Mobile: Card View */
          <div className="space-y-3">
            {data.items.map((item) => {
              const typeConfig = NEWS_TYPE_CONFIG[item.type];
              const statusConfig = NEWS_STATUS_CONFIG[item.status];
              const Icon = typeConfig.icon;

              return (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/admin/news/${item.id}`}
                          className="mb-2 line-clamp-2 block font-medium hover:underline"
                        >
                          {item.title}
                        </Link>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline" className={`${typeConfig.color} text-xs`}>
                            <Icon className="mr-1 h-3 w-3" />
                            {typeConfig.label}
                          </Badge>
                          <Badge variant={statusConfig.variant} className="text-xs">
                            {statusConfig.label}
                          </Badge>
                        </div>
                        <div className="text-muted-foreground mt-2 text-xs">
                          {new Date(item.createdAt).toLocaleDateString("ru-RU", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                          {item.author?.name && ` • ${item.author.name}`}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
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
                              <Send className="mr-2 h-4 w-4" />В Telegram
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

            {/* Mobile Pagination */}
            {data.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 py-4">
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
          /* Desktop: Table View */
          <div className="rounded-lg border">
            {/* Table Header */}
            <div className="bg-muted/50 text-muted-foreground flex items-center gap-4 border-b px-4 py-3 text-sm font-medium">
              <div className="w-24">Дата</div>
              <div className="min-w-0 flex-1">Заголовок</div>
              <div className="hidden w-28 sm:block">Тип</div>
              <div className="hidden w-32 md:block">Автор</div>
              <div className="w-28">Статус</div>
              <div className="w-10"></div>
            </div>

            {/* Table Body */}
            {data.items.map((item) => {
              const typeConfig = NEWS_TYPE_CONFIG[item.type];
              const statusConfig = NEWS_STATUS_CONFIG[item.status];
              const Icon = typeConfig.icon;

              return (
                <div
                  key={item.id}
                  className="hover:bg-muted/30 flex items-center gap-4 border-b px-4 py-3 transition-colors last:border-b-0"
                >
                  {/* Date Column */}
                  <div className="w-24 shrink-0">
                    <div className="text-sm">
                      <div className="font-medium">
                        {new Date(item.createdAt).toLocaleDateString("ru-RU", {
                          day: "numeric",
                          month: "short",
                        })}
                      </div>
                      {item.publishAt && (
                        <div className="text-muted-foreground text-xs">
                          {new Date(item.publishAt).toLocaleDateString("ru-RU", {
                            day: "numeric",
                            month: "short",
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Title Column */}
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/admin/news/${item.id}`}
                      className="line-clamp-2 font-medium hover:underline"
                    >
                      {item.title}
                    </Link>
                  </div>

                  {/* Type Column */}
                  <div className="hidden w-28 sm:block">
                    <Badge variant="outline" className={`${typeConfig.color} text-xs`}>
                      <Icon className="mr-1 h-3 w-3" />
                      {typeConfig.label}
                    </Badge>
                  </div>

                  {/* Author Column */}
                  <div className="hidden w-32 md:block">
                    <span className="text-muted-foreground block truncate text-sm">
                      {item.author?.name ?? "—"}
                    </span>
                  </div>

                  {/* Status Column */}
                  <div className="w-28 shrink-0">
                    <Badge variant={statusConfig.variant} className="text-xs">
                      {statusConfig.label}
                    </Badge>
                  </div>

                  {/* Actions Column */}
                  <div className="w-10 shrink-0">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
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
                          <DropdownMenuItem onClick={() => publishMutation.mutate({ id: item.id })}>
                            <Megaphone className="mr-2 h-4 w-4" />
                            Опубликовать
                          </DropdownMenuItem>
                        )}
                        {item.status === "published" && (
                          <DropdownMenuItem
                            onClick={() => openTelegramDialog({ id: item.id, title: item.title })}
                          >
                            <Send className="mr-2 h-4 w-4" />В Telegram
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
                </div>
              );
            })}

            {/* Desktop Pagination */}
            {data.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 border-t py-4">
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
        )
      ) : (
        <div className="text-muted-foreground rounded-lg border py-12 text-center">
          {searchQuery ? "Ничего не найдено" : "Новостей пока нет"}
        </div>
      )}

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить новость?</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить &quot;{newsToDelete?.title}&quot;? Это действие нельзя
              отменить.
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
            <Button onClick={confirmTelegram} disabled={telegramMutation.isPending}>
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
