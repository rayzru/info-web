"use client";

import { useState } from "react";

import {
  Archive,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  FileText,
  Loader2,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
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
import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

const STATUS_LABELS: Record<string, string> = {
  draft: "Черновик",
  published: "Опубликовано",
  archived: "В архиве",
};

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  published: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  archived: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400",
};

export default function AdminHowtosPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const pageParam = searchParams.get("page");
  const page = pageParam ? parseInt(pageParam, 10) : 1;
  const statusFilter = searchParams.get("status") ?? "all";
  const searchQuery = searchParams.get("q") ?? "";

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<{ id: string; title: string } | null>(
    null
  );
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Queries
  const { data, isLoading, refetch } = api.knowledge.admin.list.useQuery({
    page,
    limit: 20,
    status:
      statusFilter !== "all" ? (statusFilter as "draft" | "published" | "archived") : undefined,
    search: searchQuery || undefined,
  });

  const { data: stats } = api.knowledge.admin.getStats.useQuery();

  // Mutations
  const deleteMutation = api.knowledge.admin.delete.useMutation({
    onSuccess: () => {
      toast({ title: "Статья удалена" });
      setDeleteDialogOpen(false);
      setArticleToDelete(null);
      refetch();
    },
    onError: (error) => {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = api.knowledge.admin.update.useMutation({
    onSuccess: () => {
      toast({ title: "Статья обновлена" });
      refetch();
    },
    onError: (error) => {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    },
  });

  // Handlers
  const setFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all" || !value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete("page"); // Reset page on filter change
    router.push(`/admin/howtos?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilter("q", localSearch);
  };

  const setPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newPage === 1) {
      params.delete("page");
    } else {
      params.set("page", newPage.toString());
    }
    router.push(`/admin/howtos?${params.toString()}`);
  };

  const handleDelete = (article: { id: string; title: string }) => {
    setArticleToDelete(article);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (articleToDelete) {
      deleteMutation.mutate({ id: articleToDelete.id });
    }
  };

  const handleStatusChange = (id: string, status: "draft" | "published" | "archived") => {
    updateMutation.mutate({ id, status });
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="База знаний" description="Инструкции и полезные статьи для жителей">
        <Link href="/admin/howtos/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Новая статья
          </Button>
        </Link>
      </AdminPageHeader>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Card
            className={`cursor-pointer transition-all hover:shadow-md ${
              statusFilter === "all" ? "ring-primary ring-2 ring-offset-2" : ""
            }`}
            onClick={() => setFilter("status", "all")}
          >
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">
                {stats.draft + stats.published + stats.archived}
              </div>
              <p className="text-muted-foreground text-sm">Всего статей</p>
            </CardContent>
          </Card>
          <Card
            className={`cursor-pointer transition-all hover:shadow-md ${
              statusFilter === "draft" ? "ring-2 ring-yellow-500 ring-offset-2" : ""
            }`}
            onClick={() => setFilter("status", "draft")}
          >
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-yellow-600">{stats.draft}</div>
              <p className="text-muted-foreground text-sm">Черновики</p>
            </CardContent>
          </Card>
          <Card
            className={`cursor-pointer transition-all hover:shadow-md ${
              statusFilter === "published" ? "ring-2 ring-green-500 ring-offset-2" : ""
            }`}
            onClick={() => setFilter("status", "published")}
          >
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-green-600">{stats.published}</div>
              <p className="text-muted-foreground text-sm">Опубликовано</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{stats.totalViews}</div>
              <p className="text-muted-foreground text-sm">Просмотров</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <form onSubmit={handleSearch} className="relative max-w-md flex-1">
          <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Поиск по заголовку..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="pl-9 pr-20"
          />
          <Button
            type="submit"
            size="sm"
            variant="ghost"
            className="absolute right-1 top-1/2 h-7 -translate-y-1/2"
          >
            Найти
          </Button>
        </form>

        <Select value={statusFilter} onValueChange={(v) => setFilter("status", v)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Статус" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все статусы</SelectItem>
            <SelectItem value="draft">Черновики</SelectItem>
            <SelectItem value="published">Опубликованные</SelectItem>
            <SelectItem value="archived">В архиве</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Articles list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
        </div>
      ) : !data?.articles.length ? (
        <Card>
          <CardContent className="text-muted-foreground flex flex-col items-center justify-center py-12">
            <BookOpen className="mb-4 h-12 w-12 opacity-50" />
            <p>Статьи не найдены</p>
            <Link href="/admin/howtos/new" className="mt-4">
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Создать первую статью
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {data.articles.map((article) => (
            <Card key={article.id} className="transition-shadow hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                      <FileText className="text-primary h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <Link
                          href={`/admin/howtos/${article.id}`}
                          className="truncate font-medium hover:underline"
                        >
                          {article.title}
                        </Link>
                        <Badge className={STATUS_COLORS[article.status]}>
                          {STATUS_LABELS[article.status]}
                        </Badge>
                      </div>
                      {article.excerpt && (
                        <p className="text-muted-foreground mb-2 line-clamp-1 text-sm">
                          {article.excerpt}
                        </p>
                      )}
                      <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {article.viewCount}
                        </span>
                        {article.tags.length > 0 && (
                          <>
                            <span>•</span>
                            <div className="flex flex-wrap gap-1">
                              {article.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag.id} variant="outline" className="text-xs">
                                  {tag.name}
                                </Badge>
                              ))}
                              {article.tags.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{article.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          </>
                        )}
                        {article.author && (
                          <>
                            <span>•</span>
                            <span>{article.author.name}</span>
                          </>
                        )}
                      </div>
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
                        <Link href={`/admin/howtos/${article.id}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Редактировать
                        </Link>
                      </DropdownMenuItem>
                      {article.status === "published" && (
                        <DropdownMenuItem asChild>
                          <Link href={`/howtos/${article.slug}`} target="_blank">
                            <Eye className="mr-2 h-4 w-4" />
                            Просмотреть
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      {article.status === "draft" && (
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(article.id, "published")}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Опубликовать
                        </DropdownMenuItem>
                      )}
                      {article.status === "published" && (
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(article.id, "archived")}
                        >
                          <Archive className="mr-2 h-4 w-4" />В архив
                        </DropdownMenuItem>
                      )}
                      {article.status === "archived" && (
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(article.id, "published")}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Восстановить
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete({ id: article.id, title: article.title })}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Удалить
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">
            Страница {page} из {data.totalPages} (всего {data.total})
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage(page + 1)}
              disabled={page === data.totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить статью?</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить &quot;{articleToDelete?.title}&quot;? Это действие
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
    </div>
  );
}
