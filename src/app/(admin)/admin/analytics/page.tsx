"use client";

import { useState } from "react";
import {
  BarChart3,
  Eye,
  Globe,
  Monitor,
  MousePointerClick,
  RefreshCw,
  Smartphone,
  Tablet,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Skeleton } from "~/components/ui/skeleton";
import { AdminPageHeader } from "~/components/admin/admin-page-header";
import { api } from "~/trpc/react";

type Period = "today" | "week" | "month" | "year";

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState<Period>("week");

  // Fetch dashboard data
  const { data: dashboardData, isLoading: dashboardLoading, refetch: refetchDashboard } =
    api.analytics.dashboard.useQuery({ period });

  // Fetch top pages
  const { data: topPagesData, isLoading: topPagesLoading, refetch: refetchTopPages } =
    api.analytics.topPages.useQuery({
      period: period === "year" ? "month" : period,
      limit: 10
    });

  // Fetch device stats
  const { data: deviceData, isLoading: deviceLoading, refetch: refetchDevices } =
    api.analytics.deviceStats.useQuery({
      period: period === "year" ? "month" : period
    });

  // Fetch browser stats
  const { data: browserData, isLoading: browserLoading, refetch: refetchBrowsers } =
    api.analytics.browserStats.useQuery({
      period: period === "year" ? "month" : period
    });

  // Fetch conversion events
  const { data: conversionData, isLoading: conversionLoading, refetch: refetchConversions } =
    api.analytics.conversionEvents.useQuery({
      period: period === "year" ? "month" : period,
      limit: 10
    });

  // Fetch referrer stats
  const { data: referrerData, isLoading: referrerLoading, refetch: refetchReferrers } =
    api.analytics.referrerStats.useQuery({
      period: period === "year" ? "month" : period,
      limit: 10
    });

  const handleRefresh = () => {
    void refetchDashboard();
    void refetchTopPages();
    void refetchDevices();
    void refetchBrowsers();
    void refetchConversions();
    void refetchReferrers();
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case "desktop":
        return <Monitor className="h-4 w-4" />;
      case "mobile":
        return <Smartphone className="h-4 w-4" />;
      case "tablet":
        return <Tablet className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  const getDeviceLabel = (deviceType: string) => {
    switch (deviceType) {
      case "desktop":
        return "Компьютер";
      case "mobile":
        return "Мобильный";
      case "tablet":
        return "Планшет";
      default:
        return "Неизвестно";
    }
  };

  const periodLabels: Record<Period, string> = {
    today: "Сегодня",
    week: "Неделя",
    month: "Месяц",
    year: "Год",
  };

  // Accusative case for "За ..." construction
  const periodAccusative: Record<Period, string> = {
    today: "сегодня",
    week: "неделю",
    month: "месяц",
    year: "год",
  };

  // Calculate device percentages
  const totalDevices = deviceData?.reduce((sum, d) => sum + d.count, 0) ?? 0;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Аналитика"
        description="Статистика посещений и действий пользователей"
      />

      {/* Controls */}
      <div className="flex items-center gap-4 flex-wrap">
        <Select value={period} onValueChange={(v) => setPeriod(v as Period)}>
          <SelectTrigger className="w-[160px]">
            <BarChart3 className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Период" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Сегодня</SelectItem>
            <SelectItem value="week">Неделя</SelectItem>
            <SelectItem value="month">Месяц</SelectItem>
            <SelectItem value="year">Год</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="icon" onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Сессии</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {dashboardLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">
                {dashboardData?.sessions.toLocaleString("ru-RU")}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              За {periodAccusative[period]}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Просмотры</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {dashboardLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">
                {dashboardData?.pageViews.toLocaleString("ru-RU")}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Просмотров страниц
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Действия</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {dashboardLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">
                {dashboardData?.actions.toLocaleString("ru-RU")}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Взаимодействий
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Конверсии</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {dashboardLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">
                {dashboardData?.conversions.toLocaleString("ru-RU")}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Целевых действий
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Уникальные пользователи</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {dashboardLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">
                {dashboardData?.uniqueUsers.toLocaleString("ru-RU")}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Авторизованных пользователей
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего событий</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {dashboardLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">
                {dashboardData?.events.toLocaleString("ru-RU")}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Отслеженных событий
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Популярные страницы</CardTitle>
            <CardDescription>Топ страниц по просмотрам</CardDescription>
          </CardHeader>
          <CardContent>
            {topPagesLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                ))}
              </div>
            ) : topPagesData?.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Нет данных за выбранный период
              </p>
            ) : (
              <div className="space-y-3">
                {topPagesData?.map((page, index) => (
                  <div key={page.pagePath} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground w-6">
                      {index + 1}.
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" title={page.pagePath}>
                        {page.pagePath}
                      </p>
                    </div>
                    <span className="text-sm font-semibold tabular-nums">
                      {page.views.toLocaleString("ru-RU")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Device Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Устройства</CardTitle>
            <CardDescription>Распределение по типам устройств</CardDescription>
          </CardHeader>
          <CardContent>
            {deviceLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>
            ) : deviceData?.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Нет данных за выбранный период
              </p>
            ) : (
              <div className="space-y-4">
                {deviceData?.map((device) => {
                  const percentage = totalDevices > 0
                    ? Math.round((device.count / totalDevices) * 100)
                    : 0;
                  return (
                    <div key={device.deviceType} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getDeviceIcon(device.deviceType)}
                          <span className="text-sm font-medium">
                            {getDeviceLabel(device.deviceType)}
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {device.count.toLocaleString("ru-RU")} ({percentage}%)
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Browser and Referrer Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Browser Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Браузеры</CardTitle>
            <CardDescription>Распределение по браузерам</CardDescription>
          </CardHeader>
          <CardContent>
            {browserLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                ))}
              </div>
            ) : browserData?.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Нет данных за выбранный период
              </p>
            ) : (
              <div className="space-y-3">
                {browserData?.map((browser, index) => (
                  <div key={browser.browser ?? "unknown"} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground w-6">
                      {index + 1}.
                    </span>
                    <span className="flex-1 text-sm font-medium">
                      {browser.browser ?? "Неизвестно"}
                    </span>
                    <span className="text-sm font-semibold tabular-nums">
                      {browser.count.toLocaleString("ru-RU")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Referrer Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Источники трафика</CardTitle>
            <CardDescription>Откуда приходят посетители</CardDescription>
          </CardHeader>
          <CardContent>
            {referrerLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                ))}
              </div>
            ) : referrerData?.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Нет данных за выбранный период
              </p>
            ) : (
              <div className="space-y-3">
                {referrerData?.map((ref, index) => (
                  <div key={ref.referrer ?? "direct"} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground w-6">
                      {index + 1}.
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" title={ref.referrer ?? "Прямой переход"}>
                        {ref.referrer ?? "Прямой переход"}
                      </p>
                    </div>
                    <span className="text-sm font-semibold tabular-nums">
                      {ref.count.toLocaleString("ru-RU")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Conversions */}
      <Card>
        <CardHeader>
          <CardTitle>Конверсии</CardTitle>
          <CardDescription>Целевые действия пользователей</CardDescription>
        </CardHeader>
        <CardContent>
          {conversionLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-12" />
                </div>
              ))}
            </div>
          ) : conversionData?.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Нет конверсий за выбранный период
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {conversionData?.map((conversion) => (
                <div
                  key={conversion.eventName}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{conversion.eventName}</span>
                  </div>
                  <span className="text-lg font-bold tabular-nums">
                    {conversion.count.toLocaleString("ru-RU")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
