"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileText,
  Loader2,
  MoreHorizontal,
  Pin,
  PinOff,
  Search,
  Trash2,
  X,
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
import { Textarea } from "~/components/ui/textarea";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";
import type { PublicationStatus, PublicationType } from "~/server/db/schema";
import { AdminPageHeader } from "~/components/admin/admin-page-header";

const STATUS_CONFIG: Record<
  PublicationStatus,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  draft: { label: "Черновик", variant: "secondary" },
  pending: { label: "На модерации", variant: "outline" },
  published: { label: "Опубликовано", variant: "default" },
  rejected: { label: "Отклонено", variant: "destructive" },
  archived: { label: "В архиве", variant: "secondary" },
};

const TYPE_CONFIG: Record<PublicationType, { label: string; color: string }> = {
  announcement: { label: "Объявление", color: "bg-blue-500/10 text-blue-600" },
  event: { label: "Мероприятие", color: "bg-cyan-500/10 text-cyan-600" },
  help_request: { label: "Просьба о помощи", color: "bg-red-500/10 text-red-600" },
  lost_found: { label: "Потеряно/найдено", color: "bg-amber-500/10 text-amber-600" },
  recommendation: { label: "Рекомендация", color: "bg-emerald-500/10 text-emerald-600" },
  question: { label: "Вопрос", color: "bg-purple-500/10 text-purple-600" },
  discussion: { label: "Обсуждение", color: "bg-green-500/10 text-green-600" },
};

export default function AdminPublicationsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  // URL params
  const pageParam = searchParams.get("page");
  const page = pageParam ? parseInt(pageParam, 10) : 1;
  const statusFilter = searchParams.get("status") ?? "all";

  // Local state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; title: string } | null>(null);
  const [moderateDialogOpen, setModerateDialogOpen] = useState(false);
  const [itemToModerate, setItemToModerate] = useState<{
    id: string;
    title: string;
    action: "approve" | "reject";
  } | null>(null);
  const [moderationComment, setModerationComment] = useState("");

  // Queries - exclude events (они управляются отдельно)
  const { data, isLoading, refetch } = api.publications.admin.list.useQuery({
    page,
    limit: 20,
    status: statusFilter !== "all" ? (statusFilter as PublicationStatus) : undefined,
  });

  // Filter out events (they have their own page)
  const items = data?.items.filter((item) => item.type !== "event") ?? [];

  // Mutations
  const deleteMutation = api.publications.admin.delete.useMutation({
    onSuccess: () => {
      toast({ title: "Публикация удалена" });
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      refetch();
    },
    onError: (error) => {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    },
  });

  const moderateMutation = api.publications.admin.moderate.useMutation({
    onSuccess: () => {
      toast({
        title: itemToModerate?.action === "approve" ? "Публикация одобрена" : "Публикация отклонена",
      });
      setModerateDialogOpen(false);
      setItemToModerate(null);
      setModerationComment("");
      refetch();
    },
    onError: (error) => {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    },
  });

  const togglePinMutation = api.publications.admin.togglePin.useMutation({
    onSuccess: (result) => {
      toast({ title: result.isPinned ? "Публикация закреплена" : "Публикация откреплена" });
      refetch();
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
    router.push(`/admin/publications?${params.toString()}`);
  };

  const setStatusFilter = (status: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (status === "all") {
      params.delete("status");
    } else {
      params.set("status", status);
    }
    params.delete("page");
    router.push(`/admin/publications?${params.toString()}`);
  };

  const openDeleteDialog = (item: { id: string; title: string }) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const openModerateDialog = (
    item: { id: string; title: string },
    action: "approve" | "reject"
  ) => {
    setItemToModerate({ ...item, action });
    setModerationComment("");
    setModerateDialogOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      deleteMutation.mutate({ id: itemToDelete.id });
    }
  };

  const confirmModerate = () => {
    if (itemToModerate) {
      moderateMutation.mutate({
        id: itemToModerate.id,
        status: itemToModerate.action === "approve" ? "published" : "rejected",
        comment: moderationComment || undefined,
      });
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Публикации"
        description="Модерация публикаций пользователей"
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Статус" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все статусы</SelectItem>
            <SelectItem value="pending">На модерации</SelectItem>
            <SelectItem value="published">Опубликованные</SelectItem>
            <SelectItem value="rejected">Отклонённые</SelectItem>
            <SelectItem value="draft">Черновики</SelectItem>
            <SelectItem value="archived">В архиве</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Publications List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : items.length > 0 ? (
        <div className="rounded-lg border">
          {/* Table Header */}
          <div className="flex items-center gap-4 border-b bg-muted/50 px-4 py-3 text-sm font-medium text-muted-foreground">
            <div className="w-24">Дата</div>
            <div className="flex-1 min-w-0">Заголовок</div>
            <div className="w-28 hidden sm:block">Тип</div>
            <div className="w-32 hidden md:block">Автор</div>
            <div className="w-28">Статус</div>
            <div className="w-10"></div>
          </div>

          {/* Table Body */}
          {items.map((item) => {
            const statusConfig = STATUS_CONFIG[item.status];
            const typeConfig = TYPE_CONFIG[item.type];

            return (
              <div
                key={item.id}
                className="flex items-center gap-4 border-b px-4 py-3 last:border-b-0 hover:bg-muted/30 transition-colors"
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
                    <div className="text-xs text-muted-foreground">
                      {new Date(item.createdAt).toLocaleTimeString("ru-RU", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>

                {/* Title Column */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2">
                    <Link
                      href={`/publications/${item.id}`}
                      className="font-medium hover:underline line-clamp-2"
                      target="_blank"
                    >
                      {item.title}
                    </Link>
                    {item.isPinned && (
                      <Pin className="h-4 w-4 text-primary shrink-0" />
                    )}
                    {item.isUrgent && (
                      <Badge variant="destructive" className="text-xs px-1.5 py-0 shrink-0">
                        !
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Type Column */}
                <div className="w-28 hidden sm:block">
                  <Badge variant="outline" className={`${typeConfig.color} text-xs`}>
                    {typeConfig.label}
                  </Badge>
                </div>

                {/* Author Column */}
                <div className="w-32 hidden md:block">
                  <span className="text-sm text-muted-foreground truncate block">
                    {item.isAnonymous ? "Аноним" : item.author?.name ?? "—"}
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
                      {item.status === "published" && (
                        <DropdownMenuItem asChild>
                          <Link href={`/publications/${item.id}`} target="_blank">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Открыть на сайте
                          </Link>
                        </DropdownMenuItem>
                      )}
                      {item.status === "pending" && (
                        <>
                          <DropdownMenuItem
                            onClick={() =>
                              openModerateDialog({ id: item.id, title: item.title }, "approve")
                            }
                          >
                            <Check className="mr-2 h-4 w-4" />
                            Одобрить
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              openModerateDialog({ id: item.id, title: item.title }, "reject")
                            }
                          >
                            <X className="mr-2 h-4 w-4" />
                            Отклонить
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </>
                      )}
                      {item.status === "published" && (
                        <DropdownMenuItem
                          onClick={() => togglePinMutation.mutate({ id: item.id })}
                        >
                          {item.isPinned ? (
                            <>
                              <PinOff className="mr-2 h-4 w-4" />
                              Открепить
                            </>
                          ) : (
                            <>
                              <Pin className="mr-2 h-4 w-4" />
                              Закрепить
                            </>
                          )}
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

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 py-4 border-t">
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
          <CardContent className="py-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground/30" />
            <h3 className="mt-4 text-lg font-medium">Публикаций пока нет</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Публикации пользователей появятся здесь
            </p>
          </CardContent>
        </Card>
      )}

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить публикацию?</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить &quot;{itemToDelete?.title}&quot;? Это действие
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

      {/* Moderate Dialog */}
      <Dialog open={moderateDialogOpen} onOpenChange={setModerateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {itemToModerate?.action === "approve"
                ? "Одобрить публикацию?"
                : "Отклонить публикацию?"}
            </DialogTitle>
            <DialogDescription>
              {itemToModerate?.action === "approve"
                ? `Публикация "${itemToModerate?.title}" будет опубликована и станет доступна всем пользователям.`
                : `Публикация "${itemToModerate?.title}" будет отклонена.`}
            </DialogDescription>
          </DialogHeader>
          {itemToModerate?.action === "reject" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Комментарий (необязательно)</label>
              <Textarea
                placeholder="Причина отклонения..."
                value={moderationComment}
                onChange={(e) => setModerationComment(e.target.value)}
              />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setModerateDialogOpen(false)}>
              Отмена
            </Button>
            <Button
              variant={itemToModerate?.action === "approve" ? "default" : "destructive"}
              onClick={confirmModerate}
              disabled={moderateMutation.isPending}
            >
              {moderateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {itemToModerate?.action === "approve" ? "Одобрить" : "Отклонить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
