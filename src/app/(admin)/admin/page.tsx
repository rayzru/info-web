"use client";

import { useState } from "react";

import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Building2,
  ClipboardList,
  Eye,
  FileText,
  Image as ImageIcon,
  Loader2,
  Megaphone,
  MessageSquare,
  Newspaper,
  Users as UsersIcon,
  UserX,
} from "lucide-react";
import Link from "next/link";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

// All action items configuration (only items that require action)
const ACTION_ITEMS = [
  {
    key: "deletionRequests",
    title: "Запросы на удаление",
    icon: UserX,
    href: "/admin/deletion-requests",
    color: "text-rose-600",
    bgColor: "bg-rose-500/10",
  },
  {
    key: "claims",
    title: "Заявки на рассмотрении",
    icon: ClipboardList,
    href: "/admin/claims",
    color: "text-amber-600",
    bgColor: "bg-amber-500/10",
  },
  {
    key: "listings",
    title: "Объявления на модерации",
    icon: Megaphone,
    href: "/admin/listings",
    color: "text-orange-600",
    bgColor: "bg-orange-500/10",
  },
  {
    key: "publications",
    title: "Публикации на модерации",
    icon: FileText,
    href: "/admin/publications",
    color: "text-green-600",
    bgColor: "bg-green-500/10",
  },
  {
    key: "feedback",
    title: "Новые сообщения",
    icon: MessageSquare,
    href: "/admin/feedback",
    color: "text-purple-600",
    bgColor: "bg-purple-500/10",
  },
  {
    key: "news",
    title: "Черновики новостей",
    icon: Newspaper,
    href: "/admin/news",
    color: "text-red-600",
    bgColor: "bg-red-500/10",
  },
] as const;

// Quick links to sections (for navigation, no counts)
const QUICK_LINKS = [
  { key: "users", title: "Пользователи", icon: UsersIcon, href: "/admin/users" },
  { key: "buildings", title: "Здания", icon: Building2, href: "/admin/buildings" },
  { key: "directory", title: "Справочная", icon: BookOpen, href: "/admin/directory" },
  { key: "howtos", title: "База знаний", icon: FileText, href: "/admin/howtos" },
  { key: "media", title: "Медиа", icon: ImageIcon, href: "/admin/media" },
] as const;

type ChartPeriod = "today" | "week" | "month";

export default function AdminPage() {
  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>("week");

  const { data: dashboardStats, isLoading: isLoadingDashboard } =
    api.admin.dashboardStats.useQuery();
  const { data: navCounts, isLoading: isLoadingNav } = api.admin.navCounts.useQuery();
  const { data: analyticsData, isLoading: isLoadingAnalytics } = api.analytics.dashboard.useQuery({
    period: chartPeriod,
  });
  const { data: visitsData, isLoading: isLoadingVisits } = api.analytics.visitsTimeSeries.useQuery({
    period: chartPeriod,
  });

  const isLoading = isLoadingDashboard || isLoadingNav;

  // Get pending count for an action item
  const getPendingCount = (key: string): number => {
    const dashboardData = dashboardStats?.[key as keyof typeof dashboardStats];
    if (dashboardData) return dashboardData.pending;
    const navCount = navCounts?.[key];
    return navCount ?? 0;
  };

  // Get today's new count for an action item
  const getTodayNew = (key: string): number => {
    const dashboardData = dashboardStats?.[key as keyof typeof dashboardStats];
    return dashboardData?.todayNew ?? 0;
  };

  // Filter action items to only show those with pending > 0
  const activeActionItems = ACTION_ITEMS.filter((item) => getPendingCount(item.key) > 0);

  // Calculate total pending actions
  const totalPending = ACTION_ITEMS.reduce((sum, item) => sum + getPendingCount(item.key), 0);

  // Format period label for chart
  const formatPeriodLabel = (period: string) => {
    if (chartPeriod === "today") {
      return `${period}:00`;
    }
    const date = new Date(period);
    return date.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
  };

  const periodLabels: Record<ChartPeriod, string> = {
    today: "Сегодня",
    week: "Неделя",
    month: "Месяц",
  };

  return (
    <div className="space-y-6">
      {/* Hero Section: Action Summary + Analytics */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Action Summary Card */}
        <Card
          className={cn("lg:col-span-1", totalPending > 0 && "border-amber-500/50 bg-amber-500/5")}
        >
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              {totalPending > 0 && <AlertCircle className="h-4 w-4 text-amber-600" />}
              Требуют внимания
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-12 w-24" />
            ) : (
              <>
                <div className="text-4xl font-bold tabular-nums">{totalPending}</div>
                <p className="text-muted-foreground mt-1 text-sm">
                  {totalPending === 0
                    ? "Нет активных задач"
                    : `${activeActionItems.length} ${activeActionItems.length === 1 ? "категория" : "категорий"}`}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Analytics Summary */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Посещаемость</CardTitle>
            <Select value={chartPeriod} onValueChange={(v) => setChartPeriod(v as ChartPeriod)}>
              <SelectTrigger className="h-8 w-28 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Сегодня</SelectItem>
                <SelectItem value="week">Неделя</SelectItem>
                <SelectItem value="month">Месяц</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="flex gap-6">
              {/* Inline stats */}
              <div className="flex gap-6">
                <div>
                  {isLoadingAnalytics ? (
                    <Skeleton className="h-7 w-16" />
                  ) : (
                    <div className="text-2xl font-bold tabular-nums">
                      {analyticsData?.sessions.toLocaleString("ru-RU") ?? 0}
                    </div>
                  )}
                  <p className="text-muted-foreground text-xs">сессий</p>
                </div>
                <div>
                  {isLoadingAnalytics ? (
                    <Skeleton className="h-7 w-16" />
                  ) : (
                    <div className="text-2xl font-bold tabular-nums">
                      {analyticsData?.pageViews.toLocaleString("ru-RU") ?? 0}
                    </div>
                  )}
                  <p className="text-muted-foreground text-xs">просмотров</p>
                </div>
              </div>
              {/* Mini chart */}
              <div className="flex-1">
                {isLoadingVisits ? (
                  <div className="flex h-14 items-center justify-center">
                    <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
                  </div>
                ) : visitsData?.data.length === 0 ? (
                  <div className="text-muted-foreground flex h-14 items-center justify-center text-xs">
                    Нет данных
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={56} minHeight={56}>
                    <AreaChart data={visitsData?.data ?? []}>
                      <defs>
                        <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="sessions"
                        stroke="hsl(var(--primary))"
                        fill="url(#colorSessions)"
                        strokeWidth={1.5}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Items List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
        </div>
      ) : activeActionItems.length > 0 ? (
        <section>
          <h2 className="text-muted-foreground mb-3 text-sm font-medium">Активные задачи</h2>
          <div className="space-y-2">
            {activeActionItems.map((item) => {
              const Icon = item.icon;
              const count = getPendingCount(item.key);
              const todayNew = getTodayNew(item.key);

              return (
                <Link key={item.key} href={item.href}>
                  <div className="bg-card hover:bg-accent/50 group flex items-center justify-between rounded-lg border p-3 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={cn("rounded-md p-1.5", item.bgColor)}>
                        <Icon className={cn("h-4 w-4", item.color)} />
                      </div>
                      <span className="font-medium">{item.title}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {todayNew > 0 && (
                        <span className="text-xs text-emerald-600">+{todayNew} сегодня</span>
                      )}
                      <span className="bg-muted min-w-8 rounded-full px-2 py-0.5 text-center text-sm font-semibold tabular-nums">
                        {count}
                      </span>
                      <ArrowRight className="text-muted-foreground h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}

      {/* Quick Links */}
      <section>
        <h2 className="text-muted-foreground mb-3 text-sm font-medium">Разделы</h2>
        <div className="flex flex-wrap gap-2">
          {QUICK_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.key} href={link.href}>
                <div className="bg-card hover:bg-accent/50 flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors">
                  <Icon className="text-muted-foreground h-4 w-4" />
                  <span>{link.title}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
