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
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { AdminPageHeader } from "~/components/admin/admin-page-header";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
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
import { api } from "~/trpc/react";

const STATUS_LABELS: Record<string, string> = {
  draft: "Черновик",
  published: "Опубликовано",
  archived: "В архиве",
};

const STATUS_COLORS: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  draft: "secondary",
  published: "default",
  archived: "destructive",
};

export default function AdminHowtosPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const isMobile = useMobile();

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

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
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

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <Input
          placeholder="Поиск по заголовку..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="w-full sm:w-64"
        />

        <Select value={statusFilter} onValueChange={(v) => setFilter("status", v)}>
          <SelectTrigger className="w-45">
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

      {/* Articles Table/Cards */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : !data?.articles.length ? (
        <div className="text-muted-foreground rounded-lg border py-12 text-center">
          <BookOpen className="mx-auto mb-4 h-12 w-12 opacity-50" />
          <p>Статьи не найдены</p>
          <Link href="/admin/howtos/new" className="mt-4 inline-block">
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Создать первую статью
            </Button>
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden rounded-lg border md:block">
            <div className="bg-muted/50 text-muted-foreground flex items-center gap-4 border-b px-4 py-3 text-sm font-medium">
              <div className="min-w-0 flex-1">Заголовок</div>
              <div className="hidden w-32 sm:block">Просмотры</div>
              <div className="hidden w-40 md:block">Автор</div>
              <div className="w-28">Статус</div>
              <div className="w-10"></div>
            </div>

            {data.articles.map((article) => (
              <div
                key={article.id}
                className="hover:bg-muted/30 flex items-center gap-4 border-b px-4 py-3 last:border-b-0"
              >
                {/* Title + Tags */}
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/admin/howtos/${article.id}`}
                    className="truncate font-medium hover:underline"
                  >
                    {article.title}
                  </Link>
                  {article.tags.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {article.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag.id} variant="outline" className="text-xs">
                          {tag.name}
                        </Badge>
                      ))}
                      {article.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{article.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                {/* View Count */}
                <div className="hidden w-32 sm:block">
                  <div className="flex items-center gap-1.5">
                    <Eye className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm">{article.viewCount}</span>
                  </div>
                </div>

                {/* Author */}
                <div className="hidden w-40 md:flex md:items-center md:gap-2">
                  {article.author ? (
                    <>
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={article.author.image ?? undefined} />
                        <AvatarFallback className="text-xs">
                          {article.author.name?.slice(0, 2).toUpperCase() ?? "??"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-muted-foreground truncate text-sm">
                        {article.author.name}
                      </span>
                    </>
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
                </div>

                {/* Status */}
                <div className="w-28">
                  <Badge variant={STATUS_COLORS[article.status]}>
                    {STATUS_LABELS[article.status]}
                  </Badge>
                </div>

                {/* Actions */}
                <div className="w-10">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
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
              </div>
            ))}
          </div>

          {/* Mobile Card View */}
          <div className="space-y-3 md:hidden">
            {data.articles.map((article) => (
              <div key={article.id} className="bg-card rounded-lg border p-4">
                <div className="mb-3 flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/admin/howtos/${article.id}`}
                      className="line-clamp-2 font-medium hover:underline"
                    >
                      {article.title}
                    </Link>
                    {article.tags.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
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
                    )}
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

                <div className="mb-3 flex flex-wrap gap-2">
                  <Badge variant={STATUS_COLORS[article.status]}>
                    {STATUS_LABELS[article.status]}
                  </Badge>
                </div>

                <div className="text-muted-foreground space-y-1 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Eye className="h-4 w-4" />
                    <span>{article.viewCount} просмотров</span>
                  </div>
                  {article.author && (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={article.author.image ?? undefined} />
                        <AvatarFallback className="text-xs">
                          {article.author.name?.slice(0, 2).toUpperCase() ?? "??"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs">{article.author.name}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                {page} из {data.totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage(page + 1)}
                disabled={page === data.totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
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
