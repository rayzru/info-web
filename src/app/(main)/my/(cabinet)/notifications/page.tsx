"use client";

import { useState } from "react";
import {
  Bell,
  BellOff,
  Check,
  CheckCheck,
  FileText,
  MessageSquare,
  Settings,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { cn } from "~/lib/utils";

const NOTIFICATION_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  claim_submitted: FileText,
  claim_approved: Check,
  claim_rejected: FileText,
  claim_cancelled: FileText,
  claim_documents: FileText,
  tenant_claim: FileText,
  property_revoked: FileText,
  message: MessageSquare,
  system: Settings,
  admin: Bell,
};

const CATEGORY_LABELS: Record<string, string> = {
  claims: "Заявки",
  messages: "Сообщения",
  system: "Системные",
};

function formatRelativeTime(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "только что";
  if (diffMins < 60) return `${diffMins} мин. назад`;
  if (diffHours < 24) return `${diffHours} ч. назад`;
  if (diffDays < 7) return `${diffDays} дн. назад`;

  return d.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
  });
}

export default function NotificationsPage() {
  const utils = api.useUtils();
  const [activeTab, setActiveTab] = useState<string>("all");

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    api.notifications.list.useInfiniteQuery(
      {
        limit: 20,
        category: activeTab === "all" ? undefined : (activeTab as "claims" | "messages" | "system"),
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  const { data: unreadCount } = api.notifications.unreadCount.useQuery();

  const markAsReadMutation = api.notifications.markAsRead.useMutation({
    onSuccess: () => {
      utils.notifications.list.invalidate();
      utils.notifications.unreadCount.invalidate();
    },
  });

  const markAllAsReadMutation = api.notifications.markAllAsRead.useMutation({
    onSuccess: () => {
      utils.notifications.list.invalidate();
      utils.notifications.unreadCount.invalidate();
      toast.success("Все уведомления отмечены как прочитанные");
    },
  });

  const deleteMutation = api.notifications.delete.useMutation({
    onSuccess: () => {
      utils.notifications.list.invalidate();
      utils.notifications.unreadCount.invalidate();
      toast.success("Уведомление удалено");
    },
  });

  const deleteAllReadMutation = api.notifications.deleteAllRead.useMutation({
    onSuccess: () => {
      utils.notifications.list.invalidate();
      toast.success("Прочитанные уведомления удалены");
    },
  });

  const allNotifications = data?.pages.flatMap((page) => page.items) ?? [];

  const handleNotificationClick = (notification: (typeof allNotifications)[0]) => {
    if (!notification.isRead) {
      markAsReadMutation.mutate({ id: notification.id });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Уведомления</h1>
          <p className="text-muted-foreground mt-1">
            {unreadCount && unreadCount > 0
              ? `${unreadCount} непрочитанных`
              : "Нет непрочитанных уведомлений"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount && unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => markAllAsReadMutation.mutate()}
              disabled={markAllAsReadMutation.isPending}
            >
              <CheckCheck className="h-4 w-4 mr-2" />
              Прочитать все
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => deleteAllReadMutation.mutate()}
            disabled={deleteAllReadMutation.isPending}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Очистить прочитанные
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Все</TabsTrigger>
          <TabsTrigger value="claims">Заявки</TabsTrigger>
          <TabsTrigger value="messages">Сообщения</TabsTrigger>
          <TabsTrigger value="system">Системные</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Загрузка...
            </div>
          ) : allNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <BellOff className="h-12 w-12 mb-4 opacity-20" />
              <p>Нет уведомлений</p>
            </div>
          ) : (
            <ScrollArea className="h-[600px]">
              <div className="space-y-2 pr-4">
                {allNotifications.map((notification) => {
                  const Icon = NOTIFICATION_ICONS[notification.type] ?? Bell;

                  const content = (
                    <div
                      className={cn(
                        "flex gap-4 p-4 rounded-lg transition-colors cursor-pointer group",
                        notification.isRead
                          ? "bg-muted/30 hover:bg-muted/50"
                          : "bg-primary/5 hover:bg-primary/10 border-l-2 border-primary"
                      )}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div
                        className={cn(
                          "shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
                          notification.isRead
                            ? "bg-muted"
                            : "bg-primary/10 text-primary"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p
                              className={cn(
                                "text-sm",
                                !notification.isRead && "font-medium"
                              )}
                            >
                              {notification.title}
                            </p>
                            {notification.message && (
                              <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                                {notification.message}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs text-muted-foreground">
                              {formatRelativeTime(notification.createdAt)}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteMutation.mutate({ id: notification.id });
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        {notification.fromUser && (
                          <p className="text-xs text-muted-foreground mt-1">
                            от {notification.fromUser.name}
                          </p>
                        )}

                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                            {CATEGORY_LABELS[notification.category]}
                          </span>
                        </div>
                      </div>
                    </div>
                  );

                  if (notification.actionUrl) {
                    return (
                      <Link
                        key={notification.id}
                        href={notification.actionUrl}
                        className="block"
                      >
                        {content}
                      </Link>
                    );
                  }

                  return <div key={notification.id}>{content}</div>;
                })}

                {hasNextPage && (
                  <div className="flex justify-center pt-4">
                    <Button
                      variant="outline"
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                    >
                      {isFetchingNextPage ? "Загрузка..." : "Загрузить еще"}
                    </Button>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
