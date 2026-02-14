"use client";

import { useState } from "react";

import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Edit,
  FileText,
  Loader2,
  MessageSquare,
  Plus,
  Trash2,
  XCircle,
} from "lucide-react";
import Link from "next/link";

import { PageHeader } from "~/components/page-header";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { getPublicationTypeLabel } from "~/lib/constants/publication-types";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

const STATUS_CONFIG = {
  draft: {
    label: "Черновик",
    color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    icon: FileText,
  },
  pending: {
    label: "На модерации",
    color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    icon: Clock,
  },
  published: {
    label: "Опубликовано",
    color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    icon: CheckCircle2,
  },
  rejected: {
    label: "Отклонено",
    color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    icon: XCircle,
  },
  archived: {
    label: "В архиве",
    color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
    icon: FileText,
  },
} as const;

export default function PublicationsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: canPublish, isLoading: checkingAccess } = api.publications.canPublish.useQuery();
  const { data: publicationsData, isLoading } = api.publications.my.useQuery({
    status:
      statusFilter === "all"
        ? undefined
        : (statusFilter as "draft" | "pending" | "published" | "rejected" | "archived"),
    limit: 50,
  });

  if (checkingAccess) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!canPublish) {
    return (
      <div className="space-y-8">
        <PageHeader title="Публикации" description="Создавайте контент для соседей" />

        <Card className="border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              <div className="space-y-2">
                <p className="font-medium text-amber-900 dark:text-amber-100">Раздел недоступен</p>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Для создания публикаций необходимо иметь подтверждённую собственность (квартиру
                  или машиноместо). После подтверждения заявки на собственность вы сможете создавать
                  объявления для соседей.
                </p>
                <div className="pt-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href="/my/property">Перейти к недвижимости</Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const publications = publicationsData?.items ?? [];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <PageHeader title="Публикации" description="Создавайте контент для соседей" />
        <Button asChild>
          <Link href="/my/publications/new">
            <Plus className="mr-2 h-4 w-4" />
            Создать
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Все статусы" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все статусы</SelectItem>
            <SelectItem value="draft">Черновики</SelectItem>
            <SelectItem value="pending">На модерации</SelectItem>
            <SelectItem value="published">Опубликованные</SelectItem>
            <SelectItem value="rejected">Отклонённые</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Publications List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
        </div>
      ) : publications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MessageSquare className="text-muted-foreground/50 mx-auto h-12 w-12" />
            <h3 className="mt-4 text-lg font-medium">Нет публикаций</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              {statusFilter === "all"
                ? "Вы ещё не создали ни одной публикации"
                : "Публикации с таким статусом не найдены"}
            </p>
            <Button asChild className="mt-4">
              <Link href="/my/publications/new">Создать публикацию</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {publications.map((pub) => {
            const statusConfig = STATUS_CONFIG[pub.status];
            const StatusIcon = statusConfig.icon;

            return (
              <Card key={pub.id} className="group relative overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {getPublicationTypeLabel(pub.type)}
                        </Badge>
                        <Badge className={cn("text-xs", statusConfig.color)}>
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {statusConfig.label}
                        </Badge>
                        {pub.isUrgent && (
                          <Badge variant="destructive" className="text-xs">
                            Срочно
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="line-clamp-1 text-lg">{pub.title}</CardTitle>
                      <CardDescription className="flex items-center gap-3 text-xs">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(pub.createdAt).toLocaleDateString("ru-RU", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        {pub.building && <span>Строение {pub.building.number}</span>}
                      </CardDescription>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                      {(pub.status === "draft" || pub.status === "rejected") && (
                        <Button asChild variant="ghost" size="icon">
                          <Link href={`/my/publications/${pub.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>

                {pub.status === "rejected" && pub.moderationComment && (
                  <CardContent className="pt-0">
                    <div className="rounded-lg bg-red-50 p-3 text-sm dark:bg-red-950/20">
                      <p className="font-medium text-red-800 dark:text-red-200">
                        Причина отклонения:
                      </p>
                      <p className="mt-1 text-red-700 dark:text-red-300">{pub.moderationComment}</p>
                    </div>
                  </CardContent>
                )}

                {/* Tags */}
                {pub.publicationTags && pub.publicationTags.length > 0 && (
                  <CardContent className="pb-4 pt-0">
                    <div className="flex flex-wrap gap-1">
                      {pub.publicationTags.map((pt) => (
                        <Badge key={pt.tag.id} variant="secondary" className="text-xs">
                          {pt.tag.name}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
