"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, LayoutDashboard } from "lucide-react";

import { cn } from "~/lib/utils";

// Маппинг путей к названиям для хлебных крошек
const PATH_LABELS: Record<string, string> = {
  admin: "Дашборд",
  users: "Пользователи",
  "deletion-requests": "Запросы на удаление",
  feedback: "Обратная связь",
  buildings: "Здания",
  claims: "Заявки на собственность",
  listings: "Объявления",
  news: "Новости",
  events: "Мероприятия",
  publications: "Публикации",
  howtos: "База знаний",
  directory: "Справочная",
  media: "Медиа",
  settings: "Настройки",
  logs: "Логи",
};

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  /** Custom label for the last breadcrumb segment (instead of UUID or path segment) */
  breadcrumbLabel?: string;
  children?: React.ReactNode;
  className?: string;
}

export function AdminPageHeader({
  title,
  description,
  breadcrumbLabel,
  children,
  className,
}: AdminPageHeaderProps) {
  const pathname = usePathname();

  // Генерируем хлебные крошки из пути
  const pathSegments = pathname.split("/").filter(Boolean);
  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/");
    const isLast = index === pathSegments.length - 1;
    const isFirst = index === 0;
    // Use custom breadcrumbLabel for last segment if provided
    const label = isLast && breadcrumbLabel ? breadcrumbLabel : (PATH_LABELS[segment] ?? segment);

    return { segment, href, label, isLast, isFirst };
  });

  return (
    <div className={cn("space-y-1", className)}>
      {/* Хлебные крошки */}
      <nav className="flex items-center text-sm text-muted-foreground">
        {breadcrumbs.map((crumb, index) => (
          <span key={crumb.href} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="mx-1.5 h-3.5 w-3.5 shrink-0" />
            )}
            {crumb.isLast ? (
              <span className="font-medium text-foreground">{crumb.label}</span>
            ) : (
              <Link
                href={crumb.href}
                className="hover:text-foreground transition-colors"
              >
                {crumb.isFirst && (
                  <LayoutDashboard className="mr-1 inline h-3.5 w-3.5" />
                )}
                {crumb.label}
              </Link>
            )}
          </span>
        ))}
      </nav>

      {/* Заголовок и описание */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {children && <div className="flex items-center gap-2">{children}</div>}
      </div>
    </div>
  );
}
