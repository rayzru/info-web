"use client";

import { useState } from "react";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  FileText,
  HelpCircle,
  History,
  Lightbulb,
  Loader2,
  MessageSquare,
  Send,
  User,
  CheckCircle,
  XCircle,
  ArrowRight,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

import { AdminPageHeader } from "~/components/admin/admin-page-header";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
} from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";
import type { FeedbackStatus, FeedbackType, FeedbackPriority } from "~/server/db/schema";

// ============================================================================
// Labels
// ============================================================================

const STATUS_LABELS: Record<FeedbackStatus, string> = {
  new: "Новое",
  in_progress: "В работе",
  forwarded: "Перенаправлено",
  resolved: "Решено",
  closed: "Закрыто",
};

const STATUS_COLORS: Record<FeedbackStatus, string> = {
  new: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  in_progress: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  forwarded: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  resolved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  closed: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
};

const TYPE_LABELS: Record<FeedbackType, string> = {
  complaint: "Жалоба",
  suggestion: "Пожелание",
  request: "Заявка",
  question: "Вопрос",
  other: "Другое",
};

const TYPE_ICONS: Record<FeedbackType, typeof AlertTriangle> = {
  complaint: AlertTriangle,
  suggestion: Lightbulb,
  request: FileText,
  question: HelpCircle,
  other: MessageSquare,
};

const TYPE_COLORS: Record<FeedbackType, string> = {
  complaint: "text-red-500",
  suggestion: "text-yellow-500",
  request: "text-blue-500",
  question: "text-purple-500",
  other: "text-gray-500",
};

const PRIORITY_LABELS: Record<FeedbackPriority, string> = {
  low: "Низкий",
  normal: "Обычный",
  high: "Высокий",
  urgent: "Срочный",
};

const PRIORITY_COLORS: Record<FeedbackPriority, string> = {
  low: "bg-gray-100 text-gray-700",
  normal: "bg-blue-100 text-blue-700",
  high: "bg-orange-100 text-orange-700",
  urgent: "bg-red-100 text-red-700",
};

// ============================================================================
// View Dialog
// ============================================================================

type ViewDialogProps = {
  feedbackId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
};

function ViewDialog({ feedbackId, open, onOpenChange, onSuccess }: ViewDialogProps) {
  const { toast } = useToast();
  const utils = api.useUtils();

  const [newStatus, setNewStatus] = useState<FeedbackStatus | "">("");
  const [newPriority, setNewPriority] = useState<FeedbackPriority | "">("");
  const [response, setResponse] = useState("");
  const [internalNote, setInternalNote] = useState("");
  const [forwardedTo, setForwardedTo] = useState("");

  const { data: feedback, isLoading } = api.feedback.admin.byId.useQuery(
    { id: feedbackId! },
    { enabled: open && !!feedbackId }
  );

  const updateMutation = api.feedback.admin.update.useMutation({
    onSuccess: () => {
      toast({ title: "Обращение обновлено" });
      utils.feedback.admin.list.invalidate();
      utils.feedback.admin.byId.invalidate({ id: feedbackId! });
      onSuccess();
    },
    onError: (error) => {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    },
  });

  const respondMutation = api.feedback.admin.respond.useMutation({
    onSuccess: () => {
      toast({ title: "Ответ отправлен" });
      utils.feedback.admin.list.invalidate();
      utils.feedback.admin.byId.invalidate({ id: feedbackId! });
      setResponse("");
      onSuccess();
    },
    onError: (error) => {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    },
  });

  const handleUpdate = () => {
    if (!feedbackId) return;

    const updates: Record<string, unknown> = { id: feedbackId };
    if (newStatus) updates.status = newStatus;
    if (newPriority) updates.priority = newPriority;
    if (internalNote) updates.internalNote = internalNote;
    if (forwardedTo) {
      updates.forwardedTo = forwardedTo;
      updates.status = "forwarded";
    }

    if (Object.keys(updates).length > 1) {
      updateMutation.mutate(updates as any);
    }
  };

  const handleRespond = () => {
    if (!feedbackId || !response.trim()) return;
    respondMutation.mutate({ id: feedbackId, response: response.trim() });
  };

  // Reset state when dialog opens
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setNewStatus("");
      setNewPriority("");
      setResponse("");
      setInternalNote("");
      setForwardedTo("");
    }
    onOpenChange(isOpen);
  };

  if (!feedbackId) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Просмотр обращения
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : feedback ? (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {(() => {
                  const TypeIcon = TYPE_ICONS[feedback.type];
                  return (
                    <div className={`p-2 rounded-full bg-muted ${TYPE_COLORS[feedback.type]}`}>
                      <TypeIcon className="h-5 w-5" />
                    </div>
                  );
                })()}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{TYPE_LABELS[feedback.type]}</span>
                    <Badge className={STATUS_COLORS[feedback.status]}>
                      {STATUS_LABELS[feedback.status]}
                    </Badge>
                    <Badge className={PRIORITY_COLORS[feedback.priority]}>
                      {PRIORITY_LABELS[feedback.priority]}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(feedback.createdAt).toLocaleString("ru-RU")}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Content */}
            <div className="space-y-4">
              {feedback.title && (
                <div>
                  <Label className="text-muted-foreground">Тема</Label>
                  <p className="font-medium">{feedback.title}</p>
                </div>
              )}

              <div>
                <Label className="text-muted-foreground">Текст обращения</Label>
                <p className="mt-1 whitespace-pre-wrap bg-muted p-3 rounded-lg">
                  {feedback.content}
                </p>
              </div>

              {/* Photos */}
              {feedback.photos && feedback.photos.length > 0 && (
                <div>
                  <Label className="text-muted-foreground">Фотографии</Label>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {feedback.photos.map((photo, idx) => (
                      <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border">
                        <Image
                          src={photo}
                          alt={`Фото ${idx + 1}`}
                          fill
                          className="object-cover"
                          unoptimized={photo.includes("/uploads/")}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Info */}
              <div className="grid grid-cols-3 gap-4">
                {feedback.contactName && (
                  <div>
                    <Label className="text-muted-foreground">Имя</Label>
                    <p className="font-medium">{feedback.contactName}</p>
                  </div>
                )}
                {feedback.contactEmail && (
                  <div>
                    <Label className="text-muted-foreground">Email</Label>
                    <p className="font-medium">{feedback.contactEmail}</p>
                  </div>
                )}
                {feedback.contactPhone && (
                  <div>
                    <Label className="text-muted-foreground">Телефон</Label>
                    <p className="font-medium">{feedback.contactPhone}</p>
                  </div>
                )}
              </div>

              {/* Previous response */}
              {feedback.response && (
                <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                  <Label className="text-green-700 dark:text-green-300">Ответ</Label>
                  <p className="mt-1 whitespace-pre-wrap">{feedback.response}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {feedback.respondedBy?.name} · {feedback.respondedAt && new Date(feedback.respondedAt).toLocaleString("ru-RU")}
                  </p>
                </div>
              )}

              {/* Forwarded info */}
              {feedback.forwardedTo && (
                <div className="flex items-center gap-2 text-purple-600">
                  <ArrowRight className="h-4 w-4" />
                  <span>Перенаправлено: {feedback.forwardedTo}</span>
                </div>
              )}

              {/* Internal note */}
              {feedback.internalNote && (
                <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg">
                  <Label className="text-yellow-700 dark:text-yellow-300">Внутренняя заметка</Label>
                  <p className="mt-1 whitespace-pre-wrap">{feedback.internalNote}</p>
                </div>
              )}
            </div>

            <Separator />

            {/* Actions */}
            {feedback.status !== "resolved" && feedback.status !== "closed" && (
              <div className="space-y-4">
                <h4 className="font-medium">Действия</h4>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Изменить статус</Label>
                    <Select value={newStatus} onValueChange={(v) => setNewStatus(v as FeedbackStatus)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите статус" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in_progress">В работе</SelectItem>
                        <SelectItem value="forwarded">Перенаправлено</SelectItem>
                        <SelectItem value="closed">Закрыто</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Изменить приоритет</Label>
                    <Select value={newPriority} onValueChange={(v) => setNewPriority(v as FeedbackPriority)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите приоритет" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Низкий</SelectItem>
                        <SelectItem value="normal">Обычный</SelectItem>
                        <SelectItem value="high">Высокий</SelectItem>
                        <SelectItem value="urgent">Срочный</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Перенаправить</Label>
                  <Input
                    value={forwardedTo}
                    onChange={(e) => setForwardedTo(e.target.value)}
                    placeholder="Куда перенаправить (УК, МСК и т.д.)"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Внутренняя заметка</Label>
                  <Textarea
                    value={internalNote}
                    onChange={(e) => setInternalNote(e.target.value)}
                    placeholder="Заметка видна только администраторам"
                    rows={2}
                  />
                </div>

                <Button
                  onClick={handleUpdate}
                  disabled={updateMutation.isPending || (!newStatus && !newPriority && !internalNote && !forwardedTo)}
                >
                  {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Сохранить изменения
                </Button>

                <Separator />

                <div className="space-y-2">
                  <Label>Ответить заявителю</Label>
                  <Textarea
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    placeholder="Текст ответа..."
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">
                    Ответ будет отправлен на email заявителя (если указан)
                  </p>
                </div>

                <Button
                  onClick={handleRespond}
                  disabled={respondMutation.isPending || !response.trim()}
                  className="w-full"
                >
                  {respondMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Send className="mr-2 h-4 w-4" />
                  Отправить ответ и закрыть
                </Button>
              </div>
            )}
          </div>
        ) : (
          <p className="text-center py-8 text-muted-foreground">
            Обращение не найдено
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// Main Page
// ============================================================================

export default function AdminFeedbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const statusFilter = (searchParams.get("status") ?? "all") as FeedbackStatus | "all";
  const typeFilter = (searchParams.get("type") ?? "all") as FeedbackType | "all";
  const priorityFilter = (searchParams.get("priority") ?? "all") as FeedbackPriority | "all";
  const pageParam = searchParams.get("page");
  const page = pageParam ? parseInt(pageParam, 10) : 1;

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const { data: stats } = api.feedback.admin.stats.useQuery();
  const { data, isLoading, refetch } = api.feedback.admin.list.useQuery({
    page,
    limit: 20,
    status: statusFilter !== "all" ? statusFilter : undefined,
    type: typeFilter !== "all" ? typeFilter : undefined,
    priority: priorityFilter !== "all" ? priorityFilter : undefined,
  });

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete("page");
    router.push(`/admin/feedback?${params.toString()}`);
  };

  const setPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newPage === 1) {
      params.delete("page");
    } else {
      params.set("page", newPage.toString());
    }
    router.push(`/admin/feedback?${params.toString()}`);
  };

  const openViewDialog = (id: string) => {
    setSelectedId(id);
    setViewDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Обратная связь"
        description="Обращения пользователей"
      />

      {/* Stats */}
      {stats && (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-5">
          <Card
            className={`cursor-pointer transition-all hover:shadow-md ${
              statusFilter === "all" ? "ring-2 ring-primary ring-offset-2" : ""
            }`}
            onClick={() => updateParams("status", "all")}
          >
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-sm text-muted-foreground">Всего</p>
            </CardContent>
          </Card>
          <Card
            className={`cursor-pointer transition-all hover:shadow-md ${
              statusFilter === "new" ? "ring-2 ring-yellow-500 ring-offset-2" : ""
            }`}
            onClick={() => updateParams("status", "new")}
          >
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-yellow-600">{stats.new}</div>
              <p className="text-sm text-muted-foreground">Новых</p>
            </CardContent>
          </Card>
          <Card
            className={`cursor-pointer transition-all hover:shadow-md ${
              statusFilter === "in_progress" ? "ring-2 ring-blue-500 ring-offset-2" : ""
            }`}
            onClick={() => updateParams("status", "in_progress")}
          >
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
              <p className="text-sm text-muted-foreground">В работе</p>
            </CardContent>
          </Card>
          <Card
            className={`cursor-pointer transition-all hover:shadow-md ${
              statusFilter === "resolved" ? "ring-2 ring-green-500 ring-offset-2" : ""
            }`}
            onClick={() => updateParams("status", "resolved")}
          >
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
              <p className="text-sm text-muted-foreground">Решено</p>
            </CardContent>
          </Card>
          <Card className="cursor-default">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-purple-600">
                {Object.values(stats.byType).reduce((a, b) => a + b, 0) - stats.total === 0
                  ? stats.byType.complaint ?? 0
                  : 0}
              </div>
              <p className="text-sm text-muted-foreground">Жалоб</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <Select value={statusFilter} onValueChange={(v) => updateParams("status", v)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Все статусы" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все статусы</SelectItem>
            <SelectItem value="new">Новые</SelectItem>
            <SelectItem value="in_progress">В работе</SelectItem>
            <SelectItem value="forwarded">Перенаправлено</SelectItem>
            <SelectItem value="resolved">Решено</SelectItem>
            <SelectItem value="closed">Закрыто</SelectItem>
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={(v) => updateParams("type", v)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Все типы" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все типы</SelectItem>
            <SelectItem value="complaint">Жалобы</SelectItem>
            <SelectItem value="suggestion">Пожелания</SelectItem>
            <SelectItem value="request">Заявки</SelectItem>
            <SelectItem value="question">Вопросы</SelectItem>
            <SelectItem value="other">Другое</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={(v) => updateParams("priority", v)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Все приоритеты" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все приоритеты</SelectItem>
            <SelectItem value="urgent">Срочный</SelectItem>
            <SelectItem value="high">Высокий</SelectItem>
            <SelectItem value="normal">Обычный</SelectItem>
            <SelectItem value="low">Низкий</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : data?.items && data.items.length > 0 ? (
        <div className="space-y-3">
          {data.items.map((item) => {
            const TypeIcon = TYPE_ICONS[item.type];

            return (
              <Card
                key={item.id}
                className="cursor-pointer hover:shadow-md transition-all"
                onClick={() => openViewDialog(item.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Type Icon */}
                    <div className={`p-2 rounded-full bg-muted ${TYPE_COLORS[item.type]}`}>
                      <TypeIcon className="h-5 w-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium">{TYPE_LABELS[item.type]}</span>
                        <Badge className={STATUS_COLORS[item.status]}>
                          {STATUS_LABELS[item.status]}
                        </Badge>
                        {item.priority !== "normal" && (
                          <Badge className={PRIORITY_COLORS[item.priority]}>
                            {PRIORITY_LABELS[item.priority]}
                          </Badge>
                        )}
                      </div>

                      {item.title && (
                        <p className="font-medium mt-1 truncate">{item.title}</p>
                      )}

                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {item.content}
                      </p>

                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        {item.contactName && (
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {item.contactName}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(item.createdAt).toLocaleDateString("ru-RU")}
                        </span>
                        {item.assignedTo && (
                          <span>
                            Ответственный: {item.assignedTo.name}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Status Icon */}
                    <div className="flex items-center">
                      {item.status === "resolved" && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                      {item.status === "closed" && (
                        <XCircle className="h-5 w-5 text-gray-500" />
                      )}
                      {(item.status === "new" || item.status === "in_progress") && (
                        <Button variant="outline" size="sm">
                          Открыть
                        </Button>
                      )}
                    </div>
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
            Обращений не найдено
          </CardContent>
        </Card>
      )}

      {/* View Dialog */}
      <ViewDialog
        feedbackId={selectedId}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
