"use client";

import Link from "next/link";
import {
  ClipboardList,
  FileText,
  Loader2,
  Megaphone,
  MessageSquare,
  Newspaper,
  Shield,
  UserX,
  Users,
} from "lucide-react";

import { AdminPageHeader } from "~/components/admin/admin-page-header";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

// Widget configuration with icons and routes
const WIDGET_CONFIG = {
  users: {
    title: "Пользователи",
    icon: Users,
    href: "/admin/users",
    pendingLabel: "Запросов на удаление",
    color: "text-blue-600",
    bgColor: "bg-blue-500/10",
  },
  claims: {
    title: "Заявки",
    icon: ClipboardList,
    href: "/admin/claims",
    pendingLabel: "На модерации",
    color: "text-amber-600",
    bgColor: "bg-amber-500/10",
  },
  listings: {
    title: "Объявления",
    icon: Megaphone,
    href: "/admin/listings",
    pendingLabel: "На модерации",
    color: "text-orange-600",
    bgColor: "bg-orange-500/10",
  },
  publications: {
    title: "Публикации",
    icon: FileText,
    href: "/admin/publications",
    pendingLabel: "На модерации",
    color: "text-green-600",
    bgColor: "bg-green-500/10",
  },
  news: {
    title: "Новости",
    icon: Newspaper,
    href: "/admin/news",
    pendingLabel: "Черновиков",
    color: "text-red-600",
    bgColor: "bg-red-500/10",
  },
  feedback: {
    title: "Обратная связь",
    icon: MessageSquare,
    href: "/admin/feedback",
    pendingLabel: "Новых",
    color: "text-purple-600",
    bgColor: "bg-purple-500/10",
  },
  deletionRequests: {
    title: "Удаление",
    icon: UserX,
    href: "/admin/deletion-requests",
    pendingLabel: "Ожидают",
    color: "text-rose-600",
    bgColor: "bg-rose-500/10",
  },
} as const;

type WidgetKey = keyof typeof WIDGET_CONFIG;

interface StatWidgetProps {
  widgetKey: WidgetKey;
  pending: number;
  todayNew: number;
}

function StatWidget({ widgetKey, pending, todayNew }: StatWidgetProps) {
  const config = WIDGET_CONFIG[widgetKey];
  const Icon = config.icon;

  return (
    <Link href={config.href}>
      <Card className="transition-colors hover:bg-accent/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{config.title}</CardTitle>
          <div className={cn("rounded-md p-2", config.bgColor)}>
            <Icon className={cn("h-4 w-4", config.color)} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-2xl font-bold">{pending}</div>
              <p className="text-xs text-muted-foreground">
                {config.pendingLabel}
              </p>
            </div>
            {todayNew > 0 && (
              <div className="text-right">
                <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-600">
                  +{todayNew} сегодня
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function AdminPage() {
  const { data: stats, isLoading } = api.admin.dashboardStats.useQuery();

  // Get available widgets based on what stats are returned
  const availableWidgets = stats
    ? (Object.keys(stats) as WidgetKey[]).filter(
        (key) => key in WIDGET_CONFIG && stats[key]
      )
    : [];

  return (
    <div className="space-y-6">
      {/* Stats Widgets */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : availableWidgets.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {availableWidgets.map((key) => {
            const data = stats![key];
            if (!data) return null;

            return (
              <StatWidget
                key={key}
                widgetKey={key}
                pending={data.pending}
                todayNew={data.todayNew}
              />
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Shield className="mx-auto h-12 w-12 text-muted-foreground/30" />
              <h3 className="mt-4 text-lg font-medium">
                Добро пожаловать в админ-панель
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Используйте меню для навигации по разделам
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
