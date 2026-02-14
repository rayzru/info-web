"use client";

import { useState } from "react";

import {
  AlertTriangle,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  EyeOff,
  FileText,
  Loader2,
  MapPin,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  Tag,
  Tags,
  Trash2,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { type TagTreeNode, TagTreePicker } from "~/components/admin/directory/tag-tree-picker";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

const TYPE_LABELS: Record<string, string> = {
  contact: "Контакт",
  organization: "Организация",
  location: "Локация",
  document: "Документ",
};

export default function AdminDirectoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const tab = searchParams.get("tab") ?? "dashboard";
  const pageParam = searchParams.get("page");
  const page = pageParam ? parseInt(pageParam, 10) : 1;
  const typeFilter = searchParams.get("type") ?? "all";
  const searchQuery = searchParams.get("q") ?? "";
  const tagFilter = searchParams.get("tags")?.split(",").filter(Boolean) ?? [];
  const problemFilter = searchParams.get("problem") ?? "all";

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<{ id: string; title: string } | null>(null);
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [selectedEntries, setSelectedEntries] = useState<Set<string>>(new Set());
  const [bulkTagDialogOpen, setBulkTagDialogOpen] = useState(false);
  const [bulkTagIds, setBulkTagIds] = useState<string[]>([]);

  // Queries
  const {
    data: entriesData,
    isLoading: entriesLoading,
    refetch: refetchEntries,
  } = api.directory.admin.listWithStats.useQuery({
    page,
    limit: 20,
    type:
      typeFilter !== "all"
        ? (typeFilter as "contact" | "organization" | "location" | "document")
        : undefined,
    search: searchQuery || undefined,
    tagIds: tagFilter.length > 0 ? tagFilter : undefined,
    hasProblems:
      problemFilter !== "all" ? (problemFilter as "noTags" | "noContacts" | "inactive") : undefined,
  });

  const { data: tagTree } = api.directory.admin.getTagTree.useQuery();

  const { data: dashboardStats, isLoading: dashboardLoading } =
    api.directory.admin.getDashboardStats.useQuery(undefined, {
      enabled: tab === "dashboard",
    });

  // Mutations
  const deleteMutation = api.directory.admin.delete.useMutation({
    onSuccess: () => {
      toast({ title: "Запись удалена" });
      setDeleteDialogOpen(false);
      setEntryToDelete(null);
      void refetchEntries();
    },
    onError: (error) => {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    },
  });

  const bulkUpdateTagsMutation = api.directory.admin.bulkUpdateTags.useMutation({
    onSuccess: (result) => {
      toast({ title: `Теги обновлены для ${result.affected} записей` });
      setBulkTagDialogOpen(false);
      setBulkTagIds([]);
      setSelectedEntries(new Set());
      void refetchEntries();
    },
    onError: (error) => {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    },
  });

  const bulkDeleteMutation = api.directory.admin.bulkDelete.useMutation({
    onSuccess: (result) => {
      toast({ title: `Удалено ${result.affected} записей` });
      setSelectedEntries(new Set());
      void refetchEntries();
    },
    onError: (error) => {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    },
  });

  // URL manipulation helpers
  const setTab = (newTab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", newTab);
    params.delete("page");
    router.push(`/admin/directory?${params.toString()}`);
  };

  const setFilter = (type: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (type === "all") {
      params.delete("type");
    } else {
      params.set("type", type);
    }
    params.delete("page");
    router.push(`/admin/directory?${params.toString()}`);
  };

  const setTagFilter = (tagIds: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tagIds.length === 0) {
      params.delete("tags");
    } else {
      params.set("tags", tagIds.join(","));
    }
    params.delete("page");
    router.push(`/admin/directory?${params.toString()}`);
  };

  const setProblemFilter = (problem: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (problem === "all") {
      params.delete("problem");
    } else {
      params.set("problem", problem);
    }
    params.delete("page");
    router.push(`/admin/directory?${params.toString()}`);
  };

  const setPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newPage === 1) {
      params.delete("page");
    } else {
      params.set("page", newPage.toString());
    }
    router.push(`/admin/directory?${params.toString()}`);
  };

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (localSearch) {
      params.set("q", localSearch);
    } else {
      params.delete("q");
    }
    params.delete("page");
    router.push(`/admin/directory?${params.toString()}`);
  };

  const clearFilters = () => {
    setLocalSearch("");
    router.push("/admin/directory?tab=entries");
  };

  const openDeleteDialog = (entry: { id: string; title: string }) => {
    setEntryToDelete(entry);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (entryToDelete) {
      deleteMutation.mutate({ id: entryToDelete.id });
    }
  };

  const toggleEntrySelection = (entryId: string) => {
    const newSelected = new Set(selectedEntries);
    if (newSelected.has(entryId)) {
      newSelected.delete(entryId);
    } else {
      newSelected.add(entryId);
    }
    setSelectedEntries(newSelected);
  };

  const toggleSelectAll = () => {
    if (!entriesData?.entries) return;
    if (selectedEntries.size === entriesData.entries.length) {
      setSelectedEntries(new Set());
    } else {
      setSelectedEntries(new Set(entriesData.entries.map((e) => e.id)));
    }
  };

  const hasActiveFilters =
    typeFilter !== "all" || searchQuery || tagFilter.length > 0 || problemFilter !== "all";

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Справочная</h1>
            <p className="text-muted-foreground mt-1">
              Управление записями и категориями справочника
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
            <Link href="/admin/directory/tags" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full">
                <Tags className="mr-2 h-4 w-4" />
                Категории
              </Button>
            </Link>
            <Link href="/admin/directory/new" className="w-full sm:w-auto">
              <Button className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Добавить запись
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="dashboard">Обзор</TabsTrigger>
          <TabsTrigger value="entries">Записи</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="mt-4 space-y-6">
          {dashboardLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : dashboardStats ? (
            <>
              {/* Stats Overview */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card
                  className="hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => setTab("entries")}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Всего записей</CardTitle>
                    <FileText className="text-muted-foreground h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardStats.totals.entries}</div>
                    <p className="text-muted-foreground text-xs">
                      Активных: {dashboardStats.totals.activeEntries}
                    </p>
                  </CardContent>
                </Card>

                <Link href="/admin/directory/tags" className="block">
                  <Card className="hover:bg-muted/50 cursor-pointer transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Категорий</CardTitle>
                      <Tag className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{dashboardStats.totals.tags}</div>
                      <p className="text-muted-foreground text-xs">
                        Корневых: {dashboardStats.totals.rootTags}
                      </p>
                    </CardContent>
                  </Card>
                </Link>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Контактов</CardTitle>
                    <Phone className="text-muted-foreground h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardStats.totals.contacts}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Требуют внимания</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">
                      {dashboardStats.problems.noTags + dashboardStats.problems.noContacts}
                    </div>
                    <p className="text-muted-foreground text-xs">
                      Без категорий: {dashboardStats.problems.noTags}, без контактов:{" "}
                      {dashboardStats.problems.noContacts}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Problem Access */}
              {(dashboardStats.problems.noTags > 0 || dashboardStats.problems.noContacts > 0) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      Быстрый доступ к проблемам
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-3">
                    {dashboardStats.problems.noTags > 0 && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          const params = new URLSearchParams();
                          params.set("tab", "entries");
                          params.set("problem", "noTags");
                          router.push(`/admin/directory?${params.toString()}`);
                        }}
                      >
                        <Tag className="mr-2 h-4 w-4" />
                        Записи без категорий ({dashboardStats.problems.noTags})
                      </Button>
                    )}
                    {dashboardStats.problems.noContacts > 0 && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          const params = new URLSearchParams();
                          params.set("tab", "entries");
                          params.set("problem", "noContacts");
                          router.push(`/admin/directory?${params.toString()}`);
                        }}
                      >
                        <Phone className="mr-2 h-4 w-4" />
                        Записи без контактов ({dashboardStats.problems.noContacts})
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}

              <div className="grid gap-6 md:grid-cols-2">
                {/* Popular Entries */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Популярные записи
                    </CardTitle>
                    <CardDescription>По количеству просмотров</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {dashboardStats.popularEntries.length > 0 ? (
                      <div className="space-y-3">
                        {dashboardStats.popularEntries.map((entry, index) => (
                          <div key={entry.id} className="flex items-center gap-3">
                            <span className="text-muted-foreground w-5 text-sm">{index + 1}.</span>
                            <div className="min-w-0 flex-1">
                              <Link
                                href={`/admin/directory/${entry.id}`}
                                className="block truncate text-sm font-medium hover:underline"
                              >
                                {entry.title}
                              </Link>
                            </div>
                            <div className="text-muted-foreground flex shrink-0 items-center gap-1 text-xs">
                              <Eye className="h-3 w-3" />
                              {entry.viewCount}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">Нет данных</p>
                    )}
                  </CardContent>
                </Card>

                {/* Popular Tags */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Популярные категории
                    </CardTitle>
                    <CardDescription>По количеству переходов</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {dashboardStats.popularTags.length > 0 ? (
                      <div className="space-y-3">
                        {dashboardStats.popularTags.map((tag, index) => (
                          <div key={tag.id} className="flex items-center gap-3">
                            <span className="text-muted-foreground w-5 text-sm">{index + 1}.</span>
                            <div className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-medium">{tag.name}</span>
                            </div>
                            <div className="text-muted-foreground flex shrink-0 items-center gap-1 text-xs">
                              <TrendingUp className="h-3 w-3" />
                              {tag.clickCount}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">Нет данных</p>
                    )}
                  </CardContent>
                </Card>

                {/* Top Searches */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="h-5 w-5" />
                      Популярные поисковые запросы
                    </CardTitle>
                    <CardDescription>Что ищут пользователи</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {dashboardStats.topSearches.length > 0 ? (
                      <div className="space-y-3">
                        {dashboardStats.topSearches.map((search, index) => (
                          <div key={search.query} className="flex items-center gap-3">
                            <span className="text-muted-foreground w-5 text-sm">{index + 1}.</span>
                            <div className="min-w-0 flex-1">
                              <span className="block truncate text-sm">
                                &quot;{search.query}&quot;
                              </span>
                            </div>
                            <span className="text-muted-foreground shrink-0 text-xs">
                              {search.count} раз
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">Нет данных</p>
                    )}
                  </CardContent>
                </Card>

                {/* Entries by Type */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Записи по типам
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {dashboardStats.entriesByType.map((item) => {
                        const icons: Record<string, React.ReactNode> = {
                          contact: <Users className="h-4 w-4" />,
                          organization: <FileText className="h-4 w-4" />,
                          location: <MapPin className="h-4 w-4" />,
                          document: <FileText className="h-4 w-4" />,
                        };
                        return (
                          <div key={item.type} className="flex items-center gap-3">
                            <span className="text-muted-foreground">{icons[item.type]}</span>
                            <span className="flex-1 text-sm">{TYPE_LABELS[item.type]}</span>
                            <Badge variant="secondary">{item.count}</Badge>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Entries */}
              <Card>
                <CardHeader>
                  <CardTitle>Последние добавленные</CardTitle>
                </CardHeader>
                <CardContent>
                  {dashboardStats.recentEntries.length > 0 ? (
                    <div className="space-y-2">
                      {dashboardStats.recentEntries.map((entry) => (
                        <div
                          key={entry.id}
                          className="flex items-center gap-3 border-b py-2 last:border-0"
                        >
                          <div className="min-w-0 flex-1">
                            <Link
                              href={`/admin/directory/${entry.id}`}
                              className="text-sm font-medium hover:underline"
                            >
                              {entry.title}
                            </Link>
                            <p className="text-muted-foreground text-xs">
                              {TYPE_LABELS[entry.type]} •{" "}
                              {new Date(entry.createdAt).toLocaleDateString("ru-RU")}
                            </p>
                          </div>
                          <Link href={`/admin/directory/${entry.id}`}>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">Нет записей</p>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="text-muted-foreground py-12 text-center">
                Не удалось загрузить статистику
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="entries" className="mt-4 space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[200px] max-w-md flex-1">
              <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Поиск..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10"
              />
            </div>

            <Select value={typeFilter} onValueChange={setFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Тип" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все типы</SelectItem>
                <SelectItem value="contact">Контакты</SelectItem>
                <SelectItem value="organization">Организации</SelectItem>
                <SelectItem value="location">Локации</SelectItem>
                <SelectItem value="document">Документы</SelectItem>
              </SelectContent>
            </Select>

            {tagTree && (
              <TagTreePicker
                tags={tagTree as TagTreeNode[]}
                selected={tagFilter}
                onChange={setTagFilter}
                placeholder="Категории"
                showCounts
                className="w-[180px]"
              />
            )}

            <Select value={problemFilter} onValueChange={setProblemFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Проблемы" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все записи</SelectItem>
                <SelectItem value="noTags">
                  <span className="flex items-center gap-2">
                    <AlertTriangle className="h-3 w-3 text-yellow-500" />
                    Без категорий
                  </span>
                </SelectItem>
                <SelectItem value="noContacts">
                  <span className="flex items-center gap-2">
                    <AlertTriangle className="h-3 w-3 text-orange-500" />
                    Без контактов
                  </span>
                </SelectItem>
                <SelectItem value="inactive">
                  <span className="flex items-center gap-2">
                    <EyeOff className="h-3 w-3 text-gray-500" />
                    Неактивные
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="mr-1 h-3 w-3" />
                Сбросить
              </Button>
            )}
          </div>

          {/* Bulk Actions Bar */}
          {selectedEntries.size > 0 && (
            <div className="bg-muted flex items-center gap-3 rounded-lg p-3">
              <span className="text-sm font-medium">Выбрано: {selectedEntries.size}</span>
              <div className="flex-1" />
              <Button variant="outline" size="sm" onClick={() => setBulkTagDialogOpen(true)}>
                <Tags className="mr-2 h-4 w-4" />
                Назначить категории
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive"
                onClick={() => {
                  if (confirm(`Удалить ${selectedEntries.size} записей?`)) {
                    bulkDeleteMutation.mutate({ entryIds: Array.from(selectedEntries) });
                  }
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Удалить
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setSelectedEntries(new Set())}>
                Отменить
              </Button>
            </div>
          )}

          {/* Entries List */}
          {entriesLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : entriesData?.entries && entriesData.entries.length > 0 ? (
            <div className="space-y-3">
              {/* Select All */}
              <div className="flex items-center gap-2 px-4">
                <Checkbox
                  checked={
                    selectedEntries.size === entriesData.entries.length &&
                    entriesData.entries.length > 0
                  }
                  onCheckedChange={toggleSelectAll}
                />
                <span className="text-muted-foreground text-sm">
                  Выбрать все ({entriesData.total})
                </span>
              </div>

              {entriesData.entries.map((entry) => (
                <Card key={entry.id} className={entry.isActive === 0 ? "opacity-60" : ""}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Checkbox
                        checked={selectedEntries.has(entry.id)}
                        onCheckedChange={() => toggleEntrySelection(entry.id)}
                        className="mt-1"
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Link
                            href={`/admin/directory/${entry.id}`}
                            className="font-medium hover:underline"
                          >
                            {entry.title}
                          </Link>
                          <Badge variant="outline">{TYPE_LABELS[entry.type]}</Badge>

                          {/* Problem indicators */}
                          {entry.problems.noTags && (
                            <Badge
                              variant="secondary"
                              className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                            >
                              <AlertTriangle className="mr-1 h-3 w-3" />
                              Нет категорий
                            </Badge>
                          )}
                          {entry.problems.noContacts && (
                            <Badge
                              variant="secondary"
                              className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                            >
                              <AlertTriangle className="mr-1 h-3 w-3" />
                              Нет контактов
                            </Badge>
                          )}
                          {entry.problems.inactive && (
                            <Badge
                              variant="secondary"
                              className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                            >
                              <EyeOff className="mr-1 h-3 w-3" />
                              Неактивна
                            </Badge>
                          )}
                        </div>

                        {entry.description && (
                          <p className="text-muted-foreground mt-1 line-clamp-1 text-sm">
                            {entry.description}
                          </p>
                        )}

                        <div className="text-muted-foreground mt-2 flex flex-wrap items-center gap-4 text-xs">
                          <span>/{entry.slug}</span>
                          {entry.contacts && entry.contacts.length > 0 && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {entry.contacts.length}
                            </span>
                          )}
                          {entry.tags && entry.tags.length > 0 && (
                            <span className="flex items-center gap-1">
                              <Tag className="h-3 w-3" />
                              {entry.tags.map((t) => t.name).join(", ")}
                            </span>
                          )}
                          {entry.stats && (
                            <span className="flex items-center gap-2">
                              <Eye className="h-3 w-3" />
                              {entry.stats.viewCount}
                              {entry.stats.callCount > 0 && (
                                <>
                                  <Phone className="ml-2 h-3 w-3" />
                                  {entry.stats.callCount}
                                </>
                              )}
                            </span>
                          )}
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/directory/${entry.id}`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Редактировать
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/info/${entry.slug}`} target="_blank">
                              <Eye className="mr-2 h-4 w-4" />
                              Открыть на сайте
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => openDeleteDialog({ id: entry.id, title: entry.title })}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Удалить
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Pagination */}
              {entriesData.totalPages > 1 && (
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
                    {page} из {entriesData.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={page === entriesData.totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="text-muted-foreground py-12 text-center">
                {hasActiveFilters ? "Ничего не найдено" : "Записей пока нет"}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить запись?</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить &quot;{entryToDelete?.title}&quot;? Это действие нельзя
              отменить.
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

      {/* Bulk Tag Assignment Dialog */}
      <Dialog open={bulkTagDialogOpen} onOpenChange={setBulkTagDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Назначить категории</DialogTitle>
            <DialogDescription>
              Выберите категории для назначения {selectedEntries.size} записям
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {tagTree && (
              <TagTreePicker
                tags={tagTree as TagTreeNode[]}
                selected={bulkTagIds}
                onChange={setBulkTagIds}
                placeholder="Выберите категории..."
                showCounts
              />
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkTagDialogOpen(false)}>
              Отмена
            </Button>
            <Button
              onClick={() => {
                bulkUpdateTagsMutation.mutate({
                  entryIds: Array.from(selectedEntries),
                  addTagIds: bulkTagIds,
                });
              }}
              disabled={bulkUpdateTagsMutation.isPending || bulkTagIds.length === 0}
            >
              {bulkUpdateTagsMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Назначить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
