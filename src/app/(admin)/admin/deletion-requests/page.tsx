"use client";

import { useState } from "react";

import {
  AlertTriangle,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Loader2,
  Trash2,
  X,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { AdminPageHeader } from "~/components/admin/admin-page-header";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
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
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
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

const STATUS_LABELS: Record<string, string> = {
  pending: "Ожидает",
  approved: "Одобрена",
  rejected: "Отклонена",
  completed: "Выполнена",
};

const STATUS_COLORS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "secondary",
  approved: "default",
  rejected: "destructive",
  completed: "outline",
};

const REJECTION_TEMPLATES = [
  {
    value: "rejected_active_properties",
    label: "У пользователя есть активные объекты недвижимости",
  },
  { value: "rejected_active_listings", label: "У пользователя есть активные объявления" },
  { value: "rejected_pending_claims", label: "У пользователя есть нерассмотренные заявки" },
  { value: "rejected_custom", label: "Другая причина (указать)" },
];

type ReviewDialogProps = {
  request: {
    id: string;
    userId: string;
    reason: string | null;
    user: {
      id: string;
      name: string | null;
      email: string;
      image: string | null;
    };
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
};

function ReviewDialog({ request, open, onOpenChange, onSuccess }: ReviewDialogProps) {
  const { toast } = useToast();
  const [action, setAction] = useState<"approve" | "reject">("approve");
  const [template, setTemplate] = useState<string>("");
  const [customText, setCustomText] = useState("");

  const approveMutation = api.admin.deletionRequests.approve.useMutation({
    onSuccess: () => {
      toast({
        title: "Заявка одобрена",
        description: "Теперь можно выполнить удаление аккаунта",
      });
      onOpenChange(false);
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const rejectMutation = api.admin.deletionRequests.reject.useMutation({
    onSuccess: () => {
      toast({
        title: "Заявка отклонена",
        description: "Пользователь получит уведомление",
      });
      onOpenChange(false);
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (action === "approve") {
      approveMutation.mutate({
        requestId: request.id,
        adminNotes: customText || undefined,
      });
    } else {
      if (!template) {
        toast({
          title: "Выберите причину отклонения",
          variant: "destructive",
        });
        return;
      }

      if (template === "rejected_custom" && !customText.trim()) {
        toast({
          title: "Укажите причину отклонения",
          variant: "destructive",
        });
        return;
      }

      const rejectionReason =
        template === "rejected_custom"
          ? customText
          : (REJECTION_TEMPLATES.find((t) => t.value === template)?.label ?? "");

      rejectMutation.mutate({
        requestId: request.id,
        adminNotes: rejectionReason,
      });
    }
  };

  const isPending = approveMutation.isPending || rejectMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Рассмотрение заявки на удаление</DialogTitle>
          <DialogDescription>
            Пользователь: {request.user.name ?? request.user.email}
          </DialogDescription>
        </DialogHeader>

        {request.reason && (
          <div className="bg-muted rounded-lg p-3">
            <p className="mb-1 text-sm font-medium">Причина от пользователя:</p>
            <p className="text-muted-foreground text-sm">{request.reason}</p>
          </div>
        )}

        <div className="space-y-6 py-4">
          {/* Action Selection */}
          <div className="space-y-3">
            <Label>Решение</Label>
            <div className="flex gap-3">
              <Button
                type="button"
                variant={action === "approve" ? "default" : "outline"}
                className="flex-1"
                onClick={() => {
                  setAction("approve");
                  setTemplate("");
                }}
              >
                <Check className="mr-2 h-4 w-4" />
                Одобрить
              </Button>
              <Button
                type="button"
                variant={action === "reject" ? "destructive" : "outline"}
                className="flex-1"
                onClick={() => {
                  setAction("reject");
                  setTemplate("");
                }}
              >
                <X className="mr-2 h-4 w-4" />
                Отклонить
              </Button>
            </div>
          </div>

          {/* Rejection Template Selection */}
          {action === "reject" && (
            <div className="space-y-3">
              <Label>Причина отклонения</Label>
              <RadioGroup value={template} onValueChange={setTemplate}>
                {REJECTION_TEMPLATES.map((t) => (
                  <div key={t.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={t.value} id={t.value} />
                    <Label htmlFor={t.value} className="cursor-pointer font-normal">
                      {t.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Custom Text / Notes */}
          {(action === "approve" || template === "rejected_custom") && (
            <div className="space-y-2">
              <Label>
                {action === "approve" ? "Примечание (необязательно)" : "Причина отклонения"}
              </Label>
              <Textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder={
                  action === "approve"
                    ? "Дополнительные заметки для протокола..."
                    : "Укажите причину отклонения..."
                }
                rows={3}
              />
            </div>
          )}

          {action === "approve" && (
            <div className="flex items-start gap-2 rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-950/30">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-yellow-600" />
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                После одобрения заявки, вам нужно будет отдельно подтвердить выполнение удаления.
                Это безвозвратно удалит персональные данные пользователя.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending}
            variant={action === "reject" ? "destructive" : "default"}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {action === "approve" ? "Одобрить" : "Отклонить"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type ExecuteDialogProps = {
  request: {
    id: string;
    userId: string;
    user: {
      id: string;
      name: string | null;
      email: string;
      image: string | null;
    };
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
};

function ExecuteDialog({ request, open, onOpenChange, onSuccess }: ExecuteDialogProps) {
  const { toast } = useToast();

  const executeMutation = api.admin.deletionRequests.execute.useMutation({
    onSuccess: () => {
      toast({
        title: "Аккаунт удалён",
        description: "Персональные данные пользователя удалены",
      });
      onOpenChange(false);
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleExecute = () => {
    executeMutation.mutate({ requestId: request.id });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-destructive flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Подтверждение удаления
          </DialogTitle>
          <DialogDescription>Это действие необратимо</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-muted flex items-center gap-3 rounded-lg p-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={request.user.image ?? undefined} />
              <AvatarFallback>
                {request.user.name?.slice(0, 2).toUpperCase() ?? "??"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{request.user.name ?? "Без имени"}</p>
              <p className="text-muted-foreground text-sm">{request.user.email}</p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <p className="font-medium">Будут выполнены следующие действия:</p>
            <ul className="text-muted-foreground list-inside list-disc space-y-1">
              <li>Удаление персональных данных профиля</li>
              <li>Отвязка всех OAuth аккаунтов</li>
              <li>Завершение всех сессий</li>
              <li>Снятие всех ролей</li>
              <li>Отзыв прав на недвижимость</li>
              <li>Архивирование объявлений</li>
              <li>Пометка аккаунта как удалённого</li>
            </ul>
          </div>

          <div className="bg-destructive/10 border-destructive/20 flex items-start gap-2 rounded-lg border p-3">
            <AlertTriangle className="text-destructive mt-0.5 h-5 w-5 shrink-0" />
            <p className="text-destructive text-sm">
              Пользователь не сможет восстановить доступ к аккаунту. Данное действие нельзя
              отменить.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button
            variant="destructive"
            onClick={handleExecute}
            disabled={executeMutation.isPending}
          >
            {executeMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Удалить аккаунт
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminDeletionRequestsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const statusFilter = searchParams.get("status") ?? "all";

  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [executeDialogOpen, setExecuteDialogOpen] = useState(false);

  const {
    data: requests,
    isLoading,
    refetch,
  } = api.admin.deletionRequests.list.useQuery({
    status: statusFilter !== "all" ? (statusFilter as any) : undefined,
  });

  const { data: counts, refetch: refetchCounts } = api.admin.deletionRequests.counts.useQuery();

  const setFilter = (status: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (status === "all") {
      params.delete("status");
    } else {
      params.set("status", status);
    }
    router.push(`/admin/deletion-requests?${params.toString()}`);
  };

  const handleSuccess = () => {
    void refetch();
    void refetchCounts();
  };

  const openReviewDialog = (request: any) => {
    setSelectedRequest(request);
    setReviewDialogOpen(true);
  };

  const openExecuteDialog = (request: any) => {
    setSelectedRequest(request);
    setExecuteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Заявки на удаление аккаунтов"
        description="Рассмотрение запросов пользователей на удаление персональных данных"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${
            statusFilter === "pending" ? "ring-2 ring-yellow-500 ring-offset-2" : ""
          }`}
          onClick={() => setFilter("pending")}
        >
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div className="text-2xl font-bold text-yellow-600">{counts?.pending ?? 0}</div>
            </div>
            <p className="text-muted-foreground text-sm">Ожидают</p>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${
            statusFilter === "approved" ? "ring-2 ring-green-500 ring-offset-2" : ""
          }`}
          onClick={() => setFilter("approved")}
        >
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600" />
              <div className="text-2xl font-bold text-green-600">{counts?.approved ?? 0}</div>
            </div>
            <p className="text-muted-foreground text-sm">К выполнению</p>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${
            statusFilter === "rejected" ? "ring-2 ring-red-500 ring-offset-2" : ""
          }`}
          onClick={() => setFilter("rejected")}
        >
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <X className="h-5 w-5 text-red-600" />
              <div className="text-2xl font-bold text-red-600">{counts?.rejected ?? 0}</div>
            </div>
            <p className="text-muted-foreground text-sm">Отклонено</p>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${
            statusFilter === "completed" ? "ring-primary ring-2 ring-offset-2" : ""
          }`}
          onClick={() => setFilter("completed")}
        >
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Trash2 className="text-muted-foreground h-5 w-5" />
              <div className="text-2xl font-bold">{counts?.completed ?? 0}</div>
            </div>
            <p className="text-muted-foreground text-sm">Выполнено</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-4">
        <Select value={statusFilter} onValueChange={setFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Все статусы" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все статусы</SelectItem>
            <SelectItem value="pending">Ожидают рассмотрения</SelectItem>
            <SelectItem value="approved">Одобрены (к выполнению)</SelectItem>
            <SelectItem value="rejected">Отклонены</SelectItem>
            <SelectItem value="completed">Выполнены</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Requests List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : requests && requests.length > 0 ? (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* User Avatar */}
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={request.user?.image ?? undefined} />
                    <AvatarFallback>
                      {request.user?.name?.slice(0, 2).toUpperCase() ?? "??"}
                    </AvatarFallback>
                  </Avatar>

                  {/* Request Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">
                        {request.user?.name ?? request.user?.email}
                      </span>
                      <Badge variant={STATUS_COLORS[request.status]}>
                        {STATUS_LABELS[request.status]}
                      </Badge>
                    </div>

                    <div className="text-muted-foreground mt-1 flex items-center gap-4 text-xs">
                      <span>{request.user?.email}</span>
                      <span>·</span>
                      <span>
                        {new Date(request.createdAt).toLocaleDateString("ru-RU", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    {request.reason && (
                      <p className="bg-muted mt-2 rounded p-2 text-sm">{request.reason}</p>
                    )}

                    {request.adminNotes && (
                      <p className="text-muted-foreground mt-2 text-sm italic">
                        Решение: {request.adminNotes}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {request.status === "pending" && (
                      <Button variant="outline" size="sm" onClick={() => openReviewDialog(request)}>
                        Рассмотреть
                      </Button>
                    )}
                    {request.status === "approved" && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => openExecuteDialog(request)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Выполнить
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-muted-foreground py-12 text-center">
            {statusFilter === "pending"
              ? "Нет заявок на рассмотрение"
              : statusFilter === "approved"
                ? "Нет одобренных заявок к выполнению"
                : "Заявок не найдено"}
          </CardContent>
        </Card>
      )}

      {/* Review Dialog */}
      {selectedRequest && (
        <ReviewDialog
          request={selectedRequest}
          open={reviewDialogOpen}
          onOpenChange={setReviewDialogOpen}
          onSuccess={handleSuccess}
        />
      )}

      {/* Execute Dialog */}
      {selectedRequest && (
        <ExecuteDialog
          request={selectedRequest}
          open={executeDialogOpen}
          onOpenChange={setExecuteDialogOpen}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
