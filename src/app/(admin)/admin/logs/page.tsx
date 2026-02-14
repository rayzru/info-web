"use client";

import { useState } from "react";

import { format } from "date-fns";
import { ru } from "date-fns/locale";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  Filter,
  Globe,
  MessageSquare,
  RefreshCw,
  ScrollText,
  Search,
  User,
} from "lucide-react";

import { AdminPageHeader } from "~/components/admin/admin-page-header";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Skeleton } from "~/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { api } from "~/trpc/react";

export default function AdminLogsPage() {
  const [page, setPage] = useState(1);
  const [entityType, setEntityType] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState("");
  const [feedbackPage, setFeedbackPage] = useState(1);
  const [publicationPage, setPublicationPage] = useState(1);

  // Fetch audit logs
  const {
    data: auditData,
    isLoading: auditLoading,
    refetch: refetchAudit,
  } = api.audit.list.useQuery({
    page,
    limit: 30,
    entityType: entityType as
      | "user"
      | "building"
      | "apartment"
      | "parking"
      | "user_role"
      | "user_block"
      | "deletion_request"
      | "property_claim"
      | "listing"
      | "news"
      | "publication"
      | "feedback"
      | "directory_category"
      | "directory_item"
      | "directory_tag"
      | "settings"
      | undefined,
    search: search || undefined,
  });

  // Fetch feedback history
  const {
    data: feedbackData,
    isLoading: feedbackLoading,
    refetch: refetchFeedback,
  } = api.audit.feedbackHistory.useQuery({
    page: feedbackPage,
    limit: 30,
  });

  // Fetch publication history
  const {
    data: publicationData,
    isLoading: publicationLoading,
    refetch: refetchPublication,
  } = api.audit.publicationHistory.useQuery({
    page: publicationPage,
    limit: 30,
  });

  // Fetch filter options
  const { data: filterOptions } = api.audit.filterOptions.useQuery();

  const handleRefresh = () => {
    void refetchAudit();
    void refetchFeedback();
    void refetchPublication();
  };

  const getEntityTypeBadgeColor = (type: string) => {
    const colors: Record<string, string> = {
      user: "bg-blue-100 text-blue-700",
      feedback: "bg-purple-100 text-purple-700",
      publication: "bg-green-100 text-green-700",
      listing: "bg-orange-100 text-orange-700",
      news: "bg-red-100 text-red-700",
      building: "bg-slate-100 text-slate-700",
      property_claim: "bg-yellow-100 text-yellow-700",
    };
    return colors[type] ?? "bg-gray-100 text-gray-700";
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Системные логи"
        description="Журнал действий администраторов и изменений в системе"
      />

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="min-w-[200px] flex-1">
          <div className="relative">
            <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Поиск по описанию..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9"
            />
          </div>
        </div>

        <Select
          value={entityType ?? "all"}
          onValueChange={(v) => {
            setEntityType(v === "all" ? undefined : v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[200px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Тип сущности" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все типы</SelectItem>
            {filterOptions?.entityTypes.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline" size="icon" onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="audit">
        <TabsList>
          <TabsTrigger value="audit" className="gap-2">
            <Globe className="h-4 w-4" />
            Общие логи
          </TabsTrigger>
          <TabsTrigger value="feedback" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Обратная связь
          </TabsTrigger>
          <TabsTrigger value="publications" className="gap-2">
            <FileText className="h-4 w-4" />
            Публикации
          </TabsTrigger>
        </TabsList>

        {/* Audit Logs Tab */}
        <TabsContent value="audit" className="space-y-4">
          {auditLoading ? (
            <Card>
              <CardContent className="py-6">
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex gap-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : auditData?.items.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <ScrollText className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                <p className="text-muted-foreground">Логи пока отсутствуют</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardContent className="divide-y p-0">
                  {auditData?.items.map((log) => (
                    <div key={log.id} className="hover:bg-muted/50 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge className={getEntityTypeBadgeColor(log.entityType)}>
                              {log.entityTypeLabel}
                            </Badge>
                            <span className="text-sm font-medium">{log.actionLabel}</span>
                          </div>
                          <p className="text-muted-foreground text-sm">{log.description}</p>
                          <div className="text-muted-foreground flex items-center gap-4 text-xs">
                            {log.actor && (
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {log.actor.name ?? log.actor.email}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {format(new Date(log.createdAt), "dd MMM yyyy, HH:mm", {
                                locale: ru,
                              })}
                            </span>
                            {log.ipAddress && (
                              <span className="font-mono text-[10px]">{log.ipAddress}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Pagination */}
              {auditData && auditData.totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground text-sm">
                    Страница {page} из {auditData.totalPages} (всего {auditData.total})
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= auditData.totalPages}
                      onClick={() => setPage(page + 1)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </TabsContent>

        {/* Feedback History Tab */}
        <TabsContent value="feedback" className="space-y-4">
          {feedbackLoading ? (
            <Card>
              <CardContent className="py-6">
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex gap-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : feedbackData?.items.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <MessageSquare className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                <p className="text-muted-foreground">История обращений пока пуста</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardContent className="divide-y p-0">
                  {feedbackData?.items.map((log) => (
                    <div key={log.id} className="hover:bg-muted/50 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge className="bg-purple-100 text-purple-700">Обращение</Badge>
                            <span className="text-sm font-medium">{log.actionLabel}</span>
                          </div>
                          <p className="text-muted-foreground text-sm">
                            {log.description}
                            {log.feedback?.title && (
                              <span className="text-foreground ml-1">— {log.feedback.title}</span>
                            )}
                          </p>
                          <div className="text-muted-foreground flex items-center gap-4 text-xs">
                            {log.changedBy && (
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {log.changedBy.name}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {format(new Date(log.createdAt), "dd MMM yyyy, HH:mm", {
                                locale: ru,
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Pagination */}
              {feedbackData && feedbackData.totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground text-sm">
                    Страница {feedbackPage} из {feedbackData.totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={feedbackPage === 1}
                      onClick={() => setFeedbackPage(feedbackPage - 1)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={feedbackPage >= feedbackData.totalPages}
                      onClick={() => setFeedbackPage(feedbackPage + 1)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </TabsContent>

        {/* Publications History Tab */}
        <TabsContent value="publications" className="space-y-4">
          {publicationLoading ? (
            <Card>
              <CardContent className="py-6">
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex gap-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : publicationData?.items.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                <p className="text-muted-foreground">История публикаций пока пуста</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardContent className="divide-y p-0">
                  {publicationData?.items.map((log) => (
                    <div key={log.id} className="hover:bg-muted/50 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge className="bg-green-100 text-green-700">Публикация</Badge>
                            <span className="text-sm font-medium">{log.actionLabel}</span>
                          </div>
                          <p className="text-muted-foreground text-sm">
                            {log.description}
                            {log.publication?.title && (
                              <span className="text-foreground ml-1">
                                — {log.publication.title}
                              </span>
                            )}
                          </p>
                          {log.moderationComment && (
                            <p className="text-muted-foreground bg-muted/50 rounded p-2 text-sm italic">
                              &quot;{log.moderationComment}&quot;
                            </p>
                          )}
                          <div className="text-muted-foreground flex items-center gap-4 text-xs">
                            {log.changedBy && (
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {log.changedBy.name}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {format(new Date(log.createdAt), "dd MMM yyyy, HH:mm", {
                                locale: ru,
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Pagination */}
              {publicationData && publicationData.totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground text-sm">
                    Страница {publicationPage} из {publicationData.totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={publicationPage === 1}
                      onClick={() => setPublicationPage(publicationPage - 1)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={publicationPage >= publicationData.totalPages}
                      onClick={() => setPublicationPage(publicationPage + 1)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
